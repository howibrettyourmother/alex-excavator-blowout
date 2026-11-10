/* ---------- particles, shake, floating text ---------- */
var P=[],MAXP=220,shk=0,FT=[];
function emit(o){if(P.length>=MAXP){if(o.k!=='conf')return;P.shift()}o.l=o.l||o.m;P.push(o)}
function sparks(x,y,n,col){for(var i=0;i<n;i++){var a=rnd()*2*PI,s=120+rnd()*320;emit({k:'sp',x:x,y:y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-80,m:.35+rnd()*.25,c:col||'#ffe27a',s:3})}}
function dust(x,y,n){for(var i=0;i<n;i++)emit({k:'du',x:x+(rnd()-.5)*30,y:y,vx:(rnd()-.5)*160,vy:-40-rnd()*120,m:.6+rnd()*.5,c:'rgba(200,160,110,',s:8+rnd()*12})}
function confetti(x,y,n){var cols=['#ffcb05','#2f8a3a','#e8342a','#1f6fd1','#ff7ac8','#7a4bc4','#fff'];for(var i=0;i<n;i++){var a=-PI/2+(rnd()-.5)*2.2,s=300+rnd()*700;emit({k:'conf',x:x,y:y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,m:2.2+rnd()*1.3,c:cols[i%7],s:8+rnd()*8,r:rnd()*6,vr:(rnd()-.5)*14})}}
function shake(a){shk=Math.min(28,Math.max(shk,a))}
function ftext(x,y,t,c){FT.push({x:x,y:y,t:t,c:c||'#ffde3b',l:1.3});if(FT.length>12)FT.shift()}
function updP(dt){for(var i=P.length-1;i>=0;i--){var p=P[i];p.l-=dt;if(p.l<=0){P.splice(i,1);continue}
 if(p.k==='conf'){p.vx*=Math.pow(.25,dt);p.vy=p.vy*Math.pow(.3,dt)+900*dt*.5;p.vy=Math.min(p.vy,260);p.r+=p.vr*dt;p.x+=p.vx*dt+Math.sin(p.l*8+p.s)*40*dt}
 else if(p.k==='du'||p.k==='sm'){p.vx*=.96;p.vy*=.96;p.s+=dt*30;p.x+=p.vx*dt}else{p.vy+=(p.k==='st'?600:900)*dt;p.x+=p.vx*dt}
 p.y+=p.vy*dt}
 for(i=FT.length-1;i>=0;i--){FT[i].l-=dt;FT[i].y-=50*dt;if(FT[i].l<=0)FT.splice(i,1)}}
function drawP(g){for(var i=0;i<P.length;i++){var p=P[i],a=clamp(p.l/p.m,0,1);
 if(p.k==='conf'){g.save();g.translate(p.x,p.y);g.rotate(p.r);g.globalAlpha=Math.min(1,a*2);g.fillStyle=p.c;g.fillRect(-p.s/2,-p.s/4*Math.abs(Math.cos(p.r*1.3))-1,p.s,p.s/2*Math.abs(Math.cos(p.r*1.3))+2);g.restore()}
 else if(p.k==='du'||p.k==='sm'){g.globalAlpha=a*.5;g.fillStyle=p.k==='sm'?'#777':'#c8a070';g.beginPath();g.arc(p.x,p.y,p.s,0,2*PI);g.fill()}
 else if(p.k==='str'){g.globalAlpha=a;g.strokeStyle=p.c;g.lineWidth=2.5;g.beginPath();g.moveTo(p.x,p.y);g.quadraticCurveTo(p.x+6,p.y-6,p.x+12,p.y+2);g.stroke()}
 else{g.globalAlpha=a;g.fillStyle=p.c;g.fillRect(p.x-p.s/2,p.y-p.s/2,p.s,p.s)}}g.globalAlpha=1;
 g.font='34px '+MK;g.textAlign='center';for(i=0;i<FT.length;i++){var f=FT[i];g.globalAlpha=clamp(f.l,0,1);g.lineWidth=6;g.strokeStyle='#3a1d00';g.strokeText(f.t,f.x,f.y);g.fillStyle=f.c;g.fillText(f.t,f.x,f.y)}g.globalAlpha=1;g.textAlign='left'}
/* ---------- timers + excavator action queue ---------- */
var TM=[];function after(s,f){TM.push({t:s,f:f})}
function updTM(dt){for(var i=TM.length-1;i>=0;i--){TM[i].t-=dt;if(TM[i].t<=0){var f=TM[i].f;TM.splice(i,1);f()}}}
var Q=[],cq=null;function act(o){Q.push(o)}
function exBusy(){return !!(cq||Q.length)}
function runQ(dt){var px=EX.x;
 if(!cq&&Q.length){cq=Q.shift();cq.t=0;if(cq.start)cq.start(cq);cq.ex0=EX.x;cq.tx0=EX.tx;cq.ty0=EX.ty;cq.ba0=EX.ba}
 if(cq){cq.t+=dt;var k=cq.d?clamp(cq.t/cq.d,0,1):1,e=ease(k);if(cq.ex!=null)EX.x=lerp(cq.ex0,cq.ex,e);if(cq.tx!=null){EX.tx=lerp(cq.tx0,cq.tx,e);EX.ty=lerp(cq.ty0,cq.ty,e)}if(cq.ba!=null)EX.ba=lerp(cq.ba0,cq.ba,e);
  if(k>=1){var c=cq;cq=null;if(c.end)c.end()}}
 var dx=EX.x-px;EX.ph+=dx*1.2;if(dx>.3&&lim('beep',420))SFX.beep();engRev(cq&&cq.d?1:0);
 if(EX.carry){var s=shoulder(),k2=ik(s.x,s.y,EX.tx,EX.ty),c2=Math.cos(EX.ba),s2=Math.sin(EX.ba);Body.setPosition(EX.carry,{x:k2.wx+22*c2-44*s2,y:k2.wy+22*s2+44*c2});Body.setAngle(EX.carry,EX.carry.ca)}
 if(EX.on){EX.bt+=dt;if(EX.bt>.12){EX.bt=0;emit({k:'sm',x:EX.x+45,y:TOP-155,vx:20+rnd()*30,vy:-90,m:1,s:6})}}}
function tipFor(px,py,ba){var c=Math.cos(ba),s=Math.sin(ba);return{x:px-(22*c-44*s),y:py-(22*s+44*c)}}
function exStart(){if(!EX.on){EX.on=true;engSnd(true)}$('skip').style.display='block'}
function exPark(cb){act({d:.7,ex:EXPARK,tx:EXPARK-400,ty:TOP-30,ba:1.5,end:function(){EX.on=false;EX.speed=1;engSnd(false);$('skip').style.display='none';if(cb)cb()}})}
function grab(b){Sleeping.set(b,false);Body.setStatic(b,true);b.ca=b.angle;EX.carry=b;SFX.thunk();dust(b.position.x,b.position.y+20,4)}
function drop(){var b=EX.carry;if(!b)return;EX.carry=null;Body.setStatic(b,false);Sleeping.set(b,false);Body.setVelocity(b,{x:(rnd()-.5)*3,y:1});Body.setAngularVelocity(b,(rnd()-.5)*.25)}
function moveTo(px,py,d,ba){return{d:d,start:function(c){var t=tipFor(px,py,ba==null?EX.ba:ba);c.tx=t.x;c.ty=t.y;c.ex=clamp(px+270,EXMIN,EXMAX);if(ba!=null)c.ba=ba}}}
function shuffle(n,cb){var cand=debris.filter(function(b){return !b.gone});for(var i=cand.length-1;i>0;i--){var j=(rnd()*(i+1))|0,t=cand[i];cand[i]=cand[j];cand[j]=t}cand=cand.slice(0,n);
 if(!cand.length){cb();return}exStart();banner('Excavator shuffle!',1);
 cand.forEach(function(b){var nx=600+rnd()*640;
  act({d:.5,start:function(c){var t=tipFor(b.position.x,b.position.y-70,1.3);c.tx=t.x;c.ty=t.y;c.ex=clamp(b.position.x+270,EXMIN,EXMAX);c.ba=1.3}});
  act({d:.22,start:function(c){var t=tipFor(b.position.x,b.position.y,1.3);c.tx=t.x;c.ty=t.y},end:function(){grab(b)}});
  act({d:.3,start:function(c){c.tx=EX.tx;c.ty=TOP+40}});
  act({d:.55,start:function(c){var t=tipFor(nx,560,1.3);c.tx=t.x;c.ty=t.y;c.ex=clamp(nx+270,EXMIN,EXMAX)}});
  act({d:.25,start:function(c){var t=tipFor(nx,690,1.3);c.tx=t.x;c.ty=t.y},end:drop})});
 exPark(cb)}
var flying=[];
function blowout(cb){if(!debris.length&&!statics.length&&!movers.length){cb();return}exStart();
 act({d:.5,ex:1120,tx:900,ty:TOP-230,ba:.3});
 act({d:.2,tx:880,ty:FLOOR-90,ba:1.5,end:function(){SFX.boom();shake(26);banner('BLOWOUT!');dust(880,FLOOR,14);
  debris.forEach(function(b){if(b.isStatic)Body.setStatic(b,false);b.collisionFilter={group:0,category:2,mask:0};Sleeping.set(b,false);Body.setVelocity(b,{x:(rnd()-.5)*16,y:-24-rnd()*14});Body.setAngularVelocity(b,(rnd()-.5)*.6);b.gone=gt;flying.push(b)});debris=[];
  statics.concat(movers).forEach(function(b){dust(b.position.x,b.position.y,5)})}});
 act({d:.4,tx:900,ty:TOP-230,ba:.6,end:cb})}
function dumpLevel(cb){var defs=(LV.deb||[]).slice().sort(function(a,b){return a[1]-b[1]});exStart();var groups=[];for(var i=0;i<defs.length;i+=3)groups.push(defs.slice(i,i+3));
 groups.forEach(function(gp,gi){var cx=gp.reduce(function(s,d){return s+d[1]},0)/gp.length,cy=Math.min.apply(null,gp.map(function(d){return d[2]})),ly=clamp(cy-150,TOP+70,640);
  act({d:.55,start:function(c){EX.load={seed:gi*31+7};var t=tipFor(cx,TOP-40,.5);c.tx=t.x;c.ty=t.y;c.ex=clamp(cx+270,EXMIN,EXMAX);c.ba=.5}});
  act({d:.35,start:function(c){var t=tipFor(cx,ly,.5);c.tx=t.x;c.ty=t.y}});
  act({d:.22,ba:-.5,end:function(){EX.load=null;SFX.dump();gp.forEach(function(d){var sd=Math.min(100,d[2]-(TOP+50));var b=mkDeb(d,sd);Body.setAngularVelocity(b,(rnd()-.5)*.15)});shake(5)}});
  act({d:.3,start:function(c){c.tx=EX.tx;c.ty=TOP-60},ba:.5})});
 exPark(cb)}
/* ---------- game flow ---------- */
var state='title',ball=null,throwsLeft=3,roundTk=0,fly=null,SIM=false,simRes=null,stats={hits:0,wins:0,throws:0},settleT=0,dispTk=save.tk,trail=[],drag=null;
function banner(t,small){if(SIM)return;var b=$('banner');b.textContent=t;b.className='mk'+(small?' small':'');void b.offsetWidth;b.className='mk on'+(small?' small':'')}
function hud(){$('lvl').textContent='Level '+(lvN+1)+' · '+LV.n;var bs=$('balls').children;for(var i=0;i<3;i++)bs[i].className=i<throwsLeft?'':'used';$('pc').textContent=prizeCount()}
function prizeCount(){var n=0;for(var k in save.pz)n+=save.pz[k];return n}
function goLevel(n,first){state='build';if(ball){Composite.remove(world,ball);ball=null}trail=[];lvN=n;save.lv=n;save.best=Math.max(save.best||0,n);persist();
 var fresh=function(){setupLevel(n,false);hud();banner('Level '+(n+1)+': '+LV.n,1);after(.4,function(){dumpLevel(function(){state='settle';settleT=0})})};
 if(first){if(debris.length||statics.length){clearLevel(false)}fresh()}else blowout(fresh)}
function newRound(){throwsLeft=3;roundTk=0;gems.forEach(function(g){g.got=false});hud();spawnAim()}
function spawnAim(){state='aim';drag=null;if(ball){Composite.remove(world,ball);ball=null}trail=[];hud()}
function launch(deg,p){deg=clamp(deg,-25,75);p=clamp(p,0,1);var a=deg*PI/180,v=9+25*p;
 ball=Bodies.circle(LX,LY,BR,{density:.004,restitution:.52,friction:.03,frictionStatic:.3,frictionAir:.004,label:'ball',sleepThreshold:120});ball.mat='ball';Composite.add(world,ball);
 Body.setVelocity(ball,{x:Math.cos(a)*v,y:-Math.sin(a)*v});Body.setAngularVelocity(ball,.15);fly={t:0,still:0,px:LX,ringed:false};state='fly';throwsLeft--;stats.throws++;save.th=(save.th||0)+1;
 if(!SIM){SFX.throw(p);hud()}}
function endThrow(){if(SIM){simRes='miss';state='simdone';return}state='between';var b=ball;if(b){dust(b.position.x,b.position.y,3)}
 after(.35,function(){if(ball){Composite.remove(world,ball);ball=null}if(throwsLeft>0){spawnAim();banner('Throw '+(4-throwsLeft)+' of 3',1)}else roundLost()})}
function roundLost(){state='lost';SFX.aww();banner('So close!');after(1.3,function(){shuffle(3,function(){state='settle';settleT=0;LV._round=1})})}
var lastWin=null;
function win(){if(SIM){simRes='win';state='simdone';return}state='won';stats.wins++;var bx=BX1+30,by=(HOLE.y0+HOLE.y1)/2;
 SFX.fanfare();shake(18);confetti(bx,by,140);sparks(bx,by,20,'#fff6a0');banner('PRIZE!');
 var ex=throwsLeft*3,tot=5+ex+roundTk,pr=PRIZES[save.w%PRIZES.length];save.w++;save.pz[pr.id]=(save.pz[pr.id]||0)+1;var before=save.tk;save.tk+=tot;
 var newG=GRAND.filter(function(gp){return !save.gp[gp.id]&&save.tk>=gp.at});newG.forEach(function(gp){save.gp[gp.id]=1});persist();
 lastWin={pr:pr,ex:ex,rt:roundTk,tot:tot,newG:newG};after(1.5,showWin)}
var PRIZES=[{id:'coney',e:'🌭',n:'Detroit Coney Dog'},{id:'mitten',e:'🧤',n:'Michigan Mitten'},{id:'bridge',e:'🌉',n:'Mackinac Bridge'},{id:'car',e:'🏎️',n:'Motor City Race Car'},
 {id:'cherry',e:'🍒',n:'Traverse City Cherries'},{id:'paczki',e:'🍩',n:'Pączki Donut'},{id:'stone',e:'🪨',n:'Petoskey Stone'},{id:'boat',e:'⛵',n:'Great Lakes Sailboat'},
 {id:'deer',e:'🦌',n:'Up North Deer'},{id:'hockey',e:'🏒',n:'Hockeytown Stick'},{id:'dunes',e:'🏖️',n:'Sleeping Bear Dunes'},{id:'fish',e:'🐟',n:'Lake Michigan Trout'}];
var GRAND=[{id:'goldex',e:'🏆',n:'Golden Excavator Trophy',at:100},{id:'crown',e:'👑',n:'Blowout Champion Crown',at:250},{id:'star',e:'🌟',n:'Super Star Digger',at:500}];
function showWin(){var w=lastWin;$('prizeBig').textContent=w.pr.e;$('prizeName').textContent=w.pr.n;
 var rows=['Prize hole: <b>5</b> 🎟️'];if(w.ex)rows.push('Extra balls: '+(w.ex/3)+' × 3 = <b>'+w.ex+'</b> 🎟️');if(w.rt)rows.push('Gems, ring &amp; junk: <b>'+w.rt+'</b> 🎟️');$('tkRows').innerHTML=rows.join('<br>');
 var terms=[5];if(w.ex)terms.push(w.ex);if(w.rt)terms.push(w.rt);var q,ans;if(terms.length===1){q='Double it! 5 + 5 = ?';ans=10}else{q='Count your tickets! '+terms.join(' + ')+' = ?';ans=w.tot}
 var ch=[ans],tries=0;while(ch.length<3&&tries++<50){var c=ans+((rnd()*7)|0)-3;if(c>0&&ch.indexOf(c)<0)ch.push(c)}ch.sort(function(){return rnd()-.5});
 var m=$('math');m.innerHTML='<div class="q mk">🧮 '+q+'</div>'+ch.map(function(c){return'<button class="ch mk" data-v="'+c+'">'+c+'</button>'}).join('')+'<div class="r mk">Bonus math: get it right for +3 🎟️</div>';
 var done=false;m.querySelectorAll('.ch').forEach(function(bt){bt.addEventListener('click',function(){if(done)return;done=true;var v=+bt.dataset.v;if(v===ans){bt.classList.add('ok');SFX.ok();save.tk+=3;persist();m.querySelector('.r').textContent='Math whiz! +3 🎟️';confetti(W/2,H/2,30)}
  else{bt.classList.add('no');SFX.no();m.querySelectorAll('.ch').forEach(function(b2){if(+b2.dataset.v===ans)b2.classList.add('ok')});m.querySelector('.r').textContent='Nice try! It was '+ans+'.'}})});
 $('grandMsg').textContent=w.newG.length?('NEW GRAND PRIZE: '+w.newG.map(function(g){return g.e+' '+g.n}).join(', ')+'!'):'';
 $('win').classList.add('on')}
function showShelf(){var h='';PRIZES.forEach(function(p){var n=save.pz[p.id]||0;h+='<div class="pz'+(n?'':' no')+'">'+(n?p.e:'❔')+(n>1?'<b>×'+n+'</b>':'')+'<small>'+(n?p.n:'???')+'</small></div>'});$('shelfGrid').innerHTML=h;
 $('grand').innerHTML=GRAND.map(function(g){var got=save.gp[g.id],pc=Math.min(100,save.tk/g.at*100);return'<div class="gp'+(got?'':' no')+'"><div class="e">'+g.e+'</div><b>'+g.n+'</b><div>'+(got?'Won!':save.tk+' / '+g.at+' 🎟️')+'</div><div class="bar"><i style="width:'+pc+'%"></i></div></div>'}).join('');
 $('stats').textContent='Prizes won: '+prizeCount()+' · Tickets: '+save.tk+' · Best level: '+((save.best||0)+1);$('shelf').classList.add('on')}
/* ---------- physics step ---------- */
Events.on(engine,'collisionStart',function(ev){var ps=ev.pairs;for(var i=0;i<ps.length;i++){var pr=ps[i],A=pr.bodyA.parent,B=pr.bodyB.parent,n=pr.collision.normal;
 var va=A.isStatic?A.velocity:Body.getVelocity(A),vb=B.isStatic?B.velocity:Body.getVelocity(B),rv=Math.abs((va.x-vb.x)*n.x+(va.y-vb.y)*n.y);
 var isB=A===ball||B===ball;if(!isB&&rv<4)continue;var o=A===ball?B:A,sp=pr.collision.supports&&pr.collision.supports[0];
 if(isB){stats.hits++;if(SIM)continue;if(rv>2.5)SFX.hit(o.mat||'card',rv);if(rv>7)shake(Math.min(12,rv*.7));if(sp&&rv>5)sparks(sp.x,sp.y,Math.min(8,(rv/2)|0),o.mat==='plate'?'#fff':'#ffe27a');
  if(o.kind==='wrap'&&rv>3)popBubble(o,sp)}else if(!SIM){SFX.hit((A.mat==='wall'||A.mat==='table')?B.mat:A.mat,rv*.6)}}});
function popBubble(b,sp){if(!sp)return;var c=Math.cos(-b.angle),s=Math.sin(-b.angle),lx=(sp.x-b.position.x)*c-(sp.y-b.position.y)*s+b.ww/2,ly=(sp.x-b.position.x)*s+(sp.y-b.position.y)*c+b.wh/2;
 var ix=clamp(Math.round((lx-10)/20),0,Math.floor((b.ww-10)/20)),iy=clamp(Math.round((ly-10)/20),0,Math.floor((b.wh-10)/20)),key=ix+','+iy;if(b.pops.indexOf(key)<0){b.pops.push(key);b.dirty=1;SFX.pop();sparks(sp.x,sp.y,4,'#dff4ff')}}
function physStep(){gt+=FIXED/1000;moveMovers();Engine.update(engine,FIXED);
 for(var i=flying.length-1;i>=0;i--){var f=flying[i];if(f.position.y<-300||gt-f.gone>2.5){Composite.remove(world,f);flying.splice(i,1)}}
 for(i=debris.length-1;i>=0;i--){var d=debris[i];if(d.position.x>BX1+8&&!d.isStatic){Composite.remove(world,d);debris.splice(i,1);if(state==='fly'){roundTk++;if(!SIM){ftext(BX1+40,HOLE.y0-20,'+1 🎟️ junk!');SFX.tick(3)}}}}
 if(state!=='fly'||!ball)return;var bp=ball.position;fly.t+=FIXED/1000;
 if(!SIM&&(trail.length===0||Math.hypot(trail[trail.length-1].x-bp.x,trail[trail.length-1].y-bp.y)>14)){trail.push({x:bp.x,y:bp.y});if(trail.length>10)trail.shift()}
 for(i=0;i<gems.length;i++){var g=gems[i];if(!g.got&&Math.hypot(bp.x-g.x,bp.y-g.y)<BR+14){g.got=true;roundTk++;if(!SIM){SFX.gem();sparks(g.x,g.y,10,'#dff4ff');ftext(g.x,g.y-20,'+1 🎟️','#bfe9ff')}}}
 if(ring&&!fly.ringed&&Math.hypot(bp.x-ring.x,bp.y-ring.y)<26){fly.ringed=true;roundTk+=3;ring.w=1;if(!SIM){SFX.ring();sparks(ring.x,ring.y,14,'#ffd21a');ftext(ring.x,ring.y-40,'Ring! +3 🎟️','#ffd21a')}}
 var inS=false;for(i=0;i<shreds.length;i++){var sh=shreds[i];if(bp.x>sh.x0-5&&bp.x<sh.x1+5&&bp.y>FLOOR-sh.h){inS=true;if(!SIM&&lim('shr',90)&&ball.speed>.8)emit({k:'str',x:bp.x,y:bp.y,vx:(rnd()-.5)*200,vy:-150-rnd()*150,m:.8,c:['#4fb6d6','#2f8fbf','#8fd6ea'][(rnd()*3)|0]})}}
 ball.frictionAir=inS?.045:.004;
 if(bp.x>BX0+20&&fly.px<=BX0+20&&bp.y>HOLE.y0-6&&bp.y<HOLE.y1+6){fly.px=bp.x;win();return}fly.px=bp.x;
 var sp=ball.isSleeping?0:Body.getSpeed(ball);if(sp<.3)fly.still+=FIXED/1000;else fly.still=0;
 if((fly.still>.7&&fly.t>.6)||fly.t>11||bp.y>TABLE+200||bp.x<-280||(bp.x>BX1+5&&bp.y>HOLE.y1+40))endThrow()}
