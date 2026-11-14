/* ===== crowd of cheering kids, 6-7, Meadow Brook Mouse helper ===== */
var SIMB=false;
/* ---- crowd sounds (synthesized; routed through crowdBus -> master, so mute + audio guard apply) ---- */
function voices(n,f0,f1,dur,F,vol,at){if(!aok())return;try{var t0=AC.currentTime+(at||0);for(var i=0;i<n;i++){var t=t0+rnd()*.08,k=1+(rnd()-.5)*.16,o=AC.createOscillator(),e=AC.createGain();o.type='sawtooth';o.frequency.setValueAtTime(f0*k,t);o.frequency.linearRampToValueAtTime(f1*k,t+dur);
 e.gain.setValueAtTime(.0001,t);e.gain.linearRampToValueAtTime(vol,t+Math.min(.08,dur*.3));e.gain.setValueAtTime(vol,t+dur*.6);e.gain.exponentialRampToValueAtTime(.0001,t+dur);
 F.forEach(function(ff,j){var b=AC.createBiquadFilter();b.type='bandpass';b.frequency.value=ff[0]*(1+(rnd()-.5)*.08);b.Q.value=ff[1];var gg=AC.createGain();gg.gain.value=j?.6:1;o.connect(b);b.connect(gg);gg.connect(e)});e.connect(crowdBus);o.start(t);o.stop(t+dur+.05)}}catch(x){}}
var CSND={bed:null,
 start:function(){if(!AC||CSND.bed)return;try{var s=AC.createBufferSource();s.buffer=NB;s.loop=true;var f=AC.createBiquadFilter();f.type='bandpass';f.frequency.value=480;f.Q.value=.8;var g=AC.createGain();g.gain.value=.03;var l=AC.createOscillator(),lg=AC.createGain();l.frequency.value=.17;lg.gain.value=.012;l.connect(lg);lg.connect(g.gain);s.connect(f);f.connect(g);g.connect(crowdBus);s.start();l.start();CSND.bed={s:s,g:g}}catch(x){}},
 ooh:function(){voices(6,300,430,.75,[[330,7],[850,9]],.05)},
 aww:function(big){voices(big?8:5,440,290,big?1.1:.8,[[760,6],[1150,8]],big?.055:.035)},
 cheer:function(big){var d=big?1.8:1;noise(d,{f:1600,q:.5,vol:big?.22:.13,att:.08,bus:crowdBus});voices(big?9:6,380,540,d*.8,[[850,5],[1250,7]],.045);var n=big?36:14;for(var i=0;i<n;i++)noise(.03,{f:1100+rnd()*900,q:.9,vol:.2+rnd()*.15,at:.15+rnd()*(big?2.2:1.1),bus:crowdBus})},
 six:function(at){at=at||0;for(var r=0;r<2;r++){var b=at+r*.95;noise(.09,{ft:'highpass',f:4200,vol:.12,at:b,bus:crowdBus});voices(5,540,520,.17,[[420,8],[2100,10]],.055,b+.07);noise(.05,{ft:'highpass',f:3500,vol:.08,at:b+.25,bus:crowdBus});
  noise(.08,{ft:'highpass',f:4200,vol:.1,at:b+.38,bus:crowdBus});voices(5,450,440,.15,[[600,8],[1800,10]],.055,b+.45);voices(5,400,370,.22,[[340,8],[1500,10]],.05,b+.62)}},
 squeak:function(){tone(2500,.07,{to:3500,vol:.13});tone(3100,.09,{to:2300,vol:.12,at:.11});tone(2800,.06,{to:3600,vol:.1,at:.26})}};
setInterval(function(){if(!CSND.bed||!aok()||titleOn||rnd()>.4)return;voices(1,230+rnd()*200,220+rnd()*200,.09+rnd()*.1,[[500+rnd()*400,5],[1400+rnd()*500,6]],.012)},140);
/* ---- kids (v1.5: little 6-7-year-olds: big heads, tees/hoodies + shorts/jeans/leggings, sneakers) ---- */
var SKIN=['#f8d9bf','#efbf98','#d39a6a','#b07444','#85532e','#5c3a22'],SHIRT=['#e8342a','#1f6fd1','#2f9a3a','#f2b705','#7a4bc4','#ff7a1a','#14a3a3','#ff6fb5','#3a3a8a','#9acd32'];
var KST=[
 {skin:0,hair:'#e8c36a',hs:'pig',bow:'#ff4f9a',top:'tee',tc:'#ff8fc8',gfx:'heart',bot:'leggings',bc:'#8a5ad6',sh:'#ffffff',lu:1,lash:1},
 {skin:4,hair:'#1a1410',hs:'buzz',top:'hoodie',tc:'#2f9a3a',gfx:'dino',bot:'jeans',bc:'#3a5f9e',sh:'#e8342a'},
 {skin:2,hair:'#3a2214',hs:'puffs',top:'tee',tc:'#ff7a1a',gfx:'mbe',bot:'shorts',bc:'#4a74b8',sh:'#ffd21a',prop:'lan',lash:1},
 {skin:1,hair:'#6a4020',hs:'cap',cc:'#d62828',top:'tee',tc:'#1f6fd1',gfx:'n7',bot:'shorts',bc:'#c8a46a',sh:'#2fb04a',prop:'bp',bpc:'#f2b705'},
 {skin:3,hair:'#1f1410',hs:'messy',top:'tee',tc:'#ff7a1a',gfx:'mbe',bot:'jeans',bc:'#34508a',sh:'#1f6fd1',lu:1,gl:1},
 {skin:5,hair:'#140c08',hs:'braids',bead:'#ffd21a',top:'hoodie',tc:'#7a4bc4',gfx:'rainbow',bot:'leggings',bc:'#14a3a3',sh:'#ffffff',prop:'bp',bpc:'#ff6fb5',lash:1},
 {skin:0,hair:'#c2531c',hs:'messy',top:'tee',tc:'#f2c40a',gfx:'bolt',bot:'shorts',bc:'#25306e',sh:'#ff7a1a',fr:1},
 {skin:1,hair:'#7a4a22',hs:'pony',bow:'#14a3a3',top:'tee',tc:'#14a3a3',gfx:'star',bot:'tutu',bc:'#ff9fd0',sh:'#ff6fb5',lash:1},
 {skin:3,hair:'#2b1a10',hs:'beanie',cc:'#1f6fd1',top:'hoodie',tc:'#e8342a',gfx:'star',bot:'jeans',bc:'#3a5f9e',sh:'#222'},
 {skin:2,hair:'#1a1410',hs:'bob',bow:'#ffd21a',top:'tee',tc:'#9acd32',gfx:'ball',bot:'shorts',bc:'#ff6fb5',sh:'#8a5ad6',lu:1,lash:1}];
var WST=[
 {skin:2,hair:'#3a2214',hs:'beanie',cc:'#ff7a1a',top:'hoodie',tc:'#1f6fd1',gfx:'dino',bot:'jeans',bc:'#34508a',sh:'#e8342a'},
 {skin:0,hair:'#e8c36a',hs:'pony',bow:'#e8342a',top:'tee',tc:'#e8342a',gfx:'star',bot:'leggings',bc:'#3a3a8a',sh:'#fff',lu:1,lash:1},
 {skin:4,hair:'#1a1410',hs:'buzz',top:'tee',tc:'#ff7a1a',gfx:'mbe',bot:'shorts',bc:'#25306e',sh:'#2fb04a',prop:'bp',bpc:'#14a3a3'},
 {skin:1,hair:'#6a4020',hs:'pig',bow:'#7a4bc4',top:'hoodie',tc:'#ff6fb5',gfx:'heart',bot:'leggings',bc:'#7a4bc4',sh:'#fff',lash:1}];
var FRONT=660,BACK=598;// feet lines: front row stands right behind the lunch-table edge, back row on the bench behind
var KDEF=[[55,BACK,.56],[165,BACK,.57],[275,BACK,.55],[385,BACK,.56],[110,FRONT,.64],[222,FRONT,.66],[338,FRONT,.63],[992,TOP-46,.6,1],[1062,TOP-40,.56,1],[1466,900,.8]];
function mkKid(i,x,hy,s,st,dir,r){r=r||rng(typeof i==='number'?i*31+7:77);var o={i:i,x:x,hy:hy,s:s,ph:r()*6,dl:r()*.25,bp:2+r()*3,dir:dir};for(var p in st)o[p]=st[p];o.skin=SKIN[st.skin];o.shirt=st.tc;return o}
var KIDS=KDEF.map(function(d,i){return mkKid(i,d[0],d[3]?d[1]:d[1]-224*d[2],d[2],KST[i],d[0]<1000?1:-1)});
var CR={mode:'idle',prev:'idle',t:0,dur:0,six:0,lastSix:-99,sixKids:[],bub:null,count:{}};
var KOL='#3a2414',HR=50;
function shade(c,f){var n=parseInt(c.slice(1),16),r=n>>16,g=n>>8&255,b=n&255;f=f<0?0:f;return'rgb('+Math.min(255,r*f|0)+','+Math.min(255,g*f|0)+','+Math.min(255,b*f|0)+')'}
function ko(g,w){g.strokeStyle=KOL;g.lineWidth=w||3;g.lineJoin='round';g.lineCap='round'}
function face(g,R){g.beginPath();g.moveTo(0,-R);g.bezierCurveTo(R*.64,-R,R*1.02,-R*.58,R*1.02,-R*.02);g.bezierCurveTo(R*1.04,R*.62,R*.64,R*.96,0,R*.96);g.bezierCurveTo(-R*.64,R*.96,-R*1.04,R*.62,-R*1.02,-R*.02);g.bezierCurveTo(-R*1.02,-R*.58,-R*.64,-R,0,-R);g.closePath()}
function bow(g,x,y,c,sc){g.save();g.translate(x,y);g.scale(sc||1,sc||1);g.fillStyle=c;ko(g,2.5);g.beginPath();g.moveTo(0,0);g.lineTo(-16,-11);g.quadraticCurveTo(-21,0,-16,11);g.closePath();g.moveTo(0,0);g.lineTo(16,-11);g.quadraticCurveTo(21,0,16,11);g.closePath();g.fill();g.stroke();g.beginPath();g.arc(0,0,5,0,2*PI);g.fill();g.stroke();g.restore()}
function hairCap(g,R,c,bangs){g.fillStyle=c;ko(g,3);g.beginPath();g.moveTo(-R*1.03,-R*.02);g.bezierCurveTo(-R*1.06,-R*.7,-R*.6,-R*1.1,0,-R*1.08);g.bezierCurveTo(R*.6,-R*1.1,R*1.06,-R*.7,R*1.03,-R*.02);
 if(bangs==='part'){g.quadraticCurveTo(R*.9,-R*.5,R*.5,-R*.52);g.quadraticCurveTo(R*.1,-R*.55,-R*.15,-R*.78);g.quadraticCurveTo(-R*.5,-R*.45,-R*1.03,-R*.02)}
 else if(bangs==='bang'){g.quadraticCurveTo(R*.95,-R*.42,R*.72,-R*.4);for(var j=0;j<5;j++){var x0=R*.72-j*R*.36;g.quadraticCurveTo(x0-R*.18,-R*.24,x0-R*.36,-R*.4)}g.quadraticCurveTo(-R*.95,-R*.42,-R*1.03,-R*.02)}
 else{g.quadraticCurveTo(R*.98,-R*.45,R*.78,-R*.5);for(var j2=0;j2<6;j2++){var x1=R*.78-j2*R*.26;g.lineTo(x1-R*.13,-R*.32-(j2%2?0:8));g.lineTo(x1-R*.26,-R*.5)}g.quadraticCurveTo(-R*.98,-R*.45,-R*1.03,-R*.02)}
 g.closePath();g.fill();g.stroke()}
function kidHead(k){return defSpr('kh'+k.i,(HR*2+100)*k.s,(HR*2+110)*k.s,function(g){g.scale(k.s,k.s);g.translate(HR+50,HR+68);var R=HR,hc=k.hair,hs=k.hs,i;
 // behind the head
 if(hs==='pig'){[-1,1].forEach(function(d){g.save();g.translate(d*R*1.02,-R*.12);g.rotate(d*.55);g.fillStyle=hc;ko(g,3);g.beginPath();g.ellipse(0,18,15,27,0,0,2*PI);g.fill();g.stroke();g.restore()})}
 if(hs==='pony'){g.save();g.translate(R*.9,-R*.5);g.rotate(.7);g.fillStyle=hc;ko(g,3);g.beginPath();g.moveTo(-8,0);g.quadraticCurveTo(24,18,8,52);g.quadraticCurveTo(-4,30,-12,6);g.closePath();g.fill();g.stroke();g.restore()}
 if(hs==='braids'){[-1,1].forEach(function(d){for(i=0;i<5;i++){g.fillStyle=hc;ko(g,2.5);g.beginPath();g.arc(d*R*.92,-R*.05+i*13,9,0,2*PI);g.fill();g.stroke()}g.fillStyle=k.bead;g.beginPath();g.arc(d*R*.92,-R*.05+5*13,6.5,0,2*PI);g.fill();g.stroke()})}
 if(hs==='bob'){g.fillStyle=hc;ko(g,3);g.beginPath();g.moveTo(-R*1.12,R*.42);g.bezierCurveTo(-R*1.25,-R*.9,R*1.25,-R*.9,R*1.12,R*.42);g.quadraticCurveTo(R*.9,R*.56,R*.7,R*.4);g.lineTo(-R*.7,R*.4);g.quadraticCurveTo(-R*.9,R*.56,-R*1.12,R*.42);g.closePath();g.fill();g.stroke()}
 if(hs==='puffs'){[-1,1].forEach(function(d){g.fillStyle=hc;ko(g,3);g.beginPath();for(i=0;i<9;i++){var a=i/9*2*PI;g.moveTo(d*R*.74+Math.cos(a)*20+8,-R*.86+Math.sin(a)*20);g.arc(d*R*.74+Math.cos(a)*20,-R*.86+Math.sin(a)*20,8,0,2*PI)}g.fill();g.beginPath();g.arc(d*R*.74,-R*.86,22,0,2*PI);g.fill()})}
 if(hs==='cap'){g.fillStyle=shade(k.cc,.75);ko(g,3);g.beginPath();g.ellipse(-R*.98,-R*.58,24,8,-.35,0,2*PI);g.fill();g.stroke()}
 // ears + chubby face
 if(hs!=='bob'){g.fillStyle=k.skin;ko(g,3);[-1,1].forEach(function(d){g.beginPath();g.arc(d*R*.98,6,11,0,2*PI);g.fill();g.stroke()})}
 g.fillStyle=k.skin;ko(g,3);face(g,R);g.fill();g.stroke();
 g.fillStyle='rgba(255,100,120,.34)';g.beginPath();g.ellipse(-31,20,10,6.5,0,0,2*PI);g.ellipse(31,20,10,6.5,0,0,2*PI);g.fill();
 if(k.fr){g.fillStyle='rgba(150,70,30,.55)';[[-34,12],[-28,16],[-38,18],[34,12],[28,16],[38,18]].forEach(function(p){g.beginPath();g.arc(p[0],p[1],1.8,0,2*PI);g.fill()})}
 g.strokeStyle='rgba(90,40,20,.55)';g.lineWidth=2.5;g.beginPath();g.arc(0,11,4.5,.15*PI,.85*PI);g.stroke();
 // hair on top
 if(hs==='messy')hairCap(g,R,hc,'messy');
 else if(hs==='buzz'){g.fillStyle=hc;g.globalAlpha=.9;g.beginPath();g.moveTo(-R*1.0,-R*.18);g.bezierCurveTo(-R*1.02,-R*.78,-R*.6,-R*1.03,0,-R*1.02);g.bezierCurveTo(R*.6,-R*1.03,R*1.02,-R*.78,R*1.0,-R*.18);g.quadraticCurveTo(R*.9,-R*.55,R*.6,-R*.58);g.quadraticCurveTo(0,-R*.66,-R*.6,-R*.58);g.quadraticCurveTo(-R*.9,-R*.55,-R*1.0,-R*.18);g.fill();g.globalAlpha=1;
  g.fillStyle='rgba(255,255,255,.12)';for(i=0;i<16;i++){g.beginPath();g.arc(-R*.7+i*R*.093,-R*.78-Math.sin(i/15*PI)*R*.18,1.6,0,2*PI);g.fill()}}
 else if(hs==='pig'){hairCap(g,R,hc,'bang');bow(g,-R*.9,-R*.45,k.bow,.9);bow(g,R*.9,-R*.45,k.bow,.9)}
 else if(hs==='pony'){hairCap(g,R,hc,'part');g.fillStyle=k.bow;ko(g,2.5);g.beginPath();g.ellipse(R*.86,-R*.6,6,10,.7,0,2*PI);g.fill();g.stroke()}
 else if(hs==='braids')hairCap(g,R,hc,'part');
 else if(hs==='bob'){hairCap(g,R,hc,'bang');g.strokeStyle=k.bow;g.lineWidth=7;g.beginPath();g.arc(0,-R*.1,R*.98,PI*1.15,PI*1.85);g.stroke()}
 else if(hs==='puffs'){g.fillStyle=hc;ko(g,3);g.beginPath();g.moveTo(-R*1.0,-R*.12);g.bezierCurveTo(-R*1.0,-R*.8,R*1.0,-R*.8,R*1.0,-R*.12);g.quadraticCurveTo(R*.8,-R*.5,0,-R*.56);g.quadraticCurveTo(-R*.8,-R*.5,-R*1.0,-R*.12);g.fill();g.stroke();
  g.fillStyle='#ff4f9a';[-1,1].forEach(function(d){g.beginPath();g.ellipse(d*R*.62,-R*.68,7,4,d*.6,0,2*PI);g.fill()})}
 else if(hs==='cap'){hairCap(g,R,hc,'messy');var cc=k.cc;g.fillStyle=cc;ko(g,3);g.beginPath();g.moveTo(-R*1.04,-R*.3);g.bezierCurveTo(-R*1.08,-R*1.15,R*1.08,-R*1.15,R*1.04,-R*.3);g.quadraticCurveTo(0,-R*.46,-R*1.04,-R*.3);g.fill();g.stroke();
  g.fillStyle=hc;g.beginPath();g.arc(0,-R*.4,13,PI,2*PI);g.fill();g.stroke();g.strokeStyle='rgba(255,255,255,.85)';g.lineWidth=3;g.beginPath();g.moveTo(-12,-R*.4);g.lineTo(12,-R*.4);g.stroke();
  g.strokeStyle=shade(cc,.7);g.lineWidth=2;g.beginPath();g.moveTo(0,-R*1.0);g.lineTo(0,-R*.55);g.moveTo(-R*.5,-R*.92);g.quadraticCurveTo(-R*.3,-R*.6,-R*.24,-R*.45);g.moveTo(R*.5,-R*.92);g.quadraticCurveTo(R*.3,-R*.6,R*.24,-R*.45);g.stroke();
  g.fillStyle=shade(cc,.7);g.beginPath();g.arc(0,-R*1.0,5,0,2*PI);g.fill()}
 else if(hs==='beanie'){g.fillStyle=hc;[-1,1].forEach(function(d){g.beginPath();g.ellipse(d*R*.9,-R*.2,9,13,d*.3,0,2*PI);g.fill()});var bc=k.cc;g.fillStyle=bc;ko(g,3);
  g.beginPath();g.moveTo(-R*1.0,-R*.36);g.bezierCurveTo(-R*1.0,-R*1.2,R*1.0,-R*1.2,R*1.0,-R*.36);g.closePath();g.fill();g.stroke();
  g.fillStyle=shade(bc,.8);g.beginPath();g.moveTo(-R*1.06,-R*.5);g.quadraticCurveTo(0,-R*.68,R*1.06,-R*.5);g.lineTo(R*1.04,-R*.22);g.quadraticCurveTo(0,-R*.36,-R*1.04,-R*.22);g.closePath();g.fill();g.stroke();
  g.strokeStyle='rgba(0,0,0,.18)';g.lineWidth=2;for(i=-6;i<=6;i++){g.beginPath();g.moveTo(i*R*.16,-R*.58+Math.abs(i)*1.2);g.lineTo(i*R*.16,-R*.3+Math.abs(i)*1.2);g.stroke()}
  g.fillStyle='#fff';ko(g,2.5);g.beginPath();for(i=0;i<10;i++){var a2=i/10*2*PI;g.moveTo(Math.cos(a2)*10+6,-R*1.02+Math.sin(a2)*10);g.arc(Math.cos(a2)*10,-R*1.02+Math.sin(a2)*10,6,0,2*PI)}g.fill();g.beginPath();g.arc(0,-R*1.02,12,0,2*PI);g.fill()}
 if(k.gl){g.strokeStyle='#1d1d40';g.lineWidth=3;g.beginPath();g.arc(-18,2,15,0,2*PI);g.moveTo(33,2);g.arc(18,2,15,0,2*PI);g.moveTo(-3,0);g.quadraticCurveTo(0,-4,3,0);g.stroke()}})}
function gfx(g,k){var t=k.gfx,i;g.save();g.translate(0,88);
 if(t==='star'){g.fillStyle='#fff6a0';ko(g,2.5);g.beginPath();for(i=0;i<10;i++){var a=-PI/2+i*PI/5,r=i%2?8:19;g.lineTo(Math.cos(a)*r,Math.sin(a)*r)}g.closePath();g.fill();g.stroke()}
 else if(t==='heart'){g.fillStyle='#e8342a';ko(g,2.5);g.beginPath();g.moveTo(0,12);g.bezierCurveTo(-24,-4,-12,-20,0,-8);g.bezierCurveTo(12,-20,24,-4,0,12);g.fill();g.stroke()}
 else if(t==='dino'){g.fillStyle='#bff27a';ko(g,2.5);g.beginPath();g.moveTo(-22,8);g.quadraticCurveTo(-10,-6,4,-4);g.lineTo(10,-16);g.quadraticCurveTo(22,-20,22,-10);g.lineTo(14,-6);g.quadraticCurveTo(14,8,6,10);g.lineTo(6,16);g.lineTo(1,16);g.lineTo(0,10);g.lineTo(-8,10);g.lineTo(-8,16);g.lineTo(-13,16);g.lineTo(-13,9);g.closePath();g.fill();g.stroke();
  g.fillStyle='#fff';g.beginPath();g.arc(16,-12,2,0,2*PI);g.fill();g.fillStyle='#ffd21a';[[-10,-4],[-3,-6],[3,-8]].forEach(function(p){g.beginPath();g.moveTo(p[0]-3,p[1]+1);g.lineTo(p[0],p[1]-6);g.lineTo(p[0]+3,p[1]+1);g.fill()})}
 else if(t==='n7'||t==='n6'){g.font='900 34px "Arial Black",system-ui,sans-serif';g.textAlign='center';g.textBaseline='middle';g.lineWidth=5;g.strokeStyle='#fff';g.strokeText(t[1],0,2);g.fillStyle='#f2b705';g.fillText(t[1],0,2)}
 else if(t==='mbe'){g.textAlign='center';g.textBaseline='middle';g.fillStyle='#fff';g.font='900 19px "Arial Black",system-ui,sans-serif';g.fillText('MBE',0,-4);g.font='900 8px system-ui,sans-serif';g.fillText('1ST GRADE',0,11);g.fillStyle='#fff6a0';g.font='12px system-ui';g.fillText('★',0,-20)}
 else if(t==='bolt'){g.fillStyle='#fff';ko(g,2.5);g.beginPath();g.moveTo(4,-20);g.lineTo(-12,4);g.lineTo(-1,4);g.lineTo(-6,20);g.lineTo(12,-4);g.lineTo(1,-4);g.closePath();g.fill();g.stroke()}
 else if(t==='rainbow'){['#e8342a','#ff9a1a','#ffd21a','#2f9a3a','#1f6fd1'].forEach(function(c,j){g.strokeStyle=c;g.lineWidth=4;g.beginPath();g.arc(0,10,20-j*4,PI,2*PI);g.stroke()});g.fillStyle='#fff';[[-18,11],[18,11]].forEach(function(p){g.beginPath();g.arc(p[0],p[1],5,0,2*PI);g.arc(p[0]+(p[0]<0?6:-6),p[1]+1,4,0,2*PI);g.fill()})}
 else if(t==='ball'){g.fillStyle='#fff';ko(g,2.5);g.beginPath();g.arc(0,0,15,0,2*PI);g.fill();g.stroke();g.fillStyle='#222';g.beginPath();for(i=0;i<5;i++){var b=-PI/2+i*2*PI/5;g.lineTo(Math.cos(b)*6,Math.sin(b)*6)}g.closePath();g.fill()}
 g.restore()}
function kidBody(k){return defSpr('kb'+k.i,150*k.s,210*k.s,function(g){g.scale(k.s,k.s);g.translate(75,-36);var tc=k.tc,hood=k.top==='hoodie',i;
 if(k.prop==='bp'){g.fillStyle=k.bpc;ko(g,3);g.beginPath();g.roundRect?g.roundRect(-39,56,78,66,14):g.rect(-39,56,78,66);g.fill();g.stroke();g.strokeStyle=KOL;g.lineWidth=3;g.beginPath();g.arc(0,56,9,PI,2*PI);g.stroke()}
 // legs + sneakers
 var lc=k.bot==='jeans'?k.bc:k.bot==='shorts'?k.skin:k.bc;[-1,1].forEach(function(d){g.fillStyle=lc;ko(g,3);g.beginPath();g.rect(d<0?-20:4,138,16,70);g.fill();g.stroke();
  if(k.bot==='shorts'){g.fillStyle='#fff';g.fillRect(d<0?-20:4,196,16,10);g.strokeRect(d<0?-20:4,196,16,10)}
  if(k.bot==='jeans'){g.fillStyle=shade(k.bc,1.25);g.fillRect(d<0?-21:3,198,18,9);g.strokeRect(d<0?-21:3,198,18,9)}
  if(k.bot==='leggings'||k.bot==='tutu'){g.fillStyle='rgba(255,255,255,.55)';for(i=0;i<4;i++){g.beginPath();g.arc((d<0?-12:12),150+i*15,2.2,0,2*PI);g.fill()}}
  var sx=d*14;g.fillStyle=k.sh;ko(g,3);g.beginPath();g.moveTo(sx-d*10,206);g.quadraticCurveTo(sx-d*12,222,sx,222);g.lineTo(sx+d*18,222);g.quadraticCurveTo(sx+d*22,212,sx+d*10,208);g.quadraticCurveTo(sx+d*2,202,sx-d*10,206);g.closePath();g.fill();g.stroke();
  g.fillStyle=k.lu?'#fff':'#f4f4f4';g.fillRect(Math.min(sx-d*12,sx+d*20),219,32,5);g.strokeRect(Math.min(sx-d*12,sx+d*20),219,32,5);
  g.strokeStyle=k.sh==='#ffffff'||k.sh==='#fff'?'#ff6fb5':'#fff';g.lineWidth=2;g.beginPath();g.moveTo(sx,208);g.lineTo(sx+d*6,211);g.moveTo(sx+d*2,212);g.lineTo(sx+d*8,214);g.stroke();
  if(k.lu){['#ff3b3b','#3bff6a','#3bb5ff','#ffd21a'].forEach(function(c,j){g.fillStyle=c;g.shadowColor=c;g.shadowBlur=8;g.beginPath();g.arc(Math.min(sx-d*12,sx+d*20)+5+j*7.5,221.5,2.4,0,2*PI);g.fill()});g.shadowBlur=0}});
 // bottoms
 g.fillStyle=k.bc;ko(g,3);
 if(k.bot==='shorts'){g.beginPath();g.moveTo(-30,116);g.lineTo(30,116);g.lineTo(32,162);g.lineTo(4,162);g.lineTo(0,148);g.lineTo(-4,162);g.lineTo(-32,162);g.closePath();g.fill();g.stroke()}
 else{g.beginPath();g.moveTo(-29,116);g.lineTo(29,116);g.lineTo(30,146);g.lineTo(-30,146);g.closePath();g.fill();g.stroke();if(k.bot==='jeans'){g.strokeStyle='rgba(255,255,255,.4)';g.lineWidth=2;g.beginPath();g.moveTo(0,122);g.lineTo(0,146);g.stroke()}}
 if(k.bot==='tutu'){g.fillStyle=k.bc;ko(g,2.5);g.beginPath();g.moveTo(-30,118);for(i=0;i<=8;i++){var x=-38+i*9.5;g.quadraticCurveTo(x-4,156,x,150)}g.lineTo(30,118);g.closePath();g.fill();g.stroke()}
 // top: tee or hoodie
 g.fillStyle=k.skin;ko(g,3);g.beginPath();g.rect(-8,38,16,16);g.fill();g.stroke();
 if(hood){g.fillStyle=shade(tc,.78);g.beginPath();g.ellipse(0,52,27,11,0,0,2*PI);g.fill();g.stroke()}
 g.fillStyle=tc;ko(g,3);g.beginPath();g.moveTo(-10,47);g.quadraticCurveTo(-28,50,-31,58);g.lineTo(-33,hood?126:124);g.lineTo(33,hood?126:124);g.lineTo(31,58);g.quadraticCurveTo(28,50,10,47);g.quadraticCurveTo(0,56,-10,47);g.closePath();g.fill();g.stroke();
 if(hood){g.fillStyle=shade(tc,.85);g.fillRect(-32,118,64,8);g.strokeRect(-32,118,64,8);g.fillStyle=shade(tc,.88);g.beginPath();g.moveTo(-18,100);g.lineTo(18,100);g.lineTo(23,117);g.lineTo(-23,117);g.closePath();g.fill();g.stroke();
  g.strokeStyle='#fff';g.lineWidth=2.5;g.beginPath();g.moveTo(-5,52);g.lineTo(-6,72);g.moveTo(5,52);g.lineTo(6,72);g.stroke()}
 else{g.strokeStyle=shade(tc,.75);g.lineWidth=3;g.beginPath();g.moveTo(-10,48);g.quadraticCurveTo(0,57,10,48);g.stroke()}
 gfx(g,k);
 if(k.prop==='bp'){g.strokeStyle=shade(k.bpc,.7);g.lineWidth=7;g.lineCap='round';g.beginPath();g.moveTo(-17,50);g.lineTo(-22,112);g.moveTo(17,50);g.lineTo(22,112);g.stroke()}
 if(k.prop==='lan'){g.strokeStyle='#1f6fd1';g.lineWidth=3;g.beginPath();g.moveTo(-9,48);g.lineTo(-2,104);g.moveTo(9,48);g.lineTo(2,104);g.stroke();g.fillStyle='#fff';ko(g,2);g.beginPath();g.rect(-9,103,18,22);g.fill();g.stroke();g.fillStyle='#1f6fd1';g.fillRect(-9,103,18,6);g.fillStyle='#f2b705';g.beginPath();g.arc(0,117,4,0,2*PI);g.fill()}})}
function kidMode(k){var m=CR.t<k.dl?CR.prev:CR.mode;if(m==='six')return CR.sixKids.indexOf(k.i)>=0?'67':'cheer';if(m==='idle'&&state==='fly')return'lean';return m}
function arm(g,sx,sy,tx,ty,side,s,k,palm){var L1a=34*s,L2a=31*s,dx=tx-sx,dy=ty-sy,d=clamp(Math.hypot(dx,dy),8*s,L1a+L2a-1),a=Math.atan2(dy,dx),c=(L1a*L1a+d*d-L2a*L2a)/(2*L1a*d),b=Math.acos(clamp(c,-1,1));
 var e1=a+b*side,ex=sx+Math.cos(e1)*L1a,ey=sy+Math.sin(e1)*L1a,hx=sx+Math.cos(a)*d,hy=sy+Math.sin(a)*d,hood=k.top==='hoodie';
 g.lineCap='round';g.strokeStyle=KOL;g.lineWidth=17*s;g.beginPath();g.moveTo(sx,sy);g.lineTo(ex,ey);g.lineTo(hx,hy);g.stroke();
 g.strokeStyle=hood?k.tc:k.skin;g.lineWidth=12*s;g.beginPath();g.moveTo(sx,sy);g.lineTo(ex,ey);g.lineTo(hx,hy);g.stroke();
 if(!hood){g.strokeStyle=KOL;g.lineWidth=20*s;g.beginPath();g.moveTo(sx,sy);g.lineTo(sx+(ex-sx)*.5,sy+(ey-sy)*.5);g.stroke();g.strokeStyle=k.tc;g.lineWidth=15*s;g.stroke()}
 g.fillStyle=k.skin;g.strokeStyle=KOL;g.lineWidth=2.5*s;g.beginPath();if(palm)g.ellipse(hx,hy,11*s,7*s,0,0,2*PI);else g.arc(hx,hy,8*s,0,2*PI);g.fill();g.stroke()}
function drawKids(g,t){var bx=ball?ball.position.x:null,by=ball?ball.position.y:0;for(var i=0;i<KIDS.length;i++)drawKid(g,KIDS[i],kidMode(KIDS[i]),t,bx,by);if(FA.on&&FA.k)drawKid(g,FA.k,FA.tooted?'walkO':'walk',t,bx,by)}// walk-by kid passes in front of the crowd
function drawKid(g,k,m,t,bx,by){var s=k.s,R=HR*s,bob=Math.sin(t*1.6+k.ph)*2.5*s,sway=Math.sin(t*.8+k.ph)*.03,lean=0,jy=0;
  if(m==='lean'){lean=.08*k.dir;bob*=.4}else if(m==='cheer'){jy=-Math.abs(Math.sin(t*7+k.ph))*24*s}else if(m==='excite'){jy=-Math.abs(Math.sin(t*9+k.ph))*13*s}else if(m==='groan'){jy=5*s;lean=-.04*k.dir}else if(m==='sad'){jy=4*s}else if(m==='67'){jy=-Math.abs(Math.sin(t*5.5))*5*s}else if(m==='walk'||m==='walkO'){jy=-Math.abs(Math.sin(t*9))*6*s;bob=0;sway=0}else if(m==='stink'){jy=Math.sin(t*16+k.ph)*2*s}
  g.save();g.translate(Math.round((k.x+(sway+lean)*200*s)*4)/4,k.hy+bob+jy);
  var bs=spr(kidBody(k)),hs=spr(kidHead(k));g.drawImage(bs.c,-75*s,36*s,bs.w,bs.h);
  var shY=58*s,sx=27*s,hl,hr,pa=false;
  if(m==='cheer'){var w=Math.sin(t*10+k.ph)*10*s;hl=[-sx-26*s+w,shY-70*s];hr=[sx+26*s-w,shY-70*s]}
  else if(m==='excite'){var p2=Math.sin(t*12+k.ph)*12*s;hl=[-sx-18*s,shY-46*s+p2];hr=[sx+18*s,shY-46*s-p2]}
  else if(m==='groan'){hl=[-R*.84,R*.36];hr=[R*.84,R*.36]}
  else if(m==='lean'){hl=[-8*s,shY+38*s];hr=[8*s,shY+38*s]}
  else if(m==='walk'||m==='walkO'){var sw3=Math.sin(t*9)*18*s;hl=[-sx-4*s+sw3,shY+52*s];hr=[sx+4*s-sw3,shY+52*s];if(m==='walkO')hr=[R*.18,R*.6]}
  else if(m==='stink'){hl=[-3*s,14*s];hr=[sx+22*s,shY-40*s+Math.sin(t*15+k.ph)*10*s]}
  else if(m==='67'){var u=Math.sin(t*11+k.ph)*14*s;hl=[-sx-16*s,shY+16*s+u];hr=[sx+16*s,shY+16*s-u];pa=true}
  else{var sw2=Math.sin(t*1.6+k.ph)*4*s;hl=[-sx-7*s+sw2,shY+54*s];hr=[sx+7*s-sw2,shY+54*s]}
  var back=m==='groan'||m==='stink'||m==='walkO';if(!back){arm(g,-sx,shY,hl[0],hl[1],-1,s,k,pa);arm(g,sx,shY,hr[0],hr[1],1,s,k,pa)}
  g.save();if(m==='67')g.rotate(Math.sin(t*5.5)*.06);g.drawImage(hs.c,-(HR+50)*s,-(HR+68)*s,hs.w,hs.h);
  var blink=((t+k.ph*3)%k.bp)<.13,lx=bx==null?0:clamp((bx-k.x)/300,-1,1)*3.5*s,ly=bx==null?0:clamp((by-k.hy)/300,-1,1)*3*s;
  // eyebrows
  g.strokeStyle=k.hs==='buzz'||k.hs==='beanie'||k.hs==='cap'?'#3a2414':k.hair;g.lineWidth=3*s;g.lineCap='round';g.beginPath();
  if(m==='groan'){g.moveTo(-27*s,-15*s);g.lineTo(-11*s,-21*s);g.moveTo(11*s,-21*s);g.lineTo(27*s,-15*s)}else if(m==='stink'){g.moveTo(-27*s,-18*s);g.lineTo(-10*s,-13*s);g.moveTo(10*s,-13*s);g.lineTo(27*s,-18*s)}
  else{var eb=(m==='cheer'||m==='excite'||m==='67')?-4*s:0;g.moveTo(-27*s,-15*s+eb);g.quadraticCurveTo(-18*s,-21*s+eb,-10*s,-16*s+eb);g.moveTo(10*s,-16*s+eb);g.quadraticCurveTo(18*s,-21*s+eb,27*s,-15*s+eb)}g.stroke();
  // big eyes
  g.strokeStyle='#2a1a10';g.lineWidth=2.4*s;
  if(blink||m==='stink'||(m==='cheer'&&k.i%3===0)){g.beginPath();g.moveTo(-27*s,3*s);g.quadraticCurveTo(-18*s,-6*s,-9*s,3*s);g.moveTo(9*s,3*s);g.quadraticCurveTo(18*s,-6*s,27*s,3*s);g.stroke()}
  else{g.fillStyle='#fff';g.beginPath();g.ellipse(-18*s,2*s,10.5*s,12.5*s,0,0,2*PI);g.moveTo(28.5*s,2*s);g.ellipse(18*s,2*s,10.5*s,12.5*s,0,0,2*PI);g.fill();g.stroke();
   g.fillStyle='#2a1a10';g.beginPath();g.arc(-18*s+lx,3*s+ly,6.6*s,0,2*PI);g.moveTo(18*s+lx+6.6*s,3*s+ly);g.arc(18*s+lx,3*s+ly,6.6*s,0,2*PI);g.fill();
   g.fillStyle='#fff';g.beginPath();g.arc(-20*s+lx,0+ly,2.3*s,0,2*PI);g.moveTo(16*s+lx+2.3*s,ly);g.arc(16*s+lx,ly,2.3*s,0,2*PI);g.fill();
   if(k.lash){g.beginPath();g.moveTo(-27*s,-5*s);g.lineTo(-31*s,-9*s);g.moveTo(27*s,-5*s);g.lineTo(31*s,-9*s);g.stroke()}}
  // mouth (gap-tooth grins)
  g.strokeStyle='#2a1a10';g.lineWidth=2.4*s;g.fillStyle='#7a1e2a';
  function grin(w,d,y0){g.save();g.beginPath();g.moveTo(-w,y0);g.quadraticCurveTo(0,y0+d*1.9,w,y0);g.closePath();g.fill();g.clip();g.fillStyle='#fff';g.fillRect(-w,y0-1*s,w-2.2*s,6*s);g.fillRect(2.2*s,y0-1*s,w-2.2*s,6*s);g.fillStyle='#ff8a9a';g.beginPath();g.ellipse(0,y0+d*.95,w*.5,d*.32,0,0,2*PI);g.fill();g.restore();
   g.beginPath();g.moveTo(-w,y0);g.quadraticCurveTo(0,y0+d*1.9,w,y0);g.closePath();g.stroke()}
  if(m==='cheer'||m==='excite'||m==='67')grin(15*s,16*s,20*s);
  else if(m==='stink'){g.beginPath();g.moveTo(-12*s,25*s);for(var q=0;q<4;q++)g.quadraticCurveTo(-9*s+q*6*s,(q%2?21:29)*s,-6*s+q*6*s,25*s);g.stroke();g.fillStyle='#ff7a90';g.beginPath();g.ellipse(4*s,30*s,4*s,5*s,0,0,2*PI);g.fill();g.stroke()}
  else if(m==='lean'||m==='walkO'){g.beginPath();g.ellipse(0,27*s,5*s,6.5*s,0,0,2*PI);g.fill();g.stroke()}
  else if(m==='groan'){g.beginPath();g.ellipse(0,29*s,8*s,10*s,0,0,2*PI);g.fill();g.stroke()}
  else if(m==='sad'){g.beginPath();g.moveTo(-10*s,31*s);g.quadraticCurveTo(0,22*s,10*s,31*s);g.stroke()}
  else grin(12*s,9*s,21*s);
  g.restore();
  if(back){arm(g,-sx,shY,hl[0],hl[1],-1,s,k,false);arm(g,sx,shY,hr[0],hr[1],1,s,k,false)}
  g.restore()}
function crowd(m,dur){CR.prev=CR.mode;CR.mode=m;CR.t=0;CR.dur=dur||0;CR.count[m]=(CR.count[m]||0)+1}
function updCrowd(dt){CR.t+=dt;if(CR.bub){CR.bub.t+=dt;if(CR.bub.t>2.6)CR.bub=null}if(CR.dur&&CR.t>CR.dur){CR.prev=CR.mode;CR.mode='idle';CR.t=0;CR.dur=0}}
function maySix(p,delay){if(SIM||rnd()>p||gt-CR.lastSix<18)return false;CR.lastSix=gt;after(delay||0,doSix);return true}
function doSix(){var ids=KIDS.map(function(k){return k.i}).sort(function(){return rnd()-.5}).slice(0,3+((rnd()*2)|0));CR.sixKids=ids;crowd('six',2.8);CR.six++;
 var k=KIDS[ids.slice().sort(function(a,b){return KIDS[a].x-KIDS[b].x})[0]];CR.bub={x:clamp(k.x+40,110,1380),y:clamp(k.hy-120*k.s-20,110,700),t:0};CSND.six()}
function crowdEv(e){if(SIM)return;
 if(e==='ooh')CSND.ooh();
 else if(e==='near'){crowd('groan',1.9);CSND.aww(true);maySix(.3,1.2)}
 else if(e==='miss'){crowd('sad',1.2);CSND.aww(false)}
 else if(e==='score'){crowd('cheer',3.2);CSND.cheer(true);KIDS.slice().sort(function(){return rnd()-.5}).slice(0,4).forEach(function(k){confetti(k.x,k.hy-40,8)});maySix(.65,1.1)}
 else if(e==='blowout'){crowd('excite',2.2);CSND.cheer(false);maySix(.35,.9)}
 else if(e==='mouse'){crowd('excite',3)}
 else if(e==='mouseCheer'){crowd('cheer',2.4);CSND.cheer(false)}}
function drawCrowdFX(g,t){var b=CR.bub;if(!b)return;var k=clamp(b.t/.25,0,1),sc=(b.t<.25?ease(k)*1.2:1+.12*Math.sin(b.t*14))*(b.t>2.3?clamp((2.6-b.t)/.3,0,1):1);if(sc<=0)return;
 g.save();g.translate(b.x,b.y);g.scale(sc,sc);g.rotate(Math.sin(b.t*9)*.06);g.fillStyle='#fff';g.strokeStyle='#2a1a10';g.lineWidth=4;g.beginPath();g.ellipse(0,0,92,52,0,0,2*PI);g.moveTo(-30,40);g.lineTo(-52,82);g.lineTo(-6,48);g.fill();g.stroke();g.fill();
 g.font='58px '+MK;g.textAlign='center';g.textBaseline='middle';g.lineWidth=7;g.strokeStyle='#3a1d00';var txt='6-7!',cols=['#e8342a','#ff7a1a','#f2b705','#2f9a3a'],w=g.measureText(txt).width,x=-w/2;
 for(var i=0;i<txt.length;i++){var cw=g.measureText(txt[i]).width,yy=Math.sin(b.t*12+i)*5;g.strokeText(txt[i],x+cw/2,yy+2);g.fillStyle=cols[i%4];g.fillText(txt[i],x+cw/2,yy+2);x+=cw}g.restore();g.textAlign='left';g.textBaseline='alphabetic'}
/* rainbow "Arcade Game Day" banner + paper stars (pre-rendered into the back layer) */
var FGR=[[-60,640,540,400],[925,TOP-34,200,420],[1395,400,170,620]];
function fgPatch(g,sx,sy){// re-draw only the front-layer pieces that overlap the crowd (cheap vs a full-screen blit)
 var ox=Math.round((-BGM+sx)*DPR),oy=Math.round((-BGM+sy)*DPR)+BG1Y,cw=BG1.width,ch=BG1.height;
 var L=FA.on&&FA.x>380?FGR.concat([[Math.max(440,FA.x-70),TOP-34,140,360]]):FGR;for(var i=0;i<L.length;i++){var r=L[i],x0=Math.max(0,Math.floor(DPR*(OX+BGM+r[0]*S))),y0=Math.max(0,Math.floor(DPR*(OY+BGM+r[1]*S))-BG1Y),x1=Math.min(cw,Math.ceil(DPR*(OX+BGM+(r[0]+r[2])*S))),y1=Math.min(ch,Math.ceil(DPR*(OY+BGM+(r[1]+r[3])*S))-BG1Y);
  if(x1>x0&&y1>y0)g.drawImage(BG1,x0,y0,x1-x0,y1-y0,x0+ox,y0+oy,x1-x0,y1-y0)}}
function drawBench(g){// low cafeteria bench the back row stands on (back layer, behind the kids)
 var y=BACK-2;g.fillStyle='rgba(0,0,0,.22)';g.fillRect(-60,y+16,525,8);g.fillStyle='#8a5a32';g.strokeStyle='#4a2c14';g.lineWidth=3;[30,200,380].forEach(function(x){g.fillRect(x,y+14,16,660-y);g.strokeRect(x,y+14,16,660-y)});
 g.fillStyle='#b27a46';g.beginPath();g.rect(-60,y,525,16);g.fill();g.stroke();g.fillStyle='rgba(255,255,255,.25)';g.fillRect(-60,y+3,525,3)}
function drawLunch(g){// cafeteria lunch table + bench that hides the crowd's legs
 var y=652;g.fillStyle='rgba(0,0,0,.18)';g.fillRect(-60,y+30,525,10);
 g.fillStyle='#9fb6d0';g.fillRect(-60,y+20,525,TABLE-y-20);g.fillStyle='rgba(255,255,255,.35)';for(var x=-60;x<465;x+=36)g.fillRect(x,y+20,18,TABLE-y-20);for(var yy=y+38;yy<TABLE;yy+=36)g.fillRect(-60,yy,525,18);
 g.strokeStyle='#5d6f86';g.lineWidth=3;g.beginPath();g.moveTo(-60,y+22);for(x=-60;x<=465;x+=30)g.quadraticCurveTo(x+15,y+34,x+30,y+22);g.stroke();
 g.fillStyle='#c9d3e0';g.strokeStyle='#4a5260';g.lineWidth=4;g.beginPath();g.rect(-60,y,525,24);g.fill();g.stroke();
 g.fillStyle='rgba(255,255,255,.45)';g.fillRect(-60,y+3,525,5);
 [[60,'#e2463a'],[175,'#f6c445'],[300,'#3aa65a']].forEach(function(o){g.fillStyle=o[1];g.strokeStyle='#3a2414';g.lineWidth=3;g.beginPath();g.rect(o[0],y-18,34,20);g.fill();g.stroke();g.fillStyle='#fff';g.fillRect(o[0]+4,y-14,10,6)});
}
function drawBanner(g){var x0=1072,y0=66,w=412,h=72,r=rng(29);g.save();g.fillStyle='#fffdf4';g.strokeStyle='#c9b98a';g.lineWidth=2;g.beginPath();g.moveTo(x0,y0);g.lineTo(x0+w,y0);g.lineTo(x0+w,y0+h);
 for(var x=x0+w;x>x0;x-=24)g.quadraticCurveTo(x-12,y0+h+10,x-24,y0+h);g.closePath();g.fill();g.stroke();g.strokeStyle='#888';g.beginPath();g.moveTo(x0,y0);g.lineTo(x0-14,y0-30);g.moveTo(x0+w,y0);g.lineTo(x0+w+14,y0-30);g.stroke();
 var t='ARCADE GAME DAY',cols=['#e8342a','#ff7a1a','#f2b705','#2f9a3a','#1f6fd1','#7a4bc4'];g.font='34px '+MK;g.textBaseline='middle';var tw=0;for(var i=0;i<t.length;i++)tw+=g.measureText(t[i]).width;var x1=x0+(w-tw)/2,ci=0;
 for(i=0;i<t.length;i++){var c=t[i],cw=g.measureText(c).width;if(c!==' '){g.save();g.translate(x1+cw/2,y0+h/2+(r()-.5)*6);g.rotate((r()-.5)*.2);g.lineWidth=5;g.strokeStyle='#2a1a10';g.strokeText(c,-cw/2,0);g.fillStyle=cols[ci++%6];g.fillText(c,-cw/2,0);g.restore()}x1+=cw}
 function star(x,y,rr,col){g.fillStyle=col;g.strokeStyle='#2a1a10';g.lineWidth=2;g.beginPath();for(var k=0;k<10;k++){var a=-PI/2+k*PI/5,q=k%2?rr*.45:rr;g.lineTo(x+Math.cos(a)*q,y+Math.sin(a)*q)}g.closePath();g.fill();g.stroke()}
 star(x0-8,y0+h/2,16,'#f2b705');star(x0+w+8,y0+h/2,16,'#f2b705');
 [[60,40,'#f2b705'],[180,26,'#ff6fb5'],[330,46,'#14a3a3'],[470,30,'#f2b705'],[640,44,'#ff7a1a'],[840,28,'#9acd32']].forEach(function(s){g.strokeStyle='rgba(255,255,255,.5)';g.lineWidth=1.5;g.beginPath();g.moveTo(s[0],-60);g.lineTo(s[0],s[1]);g.stroke();star(s[0],s[1]+12,13,s[2])});g.restore()}
/* ---- Meadow Brook Mouse (original drawing from the family's description) ---- */
function sprMouse(){return defSpr('mouse',210,240,function(g){g.translate(105,232);var ol='#1a1a1a',fur='#d6d6dc',lt='#f2f2f5';g.lineJoin='round';g.lineCap='round';
 g.strokeStyle='#c9a0a8';g.lineWidth=6;g.beginPath();g.moveTo(22,-30);g.bezierCurveTo(70,-20,90,-70,72,-90);g.stroke();
 g.strokeStyle=ol;g.lineWidth=3.5;g.fillStyle=lt;[-1,1].forEach(function(s){g.beginPath();g.ellipse(s*18,-6,20,9,0,0,2*PI);g.fill();g.stroke();g.fillStyle=fur;g.beginPath();g.rect(s*18-8,-34,16,26);g.fill();g.stroke();g.fillStyle=lt});
 [-1,1].forEach(function(s){g.strokeStyle=ol;g.lineWidth=17;g.beginPath();g.moveTo(s*26,-92);g.lineTo(s*72,-118);g.stroke();g.strokeStyle=fur;g.lineWidth=11;g.beginPath();g.moveTo(s*26,-92);g.lineTo(s*72,-118);g.stroke();
  g.fillStyle=lt;g.strokeStyle=ol;g.lineWidth=3;g.beginPath();g.arc(s*80,-122,11,0,2*PI);g.fill();g.stroke();for(var f=0;f<4;f++){var a=-PI/2+s*(-.9+f*.55);g.beginPath();g.ellipse(s*80+Math.cos(a)*13,-122+Math.sin(a)*13,4.5,7,a+PI/2,0,2*PI);g.fill();g.stroke()}});
 g.fillStyle='#111';g.strokeStyle=ol;g.lineWidth=3.5;g.beginPath();g.moveTo(-30,-100);g.quadraticCurveTo(0,-108,30,-100);g.lineTo(36,-32);g.quadraticCurveTo(0,-26,-36,-32);g.closePath();g.fill();g.stroke();
 g.fillStyle='#fff';g.textAlign='center';g.font='bold 22px "Arial Black",system-ui,sans-serif';g.fillText('MBE',0,-66);g.font='bold 9px system-ui,sans-serif';g.fillText('BE A HERO!',0,-50);
 [-1,1].forEach(function(s){g.fillStyle=fur;g.strokeStyle=ol;g.lineWidth=3.5;g.beginPath();g.arc(s*42,-190,31,0,2*PI);g.fill();g.stroke();g.fillStyle='#f7a8be';g.beginPath();g.arc(s*42,-189,19,0,2*PI);g.fill();
  g.strokeStyle='#c76b86';g.lineWidth=2;g.beginPath();g.arc(s*42,-189,12,PI*(s>0?1.1:-.1),PI*(s>0?1.7:.5));g.stroke()});
 g.fillStyle=fur;g.strokeStyle=ol;g.lineWidth=3.5;g.beginPath();g.ellipse(0,-146,44,40,0,0,2*PI);g.fill();g.stroke();g.fillStyle=lt;g.beginPath();g.ellipse(0,-130,30,20,0,0,2*PI);g.fill();
 g.fillStyle='#111';[-1,1].forEach(function(s){g.beginPath();g.ellipse(s*15,-158,6,9,0,0,2*PI);g.fill()});g.fillStyle='#fff';[-1,1].forEach(function(s){g.beginPath();g.arc(s*15+2,-162,2.5,0,2*PI);g.fill()});
 g.fillStyle='#7a1e1e';g.strokeStyle=ol;g.lineWidth=3;g.beginPath();g.moveTo(-24,-134);g.quadraticCurveTo(0,-100,24,-134);g.quadraticCurveTo(0,-128,-24,-134);g.fill();g.stroke();g.fillStyle='#ff8aa0';g.beginPath();g.ellipse(0,-116,9,5,0,0,2*PI);g.fill();
 g.fillStyle='#2a2a2a';g.beginPath();g.ellipse(0,-140,8,6,0,0,2*PI);g.fill();g.fillStyle='#fff';g.beginPath();g.arc(-2,-142,1.8,0,2*PI);g.fill();
 g.strokeStyle=ol;g.lineWidth=1.5;[-1,1].forEach(function(s){for(var w=-1;w<=1;w++){g.beginPath();g.moveTo(s*12,-138+w*3);g.lineTo(s*44,-142+w*8);g.stroke()}})})}
var MS={on:false,t:0,x:-150,y:TABLE,dir:1,bub:0,hop:0,stay:false},AS={on:false,shot:null,q:null,res:null,path:null,orig:null},lvMiss=0,lvLost=0,stickerURL=null;
function needHelp(){return !AS.on&&state==='aim'&&!titleOn&&(lvLost>=2||lvMiss>=6)}
function updHelp(){var b=$('help'),v=needHelp()?'flex':'none';if(b.style.display!==v)b.style.display=v}
function startMouse(){if(state!=='aim'||AS.on)return;aInit();state='mouse';AS.on=true;MS.on=true;MS.t=0;MS.stay=false;MS.spd=1;$('help').style.display='none';$('skip').style.display='block';CSND.squeak();crowdEv('mouse');MS.done={}}
function assistGeom(){ // clear the path: remove obstacles + movers (keep ledges), freeze + widen the hole
 statics.slice().forEach(function(b){if(b.isLedge)return;dust(b.position.x,b.position.y,6);Composite.remove(world,b);statics.splice(statics.indexOf(b),1)});
 movers.forEach(function(b){dust(b.position.x,b.position.y,6);Composite.remove(world,b)});movers=[];FANL=FANL.filter(function(f){return statics.indexOf(f)>=0});
 if(HOLE.mv){var m=HOLE.mv;HOLE.mv=null;setHole(m[0]-m[2]/2-15,m[0]+m[2]/2+15)}else setHole(HOLE.y0-30,HOLE.y1)}
function tossDeb(b){if(b.isStatic)Body.setStatic(b,false);b.collisionFilter={group:0,category:2,mask:0};Sleeping.set(b,false);Body.setVelocity(b,{x:2+rnd()*5,y:-30-rnd()*8});Body.setAngularVelocity(b,(rnd()-.5)*.6);b.gone=gt;flying.push(b);debris.splice(debris.indexOf(b),1);dust(b.position.x,FLOOR,4)}
function simBall(deg,p,rec){var a=deg*PI/180,v=9+25*p,b=mkBall(LX,LY);SIMB=true;Composite.add(world,b);Body.setVelocity(b,{x:Math.cos(a)*v,y:-Math.sin(a)*v});
 var px=LX,res=0,still=0,path=rec?[]:null;for(var i=0;i<460;i++){Engine.update(engine,FIXED);fanStep(b,true);try{toyStep._did=0;toyStep(b,true)}catch(e){}if(portalTP(b,true))px=b.position.x;var q=b.position;if(rec&&i%4===0)path.push({x:q.x,y:q.y});
  var inS=false;for(var j=0;j<shreds.length;j++){var sh=shreds[j];if(q.x>sh.x0-5&&q.x<sh.x1+5&&q.y>FLOOR-sh.h)inS=true}b.frictionAir=inS?.045:.004;
  if(q.x>BX0+20&&px<=BX0+20&&q.y>HOLE.y0-6&&q.y<HOLE.y1+6){res=1;break}px=q.x;if(Body.getSpeed(b)<.3){if(++still>70)break}else still=0;if(q.y>TABLE+200||q.x<-280)break}
 Composite.remove(world,b);SIMB=false;return rec?{res:res,path:path}:res}
function assistQueue(){AS.q=[];AS.res={};for(var a=-8;a<=34;a+=3)for(var p=.35;p<=1.001;p+=.08)AS.q.push([a,+p.toFixed(2)])}
function assistStep(n){while(n-->0&&AS.q&&AS.q.length){var c=AS.q.shift();AS.res[c[0]+','+c[1]]=simBall(c[0],c[1])}
 if(AS.q&&!AS.q.length){AS.q=null;var best=null,bs=-1;for(var k in AS.res){if(!AS.res[k])continue;var c2=k.split(',').map(Number),sc=0;
  [[3,0],[-3,0],[0,.08],[0,-.08],[3,.08],[-3,-.08]].forEach(function(o){if(AS.res[(c2[0]+o[0])+','+(+(c2[1]+o[1]).toFixed(2))])sc++});if(sc>bs){bs=sc;best=c2}}
  if(!best){setHole(HOLE.y0-30,HOLE.y1);assistQueue();return false}AS.shot={deg:best[0],p:best[1],robust:bs};AS.path=simBall(best[0],best[1],true).path;return true}return false}
function mousePos(t){ // scripted scurry: run on the table, hop through the oval, sweep the box floor, hop back out, watch from the left
 var seg=[[0,.9,'run',-150,380,TABLE],[.9,1.5,'hop',380,600,TABLE,FLOOR],[1.5,3.1,'run',600,1290,FLOOR],[3.1,3.7,'wave',1290,1290,FLOOR],[3.7,4.7,'run',1290,620,FLOOR],[4.7,5.3,'hop',620,380,FLOOR,TABLE],[5.3,5.9,'run',380,70,TABLE]];
 for(var i=0;i<seg.length;i++){var s=seg[i];if(t<s[1]){var k=(t-s[0])/(s[1]-s[0]);if(s[2]==='hop')return{x:lerp(s[3],s[4],k),y:lerp(s[5],s[6],k)-Math.sin(PI*k)*270,dir:s[4]>s[3]?1:-1,a:'hop'};return{x:lerp(s[3],s[4],k),y:s[5],dir:s[4]>=s[3]?1:-1,a:s[2]}}}
 return{x:70,y:TABLE,dir:1,a:'stay'}}
function updMouse(dt){if(!MS.on)return;if(state==='mouse'){MS.t+=dt*(EX.speed>1?3:1);var p=mousePos(MS.t);MS.x=p.x;MS.y=p.y;MS.dir=p.dir;MS.a=p.a;
  if(MS.t>1.5&&MS.t<3.1){debris.slice().forEach(function(b){if(Math.abs(b.position.x-MS.x)<70)tossDeb(b)});if(lim('msq',600))CSND.squeak()}
  if(MS.t>=3.1&&!MS.done.geom){MS.done.geom=1;debris.slice().forEach(tossDeb);assistGeom();sparks(BX0,(HOLE.y0+HOLE.y1)/2,16,'#ffe27a');crowdEv('mouseCheer');assistQueue()}
  if(AS.q)assistStep(3);
  if(MS.t>=5.9&&!AS.q&&AS.shot){state='aim';drag=null;EX.speed=1;$('skip').style.display='none';hud()}}
 else{MS.x=70;MS.y=TABLE;MS.a=(CR.mode==='cheer'||CR.mode==='six')?'wave':'stay'}}
function drawMouse(g,t){if(!MS.on)return;var s=spr('mouse'),run=MS.a==='run',bob=run?-Math.abs(Math.sin(t*22))*10:MS.a==='wave'?-Math.abs(Math.sin(t*8))*16:Math.sin(t*2)*2,sq=run?1+Math.sin(t*22)*.04:1,sc=MS.on&&MS.a==='stay'?.62:.72;
 g.save();g.translate(MS.x,MS.y+bob);g.scale(MS.dir*sc/sq,sc*sq);if(MS.a==='hop')g.rotate(-.25);g.drawImage(s.c,-105,-232,s.w,s.h);g.restore();
 if(state==='mouse'&&MS.t>1.0&&MS.t<4.4){var bx=clamp(MS.x+30,260,1180),by=Math.max(150,MS.y-230);g.save();g.translate(bx,by);g.fillStyle='#fff';g.strokeStyle='#1a1a1a';g.lineWidth=3;g.beginPath();g.roundRect?g.roundRect(-10,-74,320,78,18):g.rect(-10,-74,320,78);g.moveTo(20,4);g.lineTo(0,30);g.lineTo(46,4);g.fill();g.stroke();g.fill();
  g.fillStyle='#1f3a6e';g.font='22px '+MK;g.fillText('Meadow Brook Mouse',8,-44);g.fillText('to the rescue! Be a hero!',8,-14);g.restore()}}
function drawAssist(g,t){if(!AS.on||!AS.path||state!=='aim')return;g.save();for(var i=0;i<AS.path.length;i+=2){var q=AS.path[i];g.globalAlpha=.55+.4*Math.sin(t*6-i*.3);g.fillStyle='#ffd21a';g.strokeStyle='#6b3d00';g.lineWidth=2;g.beginPath();g.arc(q.x,q.y,6,0,2*PI);g.fill();g.stroke()}g.globalAlpha=1;
 var a=AS.shot.deg*PI/180,L=AS.shot.p*120;g.strokeStyle='#ffd21a';g.lineWidth=6;g.setLineDash([10,8]);g.beginPath();g.moveTo(LX,LY);g.lineTo(LX-Math.cos(a)*L,LY+Math.sin(a)*L);g.stroke();g.setLineDash([]);
 var px=LX-Math.cos(a)*L,py=LY+Math.sin(a)*L;g.beginPath();g.arc(px,py,14+3*Math.sin(t*6),0,2*PI);g.stroke();g.font='22px '+MK;g.fillStyle='#ffd21a';g.lineWidth=5;g.strokeStyle='#3a1d00';
 var tx='🐭 Pull back like the gold arrow: '+AS.shot.deg+'°, power '+Math.round(AS.shot.p*10);g.font='26px '+MK;g.textAlign='center';var tw=g.measureText(tx).width;g.fillStyle='rgba(255,248,225,.94)';g.strokeStyle='#6b4520';g.lineWidth=3;g.beginPath();g.rect(900-tw/2-16,TOP+22,tw+32,46);g.fill();g.stroke();g.fillStyle='#21571f';g.fillText(tx,900,TOP+55);g.restore()}
function assistSnap(A){if(!AS.on||!AS.shot)return A;if(Math.abs(A.ang-AS.shot.deg)<8&&Math.abs(A.p-AS.shot.p)<.16)return{ang:AS.shot.deg,p:AS.shot.p,snap:true,len:A.len};return A}
function stickerImg(){if(stickerURL)return stickerURL;var c=mkc(120,136),g=c.getContext('2d'),K0=K;g.fillStyle='#fff';g.beginPath();g.arc(60,68,58,0,2*PI);g.fill();g.strokeStyle='#ffd21a';g.lineWidth=5;g.stroke();
 var s=spr('mouse');g.drawImage(s.c,10,14,100,114);try{stickerURL=c.toDataURL()}catch(e){stickerURL=''}return stickerURL}
