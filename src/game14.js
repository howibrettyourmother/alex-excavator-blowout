/* ===== v1.14.0: custom-level solvability check (real physics search, chunked for iPad) ===== */
var CHK={on:false,st:'idle',kind:null,reason:'',hits:[],hole:0,mode:'classic',q:null,t0:0,n:0,capN:120,capMs:3200,best:null,tok:0,busy:false,phase:0,phases:1,watch:null};
function chkModeName(){var m=modeOf(MODE);return m&&m.id!=='classic'?m.n:''}
function chkLabel(kind,reason){var md=chkModeName();
 if(kind==='ok')return md?'✅ Beatable with the '+md+'!':'✅ Beatable!';
 if(kind==='no')return md?'⛔ Impossible with the '+md:'⛔ Impossible';
 if(kind==='hard')return '🤔 Too tricky to check';
 if(kind==='run')return '🔎 Checking…';
 return '🔎 Check level'}
function chkFlagEl(){return $('edFlag')}
function chkPaint(){var el=chkFlagEl();if(!el)return;var k=CHK.kind||'idle';
 el.className='edFlag tag mk '+k;el.setAttribute('data-k',k);
 var sub=CHK.kind==='no'||CHK.kind==='hard'?CHK.reason:'';
 if(CHK.kind==='run'&&CHK.n)sub='Tried '+CHK.n+' throws…';
 el.innerHTML=chkLabel(CHK.kind,CHK.reason)+(sub?'<small>'+sub+'</small>':'');
 el.setAttribute('aria-label',(el.textContent||'Check level').replace(/\s+/g,' ').trim())}
function chkCancel(){CHK.tok++;CHK.q=null;CHK.busy=false;if(CHK.kind==='run'){CHK.kind='idle';CHK.reason='';chkPaint()}}
function scheduleChk(now){if(state!=='edit'&&!now)return;CHK.tok++;CHK.q=null;var tok=CHK.tok;CHK.kind='run';CHK.reason='';CHK.hits=[];CHK.hole=0;CHK._reach='';chkPaint();
 var wait=now?0:420;clearTimeout(scheduleChk.t);scheduleChk.t=setTimeout(function(){if(tok!==CHK.tok||state!=='edit')return;chkStart()},wait)}
function chkNow(){if(state!=='edit')return;scheduleChk(true)}
function chkIgnoreWall(b){return b===bwTop||b===bwBot||b===ceil||b.holeLedge||(b.mat==='table')}
function chkHitsBody(x,y,R,list){var t=Bodies.circle(x,y,R,{isSensor:true,isStatic:true}),i,c,b;
 for(i=0;i<(list||[]).length;i++){b=list[i];if(!b||chkIgnoreWall(b))continue;
  try{c=M.Collision.collides(t,b)}catch(e){c=null}if(c)return b}
 return null}
function chkHoleMouth(){/* samples the prize-hole opening just inside the box; a hit means a static is sealing that slice */
 var R=ballR(),y0=HOLE.y0,y1=HOLE.y1,x=BX0-R-2,list=statics.concat(movers),free=0,block=[],y,b,gap=y1-y0;
 if(gap<R*2-2)return{ok:false,reason:'The prize hole is too tight for this ball',hits:[],hole:1};
 for(y=y0+R;y<=y1-R+0.1;y+=3){b=chkHitsBody(x,y,R,list);if(!b)free++;else if(block.indexOf(b)<0)block.push(b)}
 if(y0+R>y1-R){b=chkHitsBody(x,(y0+y1)/2,Math.max(4,gap/2-1),list);if(!b)free++;else block.push(b)}
 return{ok:free>0,reason:free? '': 'Something is blocking the prize hole',hits:block,hole:free?0:1}}
function chkReachable(){/* coarse flood-fill from the throw spot, treating loose junk as movable. Skip if flingers could throw the ball over walls. */
 var fling=statics.some(function(b){return b&&(b.kind==='tramp'||b.kind==='fan'||b.kind==='glove'||b.kind==='spin'||b.kind==='paste'||b.kind==='pin')});
 if(fling||(PORT&&PORT.some(function(p){return !!p})))return{ok:true,skip:1};
 var R=ballR(),cs=24,x0=LX-80,x1=BX0+40,y0=TOP-20,y1=FLOOR+20,Wq=Math.ceil((x1-x0)/cs),Hq=Math.ceil((y1-y0)/cs);
 function cell(x,y){return ((x-x0)/cs|0)+((y-y0)/cs|0)*Wq}
 function mid(i){var cx=i%Wq,cy=(i/Wq)|0;return{x:x0+(cx+.5)*cs,y:y0+(cy+.5)*cs}}
 var list=statics.concat(movers),blocked={},i,p,q,n,src,dst,seen={},stack=[],key;
 for(i=0;i<Wq*Hq;i++){p=mid(i);if(p.y<TOP+R-8||p.y>FLOOR-R+4){blocked[i]=1;continue}
  if(p.x>FX0-10&&p.x<FX1+R&&(p.y<GAP0+R-8||p.y>GAP1-R+8)){blocked[i]=1;continue}
  if(chkHitsBody(p.x,p.y,R-2,list))blocked[i]=1}
 src=cell(LX,LY);if(blocked[src])src=cell(LX,Math.min(GAP1-R-4,Math.max(GAP0+R+4,LY)));
 stack.push(src);seen[src]=1;
 while(stack.length){i=stack.pop();p=mid(i);n=[i-1,i+1,i-Wq,i+Wq];
  for(q=0;q<4;q++){key=n[q];if(key<0||key>=Wq*Hq||seen[key]||blocked[key])continue;seen[key]=1;stack.push(key)}}
 var ok=0,y,c;for(y=HOLE.y0+R;y<=HOLE.y1-R+0.1;y+=cs){c=cell(BX0-R-8,y);if(seen[c]){ok=1;break}}
 if(!ok){c=cell(BX0-R-8,(HOLE.y0+HOLE.y1)/2);if(seen[c])ok=1}
 return{ok:!!ok,reason:ok?'':'The excavator can\'t reach the gold',hits:chkBodiesToItems(statics.concat(movers).filter(function(b){return b&&!chkIgnoreWall(b)&&b.position.x>900}))}}
function chkBodiesToItems(bodies){var hits=[],i,it,b,r;
 for(i=0;i<ED.items.length;i++){it=ED.items[i];if(it.t==='gem'||it.t==='ring')continue;r=Math.max(PT[it.t].w,PT[it.t].h)/2+36;
  for(b=0;b<bodies.length;b++){if(Math.hypot((bodies[b].position?bodies[b].position.x:bodies[b].x)-it.x,(bodies[b].position?bodies[b].position.y:bodies[b].y)-it.y)<r){hits.push(i);break}}}
 return hits}
function chkPtsToItems(pts){return chkBodiesToItems(pts||[])}
function chkQueue(){var q=[],seen={},a,p,k,push=function(a,p){k=a+','+(+p).toFixed(2);if(seen[k])return;seen[k]=1;q.push([a,+(+p).toFixed(2)])};
 for(a=2;a<=30;a+=4)for(p=.45;p<=.91;p+=.15)push(a,p);
 for(a=-10;a<=60;a+=4)for(p=.3;p<=1.001;p+=.1)push(a,p);
 return q}
function chkSim(deg,p,extra,boostAt){var keep={st:state,gt:gt,tk:throwsLeft,rt:roundTk,sim:SIM},res='timeout',i,bp,minD=1e9,entered=0,near=0,close={x:0,y:0},R=ballR();
 CHK.busy=true;SIM=true;try{
  if(ball){Composite.remove(world,ball);ball=null}clearXB();gt=0;clearLevel(false);setupLevel(0,true);
  for(i=0;i<240+(extra||0);i++)physStep();throwsLeft=3;roundTk=0;simRes=null;launch(deg,p);
  for(i=0;i<1600&&state==='fly';i++){
   if(boostAt!=null&&fly&&fly.boost&&fly.t>=boostAt)rocketTap();
   physStep();
   if(!ball)break;bp=ball.position;
   if(bp.x>FX1+R)entered=1;
   var d=Math.hypot(bp.x-BX0,bp.y-(HOLE.y0+HOLE.y1)/2);if(d<minD){minD=d;close={x:bp.x,y:bp.y}}
   if(bp.x>BX0-140&&bp.y>HOLE.y0-40&&bp.y<HOLE.y1+40)near=1}
  res=simRes||'timeout';
  if(ball){Composite.remove(world,ball);ball=null}clearXB();
 }catch(e){res='err'}
 SIM=keep.sim;throwsLeft=keep.tk;roundTk=keep.rt;gt=keep.gt;state=keep.st;
 return{res:res,minD:minD,entered:entered,near:near,close:close}}
function chkRestore(){CHK.busy=true;try{if(ball){Composite.remove(world,ball);ball=null}clearXB();SIM=false;state='edit';edBuild()}catch(e){}CHK.busy=false}
function chkStart(){if(state!=='edit'||ED.drag){if(state==='edit')scheduleChk();return}
 var mouth=chkHoleMouth(),reach,md=MODE,q,ph;
 CHK.mode=md;CHK.best={minD:1e9,entered:0,near:0,close:null,pts:[]};CHK.n=0;CHK.t0=performance.now();CHK.phase=0;
 CHK.phases=(ED.hole&&ED.hole.mv)?4:1;CHK.hits=[];CHK.hole=0;
 if(!mouth.ok){CHK.kind='no';CHK.reason=mouth.reason;CHK.hole=1;CHK.hits=chkBodiesToItems(mouth.hits);CHK.q=null;chkPaint();return}
 reach=chkReachable();
 if(reach&&!reach.ok&&!reach.skip){CHK.hits=reach.hits||[];CHK._reach=reach.reason}
 q=chkQueue();CHK.q=q;CHK.kind='run';chkPaint()}
function chkStep(sync){if(!CHK.q||state!=='edit'||(ED.drag&&!sync))return;
 var budget=sync?1e9:8,t0=performance.now(),shot,r,period,extra,boosts,b,tok=CHK.tok;
 while(CHK.q.length&&(sync||performance.now()-t0<budget)){
  if(!sync&&performance.now()-CHK.t0>CHK.capMs)break;
  if(CHK.n>=CHK.capN)break;
  shot=CHK.q.shift();extra=0;
  if(CHK.phase>0){period=ED.hole&&ED.hole.mv?4.6:4.6;extra=Math.round((CHK.phase*(period*120))/4)}
  if(tok!==CHK.tok){chkRestore();return}r=chkSim(shot[0],shot[1],extra,shot[2]);CHK.n++;
  if(r.minD<CHK.best.minD){CHK.best.minD=r.minD;CHK.best.close=r.close}if(r.entered)CHK.best.entered=1;if(r.near)CHK.best.near=1;
  if(r.close)CHK.best.pts.push(r.close);
  if(r.res==='win'){CHK.q=null;CHK.kind='ok';CHK.reason='';CHK.hits=[];CHK.hole=0;chkRestore();chkPaint();return}
 }
 chkRestore();
 if(CHK.q&&CHK.q.length&&CHK.n<CHK.capN&&performance.now()-CHK.t0<=CHK.capMs){chkPaint();return}
 /* grid (or time) done for this phase */
 if(CHK.kind!=='ok'&&CHK.phase<CHK.phases-1&&CHK.n<CHK.capN&&(sync||performance.now()-CHK.t0<CHK.capMs-200)){
  CHK.phase++;CHK.q=chkQueue();chkPaint();return}
 /* rocket: try one boost on the closest misses if we still have budget */
 if(MODE==='rocket'&&CHK.kind!=='ok'&&CHK.n<CHK.capN-6&&(sync||performance.now()-CHK.t0<CHK.capMs-200)){
  if(!CHK._rkt){CHK._rkt=1;boosts=[];for(b=0;b<(CHK.best.pts||[]).length&&boosts.length<8;b++)boosts.push([null,null,.35+.15*(b%4)]);
   /* re-queue a few typical shots with boost times */
   CHK.q=[[18,.7,.35],[18,.7,.6],[22,.85,.35],[10,.6,.5],[26,.9,.4],[14,.75,.7]];chkPaint();return}
 }
 var cap=!sync&&(performance.now()-CHK.t0>CHK.capMs||(CHK.q&&CHK.q.length>0&&CHK.n>=CHK.capN));
 if(ED.hole&&ED.hole.mv&&CHK.phase<CHK.phases-1&&!CHK.best.entered){/* still may be a later phase; if we stopped early, don't guess */}
 if(cap&&!(CHK.best&&CHK.best.entered===0&&!ED.hole.mv&&CHK.n>=80)){CHK.kind='hard';CHK.reason='This one is too packed to check fast.';CHK.q=null;chkPaint();return}
 /* finished a real search with no winning throw */
 CHK.q=null;CHK.kind='no';
 if(!CHK.best.entered)CHK.reason='The ball can\'t get into the box';
 else if(!CHK.best.near)CHK.reason=CHK._reach||'The excavator can\'t reach the gold';
 else CHK.reason='The prize hole is blocked';
 CHK.hits=chkPtsToItems(CHK.best.pts.slice(-12));
 if(CHK.best.near||CHK.reason.indexOf('hole')>=0)CHK.hole=1;
 chkPaint()}
function drawChk(g,t){if(state!=='edit')return;if(!(CHK.hits&&CHK.hits.length)&&!CHK.hole)return;
 var pul=.5+.5*Math.sin(t*5),i,it,P2,x,y,r;
 g.save();g.setTransform(DPR*S,0,0,DPR*S,DPR*OX,DPR*OY);
 if(CHK.hole&&CHK.kind==='no'){g.strokeStyle='rgba(220,30,40,'+(.55+.35*pul)+')';g.lineWidth=8;g.beginPath();g.moveTo(BX0-6,HOLE.y0);g.lineTo(BX0-6,HOLE.y1);g.stroke();
  g.fillStyle='rgba(220,30,40,'+(.12+.08*pul)+')';g.fillRect(BX0-70,HOLE.y0,80,HOLE.y1-HOLE.y0)}
 for(i=0;i<(CHK.hits||[]).length;i++){it=ED.items[CHK.hits[i]];if(!it)continue;P2=PT[it.t];x=it.x;y=it.y;r=Math.max(P2.w,P2.h)/2+16;
  g.strokeStyle='rgba(220,30,40,'+(.7+.3*pul)+')';g.lineWidth=5;g.setLineDash([10,7]);g.lineDashOffset=-t*40;g.beginPath();g.arc(x,y,r,0,2*PI);g.stroke();g.setLineDash([]);
  g.globalAlpha=.16+.1*pul;g.fillStyle='#e8342a';g.beginPath();g.arc(x,y,r,0,2*PI);g.fill();g.globalAlpha=1}
 g.restore()}
/* UI: flag in the top bar, Check level in the More menu, live updates as Alex edits */
(function(){var css=document.createElement('style');css.textContent=
 '#edFlag{pointer-events:auto;font-size:min(20px,1.95vw);padding:6px 12px;min-height:62px;min-width:0;max-width:38vw;border-radius:16px;border:3px solid #3a1d00;cursor:pointer;line-height:1.15;text-align:center;white-space:normal;box-sizing:border-box;font-family:inherit}'+
 '#edFlag small{display:block;font-size:.8em;font-weight:700;opacity:.95;margin-top:1px}'+
 '#edFlag.ok{background:#2f8a3a;color:#fff;box-shadow:0 4px 0 #1d5a25,0 6px 12px #0005}'+
 '#edFlag.no{background:#c4232a;color:#fff;box-shadow:0 4px 0 #7a1016,0 6px 12px #0005}'+
 '#edFlag.hard{background:#e8a020;color:#2a1808;box-shadow:0 4px 0 #8a5a10,0 6px 12px #0005}'+
 '#edFlag.run{background:#2b5a9e;color:#fff;box-shadow:0 4px 0 #163566,0 6px 12px #0005}'+
 '#edFlag.idle{background:#fff3c8;color:#3a1d00;box-shadow:0 4px 0 #b8860a,0 6px 12px #0005}';
 document.head.appendChild(css);
 function mount(){if(!edTop||$('edFlag'))return;var flag=document.createElement('button');flag.id='edFlag';flag.className='edFlag tag mk idle';flag.setAttribute('aria-label','Check level');flag.innerHTML='🔎 Check level';
  var grps=edTop.querySelectorAll('.grp');if(grps[1])edTop.insertBefore(flag,grps[1]);else edTop.appendChild(flag);
  flag.addEventListener('click',function(){try{SFX.click()}catch(e){}chkNow()});
  if(edMore&&!$('edChk')){var btn=document.createElement('button');btn.id='edChk';btn.className='tag cb mk wide';btn.textContent='🔎 Check level';
   var x=$('edMoreX');if(x)edMore.insertBefore(btn,x);else edMore.appendChild(btn);
   btn.addEventListener('click',function(){moreOn(false);try{SFX.click()}catch(e){}chkNow()})}}
 mount();chkPaint()})();
var _edBuild=edBuild;edBuild=function(){_edBuild();if(!CHK.busy)scheduleChk()};
var _drawEdit=drawEdit;drawEdit=function(g,t){_drawEdit(g,t);drawChk(g,t)};
var _setMode=setMode;setMode=function(id){var p=MODE;_setMode(id);if(state==='edit'&&MODE!==p)scheduleChk(true)};
var _closeEditor=closeEditor;closeEditor=function(){chkCancel();_closeEditor()};
var _showEd=showEd;showEd=function(on){_showEd(on);if(!on)chkCancel()};
if(window.EBED){window.EBED.check=function(o){o=o||{};if(state!=='edit')openEditor();chkCancel();CHK.tok++;chkStart();if(o.sync){var guard=0;while(CHK.q&&guard++<400)chkStep(true);if(CHK.kind==='run'){CHK.kind='hard';CHK.reason='Too tricky to check';CHK.q=null;chkPaint()}chkRestore()}return{kind:CHK.kind,reason:CHK.reason,hits:CHK.hits.slice(),hole:CHK.hole,n:CHK.n,mode:CHK.mode,best:CHK.best&&{minD:CHK.best.minD,entered:CHK.best.entered,near:CHK.best.near}};};
 window.EBED.chk=function(){return{kind:CHK.kind,reason:CHK.reason,hits:CHK.hits.slice(),hole:CHK.hole,n:CHK.n,mode:CHK.mode,q:CHK.q&&CHK.q.length};};
 window.EBED.load=function(lv){openEditor(lv);return true};}
