/* ===== v1.4: Alex's Level Builder + "Challenge Dad" share codes ===== */
var CUS={on:false,def:null,fromEd:false,challenge:false,th0:0,id:null},LVK='aeb_levels';
var ED={items:[],hole:{y1:FLOOR,sz:100,mv:false},sel:-1,drag:null,name:'',id:null,dirty:false,map:[],hint:1};
var PT={
 plate:{c:'p',n:'Plate',w:84,h:84},cup:{c:'c',n:'Cup',w:66,h:86},scrap:{c:'s',n:'Cardboard',w:70,h:44,rot:1},edge:{c:'e',n:'Side plate',w:110,h:14,rot:1},
 wrap:{c:'w',n:'Bubble wrap',w:140,h:50},pad:{c:'b',n:'Bouncy pad',w:160,h:80},shelf:{c:'l',n:'Ramp',w:140,h:20,rot:1},swing:{c:'q',n:'Swinger',w:84,h:84},
 slide:{c:'z',n:'Slider',w:28,h:140},gem:{c:'g',n:'Gem',w:40,h:40,max:8},ring:{c:'o',n:'Ring',w:84,h:84,max:1},shred:{c:'h',n:'Paper pile',w:120,h:56}};
var PORDER=['plate','cup','scrap','edge','wrap','pad','shelf','swing','slide','gem','ring','shred'],MAXIT=20;
var NAMES1=['Mega','Super','Crazy','Sneaky','Wobbly','Giant','Tiny','Turbo','Silly','Epic','Mitten','Motor City'],NAMES2=['Junk Pile','Cup Tower','Plate Party','Bubble Trouble','Dig Site','Blowout','Mess','Maze','Mountain','Madness','Canyon','Fortress'];
function rndName(){return NAMES1[(rnd()*NAMES1.length)|0]+' '+NAMES2[(rnd()*NAMES2.length)|0]}
function lvList(){try{var a=JSON.parse(localStorage.getItem(LVK)||'[]');return Array.isArray(a)?a:[]}catch(e){return[]}}
function lvStore(a){try{localStorage.setItem(LVK,JSON.stringify(a.slice(0,40)))}catch(e){}}
function cleanName(s){return String(s||'').replace(/[^A-Za-z0-9 !?'&.-]/g,'').replace(/\s+/g,' ').trim().slice(0,24)}
/* limits for each piece so it always stays inside the box */
function lim2(it){var p=PT[it.t],hw=p.w/2,hh=p.h/2;if(p.rot&&it.a){var a=Math.abs(it.a*PI/12);hw=Math.max(hw,(Math.abs(Math.cos(a))*p.w+Math.abs(Math.sin(a))*p.h)/2);hh=(Math.abs(Math.sin(a))*p.w+Math.abs(Math.cos(a))*p.h)/2}
 var x0=FX1+12+hw,x1=BX0-10-hw,y0=TOP+24+hh,y1=FLOOR-hh;
 if(it.t==='swing'){y0=TOP+130;y1=FLOOR-60}else if(it.t==='slide'){y0=TOP+170;y1=FLOOR-150}else if(it.t==='shred'){y0=y1=FLOOR-28}else if(it.t==='gem'||it.t==='ring'){y0=TOP+60;y1=FLOOR-40}
 return{x0:x0,x1:x1,y0:y0,y1:y1}}
function q5(v,lo,hi){v=Math.round(clamp(v,lo,hi)/5)*5;if(v<lo)v+=5;if(v>hi)v-=5;return v}
function fit(it){var L=lim2(it);it.x=q5(it.x,L.x0,L.x1);it.y=q5(it.y,L.y0,L.y1);return it}
function holeFit(h){h=h||ED.hole;h.sz=h.sz>=120?130:h.sz<=90?80:100;h.y1=q5(h.y1,TOP+80+h.sz,FLOOR)}
/* builder items -> game level definition (same format as the hand-built levels) */
function toDef(items,hole,name){var d={n:name||'My Level',pv:.6,deb:[],st:[],mov:[],gems:[],shred:[],custom:1},map=[];
 items.forEach(function(it){var a=(it.a||0)*PI/12;switch(it.t){
  case'plate':map.push(['deb',d.deb.length]);d.deb.push(['plate',it.x,it.y,42]);break;
  case'cup':map.push(['deb',d.deb.length]);d.deb.push(['cup',it.x,it.y,it.col||'r']);break;
  case'scrap':map.push(['deb',d.deb.length]);d.deb.push(['scrap',it.x,it.y,70,44,a]);break;
  case'edge':map.push(['deb',d.deb.length]);d.deb.push(['edge',it.x,it.y,a]);break;
  case'wrap':map.push(['deb',d.deb.length]);d.deb.push(['wrap',it.x,it.y,140,50]);break;
  case'pad':map.push(['st',d.st.length]);d.st.push(['wrapS',it.x,it.y,160,80]);break;
  case'shelf':map.push(['st',d.st.length]);d.st.push(['ledge',it.x,it.y,140,20,a]);break;
  case'swing':map.push(['mov',d.mov.length]);d.mov.push(['pend',it.x,TOP+10,it.y-(TOP+10),42,2.7,.35]);break;
  case'slide':map.push(['mov',d.mov.length]);d.mov.push(['slide',it.x,it.y,28,140,80,2.4]);break;
  case'gem':map.push(['gem',d.gems.length]);d.gems.push([it.x,it.y]);break;
  case'ring':map.push(['ring',0]);d.ring=[it.x,it.y];break;
  case'shred':map.push(['shred',d.shred.length]);d.shred.push([it.x-55,it.x+55,26]);break}});
 if(hole.mv)d.holeMv=[700,105,hole.sz,4.6];else{d.hole=[hole.y1-hole.sz,hole.y1];if(hole.y1<FLOOR-10)d.st.push(['ledge',1300,hole.y1+10,120,18])}
 d._map=map;return d}
/* ---------- share codes: "1" + hole + pieces, then "." + name ---------- */
var B36='0123456789abcdefghijklmnopqrstuvwxyz';
function n2(v){v=clamp(Math.round(v/5),0,1295);return B36.charAt((v/36)|0)+B36.charAt(v%36)}
function d2(s){var a=B36.indexOf(s.charAt(0)),b=B36.indexOf(s.charAt(1));if(a<0||b<0)throw 0;return(a*36+b)*5}
var CODEOF={},TOFC={};PORDER.forEach(function(k){CODEOF[k]=PT[k].c;TOFC[PT[k].c]=k});
function enc(items,hole,name){var s='1'+n2(hole.y1)+(hole.sz===80?'s':hole.sz===130?'l':'m')+(hole.mv?'1':'0');
 items.forEach(function(it){s+=CODEOF[it.t]+n2(it.x)+n2(it.y);if(it.t==='cup')s+=it.col||'r';else if(PT[it.t].rot)s+=B36.charAt(clamp((it.a||0)+6,0,12))});
 var nm=cleanName(name).replace(/ /g,'_');return s+(nm?'.'+encodeURIComponent(nm):'')}
function dec(code){code=String(code||'').trim();var m=/[#&?]L=([^&\s]+)/.exec(code);if(m)code=m[1];try{code=decodeURIComponent(code)}catch(e){}
 code=code.replace(/\s+/g,'');var dot=code.indexOf('.'),nm='';if(dot>=0){nm=code.slice(dot+1).replace(/_/g,' ');code=code.slice(0,dot)}
 if(code.charAt(0)!=='1'||code.length<5)return null;
 try{var hole={y1:d2(code.substr(1,2)),sz:{s:80,m:100,l:130}[code.charAt(3)]||100,mv:code.charAt(4)==='1'},items=[],i=5,cnt={};
  while(i<code.length&&items.length<MAXIT){var t=TOFC[code.charAt(i)];if(!t)return null;var it={t:t,x:d2(code.substr(i+1,2)),y:d2(code.substr(i+3,2))};i+=5;
   if(t==='cup'){var c=code.charAt(i);it.col='rgb'.indexOf(c)>=0?c:'r';i++}else if(PT[t].rot){it.a=clamp(B36.indexOf(code.charAt(i))-6,-6,6);i++}
   cnt[t]=(cnt[t]||0)+1;if(PT[t].max&&cnt[t]>PT[t].max)continue;items.push(fit(it))}
  holeFit(hole);return{items:items,hole:hole,name:cleanName(nm)||'Mystery Level'}}catch(e){return null}}
function shareURL(code){return location.origin+location.pathname.replace(/index\.html$/,'')+'#L='+code}
/* ---------- DOM ---------- */
var edCss=document.createElement('style');edCss.textContent=
 '#edTop{position:fixed;left:0;right:0;top:0;z-index:8;display:none;gap:8px;align-items:center;justify-content:center;flex-wrap:wrap;padding:calc(8px + env(safe-area-inset-top)) calc(10px + env(safe-area-inset-right)) 0 calc(56px + env(safe-area-inset-left))}'+
 '#edTop .tag,#edTools .tag{pointer-events:auto;font-size:min(18px,1.7vw);padding:8px 11px;cursor:pointer}#edTop .go{background:#2f8a3a;color:#fff;box-shadow:0 4px 0 #1d5a25,0 6px 12px #0006}#edName{max-width:24vw;overflow:hidden;text-overflow:ellipsis}'+
 '#edPal{position:fixed;left:0;right:0;bottom:0;z-index:8;display:none;gap:6px;justify-content:center;padding:0 calc(8px + env(safe-area-inset-right)) calc(8px + env(safe-area-inset-bottom)) calc(8px + env(safe-area-inset-left));touch-action:none}'+
 '#edPal .pc{width:min(84px,7.6vw);border-radius:12px;padding:4px 2px 3px;display:flex;flex-direction:column;align-items:center;gap:1px;font-size:min(13px,1.25vw);line-height:1.05;color:#3a2414;box-shadow:0 4px 0 #6b4520,0 6px 12px #0006;touch-action:none;cursor:grab}'+
 '#edPal .pc img{width:min(52px,4.6vw);height:min(52px,4.6vw);object-fit:contain;pointer-events:none}#edPal .pc.full{opacity:.4}'+
 '#edTools{position:fixed;z-index:9;display:none;gap:8px;transform:translate(-50%,-100%)}#edTools .tag{font-size:24px;padding:6px 12px}'+
 '#edHint{position:fixed;left:50%;transform:translateX(-50%);top:calc(64px + env(safe-area-inset-top));z-index:8;display:none;color:#fff;font-size:22px;text-shadow:0 2px 4px #000,0 0 10px #000;text-align:center;pointer-events:none;white-space:nowrap}'+
 '#edToast{position:fixed;left:50%;top:40%;transform:translate(-50%,-50%) scale(.6);z-index:40;opacity:0;pointer-events:none;font-size:38px;color:#ffde3b;-webkit-text-stroke:2px #3a1d00;text-shadow:0 4px 0 #3a1d00;transition:opacity .25s,transform .25s}#edToast.on{opacity:1;transform:translate(-50%,-50%) scale(1)}'+
 '#myLv .card,#dadc .card,#chal .card{min-width:min(92vw,640px)}#lvRows{display:flex;flex-direction:column;gap:8px;margin:8px 0;max-height:46vh;overflow:auto}'+
 '.lr{display:flex;align-items:center;gap:8px;background:#fff7e3;border-radius:12px;padding:6px 10px;text-align:left}.lr b{flex:1;font-size:22px;color:#1f3a6e;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.lr small{font-size:14px;color:#6b4520}'+
 '.lr .btn{font-size:18px;padding:8px 12px;margin:0}.btn.dad{background:#e8342a;box-shadow:0 5px 0 #8a1a12,0 8px 14px #0005}'+
 '#dadCode{font:700 20px/1.3 ui-monospace,Menlo,monospace;word-break:break-all;background:#fff;border:3px dashed #8a6a3a;border-radius:12px;padding:8px 12px;margin:8px 0;color:#1f3a6e;user-select:text;-webkit-user-select:text}'+
 '#codeIn{font:20px ui-monospace,Menlo,monospace;width:100%;padding:10px;border-radius:12px;border:3px solid #8a6a3a;margin:6px 0;user-select:text;-webkit-user-select:text}'+
 '#edbtn{font-size:20px}#myLv,#dadc,#chal{z-index:30}';
document.head.appendChild(edCss);
function mkEl(tag,id,cls,html,parent){var e=document.createElement(tag);if(id)e.id=id;if(cls)e.className=cls;if(html!=null)e.innerHTML=html;(parent||document.body).appendChild(e);return e}
var edTop=mkEl('div','edTop'),edPal=mkEl('div','edPal'),edTools=mkEl('div','edTools'),edHint=mkEl('div','edHint','mk'),edToast=mkEl('div','edToast','mk');
edTop.innerHTML='<button class="tag cb mk" id="edBack">◀ Back</button><button class="tag cb mk" id="edName">✏️ My Level</button><button class="tag cb mk" id="edDice" aria-label="Random name">🎲</button>'+
 '<button class="tag cb mk" id="edHole">🕳️ Hole: Medium</button><button class="tag cb mk" id="edMove">↕️ Moving: off</button><button class="tag cb mk" id="edClear">🧹 Clear</button>'+
 '<button class="tag cb mk" id="edSave">💾 Save</button><button class="tag cb mk" id="edDad">📣 Challenge Dad</button><button class="tag mk go" id="edTest">▶ Test it!</button>';
edTools.innerHTML='<button class="tag cb" id="edRot" aria-label="Turn">↻</button><button class="tag cb" id="edCol" aria-label="Color">🎨</button><button class="tag cb" id="edDel" aria-label="Throw away">🗑️</button>';
var hudEl=$('hud'),edB=mkEl('button','edbtn','tag cb mk','🛠️ Edit',hudEl);hudEl.insertBefore(edB,$('mute'));edB.style.display='none';
mkEl('div','myLv','ov','<div class="card cb"><h2 class="mk">🛠️ Alex\'s Levels</h2><div id="lvSub" style="font-size:18px;color:#4a2e10">Build your own junk pile, then challenge Dad!</div><div id="lvRows"></div>'+
 '<button class="btn" id="lvNew">➕ New level</button><button class="btn alt" id="lvCode">🔑 Enter a code</button><button class="btn alt" id="lvClose">Back</button>'+
 '<div id="codeBox" style="display:none"><input id="codeIn" placeholder="Paste a level code or link" autocomplete="off" autocapitalize="off" spellcheck="false"><button class="btn" id="codeGo">▶ Play it</button><div id="codeMsg" class="mk" style="color:#b3261e;font-size:20px"></div></div></div>');
mkEl('div','dadc','ov','<div class="card cb"><h2 class="mk">📣 Challenge Dad!</h2><div class="mk" style="font-size:24px;color:#1f3a6e" id="dadName"></div>'+
 '<div style="font-size:18px;margin-top:6px">Send Dad this link. It opens your level so he can try to beat it!</div><div id="dadCode"></div>'+
 '<button class="btn dad" id="dadShare">📤 Send to Dad</button><button class="btn alt" id="dadCopy">📋 Copy link</button><button class="btn alt" id="dadClose">Done</button><div id="dadMsg" class="mk" style="font-size:20px;color:#2f8a3a;min-height:26px"></div></div>');
mkEl('div','chal','ov','<div class="card cb"><h2 class="mk">🏆 Alex\'s Challenge!</h2><div class="mk" style="font-size:34px;color:#b3261e" id="chName"></div>'+
 '<div style="font-size:20px;margin:8px 0">Alex built this level in Excavator Blowout. Can you get the ball past the junk and into the prize hole?</div>'+
 '<div style="font-size:16px;color:#6b4520;margin-bottom:6px">3 throws a round. Take as many rounds as you need!</div><button class="btn" id="chGo">▶ I accept!</button><button class="btn alt" id="chNo">Not now</button></div>');
var wcard=$('next').parentNode,wEdit=mkEl('button','wedit','btn alt','🛠️ Back to builder',wcard);
var tb=mkEl('button','tbuild','btn mk','🛠️ Build a level',$('play').parentNode);tb.style.cssText='font-size:min(5vmin,36px);padding:1.2vmin 3.4vmin;background:#e8762a;box-shadow:0 5px 0 #9a4a12,0 8px 14px #0005';
function toast(t){edToast.textContent=t;edToast.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(function(){edToast.classList.remove('on')},1300)}
/* palette icons drawn from the real game sprites */
function icon(t){var c=mkc(104,104),g=c.getContext('2d'),s;g.translate(52,52);
 function put(key,w,h){var o=spr(key);if(!o)return;var k=Math.min(90/w,90/h,1.6);g.drawImage(o.c,-w*k/2,-h*k/2,w*k,h*k)}
 if(t==='plate')put(sprPlate(42,301),84,84);else if(t==='cup')put(sprCup('r'),66,86);else if(t==='scrap')put(sprScrap(70,44,77),70,44);else if(t==='edge'){g.rotate(-.5);put(sprEdge(110,14),110,14)}
 else if(t==='gem')put('gem',30,30);else if(t==='ring')put('ring',84,84);else if(t==='shred')put(sprShred(110,56,600),110,56);
 else if(t==='wrap'||t==='pad'){var w=t==='pad'?90:96,h=t==='pad'?54:36;g.fillStyle='rgba(215,236,255,.9)';g.strokeStyle='#fff';g.lineWidth=3;g.fillRect(-w/2,-h/2,w,h);g.strokeRect(-w/2,-h/2,w,h);g.fillStyle='rgba(255,255,255,.95)';for(var x=-w/2+10;x<w/2-4;x+=16)for(var y=-h/2+10;y<h/2-4;y+=16){g.beginPath();g.arc(x,y,6,0,2*PI);g.fill()}if(t==='pad'){g.font='28px '+MK;g.fillStyle='#e8342a';g.textAlign='center';g.fillText('BOING',0,10)}}
 else if(t==='shelf'){g.rotate(-.35);put(sprScrap(140,20,15),140,20)}
 else if(t==='swing'){g.strokeStyle='#5fd13a';g.lineWidth=6;g.beginPath();g.moveTo(-30,-50);g.lineTo(6,14);g.stroke();g.save();g.translate(10,22);put(sprPlate(42,77),60,60);g.restore()}
 else if(t==='slide'){put(sprScrap(28,140,91),40,90);g.fillStyle='#ffde3b';g.font='30px sans-serif';g.textAlign='center';g.fillText('↕',30,10)}
 return c.toDataURL()}
var PALB={};function buildPal(){edPal.innerHTML='';PORDER.forEach(function(t){var b=mkEl('div',null,'pc cb mk','<img alt=""><span>'+PT[t].n+'</span>',edPal);b.setAttribute('role','button');b.setAttribute('aria-label','Add '+PT[t].n);
 try{b.firstChild.src=icon(t)}catch(e){}PALB[t]=b;b.addEventListener('pointerdown',function(e){e.preventDefault();palDown(t,e)})})}
/* ---------- editor scene ---------- */
function edBuild(){var d=toDef(ED.items,ED.hole,ED.name);CUS.def=d;CUS.on=true;gt=Math.max(gt,1);clearLevel(false);setupLevel(0,true);ED.map=d._map;
 debris.forEach(function(b){Sleeping.set(b,true)});statics.concat(movers).forEach(function(b){b.pop0=gt-1});updPal()}
function bodyOf(i){var m=ED.map[i];if(!m)return null;return m[0]==='deb'?debris[m[1]]:m[0]==='st'?statics[m[1]]:m[0]==='mov'?movers[m[1]]:null}
function count(t){return ED.items.filter(function(it){return it.t===t}).length}
function canAdd(t){return ED.items.length<MAXIT&&!(PT[t].max&&count(t)>=PT[t].max)}
function updPal(){PORDER.forEach(function(t){if(PALB[t])PALB[t].classList.toggle('full',!canAdd(t))});
 $('edHole').textContent='🕳️ Hole: '+(ED.hole.sz===80?'Small':ED.hole.sz===130?'Big':'Medium');$('edMove').textContent='↕️ Moving: '+(ED.hole.mv?'ON':'off');$('edName').textContent='✏️ '+(ED.name||'My Level')}
function resetPlay(){TM.length=0;Q.length=0;cq=null;if(EX.carry){EX.carry=null}EX.on=false;EX.speed=1;EX.x=EXPARK;EX.tx=EXPARK-400;EX.ty=TOP-30;EX.ba=1.5;EX.load=null;try{engSnd(false)}catch(e){}
 flying.forEach(function(f){Composite.remove(world,f)});flying=[];if(ball){Composite.remove(world,ball);ball=null}clearXB();trail=[];drag=null;AS.on=false;AS.shot=null;AS.q=null;AS.path=null;MS.on=false;
 ['win','shelf','modes','myLv','dadc','chal'].forEach(function(id){$(id).classList.remove('on')});$('skip').style.display='none';$('help').style.display='none'}
function showEd(on){edTop.style.display=on?'flex':'none';edPal.style.display=on?'flex':'none';edHint.style.display=on&&ED.hint?'block':'none';hudEl.style.display=on?'none':'';if(!on)edTools.style.display='none'}
function openEditor(lv){aInit();resetPlay();titleOn=false;$('title').classList.add('off');if(!edPal.children.length)buildPal();
 if(lv){ED.items=lv.items.map(function(it){return fit({t:it.t,x:it.x,y:it.y,a:it.a||0,col:it.col})});ED.hole={y1:lv.hole.y1,sz:lv.hole.sz,mv:!!lv.hole.mv};ED.name=lv.name;ED.id=lv.id||null}
 else if(!ED.items.length&&!ED.id){ED.items=[{t:'plate',x:760,y:836},{t:'cup',x:980,y:838,col:'g'},{t:'gem',x:900,y:620}];ED.hole={y1:FLOOR,sz:100,mv:false};ED.name=rndName();ED.id=null}
 holeFit();ED.sel=-1;state='edit';CUS.fromEd=true;CUS.challenge=false;edBuild();showEd(true);edHint.textContent='👇 Drag junk into the box!  Drag the ⭐ hole up or down.';resize();MUS.on=true}
function closeEditor(){showEd(false);state='title';CUS.on=false;titleOn=true;$('title').classList.remove('off');gt=0;clearLevel(false);setupLevel(save.lv||0,true);refreshTitle()}
function refreshTitle(){$('play').textContent=save.lv>0?'▶ Keep playing (Level '+(save.lv+1)+')':'▶ Play!';$('lv1').style.display=save.lv>0?'':'none'}
function edSnapshot(){return{items:ED.items.map(function(it){var o={t:it.t,x:it.x,y:it.y};if(it.a)o.a=it.a;if(it.t==='cup')o.col=it.col||'r';return o}),hole:{y1:ED.hole.y1,sz:ED.hole.sz,mv:ED.hole.mv},name:ED.name||'My Level'}}
function edSave(quiet){var a=lvList(),s=edSnapshot(),now=Date.now();if(!ED.id)ED.id='L'+now.toString(36);s.id=ED.id;s.at=now;var i=-1;a.forEach(function(x,j){if(x.id===ED.id)i=j});
 if(i>=0){s.wins=a[i].wins||0;s.plays=a[i].plays||0;a.splice(i,1)}a.unshift(s);lvStore(a);ED.dirty=false;if(!quiet){SFX.ok();toast('Saved! 💾');confetti(W/2,TOP+100,30)}return s}
/* ---------- editor input (touch first) ---------- */
function inBox(p){return p.x>FX0-30&&p.x<BX1+50&&p.y>TOP-70&&p.y<TABLE+30}
function hitHole(p){var h=ED.hole;if(h.mv)return false;return p.x>BX0-90&&p.x<BX1+70&&p.y>h.y1-h.sz-40&&p.y<h.y1+30}
function hitItem(p){for(var i=ED.items.length-1;i>=0;i--){var it=ED.items[i],P2=PT[it.t],r=Math.max(P2.w,P2.h)/2,hw=P2.rot?r:P2.w/2,hh=P2.rot?Math.max(P2.h/2,Math.min(r,40)):P2.h/2;
  hw=Math.max(hw,34);hh=Math.max(hh,34);if(Math.abs(p.x-it.x)<hw&&Math.abs(p.y-it.y)<hh)return i}return -1}
function moveVis(i,dx,dy){var it=ED.items[i],m=ED.map[i];if(!m||(!dx&&!dy))return;var b=bodyOf(i);if(b){Body.translate(b,{x:dx,y:dy});if(b.anchor)b.anchor={x:b.anchor.x+dx,y:b.anchor.y}}
 else if(m[0]==='gem'&&gems[m[1]]){gems[m[1]].x+=dx;gems[m[1]].y+=dy}else if(m[0]==='ring'&&ring){ring.x+=dx;ring.y+=dy}else if(m[0]==='shred'&&shreds[m[1]]){shreds[m[1]].x0+=dx;shreds[m[1]].x1+=dx}}
function edDown(e){if(state!=='edit')return;aInit();var p=toW(e);e.preventDefault();ED.hint=0;edHint.style.display='none';
 if(hitHole(p)){ED.drag={id:e.pointerId,hole:1,oy:p.y-ED.hole.y1};SFX.click();return}
 var i=hitItem(p);if(i>=0){var it=ED.items[i];ED.sel=i;ED.drag={id:e.pointerId,i:i,ox:p.x-it.x,oy:p.y-it.y,vx:it.x,vy:it.y,moved:0};SFX.thunk();placeTools();return}
 ED.sel=-1;placeTools()}
function edMove(e){var d=ED.drag;if(!d||e.pointerId!==d.id)return;var p=toW(e);e.preventDefault();
 if(d.hole){ED.hole.y1=p.y-d.oy;holeFit();setHole(ED.hole.y1-ED.hole.sz,ED.hole.y1);return}
 var it=ED.items[d.i];if(!it)return;var nx=p.x-d.ox,ny=p.y-d.oy,tmp={t:it.t,x:nx,y:ny,a:it.a};fit(tmp);d.trash=!d.isNew&&(p.x<FX0-40||p.y>TABLE+40||p.y<TOP-90);d.away=d.isNew&&!inBox(p);
 moveVis(d.i,tmp.x-d.vx,tmp.y-d.vy);d.vx=tmp.x;d.vy=tmp.y;if(Math.hypot(nx-it.x,ny-it.y)>6)d.moved=1;placeTools()}
function edUp(e){var d=ED.drag;if(!d||e.pointerId!==d.id)return;ED.drag=null;
 if(d.hole){SFX.click();ED.dirty=true;edBuild();return}
 var it=ED.items[d.i];if(!it)return;
 if(d.trash){delItem(d.i);return}
 if(d.isNew&&d.away){it.x=700+rnd()*480;it.y=it.t==='gem'||it.t==='ring'?560+rnd()*120:it.t==='swing'?620:it.t==='slide'?680:it.t==='shelf'||it.t==='pad'?760:FLOOR-PT[it.t].h/2;fit(it);d.vx=it.x;d.vy=it.y}
 it.x=d.vx;it.y=d.vy;fit(it);if(d.moved||d.isNew){ED.dirty=true;SFX.dump();dust(it.x,Math.min(FLOOR,it.y+PT[it.t].h/2),4)}edBuild();ED.sel=d.i;placeTools()}
function delItem(i){var it=ED.items[i];if(!it)return;dust(it.x,it.y,8);sparks(it.x,it.y,8,'#ffe27a');SFX.pop();ED.items.splice(i,1);ED.sel=-1;ED.dirty=true;edBuild();placeTools()}
function palDown(t,e){if(state!=='edit')return;aInit();ED.hint=0;edHint.style.display='none';if(!canAdd(t)){SFX.no();toast(ED.items.length>=MAXIT?'Box is full!':'That\'s the most '+PT[t].n.toLowerCase()+'s!');return}
 var p=toW(e),it={t:t,x:p.x,y:p.y-60};if(PT[t].rot)it.a=t==='shelf'?-2:0;if(t==='cup')it.col='rgb'.charAt(count('cup')%3);fit(it);ED.items.push(it);edBuild();var i=ED.items.length-1;
 ED.sel=i;ED.drag={id:e.pointerId,i:i,ox:0,oy:60,vx:it.x,vy:it.y,moved:1,isNew:1,away:!inBox(p)};SFX.click();placeTools()}
function placeTools(){var i=ED.sel,it=ED.items[i];if(state!=='edit'||!it||ED.drag&&ED.drag.isNew){edTools.style.display='none';return}
 $('edRot').style.display=PT[it.t].rot?'':'none';$('edCol').style.display=it.t==='cup'?'':'none';
 var top=it.y-Math.max(PT[it.t].h/2,30)-14;edTools.style.left=(OX+it.x*S)+'px';edTools.style.top=Math.max(60,OY+top*S)+'px';edTools.style.display='flex'}
cv.addEventListener('pointerdown',edDown);addEventListener('pointermove',edMove,{passive:false});addEventListener('pointerup',edUp);addEventListener('pointercancel',function(e){if(ED.drag&&ED.drag.id===e.pointerId){ED.drag.trash=false;ED.drag.away=!!ED.drag.isNew;edUp(e)}});
$('edRot').addEventListener('click',function(){var it=ED.items[ED.sel];if(!it)return;it.a=((it.a||0)+2+6)%13-6;if(it.a>6)it.a=-6;fit(it);SFX.click();ED.dirty=true;edBuild();placeTools()});
$('edCol').addEventListener('click',function(){var it=ED.items[ED.sel];if(!it)return;it.col='rgb'.charAt(('rgb'.indexOf(it.col||'r')+1)%3);SFX.click();ED.dirty=true;edBuild()});
$('edDel').addEventListener('click',function(){delItem(ED.sel)});
$('edHole').addEventListener('click',function(){var h=ED.hole;h.sz=h.sz===100?130:h.sz===130?80:100;holeFit();SFX.click();ED.dirty=true;edBuild()});
$('edMove').addEventListener('click',function(){ED.hole.mv=!ED.hole.mv;SFX.click();ED.dirty=true;edBuild();toast(ED.hole.mv?'Moving hole! ↕️':'Hole stays put')});
$('edClear').addEventListener('click',function(){if(!ED.items.length)return;ED.items=[];ED.sel=-1;ED.dirty=true;SFX.boom();shake(14);dust(900,FLOOR,14);edBuild();placeTools();toast('All clear! 🧹')});
$('edName').addEventListener('click',function(){var n=null;try{n=prompt('Name your level:',ED.name||'')}catch(e){}if(n!=null){n=cleanName(n);if(n){ED.name=n;ED.dirty=true;updPal()}}});
$('edDice').addEventListener('click',function(){ED.name=rndName();ED.dirty=true;SFX.click();updPal()});
$('edSave').addEventListener('click',function(){edSave()});
$('edBack').addEventListener('click',function(){SFX.click();if(ED.dirty&&ED.items.length)edSave(true);showEd(false);closeEditor();openLevels()});
$('edTest').addEventListener('click',function(){if(ED.dirty||!ED.id)edSave(true);playCustom(edSnapshot(),{fromEd:true,id:ED.id})});
$('edDad').addEventListener('click',function(){var s=ED.dirty||!ED.id?edSave(true):edSnapshot();openDad(s)});
/* ---------- play a custom level ---------- */
function playCustom(lv,o){o=o||{};aInit();resetPlay();showEd(false);var d=toDef(lv.items,lv.hole,lv.name);CUS.def=d;CUS.on=true;CUS.fromEd=!!o.fromEd;CUS.challenge=!!o.challenge;CUS.id=o.id||null;CUS.lv=lv;CUS.th0=stats.throws;
 if(o.id){var a=lvList();a.forEach(function(x){if(x.id===o.id)x.plays=(x.plays||0)+1});lvStore(a)}
 edB.style.display='';edB.textContent=CUS.fromEd?'🛠️ Edit':'🏠 Menu';CSND.start();loadFarts();titleOn=false;$('title').classList.add('off');MUS.on=!!AC;resize();state='title';goLevel(0,true);hud();
 banner(CUS.challenge?'Alex\'s Challenge!':'Test time! 🛠️',1)}
function customWon(){if(!CUS.on)return;var n=stats.throws-CUS.th0;if(CUS.id){var a=lvList();a.forEach(function(x){if(x.id===CUS.id)x.wins=(x.wins||0)+1});lvStore(a)}
 $('next').textContent='🔁 Play again';wEdit.style.display='';wEdit.textContent=CUS.fromEd?'🛠️ Back to builder':'🏠 Menu';
 $('grandMsg').textContent=(CUS.challenge?'You beat Alex\'s level in '+n+' throw'+(n===1?'':'s')+'! 🙌':'Your level works! Beat it in '+n+' throw'+(n===1?'':'s')+'.')+($('grandMsg').textContent?' '+$('grandMsg').textContent:'')}
function toMenu(){resetPlay();closeEditor()}
edB.addEventListener('click',function(){SFX.click();if(CUS.fromEd)openEditor();else toMenu()});
wEdit.addEventListener('click',function(){SFX.click();$('win').classList.remove('on');if(CUS.fromEd)openEditor();else toMenu()});
wEdit.style.display='none';
/* ---------- my levels / codes / challenge ---------- */
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function openLevels(){aInit();var a=lvList(),h='';
 if(!a.length)h='<div class="mk" style="font-size:22px;color:#6b4520;padding:10px">No levels yet. Tap ➕ to build your first one!</div>';
 a.forEach(function(x,i){h+='<div class="lr"><b class="mk">'+esc(x.name||'My Level')+'</b><small>'+x.items.length+' pieces'+(x.wins?' · beaten '+x.wins+'×':'')+'</small>'+
  '<button class="btn" data-a="play" data-i="'+i+'">▶</button><button class="btn alt" data-a="edit" data-i="'+i+'">✏️</button><button class="btn dad" data-a="dad" data-i="'+i+'">📣</button><button class="btn alt" data-a="del" data-i="'+i+'">🗑️</button></div>'});
 $('lvRows').innerHTML=h;$('codeBox').style.display='none';$('codeMsg').textContent='';$('myLv').classList.add('on')}
$('lvRows').addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;var a=lvList(),x=a[+b.dataset.i];if(!x)return;SFX.click();
 if(b.dataset.a==='play'){$('myLv').classList.remove('on');playCustom(x,{id:x.id})}
 else if(b.dataset.a==='edit'){$('myLv').classList.remove('on');openEditor(x)}
 else if(b.dataset.a==='dad')openDad(x);
 else if(b.dataset.a==='del'){if(b.dataset.sure){a.splice(+b.dataset.i,1);lvStore(a);if(ED.id===x.id){ED.id=null;ED.items=[]}SFX.pop();openLevels()}else{b.dataset.sure=1;b.textContent='Sure?';b.style.background='#e8342a';b.style.color='#fff'}}});
$('lvNew').addEventListener('click',function(){SFX.click();$('myLv').classList.remove('on');ED.items=[];ED.id=null;ED.name='';openEditor()});
$('lvClose').addEventListener('click',function(){SFX.click();$('myLv').classList.remove('on')});
$('lvCode').addEventListener('click',function(){SFX.click();$('codeBox').style.display='block';try{$('codeIn').focus()}catch(e){}});
$('codeGo').addEventListener('click',function(){var lv=dec($('codeIn').value);if(!lv){SFX.no();$('codeMsg').textContent='Hmm, that code didn\'t work. Check it and try again!';return}$('myLv').classList.remove('on');playCustom(lv,{challenge:true})});
function openDad(lv){var code=enc(lv.items,lv.hole,lv.name),url=shareURL(code);$('dadName').textContent='"'+(lv.name||'My Level')+'"';$('dadCode').textContent=url;$('dadMsg').textContent='';$('dadc').dataset.url=url;$('dadc').dataset.name=lv.name||'My Level';
 $('dadShare').style.display=navigator.share?'':'none';SFX.click();$('dadc').classList.add('on')}
$('dadShare').addEventListener('click',function(){var u=$('dadc').dataset.url;try{navigator.share({title:'Excavator Blowout challenge',text:'Dad, can you beat my Excavator Blowout level "'+$('dadc').dataset.name+'"? 🚜',url:u}).then(function(){$('dadMsg').textContent='Sent! 🚀'}).catch(function(){})}catch(e){}});
$('dadCopy').addEventListener('click',function(){var u=$('dadc').dataset.url,ok=function(){$('dadMsg').textContent='Copied! Paste it in a message to Dad. 📋';SFX.ok()};
 try{navigator.clipboard.writeText(u).then(ok,function(){selCode()})}catch(e){selCode()}});
function selCode(){try{var r=document.createRange();r.selectNodeContents($('dadCode'));var s=getSelection();s.removeAllRanges();s.addRange(r);document.execCommand('copy');$('dadMsg').textContent='Copied! 📋'}catch(e){$('dadMsg').textContent='Press and hold the link to copy it.'}}
$('dadClose').addEventListener('click',function(){SFX.click();$('dadc').classList.remove('on')});
tb.addEventListener('click',function(){aInit();SFX.click();if(lvList().length)openLevels();else{ED.items=[];ED.id=null;ED.name='';openEditor()}});
var CHL=null;function checkHash(){var h=location.hash||'';if(!/L=/.test(h))return;var lv=dec(h);if(!lv)return;CHL=lv;$('chName').textContent='"'+lv.name+'"';$('chal').classList.add('on');
 try{history.replaceState(null,'',location.pathname+location.search)}catch(e){}}
$('chGo').addEventListener('click',function(){$('chal').classList.remove('on');if(CHL)playCustom(CHL,{challenge:true})});
$('chNo').addEventListener('click',function(){SFX.click();$('chal').classList.remove('on')});
addEventListener('hashchange',checkHash);
/* drawn on top of the scene while editing */
function drawEdit(g,t){g.setTransform(DPR*S,0,0,DPR*S,DPR*OX,DPR*OY);var h=ED.hole,y0=HOLE.y0,y1=HOLE.y1,pul=.5+.5*Math.sin(t*4);
 if(!h.mv){g.fillStyle='rgba(255,222,59,'+(.75+.25*pul)+')';g.strokeStyle='#3a1d00';g.lineWidth=4;var cx=BX1+34,cy=(y0+y1)/2;g.beginPath();g.arc(cx,cy,28,0,2*PI);g.fill();g.stroke();
  g.fillStyle='#3a1d00';g.beginPath();g.moveTo(cx,cy-21);g.lineTo(cx-10,cy-7);g.lineTo(cx+10,cy-7);g.fill();g.beginPath();g.moveTo(cx,cy+21);g.lineTo(cx-10,cy+7);g.lineTo(cx+10,cy+7);g.fill()}
 else{g.font='26px '+MK;g.fillStyle='#ffde3b';g.textAlign='center';g.fillText('↕ moves!',BX1+40,y0-40);g.textAlign='left'}
 g.setLineDash([10,8]);g.strokeStyle='rgba(255,255,255,.35)';g.lineWidth=3;g.strokeRect(FX1+8,TOP+18,BX0-FX1-16,FLOOR-TOP-18);g.setLineDash([]);
 var d=ED.drag;for(var i=0;i<ED.items.length;i++){var it=ED.items[i],P2=PT[it.t],sel=i===ED.sel;if(!sel&&!(d&&d.i===i))continue;var x=d&&d.i===i?d.vx:it.x,y=d&&d.i===i?d.vy:it.y,r=Math.max(P2.w,P2.h)/2+12;
  g.strokeStyle=d&&d.i===i&&d.trash?'#ff4a4a':'#ffde3b';g.lineWidth=4;g.setLineDash([12,8]);g.lineDashOffset=-t*30;g.beginPath();g.arc(x,y,r,0,2*PI);g.stroke();g.setLineDash([]);
  if(d&&d.i===i&&d.trash){g.font='48px sans-serif';g.textAlign='center';g.fillText('🗑️',x,y-r-8);g.textAlign='left'}}
 g.font='22px '+MK;g.fillStyle='rgba(255,255,255,.8)';g.fillText(ED.items.length+' / '+MAXIT+' pieces',FX1+20,TOP+48)}
checkHash();
window.EBED={open:function(){openEditor()},st:function(){return{state:state,items:ED.items.length,sel:ED.sel,hole:ED.hole,name:ED.name,id:ED.id,cus:CUS.on,ch:CUS.challenge,levels:lvList().length}},
 items:function(){return JSON.parse(JSON.stringify(ED.items))},enc:function(){return enc(ED.items,ED.hole,ED.name)},dec:dec,url:function(){return shareURL(enc(ED.items,ED.hole,ED.name))},
 w2s:function(x,y){return{x:OX+x*S,y:OY+y*S}},save:function(){return edSave(true)}};
