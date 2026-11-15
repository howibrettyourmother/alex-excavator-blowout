/* ---------- v1.12.0 real meme clips + extras (sources and labels in CREDITS.md) ----------
 Mapped memes go through memePlay (the 1.5 s sting gate + priority: win > fail > others) plus a per-clip cooldown.
 Construction extras use fx(): per-clip cooldown + lim(). Everything plays via playSample, so aok() (audio guard / mute) and the Sounds slider apply. */
smpReg('vboom',['family-only/vine_boom.mp3']);smpReg('mlg',['family-only/airhorn.mp3']);smpReg('slidew',['family-only/slide_whistle.mp3']);
smpReg('bonk',['family-only/bonk.mp3']);smpReg('ohno',['family-only/oh_no_no_no.mp3']);smpReg('crowd_ooh',['family-only/crowd_ooh.mp3']);smpReg('rchicken',['family-only/rubber_chicken.mp3']);
smpReg('zitem',['family-only/zelda_item.mp3']);smpReg('zsecret',['family-only/zelda_secret.mp3']);smpReg('powerup',['family-only/mario_powerup.mp3']);
smpReg('noice',['family-only/noice.mp3']);smpReg('wilhelm',['family-only/wilhelm.mp3']);smpReg('itsame',['family-only/its_a_me.mp3']);smpReg('sadtrombone',['family-only/sad_trombone.mp3']);
smpReg('diesel',['meme-cc0/diesel_rev.mp3']);smpReg('backup',['meme-cc0/backup_beep.mp3']);smpReg('hiss',['meme-cc0/hydraulic_hiss.mp3']);smpReg('crash',['meme-cc0/debris_crash.mp3']);
/* add to Brett's existing ring pool rather than replacing it */
SMPL.ring=(SMPL.ring||['ring.mp3']).concat(['family-only/sonic_ring.mp3']);
var MCD={},MEV=[],MCFG={chP:.1,chEvery:25},MST={chT:0,chLv:-1,itsa:0};
function mevLog(e,k,ok){MEV.push([e,k,ok?1:0,Math.round(performance.now())]);if(MEV.length>300)MEV.shift()}
function mm(e,k,pri,vol,cd){if(SIM)return false;var n=performance.now();if(n-(MCD[k]||-1e9)<cd){mevLog(e,k,0);return false}var ok=memePlay(k,pri,vol);if(ok)MCD[k]=n;mevLog(e,k,ok);return ok}
function fx(e,k,vol,cd){if(SIM||!aok())return false;var n=performance.now();if(n-(MCD[k]||-1e9)<cd){mevLog(e,k,0);return false}var ok=playSample(k,vol,null,1,0,true);if(ok)MCD[k]=n;mevLog(e,k,ok);return ok}
/* inline hooks from the game code call memeEv(name) */
function memeEv(e){try{
 if(e==='miss')return mm(e,'bruh',1,.95,1200);
 if(e==='near')return mm(e,'crowd_ooh',2,.95,2500);
 if(e==='levelfail')return mm(e,'sadtrombone',3,.95,1500);/* real sad trombone; WA WA WA stays in the miss fail pool */
 if(e==='perfect')return mm(e,'mlg',3,.9,0);
 if(e==='math')return fx(e,'powerup',.85,1500);
 if(e==='junk')return mm(e,'wilhelm',2,.85,8000);
 if(e==='dump')return fx(e,'hiss',.6,2500);
 if(e==='crash')return fx(e,'crash',.8,2500);
}catch(x){}return false}
/* bucket bonk (grab), hydraulic hiss (release), diesel rev (start), backup beeper (park) */
(function(){var g0=grab;grab=function(b){g0(b);mm('bucket','bonk',1,.8,2500)};
 var d0=drop;drop=function(){var had=!!EX.carry;d0();if(had)fx('drop','hiss',.55,2500)};
 var s0=exStart;exStart=function(){var was=EX.on;s0();if(!was)fx('exstart','diesel',.5,20000)};
 var p0=exPark;exPark=function(cb){act({d:.01,end:function(){fx('expark','backup',.4,20000)}});p0(cb)};
 var r0=SFX.ring;SFX.ring=function(){r0.apply(this,arguments);after(.45,function(){mm('ring','noice',2,.9,15000)})};
 var u0=uvSaveFound;uvSaveFound=function(id){var nw=!(UV.found&&UV.found[id]);u0(id);if(nw)mm('secret','zsecret',3,.9,3000)};
 var w0=showWin;showWin=function(){w0();if(lastWin&&lastWin.first)mm('newprize','zitem',4,.9,0)};
 var g1=startGame;startGame=function(n){var r=g1.apply(this,arguments);if(!MST.itsa){MST.itsa=1;after(.7,function(){mm('start','itsame',2,.9,0)})}return r};
})();
/* the body list at load time is the box shell + table: hitting only these = "missed everything" */
Composite.allBodies(world).forEach(function(b){b.env=1});
Events.on(engine,'collisionStart',function(ev){if(SIMB||SIM)return;var ps=ev.pairs;for(var i=0;i<ps.length;i++){var A=ps[i].bodyA.parent,B=ps[i].bodyB.parent;
 if(ball&&(A===ball||B===ball)){var o=A===ball?B:A;if(!o.env&&fly)fly.touch=1;continue}
 /* vine boom: a falling block lands on a character's head (goat, chicken, duck, frog) */
 var t=A.toy?A:B.toy?B:null,d=t===A?B:A;if(!t||d.isStatic||d.toy||!/^(goat|chick|duck|frog)$/.test(t.kind))continue;
 if(d.position.y<t.position.y-18&&d.velocity.y>3)mm('head','vboom',2,.95,6000)}});
/* per-step watchers: slide whistle on long falls, "oh no no no" at a tower's tipping point, crowd heads, rare rubber chicken */
function memeStep(){if(SIM||SIMB)return;var dt=FIXED/1000,i,d;
 for(i=0;i<debris.length;i++){d=debris[i];if(d.isStatic||d===EX.carry){d.fy=null;continue}var vy=d.velocity.y;
  if(vy>.6){if(d.fy==null)d.fy=d.position.y;if(!d.sw&&d.position.y-d.fy>200&&vy>6){d.sw=1;mm('fall','slidew',1,.85,3500)}}else if(vy<.2){d.fy=null;d.sw=0}
  /* vine boom: a falling block is coming down onto a toy character's head (goat, chicken, duck, frog) */
  if(vy>3){var toys=Composite.allBodies(world);for(var k=0;k<toys.length;k++){var t=toys[k];if(!t.toy||!/^(goat|chick|duck|frog)$/.test(t.kind))continue;if(d.position.y<t.position.y-18&&Math.abs(d.position.x-t.position.x)<((t.sw||80)/2+24)){mm('head','vboom',2,.95,6000);break}}}}
 /* topple onset: a block resting up off the floor (on a stack or a ledge) for 1 s+ starts to tip; once per throw */
 for(i=0;i<debris.length;i++){d=debris[i];if(d.isStatic)continue;var up=d.position.y<FLOOR-60;if(d.speed<.15&&Math.abs(d.angularVelocity)<.01){d.rt=(d.rt||0)+dt}else if(d.rt&&up&&fly&&!fly.ohno&&(state==='fly'||state==='between')&&d.rt>1&&Math.abs(d.angularVelocity)>.02){fly.ohno=1;d.rt=0;mm('topple','ohno',2,.95,0)}else if(d.speed>1.5)d.rt=0}
 if(state==='aim'){MST.chT+=dt;if(MST.chT>MCFG.chEvery){MST.chT=0;if(MST.chLv!==lvKey()&&rnd()<MCFG.chP){if(mm('surprise','rchicken',1,.9,60000)){MST.chLv=lvKey();ftext(LX+120,LY-140,'BAWK?!','#fff27a')}}}}}
function lvKey(){try{return (CUS&&CUS.on?'c':'')+(save.lv||0)+'_'+(LV&&LV.name||'')}catch(e){return 0}}
/* test hooks: put real bodies into real situations; the normal code paths then fire */
function mtest(n,a){var d=debris.filter(function(b){return !b.isStatic&&b!==EX.carry});
 if(n==='head'){var g=null;Composite.allBodies(world).forEach(function(b){if(b.kind==='goat')g=b});if(!g)return false;var blk=d[0];if(!blk)blk=mkDeb(['scrap',g.position.x,g.position.y-120,70,50],0);Body.setStatic(blk,false);Body.setPosition(blk,{x:g.position.x,y:g.position.y-(g.sh||100)/2-50});Body.setVelocity(blk,{x:0,y:14});Sleeping.set(blk,false);return true}
 if(n==='lift'&&d[0]){Body.setPosition(d[0],{x:d[0].position.x,y:a||TOP+40});Body.setVelocity(d[0],{x:0,y:0});Sleeping.set(d[0],false);return true}
 if(n==='junk'&&d[0]){Body.setPosition(d[0],{x:BX1+12,y:HOLE.y0+10});return state}
 if(n==='ring'){SFX.ring();return true}
 if(n==='near'){var out=[];for(var g=-10;g<=60;g+=2)for(var q=.3;q<=1.001;q+=.05){var r=simBall(g,q,true);if(r.res===1||r.res==='win')continue;var m=1e9;(r.path||[]).forEach(function(pt){m=Math.min(m,Math.hypot(pt.x-BX0,pt.y-(HOLE.y0+HOLE.y1)/2))});if(m<80)out.push([g,+q.toFixed(2),Math.round(m)])}return out.sort(function(x,y){return x[2]-y[2]}).slice(0,8)}
 if(n==='deb')return debris.map(function(b){return[Math.round(b.position.x),Math.round(b.position.y),+b.angle.toFixed(2),+b.angularVelocity.toFixed(3),+b.speed.toFixed(2),b.isStatic?1:0]});
 if(n==='secret'){uvSaveFound('mtest'+Date.now());return true}
 if(n==='topple'){var b=d[0];if(!b)return false;Body.setStatic(b,false);Body.setPosition(b,{x:b.position.x,y:FLOOR-150});Body.setVelocity(b,{x:0,y:0});Sleeping.set(b,false);b.rt=1.5;if(!fly)fly={};fly.ohno=0;if(state!=='fly'&&state!=='between')state='fly';Body.setAngularVelocity(b,.08);return true}
 return false}
(function(){var s0=physStep;physStep=function(){s0();try{memeStep()}catch(e){}}})();
