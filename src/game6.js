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
/* ---- kids ---- */
var SKIN=['#f6d2b5','#eab68f','#c98e5e','#a86b3c','#7a4a28','#5a3620'],HAIR=['#2b1a10','#5a3a1a','#c98b3a','#e8c36a','#1a1a1a','#8a3a1a','#d06a2a'],SHIRT=['#e8342a','#1f6fd1','#2f9a3a','#f2b705','#7a4bc4','#ff7a1a','#14a3a3','#ff6fb5','#3a3a8a','#9acd32'];
var KDEF=[[55,418,.54],[165,412,.56],[275,420,.53],[385,414,.55],[110,478,.64],[222,472,.66],[338,480,.63],[992,TOP-58,.62],[1060,TOP-50,.58],[1462,560,.62]];
var KIDS=KDEF.map(function(d,i){var r=rng(i*31+7);return{i:i,x:d[0],hy:d[1],s:d[2],skin:SKIN[(r()*6)|0],hair:HAIR[(r()*7)|0],hs:(r()*6)|0,shirt:SHIRT[i%10],gl:r()<.2,ph:r()*6,dl:r()*.25,bp:2+r()*3,deco:(r()*3)|0,dir:d[0]<1000?1:-1}});
var CR={mode:'idle',prev:'idle',t:0,dur:0,six:0,lastSix:-99,sixKids:[],bub:null,count:{}};
function kidHead(k){var R=48;return defSpr('kh'+k.i,(R*2+50)*k.s,(R*2+70)*k.s,function(g,w,h){g.scale(k.s,k.s);g.translate(R+25,R+40);var ol='#3a2414';
 if(k.hs===3){g.fillStyle=k.hair;g.beginPath();g.ellipse(0,14,R+8,R+20,0,0,2*PI);g.fill()}
 if(k.hs===2){g.fillStyle=k.hair;g.beginPath();g.ellipse(R+6,0,13,26,.5,0,2*PI);g.fill()}
 g.fillStyle=k.skin;g.strokeStyle=ol;g.lineWidth=3;[-1,1].forEach(function(sd){g.beginPath();g.arc(sd*R*.96,4,11,0,2*PI);g.fill();g.stroke()});
 g.beginPath();g.arc(0,0,R,0,2*PI);g.fill();g.stroke();
 g.fillStyle=k.hair;g.beginPath();
 if(k.hs===1){for(var a=PI*1.02;a<=PI*1.98;a+=.2){g.moveTo(Math.cos(a)*R*.95,Math.sin(a)*R*.85);g.arc(Math.cos(a)*R*.92,Math.sin(a)*R*.86,15,0,2*PI)}g.fill()}
 else if(k.hs===4){g.moveTo(-R,-6);for(var j=0;j<=6;j++){var x=-R+j*R/3;g.lineTo(x,-R*.75-(j%2?22:0)-(j===3?8:0))}g.lineTo(R,-6);g.quadraticCurveTo(0,-R*.55,-R,-6);g.fill()}
 else{g.arc(0,0,R+3,PI*1.05,PI*1.95);g.quadraticCurveTo(R*.3,-R*.45,-R*.2,-R*.5);g.quadraticCurveTo(-R*.7,-R*.35,-R*1.0,-R*.25);g.closePath();g.fill();
  if(k.hs===5){g.beginPath();g.arc(0,-R-10,17,0,2*PI);g.fill()}}
 g.fillStyle='rgba(255,110,120,.28)';g.beginPath();g.ellipse(-28,14,9,6,0,0,2*PI);g.ellipse(28,14,9,6,0,0,2*PI);g.fill();
 if(k.gl){g.strokeStyle='#222';g.lineWidth=2.5;g.beginPath();g.arc(-17,-2,13,0,2*PI);g.moveTo(30,-2);g.arc(17,-2,13,0,2*PI);g.moveTo(-4,-2);g.lineTo(4,-2);g.stroke()}})}
function kidTorso(k){return defSpr('kt'+k.i,140*k.s,340*k.s,function(g){g.scale(k.s,k.s);g.translate(70,0);g.fillStyle=k.skin;g.fillRect(-12,0,24,26);
 g.fillStyle=k.shirt;g.strokeStyle='rgba(0,0,0,.3)';g.lineWidth=3;g.beginPath();g.moveTo(-16,14);g.quadraticCurveTo(-62,18,-64,56);g.lineTo(-58,340);g.lineTo(58,340);g.lineTo(64,56);g.quadraticCurveTo(62,18,16,14);g.quadraticCurveTo(0,30,-16,14);g.closePath();g.fill();g.stroke();
 g.fillStyle='rgba(255,255,255,.85)';if(k.deco===0){g.fillRect(-60,90,120,14);g.fillRect(-60,124,120,14)}else if(k.deco===1){g.beginPath();for(var i=0;i<10;i++){var a=-PI/2+i*PI/5,rr=i%2?9:22;g.lineTo(Math.cos(a)*rr,110+Math.sin(a)*rr)}g.fill()}else{g.beginPath();g.arc(0,110,16,0,2*PI);g.fill()}})}
function kidMode(k){var m=CR.t<k.dl?CR.prev:CR.mode;if(m==='six')return CR.sixKids.indexOf(k.i)>=0?'67':'cheer';if(m==='idle'&&state==='fly')return'lean';return m}
function arm(g,sx,sy,tx,ty,side,s,col,skin,palm){var L1a=50*s,L2a=48*s,dx=tx-sx,dy=ty-sy,d=clamp(Math.hypot(dx,dy),10,L1a+L2a-1),a=Math.atan2(dy,dx),c=(L1a*L1a+d*d-L2a*L2a)/(2*L1a*d),b=Math.acos(clamp(c,-1,1));
 var e1=a+b*side,ex=sx+Math.cos(e1)*L1a,ey=sy+Math.sin(e1)*L1a,hx=sx+Math.cos(a)*d,hy=sy+Math.sin(a)*d;
 g.lineCap='round';g.strokeStyle=col;g.lineWidth=17*s;g.beginPath();g.moveTo(sx,sy);g.lineTo(ex,ey);g.stroke();g.strokeStyle=skin;g.lineWidth=13*s;g.beginPath();g.moveTo(ex,ey);g.lineTo(hx,hy);g.stroke();
 g.fillStyle=skin;g.beginPath();if(palm)g.ellipse(hx,hy,14*s,6*s,0,0,2*PI);else g.arc(hx,hy,9*s,0,2*PI);g.fill()}
function drawKids(g,t){var bx=ball?ball.position.x:null,by=ball?ball.position.y:0;
 for(var i=0;i<KIDS.length;i++){var k=KIDS[i],m=kidMode(k),s=k.s,R=48*s,bob=Math.sin(t*1.6+k.ph)*3*s,sway=Math.sin(t*.8+k.ph)*.035,lean=0,jy=0,ar;
  if(m==='lean'){lean=.09*k.dir;bob*=.4}else if(m==='cheer'){jy=-Math.abs(Math.sin(t*7+k.ph))*26*s}else if(m==='excite'){jy=-Math.abs(Math.sin(t*9+k.ph))*14*s}else if(m==='groan'){jy=8*s;lean=-.04*k.dir}else if(m==='sad'){jy=6*s}else if(m==='67'){jy=-Math.abs(Math.sin(t*5.5))*6*s}
  g.save();g.translate(Math.round((k.x+(sway+lean)*260*s)*4)/4,k.hy+bob+jy);
  var ts=spr(kidTorso(k)),hs=spr(kidHead(k));g.drawImage(ts.c,-70*s,R*.86,ts.w,ts.h);
  var shY=R+28*s,sx=48*s,hl,hr,pa=false;
  if(m==='cheer'){var w=Math.sin(t*10+k.ph)*18*s;hl=[-sx-28*s+w,shY-108*s];hr=[sx+28*s-w,shY-108*s]}
  else if(m==='excite'){var p2=Math.sin(t*12+k.ph)*18*s;hl=[-sx-22*s,shY-92*s+p2];hr=[sx+22*s,shY-92*s-p2]}
  else if(m==='groan'){hl=[-R*.55,-R*.78];hr=[R*.55,-R*.78]}
  else if(m==='lean'){hl=[-10*s,shY+52*s];hr=[10*s,shY+52*s]}
  else if(m==='67'){var u=Math.sin(t*11+k.ph)*22*s;hl=[-sx-26*s,shY+34*s+u];hr=[sx+26*s,shY+34*s-u];pa=true}
  else{var sw2=Math.sin(t*1.6+k.ph)*5*s;hl=[-sx-8*s+sw2,shY+92*s];hr=[sx+8*s-sw2,shY+92*s]}
  var back=m==='groan';if(!back){arm(g,-sx,shY,hl[0],hl[1],-1,s,k.shirt,k.skin,pa);arm(g,sx,shY,hr[0],hr[1],1,s,k.shirt,k.skin,pa)}
  g.save();if(m==='67')g.rotate(Math.sin(t*5.5)*.06);g.drawImage(hs.c,-R-25*s,-R-40*s,hs.w,hs.h);
  var blink=((t+k.ph*3)%k.bp)<.13,lx=bx==null?0:clamp((bx-k.x)/300,-1,1)*3*s,ly=bx==null?0:clamp((by-k.hy)/300,-1,1)*2*s;
  g.fillStyle='#fff';g.strokeStyle='#2a1a10';g.lineWidth=2*s;
  if(blink||m==='groan'){g.beginPath();g.moveTo(-24*s,-2*s);g.lineTo(-10*s,m==='groan'?2*s:-2*s);g.moveTo(10*s,m==='groan'?2*s:-2*s);g.lineTo(24*s,-2*s);g.stroke()}
  else{g.beginPath();g.ellipse(-17*s,-3*s,8*s,9.5*s,0,0,2*PI);g.ellipse(17*s,-3*s,8*s,9.5*s,0,0,2*PI);g.fill();g.fillStyle='#2a1a10';g.beginPath();g.arc(-17*s+lx,-2*s+ly,4.2*s,0,2*PI);g.arc(17*s+lx,-2*s+ly,4.2*s,0,2*PI);g.fill()}
  g.fillStyle='#7a1e1e';g.strokeStyle='#2a1a10';g.lineWidth=2.5*s;g.beginPath();
  if(m==='cheer'||m==='excite'||m==='67'){g.moveTo(-16*s,16*s);g.quadraticCurveTo(0,44*s,16*s,16*s);g.closePath();g.fill();g.fillStyle='#ff8a9a';g.beginPath();g.ellipse(0,29*s,6*s,4*s,0,0,2*PI);g.fill()}
  else if(m==='lean'){g.ellipse(0,22*s,5*s,6.5*s,0,0,2*PI);g.fill()}
  else if(m==='groan'){g.ellipse(0,25*s,8*s,9*s,0,0,2*PI);g.fill()}
  else if(m==='sad'){g.moveTo(-10*s,27*s);g.quadraticCurveTo(0,17*s,10*s,27*s);g.stroke()}
  else{g.moveTo(-12*s,18*s);g.quadraticCurveTo(0,30*s,12*s,18*s);g.stroke()}
  g.restore();
  if(back){arm(g,-sx,shY,hl[0],hl[1],-1,s,k.shirt,k.skin,false);arm(g,sx,shY,hr[0],hr[1],1,s,k.shirt,k.skin,false)}
  g.restore()}}
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
 for(var i=0;i<FGR.length;i++){var r=FGR[i],x0=Math.max(0,Math.floor(DPR*(OX+BGM+r[0]*S))),y0=Math.max(0,Math.floor(DPR*(OY+BGM+r[1]*S))-BG1Y),x1=Math.min(cw,Math.ceil(DPR*(OX+BGM+(r[0]+r[2])*S))),y1=Math.min(ch,Math.ceil(DPR*(OY+BGM+(r[1]+r[3])*S))-BG1Y);
  if(x1>x0&&y1>y0)g.drawImage(BG1,x0,y0,x1-x0,y1-y0,x0+ox,y0+oy,x1-x0,y1-y0)}}
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
 movers.forEach(function(b){dust(b.position.x,b.position.y,6);Composite.remove(world,b)});movers=[];
 if(HOLE.mv){var m=HOLE.mv;HOLE.mv=null;setHole(m[0]-m[2]/2-15,m[0]+m[2]/2+15)}else setHole(HOLE.y0-30,HOLE.y1)}
function tossDeb(b){if(b.isStatic)Body.setStatic(b,false);b.collisionFilter={group:0,category:2,mask:0};Sleeping.set(b,false);Body.setVelocity(b,{x:2+rnd()*5,y:-30-rnd()*8});Body.setAngularVelocity(b,(rnd()-.5)*.6);b.gone=gt;flying.push(b);debris.splice(debris.indexOf(b),1);dust(b.position.x,FLOOR,4)}
function simBall(deg,p,rec){var a=deg*PI/180,v=9+25*p,b=mkBall(LX,LY);SIMB=true;Composite.add(world,b);Body.setVelocity(b,{x:Math.cos(a)*v,y:-Math.sin(a)*v});
 var px=LX,res=0,still=0,path=rec?[]:null;for(var i=0;i<460;i++){Engine.update(engine,FIXED);var q=b.position;if(rec&&i%4===0)path.push({x:q.x,y:q.y});
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
