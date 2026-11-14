(function(){
'use strict';
var M=window.Matter,Engine=M.Engine,Bodies=M.Bodies,Body=M.Body,Composite=M.Composite,Events=M.Events,Sleeping=M.Sleeping;
var VER='/*VER*/';
var W=1500,H=1000,FLOOR=880,TABLE=900,TOP=380,FX0=470,FX1=515,BX0=1360,BX1=1400,GAP0=549,GAP1=813,BR=21,LX=210,LY=724;
var L1=330,L2=290,EXMIN=840,EXMAX=1290,EXPARK=1235;
function $(id){return document.getElementById(id)}
var cv=$('c'),ctx=cv.getContext('2d',{alpha:false});
var CW=1,CH=1,DPR=1,S=1,OX=0,OY=0,K=1,qual=1;
var rnd=Math.random,PI=Math.PI;
function clamp(v,a,b){return v<a?a:v>b?b:v}
function lerp(a,b,t){return a+(b-a)*t}
function ease(t){return t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2}
function rng(a){return function(){a|=0;a=a+0x6D2B79F5|0;var t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
var MK='PM,"Marker Felt","Chalkboard SE","Comic Sans MS",cursive';
/* ---------- save ---------- */
var SK='aeb_save',save={lv:0,tk:0,pz:{},w:0,best:0,gp:{},th:0};
try{var so=JSON.parse(localStorage.getItem(SK)||'null');if(so&&typeof so==='object')for(var sk in so)save[sk]=so[sk]}catch(e){}
function persist(){try{localStorage.setItem(SK,JSON.stringify(save))}catch(e){}}
var muted=false;try{muted=localStorage.getItem('aeb_mute')==='1'}catch(e){}
/* ---------- audio (all synthesized) ---------- */
var AC=null,master=null,sfxBus=null,musBus=null,crowdBus=null,NB=null,lastS={};
function aInit(){try{if(!AC){var C=window.AudioContext||window.webkitAudioContext;if(!C)return;AC=new C();master=AC.createGain();master.gain.value=muted?0:.9;master.connect(AC.destination);setTimeout(function(){try{loadFarts();loadSamples()}catch(e){}},0);
 var comp=AC.createDynamicsCompressor();comp.threshold.value=-14;comp.ratio.value=4;comp.connect(master);
 sfxBus=AC.createGain();sfxBus.gain.value=.85;sfxBus.connect(comp);musBus=AC.createGain();musBus.gain.value=.15;musBus.connect(comp);crowdBus=AC.createGain();crowdBus.gain.value=.75;crowdBus.connect(comp);
 NB=AC.createBuffer(1,AC.sampleRate,AC.sampleRate);var d=NB.getChannelData(0);for(var i=0;i<d.length;i++)d[i]=Math.random()*2-1}
 if(AC.state!=='running'&&!(window.__AG&&window.__AG.hidden()))AC.resume()}catch(e){}}
function aok(){return AC&&AC.state==='running'&&!muted}
function tone(f,d,o){o=o||{};if(!aok())return;try{var t=AC.currentTime+(o.at||0),osc=AC.createOscillator(),g=AC.createGain();osc.type=o.type||'sine';osc.frequency.setValueAtTime(f,t);if(o.to)osc.frequency.exponentialRampToValueAtTime(o.to,t+d);
 var v=o.vol==null?.3:o.vol,a=o.att||.005;g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(v,t+a);g.gain.exponentialRampToValueAtTime(.0001,t+d);osc.connect(g);g.connect(o.bus||sfxBus);osc.start(t);osc.stop(t+d+.03)}catch(e){}}
function noise(d,o){o=o||{};if(!aok())return;try{var t=AC.currentTime+(o.at||0),s=AC.createBufferSource(),f=AC.createBiquadFilter(),g=AC.createGain();s.buffer=NB;f.type=o.ft||'bandpass';f.frequency.setValueAtTime(o.f||1000,t);if(o.fto)f.frequency.exponentialRampToValueAtTime(o.fto,t+d);f.Q.value=o.q||1;
 var v=o.vol==null?.3:o.vol;g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(v,t+(o.att||.003));g.gain.exponentialRampToValueAtTime(.0001,t+d);s.connect(f);f.connect(g);g.connect(o.bus||sfxBus);s.start(t,Math.random()*.4);s.stop(t+d+.03)}catch(e){}}
function lim(k,ms){var n=performance.now();if(lastS[k]&&n-lastS[k]<ms)return false;lastS[k]=n;return true}
var SFX={
 throw:function(p){noise(.3,{f:500,fto:2600,q:.8,vol:.22+.2*p});tone(260,.2,{to:620,type:'triangle',vol:.08})},
 hit:function(mat,v){var a=clamp(v/16,.08,1);if(!lim(mat,50))return;
  if(mat==='plate'){tone(640+rnd()*160,.13,{to:400,type:'triangle',vol:.22*a});noise(.06,{f:3000,q:1.5,vol:.12*a})}
  else if(mat==='cup'){tone(430+rnd()*90,.09,{to:300,type:'square',vol:.07*a});noise(.05,{f:1800,q:4,vol:.18*a})}
  else if(mat==='wrap'){noise(.06,{ft:'highpass',f:1800,vol:.3*a});tone(900+rnd()*300,.05,{type:'triangle',vol:.08*a,to:500})}
  else if(mat==='wall'){tone(115,.2,{to:52,vol:.42*a});noise(.1,{ft:'lowpass',f:700,vol:.3*a})}
  else if(mat==='table'){tone(260,.08,{to:180,type:'triangle',vol:.18*a});noise(.05,{ft:'lowpass',f:1500,vol:.15*a})}
  else{tone(150+rnd()*40,.16,{to:70,vol:.36*a});noise(.08,{ft:'lowpass',f:900,vol:.25*a})}},
 pop:function(){noise(.045,{ft:'highpass',f:2500,vol:.5});tone(1800,.03,{type:'square',vol:.06})},
 gem:function(){tone(1568,.18,{vol:.18});tone(2349,.22,{vol:.14,at:.07});tone(3136,.26,{vol:.08,at:.14})},
 ring:function(){[784,988,1175,1568].forEach(function(f,i){tone(f,.22,{type:'triangle',vol:.17,at:i*.06})})},
 tick:function(i){tone(1200+(i%6)*60,.05,{type:'square',vol:.04})},
 fanfare:function(){var N=[523,659,784,1047,784,1047],T=[0,.12,.24,.36,.6,.72];for(var i=0;i<6;i++){tone(N[i],i>3?.5:.17,{type:'square',vol:.07,at:T[i]});tone(N[i]/2,i>3?.5:.17,{type:'triangle',vol:.13,at:T[i]})}
  [1047,1319,1568,2093].forEach(function(f){tone(f,1.2,{type:'triangle',vol:.09,at:.96,att:.02})});noise(.7,{ft:'highpass',f:5000,vol:.1,at:.96})},
 aww:function(){[392,370,349,330].forEach(function(f,i){tone(f,i===3?.75:.28,{type:'sawtooth',vol:.06,at:i*.3,to:i===3?290:null})})},
 boom:function(){noise(1,{ft:'lowpass',f:1400,fto:70,vol:.75});tone(95,.8,{to:30,vol:.55})},
 thunk:function(){tone(85,.25,{to:42,vol:.45});noise(.18,{ft:'lowpass',f:500,vol:.35})},
 dump:function(){noise(.5,{ft:'lowpass',f:900,fto:300,vol:.35});for(var i=0;i<5;i++)tone(200+rnd()*300,.08,{type:'triangle',vol:.1,at:.05+i*.06,to:120})},
 click:function(){tone(880,.06,{type:'triangle',vol:.14})},
 beep:function(){tone(1046,.13,{type:'square',vol:.045})},
 whoosh:function(){noise(.55,{f:300,fto:3200,q:.6,vol:.3})},
 ok:function(){tone(784,.12,{type:'triangle',vol:.16});tone(1175,.2,{type:'triangle',vol:.16,at:.1})},
 no:function(){tone(300,.25,{type:'triangle',vol:.12,to:220})},
 stretch:function(p){if(lim('st',80))tone(180+p*420,.06,{type:'triangle',vol:.035})}
};
var engS=null;
function engSnd(on){if(!AC)return;try{if(on&&!engS&&aok()){var o=AC.createOscillator(),l=AC.createOscillator(),lg=AC.createGain(),f=AC.createBiquadFilter(),g=AC.createGain();o.type='sawtooth';o.frequency.value=50;l.frequency.value=11;lg.gain.value=9;l.connect(lg);lg.connect(o.frequency);f.type='lowpass';f.frequency.value=360;g.gain.setValueAtTime(0,AC.currentTime);g.gain.linearRampToValueAtTime(.15,AC.currentTime+.3);o.connect(f);f.connect(g);g.connect(sfxBus);o.start();l.start();engS={o:o,l:l,g:g}}
 else if(!on&&engS){var e=engS,n=AC.currentTime;engS=null;e.g.gain.cancelScheduledValues(n);e.g.gain.setValueAtTime(e.g.gain.value,n);e.g.gain.linearRampToValueAtTime(0,n+.3);e.o.stop(n+.35);e.l.stop(n+.35)}}catch(x){}}
function engRev(r){if(engS)try{engS.o.frequency.setTargetAtTime(50+r*38,AC.currentTime,.08)}catch(x){}}
/* little original chiptune loop */
var MUS={on:false,step:0,next:0},MEL=[72,0,76,79,77,76,74,0,72,74,76,72,74,0,67,0,72,0,76,79,81,79,77,76,74,76,74,71,72,0,0,0],BAS=[48,48,53,55,48,45,50,55];
function midi(n){return 440*Math.pow(2,(n-69)/12)}
setInterval(function(){if(!MUS.on||!aok())return;var spb=60/118/2;if(MUS.next<AC.currentTime)MUS.next=AC.currentTime+.05;
 while(MUS.next<AC.currentTime+.25){var i=MUS.step%32,t=MUS.next-AC.currentTime,n=MEL[i];if(n)tone(midi(n),spb*.9,{type:'triangle',vol:.22,at:t,bus:musBus});
  if(i%4===0)tone(midi(BAS[i>>2]),spb*1.8,{type:'square',vol:.1,at:t,bus:musBus});if(i%2===1)noise(.03,{ft:'highpass',f:7000,vol:.06,at:t,bus:musBus});MUS.next+=spb;MUS.step++}},60);
function setMute(m){muted=m;try{localStorage.setItem('aeb_mute',m?'1':'0')}catch(e){}if(master)master.gain.value=m?0:.9;$('mute').textContent=m?'🔇':'🔊';if(m)engSnd(false)}
/* ---------- textures & sprites (all drawn in code) ---------- */
function mkc(w,h){var c=document.createElement('canvas');c.width=Math.max(1,Math.ceil(w));c.height=Math.max(1,Math.ceil(h));return c}
var CBT=(function(){var c=mkc(256,256),g=c.getContext('2d'),r=rng(11);g.fillStyle='#c9975e';g.fillRect(0,0,256,256);
 for(var i=0;i<2600;i++){var v=r();g.fillStyle=v<.5?'rgba(90,55,20,'+(r()*.12)+')':'rgba(255,235,190,'+(r()*.12)+')';g.fillRect(r()*256,r()*256,1+r()*3,1+r()*2)}
 for(var y=0;y<256;y+=8){g.fillStyle='rgba(110,70,30,.05)';g.fillRect(0,y,256,3)}
 for(i=0;i<10;i++){g.strokeStyle='rgba(120,80,35,'+(r()*.12)+')';g.lineWidth=1+r()*2;g.beginPath();var x0=r()*256,y0=r()*256;g.moveTo(x0,y0);g.lineTo(x0+r()*80-40,y0+r()*10-5);g.stroke()}return c})();
var CBP=ctx.createPattern(CBT,'repeat');
try{document.documentElement.style.setProperty('--cbtex','url('+CBT.toDataURL('image/jpeg',.8)+')')}catch(e){}
function cbFill(g,dark){g.fillStyle=g.createPattern(CBT,'repeat');g.fill();if(dark){g.fillStyle='rgba(60,30,5,'+dark+')';g.fill()}}
function jag(g,pts,r,amp){g.beginPath();for(var i=0;i<pts.length;i++){var a=pts[i],b=pts[(i+1)%pts.length],n=Math.max(1,Math.round(Math.hypot(b[0]-a[0],b[1]-a[1])/14));
 for(var j=0;j<n;j++){var t=j/n,x=lerp(a[0],b[0],t),y=lerp(a[1],b[1],t);if(j>0){x+=(r()-.5)*amp;y+=(r()-.5)*amp}if(i===0&&j===0)g.moveTo(x,y);else g.lineTo(x,y)}}g.closePath()}
var SPR={},SPB={};
function spr(key){var s=SPR[key];if(s)return s;var b=SPB[key];if(!b)return null;var c=mkc(b.w*K+4,b.h*K+4),g=c.getContext('2d');g.translate(2,2);g.scale(K,K);b.f(g,b.w,b.h);s=SPR[key]={c:c,w:b.w+4/K,h:b.h+4/K};return s}
function defSpr(key,w,h,f){if(!SPB[key])SPB[key]={w:w,h:h,f:f};return key}
function sprPlate(r,seed){return defSpr('plate'+r+'_'+seed,r*2,r*2,function(g){var rr=rng(seed);g.translate(r,r);g.beginPath();for(var i=0;i<=96;i++){var a=i/96*2*PI,q=r*(1-.03*(1+Math.cos(a*40)));i?g.lineTo(Math.cos(a)*q,Math.sin(a)*q):g.moveTo(q,0)}g.closePath();
 var gr=g.createRadialGradient(-r*.3,-r*.3,r*.1,0,0,r);gr.addColorStop(0,'#ffffff');gr.addColorStop(1,'#e8e2d0');g.fillStyle=gr;g.fill();g.strokeStyle='#cfc7b0';g.lineWidth=1.5;g.stroke();
 for(i=0;i<40;i++){var a2=i/40*2*PI;g.strokeStyle='#e3dcc8';g.lineWidth=1.2;g.beginPath();g.moveTo(Math.cos(a2)*r*.7,Math.sin(a2)*r*.7);g.lineTo(Math.cos(a2)*r*.92,Math.sin(a2)*r*.92);g.stroke()}
 g.beginPath();g.arc(0,0,r*.66,0,2*PI);g.strokeStyle='#d8d0ba';g.lineWidth=2.5;g.stroke();
 var cols=['#7a4bc4','#2f8a3a','#e0622a','#1f6fd1'],c=cols[(rr()*4)|0];g.strokeStyle=c;g.lineWidth=3.5;g.lineCap='round';g.beginPath();
 if(rr()<.5){g.arc(0,0,r*.32,.2*PI,.8*PI);g.moveTo(-r*.14,-r*.12);g.arc(-r*.14,-r*.12,1,0,2*PI);g.moveTo(r*.14,-r*.12);g.arc(r*.14,-r*.12,1,0,2*PI)}else{for(i=0;i<5;i++){var a3=-PI/2+i*4*PI/5;i?g.lineTo(Math.cos(a3)*r*.35,Math.sin(a3)*r*.35):g.moveTo(Math.cos(a3)*r*.35,Math.sin(a3)*r*.35)}g.closePath()}g.stroke()})}
function sprEdge(w,h){return defSpr('edge'+w,w,h,function(g){g.beginPath();g.ellipse(w/2,h/2,w/2,h/2,0,0,2*PI);g.fillStyle='#f7f4ea';g.fill();g.strokeStyle='#c9c1a8';g.lineWidth=1.5;g.stroke();
 g.strokeStyle='#e0d9c4';for(var x=6;x<w-4;x+=5){g.beginPath();g.moveTo(x,2);g.lineTo(x,h-2);g.stroke()}})}
function sprCup(col){return defSpr('cup'+col,66,86,function(g){var c=col==='g'?['#7fd34a','#3f9a1f']:col==='b'?['#5aa8ff','#1f5fbf']:['#ff4a4a','#b81414'];
 g.beginPath();g.moveTo(1,4);g.lineTo(65,4);g.lineTo(55,85);g.lineTo(11,85);g.closePath();var gr=g.createLinearGradient(0,0,66,0);gr.addColorStop(0,c[1]);gr.addColorStop(.35,c[0]);gr.addColorStop(1,c[1]);g.fillStyle=gr;g.fill();
 g.strokeStyle='rgba(0,0,0,.25)';g.lineWidth=1.5;g.stroke();g.fillStyle='rgba(255,255,255,.85)';g.fillRect(0,0,66,8);g.fillStyle='rgba(255,255,255,.25)';g.fillRect(14,14,5,60);
 g.strokeStyle='rgba(0,0,0,.15)';for(var y=20;y<34;y+=6){g.beginPath();g.moveTo(3+y*.12,y);g.lineTo(63-y*.12,y);g.stroke()}})}
function sprScrap(w,h,seed){return defSpr('scrap'+w+'_'+h+'_'+seed,w,h,function(g){var r=rng(seed);jag(g,[[0,0],[w,0],[w,h],[0,h]],r,4);cbFill(g,.05);g.strokeStyle='#7a5328';g.lineWidth=2;g.stroke();
 g.save();g.clip();g.strokeStyle='rgba(120,80,35,.35)';g.lineWidth=1.5;for(var x=4;x<w;x+=7){g.beginPath();g.moveTo(x,0);g.lineTo(x,3+r()*3);g.stroke()}
 if(r()<.6){g.fillStyle='rgba(230,230,210,.45)';g.save();g.translate(w*(.2+r()*.5),h/2);g.rotate(r()-.5);g.fillRect(-14,-h,28,h*2);g.restore()}
 g.strokeStyle=r()<.5?'#2f8a3a':'#1f3a6e';g.lineWidth=3;g.lineCap='round';if(w>50){var mx=w*.5,my=h*.5;g.beginPath();g.moveTo(mx-14,my);g.lineTo(mx+14,my);g.moveTo(mx+6,my-7);g.lineTo(mx+14,my);g.lineTo(mx+6,my+7);g.stroke()}g.restore()})}
function sprBall(){return defSpr('ball',BR*2,BR*2,function(g){g.translate(BR,BR);g.beginPath();g.arc(0,0,BR,0,2*PI);var gr=g.createRadialGradient(-6,-6,2,0,0,BR);gr.addColorStop(0,'#fff3a8');gr.addColorStop(.5,'#ffcf2e');gr.addColorStop(1,'#d48f00');g.fillStyle=gr;g.fill();
 g.save();g.clip();g.fillStyle='#1f3a8f';g.beginPath();g.ellipse(0,0,BR*1.2,6,-.5,0,2*PI);g.fill();g.restore();g.strokeStyle='rgba(90,50,0,.4)';g.lineWidth=1.5;g.stroke()})}
function sprShred(w,h,seed){return defSpr('shred'+w+'_'+h+'_'+seed,w,h,function(g){var r=rng(seed),cols=['#4fb6d6','#2f8fbf','#8fd6ea','#3aa3d0','#6cc8e4'];
 for(var i=0;i<w*1.4;i++){var x=r()*w,u=Math.sin(x/w*PI),y=h-r()*h*u*.95;g.strokeStyle=cols[(r()*5)|0];g.lineWidth=1.6+r()*1.4;g.beginPath();g.moveTo(x,y);
 g.bezierCurveTo(x+(r()-.5)*30,y-(r())*14,x+(r()-.5)*30,y+(r()-.5)*14,x+(r()-.5)*36,y+(r()-.5)*10);g.stroke()}})}
function sprRing(){return defSpr('ring',84,84,function(g){g.translate(42,42);var cols=['#ff7a1a','#3cc43c','#e8342a','#ffd21a'];for(var i=0;i<36;i++){var a=i/36*2*PI;g.strokeStyle=cols[(i>>1)%4];g.lineWidth=12;g.lineCap='round';g.beginPath();g.arc(0,0,32,a,a+2*PI/36+.05);g.stroke()}
 var r=rng(5);g.lineWidth=1.2;for(i=0;i<220;i++){var a2=r()*2*PI,rr=32+(r()-.5)*12;g.strokeStyle=cols[(r()*4)|0];g.beginPath();g.moveTo(Math.cos(a2)*rr,Math.sin(a2)*rr);g.lineTo(Math.cos(a2)*(rr+(r()-.5)*10)+(r()-.5)*4,Math.sin(a2)*(rr+(r()-.5)*10)+(r()-.5)*4);g.stroke()}})}
function sprGem(){return defSpr('gem',30,30,function(g){g.translate(15,15);g.beginPath();g.moveTo(0,-13);g.lineTo(12,-3);g.lineTo(7,12);g.lineTo(-7,12);g.lineTo(-12,-3);g.closePath();var gr=g.createLinearGradient(-12,-12,12,12);gr.addColorStop(0,'#ffffff');gr.addColorStop(.4,'#bfe9ff');gr.addColorStop(.7,'#9db7ff');gr.addColorStop(1,'#f2d9ff');g.fillStyle=gr;g.fill();
 g.strokeStyle='#ffffff';g.lineWidth=1.5;g.stroke();g.strokeStyle='rgba(90,110,200,.6)';g.lineWidth=1;g.beginPath();g.moveTo(-12,-3);g.lineTo(12,-3);g.moveTo(0,-13);g.lineTo(-4,-3);g.lineTo(0,12);g.moveTo(0,-13);g.lineTo(4,-3);g.lineTo(0,12);g.stroke()})}
