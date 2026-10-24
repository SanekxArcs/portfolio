"""Compose and mix the film's original score from scratch.

No samples, loops or downloaded sounds: every instrument is synthesised here,
and every hit is placed from src/edit.json so music and picture share one grid.
Requires numpy and ffmpeg.
"""
import json
import subprocess
import wave
from pathlib import Path
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
EDIT = json.loads((ROOT / 'src' / 'edit.json').read_text(encoding='utf-8'))
SR = 44100
FPS = EDIT['fps']
BEAT = EDIT['beatFrames'] / FPS
LENGTH = EDIT['durationInFrames'] / FPS
N = round(LENGTH * SR)
TEMP = ROOT / 'out' / 'audio'
OUT = ROOT / 'public' / 'audio'
TEMP.mkdir(parents=True, exist_ok=True)
OUT.mkdir(parents=True, exist_ok=True)
RNG = np.random.default_rng(20261024)

drums = np.zeros((N, 2))
tonal = np.zeros((N, 2))  # ducked by the kick
fx = np.zeros((N, 2))
send = np.zeros((N, 2))   # reverb send


def beat_of(section_id):
    section = next(s for s in EDIT['sections'] if s['id'] == section_id)
    return section['from'] / EDIT['beatFrames'], section['beats']


def secs(beat):
    return beat * BEAT


def time(length):
    return np.arange(round(length * SR)) / SR


def hz(note):
    return 440 * 2 ** ((note - 69) / 12)


def add(bus, signal, at, gain=1.0, pan=0.0):
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
    bus[offset:offset + count] += signal * gain


def band(signal, low=0.0, high=None, order=2):
    """Static filter in the frequency domain; fine for one-shot sounds."""
    n = len(signal)
    freqs = np.fft.rfftfreq(n, 1 / SR)
    response = np.ones_like(freqs)
    if high:
        response /= np.sqrt(1 + (freqs / high) ** (2 * order))
    if low:
        response *= 1 - 1 / np.sqrt(1 + (freqs / low) ** (2 * order))
    return np.fft.irfft(np.fft.rfft(signal) * response, n)


def sweep_lowpass(signal, start, end):
    """One-pole low-pass whose cutoff glides exponentially from start to end."""
    cut = start * (end / start) ** np.linspace(0, 1, len(signal))
    alpha = 1 - np.exp(-2 * np.pi * cut / SR)
    out = np.empty_like(signal)
    y = 0.0
    for i, (x, a) in enumerate(zip(signal, alpha)):
        y += a * (x - y)
        out[i] = y
    return out


def noise(length):
    return RNG.standard_normal(round(length * SR))


def saw(freq, t, phase=0.0):
    return 2 * ((freq * t + phase) % 1) - 1


def supersaw(pitch, length, spread=1.0):
    t = time(length)
    voices = [-18, -11, -5, 0, 5, 11, 18]
    tone = sum(saw(hz(pitch) * 2 ** (c * spread / 1200), t, RNG.random()) for c in voices)
    return tone / len(voices)


# --- instruments -----------------------------------------------------------

def kick(soft=False):
    t = time(0.42)
    freq = 46 + 130 * np.exp(-t * 32)
    body = np.sin(2 * np.pi * np.cumsum(freq) / SR) * np.exp(-t * (11 if soft else 7.5))
    click = band(noise(0.42), 1800, 9000) * np.exp(-t * 400) * 0.35
    return np.tanh((body + click) * (1.4 if soft else 2.2)) * np.minimum(t / 0.0015, 1)


def clap():
    t = time(0.35)
    env = np.zeros_like(t)
    for at in (0, 0.009, 0.019):
        local = np.clip(t - at, 0, None)
        env += (t >= at) * np.exp(-local * 140)
    env += (t >= 0.026) * np.exp(-np.clip(t - 0.026, 0, None) * 17) * 0.7
    return band(noise(0.35), 950, 5200) * env


def hat(open_=False):
    length = 0.28 if open_ else 0.06
    t = time(length)
    return band(noise(length), 7500, 16000) * np.exp(-t * (11 if open_ else 75))


def bass_note(pitch, length):
    t = time(length)
    tone = saw(hz(pitch), t) * 0.6 + np.sin(2 * np.pi * hz(pitch) * t)
    env = np.minimum(t / 0.004, 1) * np.exp(-t * 7) * np.minimum((length - t) / 0.01, 1)
    return np.tanh(band(tone, 0, 520 + 900 * 0.5) * 1.6) * env


def stab(chord, length=0.32):
    t = time(length)
    tone = sum(supersaw(p, length) for p in chord) / len(chord)
    env = np.minimum(t / 0.003, 1) * np.exp(-t * 9)
    return band(tone, 160, 4200) * env


def pad(chord, length, bright=1200):
    t = time(length)
    tone = sum(supersaw(p, length, 0.7) for p in chord) / len(chord)
    env = np.minimum(t / 0.35, 1) * np.minimum((length - t) / 0.5, 1)
    return band(tone, 120, bright) * np.clip(env, 0, 1)


def pluck(pitch, length=0.6):
    t = time(length)
    f = hz(pitch)
    tone = np.sin(2 * np.pi * f * t + 1.3 * np.sin(2 * np.pi * f * 2 * t) * np.exp(-t * 14))
    return tone * np.minimum(t / 0.003, 1) * np.exp(-t * 6)


def sub(pitch, length):
    t = time(length)
    env = np.minimum(t / 0.02, 1) * np.minimum((length - t) / 0.3, 1)
    return np.sin(2 * np.pi * hz(pitch) * t) * np.clip(env, 0, 1)


def riser(length):
    t = time(length)
    swell = (t / length) ** 2.2
    air = sweep_lowpass(noise(length), 250, 11000) * swell
    pitch = 180 * (6 ** (t / length))
    whine = np.sin(2 * np.pi * np.cumsum(pitch) / SR) * swell * 0.12
    return air + whine


def impact(size=1.0):
    t = time(2.4)
    freq = 30 + 70 * np.exp(-t * 9)
    boom = np.tanh(2 * np.sin(2 * np.pi * np.cumsum(freq) / SR)) * np.exp(-t * 2.2)
    crash = band(noise(2.4), 3000, 14000) * np.exp(-t * 2.6) * 0.45
    return (boom + crash) * size


def whoosh(length=0.32):
    t = time(length)
    return band(noise(length), 600, 7000) * np.sin(np.pi * t / length) ** 3


def thump():
    t = time(0.3)
    freq = 70 + 120 * np.exp(-t * 25)
    tom = np.sin(2 * np.pi * np.cumsum(freq) / SR) * np.exp(-t * 14)
    tick = band(noise(0.3), 3000, 12000) * np.exp(-t * 250) * 0.5
    return np.tanh((tom + tick) * 1.8)


# i – VI – III – VII in D minor: the classic "driving" loop.
CHORDS = [
    ([62, 65, 69], 38),
    ([62, 65, 70], 34),
    ([60, 65, 69], 41),
    ([60, 64, 67], 36),
]
KICK, CLAP, HAT_C, HAT_O = kick(), clap(), hat(), hat(True)
kick_times = []


def groove(first_beat, beats, lift=False):
    """Full arrangement: four-on-the-floor, rolling bass, offbeat stabs."""
    for b in range(beats):
        beat = first_beat + b
        at = secs(beat)
        chord, root = CHORDS[int((beat - first_beat) // 4) % 4]
        add(drums, KICK, at, 0.95)
        kick_times.append(at)
        if b % 2 == 1:
            add(drums, CLAP, at, 0.42, 0.05)
            add(send, CLAP, at, 0.18)
        add(drums, HAT_O, at + BEAT / 2, 0.16, 0.25)
        for s in (1, 3):
            add(drums, HAT_C, at + BEAT * s / 4, 0.11, -0.3)
        # Rolling bass on the three sixteenths after each kick.
        for s in (1, 2, 3):
            add(tonal, bass_note(root + (12 if s == 2 else 0), BEAT / 4 * 0.95), at + BEAT * s / 4, 0.42)
        add(tonal, stab(chord), at + BEAT / 2, 0.22, -0.15 if b % 2 else 0.15)
        add(send, stab(chord), at + BEAT / 2, 0.08)
        if lift:
            for s in range(4):
                pitch = chord[(b * 4 + s) % 3] + 12
                add(tonal, pluck(pitch, 0.25), at + BEAT * s / 4, 0.08, -0.5 + s / 3)


def roll(end_beat, beats):
    """Snare roll that tightens from eighths to thirty-seconds into a drop."""
    start = end_beat - beats
    t = start
    while t < end_beat - 0.13:
        progress = (t - start) / beats
        step = 0.5 if progress < 0.5 else 0.25 if progress < 0.8 else 0.125
        add(drums, CLAP, secs(t), 0.12 + 0.3 * progress, 0)
        t += step


# --- arrangement ------------------------------------------------------------

hook, _ = beat_of('hook')
drop, _ = beat_of('drop')
breakdown, breakdown_beats = beat_of('breakdown')
finale, _ = beat_of('finale')
cta, _ = beat_of('cta')

# Hook: dark pad, a hit on each word, building into the first drop.
add(tonal, pad(CHORDS[0][0], secs(4) + 0.4, 700), secs(hook), 0.09)
add(tonal, pad(CHORDS[1][0], secs(4), 1400), secs(hook + 4), 0.11)
add(tonal, sub(CHORDS[0][1] + 12, secs(4)), secs(hook), 0.1)
add(tonal, sub(CHORDS[1][1] + 12, secs(4)), secs(hook + 4), 0.1)
for b in (0, 1, 2, 4, 5, 6):
    add(drums, thump(), secs(hook + b), 0.6)
    add(send, thump(), secs(hook + b), 0.15)
add(drums, impact(0.5), secs(hook + 3), 0.35)
for b in (4, 5, 6, 7):
    add(drums, kick(True), secs(hook + b), 0.45)
add(fx, riser(secs(4) - 0.05), secs(hook + 4), 0.45)
roll(drop, 2)

# First drop: logo, two reels and the integrations bar, with lift on the last.
first_drop_beats = int(breakdown - drop)
groove(drop, first_drop_beats - 4)
groove(breakdown - 4, 4, lift=True)
for section_id in ('drop', 'websites', 'apps', 'connected'):
    beat, _ = beat_of(section_id)
    add(fx, impact(1.0 if section_id == 'drop' else 0.45), secs(beat), 0.5 if section_id == 'drop' else 0.28)
    add(fx, whoosh()[::-1], secs(beat) - 0.3, 0.12)
add(fx, impact(0.4), secs(beat_of('connected')[0] + 3), 0.25)

# Breakdown: no kick, plucked arpeggio and pad, then a riser into the last drop.
add(tonal, pad(CHORDS[1][0], secs(4) + 0.3, 1800), secs(breakdown), 0.1)
add(tonal, pad(CHORDS[3][0], secs(4), 2600), secs(breakdown + 4), 0.12)
add(tonal, sub(CHORDS[1][1] + 12, secs(4)), secs(breakdown), 0.12)
add(tonal, sub(CHORDS[3][1] + 12, secs(4)), secs(breakdown + 4), 0.12)
for i in range(breakdown_beats * 2):
    chord = CHORDS[1 if i < breakdown_beats else 3][0]
    pitch = (chord + [p + 12 for p in chord])[[0, 2, 4, 1, 3, 5, 2, 4][i % 8]]
    add(tonal, pluck(pitch), secs(breakdown + i / 2), 0.13, -0.4 if i % 2 else 0.4)
    add(send, pluck(pitch), secs(breakdown + i / 2), 0.08)
add(fx, riser(secs(4)), secs(breakdown + 4), 0.5)
roll(finale, 2)

# Final drop and end card.
groove(finale, int(cta - finale) + 4)
add(fx, impact(1.0), secs(finale), 0.55)
add(fx, impact(0.7), secs(cta), 0.4)
end = cta + 4
add(drums, KICK, secs(end), 1.0)
add(fx, impact(0.8), secs(end), 0.4)
add(tonal, pad(CHORDS[0][0] + [74], LENGTH - secs(end), 2400), secs(end), 0.12)
add(send, stab(CHORDS[0][0] + [74], 0.6), secs(end), 0.35)
add(tonal, sub(38, LENGTH - secs(end)), secs(end), 0.16)

# --- mix ----------------------------------------------------------------------

# Sidechain: everything tonal ducks under each kick, which gives the pump.
duck = np.ones(N)
for at in kick_times:
    a = round(at * SR)
    span = min(N - a, round(BEAT * SR))
    local = np.arange(span) / SR
    shape = 1 - 0.72 * np.exp(-local / 0.085) * np.minimum(local / 0.004 + 0.4, 1)
    duck[a:a + span] = np.minimum(duck[a:a + span], shape)
tonal *= duck[:, None]

# Stutter gate over the strobe recap (finale beat 3): chop into 32nds.
gate_start, gate_end = secs(finale + 3), secs(finale + 4) - 0.02
t_all = np.arange(N) / SR
inside = (t_all >= gate_start) & (t_all < gate_end)
chop = ((t_all - gate_start) / (BEAT / 8)) % 1 < 0.55
gate = np.where(inside & ~chop, 0.08, 1.0)
tonal *= gate[:, None]
drums *= gate[:, None]

# Stereo room: decaying noise impulse, convolved in the frequency domain.
ir_t = time(1.6)
ir = np.stack([RNG.standard_normal(len(ir_t)), RNG.standard_normal(len(ir_t))], axis=1)
ir *= np.exp(-ir_t * 3.6)[:, None]
ir[:, 0] = band(ir[:, 0], 300, 6000)
ir[:, 1] = band(ir[:, 1], 300, 6000)
size = N + len(ir_t)
room = np.stack([
    np.fft.irfft(np.fft.rfft(send[:, c], size) * np.fft.rfft(ir[:, c], size), size)[:N]
    for c in range(2)
], axis=1)
room /= max(1e-9, np.max(np.abs(room))) / 0.25

mix = drums * 0.9 + tonal * 0.85 + fx * 0.8 + room
fade = np.clip(t_all / 0.01, 0, 1) * np.clip((LENGTH - t_all) / 0.6, 0, 1)
mix *= fade[:, None]
mix = np.tanh(mix * 1.1) / np.tanh(1.1)


def save(path, signal):
    with wave.open(str(path), 'wb') as handle:
        handle.setnchannels(2)
        handle.setsampwidth(2)
        handle.setframerate(SR)
        handle.writeframes((np.clip(signal, -1, 1) * 32767).astype('<i2').tobytes())


save(TEMP / 'mix.wav', mix * 0.8)
subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', str(TEMP / 'mix.wav'),
                '-af', 'loudnorm=I=-14:TP=-1.2:LRA=7', '-ar', str(SR),
                '-c:a', 'aac', '-b:a', '256k', str(OUT / 'soundtrack.m4a')], check=True)
report = subprocess.run(['ffmpeg', '-hide_banner', '-i', str(OUT / 'soundtrack.m4a'),
                         '-af', 'loudnorm=print_format=json', '-f', 'null', '-'],
                        capture_output=True, text=True, check=True).stderr
report = json.loads(report[report.rindex('{'):report.rindex('}') + 1])
(ROOT / 'out' / 'audio-report.json').write_text(json.dumps(report, indent=2) + '\n')
print(json.dumps({'seconds': LENGTH, 'bpm': round(60 / BEAT, 2),
                  'loudness': report['input_i'], 'truePeak': report['input_tp']}, indent=2))
