import os,re,base64,sys
D=os.path.dirname(os.path.abspath(__file__));R=os.path.dirname(D)
VER=open(f'{R}/VERSION').read().strip()
t=open(f'{D}/template.html').read()
game=''.join(open(f'{D}/game{i}.js').read() for i in (1,2,3,4,6,7,8,9,10,5)).replace('/*VER*/',VER)
pack=open(f'{R}/sfx/pools.json').read().strip()
if '/*PACK*/null' not in game: raise SystemExit('PACK marker missing')
game=game.replace('/*PACK*/null',pack,1)
# v1.8.0 theme music: bake music/music.json + which of its files actually exist (missing files = silence, no 404s)
import json
mj=json.load(open(f'{R}/music/music.json'))
have={}
for k in ('sting','loop','full'):
  f=(mj.get(k) or {}).get('file')
  if f and os.path.isfile(f'{R}/music/{f}'): have[k]='music/'+f
if '/*MUSIC*/null' not in game: raise SystemExit('MUSIC marker missing')
game=game.replace('/*MUSIC*/null',json.dumps({'cfg':mj,'have':have},separators=(',',':')),1)
print('music', have or 'none yet (silent)')
t=t.replace('/*FONT*/',base64.b64encode(open(f'{D}/pm.woff2','rb').read()).decode()).replace('/*MATTER*/',open(f'{D}/matter.min.js').read()).replace('/*GAME*/',game).replace('/*VER*/',VER)
KH='/workspace/kids-hubs'
# idempotent: drop any shared blocks the kids-hubs scripts may have injected into the template, then inject fresh copies
for tag in ('audio-guard[^*]*','hub-home','kids-play','sw-reload'):
  t=re.sub(r'<script>/\*'+tag+r'\*/.*?</script>\n?','',t,flags=re.S)
t=re.sub(r"<script>if\('serviceWorker' in navigator.*?</script>\n?",'',t,flags=re.S)
ag=open(f'{KH}/audioguard.js').read().strip()
m=re.search(r'<meta charset[^>]*>',t);t=t[:m.end()]+'\n'+ag+'\n'+t[m.end():]
sw="<script>if('serviceWorker' in navigator&&location.protocol==='https:'){addEventListener('load',function(){navigator.serviceWorker.register('sw.js?v=%s').catch(function(){})})}</script>"%VER
home=open(f'{KH}/home.js').read().strip().replace('%OWN%','alex').replace('%POS%','left:calc(6px + env(safe-area-inset-left));top:calc(8px + env(safe-area-inset-top))')
swr=open(f'{KH}/swfix.py').read();swr=re.search(r'SNIP="""(.*?)"""',swr,re.S).group(1)
play=open(f'{KH}/play.js').read().strip().replace('%GAME%','alex-excavator-blowout').replace('%OWN%','alex')
i=t.rfind('</body>');t=t[:i]+sw+'\n'+home+'\n'+swr+'\n'+play+'\n'+t[i:]
open(f'{R}/index.html','w').write(t)
s=open(f'{R}/sw.js').read();s=re.sub(r"V='[^']*'","V='%s'"%VER,s)
sfx=[]
for dp,dns,fns in [x for d in ('sfx','music') for x in os.walk(f'{R}/'+d)]:
  for fn in fns:
    if fn.endswith(('.mp3','.json')):
      sfx.append(os.path.relpath(os.path.join(dp,fn),R).replace(os.sep,'/'))
sfx=sorted(sfx)
prec=['./','index.html','manifest.json','apple-touch-icon-120.png','apple-touch-icon-152.png','apple-touch-icon-167.png','apple-touch-icon.png','favicon-32.png','icon-192.png','icon-512.png']+sfx
arr='['+', '.join("'%s'"%x for x in prec)+']'
if "A=[" not in s: raise SystemExit('sw.js A list missing')
s=re.sub(r"A=\[.*?\]",'A='+arr,s,count=1,flags=re.S)
open(f'{R}/sw.js','w').write(s)
print('built',VER,len(t),'sw',len(sfx))
