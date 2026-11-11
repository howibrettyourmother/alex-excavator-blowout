import os,re,base64,sys
D=os.path.dirname(os.path.abspath(__file__));R=os.path.dirname(D)
VER=open(f'{R}/VERSION').read().strip()
t=open(f'{D}/template.html').read()
game=''.join(open(f'{D}/game{i}.js').read() for i in (1,2,3,4,6,7,5)).replace('/*VER*/',VER)
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
s=open(f'{R}/sw.js').read();s=re.sub(r"V='[^']*'","V='%s'"%VER,s);open(f'{R}/sw.js','w').write(s)
print('built',VER,len(t))
