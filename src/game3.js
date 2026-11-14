/* ---------- physics ---------- */
var engine=Engine.create({enableSleeping:true,positionIterations:10,velocityIterations:8});engine.gravity.y=1.15;
var world=engine.world,FIXED=1000/120;
function stat(x,y,w,h,o){o=o||{};var b=Bodies.rectangle(x,y,w,h,{isStatic:true,friction:o.fr==null?.5:o.fr,restitution:o.re==null?.2:o.re,angle:o.a||0,label:o.label||'wall'});b.mat=o.mat||'wall';Composite.add(world,b);return b}
// box shell + table
stat(W/2,TABLE+30,W*4,60,{mat:'table',re:.3,fr:.6});
stat((FX0+BX1)/2,(FLOOR+TABLE)/2+2,BX1-FX0,TABLE-FLOOR+4,{mat:'card',re:.15,fr:.55});
stat((FX0+FX1)/2,(TOP-40+GAP0)/2,FX1-FX0,GAP0-TOP+40);
stat((FX0+FX1)/2,(GAP1+FLOOR)/2,FX1-FX0,FLOOR-GAP1);
[GAP0,GAP1].forEach(function(y){var c=Bodies.circle((FX0+FX1)/2,y,(FX1-FX0)/2,{isStatic:true,restitution:.2});c.mat='wall';Composite.add(world,c)});
var ceil=stat((FX0+BX1)/2,TOP-4,BX1-FX0+20,22,{mat:'wrap',re:.75,fr:.2});
var bwTop=stat((BX0+BX1)/2,0,BX1-BX0,700),bwBot=stat((BX0+BX1)/2,0,BX1-BX0,700);
stat(1504,780,16,240,{mat:'cup'});stat(W+300,500,40,2000);stat(-420,500,40,2000);
var HOLE={y0:780,y1:FLOOR,mv:null};
function setHole(y0,y1){HOLE.y0=y0;HOLE.y1=y1;Body.setPosition(bwTop,{x:(BX0+BX1)/2,y:y0-350},true);Body.setPosition(bwBot,{x:(BX0+BX1)/2,y:y1+350},true)}
/* ---------- level data ---------- */
var LEVELS=[
 {n:'Warm-Up Roll',hole:[772,FLOOR],pv:.85,shred:[[1000,1090,30]],gems:[[700,700],[900,640],[1160,700]],ring:[820,610],
  deb:[['plate',730,836,44],['cup',940,838,'r'],['scrap',1180,858,70,44]]},
 {n:'Cup Canyon',hole:[768,FLOOR],pv:.75,shred:[[610,690,26]],gems:[[760,640],[1040,600],[1250,690]],ring:[1100,620],
  deb:[['cup',740,838,'g'],['cup',880,838,'r'],['cup',1020,838,'b'],['cup',1170,838,'g'],['edge',800,700,0],['plate',950,760,40]]},
 {n:'Bubble Bounce',hole:[612,722],pv:.7,shred:[[560,640,24]],gems:[[880,560],[1060,520],[1240,600]],ring:[1150,560],
  st:[['wrapS',930,800,230,160],['ledge',1290,732,140,20]],deb:[['plate',900,676,40],['scrap',1000,690,60,30],['cup',1120,838,'r']]},
 {n:'Plate Pile',hole:[784,FLOOR],pv:.6,gems:[[760,600],[1000,560],[1180,650]],
  st:[['card',1030,830,32,100]],mov:[['pend',1180,TOP+10,410,44,2.7,.35]],
  deb:[['plate',700,836,44],['plate',790,836,44],['plate',745,752,42],['plate',890,836,40],['cup',960,838,'b'],['edge',650,700,0]],shred:[[1100,1180,24]]},
 {n:'Moving Hole',holeMv:[700,105,100,4.6],pv:.55,gems:[[820,560],[1000,620],[1220,520]],ring:[1000,700],
  st:[['ledge',1300,800,120,18]],deb:[['wrap',820,850,170,58],['cup',1010,838,'r'],['cup',1150,838,'g'],['plate',700,836,44],['scrap',920,780,60,40]]},
 {n:"Excavator's Mess",hole:[798,FLOOR],pv:.5,shred:[[600,700,26],[960,1040,24]],gems:[[700,600],[900,520],[1100,580],[1260,640]],ring:[860,640],
  st:[['ramp',780,860,180,18,-.12]],mov:[['slide',1185,730,28,150,90,2.6]],
  deb:[['plate',640,836,44],['plate',900,836,42],['cup',1000,838,'r'],['cup',1080,838,'b'],['scrap',700,780,70,44],['scrap',1250,858,60,40],['wrap',1120,700,120,40],['edge',820,700,0]]}
];
var LVP=[
 {n:'Mitten Mountain'},{n:'Motor City Maze'},{n:'Great Lakes Splash'},{n:'Mackinac Mix-Up'},{n:'Up North Junk Pile'},{n:'Petoskey Pebble Party'},{n:'Coney Island Chaos'},{n:'Super Blowout'}];
function genLevel(n){var r=rng(n*977+13),L={n:LVP[(n-LEVELS.length)%LVP.length].n+' '+(Math.floor((n-LEVELS.length)/LVP.length)+1>1?Math.floor((n-LEVELS.length)/LVP.length)+1:''),pv:.45,gems:[],deb:[],st:[],mov:[],shred:[]};
 var hs=clamp(96-(n-6)*2,82,96),raised=r()<.5;
 if(r()<.3)L.holeMv=[690,100,hs+4,4+r()*2];else if(raised){var y1=640+r()*120;L.hole=[y1-hs,y1];L.st.push(['ledge',1300,y1+10,120,18])}else L.hole=[FLOOR-hs,FLOOR];
 if(r()<.5)L.mov.push(['slide',1050+r()*150,720,28,140,80+r()*30,2.2+r()*1.2]);else if(r()<.6)L.mov.push(['pend',900+r()*250,TOP+10,405,42,2.4+r(),.35]);
 if(r()<.5)L.st.push(['wrapS',720+r()*140,840,140+r()*50,80]);
 var types=['plate','plate','cup','cup','scrap','edge','wrap'],cnt=7+Math.min(4,(n-6)>>1);
 for(var i=0;i<cnt;i++){var t=types[(r()*types.length)|0],x=600+r()*660;
  if(t==='plate')L.deb.push(['plate',x,740-r()*80,38+r()*8]);else if(t==='cup')L.deb.push(['cup',x,740,['r','g','b'][(r()*3)|0]]);else if(t==='scrap')L.deb.push(['scrap',x,740,50+r()*40,30+r()*20]);else if(t==='edge')L.deb.push(['edge',x,700,0]);else L.deb.push(['wrap',x,720,100+r()*60,40])}
 L.shred.push([560+r()*500|0,0,24]);L.shred[0][1]=L.shred[0][0]+80+r()*40;
 for(i=0;i<4;i++)L.gems.push([620+r()*680,500+r()*220]);if(r()<.7)L.ring=[700+r()*500,560+r()*120];return L}
function levelDef(n){if(CUS.on&&CUS.def)return CUS.def;return n<LEVELS.length?LEVELS[n]:genLevel(n)}
/* ---------- level objects ---------- */
var debris=[],statics=[],movers=[],gems=[],ring=null,shreds=[],gt=0,LV=null,lvN=0;
function mkDeb(d,spawnDy){var t=d[0],x=d[1],y=d[2]-(spawnDy||0),b;
 if(t==='plate'){b=Bodies.circle(x,y,d[3],{density:.0009,friction:.35,restitution:.35,frictionAir:.01});b.mat='plate';b.sk=sprPlate(d[3],(x*7+d[3])|0);b.sw=d[3]*2;b.sh=d[3]*2}
 else if(t==='edge'){b=Bodies.rectangle(x,y,110,14,{density:.0012,friction:.5,restitution:.3,chamfer:{radius:6},angle:d[3]||0});b.mat='plate';b.sk=sprEdge(110,14);b.sw=110;b.sh=14}
 else if(t==='cup'){var bt=Bodies.rectangle(x,y+38,46,8,{}),lw=Bodies.rectangle(x-27.5,y,7,86,{angle:-.107}),rw=Bodies.rectangle(x+27.5,y,7,86,{angle:.107});
  b=Body.create({parts:[bt,lw,rw],density:.0008,friction:.4,restitution:.25,frictionAir:.01});b.mat='cup';b.sk=sprCup(d[3]);b.sw=66;b.sh=86;b.ofs={x:x-b.position.x,y:y-b.position.y}}
 else if(t==='scrap'){b=Bodies.rectangle(x,y,d[3],d[4],{density:.0011,friction:.6,restitution:.2,frictionAir:.01,angle:d[5]||0});b.mat='card';b.sk=sprScrap(d[3]|0,d[4]|0,(x*3)|0);b.sw=d[3]|0;b.sh=d[4]|0}
 else if(t==='wrap'){b=Bodies.rectangle(x,y,d[3],d[4],{density:.0006,friction:.3,restitution:.8,frictionAir:.015});b.mat='wrap';b.ww=d[3];b.wh=d[4];b.pops=[]}
 else if(t==='chick'){b=Bodies.rectangle(x,y,124,36,{density:.00045,friction:.45,restitution:.75,frictionAir:.01,chamfer:{radius:17}});b.mat='card';b.toy=1;b.sw=156;b.sh=72;b.lastHit=-9;b.hitT=-9}
 b.kind=t;b.def=d;Composite.add(world,b);debris.push(b);return b}
function mkStatic(d){var t=d[0],b;
 if(t==='whoop'||t==='spray'||t==='tramp'||t==='banana'||t==='frog'||t==='horn'||t==='goat'||t==='fan')b=mkToy(t,d);
 else if(t==='wrapS'){b=d[6]==='pad'?stat(d[1],d[2],d[3],d[4],{mat:'pad',re:PAD.re,fr:.3}):stat(d[1],d[2],d[3],d[4],{mat:'wrap',re:1.05,fr:.2});b.ww=d[3];b.wh=d[4];b.pops=[];b.kind='wrap';if(d[6]==='pad'){b.kind='pad';b.toy=1;b.sw=164;b.sh=84;b.lastHit=-9;b.hitT=-9}}
 else{b=stat(d[1],d[2],d[3],d[4],{mat:'card',re:.15,fr:.6,a:d[5]||0});b.sk=sprScrap(d[3]|0,d[4]|0,(d[1]*5)|0);b.sw=d[3]|0;b.sh=d[4]|0;b.kind='card'}
 b.isLedge=t==='ledge';b.holeLedge=t==='ledge'&&d[6]==='hole';b.pop0=gt;statics.push(b);return b}
function mkMover(d){var b;if(d[0]==='pend'){b=Bodies.circle(d[1],d[2]+d[3],d[4],{isStatic:true,restitution:.4});b.mat='plate';b.sk=sprPlate(d[4],77);b.sw=d[4]*2;b.sh=d[4]*2;
  b.mf=function(t){var a=d[6]*Math.sin(t*2*PI/d[5]);return{x:d[1]+Math.sin(a)*d[3],y:d[2]+Math.cos(a)*d[3],a:a}};b.anchor={x:d[1],y:d[2]}}
 else{b=Bodies.rectangle(d[1],d[2],d[3],d[4],{isStatic:true,restitution:.3,chamfer:{radius:6}});b.mat='card';b.sk=sprScrap(d[3],d[4],91);b.sw=d[3];b.sh=d[4];b.mf=function(t){return{x:d[1],y:d[2]+d[5]*Math.sin(t*2*PI/d[6]),a:0}}}
 Composite.add(world,b);b.pop0=gt;movers.push(b);return b}
function clearLevel(keepDeb){statics.concat(movers).forEach(function(b){Composite.remove(world,b)});statics=[];movers=[];PORT=[];FANL=[];if(!keepDeb){debris.forEach(function(b){Composite.remove(world,b)});debris=[]}gems=[];ring=null;shreds=[]}
function setupLevel(n,instant){lvN=n;LV=levelDef(n);clearLevel(!instant);
 if(LV.holeMv){HOLE.mv=LV.holeMv;var m=LV.holeMv;setHole(m[0]-m[2]/2,m[0]+m[2]/2)}else{HOLE.mv=null;setHole(LV.hole[0],LV.hole[1])}
 (LV.st||[]).forEach(mkStatic);(LV.mov||[]).forEach(mkMover);PORT=LV.portals?LV.portals.map(function(p){return p?{x:p[0],y:p[1],a:p[2]||0,d:p[3]==null?null:p[3]}:null}):[];
 gems=(LV.gems||[]).map(function(p){return{x:p[0],y:p[1],got:false,ph:rnd()*6}});ring=LV.ring?{x:LV.ring[0],y:LV.ring[1],w:0}:null;
 shreds=(LV.shred||[]).map(function(s){return{x0:s[0],x1:s[1],h:s[2]+30,sk:sprShred(s[1]-s[0]+30,s[2]+30,s[0]|0)}});
 if(instant){(LV.deb||[]).forEach(function(d){mkDeb(d)})}}
function moveMovers(){for(var i=0;i<movers.length;i++){var b=movers[i],p=b.mf(gt);Body.setPosition(b,{x:p.x,y:p.y},true);Body.setAngle(b,p.a)}
 if(HOLE.mv){var m=HOLE.mv,c=m[0]+m[1]*Math.sin(gt*2*PI/m[3]);setHole(c-m[2]/2,c+m[2]/2)}}
