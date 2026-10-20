"""Generate a neural voice per scene, then create a beat-aligned edit timeline."""
import asyncio
import argparse
import hashlib
import json
import math
import subprocess
from pathlib import Path
import edge_tts

ROOT = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser()
parser.add_argument('--locale', choices=['en','pl'], default='en')
parser.add_argument('--force', action='store_true')
parser.add_argument('--only', help='Comma-separated scene IDs to regenerate')
parser.add_argument('--keep-edit', action='store_true', help='Keep existing scene boundaries; fail if speech does not fit')
ARGS = parser.parse_args()
LOCALE = ARGS.locale
CONFIG = json.loads((ROOT / ('film-pl.json' if LOCALE == 'pl' else 'film.json')).read_text(encoding='utf-8'))
OUT = ROOT / 'public' / 'audio' / ('pl/voice' if LOCALE == 'pl' else 'voice')
TEMP = ROOT / 'out' / 'audio' / ('pl' if LOCALE == 'pl' else '')
OUT.mkdir(parents=True, exist_ok=True)
TEMP.mkdir(parents=True, exist_ok=True)
CACHE = OUT / 'generation.json'
generation = json.loads(CACHE.read_text(encoding='utf-8')) if CACHE.exists() else {}
TIMING = ROOT / 'src' / ('timing-pl.json' if LOCALE == 'pl' else 'timing.json')
previous_edit = json.loads(TIMING.read_text(encoding='utf-8')) if TIMING.exists() else None

def duration(path):
    return float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'default=nw=1:nk=1', str(path)], text=True).strip())

def timestamp(seconds):
    ms = round(seconds * 1000)
    return f'{ms // 3600000:02}:{ms // 60000 % 60:02}:{ms // 1000 % 60:02},{ms % 1000:03}'

async def main():
    scenes = []
    start = 0
    captions = []
    for index, scene in enumerate(CONFIG['scenes']):
        dest = OUT / f'{scene["id"]}.mp3'
        parts = scene.get('speechParts', [{'text':scene['voiceover']}])
        spec = {'voice':CONFIG['voice'], 'rate':CONFIG['rate'], 'pitch':'-2Hz', 'parts':parts}
        fingerprint = hashlib.sha256(json.dumps(spec,sort_keys=True,ensure_ascii=False).encode()).hexdigest()
        selected = ARGS.only is None or scene['id'] in ARGS.only.split(',')
        changed = scene['id'] in generation and generation[scene['id']]['fingerprint'] != fingerprint
        if selected and (not dest.exists() or ARGS.force or changed):
            chunk_paths = []
            chunk_report = []
            for part_index, part in enumerate(parts):
                raw = TEMP / f'{scene["id"]}-{part_index}-raw.mp3'
                boundary = TEMP / f'{scene["id"]}-{part_index}-words.jsonl'
                chunk = TEMP / f'{scene["id"]}-{part_index}.wav'
                last_error = None
                for attempt in range(3):
                    try:
                        await edge_tts.Communicate(part['text'], CONFIG['voice'], rate=part.get('rate',CONFIG['rate']), pitch='-2Hz').save(str(raw),str(boundary))
                        if duration(raw) < len(part['text'].split()) * 0.19:
                            raise RuntimeError('Voice response was too short')
                        break
                    except Exception as error:
                        last_error = error
                        if attempt == 2:
                            raise RuntimeError(f'Voice generation failed: {last_error}') from error
                # Keep consonant tails and add intentional space between the recorded phrases.
                chain = 'silenceremove=start_periods=1:start_threshold=-55dB:start_silence=0.06,areverse,silenceremove=start_periods=1:start_threshold=-55dB:start_silence=0.14,areverse'
                if part.get('pauseAfter',0):
                    chain += f',apad=pad_dur={part["pauseAfter"]}'
                subprocess.run(['ffmpeg','-y','-v','error','-i',str(raw),'-af',chain,'-ar','44100','-ac','1',str(chunk)],check=True)
                chunk_paths.append(chunk)
                chunk_report.append({'text':part['text'],'rate':part.get('rate',CONFIG['rate']),'seconds':round(duration(chunk),3),'pauseAfter':part.get('pauseAfter',0)})
            # Concat paths are generated inside this project's output directory.
            listing = TEMP / f'{scene["id"]}-parts.txt'
            listing.write_text(''.join(f"file '{path.as_posix()}'\n" for path in chunk_paths),encoding='utf-8')
            subprocess.run(['ffmpeg','-y','-v','error','-f','concat','-safe','0','-i',str(listing),'-af',
                'highpass=f=75,equalizer=f=2600:t=q:w=0.8:g=1.5,loudnorm=I=-16:TP=-2:LRA=10',
                '-ar','44100','-ac','1','-b:a','192k',str(dest)],check=True)
            generation[scene['id']] = {'fingerprint':fingerprint,'voice':CONFIG['voice'],'parts':chunk_report}
            CACHE.write_text(json.dumps(generation,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
        if not dest.exists():
            raise RuntimeError(f'Missing voice file: {dest}')
        if scene['id'] not in generation:
            generation[scene['id']] = {'fingerprint':fingerprint,'voice':CONFIG['voice'],'source':'existing voice file'}
        seconds = duration(dest)
        length = max(scene['minimumSeconds'], math.ceil((seconds + 1.05) * 2) / 2)
        frames = round(length * CONFIG['fps'])
        if ARGS.keep_edit:
            if previous_edit is None:
                raise RuntimeError('--keep-edit needs an existing src/timing.json')
            previous = previous_edit['scenes'][index]
            frames = previous['duration']
            length = frames / CONFIG['fps']
            if seconds + 0.4 + 0.3 > length:
                raise RuntimeError(f'{scene["id"]}: speech ({seconds:.2f}s) will not fit the unchanged {length:.1f}s shot')
        scenes.append({**scene, 'from': start, 'duration': frames, 'voiceSeconds': round(seconds, 3), 'voiceOffset': 12})
        caption_start = start / CONFIG['fps'] + 0.4
        captions.append(f'{index+1}\n{timestamp(caption_start)} --> {timestamp(caption_start+seconds)}\n{scene["voiceover"]}\n')
        print(f'{scene["id"]}: voice {seconds:.2f}s, scene {length:.1f}s', flush=True)
        start += frames
    timing = {'fps': CONFIG['fps'], 'durationInFrames': start, 'bpm': CONFIG['bpm'], 'voice': CONFIG['voice'], 'scenes': scenes}
    TIMING.write_text(json.dumps(timing, indent=2,ensure_ascii=False) + '\n', encoding='utf-8')
    CACHE.write_text(json.dumps(generation,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
    (ROOT / 'out' / f'od-empower-{LOCALE}.srt').write_text('\n'.join(captions), encoding='utf-8')
    print(f'Total film: {start / CONFIG["fps"]:.1f}s', flush=True)

asyncio.run(main())
