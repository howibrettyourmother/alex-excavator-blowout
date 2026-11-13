/* ---------- rendering ---------- */
function wrapCanvas(b){if(b.wc&&!b.dirty&&b.wk===K)return b.wc;var w=b.ww,h=b.wh,c=mkc(w*K+2,h*K+2),g=c.getContext('2d');g.scale(K,K);
 g.fillStyle='rgba(215,236,255,.5)';g.strokeStyle='rgba(255,255,255,.85)';g.lineWidth=2;g.beginPath();g.rect(1,1,w-2,h-2);g.fill();g.stroke();
 for(var ix=0;ix*20+10<=w-6;ix++)for(var iy=0;iy*20+10<=h-6;iy++){var x=ix*20+10+((iy&1)?5:0),y=iy*20+10;if(x>w-6)continue;var popped=b.pops.indexOf(ix+','+iy)>=0;
  if(popped){g.strokeStyle='rgba(255,255,255,.7)';g.lineWidth=1.2;g.beginPath();g.moveTo(x-6,y);g.lineTo(x-2,y-3);g.lineTo(x+2,y+2);g.lineTo(x+6,y-1);g.stroke()}
  else{g.beginPath();g.arc(x,y,7.5,0,2*PI);g.fillStyle='rgba(255,255,255,.4)';g.fill();g.strokeStyle='rgba(255,255,255,.75)';g.lineWidth=1;g.stroke();g.fillStyle='#fff';g.beginPath();g.arc(x-3,y-3,1.8,0,2*PI);g.fill()}}
 b.wc=c;b.wk=K;b.dirty=0;return c}
function drawBody(g,b,sc){var p=b.position;g.save();g.translate(p.x,p.y);g.rotate(b.angle);if(sc!=null&&sc<1)g.scale(sc,sc);
 if(b.kind==='wrap'){var c=wrapCanvas(b);g.drawImage(c,-b.ww/2,-b.wh/2,b.ww+2/K,b.wh+2/K)}
 else{var s=b.soggy?wetSpr(b.sk):spr(b.sk);if(s){var o=b.ofs||{x:0,y:0};g.drawImage(s.c,o.x-b.sw/2-2/K,o.y-b.sh/2-2/K,s.w,s.h)}}g.restore()}
function render(t){var sx=0,sy=0;if(shk>.3){sx=(rnd()-.5)*2*shk;sy=(rnd()-.5)*2*shk}
 ctx.setTransform(1,0,0,1,0,0);ctx.drawImage(BG,Math.round((-BGM+sx)*DPR),Math.round((-BGM+sy)*DPR));
 var g=ctx;g.setTransform(DPR*S,0,0,DPR*S,DPR*(OX+sx),DPR*(OY+sy));drawKids(g,t);
 g.setTransform(1,0,0,1,0,0);fgPatch(g,sx,sy);g.setTransform(DPR*S,0,0,DPR*S,DPR*(OX+sx),DPR*(OY+sy));moonSky(g,t);
 // back wall with prize hole
 var y0=HOLE.y0,y1=HOLE.y1;g.fillStyle=CBP;g.save();g.beginPath();g.rect(BX0,TOP,BX1-BX0,y0-TOP);g.rect(BX0,y1,BX1-BX0,FLOOR-y1);g.fill();g.fillStyle='rgba(60,30,5,.25)';g.fill();g.restore();
 var pul=.5+.5*Math.sin(t*5);g.fillStyle='rgba(20,10,0,.85)';g.fillRect(BX0,y0,BX1-BX0,y1-y0);g.strokeStyle='rgba(255,215,60,'+(.5+.5*pul)+')';g.lineWidth=5;g.strokeRect(BX0-2,y0,BX1-BX0+4,y1-y0);
 g.font='26px '+MK;g.fillStyle='#ffde3b';g.textAlign='center';g.fillText('⭐',BX0-24,y0-12+pul*4);g.textAlign='left';
 // chute to prize bin
 if(y1<FLOOR-10){g.fillStyle=CBP;g.beginPath();g.moveTo(BX1,y1);g.lineTo(BX1+70,Math.min(840,y1+60));g.lineTo(BX1+70,Math.min(852,y1+72));g.lineTo(BX1,y1+12);g.fill()}
 for(var i=0;i<shreds.length;i++){var sh=shreds[i],s=spr(sh.sk);if(s)g.drawImage(s.c,sh.x0-15,FLOOR-sh.h,s.w,s.h)}
 for(i=0;i<statics.length;i++)drawBody(g,statics[i],ease(clamp((gt-statics[i].pop0)/.4,0,1)));
 for(i=0;i<movers.length;i++){var m=movers[i];if(m.anchor){g.strokeStyle='#5fd13a';g.lineWidth=5;g.beginPath();g.moveTo(m.anchor.x,m.anchor.y);g.lineTo(m.position.x,m.position.y);g.stroke()}drawBody(g,m,ease(clamp((gt-m.pop0)/.4,0,1)))}
 for(i=0;i<debris.length;i++)drawBody(g,debris[i]);for(i=0;i<flying.length;i++)drawBody(g,flying[i]);
 var gs=spr('gem');for(i=0;i<gems.length;i++){var gm=gems[i];if(gm.got)continue;var tw=Math.sin(t*3+gm.ph);g.save();g.translate(gm.x,gm.y+tw*4);g.rotate(tw*.15);g.drawImage(gs.c,-15,-15,gs.w,gs.h);
  if(tw>.8){g.fillStyle='rgba(255,255,255,'+((tw-.8)*5)+')';g.fillRect(-1,-20,2,10);g.fillRect(-6,-15,12,2)}g.restore()}
 if(ring){ring.w*=.96;var rs=spr('ring'),sw=Math.sin(t*1.6)*.05+ring.w*Math.sin(t*20)*.2;g.strokeStyle='#5fd13a';g.lineWidth=4;g.beginPath();g.moveTo(ring.x,TOP+6);g.lineTo(ring.x,ring.y-34);g.stroke();
  g.save();g.translate(ring.x,ring.y);g.rotate(sw);g.drawImage(rs.c,-42,-42,rs.w,rs.h);g.restore()}
 // ball
 var bs=spr('ball'),bx,by,ba=0;if(ball){bx=ball.position.x;by=ball.position.y;ba=ball.angle;for(i=0;i<trail.length;i++){g.globalAlpha=i/trail.length*.25;g.fillStyle=modeCol();g.beginPath();g.arc(trail[i].x,trail[i].y,ballR()*(.4+.6*i/trail.length),0,2*PI);g.fill()}g.globalAlpha=1}
 else if(state==='aim'){var pb=pullPos();bx=pb.x;by=pb.y}
 drawXB(g,t);if(bx!=null&&!(ball&&ball.burst)){drawBallM(g,bx,by,ba,t,ball);g.fillStyle='rgba(255,255,255,.75)';g.beginPath();g.arc(bx-7,by-8,5,0,2*PI);g.fill()}
 g.globalAlpha=exBusy()||EX.on?.35:1;g.drawImage(CEIL.c,FX0-20,TOP-27,CEIL.w,CEIL.h);g.globalAlpha=1;
 g.drawImage(PANEL.c,PANEL.x,PANEL.y,PANEL.w,PANEL.h);
 g.save();g.translate(296,122);g.rotate(-.025);g.drawImage(SIGN.c,0,0,SIGN.w,SIGN.h);g.restore();
 drawExc(g,t);
 // prize bin front
 g.fillStyle='#d11f1f';g.beginPath();g.moveTo(1398,832);g.lineTo(1506,832);g.lineTo(1500,900);g.lineTo(1404,900);g.closePath();g.fill();g.fillStyle='#ff5a5a';g.fillRect(1398,832,108,8);
 g.font='20px '+MK;g.fillStyle='#fff';g.fillText('PRIZES',1414,872);
 drawMouse(g,t);drawAssist(g,t);drawSling(g,bx,by);drawP(g);drawStink(g,t);drawSlow(g);drawCrowdFX(g,t)}
function pullPos(){if(drag&&state==='aim'){var dx=drag.cx-drag.sx,dy=drag.cy-drag.sy;if(dx<0){var l=Math.hypot(dx,dy),k=Math.min(1,95/(l||1))*.6;return{x:LX+dx*k,y:LY+dy*k}}}return{x:LX,y:LY}}
function aimOf(d){var dx=d.cx-d.sx,dy=d.cy-d.sy,fl=dx>0,vx=fl?dx:-dx,vy=fl?dy:-dy,len=Math.hypot(vx,vy);return{p:clamp(len/230,0,1),ang:clamp(Math.atan2(-vy,vx)*180/PI,-25,75),fl:fl,len:len}}
function drawSling(g,bx,by){var fx=LX,fy=LY+40;
 g.strokeStyle='#d9b27a';g.lineCap='round';g.lineWidth=12;g.beginPath();g.moveTo(fx,TABLE);g.lineTo(fx,fy+30);g.moveTo(fx,fy+30);g.lineTo(fx-28,LY-22);g.moveTo(fx,fy+30);g.lineTo(fx+26,LY-28);g.stroke();
 g.strokeStyle='#b88a50';g.lineWidth=2;g.beginPath();g.moveTo(fx-3,TABLE);g.lineTo(fx-3,fy+30);g.stroke();
 var pulled=state==='aim'&&bx!=null;g.strokeStyle='#ff4fa3';g.lineWidth=5;g.beginPath();g.moveTo(fx-28,LY-22);if(pulled)g.lineTo(bx-BR*.6,by);else g.lineTo(fx,LY+BR*.3);if(pulled)g.lineTo(fx+26,LY-28);else g.lineTo(fx+26,LY-28);g.stroke();
 if(state==='aim'){ // protractor (angle estimation helper)
  g.save();g.globalAlpha=drag?.9:.45;g.strokeStyle='#fff';g.lineWidth=2;g.beginPath();g.arc(LX,LY,110,0,-75*PI/180,true);g.stroke();g.font='14px '+MK;g.fillStyle='#fff';
  for(var a=0;a<=75;a+=15){var r=a*PI/180;g.beginPath();g.moveTo(LX+Math.cos(r)*104,LY-Math.sin(r)*104);g.lineTo(LX+Math.cos(r)*116,LY-Math.sin(r)*116);g.stroke();g.fillText(a+'°',LX+Math.cos(r)*134-10,LY-Math.sin(r)*134+5)}g.restore();
  if(drag){var A=stinkWob(assistSnap(aimOf(drag)));if(A.len>12){var ar=A.ang*PI/180,v=9+25*A.p,vx=Math.cos(ar)*v,vy=-Math.sin(ar)*v,x=LX,y=LY,G=engine.gravity.y*.001*(1000/60)*(1000/60),n=Math.round((LV?LV.pv:.6)*60);
   for(var i=0;i<n;i++){vy+=G;vx*=.996;vy*=.996;x+=vx;y+=vy;if(i%3===0){g.globalAlpha=1-i/n;g.fillStyle='#fff';g.beginPath();g.arc(x,y,5-3*i/n,0,2*PI);g.fill()}}g.globalAlpha=1;
   g.strokeStyle='#ffde3b';g.lineWidth=3;g.beginPath();g.moveTo(LX,LY);g.lineTo(LX+Math.cos(ar)*110,LY-Math.sin(ar)*110);g.stroke();
   var pw=Math.max(1,Math.round(A.p*10));g.font='26px '+MK;g.lineWidth=5;g.strokeStyle='#3a1d00';g.fillStyle=A.snap?'#7dff6a':'#ffde3b';var tx=A.snap?'Perfect! Let go! 🐭':A.stink?'💨 Wobbly! '+Math.round(A.ang)+'°  Power '+pw:'Angle '+Math.round(A.ang)+'°  Power '+pw;g.strokeText(tx,LX-150,LY-150);g.fillText(tx,LX-150,LY-150);
   for(i=0;i<10;i++){g.fillStyle=i<pw?(i<4?'#7fd34a':i<7?'#ffcb05':'#ff5a3a'):'rgba(255,255,255,.25)';g.fillRect(LX-150+i*20,LY-140,16,12)}}}
  else if(!LV._tried){g.font='24px '+MK;g.fillStyle='#fff';g.globalAlpha=.6+.4*Math.sin(performance.now()/300);g.fillText('👆 Pull back & let go!',LX-150,LY+110);g.globalAlpha=1}}}
/* ---------- input ---------- */
function toW(e){return{x:(e.clientX-OX)/S,y:(e.clientY-OY)/S}}
cv.addEventListener('pointerdown',function(e){aInit();if(state==='fly'&&rocketTap()){e.preventDefault();return}if(state!=='aim'||drag)return;var p=toW(e);drag={id:e.pointerId,sx:p.x,sy:p.y,cx:p.x,cy:p.y};try{cv.setPointerCapture(e.pointerId)}catch(x){}e.preventDefault()});
cv.addEventListener('pointermove',function(e){if(!drag||e.pointerId!==drag.id)return;var p=toW(e);drag.cx=p.x;drag.cy=p.y;var A=aimOf(drag);if(A.len>12)SFX.stretch(A.p)});
function release(e,cancel){if(!drag||e.pointerId!==drag.id)return;var d=drag;drag=null;if(cancel||state!=='aim')return;var A=stinkWob(assistSnap(aimOf(d)));if(A.p<.08)return;LV._tried=1;launch(A.ang,A.p)}
cv.addEventListener('pointerup',function(e){release(e)});cv.addEventListener('pointercancel',function(e){release(e,true)});
document.addEventListener('touchmove',function(e){if(e.target===cv)e.preventDefault()},{passive:false});
document.addEventListener('gesturestart',function(e){e.preventDefault()});
/* ---------- resize + loop ---------- */
function resize(){CW=Math.max(1,innerWidth);CH=Math.max(1,innerHeight);DPR=Math.min(window.devicePixelRatio||1,2)*qual;cv.width=Math.round(CW*DPR);cv.height=Math.round(CH*DPR);cv.style.width=CW+'px';cv.style.height=CH+'px';
 S=Math.min(CW/W,CH/H);OX=(CW-W*S)/2;OY=(CH-H*S)/2;K=S*DPR;SPR={};drawBG();mkPanel();mkSign();mkCeil();CBP=ctx.createPattern(CBT,'repeat')}
addEventListener('resize',function(){clearTimeout(resize.t);resize.t=setTimeout(resize,120)});addEventListener('orientationchange',function(){setTimeout(resize,300)});
var last=0,acc=0,FR=[],paused=false,titleOn=true;
function frame(ts){requestAnimationFrame(frame);var dt=Math.min(50,last?ts-last:16.7);last=ts;FR.push(dt);if(FR.length>120)FR.shift();
 if(titleOn){return}
 if(state==='edit'){var se=dt/1000;gt+=se;updTM(se);updP(se);render(ts/1000);drawEdit(ctx,ts/1000);return}
 var sd=dt/1000;updTM(sd);runQ(sd*EX.speed);updP(sd);updCrowd(sd);updMouse(sd);updFart(sd);if(lim('help',250))updHelp();shk=Math.max(0,shk-sd*shk*7-sd*2);
 if(state==='settle'){settleT+=sd;var mv=debris.some(function(b){return !b.isSleeping&&b.speed>.5});if(settleT>.5&&(!mv||settleT>2.2))newRound()}
 if(dispTk!==save.tk){var df=save.tk-dispTk;dispTk+=df>0?Math.max(1,Math.round(df/12)):Math.min(-1,Math.round(df/12));if(lim('tkt',60))SFX.tick(dispTk);$('tk').textContent=dispTk}
 acc+=dt*slowTS(sd);var n=0;while(acc>=FIXED&&n<5){physStep();acc-=FIXED;n++}if(n>=5)acc=0;
 render(ts/1000);autoQ()}
var qT=0;function autoQ(){if(++qT<240||qual<1||FR.length<120)return;var a=FR.reduce(function(s,v){return s+v},0)/FR.length;if(a>24){qual=.75;MAXP=140;resize()}qT=0}
/* ---------- UI ---------- */
function startGame(n){CUS.on=false;resetPlay();showEd(false);edB.style.display='none';aInit();CSND.start();loadFarts();SFX.click();titleOn=false;$('title').classList.add('off');MUS.on=true;if(!AC)MUS.on=false;resize();goLevel(n,true);hud()}
$('play').addEventListener('click',function(){startGame(save.lv||0)});$('lv1').addEventListener('click',function(){startGame(0)});
$('tshelf').addEventListener('click',function(){aInit();SFX.click();showShelf()});$('pbtn').addEventListener('click',function(){SFX.click();showShelf()});
$('sclose').addEventListener('click',function(){SFX.click();$('shelf').classList.remove('on')});$('wshelf').addEventListener('click',function(){SFX.click();showShelf()});
$('next').addEventListener('click',function(){SFX.click();$('win').classList.remove('on');goLevel(CUS.on?0:lvN+1,false)});
$('mute').addEventListener('click',function(){aInit();setMute(!muted);if(!muted)MUS.on=true});
$('skip').addEventListener('click',function(){EX.speed=3.5;SFX.click()});$('mbadge').addEventListener('click',openModes);$('tmodes').addEventListener('click',openModes);$('mclose').addEventListener('click',function(){SFX.click();$('modes').classList.remove('on')});$('help').addEventListener('click',function(){startMouse()});
setMute(muted);if(save.lv>0)$('play').textContent='▶ Keep playing (Level '+(save.lv+1)+')';else $('lv1').style.display='none';
/* title: wobbly hand-drawn marker letters */
(function(){var h=$('tt'),r=rng(42);function wrap(el){var txt=el.textContent;el.textContent='';txt.split(/( )/).forEach(function(w){if(w===' '){el.appendChild(document.createTextNode(' '));return}var ws=document.createElement('span');ws.className='w';
 for(var i=0;i<w.length;i++){var c=document.createElement('span');c.className='ch';c.textContent=w[i];var f=function(){return((r()-.5)*7).toFixed(1)+'deg'},y=function(){return((r()-.5)*4).toFixed(1)+'px'};c.style.cssText='--r1:'+f()+';--r2:'+f()+';--r3:'+f()+';--y1:'+y()+';--y2:'+y()+';--y3:'+y()+';animation-delay:-'+(r()*.4).toFixed(2)+'s';ws.appendChild(c)}el.appendChild(ws)})}
 h.querySelectorAll('.l1,.l2').forEach(wrap)})();
function drawTitleBox(){var c=$('tbox'),w=c.clientWidth||600,hh=c.clientHeight||300,d=Math.min(window.devicePixelRatio||1,2);c.width=w*d;c.height=hh*d;var g=c.getContext('2d');g.scale(d*w/600,d*hh/300);artFront(g)}
function artFront(g){var r=rng(9);
 // box body (front view) - dark blue painted front, oval opening, debris inside
 g.save();jag(g,[[60,30],[540,24],[548,292],[54,296]],r,5);cbFill(g,.05);g.restore();
 g.beginPath();g.moveTo(66,46);g.lineTo(534,40);g.lineTo(540,288);g.lineTo(62,290);g.closePath();g.moveTo(400,170);g.ellipse(290,170,112,82,-.05,0,2*PI,true);g.fillStyle='#22386a';g.fill('evenodd');
 g.save();g.clip('evenodd');for(var i=0;i<220;i++){g.strokeStyle=['#1a2d58','#2b4a86','#16264c','#34558f'][(r()*4)|0];g.globalAlpha=.55;g.lineWidth=3+r()*7;g.beginPath();var x=60+r()*480,y=40+r()*250;g.moveTo(x,y);g.lineTo(x+(r()-.5)*60,y+(r()-.5)*24);g.stroke()}g.globalAlpha=1;g.restore();
 // inside the oval
 g.save();g.beginPath();g.ellipse(290,170,112,82,-.05,0,2*PI);g.clip();g.fillStyle='#5a3a1a';g.fillRect(170,80,240,180);g.fillStyle=g.createPattern(CBT,'repeat');g.globalAlpha=.5;g.fillRect(170,80,240,180);g.globalAlpha=1;
 g.fillStyle='rgba(0,0,0,.35)';g.fillRect(170,80,240,40);
 g.beginPath();g.arc(240,205,34,0,2*PI);g.fillStyle='#f4f1e6';g.fill();g.strokeStyle='#cfc7b0';g.lineWidth=2;g.stroke();
 g.save();g.translate(330,200);g.rotate(.5);g.beginPath();g.ellipse(0,0,36,10,0,0,2*PI);g.fillStyle='#fbfaf3';g.fill();g.restore();
 g.fillStyle='#e8342a';g.beginPath();g.moveTo(300,140);g.lineTo(326,140);g.lineTo(322,168);g.lineTo(304,168);g.fill();g.fillStyle='#7fd34a';g.beginPath();g.moveTo(350,150);g.lineTo(372,150);g.lineTo(368,176);g.lineTo(354,176);g.fill();
 for(i=0;i<90;i++){g.strokeStyle=['#4fb6d6','#2f8fbf','#8fd6ea'][(r()*3)|0];g.lineWidth=2;var sx=190+r()*200,sy=150+r()*60;g.beginPath();g.moveTo(sx,sy);g.quadraticCurveTo(sx+10,sy-8,sx+20,sy+(r()-.5)*10);g.stroke()}
 g.fillStyle='#ffde3b';g.beginPath();g.arc(285,232,10,0,2*PI);g.fill();g.fillStyle='rgba(30,60,140,.9)';g.fillRect(190,236,200,20);g.restore();
 g.beginPath();g.ellipse(290,170,112,82,-.05,0,2*PI);g.strokeStyle='#0f1a36';g.lineWidth=4;g.stroke();
 // rhinestone strips
 function strip(x0,y0,x1,y1,n){for(var k=0;k<n;k++){var t=k/(n-1);for(var j=0;j<2;j++){var x=lerp(x0,x1,t)+j*7,y=lerp(y0,y1,t);g.beginPath();g.arc(x,y,3.3,0,2*PI);var gr=g.createRadialGradient(x-1,y-1,.4,x,y,3.5);gr.addColorStop(0,'#fff');gr.addColorStop(1,'#9fb3c8');g.fillStyle=gr;g.fill()}}}
 strip(150,60,128,170,16);strip(96,170,90,260,12);
 // pipe-cleaner ring
 var cols=['#ff7a1a','#3cc43c','#e8342a','#ffd21a'];for(i=0;i<30;i++){var a=i/30*2*PI;g.strokeStyle=cols[(i>>1)%4];g.lineWidth=8;g.lineCap='round';g.beginPath();g.arc(460,214,28,a,a+.24);g.stroke()}
 g.strokeStyle='#5fd13a';g.lineWidth=6;g.beginPath();g.moveTo(470,40);g.lineTo(476,-10);g.stroke();g.beginPath();g.moveTo(96,44);g.lineTo(90,-6);g.stroke();
 // bubble wrap on top
 g.fillStyle='rgba(230,242,255,.55)';g.beginPath();g.moveTo(80,32);g.quadraticCurveTo(300,4,520,30);g.lineTo(520,46);g.quadraticCurveTo(300,26,80,46);g.fill();
 // little excavator peeking from the right
 g.save();g.translate(560,190);g.scale(.42,.42);g.fillStyle='#ffcb05';g.strokeStyle='#5a4300';g.lineWidth=5;g.beginPath();g.roundRect?g.roundRect(-40,-40,140,90,14):g.rect(-40,-40,140,90);g.fill();g.stroke();
 g.fillStyle='rgba(120,190,235,.85)';g.fillRect(-20,-30,50,40);mitten(g,70,10,1.6,'#00274c');g.fillStyle='#2b2b2b';g.fillRect(-50,50,170,34);
 g.strokeStyle='#ffcb05';g.lineWidth=24;g.lineCap='round';g.beginPath();g.moveTo(-10,-30);g.lineTo(-120,-160);g.lineTo(-230,-60);g.stroke();g.fillStyle='#4a4a4a';g.beginPath();g.moveTo(-250,-80);g.lineTo(-190,-60);g.lineTo(-220,-10);g.lineTo(-270,-30);g.fill();g.restore()}
/* ---------- test hooks ---------- */
function simShot(n,deg,p){SIM=true;var keep={st:state,b:ball};if(ball){Composite.remove(world,ball);ball=null}clearXB();gt=0;clearLevel(false);setupLevel(n,true);for(var i=0;i<240;i++)physStep();throwsLeft=3;roundTk=0;
 simRes=null;launch(deg,p);for(i=0;i<1600&&state==='fly';i++)physStep();var res=simRes||'timeout';if(ball){Composite.remove(world,ball);ball=null}clearXB();SIM=false;state='sim';return res}
window.EB={ver:VER,
 st:function(){return{state:state,lv:lvN,name:LV&&LV.n,throws:throwsLeft,tk:save.tk,roundTk:roundTk,wins:save.w,prizes:prizeCount(),pz:save.pz,ball:ball?{x:ball.position.x,y:ball.position.y}:null,debris:debris.length,hits:stats.hits,exBusy:exBusy(),hole:[HOLE.y0,HOLE.y1],parts:P.length,dpr:DPR,qual:qual,winOpen:$('win').classList.contains('on'),title:$('tt').textContent}},
 fps:function(){var a=FR.reduce(function(s,v){return s+v},0)/FR.length;return{avgMs:a,fps:1000/a,maxMs:Math.max.apply(null,FR)}},
 throwAt:function(d,p){if(state!=='aim')return false;LV._tried=1;launch(d,p);return true},fast:function(on){EX.speed=on?6:1},
 sim:simShot,
 solve:function(n,da,dp){var wins=[];for(var a=-10;a<=60;a+=(da||4))for(var p=.3;p<=1.001;p+=(dp||.1)){if(simShot(n,a,+p.toFixed(2))==='win')wins.push([a,+p.toFixed(2)])}return wins},
 levels:function(){return LEVELS.length},
 lvdef:function(n){return levelDef(n)},fart:function(){FA.next=0;startFart();return FA.count},slow:function(){return{used:SLOW.used,t:SLOW.t}},fa:function(){return{on:FA.on,tooted:FA.tooted,wind:FA.wind,clouds:FA.clouds.length,bufs:FA.buf.length,next:FA.next}},profp:function(w,k){k=k||60;var g=ctx,t0=performance.now();for(var i=0;i<k;i++){g.setTransform(DPR*S,0,0,DPR*S,DPR*OX,DPR*OY);if(w==='kids')drawKids(g,i*.016);else if(w==='bg'){g.setTransform(1,0,0,1,0,0);g.drawImage(BG,-BGM*DPR,-BGM*DPR)}else if(w==='fg'){g.setTransform(1,0,0,1,0,0);fgPatch(g,0,0)}else if(w==='p')drawP(g);else{g.setTransform(1,0,0,1,0,0);g.fillRect(0,0,9,9)}}ctx.getImageData(0,0,1,1);return (performance.now()-t0)/k},prof:function(k){k=k||60;var t0=performance.now();for(var i=0;i<k;i++)render(t0/1000+i*.016);ctx.getImageData(0,0,1,1);return (performance.now()-t0)/k},mode:function(id){if(id)setMode(id);return MODE},modes:function(){return MODES.map(function(m){return m.id})},boost:function(){return rocketTap()},xb:function(){return XB.length},
 firstWin:function(n,cands){for(var i=0;i<cands.length;i++){if(simShot(n,cands[i][0],cands[i][1])==='win')return cands[i]}return null},
 crowd:function(){return{mode:CR.mode,six:CR.six,count:CR.count,kids:KIDS.length,bubble:!!CR.bub}},six:function(){CR.lastSix=-99;doSix();return CR.six},cheer:function(){CR.lastSix=gt;crowdEv('score')},cm:function(m,d){crowd(m,d||3);return CR.mode},
 stuck:function(){lvMiss=6;return needHelp()},help:function(){return{visible:$('help').style.display!=='none',assist:AS.on,shot:AS.shot,mouse:MS.on,mstate:state,sticker:save.st||null}},
 assistCheck:function(n){SIM=true;if(ball){Composite.remove(world,ball);ball=null}clearXB();gt=0;clearLevel(false);setupLevel(n,true);for(var i=0;i<200;i++)physStep();debris.slice().forEach(tossDeb);flying.forEach(function(f){Composite.remove(world,f)});flying=[];assistGeom();AS.on=true;assistQueue();var g=0;while(AS.q&&g++<5000)assistStep(50);
  var sh=AS.shot,res=null;if(sh){throwsLeft=3;roundTk=0;simRes=null;state='aim';launch(sh.deg,sh.p);for(i=0;i<1600&&state==='fly';i++)physStep();res=simRes;if(ball){Composite.remove(world,ball);ball=null}clearXB();}
  var wins=0;for(var k in AS.res)if(AS.res[k])wins++;AS.on=false;SIM=false;state='sim';return{shot:sh,result:res,winningCells:wins,cells:Object.keys(AS.res).length}},
 icon:function(sz){var c=mkc(sz,sz),g=c.getContext('2d'),s=sz/600;g.scale(s,s);g.fillStyle='#7a0f1a';g.fillRect(0,0,600,600);var r=rng(5);jag(g,[[14,20],[586,10],[590,236],[10,244]],r,8);cbFill(g,0);g.strokeStyle='#8a6232';g.lineWidth=4;g.stroke();
  g.fillStyle='#2f8a3a';g.textAlign='center';g.textBaseline='middle';g.font='112px '+MK;g.fillText('Excavator',300,82);g.fillText('Blowout',300,184);g.save();g.translate(0,272);g.scale(1,.98);artFront(g);g.restore();
  var bs=spr('ball');g.save();g.translate(250,440);g.scale(1.6,1.6);g.drawImage(bs.c,-BR,-BR,BR*2,BR*2);g.restore();return c.toDataURL('image/png')}};
/* ---------- boot ---------- */
sprBall();sprGem();sprRing();sprMouse();sprModes();applyGrav();updBadge();
resize();drawTitleBox();
if(document.fonts&&document.fonts.load){document.fonts.load('40px PM').then(function(){resize();drawTitleBox()}).catch(function(){})}
setupLevel(save.lv||0,true);requestAnimationFrame(frame);
addEventListener('pagehide',persist);document.addEventListener('visibilitychange',function(){if(document.hidden){persist();drag=null}else{last=0}});
})();
