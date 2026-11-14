#!/usr/bin/env python3
"""Drop the Excavator Blowout theme song into the game.

Usage (from the repo root):
  python3 src/music_dropin.py [SRC_DIR] [--hit SEC] [--loop START:END] [--loop-bars BPM:BARS:START]
                              [--cut-sting START:END] [--cut-loop START:END] [--gain G] [--no-build]

SRC_DIR (default /workspace/kids_audio/excavator_theme) is searched for
  theme_intro_sting.*, theme_loop.*, theme_full.*   (.wav .mp3 .flac .m4a .ogg .aac)
Each one found is loudness-normalized (two-pass EBU R128 loudnorm, -16 LUFS, -1.5 dBTP),
encoded as 96 kbps MP3 (stereo if the source is stereo, else mono) and written to music/.
--cut-sting / --cut-loop cut that part out of the FULL song instead (seconds, START:END).
--hit      seconds into the sting where the big hit lands (synced to the logo smash).
--loop     loop points inside theme_loop.mp3 (seconds); --loop-bars computes END from BPM.
           Without either, theme_loop is treated as an exact one-cycle loop: it is written 3x and the
           middle copy is looped (seamless even with MP3 padding).
--gain     overall music level (music.json "gain", default 0.55; SFX stay louder).
Then music/music.json is updated and src/build.py is run (unless --no-build).
"""
import os, sys, json, glob, subprocess, re, argparse
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EXT = ('.wav', '.mp3', '.flac', '.m4a', '.ogg', '.aac')

def find(src, stem):
    for e in EXT:
        f = os.path.join(src, stem + e)  # top level only: drafts in subfolders (e.g. alex_v2/) are never picked up
        if os.path.isfile(f):
            return f
    return None

def channels(f):
    o = subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'a:0', '-show_entries', 'stream=channels', '-of', 'csv=p=0', f], capture_output=True, text=True).stdout.strip()
    return 2 if o.startswith('2') or (o.isdigit() and int(o) > 2) else 1

def nsamples(f):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', f, '-ac', '1', '-ar', '44100', '-f', 's16le', '-'], capture_output=True).stdout
    return len(raw) // 2

def encode(src, dst, cut=None, lufs=-16.0, repeat=1):
    pre = []
    if cut:
        a, b = cut
        pre = ['-ss', str(a), '-to', str(b)]
    ch = channels(src)
    # pass 1: measure
    m = subprocess.run(['ffmpeg', '-hide_banner', '-nostats'] + pre + ['-i', src, '-af', 'loudnorm=I=%s:TP=-1.5:LRA=11:print_format=json' % lufs, '-f', 'null', '-'], capture_output=True, text=True).stderr
    js = json.loads(m[m.rindex('{'):m.rindex('}') + 1])
    af = ('loudnorm=I=%s:TP=-1.5:LRA=11:measured_I=%s:measured_TP=%s:measured_LRA=%s:measured_thresh=%s:offset=%s:linear=true'
          % (lufs, js['input_i'], js['input_tp'], js['input_lra'], js['input_thresh'], js['target_offset']))
    if cut:
        af = 'afade=t=in:d=0.01,' + af  # no click at a hard cut
    if repeat > 1:
        # a pre-made loop is written 3x in a row; the game loops the middle copy (loopStart=L, loopEnd=2L),
        # which stays seamless even if a browser keeps the MP3 encoder padding at the start of the file
        tmp = dst + '.wav'
        subprocess.run(['ffmpeg', '-v', 'error', '-y'] + pre + ['-i', src, '-af', af + ',aloop=loop=%d:size=%d' % (repeat - 1, nsamples(src) if not cut else int(round((cut[1]-cut[0])*44100))), '-ar', '44100', '-ac', str(ch), tmp], check=True)
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', tmp, '-b:a', '96k', dst], check=True); os.remove(tmp)
    else:
        subprocess.run(['ffmpeg', '-v', 'error', '-y'] + pre + ['-i', src, '-af', af, '-ar', '44100', '-ac', str(ch), '-b:a', '96k', dst], check=True)
    o = subprocess.run(['ffmpeg', '-nostats', '-i', dst, '-af', 'ebur128=peak=true', '-f', 'null', '-'], capture_output=True, text=True).stderr
    i = re.findall(r'I:\s+(-?[\d.]+) LUFS', o)
    d = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', dst], capture_output=True, text=True).stdout.strip()
    print('  %-24s %5.1f s  %s ch  %s LUFS' % (os.path.basename(dst), float(d), ch, i[-1] if i else '?'))

def rng(s):
    a, b = s.split(':'); return float(a), float(b)

ap = argparse.ArgumentParser()
ap.add_argument('src', nargs='?', default='/workspace/kids_audio/excavator_theme')
ap.add_argument('--hit', type=float); ap.add_argument('--loop'); ap.add_argument('--loop-bars')
ap.add_argument('--cut-sting'); ap.add_argument('--cut-loop'); ap.add_argument('--gain', type=float)
ap.add_argument('--no-build', action='store_true')
A = ap.parse_args()
os.makedirs(os.path.join(R, 'music'), exist_ok=True)
mj_path = os.path.join(R, 'music', 'music.json'); mj = json.load(open(mj_path))
full = find(A.src, 'theme_full')
print('source folder:', A.src)
auto_loop = not A.loop and not A.loop_bars
for key, stem, cut in (('full', 'theme_full', None), ('sting', 'theme_intro_sting', A.cut_sting), ('loop', 'theme_loop', A.cut_loop)):
    dst = os.path.join(R, 'music', stem + '.mp3')
    rep = 3 if (key == 'loop' and auto_loop) else 1
    if cut:
        if not full: sys.exit('--cut-%s needs theme_full.* in %s' % (key, A.src))
        print('cutting', key, 'from', full, cut); encode(full, dst, rng(cut), repeat=rep)
        if rep > 1: L = rng(cut)[1] - rng(cut)[0]; mj['loop']['loopStart'] = round(L, 4); mj['loop']['loopEnd'] = round(2 * L, 4)
    else:
        f = find(A.src, stem)
        if f:
            print('found', f); encode(f, dst, repeat=rep)
            if rep > 1: L = nsamples(f) / 44100.0; mj['loop']['loopStart'] = round(L, 4); mj['loop']['loopEnd'] = round(2 * L, 4); print('  seamless loop: middle copy', mj['loop']['loopStart'], '->', mj['loop']['loopEnd'])
        else: print('missing', stem, '(the game just stays silent for it)')
if A.hit is not None: mj['sting']['hit'] = A.hit
if A.loop: a, b = rng(A.loop); mj['loop']['loopStart'] = a; mj['loop']['loopEnd'] = b
if A.loop_bars:
    bpm, bars, start = A.loop_bars.split(':'); start = float(start)
    mj['loop']['loopStart'] = start; mj['loop']['loopEnd'] = round(start + int(bars) * 4 * 60.0 / float(bpm), 4)
if A.gain is not None: mj['gain'] = A.gain
json.dump(mj, open(mj_path, 'w'), indent=2); open(mj_path, 'a').write('\n')
print('music.json:', json.dumps({k: mj[k] for k in ('gain', 'sting', 'loop', 'full')}))
if not A.no_build:
    subprocess.run([sys.executable, os.path.join(R, 'src', 'build.py')], check=True)
