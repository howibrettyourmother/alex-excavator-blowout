/* ---------- Bonus modes (all unlocked, no grinding) ---------- */
var MODES=[
 {id:'classic',n:'Classic Ball',e:'⚾',c:'#ffcb05',d:'The original Game Day ball.'},
 {id:'water',n:'Water Balloon',e:'💦',c:'#3aa0ff',d:'Wobbly! Pops on a hard hit and soaks the junk.'},
 {id:'bouncy',n:'Super Bouncy',e:'🟣',c:'#ff3fb4',d:'BOING! Crazy ricochets.'},
 {id:'bowling',n:'Giant Bowling Ball',e:'🎳',c:'#3d4fa8',d:'Big and heavy. Plows right through junk!'},
 {id:'slime',n:'Slime Ball',e:'🟢',c:'#3ad12a',d:'Gooey splat! Sticks to walls and drips down. Grabs junk and yanks it out of the way.'},
 {id:'rocket',n:'Rocket Ball',e:'🚀',c:'#ff7a1a',d:'Tap anywhere in the air for one BOOST!'},
 {id:'moon',n:'Moon Gravity',e:'🌙',c:'#9db4ff',d:'Floaty space throws under the stars.'},
 {id:'triple',n:'Triple Ball',e:'✨',c:'#ffd21a',d:'Splits into 3 balls in the air!'}];
function modeOf(id){for(var i=0;i<MODES.length;i++)if(MODES[i].id===id)return MODES[i];return MODES[0]}
var MODE=modeOf(save.mode).id,XB=[],STK=[],WET={};
function ballR(){return MODE==='bowling'?29:BR}
function ballKey(){return MODE==='classic'?'ball':'ball_'+MODE}
function modeCol(){return modeOf(MODE).c}
function applyGrav(){engine.gravity.y=MODE==='moon'?.45:1.15}
function ballOpts(){var o={density:.004,restitution:.52,friction:.03,frictionStatic:.3,frictionAir:.004,label:'ball',sleepThreshold:120};
 if(MODE==='water'){o.density=.0035;o.restitution=.45;o.friction=.04;o.frictionAir=.0045}
 else if(MODE==='bouncy'){o.density=.003;o.restitution=.97;o.friction=.002;o.frictionStatic=0;o.frictionAir=.001}
 else if(MODE==='bowling'){o.density=.03;o.restitution=.12;o.friction=.05;o.frictionAir=.002}
 else if(MODE==='slime'){o.density=.005;o.restitution=.16;o.friction=.55;o.frictionStatic=.9;o.frictionAir=.006}
 else if(MODE==='moon'){o.restitution=.3;o.frictionAir=.0015}
 return o}
function mkBall(x,y){var b=Bodies.circle(x,y,ballR(),ballOpts());b.mat='ball';b.mode=MODE;return b}
function clearXB(){XB.forEach(function(b){Composite.remove(world,b)});XB=[];STK.forEach(function(s){Composite.remove(world,s.c)});STK=[]}
/* ---- sounds (all synthesized) ---- */
var MSND={
 splash:function(){noise(.55,{ft:'lowpass',f:3200,fto:260,vol:.55});noise(.3,{f:1800,q:2,vol:.25,at:.04});for(var i=0;i<6;i++)tone(800+rnd()*700,.08,{to:1700+rnd()*500,vol:.11,at:.1+i*.07})},
 boing:function(v){var a=clamp(v/14,.25,1);if(!lim('boing',70))return;var f=150+rnd()*60;tone(f,.32,{to:f*3.2,type:'triangle',vol:.22*a});tone(f*3,.28,{to:f*1.1,vol:.12*a,at:.09})},
 pins:function(v){if(!lim('pins',140))return;var a=clamp(v/10,.4,1);tone(70,.35,{to:40,type:'triangle',vol:.4*a});noise(.35,{f:2600,q:3,vol:.25*a});for(var i=0;i<7;i++)tone(450+rnd()*800,.13,{type:'square',to:280+rnd()*200,vol:.06*a,at:.02+i*.035+rnd()*.02})},
 squelch:function(big){if(!lim('sq',90))return;var ok=false;try{ok=playSample('squish',big?.98:.86,null,.82+rnd()*.35,0,true)}catch(e){}
  var v=ok?.38:1;noise(.42,{ft:'lowpass',f:big?320:240,fto:big?1100:1700,q:7,vol:.62*v});noise(.22,{ft:'bandpass',f:900,fto:280,q:2.4,vol:.28*v});
  tone(86,.32,{to:36,type:'sine',vol:.22*v});tone(170,.2,{to:60,type:'triangle',vol:.1*v});
  for(var i=0;i<4;i++)tone(220+rnd()*420,.07,{to:70+rnd()*40,type:'sine',vol:.05*v,at:.05+i*.045})},
 rocket:function(){noise(.9,{f:280,fto:2000,q:.6,vol:.45});tone(140,.7,{to:900,type:'sawtooth',vol:.08});tone(70,.5,{type:'triangle',vol:.25})},
 split:function(){for(var i=0;i<3;i++)tone(1300-i*150,.13,{to:420,type:'square',vol:.07,at:i*.07})},
 launch:function(){var m=MODE;if(m==='water')tone(220,.35,{to:110,vol:.18});else if(m==='bouncy')MSND.boing(14);else if(m==='bowling'){tone(90,.5,{to:55,type:'triangle',vol:.3});noise(.5,{ft:'lowpass',f:400,vol:.25})}
  else if(m==='slime')MSND.squelch();else if(m==='moon'){tone(420,1,{to:950,vol:.12});tone(630,1,{to:1420,vol:.06,at:.05})}else if(m==='rocket')tone(600,.15,{to:900,type:'square',vol:.05})},
 pick:function(id){var k=MODE;MODE=id;MSND.launch();MODE=k}};
/* ---- ball art ---- */
var ART={
 water:function(g,R){var r=R*.92;g.beginPath();g.moveTo(0,-r);g.bezierCurveTo(r*1.1,-r,r*1.05,r*.6,0,r*.92);g.bezierCurveTo(-r*1.05,r*.6,-r*1.1,-r,0,-r);var gr=g.createRadialGradient(-r*.3,-r*.35,1,0,0,r);gr.addColorStop(0,'#e4f6ff');gr.addColorStop(.45,'#5cb8ff');gr.addColorStop(1,'#1d62c4');g.fillStyle=gr;g.globalAlpha=.93;g.fill();g.globalAlpha=1;g.strokeStyle='#123f88';g.lineWidth=1.6;g.stroke();
  g.fillStyle='#1d62c4';g.beginPath();g.moveTo(-3,r*.9);g.lineTo(3,r*.9);g.lineTo(0,R);g.fill();g.fillStyle='rgba(255,255,255,.8)';g.beginPath();g.ellipse(-r*.35,-r*.4,r*.16,r*.3,-.5,0,2*PI);g.fill()},
 bouncy:function(g,R){g.beginPath();g.arc(0,0,R,0,2*PI);var gr=g.createRadialGradient(-6,-6,2,0,0,R);gr.addColorStop(0,'#ffb3e6');gr.addColorStop(.6,'#ff3fb4');gr.addColorStop(1,'#b0127a');g.fillStyle=gr;g.fill();
  g.save();g.clip();g.lineWidth=5;['#ffe14a','#3fd0ff','#7dff6a'].forEach(function(c,i){g.strokeStyle=c;g.beginPath();g.arc(-R*.2+i*8,R*1.1-i*4,R*(1.2-i*.12),PI*1.15,PI*1.75);g.stroke()});g.restore();g.strokeStyle='#7a0a52';g.lineWidth=1.5;g.beginPath();g.arc(0,0,R,0,2*PI);g.stroke()},
 bowling:function(g,R){g.beginPath();g.arc(0,0,R,0,2*PI);var gr=g.createRadialGradient(-R*.35,-R*.35,2,0,0,R);gr.addColorStop(0,'#7d8fe8');gr.addColorStop(.5,'#2a3a9f');gr.addColorStop(1,'#0e1648');g.fillStyle=gr;g.fill();
  g.save();g.clip();g.strokeStyle='rgba(180,120,255,.35)';g.lineWidth=4;for(var i=0;i<4;i++){g.beginPath();g.moveTo(-R,-R*.6+i*12);g.bezierCurveTo(-R*.3,-R+i*14,R*.2,R*.2+i*5,R,-R*.2+i*10);g.stroke()}g.restore();
  g.fillStyle='#05081e';[[-6,-11],[6,-11],[0,1]].forEach(function(p){g.beginPath();g.arc(p[0],p[1],4.2,0,2*PI);g.fill()});g.strokeStyle='#060b2c';g.lineWidth=2;g.beginPath();g.arc(0,0,R,0,2*PI);g.stroke()},
 slime:function(g,R){var r=R*.96,rr=rng(9);
  /* hanging drips */
  [{x:-r*.42,l:r*.42,w:r*.16},{x:r*.28,l:r*.62,w:r*.2},{x:r*.02,l:r*.28,w:r*.12}].forEach(function(d){g.fillStyle='#2fa81c';g.beginPath();g.moveTo(d.x-d.w,r*.55);g.quadraticCurveTo(d.x-d.w*.2,r+d.l*.45,d.x,r+d.l);g.quadraticCurveTo(d.x+d.w*.2,r+d.l*.45,d.x+d.w,r*.55);g.fill()});
  g.beginPath();for(var i=0;i<=28;i++){var a=i/28*2*PI,q=r*(1+(i%3?.05:-.07)+rr()*.04);i?g.lineTo(Math.cos(a)*q,Math.sin(a)*q):g.moveTo(q,0)}g.closePath();
  var gr=g.createRadialGradient(-r*.35,-r*.4,2,0,r*.15,r*1.05);gr.addColorStop(0,'#f3ffc4');gr.addColorStop(.22,'#b6ff4a');gr.addColorStop(.55,'#4ed524');gr.addColorStop(.82,'#1f9a16');gr.addColorStop(1,'#0b5a0c');g.fillStyle=gr;g.globalAlpha=.96;g.fill();g.globalAlpha=1;
  g.save();g.clip();g.fillStyle='rgba(255,255,255,.55)';g.beginPath();g.ellipse(-r*.32,-r*.38,r*.28,r*.16,-.5,0,2*PI);g.fill();
  g.fillStyle='rgba(255,255,255,.28)';g.beginPath();g.ellipse(-r*.15,-r*.12,r*.42,r*.22,-.4,0,2*PI);g.fill();
  [[-.25,-.05,r*.09],[.22,.12,r*.07],[-.08,.28,r*.05],[.3,-.22,r*.045]].forEach(function(c){g.fillStyle='rgba(200,255,140,.45)';g.beginPath();g.arc(c[0]*r,c[1]*r,c[2],0,2*PI);g.fill();g.fillStyle='rgba(255,255,255,.55)';g.beginPath();g.arc(c[0]*r-c[2]*.3,c[1]*r-c[2]*.3,c[2]*.35,0,2*PI);g.fill()});g.restore();
  g.strokeStyle='#0d4a0c';g.lineWidth=1.8;g.beginPath();g.arc(0,0,r*.98,0,2*PI);g.stroke();
  [-6.5,6.5].forEach(function(x){g.fillStyle='#fff';g.beginPath();g.arc(x,-3.5,5.2,0,2*PI);g.fill();g.strokeStyle='#0d3a0c';g.lineWidth=1.2;g.stroke();g.fillStyle='#111';g.beginPath();g.arc(x+1.1,-2.6,2.5,0,2*PI);g.fill();g.fillStyle='#fff';g.beginPath();g.arc(x+.3,-3.6,1,0,2*PI);g.fill()});
  g.strokeStyle='#14580d';g.lineWidth=2;g.beginPath();g.arc(0,5,7,.25,PI-.25);g.stroke();
  g.fillStyle='rgba(40,140,20,.85)';g.beginPath();g.ellipse(-9,r*.86,3.2,5.5,0,0,2*PI);g.ellipse(8,r*.92,2.8,6.5,0,0,2*PI);g.fill()},
 rocket:function(g,R){g.beginPath();g.arc(0,0,R,0,2*PI);var gr=g.createRadialGradient(-6,-6,2,0,0,R);gr.addColorStop(0,'#ffe0b0');gr.addColorStop(.55,'#ff7a1a');gr.addColorStop(1,'#b83a00');g.fillStyle=gr;g.fill();
  g.save();g.clip();g.fillStyle='#e8342a';g.fillRect(-R,-5,R*2,10);g.fillStyle='#fff';for(var i=-2;i<=2;i++){g.beginPath();g.arc(i*8,0,1.6,0,2*PI);g.fill()}g.restore();
  g.fillStyle='#ffe14a';g.beginPath();for(var k=0;k<10;k++){var a=-PI/2+k*PI/5,q=k%2?3.5:8;g.lineTo(Math.cos(a)*q,-11+Math.sin(a)*q)}g.fill();g.strokeStyle='#7a2a00';g.lineWidth=1.5;g.beginPath();g.arc(0,0,R,0,2*PI);g.stroke()},
 moon:function(g,R){g.beginPath();g.arc(0,0,R,0,2*PI);var gr=g.createRadialGradient(-6,-6,2,0,0,R);gr.addColorStop(0,'#ffffff');gr.addColorStop(.6,'#cfd3e0');gr.addColorStop(1,'#8a90a8');g.fillStyle=gr;g.fill();
  [[-7,-6,5],[7,4,4],[-2,10,3],[9,-9,2.5]].forEach(function(c){g.fillStyle='rgba(90,96,130,.45)';g.beginPath();g.arc(c[0],c[1],c[2],0,2*PI);g.fill();g.strokeStyle='rgba(255,255,255,.5)';g.lineWidth=1;g.beginPath();g.arc(c[0]+.5,c[1]+.5,c[2],-.5,2);g.stroke()});g.strokeStyle='#5a5f78';g.lineWidth=1.5;g.beginPath();g.arc(0,0,R,0,2*PI);g.stroke()},
 triple:function(g,R){['#e8342a','#1f6fd1','#ffd21a'].forEach(function(c,i){g.beginPath();g.moveTo(0,0);g.arc(0,0,R,-PI/2+i*2*PI/3,-PI/2+(i+1)*2*PI/3);g.closePath();g.fillStyle=c;g.fill()});
  g.strokeStyle='#fff';g.lineWidth=2.5;for(var i=0;i<3;i++){var a=-PI/2+i*2*PI/3;g.beginPath();g.moveTo(0,0);g.lineTo(Math.cos(a)*R,Math.sin(a)*R);g.stroke()}
  var gr=g.createRadialGradient(-6,-6,1,0,0,R);gr.addColorStop(0,'rgba(255,255,255,.55)');gr.addColorStop(.5,'rgba(255,255,255,0)');g.fillStyle=gr;g.beginPath();g.arc(0,0,R,0,2*PI);g.fill();g.strokeStyle='#333';g.lineWidth=1.5;g.stroke()}};
function sprModes(){MODES.forEach(function(m){if(m.id==='classic')return;var R=m.id==='bowling'?29:BR;defSpr('ball_'+m.id,R*2,R*2,function(g){g.translate(R,R);ART[m.id](g,R)})})}
function ballIcon(id,sz){var c=mkc(sz,sz),g=c.getContext('2d');g.translate(sz/2,sz/2);var R=sz*.4;if(id==='classic'){var s=spr('ball');g.drawImage(s.c,-R,-R,R*2,R*2)}else{g.scale(R/BR,R/BR);ART[id](g,BR)}return c}
var STKURL={};
function modeSticker(id){if(STKURL[id])return STKURL[id];var m=modeOf(id),c=mkc(120,130),g=c.getContext('2d');g.translate(60,62);
 g.fillStyle='rgba(0,0,0,.25)';g.beginPath();g.arc(2,4,54,0,2*PI);g.fill();g.fillStyle='#fff';g.beginPath();g.arc(0,0,54,0,2*PI);g.fill();
 g.fillStyle=m.c;g.beginPath();for(var k=0;k<24;k++){var a=k*PI/12,q=k%2?40:50;g.lineTo(Math.cos(a)*q,Math.sin(a)*q)}g.closePath();g.fill();g.strokeStyle='#3a2414';g.lineWidth=2.5;g.stroke();
 g.drawImage(ballIcon(id,80),-40,-46);g.font='15px '+MK;g.textAlign='center';g.lineWidth=4;g.strokeStyle='#fff';var t=m.n.replace('Giant ','').replace(' Gravity','');g.strokeText(t,0,44);g.fillStyle='#3a2414';g.fillText(t,0,44);
 try{STKURL[id]=c.toDataURL()}catch(e){STKURL[id]=''}return STKURL[id]}
/* ---- in-flight behaviour ---- */
function modeLaunch(){fly.boost=MODE==='rocket'?1:0;fly.boostT=0;fly.split=false;if(!SIM){MSND.launch();if(MODE==='rocket'&&!save.rk){ftext(LX+120,LY-140,'Tap to BOOST! 🚀','#ffb35c')}}}
function rocketTap(){if(MODE!=='rocket'||state!=='fly'||!ball||!fly||!fly.boost)return false;fly.boost=0;fly.boostT=.6;save.rk=1;var v=ball.velocity,s=Math.hypot(v.x,v.y),ux=s>2?v.x/s:.8,uy=s>2?v.y/s:-.6;
 Body.setVelocity(ball,{x:v.x+ux*12,y:v.y+uy*12-2});if(!SIM){MSND.rocket();shake(6);for(var i=0;i<14;i++)emit({k:'sp',x:ball.position.x-ux*20,y:ball.position.y-uy*20,vx:-ux*300+(rnd()-.5)*200,vy:-uy*300+(rnd()-.5)*200,m:.4,c:i%2?'#ffd21a':'#ff7a1a',s:3})}return true}
function splitBall(){fly.split=true;var v=ball.velocity,p=ball.position;[-.17,.17].forEach(function(da){var b=mkBall(p.x,p.y);var c=Math.cos(da),s=Math.sin(da);Body.setVelocity(b,{x:v.x*c-v.y*s,y:v.x*s+v.y*c});b.still=0;b.px=p.x;b.collisionFilter.group=-7;Composite.add(world,b);XB.push(b)});ball.collisionFilter.group=-7;
 if(!SIM){MSND.split();sparks(p.x,p.y,12,'#fff6a0')}}
function burst(){fly.burst=true;ball.burst=true;var p=ball.position;Composite.remove(world,ball);
 debris.forEach(function(d){if(d.isStatic||d.soggy)return;if(Math.hypot(d.position.x-p.x,d.position.y-p.y)<170){d.soggy=1;Body.setDensity(d,d.density*2.2);d.frictionAir=Math.max(d.frictionAir,.02)}});
 if(!SIM){MSND.splash();shake(8);for(var i=0;i<34;i++){var a=rnd()*2*PI,s=150+rnd()*420;emit({k:'sp',x:p.x,y:p.y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-200,m:.6+rnd()*.4,c:['#5cb8ff','#9fdcff','#2f7fd6'][i%3],s:4})}ftext(p.x,p.y-40,'SPLASH! 💦','#9fdcff')}}
function modeHit(o,rv,sp,bb,n,ballIsA){var m=bb.mode;
 if(m==='water'&&bb===ball&&fly&&!fly.burst&&!AS.on&&(rv>(o.isStatic?19:15.5))){fly.bp=true;return true}
 if(SIM){if(m==='slime')slimeStick(bb,o,rv,n,ballIsA,sp);return false}
 if(m==='bouncy'&&rv>2)MSND.boing(rv);
 else if(m==='bowling'&&!o.isStatic&&rv>2.5){MSND.pins(rv);dust(o.position.x,o.position.y,4)}
 else if(m==='slime')slimeStick(bb,o,rv,n,ballIsA,sp);
 return false}
function slimeNx(n,ballIsA){if(!n)return{x:0,y:-1};return ballIsA?{x:-n.x,y:-n.y}:{x:n.x,y:n.y}}
function slimeStick(bb,o,rv,n,ballIsA,sp){if(AS.on||!bb)return;if(STK.some(function(s){return s.o===o}))return;
 var nn=slimeNx(n,ballIsA),px=(sp&&sp.x)||bb.position.x,py=(sp&&sp.y)||bb.position.y,grab=0,wall=0,d,c,i,life,cols;
 if(!o.isStatic&&debris.indexOf(o)>=0){if(rv>=.75&&STK.filter(function(s){return !s.wall}).length<3)grab=1}
 else if(o.isStatic&&rv>=1.55){if(o.mat==='table'||(nn.y<-.68&&o.position.y>FLOOR-30))return;if(bb.slimePeel&&gt-bb.slimePeel<.28)return;if(STK.some(function(s){return s.wall}))return;wall=1}
 if(!grab&&!wall){if(!SIM&&rv>3)slimeSplat(bb,px,py,rv,0);return}
 d=Math.max(ballR()+4,Math.hypot((o.position.x-bb.position.x),(o.position.y-bb.position.y)));
 c=M.Constraint.create(wall?{bodyA:bb,pointB:{x:px,y:py},length:ballR()+2,stiffness:.7,damping:.18}:{bodyA:bb,bodyB:o,length:d,stiffness:.48,damping:.08});
 Composite.add(world,c);life=wall?.55:1.25;STK.push({c:c,o:o,t:0,life:life,wall:wall,px:px,py:py});
 if(wall){Body.setVelocity(bb,{x:bb.velocity.x*.15,y:bb.velocity.y*.15});Body.setAngularVelocity(bb,bb.angularVelocity*.2)}
 if(!SIM){MSND.squelch(wall||rv>6);slimeSplat(bb,px,py,rv,wall||grab);if(rv>7)ftext(px,py-36,'SPLAT!','#8dff3a')}}
function slimeSplat(bb,x,y,rv,sticky){var n=sticky?16:8,i,a,s;bb.sq=Math.min(1.4,Math.max(bb.sq||0,rv/8+.45));bb.sqT=gt;bb.sqN=0;
 for(i=0;i<n;i++){a=rnd()*2*PI;s=80+rnd()*(sticky?280:180);emit({k:'fb',x:x,y:y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-40,m:.4+rnd()*.35,c:i%3?'#5fd13a':'#b6ff4a',s:3+rnd()*5})}
 for(i=0;i<4;i++)emit({k:'fb',x:x+(rnd()-.5)*10,y:y+6,vx:(rnd()-.5)*50,vy:40+rnd()*80,m:.55,c:'#3aaa1c',s:3+rnd()*3})}
function xbDone(){if(!XB.length||fly.t>11)return true;return XB.every(function(b){return b.done})}
function modeStep(){var dt=FIXED/1000;
 for(var i=STK.length-1;i>=0;i--){var sk=STK[i];sk.t+=dt;if(sk.wall&&sk.t>.22&&ball){Body.setVelocity(ball,{x:ball.velocity.x*.85,y:ball.velocity.y+dt*18})}
  if(sk.t>(sk.life||.5)){Composite.remove(world,sk.c);if(sk.wall&&ball){ball.slimePeel=gt;Body.setVelocity(ball,{x:ball.velocity.x*.4,y:Math.max(ball.velocity.y,2.2)})}STK.splice(i,1)}}
 if(MODE==='slime'&&ball&&state==='fly'&&!SIM&&lim('goo',38)){var bp=ball.position,vv=ball.velocity;emit({k:'fb',x:bp.x-vv.x*.4+(rnd()-.5)*6,y:bp.y+ballR()*.4,vx:-vv.x*4+(rnd()-.5)*30,vy:30+rnd()*40,m:.4+rnd()*.25,c:rnd()<.5?'#5fd13a':'#8dff3a',s:2.5+rnd()*3})}
 if(!ball||state!=='fly')return false;
 if(fly.bp&&!fly.burst){burst();endThrow();return true}if(fly.burst)return true;
 if(MODE==='triple'&&!fly.split&&fly.t>.4)splitBall();
 if(fly.boostT>0){fly.boostT-=dt;if(!SIM&&lim('smk',30))emit({k:'sm',x:ball.position.x,y:ball.position.y,vx:-ball.velocity.x*12,vy:-ball.velocity.y*12,m:.8,s:6})}
 for(i=0;i<XB.length;i++){var b=XB[i],q=b.position;if(b.done)continue;
  if(q.x>BX0+20&&b.px<=BX0+20&&q.y>HOLE.y0-6&&q.y<HOLE.y1+6){b.done=true;win();return true}b.px=q.x;
  if(Body.getSpeed(b)<.3)b.still+=dt;else b.still=0;if(b.still>.7||q.y>TABLE+200||q.x<-280||q.x>BX1+5&&q.y>HOLE.y1+40)b.done=true}
 return false}
/* ---- drawing ---- */
function drawBallM(g,x,y,a,t,b){var s=spr(ballKey()),R=ballR();g.save();g.translate(x,y);
 if(MODE==='water'){var w=Math.sin(t*15)*.09*(b?Math.min(1,Body.getSpeed(b)/8+.3):.4);g.scale(1+w,1-w)}
 else if(MODE==='slime'){var w2=Math.sin(t*8)*.08,w3=Math.sin(t*13)*.04;g.scale(1+w2,1-w2+w3)}
 if(MODE==='rocket'&&b&&fly&&fly.boostT>0){var v=b.velocity,an=Math.atan2(v.y,v.x);g.save();g.rotate(an);var L=30+Math.sin(t*60)*8;g.fillStyle='#ffd21a';g.beginPath();g.moveTo(-R+2,-9);g.lineTo(-R-L,0);g.lineTo(-R+2,9);g.fill();g.fillStyle='#ff5a1a';g.beginPath();g.moveTo(-R+2,-5);g.lineTo(-R-L*.6,0);g.lineTo(-R+2,5);g.fill();g.restore()}
 if(MODE==='slime')slimeXf(g,b,t);else squashXf(g,b);g.rotate(a);g.drawImage(s.c,-R-2/K,-R-2/K,s.w,s.h);
 if(MODE==='slime')slimeDrip(g,b,t,R);g.restore();if(MODE==='slime')slimeStrands(g,b)}
function slimeXf(g,b,t){if(!b)return;var k=b.sq?b.sq*Math.exp(-(gt-(b.sqT||gt))*5.5):0;if(k<.03){if(b.sq)b.sq=0;return}g.rotate(b.sqN||0);g.scale(1-.46*k,1+.28*k);g.rotate(-(b.sqN||0))}
function slimeDrip(g,b,t,R){var drop=.5+.5*Math.sin(t*3.2),len=R*(.25+.55*drop);g.fillStyle='rgba(50,170,25,.9)';g.beginPath();g.moveTo(-4,R*.55);g.quadraticCurveTo(-1,R+len*.5,0,R+len);g.quadraticCurveTo(1,R+len*.5,4,R*.55);g.fill()}
function slimeStrands(g,b){if(!b||!STK.length)return;g.save();g.lineCap='round';STK.forEach(function(sk){if(!sk.o&&sk.px==null)return;var ax=b.position.x,ay=b.position.y,bx=sk.o&&sk.o.position?sk.o.position.x:sk.px,by=sk.o&&sk.o.position?sk.o.position.y:sk.py,mx=(ax+bx)/2,my=(ay+by)/2+14;
  g.strokeStyle='rgba(40,160,20,.72)';g.lineWidth=10;g.beginPath();g.moveTo(ax,ay);g.quadraticCurveTo(mx,my,bx,by);g.stroke();
  g.strokeStyle='rgba(180,255,80,.45)';g.lineWidth=4;g.beginPath();g.moveTo(ax,ay);g.quadraticCurveTo(mx-4,my-6,bx,by);g.stroke()});g.restore()}
function drawXB(g,t){for(var i=0;i<XB.length;i++){var b=XB[i];drawBallM(g,b.position.x,b.position.y,b.angle,t,b)}}
var STARS=null;
function moonSky(g,t){if(MODE!=='moon')return;g.fillStyle='rgba(18,20,80,.42)';g.fillRect(-200,-200,W+400,H+400);
 if(!STARS){var r=rng(77);STARS=[];for(var i=0;i<90;i++){var sx=r()*W,sy=r()*(TOP-60);STARS.push([sx,sy,r()*2.2+1,r()*6])}}
 g.fillStyle='#fff';for(i=0;i<STARS.length;i++){var s=STARS[i];g.globalAlpha=.45+.45*Math.sin(t*2+s[3]);g.beginPath();g.arc(s[0],s[1],s[2],0,2*PI);g.fill()}g.globalAlpha=1}
function wetSpr(sk){var s=spr(sk);if(!s)return null;var w=WET[sk];if(w&&w.src===s.c)return w;var c=mkc(s.c.width,s.c.height),g=c.getContext('2d');g.drawImage(s.c,0,0);g.globalCompositeOperation='source-atop';g.fillStyle='rgba(40,110,210,.42)';g.fillRect(0,0,c.width,c.height);
 g.fillStyle='rgba(20,60,140,.35)';for(var i=0;i<5;i++){g.beginPath();g.arc(c.width*(.15+i*.18),c.height*(.3+(i%2)*.35),c.width*.04+2,0,2*PI);g.fill()}w=WET[sk]={src:s.c,c:c,w:s.w,h:s.h};return w}
/* ---- UI ---- */
function updBadge(){var m=modeOf(MODE),b=$('mbadge');if(!b)return;b.innerHTML=MODE==='classic'?'🎮 <span>Modes</span>':m.e+' <span>'+m.n+'</span>';b.style.background=MODE==='classic'?'':m.c;b.style.color=MODE==='classic'?'':(MODE==='moon'||MODE==='water'||MODE==='bouncy'||MODE==='bowling'?'#fff':'#2a1808');b.className='tag cb mk'+(MODE==='classic'?'':' on');
 var tb=$('tmodes');if(tb)tb.innerHTML='🎮 Bonus Modes'+(MODE==='classic'?'':': '+m.e)}
function openModes(){aInit();SFX.click();var h='';MODES.forEach(function(m){var got=m.id==='classic'||(save.st&&save.st['m_'+m.id]);
 h+='<button class="mt'+(m.id===MODE?' sel':'')+'" data-m="'+m.id+'" style="--mc:'+m.c+'"><img alt="" src="'+ballIcon(m.id,96).toDataURL()+'"><b class="mk">'+m.n+'</b><small>'+m.d+'</small>'+(m.id!=='classic'?'<i>'+(got?'⭐ sticker won!':'Win a level for a sticker')+'</i>':'')+'</button>'});
 $('mgrid').innerHTML=h;Array.prototype.forEach.call($('mgrid').children,function(el){el.addEventListener('click',function(){setMode(el.getAttribute('data-m'));$('modes').classList.remove('on')})});$('modes').classList.add('on')}
function setMode(id){MODE=modeOf(id).id;save.mode=MODE;persist();applyGrav();updBadge();if(!SIM)MSND.pick(MODE);if(state==='aim'){drag=null;trail=[]}if(!titleOn&&state==='aim')banner(modeOf(MODE).e+' '+modeOf(MODE).n+'!',1)}
function shelfStickers(){var h='<b>Stickers:</b><div class="sg">',ms=save.st&&save.st.mouse;
 h+='<span class="'+(ms?'':'no')+'">'+(ms?'<img alt="" src="'+stickerImg()+'">':'<em>❔</em>')+'<br>'+(ms?'Mouse Buddy':'Secret helper')+'</span>';
 MODES.forEach(function(m){if(m.id==='classic')return;var n=save.st&&save.st['m_'+m.id];h+='<span class="'+(n?'':'no')+'"><img alt="" src="'+modeSticker(m.id)+'"><br>'+m.n+'</span>'});return h+'</div>'}
