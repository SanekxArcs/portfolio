"""Compose an original electronic score, sound-design the edit, and mix the VO.

No downloaded music or sound-effect samples. All synthesis is deterministic.
Requires numpy, ffmpeg, and the voice files produced by generate-voice.py.
"""
import json
import argparse
import subprocess
import wave
from pathlib import Path
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser()
parser.add_argument('--locale', choices=['en','pl'], default='en')
LOCALE = parser.parse_args().locale
EDIT = json.loads((ROOT / 'src' / ('timing-pl.json' if LOCALE == 'pl' else 'timing.json')).read_text(encoding='utf-8'))
SR = 44100
LENGTH = EDIT['durationInFrames'] / EDIT['fps']
N = round(LENGTH * SR)
TEMP = ROOT / 'out' / 'audio' / ('pl' if LOCALE == 'pl' else '')
OUT = ROOT / 'public' / 'audio' / ('pl' if LOCALE == 'pl' else '')
TEMP.mkdir(parents=True, exist_ok=True)
OUT.mkdir(parents=True, exist_ok=True)
RNG = np.random.default_rng(20261020)
music = np.zeros((N, 2), dtype=np.float64)
sfx = np.zeros_like(music)
voice = np.zeros_like(music)

def time(length):
    return np.arange(round(length * SR)) / SR

def hz(note):
    return 440 * 2 ** ((note - 69) / 12)

def add(bus, signal, at, gain=1, pan=0):
    offset = round(at * SR)
    if offset < 0:
        signal = signal[-offset:]
        offset = 0
    count = min(len(signal), N - offset)
    if count <= 0:
        return
    signal = signal[:count]
    if signal.ndim == 1:
        angle = (pan + 1) * np.pi / 4
        signal = np.stack([signal * np.cos(angle), signal * np.sin(angle)], axis=1)
    bus[offset:offset+count] += signal * gain

def note(pitch, length, kind='pluck'):
    t = time(length)
    frequency = hz(pitch)
    if kind == 'pad':
        tone = sum(np.sin(2*np.pi*frequency*(1+detune)*t+phase) for detune, phase in [(-0.003, 0), (0.003, .7), (0, 1.2)]) / 3
        tone += .16*np.sin(4*np.pi*frequency*t)
        env = np.minimum(t/.5, 1) * np.minimum((length-t)/.8, 1)
    elif kind == 'bass':
        tone = np.sin(2*np.pi*frequency*t) + .2*np.sin(4*np.pi*frequency*t)
        env = np.minimum(t/.007, 1)*np.exp(-t*3.5)*np.minimum((length-t)/.04, 1)
    else:
        tone = np.sin(2*np.pi*frequency*t + 1.1*np.sin(2*np.pi*frequency*2*t)*np.exp(-t*12))
        env = np.minimum(t/.005, 1)*np.exp(-t*5)*np.minimum((length-t)/.08, 1)
    return tone * np.clip(env, 0, 1)

def filtered_noise(length, low, high):
    n = round(length*SR)
    raw = RNG.standard_normal(n)
    freqs = np.fft.rfftfreq(n, 1/SR)
    response = 1/(1+(freqs/high)**4) * (1-1/(1+(freqs/max(low,1))**4))
    return np.fft.irfft(np.fft.rfft(raw)*response, n)

beat = 60 / EDIT['bpm']
chords = [([50, 57, 60, 65], 38), ([46, 53, 57, 62], 34), ([48, 53, 57, 64], 41), ([48, 55, 62, 64], 36)]
chord_length = beat * 8
for index, start in enumerate(np.arange(0, LENGTH, chord_length)):
    chord, bass = chords[index % len(chords)]
    for j, pitch in enumerate(chord):
        add(music, note(pitch, chord_length+1, 'pad'), start, .065, (j-1.5)/2)

personal_start = EDIT['scenes'][4]['from'] / EDIT['fps']
closing_start = EDIT['scenes'][5]['from'] / EDIT['fps']
for index, at in enumerate(np.arange(.5, LENGTH-1.6, beat/2)):
    chord, bass = chords[int(at/chord_length) % len(chords)]
    energy = .7 if personal_start <= at < closing_start else 1
    pitch = chord[[0, 2, 1, 3, 2, 1, 3, 2][index % 8]]+12
    add(music, note(pitch, .85), at, .085*energy, -.55 if index%2 else .55)
    add(music, note(pitch, .85), at+beat*.75, .022*energy, .65 if index%2 else -.65)
    if index % 2 == 0:
        add(music, note(bass, .6, 'bass'), at, .22*energy)
    if index % 2 == 0 and at < LENGTH-3:
        t = time(.3)
        frequency = 46+115*np.exp(-t*30)
        kick = np.sin(2*np.pi*np.cumsum(frequency)/SR)*np.exp(-t*16)*np.minimum(t/.002,1)
        add(music, kick, at, .35*energy)
    if index % 4 == 2 and at > 5:
        t = time(.13)
        snap = filtered_noise(.13, 1000, 8500)*np.exp(-t*38)*np.minimum(t/.002,1)
        add(music, snap, at, .16*energy, -.1)
    if at > 2:
        t = time(.055)
        hat = filtered_noise(.055, 6500, 15000)*np.exp(-t*100)*np.minimum(t/.001,1)
        add(music, hat, at+beat/4, .045*energy, .3)

# Designed transitions: stereo air sweep, a low impact, and a glassy confirmation.
for index, scene in enumerate(EDIT['scenes']):
    start = scene['from'] / EDIT['fps']
    if index:
        t = time(.65)
        sweep = filtered_noise(.65, 700, 6500)*np.sin(np.pi*t/.65)**2
        add(sfx, sweep, start-.33, .12, -.35)
        add(sfx, sweep[::-1], start-.2, .07, .35)
        t = time(.5)
        impact = np.sin(2*np.pi*(68*t+16*(1-np.exp(-t*10))))*np.exp(-t*10)
        add(sfx, impact, start+.02, .2)
    for tick in range(3 if index == 3 else 1):
        add(sfx, note(86+tick*3, .24), start+.45+tick*.5, .075, -.4+tick*.4)

# Place the sonic sign-off after the final word, never over the brand or CTA.
closing = EDIT['scenes'][5]
sting_start = closing_start + closing['voiceOffset']/EDIT['fps'] + closing['voiceSeconds'] + .28
for j, pitch in enumerate([74, 77, 81]):
    at = sting_start + j*.14
    tail = min(.95, LENGTH-.15-at)
    if tail > .18:
        add(sfx, note(pitch, tail), at, .11, -.3+j*.3)

duck = np.ones(N)*.62
for scene in EDIT['scenes']:
    start = scene['from']/EDIT['fps']+scene['voiceOffset']/EDIT['fps']
    data = subprocess.check_output(['ffmpeg', '-v', 'error', '-i', str(OUT/'voice'/f'{scene["id"]}.mp3'), '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-'])
    spoken = np.frombuffer(data, dtype='<f4').astype(np.float64)
    add(voice, spoken, start)
    a = max(0, round((start-.15)*SR))
    b = min(N, round((start+len(spoken)/SR+.25)*SR))
    local = np.arange(b-a)/SR
    shape = np.minimum(local/.15,1)*np.minimum((b-a)/SR-local,.25)/.25
    duck[a:b] = np.minimum(duck[a:b], .62-.47*np.clip(shape,0,1))

t_all = np.arange(N)/SR
fade = np.clip(t_all/.28,0,1)*np.clip((LENGTH-t_all)/1.1,0,1)
music *= fade[:,None]
sfx *= fade[:,None]
music /= max(1, np.max(np.abs(music))/.65)

def save(path, signal):
    with wave.open(str(path), 'wb') as handle:
        handle.setnchannels(2)
        handle.setsampwidth(2)
        handle.setframerate(SR)
        handle.writeframes((np.clip(signal,-1,1)*32767).astype('<i2').tobytes())

save(TEMP/'music.wav', music)
save(TEMP/'effects.wav', sfx)
save(TEMP/'voice.wav', voice)
effects_duck = np.minimum(1, duck/.62)
mix = voice + music*duck[:,None]*.45 + sfx*effects_duck[:,None]*.7
save(TEMP/'mix.wav', mix)
for stem in ['music','effects']:
    subprocess.run(['ffmpeg','-y','-v','error','-i',str(TEMP/f'{stem}.wav'),'-c:a','aac','-b:a','192k',str(OUT/f'{stem}.m4a')],check=True)
subprocess.run(['ffmpeg','-y','-v','error','-i',str(TEMP/'mix.wav'),'-af','loudnorm=I=-15:TP=-1.5:LRA=9','-ar',str(SR),'-c:a','aac','-b:a','256k',str(OUT/'soundtrack.m4a')],check=True)
report = subprocess.run(['ffmpeg','-hide_banner','-i',str(OUT/'soundtrack.m4a'),'-af','loudnorm=print_format=json','-f','null','-'],capture_output=True,text=True,check=True).stderr
report = json.loads(report[report.rindex('{'):report.rindex('}')+1])
(ROOT/'out'/f'audio-report-{LOCALE}.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({'seconds':LENGTH,'originalMusic':True,'originalSFX':True,'loudness':report},indent=2))
