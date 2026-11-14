/* ===== v1.4: Alex's Level Builder + "Challenge Dad" share codes ===== */
var CUS={on:false,def:null,fromEd:false,challenge:false,th0:0,id:null},LVK='aeb_levels';
var ED={items:[],hole:{y1:FLOOR,sz:100,mv:false},sel:-1,drag:null,name:'',id:null,dirty:false,map:[],hint:1};
var PT={
 plate:{c:'p',n:'Plate',w:84,h:84},cup:{c:'c',n:'Cup',w:66,h:86},scrap:{c:'s',n:'Cardboard',w:70,h:44,rot:1},edge:{c:'e',n:'Side plate',w:110,h:14,rot:1},
 wrap:{c:'w',n:'Bubble wrap',w:140,h:50},pad:{c:'b',n:'Bouncy pad',w:160,h:80},shelf:{c:'l',n:'Ramp',w:140,h:20,rot:1},swing:{c:'q',n:'Swinger',w:84,h:84},
 slide:{c:'z',n:'Slider',w:28,h:140},gem:{c:'g',n:'Gem',w:40,h:40,max:8},ring:{c:'o',n:'Ring',w:84,h:84,max:1},shred:{c:'h',n:'Paper pile',w:120,h:56},
 whoop:{c:'u',n:'Whoopie',w:92,h:36,max:10},spray:{c:'k',n:'Silly string',w:36,h:78,max:10},portal:{c:'t',n:'Portals',w:60,h:104,rot:1,max:8},
 tramp:{c:'j',n:'Trampoline',w:150,h:46,max:10},chick:{c:'r',n:'Rubber chicken',w:136,h:56,max:10},banana:{c:'n',n:'Banana peel',w:84,h:24,max:10},frog:{c:'f',n:'Burp frog',w:76,h:60,max:10},horn:{c:'x',n:'Clown horn',w:90,h:54,max:10},goat:{c:'y',n:'Screaming goat',w:84,h:96,max:10},fan:{c:'v',n:'Leaf blower',w:72,h:60,rot:1,max:10},
 spin:{c:'i',n:'Spinner',w:96,h:96,flip:1,max:10},pin:{c:'m',n:'Pinwheel',w:70,h:120,max:10},jello:{c:'d',n:'Jello',w:112,h:80,max:10},
 glove:{c:'a',n:'Glove',w:110,h:70,flip:1,max:10},balloon:{c:'2',n:'Balloon',w:58,h:96,max:10},duck:{c:'3',n:'Duck',w:84,h:72,max:10},paste:{c:'4',n:'Toothpaste',w:56,h:108,max:10}};
var PORDER=['plate','cup','scrap','edge','wrap','pad','shelf','swing','slide','gem','ring','shred','whoop','spray','portal','tramp','chick','banana','frog','horn','goat','fan','spin','pin','jello','glove','balloon','duck','paste'],MAXIT=30;
var PTABS=[{id:'basics',n:'Basics',e:'🧱',ts:['plate','cup','scrap','edge','shelf','swing','slide','shred','gem','ring']},
 {id:'bouncy',n:'Bouncy',e:'🌀',ts:['pad','tramp','wrap','jello']},
 {id:'movers',n:'Movers',e:'💨',ts:['fan','pin','spin','glove','portal']},
 {id:'silly',n:'Silly',e:'🤪',ts:['goat','chick','whoop','horn','frog','duck','banana','spray']},
 {id:'boom',n:'Boom',e:'💥',ts:['balloon','paste']}];
var palTab=0;try{palTab=Math.max(0,Math.min(PTABS.length-1,+(localStorage.getItem('aeb_palTab')||0)))}catch(e){}
var NAMES1=['Mega','Super','Crazy','Sneaky','Wobbly','Giant','Tiny','Turbo','Silly','Epic','Mitten','Motor City'],NAMES2=['Junk Pile','Cup Tower','Plate Party','Bubble Trouble','Dig Site','Blowout','Mess','Maze','Mountain','Madness','Canyon','Fortress'];
function rndName(){return NAMES1[(rnd()*NAMES1.length)|0]+' '+NAMES2[(rnd()*NAMES2.length)|0]}
function lvList(){try{var a=JSON.parse(localStorage.getItem(LVK)||'[]');return Array.isArray(a)?a:[]}catch(e){return[]}}
function lvStore(a){try{localStorage.setItem(LVK,JSON.stringify(a.slice(0,40)))}catch(e){}}
function cleanName(s){return String(s||'').replace(/[^A-Za-z0-9 !?'&.-]/g,'').replace(/\s+/g,' ').trim().slice(0,24)}
/* limits for each piece so it always stays inside the box */
function lim2(it){var p=PT[it.t],hw=p.w/2,hh=p.h/2;if(p.rot&&it.a){var a=Math.abs(it.a*PI/12);hw=Math.max(hw,(Math.abs(Math.cos(a))*p.w+Math.abs(Math.sin(a))*p.h)/2);hh=(Math.abs(Math.sin(a))*p.w+Math.abs(Math.cos(a))*p.h)/2}
 var x0=FX1+12+hw,x1=BX0-10-hw,y0=TOP+24+hh,y1=FLOOR-hh;
 if(it.t==='swing'){y0=TOP+130;y1=FLOOR-60}else if(it.t==='slide'){y0=TOP+170;y1=FLOOR-150}else if(it.t==='shred'||it.t==='paste'||it.t==='pin'){y0=y1=FLOOR-(it.t==='pin'?60:PT[it.t].h/2)}
 else if(it.t==='gem'||it.t==='ring'){y0=TOP+60;y1=FLOOR-40}else if(it.t==='balloon'){y0=TOP+70;y1=FLOOR-90}else if(it.t==='jello'||it.t==='duck'||it.t==='whoop'||it.t==='banana'){y1=FLOOR-PT[it.t].h/2}
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
  case'pad':map.push(['st',d.st.length]);d.st.push(['wrapS',it.x,it.y,160,80,0,'pad']);break;
  case'shelf':map.push(['st',d.st.length]);d.st.push(['ledge',it.x,it.y,140,20,a]);break;
  case'swing':map.push(['mov',d.mov.length]);d.mov.push(['pend',it.x,TOP+10,it.y-(TOP+10),42,2.7,.35]);break;
  case'slide':map.push(['mov',d.mov.length]);d.mov.push(['slide',it.x,it.y,28,140,80,2.4]);break;
  case'gem':map.push(['gem',d.gems.length]);d.gems.push([it.x,it.y]);break;
  case'ring':map.push(['ring',0]);d.ring=[it.x,it.y];break;
  case'shred':map.push(['shred',d.shred.length]);d.shred.push([it.x-55,it.x+55,26]);break;
  case'whoop':map.push(['st',d.st.length]);d.st.push(['whoop',it.x,it.y,92,36]);break;
  case'spray':map.push(['st',d.st.length]);d.st.push(['spray',it.x,it.y,36,78]);break;
  case'tramp':case'banana':case'frog':case'horn':case'goat':map.push(['st',d.st.length]);d.st.push([it.t,it.x,it.y,PT[it.t].w,PT[it.t].h]);break;
  case'fan':map.push(['st',d.st.length]);d.st.push(['fan',it.x,it.y,56,46,a]);break;
  case'spin':case'pin':case'jello':case'glove':case'balloon':case'paste':map.push(['st',d.st.length]);d.st.push([it.t,it.x,it.y,PT[it.t].w,PT[it.t].h,it.a||0]);break;
  case'chick':map.push(['deb',d.deb.length]);d.deb.push(['chick',it.x,it.y]);break;
  case'duck':map.push(['deb',d.deb.length]);d.deb.push(['duck',it.x,it.y]);break;
  case'portal':var pq=clamp(it.pr|0,0,7);map.push(['portal',pq]);(d.portals=d.portals||[null,null,null,null,null,null,null,null])[pq]=[it.x,it.y,a,it.d==null?null:it.d];break}});
 if(d.portals){var anyP=0;for(var pk=0;pk<8;pk+=2){if(!(d.portals[pk]&&d.portals[pk+1]))d.portals[pk]=d.portals[pk+1]=null;else anyP=1}if(!anyP)delete d.portals}
 if(hole.mv)d.holeMv=[700,105,hole.sz,4.6];else{d.hole=[hole.y1-hole.sz,hole.y1];if(hole.y1<FLOOR-10)d.st.push(['ledge',1300,hole.y1+10,120,18,0,'hole'])}
 d._map=map;return d}
/* ---------- share codes: "1" + hole + pieces, then "." + name ---------- */
var B36='0123456789abcdefghijklmnopqrstuvwxyz';
function n2(v){v=clamp(Math.round(v/5),0,1295);return B36.charAt((v/36)|0)+B36.charAt(v%36)}
function d2(s){var a=B36.indexOf(s.charAt(0)),b=B36.indexOf(s.charAt(1));if(a<0||b<0)throw 0;return(a*36+b)*5}
var CODEOF={},TOFC={};PORDER.forEach(function(k){CODEOF[k]=PT[k].c;TOFC[PT[k].c]=k});
function enc(items,hole,name,best){var s='1'+n2(hole.y1)+(hole.sz===80?'s':hole.sz===130?'l':'m')+(hole.mv?'1':'0');
 items=items.filter(function(it){return it.t!=='portal'}).concat(items.filter(function(it){return it.t==='portal'}).sort(function(a,b){return(a.pr|0)-(b.pr|0)}));
 items.forEach(function(it){s+=CODEOF[it.t]+n2(it.x)+n2(it.y);if(it.t==='cup')s+=it.col||'r';else if(PT[it.t].rot)s+=B36.charAt(clamp((it.a||0)+6,0,12));else if(PT[it.t].flip)s+=it.a?'1':'0';if(it.t==='portal'&&it.d!=null)s+='-'+(it.d&7)});
 var nm=cleanName(name).replace(/ /g,'_');best=best|0;return s+(nm?'.'+encodeURIComponent(nm):'')+(best>0&&best<1000?(nm?'':'.')+'*'+best:'')}
function dec(code){code=String(code||'').trim();var m=/[#&?]L=([^&\s]+)/.exec(code);if(m)code=m[1];try{code=decodeURIComponent(code)}catch(e){}
 code=code.replace(/\s+/g,'');var dot=code.indexOf('.'),nm='';if(dot>=0){nm=code.slice(dot+1).replace(/_/g,' ');code=code.slice(0,dot)}var bm=/\*(\d{1,3})$/.exec(nm),best=0;if(bm){best=+bm[1];nm=nm.slice(0,bm.index)}
 if(code.charAt(0)!=='1'||code.length<5)return null;
 try{var hole={y1:d2(code.substr(1,2)),sz:{s:80,m:100,l:130}[code.charAt(3)]||100,mv:code.charAt(4)==='1'},items=[],i=5,cnt={};
  while(i<code.length&&items.length<MAXIT){var t=TOFC[code.charAt(i)];if(!t)return null;var it={t:t,x:d2(code.substr(i+1,2)),y:d2(code.substr(i+3,2))};i+=5;
   if(t==='cup'){var c=code.charAt(i);it.col='rgb'.indexOf(c)>=0?c:'r';i++}else if(PT[t].rot){it.a=clamp(B36.indexOf(code.charAt(i))-6,-6,6);i++}else if(PT[t].flip){it.a=code.charAt(i)==='1'?1:0;i++}
   if(t==='portal'&&code.charAt(i)==='-'){var dd=+code.charAt(i+1);if(!(dd>=0&&dd<8))return null;it.d=dd;i+=2}
   cnt[t]=(cnt[t]||0)+1;if(PT[t].max&&cnt[t]>PT[t].max)continue;if(t==='portal')it.pr=cnt[t]-1;items.push(fit(it))}
  if(cnt.portal&1){var lastP=cnt.portal-1;items=items.filter(function(it){return !(it.t==='portal'&&it.pr===lastP)})}
  holeFit(hole);var r={items:items,hole:hole,name:cleanName(nm)||'Mystery Level'};if(best>0)r.best=best;return r}catch(e){return null}}
function shareURL(code){return location.origin+location.pathname.replace(/index\.html$/,'')+'#L='+code}
/* ---------- DOM ---------- */
var edCss=document.createElement('style');edCss.textContent=
 '#edTop{position:fixed;left:0;right:0;top:0;z-index:8;display:none;gap:8px;align-items:center;justify-content:center;flex-wrap:wrap;padding:calc(8px + env(safe-area-inset-top)) calc(10px + env(safe-area-inset-right)) 0 calc(56px + env(safe-area-inset-left))}'+
 '#edTop .tag,#edTools .tag{pointer-events:auto;font-size:min(18px,1.7vw);padding:8px 11px;cursor:pointer}#edTop .go{background:#2f8a3a;color:#fff;box-shadow:0 4px 0 #1d5a25,0 6px 12px #0006}#edName{max-width:24vw;overflow:hidden;text-overflow:ellipsis}'+
 '#edPal{position:fixed;left:0;right:0;bottom:0;z-index:8;display:none;flex-direction:column;align-items:stretch;gap:6px;padding:6px calc(8px + env(safe-area-inset-right)) calc(6px + env(safe-area-inset-bottom)) calc(8px + env(safe-area-inset-left));background:linear-gradient(180deg,rgba(42,24,8,.82),rgba(28,14,4,.92));box-shadow:0 -8px 18px #0005;touch-action:none;pointer-events:auto}'+
 '#edTabs{display:flex;gap:8px;justify-content:center;flex-wrap:nowrap}'+
 '#edTabs .tab{flex:1 1 0;min-width:64px;min-height:64px;max-width:220px;border-radius:14px;padding:4px 6px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0;font-size:18px;line-height:1.1;color:#3a2414;background:#e8c98a;box-shadow:0 4px 0 #6b4520;touch-action:none;cursor:pointer;border:0}'+
 '#edTabs .tab b{font-size:28px;line-height:1;pointer-events:none}#edTabs .tab.on{background:#ffd23f;box-shadow:0 4px 0 #b8860a,0 0 0 3px #fff8}'+
 '#edPcs{display:flex;gap:8px;justify-content:safe center;flex-wrap:nowrap;overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:thin}'+
 '#edPal .pc{position:relative;flex:0 0 auto;min-width:64px;min-height:72px;width:clamp(64px,8.2vw,92px);border-radius:12px;padding:6px 2px 4px;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;gap:2px;font-size:16px;line-height:1.1;color:#3a2414;box-shadow:0 4px 0 #6b4520,0 6px 12px #0006;touch-action:none;cursor:grab}'+
 '#edUndo.off{opacity:.4}'+
 '#edPal .pc img{width:48px;height:48px;object-fit:contain;pointer-events:none}#edPal .pc.full{opacity:.45}'+
 '#edPal .pc .pn{text-align:center;pointer-events:none;max-width:100%;padding:0 2px}#edPal .pc .left{position:absolute;top:2px;right:2px;min-width:22px;height:22px;padding:0 5px;border-radius:11px;background:#ffde3b;color:#3a1d00;font-size:16px;line-height:22px;text-align:center;box-shadow:0 2px 0 #6b4520;pointer-events:none}'+
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
edPal.addEventListener('pointerdown',function(e){e.stopPropagation()});edTop.addEventListener('pointerdown',function(e){e.stopPropagation()});
edTop.innerHTML='<button class="tag cb mk" id="edBack">◀ Back</button><button class="tag cb mk off" id="edUndo" aria-label="Undo">↶ Undo</button><button class="tag cb mk" id="edName">✏️ My Level</button><button class="tag cb mk" id="edDice" aria-label="Random name">🎲</button>'+
 '<button class="tag cb mk" id="edHole">🕳️ Hole: Medium</button><button class="tag cb mk" id="edMove">↕️ Moving: off</button><button class="tag cb mk" id="edClear">🧹 Clear</button>'+
 '<button class="tag cb mk" id="edSave">💾 Save</button><button class="tag cb mk" id="edDad">📣 Challenge Dad</button><button class="tag cb mk" id="edBlow">💥 Blow it up!</button><button class="tag mk go" id="edTest">▶ Test it!</button>';
edTools.innerHTML='<button class="tag cb" id="edRotL" aria-label="Turn back">↺</button><button class="tag cb" id="edRot" aria-label="Turn">↻</button><button class="tag cb" id="edDir" aria-label="Exit direction">➜</button><button class="tag cb" id="edCol" aria-label="Color">🎨</button><button class="tag cb" id="edDel" aria-label="Throw away">🗑️</button>';
var hudEl=$('hud'),edB=mkEl('button','edbtn','tag cb mk','🛠️ Edit',hudEl);hudEl.insertBefore(edB,$('mute'));edB.style.display='none';
mkEl('div','myLv','ov','<div class="card cb"><h2 class="mk">🛠️ Alex\'s Levels</h2><div id="lvSub" style="font-size:18px;color:#4a2e10">Build your own junk pile, then challenge Dad!</div><div id="lvRows"></div>'+
 '<button class="btn" id="lvNew">➕ New level</button><button class="btn alt" id="lvCode">🔑 Enter a code</button><button class="btn alt" id="lvClose">Back</button>'+
 '<div id="codeBox" style="display:none"><input id="codeIn" placeholder="Paste a level code or link" autocomplete="off" autocapitalize="off" spellcheck="false"><button class="btn" id="codeGo">▶ Play it</button><div id="codeMsg" class="mk" style="color:#b3261e;font-size:20px"></div></div></div>');
mkEl('div','dadc','ov','<div class="card cb"><h2 class="mk">📣 Challenge Dad!</h2><div class="mk" style="font-size:24px;color:#1f3a6e" id="dadName"></div>'+
 '<div style="font-size:18px;margin-top:6px">Send Dad this link. It opens your level so he can try to beat it!</div><div id="dadBest" class="mk" style="font-size:20px;color:#b3261e"></div><div id="dadCode"></div>'+
 '<button class="btn dad" id="dadShare">📤 Send to Dad</button><button class="btn alt" id="dadCopy">📋 Copy link</button><button class="btn alt" id="dadClose">Done</button><div id="dadMsg" class="mk" style="font-size:20px;color:#2f8a3a;min-height:26px"></div></div>');
mkEl('div','chal','ov','<div class="card cb"><h2 class="mk">🏆 Alex\'s Challenge!</h2><div class="mk" style="font-size:34px;color:#b3261e" id="chName"></div>'+
 '<div style="font-size:20px;margin:8px 0">Alex built this level in Excavator Blowout. Can you get the ball past the junk and into the prize hole?</div>'+
 '<div id="chBest" class="mk" style="font-size:24px;color:#2f8a3a"></div><div style="font-size:16px;color:#6b4520;margin-bottom:6px">3 throws a round. Take as many rounds as you need!</div><button class="btn" id="chGo">▶ I accept!</button><button class="btn alt" id="chNo">Not now</button></div>');
var wcard=$('next').parentNode,wEdit=mkEl('button','wedit','btn alt','🛠️ Back to builder',wcard);
var tb=mkEl('button','tbuild','btn mk','🛠️ Build a level',$('play').parentNode);tb.style.cssText='font-size:min(5vmin,36px);padding:1.2vmin 3.4vmin;background:#e8762a;box-shadow:0 5px 0 #9a4a12,0 8px 14px #0005';
function toast(t){edToast.textContent=t;edToast.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(function(){edToast.classList.remove('on')},1300)}
/* palette icons drawn from the real game sprites */
function icon(t){var c=mkc(104,104),g=c.getContext('2d'),s;g.translate(52,52);
 function put(key,w,h){var o=spr(key);if(!o)return;var k=Math.min(90/w,90/h,1.6);g.drawImage(o.c,-w*k/2,-h*k/2,w*k,h*k)}
 if(t==='plate')put(sprPlate(42,301),84,84);else if(t==='cup')put(sprCup('r'),66,86);else if(t==='scrap')put(sprScrap(70,44,77),70,44);else if(t==='edge'){g.rotate(-.5);put(sprEdge(110,14),110,14)}
 else if(t==='gem')put('gem',30,30);else if(t==='ring')put('ring',84,84);else if(t==='shred')put(sprShred(110,56,600),110,56);
 else if(t==='pad')put('pad',164,84);else if(t==='wrap'){g.scale(1.25,1.25);drawBubbleSheet(g,-40,-22,80,44,0)}
 else if(false){var w=t==='pad'?90:96,h=t==='pad'?54:36;g.fillStyle='rgba(215,236,255,.9)';g.strokeStyle='#fff';g.lineWidth=3;g.fillRect(-w/2,-h/2,w,h);g.strokeRect(-w/2,-h/2,w,h);g.fillStyle='rgba(255,255,255,.95)';for(var x=-w/2+10;x<w/2-4;x+=16)for(var y=-h/2+10;y<h/2-4;y+=16){g.beginPath();g.arc(x,y,6,0,2*PI);g.fill()}if(t==='pad'){g.font='28px '+MK;g.fillStyle='#e8342a';g.textAlign='center';g.fillText('BOING',0,10)}}
 else if(t==='shelf'){g.rotate(-.35);put(sprScrap(140,20,15),140,20)}
 else if(t==='swing'){g.strokeStyle='#5fd13a';g.lineWidth=6;g.beginPath();g.moveTo(-30,-50);g.lineTo(6,14);g.stroke();g.save();g.translate(10,22);put(sprPlate(42,77),60,60);g.restore()}
 else if(t==='portal'){g.save();g.translate(-18,0);drawPortalShape(g,0,0,0,PCOL[0],0,.62);drawPNum(g,0,0,1,.55);g.restore();g.translate(18,0);drawPortalShape(g,0,0,0,PCOL[0],1.5,.62);drawPNum(g,0,0,1,.55)}
 else if(t==='whoop')put('whoop',96,44);else if(t==='tramp')put('tramp',156,52);else if(t==='chick'){g.rotate(-.15);put('chick',156,72)}else if(t==='banana')put('banana',84,30);else if(t==='frog')put('frog',80,64);else if(t==='horn')put('horn',92,60);else if(t==='fan'){put('fan',72,64);g.globalAlpha=.7;g.strokeStyle='#fff';g.lineWidth=3;[-10,0,10].forEach(function(y){g.beginPath();g.moveTo(34,y);g.lineTo(50,y);g.stroke()})}else if(t==='goat'){put('goatb',116,100);put('goath',116,100)}else if(t==='spray'){g.rotate(.12);put('spray',40,82)}else if(t==='spin')put('spin',96,96);else if(t==='pin')put('pin',70,120);else if(t==='jello')put('jello',112,80);else if(t==='glove')put('glove',110,70);else if(t==='balloon')put('balloon',58,96);else if(t==='duck')put('duck',84,72);else if(t==='paste')put('paste',56,108)
 else if(t==='slide'){put(sprScrap(28,140,91),40,90);g.fillStyle='#ffde3b';g.font='30px sans-serif';g.textAlign='center';g.fillText('↕',30,10)}
 return c.toDataURL()}
var PALB={},edTabs,edPcs;
function buildPal(){edPal.innerHTML='';edTabs=mkEl('div','edTabs',null,'',edPal);edPcs=mkEl('div','edPcs',null,'',edPal);
 PTABS.forEach(function(tab,i){var b=mkEl('button',null,'tab mk','<b>'+tab.e+'</b><span>'+tab.n+'</span>',edTabs);b.setAttribute('role','tab');b.setAttribute('aria-label',tab.n+' pieces');b.dataset.i=i;
  b.addEventListener('pointerdown',function(e){e.preventDefault();aInit();SFX.click();showTab(i)})});
 PORDER.forEach(function(t){var b=mkEl('div',null,'pc cb mk','<img alt=""><span class="pn">'+PT[t].n+'</span><b class="left">10</b>',edPcs);b.setAttribute('role','button');b.setAttribute('aria-label','Add '+PT[t].n);b.dataset.t=t;
  try{b.querySelector('img').src=icon(t)}catch(e){}PALB[t]=b;b.addEventListener('pointerdown',function(e){e.preventDefault();palDown(t,e)})});
 showTab(palTab)}
function showTab(n){n=clamp(n|0,0,PTABS.length-1);palTab=n;try{localStorage.setItem('aeb_palTab',''+n)}catch(e){}
 if(edTabs)[].forEach.call(edTabs.children,function(b,i){b.classList.toggle('on',i===n)});
 if(!edPcs)return;edPcs.innerHTML='';PTABS[n].ts.forEach(function(t){if(PALB[t])edPcs.appendChild(PALB[t])});updPal();requestAnimationFrame(resize)}
/* ---------- editor scene ---------- */
function edBuild(){var d=toDef(ED.items,ED.hole,ED.name);CUS.def=d;CUS.on=true;gt=Math.max(gt,1);clearLevel(false);setupLevel(0,true);ED.map=d._map;
 debris.forEach(function(b){Sleeping.set(b,true)});statics.concat(movers).forEach(function(b){b.pop0=gt-1});updPal()}
function bodyOf(i){var m=ED.map[i];if(!m)return null;return m[0]==='deb'?debris[m[1]]:m[0]==='st'?statics[m[1]]:m[0]==='mov'?movers[m[1]]:null}
function count(t){return ED.items.filter(function(it){return it.t===t}).length}
function freePair(){for(var p=0;p<4;p++)if(!ED.items.some(function(o){return o.t==='portal'&&((o.pr|0)>>1)===p}))return p;return -1}
var PSPOT=[[720,640,1180,600],[720,480,1180,450],[880,480,1020,450],[880,640,1020,600]];
function canAdd(t){if(t==='portal')return ED.items.length<=MAXIT-2&&freePair()>=0;return ED.items.length<MAXIT&&!(PT[t].max&&count(t)>=PT[t].max)}
function leftOf(t){var room=MAXIT-ED.items.length;if(t==='portal')return Math.max(0,Math.min(8-count('portal'),room-(room%2)));var typ=PT[t].max!=null?PT[t].max-count(t):room;return Math.max(0,Math.min(typ,room))}
function updPal(){PORDER.forEach(function(t){var b=PALB[t];if(!b)return;var n=leftOf(t);b.classList.toggle('full',!canAdd(t));var el=b.querySelector('.left');if(el)el.textContent=n});
 $('edHole').textContent='🕳️ Hole: '+(ED.hole.sz===80?'Small':ED.hole.sz===130?'Big':'Medium');$('edMove').textContent='↕️ Moving: '+(ED.hole.mv?'ON':'off');$('edName').textContent='✏️ '+(ED.name||'My Level')}
function resetPlay(){try{rpClear()}catch(e){}TM.length=0;Q.length=0;cq=null;if(EX.carry){EX.carry=null}EX.on=false;EX.speed=1;EX.x=EXPARK;EX.tx=EXPARK-400;EX.ty=TOP-30;EX.ba=1.5;EX.load=null;try{engSnd(false)}catch(e){}
 flying.forEach(function(f){Composite.remove(world,f)});flying=[];if(ball){Composite.remove(world,ball);ball=null}clearXB();trail=[];drag=null;AS.on=false;AS.shot=null;AS.q=null;AS.path=null;MS.on=false;
 ['win','shelf','modes','myLv','dadc','chal'].forEach(function(id){$(id).classList.remove('on')});$('skip').style.display='none';$('help').style.display='none'}
function showEd(on){edTop.style.display=on?'flex':'none';edPal.style.display=on?'flex':'none';edHint.style.display=on&&ED.hint?'block':'none';hudEl.style.display=on?'none':'';if(!on)edTools.style.display='none';requestAnimationFrame(function(){resize();if(on){try{edHint.style.top=Math.round(edTop.getBoundingClientRect().bottom+8)+'px'}catch(e){}placeTools()}})}
function openEditor(lv){aInit();resetPlay();if(lv||(!ED.items.length&&!ED.id))ED.hist=[];titleOn=false;$('title').classList.add('off');if(!edPal.children.length)buildPal();
 if(lv){ED.items=lv.items.map(function(it){var o={t:it.t,x:it.x,y:it.y,a:it.a||0,col:it.col};if(it.t==='portal'){o.pr=it.pr|0;if(it.d!=null)o.d=it.d}return fit(o)});ED.hole={y1:lv.hole.y1,sz:lv.hole.sz,mv:!!lv.hole.mv};ED.name=lv.name;ED.id=lv.id||null}
 else if(!ED.items.length&&!ED.id){ED.items=[{t:'plate',x:760,y:836},{t:'cup',x:980,y:838,col:'g'},{t:'gem',x:900,y:620}].map(fit);ED.hole={y1:FLOOR,sz:100,mv:false};ED.name=rndName();ED.id=null}
 holeFit();ED.sel=-1;state='edit';updUndo();CUS.fromEd=true;CUS.challenge=false;edBuild();showEd(true);edHint.textContent='👇 Drag junk into the box!  Drag the ⭐ hole up or down.';resize();MUS.on=true}
function closeEditor(){showEd(false);state='title';CUS.on=false;titleOn=true;$('title').classList.remove('off');gt=0;clearLevel(false);setupLevel(save.lv||0,true);refreshTitle();try{placePen()}catch(e){}}
function refreshTitle(){$('play').textContent=save.lv>0?'▶ Keep playing (Level '+(save.lv+1)+')':'▶ Play!';$('lv1').style.display=save.lv>0?'':'none'}
function edSnapshot(){return{items:ED.items.map(function(it){var o={t:it.t,x:it.x,y:it.y};if(it.a)o.a=it.a;if(it.t==='cup')o.col=it.col||'r';if(it.t==='portal'){o.pr=it.pr|0;if(it.d!=null)o.d=it.d}return o}),hole:{y1:ED.hole.y1,sz:ED.hole.sz,mv:ED.hole.mv},name:ED.name||'My Level'}}
function edSave(quiet){var a=lvList(),s=edSnapshot(),now=Date.now();if(!ED.id)ED.id='L'+now.toString(36);s.id=ED.id;s.at=now;var i=-1;a.forEach(function(x,j){if(x.id===ED.id)i=j});
 if(i>=0){s.wins=a[i].wins||0;s.plays=a[i].plays||0;if(a[i].best){s.best=a[i].best;s.bsig=a[i].bsig}a.splice(i,1)}a.unshift(s);lvStore(a);ED.dirty=false;if(!quiet){SFX.ok();toast('Saved! 💾');confetti(W/2,TOP+100,30)}return s}
/* ---------- editor input (touch first) ---------- */
function inBox(p){return p.x>FX0-30&&p.x<BX1+50&&p.y>TOP-70&&p.y<TABLE+30}
function hitHole(p){var h=ED.hole;if(h.mv)return false;return p.x>BX0-90&&p.x<BX1+70&&p.y>h.y1-h.sz-40&&p.y<h.y1+30}
function hitItem(p){for(var i=ED.items.length-1;i>=0;i--){var it=ED.items[i],P2=PT[it.t],r=Math.max(P2.w,P2.h)/2,hw=P2.rot?r:P2.w/2,hh=P2.rot?Math.max(P2.h/2,Math.min(r,40)):P2.h/2;
  hw=Math.max(hw,34);hh=Math.max(hh,34);if(Math.abs(p.x-it.x)<hw&&Math.abs(p.y-it.y)<hh)return i}return -1}
function moveVis(i,dx,dy){var it=ED.items[i],m=ED.map[i];if(!m||(!dx&&!dy))return;var b=bodyOf(i);if(b){Body.translate(b,{x:dx,y:dy});if(b.anchor)b.anchor={x:b.anchor.x+dx,y:b.anchor.y}}
 else if(m[0]==='gem'&&gems[m[1]]){gems[m[1]].x+=dx;gems[m[1]].y+=dy}else if(m[0]==='ring'&&ring){ring.x+=dx;ring.y+=dy}else if(m[0]==='shred'&&shreds[m[1]]){shreds[m[1]].x0+=dx;shreds[m[1]].x1+=dx}else if(m[0]==='portal'&&PORT[m[1]]){PORT[m[1]].x+=dx;PORT[m[1]].y+=dy}}
function edDown(e){if(state!=='edit')return;aInit();var p=toW(e);e.preventDefault();ED.hint=0;edHint.style.display='none';
 for(var ai=ED.items.length-1;ai>=0;ai--){var ait=ED.items[ai];if(ait.t!=='portal')continue;var ap=arrowAt(ait);if(Math.hypot(p.x-ap.x,p.y-ap.y)<34){spinDir(ai);return}}
 if(hitHole(p)){ED.drag={id:e.pointerId,hole:1,oy:p.y-ED.hole.y1,snap:edState(),y0:ED.hole.y1};SFX.click();return}
 var i=hitItem(p);if(i>=0){var it=ED.items[i];ED.sel=i;if(it.t==='portal')linkPair(it.pr);ED.drag={id:e.pointerId,i:i,ox:p.x-it.x,oy:p.y-it.y,vx:it.x,vy:it.y,moved:0,snap:edState()};SFX.thunk();placeTools();return}
 ED.sel=-1;placeTools()}
function edMove(e){var d=ED.drag;if(!d||e.pointerId!==d.id)return;var p=toW(e);e.preventDefault();
 if(d.hole){ED.hole.y1=p.y-d.oy;holeFit();setHole(ED.hole.y1-ED.hole.sz,ED.hole.y1);return}
 var it=ED.items[d.i];if(!it)return;var nx=p.x-d.ox,ny=p.y-d.oy,tmp={t:it.t,x:nx,y:ny,a:it.a};fit(tmp);d.trash=!d.isNew&&(p.x<FX0-40||p.y>TABLE+40||p.y<TOP-90);d.away=d.isNew&&!inBox(p);
 if((Math.abs(tmp.x-d.vx)>=5||Math.abs(tmp.y-d.vy)>=5)&&lim('snap',80))tone(1700,.025,{type:'square',vol:.018});moveVis(d.i,tmp.x-d.vx,tmp.y-d.vy);d.vx=tmp.x;d.vy=tmp.y;if(Math.hypot(nx-it.x,ny-it.y)>6)d.moved=1;placeTools()}
function edUp(e){var d=ED.drag;if(!d||e.pointerId!==d.id)return;ED.drag=null;
 if(d.hole){if(ED.hole.y1!==d.y0)edPush(d.snap);SFX.click();ED.dirty=true;edBuild();return}
 var it=ED.items[d.i];if(!it)return;
 if(d.trash){delItem(d.i);return}
 if(d.snap&&!d.isNew&&(d.vx!==it.x||d.vy!==it.y))edPush(d.snap);
 if(d.isNew&&d.away){it.x=it.t==='portal'?PSPOT[(it.pr|0)>>1][0]:700+rnd()*480;it.y=it.t==='portal'?PSPOT[(it.pr|0)>>1][1]:it.t==='gem'||it.t==='ring'?560+rnd()*120:it.t==='swing'?620:it.t==='slide'?680:it.t==='shelf'||it.t==='pad'?760:FLOOR-PT[it.t].h/2;fit(it);d.vx=it.x;d.vy=it.y}
 it.x=d.vx;it.y=d.vy;fit(it);if(!d.moved&&!d.isNew&&PT[it.t].flip){flipSpin(d.i);return}if(d.moved||d.isNew){ED.dirty=true;SFX.dump();ED.drop={x:it.x,y:it.y,t:gt};dust(it.x,Math.min(FLOOR,it.y+PT[it.t].h/2),4)}edBuild();ED.sel=d.i;placeTools()}
function delItem(i){var it=ED.items[i];if(!it)return;edPush();dust(it.x,it.y,8);sparks(it.x,it.y,8,'#ffe27a');SFX.pop();if(it.t==='portal'){var pp=(it.pr|0)>>1,same=function(o){return o.t==='portal'&&((o.pr|0)>>1)===pp};ED.items.forEach(function(o){if(same(o)&&o!==it){dust(o.x,o.y,8);sparks(o.x,o.y,8,'#ffe27a')}});ED.items=ED.items.filter(function(o){return !same(o)})}else ED.items.splice(i,1);ED.sel=-1;ED.dirty=true;edBuild();placeTools()}
function palDown(t,e){if(state!=='edit')return;aInit();ED.hint=0;edHint.style.display='none';if(!canAdd(t)){SFX.no();toast(ED.items.length>=MAXIT?'Box is full!':'That\'s the most '+PT[t].n.toLowerCase()+'s!');return}
 edPush();var p=toW(e),it={t:t,x:p.x,y:p.y-60};if(PT[t].rot)it.a=t==='shelf'?-2:0;if(t==='cup')it.col='rgb'.charAt(count('cup')%3);if(t==='portal'){var fp=freePair();it.pr=fp*2;it.d=0;ED.items.push(fit({t:'portal',x:PSPOT[fp][2],y:PSPOT[fp][3],a:0,pr:fp*2+1,d:0}));linkPair(it.pr)}fit(it);ED.items.push(it);edBuild();var i=ED.items.length-1;
 ED.sel=i;ED.drag={id:e.pointerId,i:i,ox:0,oy:60,vx:it.x,vy:it.y,moved:1,isNew:1,away:!inBox(p)};SFX.click();placeTools()}
function placeTools(){var i=ED.sel,it=ED.items[i];if(state!=='edit'||!it||ED.drag&&ED.drag.isNew){edTools.style.display='none';return}
 $('edRot').style.display=$('edRotL').style.display=PT[it.t].rot?'':'none';$('edCol').style.display=it.t==='cup'?'':'none';
 var flip=it.t==='portal'||PT[it.t].flip;$('edDir').style.display=flip?'':'none';
 if(it.t==='portal')$('edDir').style.transform='rotate('+((it.d==null?-2:it.d)*45)+'deg)';
 else if(PT[it.t].flip)$('edDir').style.transform='rotate('+(it.a?180:0)+'deg)';
 var top=it.y-Math.max(PT[it.t].h/2,30)-14,ty=OY+top*S,minY=60,maxY=CH;try{if(edTop&&edTop.style.display==='flex')minY=edTop.getBoundingClientRect().bottom+8;if(edPal&&edPal.style.display==='flex')maxY=edPal.getBoundingClientRect().top-8}catch(e){}
 edTools.style.left=(OX+it.x*S)+'px';edTools.style.top=Math.max(minY,Math.min(ty,maxY))+'px';edTools.style.display='flex'}
cv.addEventListener('pointerdown',edDown);addEventListener('pointermove',edMove,{passive:false});addEventListener('pointerup',edUp);addEventListener('pointercancel',function(e){if(ED.drag&&ED.drag.id===e.pointerId){ED.drag.trash=false;ED.drag.away=!!ED.drag.isNew;edUp(e)}});
$('edRot').addEventListener('click',function(){var it=ED.items[ED.sel];if(!it)return;edPush();it.a=((it.a||0)+2+6)%13-6;if(it.a>6)it.a=-6;fit(it);SFX.click();ED.dirty=true;edBuild();placeTools()});
$('edRotL').addEventListener('click',function(){var it=ED.items[ED.sel];if(!it)return;edPush();it.a=(((it.a||0)+4+13)%13)-6;fit(it);SFX.click();ED.dirty=true;edBuild();placeTools()});
$('edCol').addEventListener('click',function(){var it=ED.items[ED.sel];if(!it)return;edPush();it.col='rgb'.charAt(('rgb'.indexOf(it.col||'r')+1)%3);SFX.click();ED.dirty=true;edBuild()});
$('edDel').addEventListener('click',function(){delItem(ED.sel)});
$('edDir').addEventListener('click',function(){spinDir(ED.sel)});
function flipSpin(i){var it=ED.items[i];if(!it||!PT[it.t].flip)return;edPush();it.a=it.a?0:1;ED.sel=i;tone(it.a?360:520,.1,{type:'triangle',vol:.12});ED.dirty=true;edBuild();placeTools();toast(it.t==='spin'?(it.a?'Spins the other way! ↺':'Spins this way! ↻'):(it.a?'Punches left! 👈':'Punches right! 👉'))}
function spinDir(i){var it=ED.items[i];if(!it)return;if(PT[it.t].flip){flipSpin(i);return}if(it.t!=='portal')return;edPush();it.d=it.d==null?0:(it.d+1)&7;ED.sel=i;tone(520+it.d*60,.08,{type:'triangle',vol:.12});ED.dirty=true;edBuild();placeTools()}
$('edHole').addEventListener('click',function(){edPush();var h=ED.hole;h.sz=h.sz===100?130:h.sz===130?80:100;holeFit();SFX.click();ED.dirty=true;edBuild()});
$('edMove').addEventListener('click',function(){edPush();ED.hole.mv=!ED.hole.mv;SFX.click();ED.dirty=true;edBuild();toast(ED.hole.mv?'Moving hole! ↕️':'Hole stays put')});
$('edClear').addEventListener('click',function(){if(!ED.items.length)return;edPush();ED.items=[];ED.sel=-1;ED.dirty=true;SFX.boom();shake(14);dust(900,FLOOR,14);edBuild();placeTools();toast('All clear! 🧹')});
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
function customWon(){if(!CUS.on)return;var n=stats.throws-CUS.th0,nb=false,lv=CUS.lv||{};CUS.th0=stats.throws;if(CUS.id){var a=lvList(),sg=lv.items?enc(lv.items,lv.hole,''):'';a.forEach(function(x){if(x.id===CUS.id){x.wins=(x.wins||0)+1;if(!CUS.challenge&&sg){if(x.bsig!==sg||!x.best||n<x.best){x.best=n;x.bsig=sg;nb=true}}}});lvStore(a)}
 $('next').textContent='🔁 Play again';wEdit.style.display='';wEdit.textContent=CUS.fromEd?'🛠️ Back to builder':'🏠 Menu';
 var tw=function(k){return k+' throw'+(k===1?'':'s')},bs=CUS.challenge&&lv.best;
 $('grandMsg').textContent=(CUS.challenge?(bs?(n<bs?'You beat Alex\'s score! You: '+tw(n)+', Alex: '+tw(bs)+' 🏆':n===bs?'You tied Alex: '+tw(n)+'! 🤝':'You did it in '+tw(n)+'. Alex did it in '+tw(bs)+'. Play again to beat him!'):'You beat Alex\'s level in '+tw(n)+'! 🙌'):'Your level works! Beat it in '+tw(n)+'.'+(nb?' ⭐ Your best!':''))+($('grandMsg').textContent?' '+$('grandMsg').textContent:'')}
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
function lvBest(lv){var x=lv;if(!x.best){var id=lv.id||ED.id;lvList().forEach(function(o){if(o.id===id)x=o})}return x.best&&x.bsig===enc(lv.items,lv.hole,'')?x.best:0}
function openDad(lv){var bst=lvBest(lv),code=enc(lv.items,lv.hole,lv.name,bst),url=shareURL(code);$('dadBest').textContent=bst?'⭐ Your best: '+bst+' throw'+(bst===1?'':'s')+'. Dad has to beat that!':'Tip: beat it with ▶ Test it! first and your score goes in the link.';$('dadName').textContent='"'+(lv.name||'My Level')+'"';$('dadCode').textContent=url;$('dadMsg').textContent='';$('dadc').dataset.url=url;$('dadc').dataset.name=lv.name||'My Level';
 $('dadShare').style.display=navigator.share?'':'none';SFX.click();$('dadc').classList.add('on')}
$('dadShare').addEventListener('click',function(){var u=$('dadc').dataset.url;try{navigator.share({title:'Excavator Blowout challenge',text:'Dad, can you beat my Excavator Blowout level "'+$('dadc').dataset.name+'"? 🚜',url:u}).then(function(){$('dadMsg').textContent='Sent! 🚀'}).catch(function(){})}catch(e){}});
$('dadCopy').addEventListener('click',function(){var u=$('dadc').dataset.url,ok=function(){$('dadMsg').textContent='Copied! Paste it in a message to Dad. 📋';SFX.ok()};
 try{navigator.clipboard.writeText(u).then(ok,function(){selCode()})}catch(e){selCode()}});
function selCode(){try{var r=document.createRange();r.selectNodeContents($('dadCode'));var s=getSelection();s.removeAllRanges();s.addRange(r);document.execCommand('copy');$('dadMsg').textContent='Copied! 📋'}catch(e){$('dadMsg').textContent='Press and hold the link to copy it.'}}
$('dadClose').addEventListener('click',function(){SFX.click();$('dadc').classList.remove('on')});
tb.addEventListener('click',function(){aInit();SFX.click();if(lvList().length)openLevels();else{ED.items=[];ED.id=null;ED.name='';openEditor()}});
var CHL=null;function checkHash(){var h=location.hash||'';if(!/L=/.test(h))return;var lv=dec(h);if(!lv)return;CHL=lv;$('chName').textContent='"'+lv.name+'"';$('chBest').textContent=lv.best?'Alex did it in '+lv.best+' throw'+(lv.best===1?'':'s')+'. Can you beat that? 💪':'';$('chal').classList.add('on');
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
 var sl=ED.items[ED.sel];if(sl&&!(d&&d.i===ED.sel)){var r2=Math.max(PT[sl.t].w,PT[sl.t].h)/2+12;g.globalAlpha=.18+.1*pul;g.fillStyle='#ffde3b';g.beginPath();g.arc(sl.x,sl.y,r2,0,2*PI);g.fill();g.globalAlpha=1;g.font='24px '+MK;g.textAlign='center';g.lineWidth=5;g.strokeStyle='#3a1d00';var ny=Math.min(FLOOR-6,sl.y+r2+26);g.strokeText(PT[sl.t].n,sl.x,ny);g.fillStyle='#ffde3b';g.fillText(PT[sl.t].n,sl.x,ny);g.textAlign='left'}
 var dp=ED.drop;if(dp&&gt-dp.t<.4){var kk=(gt-dp.t)/.4;g.strokeStyle='rgba(255,255,255,'+(1-kk)+')';g.lineWidth=5*(1-kk)+1;g.beginPath();g.arc(dp.x,dp.y,30+70*kk,0,2*PI);g.stroke()}
 g.font='22px '+MK;g.fillStyle='rgba(255,255,255,.8)';g.fillText(ED.items.length+' / '+MAXIT+' pieces',FX1+20,TOP+48)}
/* ===== v1.5.1 builder toys: whoopie cushion + silly string can (static pieces; never shake the screen; 400ms throttle) ===== */
defSpr('whoop',96,44,function(g){g.translate(48,24);var ol='#5a0f1e';
 g.fillStyle='#d92b4b';g.strokeStyle=ol;g.lineWidth=3;g.beginPath();g.moveTo(34,4);g.lineTo(47,0);g.lineTo(47,12);g.lineTo(34,10);g.closePath();g.fill();g.stroke();
 g.beginPath();g.ellipse(-4,4,40,15,0,0,2*PI);g.fill();g.stroke();
 g.fillStyle='#f0587a';g.beginPath();g.ellipse(-6,0,32,9,0,PI,2*PI);g.fill();
 g.fillStyle='rgba(255,255,255,.55)';g.beginPath();g.ellipse(-18,-4,10,3,-.15,0,2*PI);g.fill();
 g.strokeStyle='rgba(90,15,30,.45)';g.lineWidth=2;g.beginPath();g.ellipse(-4,6,30,8,0,.15*PI,.85*PI);g.stroke()});
defSpr('spray',40,82,function(g){g.translate(20,44);var ol='#123a52';
 g.fillStyle='#e8342a';g.strokeStyle=ol;g.lineWidth=3;g.beginPath();g.rect(-12,-37,24,10);g.fill();g.stroke();g.fillStyle='#fff';g.fillRect(-3,-42,10,6);g.strokeRect(-3,-42,10,6);
 g.fillStyle='#1fb4e8';g.beginPath();g.moveTo(-16,-27);g.lineTo(16,-27);g.lineTo(16,34);g.quadraticCurveTo(0,38,-16,34);g.closePath();g.fill();g.stroke();
 ['#ffd21a','#ff6fb5','#7dff6a','#ff7a1a'].forEach(function(c,i){g.strokeStyle=c;g.lineWidth=3.5;g.beginPath();g.moveTo(-14,-18+i*12);g.bezierCurveTo(-6,-26+i*12,4,-10+i*12,14,-18+i*12);g.stroke()});
 g.fillStyle='rgba(255,255,255,.4)';g.fillRect(-12,-24,4,54)});
function mkToy(t,d){var b;if(t==='whoop'){b=stat(d[1],d[2],d[3],d[4]-6,{mat:'whoop',re:.55,fr:.6});b.sw=96;b.sh=44}else if(t==='spray'){b=stat(d[1],d[2],d[3],d[4],{mat:'card',re:.3,fr:.5});b.sw=40;b.sh=82}
 else if(t==='tramp'){b=stat(d[1],d[2],148,40,{mat:'wrap',re:.8,fr:.4});b.sw=156;b.sh=52}
 else if(t==='banana'){b=stat(d[1],d[2],78,20,{mat:'card',re:.1,fr:0});b.frictionStatic=0;b.sw=84;b.sh=30}
 else if(t==='frog'){b=stat(d[1],d[2],70,54,{mat:'card',re:.35,fr:.5});b.sw=80;b.sh=64}
 else if(t==='fan'){b=stat(d[1],d[2],56,46,{mat:'card',re:.3,fr:.5,a:d[5]||0});b.sw=72;b.sh=64;b.fan=1;FANL.push(b)}
 else if(t==='goat'){b=stat(d[1],d[2],76,92,{mat:'card',re:.3,fr:.5});b.sw=116;b.sh=100}
 else if(t==='spin'){b=stat(d[1],d[2],86,86,{mat:'plate',re:.2,fr:.15});b.sw=96;b.sh=96;b.dir=d[5]?-1:1;b.spinA=0}
 else if(t==='pin'){b=stat(d[1],d[2]+40,16,40,{mat:'card',re:.2,fr:.5});b.sw=70;b.sh=120;b.spinA=0;b.spinV=0;b.pin=1}
 else if(t==='jello'){b=stat(d[1],d[2]+14,90,36,{mat:'wrap',re:.08,fr:.5});b.sw=112;b.sh=80;b.ofs={x:0,y:-14};b.frictionStatic=.5}
 else if(t==='glove'){b=stat(d[1],d[2],96,36,{mat:'card',re:.2,fr:.4});b.sw=110;b.sh=70;b.dir=d[5]?-1:1;b.punT=-9;b.ready=1}
 else if(t==='balloon'){b=stat(d[1],d[2],48,56,{mat:'wrap',re:.4,fr:.2});b.sw=58;b.sh=96;b.popped=0}
 else if(t==='paste'){b=stat(d[1],d[2],46,96,{mat:'card',re:.25,fr:.5});b.sw=56;b.sh=108;b.erupt=0;b.foamN=0}
 else{b=stat(d[1],d[2],86,48,{mat:'card',re:.3,fr:.5});b.sw=92;b.sh=60}
 b.kind=t;b.toy=1;b.lastHit=-9;b.hitT=-9;return b}
function drawToy(g,b){if(b.kind==='jello'){if(b.ofs)g.translate(b.ofs.x,b.ofs.y);drawJello(g,b);return}var k=clamp((gt-b.hitT)/(b.kind==='chick'?.75:b.kind==='goat'?GOATL:.45),0,1),on=k<1,s=spr(b.kind==='goat'?'goatb':b.kind),q;if(!s)return;
 if(b.kind==='goat'){var hs=spr('goath');g.drawImage(s.c,-b.sw/2,-b.sh/2,s.w,s.h);/* v1.6.3: head thrown back + mouth wide open, held for the whole scream, then settles */var gu=clamp(k/.06,0,1),gd=clamp((k-.9)/.1,0,1),hold=on?Math.sin(gu*PI/2)*(1-gd*gd):0;q=on?Math.sin(gt*55)*.12*hold+Math.sin(k*PI*6)*(1-k)*.3*gd:0;var tl=-.62*hold;
  g.save();g.translate(19,-17);g.rotate(tl+.16*q);g.translate(-19,17);if(hs)g.drawImage(hs.c,-b.sw/2,-b.sh/2,hs.w,hs.h);if(hold>.05){var mo=hold*(1+.08*Math.sin(gt*40));g.fillStyle='#3a0f14';g.beginPath();g.ellipse(48,-15,9*mo,14*mo,.3,0,2*PI);g.fill();g.fillStyle='#ff7a8a';g.beginPath();g.ellipse(49,-9,5.5*mo,5*mo,.3,0,2*PI);g.fill();g.fillStyle='#fff';g.fillRect(43,-28*mo+0,4,4);g.fillRect(49,-28*mo+1,4,4)}g.restore();return}
 if(b.kind==='chick'){q=on?Math.sin(k*PI*3)*(1-k):0;var cx=1+.38*q;g.translate(0,-6-16*Math.abs(q));g.rotate(-.12*q);g.scale(cx,1/cx);g.drawImage(s.c,-b.sw/2,-b.sh/2,s.w,s.h);return}
 if(b.kind==='fan'){g.drawImage(s.c,-b.sw/2,-b.sh/2,s.w,s.h);g.save();g.translate(-8,-2);g.rotate(gt*16);g.fillStyle='rgba(230,240,255,.85)';for(var bi=0;bi<3;bi++){g.rotate(2*PI/3);g.beginPath();g.ellipse(0,-10,6,11,.3,0,2*PI);g.fill()}g.restore();g.fillStyle='#2b3440';g.beginPath();g.arc(-8,-2,4,0,2*PI);g.fill();return}
 if(b.kind==='pad'){var kp=clamp((gt-b.hitT)/.7,0,1),sy=1;if(kp<1){if(kp<.16)sy=1-.48*Math.sin(kp/.16*PI/2);else{var u=(kp-.16)/.84;sy=1-.48*Math.cos(u*PI*3)*Math.pow(1-u,1.6)}}
  g.translate(0,b.sh/2);g.scale(1/Math.sqrt(sy),sy);g.drawImage(s.c,-b.sw/2,-b.sh,s.w,s.h);return}
 if(b.kind==='tramp'){q=on?Math.sin(k*PI*2)*(1-k):0;g.translate(0,b.sh/2);g.scale(1+.04*q,1-.2*q);g.drawImage(s.c,-b.sw/2,-b.sh,s.w,s.h);return}
 if(b.kind==='banana'){q=on?Math.sin(k*PI*4)*(1-k):0;g.translate(0,b.sh/2);g.rotate(.18*q);g.drawImage(s.c,-b.sw/2,-b.sh,s.w,s.h);return}
 if(b.kind==='horn'){q=on?Math.sin(k*PI*2)*(1-k):0;g.scale(1-.08*q,1+.1*q);g.drawImage(s.c,-b.sw/2,-b.sh/2,s.w,s.h);return}
 if(b.kind==='frog'){q=on?Math.sin(k*PI)*(1-k*.3):0;g.drawImage(s.c,-b.sw/2,-b.sh/2,s.w,s.h);if(q>.02){g.fillStyle='#f3ffc4';g.strokeStyle='#2c6b1a';g.lineWidth=2.5;g.beginPath();g.ellipse(0,14,8+18*q,6+14*q,0,0,2*PI);g.fill();g.stroke()}return}
 if(b.kind==='spin'){var fast=b.hitT&&gt-b.hitT<.5,blur=fast?clamp(1-(gt-b.hitT)/.5,0,1):0;g.fillStyle='rgba(0,0,0,.16)';g.beginPath();g.ellipse(0,b.sh/2-4,28,7,0,0,2*PI);g.fill();if(blur>.04){g.save();g.globalAlpha=.16*blur;g.strokeStyle='#c9a0ff';g.lineWidth=16;g.beginPath();g.arc(0,0,34,0,2*PI);g.stroke();g.restore();for(var gi=3;gi>=1;gi--){g.save();g.globalAlpha=.18*blur;g.rotate((b.spinA||0)-(b.dir||1)*gi*.2);drawFidget(g,false);g.restore()}}g.save();g.rotate(b.spinA||0);drawFidget(g,false);g.restore();drawFidget(g,true);return}
 if(b.kind==='pin'){g.fillStyle='rgba(0,0,0,.16)';g.beginPath();g.ellipse(0,b.sh/2-6,10,5,0,0,2*PI);g.fill();if(s)g.drawImage(s.c,-b.sw/2,-b.sh/2,s.w,s.h);g.save();g.translate(0,-36);g.rotate(b.spinA||0);drawPinVaness(g,on?1-k:0);g.restore();return}
 if(b.kind==='glove'){var pk=clamp((gt-(b.punT||-9))/.34,0,1),out=0,sq=1;if(pk<1){if(pk<.22){out=-10*(pk/.22);sq=1-.08*(pk/.22)}else if(pk<.42){var u=(pk-.22)/.2;out=-10+48*u;sq=1-.08+0.18*u}else{var u2=(pk-.42)/.58;out=38*(1-u2);sq=1+.1*(1-u2)}}g.save();if(b.dir<0)g.scale(-1,1);g.translate(out,0);g.scale(1+(.12*(1-sq)),sq);if(s)g.drawImage(s.c,-b.sw/2,-b.sh/2,s.w,s.h);g.restore();return}
 if(b.kind==='balloon'){if(b.popped){var pk=gt-b.hitT;if(pk<.28){g.globalAlpha=1-pk/.28;g.strokeStyle='#fff';g.lineWidth=5*(1-pk/.28);g.beginPath();g.arc(0,0,16+90*pk,0,2*PI);g.stroke();g.globalAlpha=1}return}var by=Math.sin(gt*2.2)*6,sq=1+Math.sin(gt*2.2)*.04;g.translate(0,by);g.scale(2-sq,sq);if(s)g.drawImage(s.c,-b.sw/2,-b.sh/2,s.w,s.h);return}
 if(b.kind==='paste'){g.fillStyle='rgba(0,0,0,.16)';g.beginPath();g.ellipse(0,b.sh/2-6,16,6,0,0,2*PI);g.fill();if(s)g.drawImage(s.c,-b.sw/2,-b.sh/2,s.w,s.h);if(b.erupt)drawPasteColumn(g,b);return}
 if(b.kind==='duck'){q=on?Math.sin(k*PI*4)*(1-k):Math.sin(gt*2)*.04;var ds=on?1+.12*Math.sin(k*PI*3)*(1-k):1;g.translate(0,-10*Math.abs(q));g.rotate(.22*q);g.scale(ds,2-ds);if(s)g.drawImage(s.c,-b.sw/2,-b.sh/2,s.w,s.h);return}
 if(b.kind==='whoop'){var q=on?Math.sin(k*PI)*(1-k*.25):0,sy=1-.55*q,sx=1+.2*q;g.translate(0,b.sh*.38*(1-sy));g.scale(sx,sy);g.drawImage(s.c,-b.sw/2,-b.sh/2,s.w,s.h)}
 else{var w=on?Math.sin(k*PI*5)*.12*(1-k):0;g.translate(0,b.sh/2);g.rotate(w);g.drawImage(s.c,-b.sw/2,-b.sh,s.w,s.h)}}
function whoopSnd(){loadFarts();if(!aok())return;if(playSample('whoop',.85))return;var bs=FA.buf.filter(function(x){return x.__n!==5});// never the wet 'Gastric Distress' clip
 if(!bs.length){noise(.3,{ft:'lowpass',f:300,fto:120,q:5,vol:.38});tone(110,.3,{to:70,type:'sawtooth',vol:.1});return}
 playToot(.85)}
function sprayCount(){var n=0;for(var i=0;i<P.length;i++)if(P[i].k==='ss')n++;return n}
var TSQ=[];function toySndOk(){var n=performance.now();TSQ=TSQ.filter(function(t){return n-t<250});if(TSQ.length>=4)return false;TSQ.push(n);return true}
function toyHit(b,rv,sp){if(b.kind==='goat'&&gt-b.hitT<GOATL-.08){b.lastHit=gt;return}if(gt-b.lastHit<.4)return;b.lastHit=gt;b.hitT=gt;var x=b.position.x,y=b.position.y,snd=toySndOk();
 if(b.kind==='whoop'){if(snd)whoopSnd();ftext(x,y-46,'Pfffft!','#ffb3c7');for(var i=0;i<7;i++)emit({k:'pf',x:x+44+rnd()*8,y:y+(rnd()-.5)*10,vx:120+rnd()*160,vy:-30-rnd()*80,m:.5+rnd()*.4,s:5+rnd()*6})}
 else if(b.kind!=='spray')silly(b,x,y,rv,snd);
 else{if(snd&&!playSample('spray',.85)){noise(.34,{ft:'bandpass',f:5600,fto:2400,q:.7,vol:.22,att:.01});noise(.18,{ft:'highpass',f:6500,vol:.08,at:.05})}
  var n=Math.min(22,48-sprayCount()),cols=['#ff3b8d','#ffd21a','#3bff8a','#3bb5ff','#ff7a1a','#c77dff'];
  for(var j=0;j<n;j++){var a=-PI/2+(rnd()-.5)*1.3,sp2=420+rnd()*380;emit({k:'ss',x:x+3,y:y-b.sh/2-4,vx:Math.cos(a)*sp2,vy:Math.sin(a)*sp2,m:1.4+rnd()*.7,c:cols[j%6],ph:rnd()*6})}}}
/* ===== v1.6.0 portal pair. Pure geometry, no bodies: also runs inside the shot solver + helper sims ===== */
/* v1.6.4: both ends of a pair share a color + a big number 1-4 (pair index from pr / share-code order, so old codes keep the same pairing). */
/* v1.6.5: numbers, dotted partner line, and the teleport pulse are builder-only. Play keeps matching colors, softened, plus the 1.6.3 exit arrows. */
var PORT=[],PCOL=['#ff7a12','#2480ff','#1ec94a','#b44dff'],PSOFT=['#e0914a','#5a9ad4','#55b56e','#9a7cc8'],PTN=[0,0],PLINK=null;
function pEd(){return state==='edit'}
function pCol(k,soft){return (soft?PSOFT:PCOL)[(k>>1)&3]}
function pNo(k){return ((k>>1)&3)+1}
function linkPair(k){PLINK={p:(k>>1)&3,t:gt}}
function inPortal(p,q){var c=Math.cos(-q.a),s=Math.sin(-q.a),dx=p.x-q.x,dy=p.y-q.y,lx=dx*c-dy*s,ly=dx*s+dy*c;return lx*lx/900+ly*ly/2704<1}
function portalTP(b,sim){if(!PORT.length||!b)return false;if(b.ptCd>0)b.ptCd--;var p=b.position;
 if(b.ptOut!=null&&(!PORT[b.ptOut]||!inPortal(p,PORT[b.ptOut])))b.ptOut=null;if(b.ptCd>0)return false;
 for(var k=0;k<PORT.length;k++){if(!PORT[k]||!PORT[k^1]||k===b.ptOut||!inPortal(p,PORT[k]))continue;var j=k^1,A=PORT[k],B=PORT[j],da=B.a-A.a,v=b.velocity,c=Math.cos(da),s=Math.sin(da);
  Sleeping.set(b,false);if(B.d!=null){var ea=B.d*PI/4,ex=Math.cos(ea),ey=Math.sin(ea),spd=Math.hypot(v.x,v.y);Body.setPosition(b,{x:B.x+ex*PEXO,y:B.y+ey*PEXO});Body.setVelocity(b,{x:ex*spd,y:ey*spd})}
  else{Body.setPosition(b,{x:B.x,y:B.y});Body.setVelocity(b,{x:v.x*c-v.y*s,y:v.x*s+v.y*c})}b.ptOut=j;b.ptCd=36;PTN[sim?1:0]++;// ~0.3 s cooldown (120 Hz steps)
  if(!sim){A.fl=B.fl=gt;if(fly)fly.pt=1;vwoop();[A,B].forEach(function(q){for(var i=0;i<12;i++){var an=i/12*2*PI+gt*3;emit({k:'sp',x:q.x+Math.cos(an)*30,y:q.y+Math.sin(an)*44,vx:-Math.sin(an)*220,vy:Math.cos(an)*220-60,m:.45,c:pCol(k),s:4})}})}
  return true}return false}
var PEXO=22;/* v1.6.2 exit arrow: ball leaves along the arrow at its entry speed, 22px out from the centre */
/* v1.6.6: in play the arrow is drawn at 60% size and 40% opacity; builder arrows are unchanged */
function arrowAt(q){var a=(q.d==null?-2:q.d)*PI/4;return{x:q.x+Math.cos(a)*74,y:q.y+Math.sin(a)*74}}
function drawPArrow(g,q,col,t,ed){if(q.d==null){if(!ed)return;var p=arrowAt(q);g.save();g.translate(p.x,p.y);g.globalAlpha=.85;g.strokeStyle='#fff';g.lineWidth=5;g.beginPath();g.arc(0,0,14,.4,5.6);g.stroke();g.fillStyle='#fff';g.font='bold 16px sans-serif';g.textAlign='center';g.fillText('auto',0,34);g.restore();return}
 var a=q.d*PI/4,pu=ed?1+.06*Math.sin(t*5):.6;g.save();g.translate(q.x,q.y);g.rotate(a);g.scale(pu,pu);if(!ed)g.globalAlpha=.4;g.lineJoin='round';g.beginPath();g.moveTo(34,-9);g.lineTo(62,-9);g.lineTo(62,-22);g.lineTo(92,0);g.lineTo(62,22);g.lineTo(62,9);g.lineTo(34,9);g.closePath();
 g.fillStyle='#fff';g.strokeStyle=col;g.lineWidth=6;g.stroke();g.fill();g.restore()}
function vwoop(){tone(240,.26,{to:950,type:'sine',vol:.16});tone(480,.2,{to:1600,type:'triangle',vol:.05,at:.05})}
function drawPortalShape(g,x,y,a,col,t,sc,soft){g.save();g.translate(x,y);g.rotate(a);if(sc)g.scale(sc,sc);
 g.shadowColor=col;g.shadowBlur=soft?10:18;g.fillStyle='#120a24';g.strokeStyle=col;g.lineWidth=soft?6:7;g.beginPath();g.ellipse(0,0,26,48,0,0,2*PI);g.fill();g.stroke();g.shadowBlur=0;
 g.lineWidth=3;g.globalAlpha=soft?.7:.85;for(var i=0;i<3;i++){g.strokeStyle=i%2?'#fff':col;g.beginPath();var r=1-i*.28;g.ellipse(0,0,22*r,42*r,0,t*(3+i)+i*2,t*(3+i)+i*2+3.6);g.stroke()}g.globalAlpha=1;g.restore()}
function drawPNum(g,x,y,n,sc){g.save();g.translate(x,y);if(sc&&sc!==1)g.scale(sc,sc);g.lineJoin='round';g.lineCap='round';
 g.fillStyle='rgba(8,4,12,.72)';g.beginPath();g.ellipse(0,1,16,20,0,0,2*PI);g.fill();
 if(n===1){function stem(col,w){g.strokeStyle=col;g.lineWidth=w;g.beginPath();g.moveTo(-11,-6);g.lineTo(1,-18);g.lineTo(1,15);g.moveTo(-11,16);g.lineTo(13,16);g.stroke()}stem('#1a0a08',13);stem('#fff',7)}
 else{g.font='900 40px '+MK;g.textAlign='center';g.textBaseline='middle';g.lineWidth=9;g.strokeStyle='#1a0a08';g.strokeText(n,0,2);g.fillStyle='#fff';g.fillText(n,0,2)}g.restore()}
function pairLinked(p){if(!pEd())return 0;if(PLINK&&PLINK.p===p&&gt-PLINK.t<1.45)return clamp(1-(gt-PLINK.t-1.05)/.4,0,1);if(ED.drag&&!ED.drag.hole){var it=ED.items[ED.drag.i];if(it&&it.t==='portal'&&((it.pr|0)>>1)===p)return 1}return 0}
function drawPairLine(g,A,B,col,t,al){if(!A||!B||al<=0)return;g.save();g.globalAlpha=al;g.lineCap='round';g.setLineDash([16,12]);g.lineDashOffset=-t*90;g.strokeStyle='#fff';g.lineWidth=10;g.beginPath();g.moveTo(A.x,A.y);g.lineTo(B.x,B.y);g.stroke();g.strokeStyle=col;g.lineWidth=6;g.stroke();g.restore()}
function drawPortals(g,t){var ed=pEd(),p;
 if(ed){for(p=0;p<4;p++){var al=pairLinked(p);if(al)drawPairLine(g,PORT[p*2],PORT[p*2+1],PCOL[p],t,al)}}
 for(var k=0;k<PORT.length;k++){var q=PORT[k];if(!q)continue;var col=pCol(k,!ed),sc=1;
  if(ed){var f=q.fl!=null?clamp(1-(gt-q.fl)/.55,0,1):0;sc=1+.42*f;if(f>0){g.save();g.translate(q.x,q.y);g.rotate(q.a);g.globalAlpha=.3+.7*f;g.strokeStyle='#fff';g.shadowColor=col;g.shadowBlur=28;g.lineWidth=4+14*f;g.beginPath();g.ellipse(0,0,28+8*f,50+10*f,0,0,2*PI);g.stroke();g.restore()}}
  drawPortalShape(g,q.x,q.y,q.a,col,t,sc,!ed);if(ed)drawPNum(g,q.x,q.y,pNo(k),sc);drawPArrow(g,q,col,t,ed)}}
/* ===== v1.6.1: undo, blow-up-my-level, trampoline, rubber chicken + silly pieces (all sounds synthesized, mute-aware, 400ms throttle, no screen shake) ===== */
ED.hist=[];
function edState(){return JSON.stringify({items:edSnapshot().items,hole:{y1:ED.hole.y1,sz:ED.hole.sz,mv:!!ED.hole.mv}})}
function edPush(snap){ED.hist.push(snap||edState());if(ED.hist.length>40)ED.hist.shift();updUndo()}
function updUndo(){var b=$('edUndo');if(b)b.classList.toggle('off',!ED.hist.length)}
function edUndo(){if(state!=='edit')return;aInit();if(!ED.hist.length){SFX.no();return}var o=JSON.parse(ED.hist.pop());
 ED.items=o.items.map(function(it){var q={t:it.t,x:it.x,y:it.y,a:it.a||0,col:it.col};if(it.t==='portal'){q.pr=it.pr|0;if(it.d!=null)q.d=it.d}return fit(q)});ED.hole=o.hole;holeFit();
 ED.sel=-1;ED.drag=null;ED.dirty=true;edBuild();placeTools();updUndo();if(!memePlay('scratch',1,.9))SFX.click();toast('Undo ↶')}
$('edUndo').addEventListener('click',edUndo);
/* blow up my level: the real excavator blowout on Alex's build, then his layout comes back exactly */
function edBlowUp(){if(state!=='edit')return;aInit();if(!ED.items.length){SFX.no();toast('Add some junk first!');return}
 ED.sel=-1;ED.drag=null;ED.blowShk=0;showEd(false);hudEl.style.display='none';edHint.style.display='none';state='edblow';TM.length=0;exStart();$('skip').style.display='none';rpBegin('blow');
 memePlay('dundundun',1,.95);
 act({d:.45,ex:1120,tx:900,ty:TOP-230,ba:.3});
 act({d:.2,tx:880,ty:FLOOR-90,ba:1.5,end:edBoom});
 act({d:.35,tx:900,ty:TOP-260,ba:.4});
 act({d:.9});
 exPark(edBlowDone)}
/* v1.6.2: EVERY piece (fixed ones too) becomes dynamic for a moment and flies; portals/gems/ring/paper piles fly as pictures; the saved layout is untouched */
var EDF=[];
function edBoom(){if(state!=='edblow')return;playSample('boom',1,SFX.boom);shake(14);banner('BLOWOUT!');crowdEv('blowout');chickBlow();
 var all=debris.concat(statics.filter(function(b){return !b.holeLedge}),movers);
 all.forEach(function(b){var p=b.position;dust(p.x,p.y,6);sparks(p.x,p.y,6,'#ffe27a');for(var k=0;k<4;k++)emit({k:'conf',x:p.x,y:p.y,vx:(rnd()-.5)*500,vy:-300-rnd()*500,m:1+rnd()*.6,c:['#8a5a2b','#c8a070','#6b4520','#e0c090'][k],s:6+rnd()*6,r:rnd()*6,vr:(rnd()-.5)*12});
  if(b.isStatic){Body.setStatic(b,false);Body.setDensity(b,.001);Body.setPosition(b,{x:p.x,y:p.y});Body.setAngle(b,b.angle||0)}b.collisionFilter={group:0,category:2,mask:0};Sleeping.set(b,false);
  var dx=(p.x-880)/400;Body.setVelocity(b,{x:dx*5+(rnd()-.5)*5,y:-9-rnd()*6});Body.setAngularVelocity(b,(rnd()-.5)*.35);b.gone=gt;flying.push(b)});
 debris=[];statics=statics.filter(function(b){return b.holeLedge});movers=[];FANL=[];
 EDF=[];PORT.forEach(function(q,k){if(q)EDF.push({o:q,vx:(q.x-880)/40+(rnd()-.5)*6,vy:-14-rnd()*6})});gems.forEach(function(q){EDF.push({o:q,vx:(rnd()-.5)*14,vy:-14-rnd()*8})});if(ring)EDF.push({o:ring,vx:(rnd()-.5)*12,vy:-16});
 shreds.forEach(function(s){for(var k=0;k<10;k++)emit({k:'str',x:s.x0+rnd()*(s.x1-s.x0),y:FLOOR-10,vx:(rnd()-.5)*500,vy:-400-rnd()*500,m:1.2,c:['#4fb6d6','#2f8fbf','#8fd6ea'][k%3]})});shreds=[]}
function edBlowStep(dt){for(var i=0;i<EDF.length;i++){var f=EDF[i];f.vy+=60*dt;f.o.x+=f.vx*dt*60;f.o.y+=f.vy*dt*60}}
function edBlowSkip(){if(state!=='edblow')return;Q.length=0;cq=null;EX.carry=null;EX.x=EXPARK;EX.tx=EXPARK-400;EX.ty=TOP-30;EX.ba=1.5;EX.on=false;EX.speed=1;try{engSnd(false)}catch(e){}$('skip').style.display='none';edBlowDone()}
function edBlowDone(){if(state!=='edblow')return;flying.forEach(function(f){Composite.remove(world,f)});flying=[];EDF=[];shk=0;state='edit';edBuild();showEd(true);placeTools();toast('Good as new! ✨');SFX.ok();rpReady()}
addEventListener('pointerdown',function(e){if(state==='edblow'){e.preventDefault();edBlowSkip()}},true);
$('edBlow').addEventListener('click',edBlowUp);
/* trampoline launch: deterministic, runs in the real game, the shot solver AND the helper mouse sim (separate listener, never gated) */
Events.on(engine,'collisionStart',function(ev){var ps=ev.pairs;for(var i=0;i<ps.length;i++){var A=ps[i].bodyA.parent,B=ps[i].bodyB.parent,t=A.kind==='tramp'&&A.toy?A:B.kind==='tramp'&&B.toy?B:null;if(!t)continue;
 var b=t===A?B:A;if(b.mat!=='ball'||b.position.y>t.position.y-10)continue;var v=b.velocity;if(v.y<2)continue;b.trN=(b.trN||0)+1;if(b.trN>3)continue;
 Body.setVelocity(b,{x:v.x,y:-Math.min(25,Math.max(17,v.y*1.15))})}});
/* v1.6.2 bouncy pad: the PUNCHY one. Restitution-style boost that scales with how hard the ball lands (x1.8, 20..30 up), first 3 hits per ball only,
   then plain rubber (re .85) so it can't bounce forever. Trampoline stays the soft steady one (x1.15, 17..25). Runs in game, solver and helper alike. */
var PAD={k:1.8,lo:20,hi:30,n:3,re:.85};
Events.on(engine,'collisionStart',function(ev){var ps=ev.pairs;for(var i=0;i<ps.length;i++){var A=ps[i].bodyA.parent,B=ps[i].bodyB.parent,t=A.kind==='pad'&&A.mat==='pad'?A:B.kind==='pad'&&B.mat==='pad'?B:null;if(!t)continue;
 var b=t===A?B:A;if(b.mat!=='ball'||b.position.y>t.position.y-12)continue;var v=b.velocity;if(v.y<1.5)continue;b.padN=(b.padN||0)+1;if(b.padN>PAD.n)continue;
 Body.setVelocity(b,{x:v.x*1.05,y:-Math.min(PAD.hi,Math.max(PAD.lo,v.y*PAD.k))})}});
function chickSquawk(big){if(!aok())return;try{var t0=AC.currentTime,segs=big?[[.0,.11,1],[.15,.11,1.1],[.3,.62,1.25]]:[[0,.1,1],[.14,.36,1.15]],f0=560+rnd()*120;
 segs.forEach(function(sg){var t=t0+sg[0],d=sg[1],f=f0*sg[2],o=AC.createOscillator(),l=AC.createOscillator(),lg=AC.createGain(),bp=AC.createBiquadFilter(),g=AC.createGain();
  o.type='sawtooth';o.frequency.setValueAtTime(f*.65,t);o.frequency.exponentialRampToValueAtTime(f*1.6,t+d*.3);o.frequency.exponentialRampToValueAtTime(f*.75,t+d);
  l.frequency.value=d>.3?24:40;lg.gain.value=f*.1;l.connect(lg);lg.connect(o.frequency);bp.type='bandpass';bp.frequency.value=1600;bp.Q.value=2.2;
  g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(.55,t+.012);g.gain.setValueAtTime(.5,t+d*.75);g.gain.exponentialRampToValueAtTime(.0001,t+d);
  o.connect(bp);bp.connect(g);g.connect(sfxBus);o.start(t);l.start(t);o.stop(t+d+.05);l.stop(t+d+.05)});
 noise(.05,{ft:'highpass',f:3000,vol:.18})}catch(e){}}
function burpSnd(){if(!aok())return;try{var t=AC.currentTime,d=.6,o=AC.createOscillator(),l=AC.createOscillator(),lg=AC.createGain(),lp=AC.createBiquadFilter(),g=AC.createGain();
 o.type='sawtooth';o.frequency.setValueAtTime(95,t);o.frequency.linearRampToValueAtTime(70,t+d);l.type='square';l.frequency.value=26;lg.gain.value=.35;l.connect(lg);lg.connect(g.gain);
 lp.type='lowpass';lp.frequency.value=650;lp.Q.value=6;g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(.5,t+.03);g.gain.setValueAtTime(.45,t+d*.7);g.gain.exponentialRampToValueAtTime(.0001,t+d);
 o.connect(lp);lp.connect(g);g.connect(sfxBus);o.start(t);l.start(t);o.stop(t+d+.05);l.stop(t+d+.05)}catch(e){}noise(.5,{ft:'lowpass',f:400,vol:.12})}
function honkSnd(){[0,.24].forEach(function(at){tone(330,.17,{type:'square',vol:.09,at:at,to:310});tone(415,.17,{type:'square',vol:.07,at:at,to:395});tone(250,.17,{type:'sawtooth',vol:.05,at:at})})}
function boingSnd(){if(!aok())return;try{var t=AC.currentTime,o=AC.createOscillator(),l=AC.createOscillator(),lg=AC.createGain(),g=AC.createGain();o.type='sine';o.frequency.setValueAtTime(150,t);o.frequency.exponentialRampToValueAtTime(520,t+.18);o.frequency.exponentialRampToValueAtTime(380,t+.5);
 l.frequency.value=18;lg.gain.value=40;l.connect(lg);lg.connect(o.frequency);g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(.3,t+.01);g.gain.exponentialRampToValueAtTime(.0001,t+.5);o.connect(g);g.connect(sfxBus);o.start(t);l.start(t);o.stop(t+.55);l.stop(t+.55)}catch(e){}}
function wheeSnd(){tone(420,.5,{to:1700,type:'sine',vol:.15});tone(840,.5,{to:3400,type:'sine',vol:.03})}
function silly(b,x,y,rv,snd){var k=b.kind,i;var S=function(f,a){if(snd)f(a)};
 if(k==='chick'){var big=rv>5||gt-(b.sqT||-9)>2;b.sqT=gt;S(chickSquawk,big);ftext(x,y-54,['BAWK!','BA-GAWK!','SQUAWK!!','BAWWWK!'][(rnd()*4)|0],'#fff27a');for(i=0;i<8;i++)emit({k:'sp',x:x,y:y-10,vx:(rnd()-.5)*300,vy:-120-rnd()*200,m:.45,c:i%2?'#ffd84a':'#ff6a3d',s:4})}
 else if(k==='tramp'){S(boingSnd);ftext(x,y-50,'BOING!','#9fd8ff')}
 else if(k==='banana'){S(function(){if(!playSample('banana',.95))wheeSnd()});ftext(x,y-36,'Wheee!','#fff27a')}
 else if(k==='frog'){S(burpSnd);ftext(x,y-60,'BURRRP!','#b6ff7a');for(i=0;i<6;i++)emit({k:'sp',x:x,y:y-4,vx:(rnd()-.5)*160,vy:-60-rnd()*120,m:.5,c:'#8fe86a',s:5})}
 else if(k==='fan'){}
 else if(k==='pad'){S(function(){playSample('boing',1,boingSnd)});ftext(x,y-60,'BOING!!','#ff5fb0');for(i=0;i<10;i++){var pa=-PI*(i+.5)/10;emit({k:'sp',x:x+Math.cos(pa)*60,y:y-30,vx:Math.cos(pa)*260,vy:Math.sin(pa)*300-80,m:.45,c:i%2?'#ff5fb0':'#ffe27a',s:6})}}
 else if(k==='horn'){S(honkSnd);ftext(x,y-52,'HONK HONK!','#ffb04a')}
 else if(k==='goat'){S(goatSnd);ftext(x+10,y-64,['AAAAAHHHH!','AAAHHHHHH!','AAAAAAHH!'][(rnd()*3)|0],'#fff')}
 else if(k==='duck'){S(duckSnd);ftext(x,y-50,['SQUEAK!','SQUEEEK!','Peep!'][(rnd()*3)|0],'#fff27a');for(i=0;i<6;i++)emit({k:'sp',x:x,y:y-8,vx:(rnd()-.5)*160,vy:-80-rnd()*140,m:.4,c:'#7ad8ff',s:4})}
 else if(k==='jello'){S(jelloSnd);ftext(x,y-48,'Bloop!','#ff6aa8');for(i=0;i<8;i++)emit({k:'sp',x:x+(rnd()-.5)*30,y:y-10,vx:(rnd()-.5)*140,vy:-40-rnd()*120,m:.45,c:i%2?'#ff6aa8':'#ffe27a',s:5})}
 else if(k==='spin'){S(spinSnd);ftext(x,y-56,'WHIRRR!','#7ad8ff');for(i=0;i<10;i++){var sa=i/10*2*PI;emit({k:'sp',x:x+Math.cos(sa)*20,y:y+Math.sin(sa)*20,vx:Math.cos(sa)*200,vy:Math.sin(sa)*200,m:.4,c:['#5ad0ff','#ff4fa0','#ffd21a'][i%3],s:4})}}
 else if(k==='glove'){S(function(){if(!playSample('glove',.95))powSnd()});ftext(x+(b.dir||1)*40,y-60,'POW!','#ff5a3a');for(i=0;i<8;i++)emit({k:'sp',x:x+(b.dir||1)*40,y:y,vx:(b.dir||1)*(80+rnd()*160),vy:-60-rnd()*140,m:.4,c:i%2?'#ffe27a':'#ff5a3a',s:6})}
 else if(k==='balloon'){S(popSnd);ftext(x,y-50,'POP!','#ffb3c7')}
 else if(k==='paste'){S(pasteSnd);ftext(x,y-70,'FOOOAM!!','#ff7ad9')}
 else if(k==='pin'){S(pinSnd);for(i=0;i<5;i++)emit({k:'sp',x:x,y:y-36,vx:(rnd()-.5)*80,vy:-40-rnd()*80,m:.4,c:['#ff3b4a','#ffd21a','#3b8aff'][i%3],s:3})}}
/* synthesized goat scream: buzzy voice, fast bleat wobble, 'ehh' vowel formants. No samples. */
function goatSnd(){if(!aok())return;try{var t=AC.currentTime,d=.95,f=330+rnd()*80,o=AC.createOscillator(),o2=AC.createOscillator(),vib=AC.createOscillator(),vg=AC.createGain(),trem=AC.createOscillator(),tg=AC.createGain(),g=AC.createGain(),out=AC.createGain();
 o.type='sawtooth';o2.type='square';[o,o2].forEach(function(x,i){var m=i?1.003:1;x.frequency.setValueAtTime(f*.8*m,t);x.frequency.linearRampToValueAtTime(f*1.35*m,t+.12);x.frequency.linearRampToValueAtTime(f*1.25*m,t+d*.7);x.frequency.linearRampToValueAtTime(f*.85*m,t+d)});
 vib.frequency.value=11;vg.gain.value=f*.07;vib.connect(vg);vg.connect(o.frequency);vg.connect(o2.frequency);trem.frequency.value=11;tg.gain.value=.22;trem.connect(tg);tg.connect(g.gain);
 g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(.4,t+.03);g.gain.setValueAtTime(.38,t+d*.75);g.gain.exponentialRampToValueAtTime(.0001,t+d);
 var o2g=AC.createGain();o2g.gain.value=.35;o.connect(g);o2.connect(o2g);o2g.connect(g);out.gain.value=.9;
 [[650,5,1],[1750,7,.7],[2600,9,.35]].forEach(function(fm){var bp=AC.createBiquadFilter(),bg=AC.createGain();bp.type='bandpass';bp.frequency.value=fm[0];bp.Q.value=fm[1];bg.gain.value=fm[2];g.connect(bp);bp.connect(bg);bg.connect(out)});
 out.connect(sfxBus);[o,o2,vib,trem].forEach(function(x){x.start(t);x.stop(t+d+.05)})}catch(e){}noise(.12,{ft:'bandpass',f:2200,q:1.5,vol:.12})}
function chickBlow(){var n=debris.filter(function(b){return b.kind==='chick'||b.kind==='duck'}).length;if(!n||SIM)return;if(debris.some(function(b){return b.kind==='chick'})){chickSquawk(true);ftext(900,TOP+120,'BAWWWK!!','#fff27a')}if(debris.some(function(b){return b.kind==='duck'})){duckSnd();ftext(1040,TOP+160,'SQUEAK!!','#fff27a')}}
/* sprites (drawn in code) */
defSpr('tramp',156,52,function(g){g.translate(78,26);g.strokeStyle='#3b3b46';g.lineWidth=5;g.lineCap='round';[[-60,-66],[60,66],[-22,-26],[22,26]].forEach(function(l){g.beginPath();g.moveTo(l[0],-6);g.lineTo(l[1],23);g.stroke()});
 g.fillStyle='#2a7de1';g.strokeStyle='#123a6e';g.lineWidth=3;g.beginPath();g.rect(-75,-16,150,12);g.fill();g.stroke();g.fillStyle='#ff4fa0';for(var x=-70;x<70;x+=20){g.fillRect(x,-15,9,10)}
 g.fillStyle='#14141c';g.beginPath();g.moveTo(-64,-17);g.quadraticCurveTo(0,-13,64,-17);g.lineTo(64,-21);g.quadraticCurveTo(0,-19,-64,-21);g.closePath();g.fill()});
defSpr('chick',156,72,function(g){g.translate(78,38);g.scale(1.3,1.3);var ol='#8a5a00';g.lineCap='round';g.lineJoin='round';
 g.strokeStyle='#ff8a1a';g.lineWidth=3;[[-30,-56],[-22,-50]].forEach(function(l){g.beginPath();g.moveTo(l[0],10);g.lineTo(l[1],20);g.stroke();g.beginPath();g.moveTo(l[1],20);g.lineTo(l[1]-6,16);g.moveTo(l[1],20);g.lineTo(l[1]-7,23);g.stroke()});
 g.strokeStyle=ol;g.lineWidth=13;g.beginPath();g.moveTo(22,0);g.quadraticCurveTo(38,-4,42,-16);g.stroke();g.strokeStyle='#ffd84a';g.lineWidth=8;g.stroke();
 g.fillStyle='#ffd84a';g.strokeStyle=ol;g.lineWidth=3;g.beginPath();g.ellipse(-6,4,36,15,0,0,2*PI);g.fill();g.stroke();
 g.beginPath();g.moveTo(-38,0);g.lineTo(-50,-8);g.lineTo(-44,6);g.closePath();g.fill();g.stroke();
 g.fillStyle='#f2b81c';g.beginPath();g.ellipse(-8,2,15,7,-.2,0,2*PI);g.fill();g.stroke();
 g.fillStyle='#e8342a';g.beginPath();g.arc(40,-28,4,0,2*PI);g.arc(45,-29,4.5,0,2*PI);g.arc(50,-27,4,0,2*PI);g.fill();
 g.fillStyle='#ffd84a';g.strokeStyle=ol;g.lineWidth=3;g.beginPath();g.arc(45,-19,9,0,2*PI);g.fill();g.stroke();
 g.fillStyle='#ff8a1a';g.beginPath();g.moveTo(52,-22);g.lineTo(60,-24);g.lineTo(53,-18);g.lineTo(60,-12);g.lineTo(51,-14);g.closePath();g.fill();g.lineWidth=1.5;g.stroke();
 g.fillStyle='#e8342a';g.beginPath();g.ellipse(50,-9,2.5,4,0,0,2*PI);g.fill();g.fillStyle='#fff';g.beginPath();g.arc(46,-21,3.4,0,2*PI);g.fill();g.fillStyle='#000';g.beginPath();g.arc(46.8,-21,1.8,0,2*PI);g.fill()});
defSpr('banana',84,30,function(g){g.translate(42,18);var ol='#7a5a00';g.lineWidth=2.5;g.strokeStyle=ol;g.lineJoin='round';
 [[-1,-36,2],[1,36,2],[0,8,-12]].forEach(function(f){g.fillStyle='#ffd21a';g.beginPath();g.moveTo(-8,6);g.quadraticCurveTo(f[1]*.5,f[2]-8,f[1],f[2]+(f[0]?4:0));g.quadraticCurveTo(f[1]*.6,f[2]+6,8,6);g.closePath();g.fill();g.stroke()});
 g.fillStyle='#fff6c8';g.beginPath();g.ellipse(0,4,10,6,0,0,2*PI);g.fill();g.stroke();g.fillStyle='#6b4a1a';g.fillRect(-3,7,6,5);g.fillStyle='#4a3010';[-30,30].forEach(function(x){g.beginPath();g.arc(x,3,2,0,2*PI);g.fill()})});
defSpr('frog',80,64,function(g){g.translate(40,34);var ol='#1f5212';g.lineWidth=3;g.strokeStyle=ol;
 g.fillStyle='#4fbf3a';g.beginPath();g.ellipse(-24,22,13,6,0,0,2*PI);g.ellipse(24,22,13,6,0,0,2*PI);g.fill();g.stroke();
 g.beginPath();g.ellipse(0,6,32,22,0,0,2*PI);g.fill();g.stroke();g.fillStyle='#bff28a';g.beginPath();g.ellipse(0,13,20,12,0,0,2*PI);g.fill();
 [-15,15].forEach(function(x){g.fillStyle='#4fbf3a';g.beginPath();g.arc(x,-16,11,0,2*PI);g.fill();g.stroke();g.fillStyle='#fff';g.beginPath();g.arc(x,-16,7,0,2*PI);g.fill();g.fillStyle='#000';g.beginPath();g.arc(x+1,-15,3.5,0,2*PI);g.fill()});
 g.strokeStyle=ol;g.lineWidth=2.5;g.beginPath();g.arc(0,0,14,.25*PI,.75*PI);g.stroke();g.fillStyle='#e8342a';g.beginPath();g.arc(-13,-3,1.5,0,2*PI);g.arc(13,-3,1.5,0,2*PI);g.fill()});
defSpr('horn',92,60,function(g){g.translate(46,32);var ol='#6b4a00';g.lineWidth=3;g.strokeStyle=ol;
 g.fillStyle='#ffc93a';g.beginPath();g.moveTo(-6,-5);g.lineTo(28,-20);g.quadraticCurveTo(44,0,28,20);g.lineTo(-6,5);g.closePath();g.fill();g.stroke();
 g.fillStyle='#fff3b0';g.beginPath();g.ellipse(32,0,6,18,0,0,2*PI);g.fill();g.stroke();g.fillStyle='#d9a21a';g.fillRect(-12,-6,8,12);g.strokeRect(-12,-6,8,12);
 g.fillStyle='#e8342a';g.strokeStyle='#7a120c';g.beginPath();g.ellipse(-26,0,16,19,0,0,2*PI);g.fill();g.stroke();g.fillStyle='rgba(255,255,255,.55)';g.beginPath();g.ellipse(-31,-7,5,7,-.4,0,2*PI);g.fill()});
defSpr('goatb',116,100,function(g){g.translate(54,48);g.scale(1.2,1.2);var ol='#5a5048';g.lineWidth=3;g.strokeStyle=ol;g.lineCap='round';
 g.strokeStyle=ol;g.lineWidth=6;[[-24,-22],[-12,-10],[10,8],[22,24]].forEach(function(l){g.beginPath();g.moveTo(l[0],12);g.lineTo(l[1],38);g.stroke()});g.strokeStyle='#2b2520';g.lineWidth=7;[[-22,38],[-10,38],[8,38],[24,38]].forEach(function(p){g.beginPath();g.moveTo(p[0]-2,p[1]);g.lineTo(p[0]+3,p[1]);g.stroke()});
 g.lineWidth=3;g.strokeStyle=ol;g.fillStyle='#f4f1ea';g.beginPath();g.ellipse(-2,4,32,18,0,0,2*PI);g.fill();g.stroke();g.fillStyle='#d9d2c4';g.beginPath();g.ellipse(-10,8,10,7,0,0,2*PI);g.fill();
 g.fillStyle='#f4f1ea';g.beginPath();g.moveTo(-32,-2);g.lineTo(-40,-12);g.lineTo(-30,-6);g.closePath();g.fill();g.stroke()});
defSpr('goath',116,100,function(g){g.translate(54,48);g.scale(1.2,1.2);var ol='#5a5048';g.lineWidth=3;g.strokeStyle=ol;g.lineJoin='round';
 g.fillStyle='#f4f1ea';g.beginPath();g.moveTo(14,-4);g.lineTo(22,-20);g.lineTo(30,-12);g.lineTo(26,2);g.closePath();g.fill();g.stroke();
 g.strokeStyle='#8a7a5a';g.lineWidth=5;g.lineCap='round';g.beginPath();g.moveTo(24,-30);g.quadraticCurveTo(14,-44,6,-36);g.stroke();g.beginPath();g.moveTo(30,-30);g.quadraticCurveTo(26,-46,16,-42);g.stroke();
 g.strokeStyle=ol;g.lineWidth=3;g.fillStyle='#f4f1ea';g.beginPath();g.ellipse(32,-20,14,11,.35,0,2*PI);g.fill();g.stroke();
 g.beginPath();g.ellipse(18,-26,9,4,-.5,0,2*PI);g.fill();g.stroke();
 g.fillStyle='#d9d2c4';g.beginPath();g.ellipse(40,-14,8,6,.35,0,2*PI);g.fill();
 g.fillStyle='#e8d36a';g.beginPath();g.arc(30,-24,4.2,0,2*PI);g.fill();g.stroke();g.fillStyle='#000';g.fillRect(27.5,-25,5,2);
 g.fillStyle='#b8ae9c';g.beginPath();g.moveTo(34,-8);g.lineTo(40,4);g.lineTo(30,-4);g.closePath();g.fill()});
/* v1.6.1: bouncy pad = solid hot-pink rubber on springs; bubble wrap = see-through shimmery bubbles */
defSpr('pad',164,84,function(g){g.translate(82,42);g.lineJoin='round';
 g.fillStyle='#4a4f5a';g.strokeStyle='#22252c';g.lineWidth=3;g.beginPath();g.rect(-78,24,156,15);g.fill();g.stroke();
 g.strokeStyle='#c9ced8';g.lineWidth=4;[-50,0,50].forEach(function(x){g.beginPath();g.moveTo(x,24);for(var i=1;i<=6;i++)g.lineTo(x+(i%2?-11:11),24-i*4.5);g.stroke()});
 var gr=g.createLinearGradient(0,-40,0,-2);gr.addColorStop(0,'#ff6fa3');gr.addColorStop(1,'#e0105a');g.fillStyle=gr;g.strokeStyle='#7a0a32';g.lineWidth=3.5;
 g.beginPath();g.moveTo(-70,-40);g.lineTo(70,-40);g.quadraticCurveTo(80,-40,80,-30);g.lineTo(80,-10);g.quadraticCurveTo(80,0,70,0);g.lineTo(-70,0);g.quadraticCurveTo(-80,0,-80,-10);g.lineTo(-80,-30);g.quadraticCurveTo(-80,-40,-70,-40);g.closePath();g.fill();g.stroke();
 g.fillStyle='rgba(255,255,255,.45)';g.beginPath();g.ellipse(-30,-32,40,4,0,0,2*PI);g.fill();
 g.font='bold 26px '+MK;g.textAlign='center';g.lineWidth=5;g.strokeStyle='#7a0a32';g.strokeText('BOING!',0,-11);g.fillStyle='#ffe23a';g.fillText('BOING!',0,-11)});
function drawBubbleSheet(g,x0,y0,w,h,pops){var gr=g.createLinearGradient(x0,y0,x0+w,y0+h);gr.addColorStop(0,'rgba(170,230,255,.42)');gr.addColorStop(.5,'rgba(235,200,255,.30)');gr.addColorStop(1,'rgba(180,255,230,.40)');
 g.fillStyle=gr;g.strokeStyle='rgba(255,255,255,.95)';g.lineWidth=2;g.beginPath();g.rect(x0+1,y0+1,w-2,h-2);g.fill();g.stroke();
 for(var ix=0;ix*20+10<=w-6;ix++)for(var iy=0;iy*20+10<=h-6;iy++){var x=x0+ix*20+10+((iy&1)?5:0),y=y0+iy*20+10;if(x>x0+w-6)continue;
  if(pops&&pops.indexOf(ix+','+iy)>=0){g.strokeStyle='rgba(255,255,255,.75)';g.lineWidth=1.2;g.beginPath();g.moveTo(x-6,y);g.lineTo(x-2,y-3);g.lineTo(x+2,y+2);g.lineTo(x+6,y-1);g.stroke();continue}
  var bg=g.createRadialGradient(x-2.5,y-2.5,1,x,y,8);bg.addColorStop(0,'rgba(255,255,255,.75)');bg.addColorStop(.6,'rgba(200,235,255,.18)');bg.addColorStop(1,'rgba(150,120,255,.35)');
  g.fillStyle=bg;g.beginPath();g.arc(x,y,7.5,0,2*PI);g.fill();g.strokeStyle=['rgba(120,210,255,.95)','rgba(255,150,230,.95)','rgba(140,255,200,.95)'][(ix+iy)%3];g.lineWidth=1.3;g.stroke();
  g.fillStyle='#fff';g.beginPath();g.ellipse(x-3,y-3.2,2.4,1.5,-.6,0,2*PI);g.fill()}
 g.fillStyle='rgba(255,255,255,.35)';g.beginPath();g.moveTo(x0+4,y0+3);g.lineTo(x0+w*.45,y0+3);g.lineTo(x0+w*.3,y0+h*.35);g.lineTo(x0+4,y0+h*.35);g.closePath();g.fill()}
function shimmer(g,w,h){var x=((gt*90)%(w+h*2+60))-h-30;g.save();g.beginPath();g.rect(-w/2,-h/2,w,h);g.clip();g.fillStyle='rgba(255,255,255,.28)';g.beginPath();g.moveTo(-w/2+x,-h/2);g.lineTo(-w/2+x+16,-h/2);g.lineTo(-w/2+x+16-h*.6,h/2);g.lineTo(-w/2+x-h*.6,h/2);g.closePath();g.fill();g.restore()}
/* ===== v1.6.1 leaf blower: gentle push on the ball inside the cone; pure geometry, runs in the game, the shot solver and the helper sim ===== */
/* v1.6.2: much stronger blower. Peak push FAN_F px/step (was .11 over 340px, linear); fades as (1-d/L)^1.5 so it's strongest up close. Upward lift is capped below gravity so the ball can never hover forever. */
var FANL=[],FAN_L=420,FAN_F=.52,FAN_UP=.13;
function fanStep(b,sim){if(!FANL.length||!b)return;var p=b.position,ax=0,ay=0;
 for(var i=0;i<FANL.length;i++){var f=FANL[i],c=Math.cos(f.angle),s=Math.sin(f.angle),dx=p.x-f.position.x,dy=p.y-f.position.y,al=dx*c+dy*s;if(al<24||al>FAN_L)continue;
  var pp=Math.abs(-dx*s+dy*c);if(pp>22+al*.42)continue;var k=FAN_F*Math.pow(1-al/FAN_L,1.5)*(1-.45*pp/(22+al*.42));ax+=c*k;ay+=s*k;
  if(!sim&&gt-(f.wT||-9)>.7){f.wT=gt;f.hitT=gt;if(toySndOk()&&!playSample('blower',.55))noise(.45,{ft:'bandpass',f:900,fto:500,q:.6,vol:.12,att:.08})}}
 if(ax||ay){Sleeping.set(b,false);if(ay<-FAN_UP)ay=-FAN_UP;Body.setVelocity(b,{x:b.velocity.x+ax,y:b.velocity.y+ay})}}
function drawFans(g,t){for(var i=0;i<FANL.length;i++){var f=FANL[i];g.save();g.translate(f.position.x,f.position.y);g.rotate(f.angle);g.lineCap='round';
 var cg=g.createLinearGradient(30,0,FAN_L,0);cg.addColorStop(0,'rgba(220,240,255,.32)');cg.addColorStop(1,'rgba(220,240,255,0)');g.fillStyle=cg;g.beginPath();g.moveTo(30,-20);g.lineTo(FAN_L,-(22+FAN_L*.42));g.lineTo(FAN_L,22+FAN_L*.42);g.lineTo(30,20);g.closePath();g.fill();
 for(var j=0;j<20;j++){var ph=(t*1.3+j*.379)%1,x=34+ph*(FAN_L-40),sp=((j*53)%9-4)/4,y=sp*(14+x*.36),al=.95*Math.pow(1-ph,1.2)*Math.min(1,ph*6);
  if(j%3===1){g.save();g.translate(x,y+Math.sin(t*6+j)*6);g.rotate(t*5+j);g.globalAlpha=Math.min(1,al*2);g.fillStyle=j%8===1?'#6cc644':'#f08a24';g.beginPath();g.ellipse(0,0,7,3.5,0,0,2*PI);g.fill();g.strokeStyle='rgba(60,40,10,.6)';g.lineWidth=1;g.beginPath();g.moveTo(-6,0);g.lineTo(6,0);g.stroke();g.restore()}
  else{g.globalAlpha=al;g.strokeStyle='#ffffff';g.lineWidth=2+5*(1-ph);g.beginPath();g.moveTo(x,y);g.quadraticCurveTo(x+14,y+Math.sin(t*8+j)*3,x+30,y);g.stroke()}}
 g.globalAlpha=1;g.restore()}}
defSpr('fan',72,64,function(g){g.translate(36,32);var ol='#1f2a36';g.lineWidth=3;g.strokeStyle=ol;g.lineJoin='round';
 g.fillStyle='#e8762a';g.beginPath();g.moveTo(14,-14);g.lineTo(34,-10);g.lineTo(34,10);g.lineTo(14,14);g.closePath();g.fill();g.stroke();
 g.fillStyle='#ffb347';g.fillRect(28,-9,5,18);
 g.fillStyle='#3a8fd6';g.beginPath();g.arc(-8,-2,24,0,2*PI);g.fill();g.stroke();g.fillStyle='#1d4f7a';g.beginPath();g.arc(-8,-2,18,0,2*PI);g.fill();
 g.fillStyle='#596673';g.fillRect(-20,20,24,8);g.strokeRect(-20,20,24,8);
 g.strokeStyle='rgba(255,255,255,.35)';g.lineWidth=1.5;for(var r=6;r<=18;r+=6){g.beginPath();g.arc(-8,-2,r,0,2*PI);g.stroke()}});

/* ===== v1.6.7: Replay my shot. Records a lightweight pose clip (capped ~15s) and plays it back at 0.35x. Optional; never blocks Next / Play again. ===== */

/* ===== v1.7.0 new builder toys: spinner, pinwheel, jello, glove, balloon, duck, elephant toothpaste ===== */
var FOAM=[];
function foamClear(){(FOAM||[]).forEach(function(b){Composite.remove(world,b)});FOAM=[]}
function duckSnd(){if(!aok())return;tone(720,.09,{to:420,type:'square',vol:.09});tone(980,.12,{to:520,type:'sine',vol:.06,at:.04});noise(.06,{ft:'bandpass',f:1800,q:2,vol:.08})}
function jelloSnd(){if(!aok())return;noise(.18,{ft:'lowpass',f:700,fto:180,q:2,vol:.22});tone(180,.2,{to:90,type:'sine',vol:.08})}
function spinSnd(){if(!aok())return;tone(280,.22,{to:820,type:'sawtooth',vol:.07});tone(560,.18,{to:1600,type:'triangle',vol:.04,at:.02});noise(.1,{ft:'highpass',f:2000,vol:.05})}
function powSnd(){if(!aok())return;noise(.08,{ft:'lowpass',f:400,vol:.28});tone(140,.16,{to:70,type:'square',vol:.12});tone(420,.1,{type:'sine',vol:.05})}
function popSnd(){if(!aok())return;noise(.08,{ft:'highpass',f:1800,vol:.2});tone(520,.1,{to:180,type:'sine',vol:.1})}
function pasteSnd(){if(!aok())return;noise(.55,{ft:'bandpass',f:900,fto:400,q:.7,vol:.2,att:.02});noise(.7,{ft:'lowpass',f:500,fto:120,vol:.14,att:.05});tone(90,.6,{to:50,type:'sawtooth',vol:.06})}
function pinSnd(){if(!aok())return;tone(640,.2,{to:880,type:'sine',vol:.04});tone(860,.16,{to:1100,type:'triangle',vol:.03,at:.04})}
function drawFidget(g,cap){var ol='#1a2030',R=25,r=17.4,i,p,a;
 if(!cap){var cg;if(g.createConicGradient){cg=g.createConicGradient(-PI/2,0,0);cg.addColorStop(0,'#5ad0ff');cg.addColorStop(.18,'#7d5cff');cg.addColorStop(.36,'#ff4fa0');cg.addColorStop(.54,'#ffd21a');cg.addColorStop(.72,'#3bff8a');cg.addColorStop(.9,'#5ad0ff');cg.addColorStop(1,'#5ad0ff')}else{cg=g.createLinearGradient(-40,-40,40,40);cg.addColorStop(0,'#5ad0ff');cg.addColorStop(.5,'#ff4fa0');cg.addColorStop(1,'#ffd21a')}
  g.fillStyle=cg;g.beginPath();g.arc(0,0,18,0,2*PI);g.fill();
  for(i=0;i<3;i++){a=-PI/2+i*2*PI/3;g.beginPath();g.arc(Math.cos(a)*R,Math.sin(a)*R,r,0,2*PI);g.fill()}
  g.strokeStyle=ol;g.lineWidth=3;g.lineJoin='round';g.beginPath();g.arc(0,0,18,0,2*PI);g.stroke();
  for(i=0;i<3;i++){a=-PI/2+i*2*PI/3;g.beginPath();g.arc(Math.cos(a)*R,Math.sin(a)*R,r,0,2*PI);g.stroke()}
  g.fillStyle='rgba(255,255,255,.38)';g.beginPath();g.ellipse(-8,-10,8,4,-.5,0,2*PI);g.fill();
  for(i=0;i<3;i++){a=-PI/2+i*2*PI/3;p={x:Math.cos(a)*R,y:Math.sin(a)*R};
   var rg=g.createRadialGradient(p.x-3,p.y-3,1.5,p.x,p.y,10);rg.addColorStop(0,'#f7fbff');rg.addColorStop(.4,'#c5ced8');rg.addColorStop(.75,'#8e99a8');rg.addColorStop(1,'#4e5866');
   g.fillStyle=rg;g.strokeStyle='#2a3340';g.lineWidth=2;g.beginPath();g.arc(p.x,p.y,9.6,0,2*PI);g.fill();g.stroke();
   g.fillStyle='#2a3340';g.beginPath();g.arc(p.x,p.y,4.1,0,2*PI);g.fill();
   g.strokeStyle='rgba(255,255,255,.4)';g.lineWidth=1.2;g.beginPath();g.arc(p.x,p.y,4.1,0,2*PI);g.stroke()}
  return}
 var capg=g.createRadialGradient(-3,-4,1,0,0,12);capg.addColorStop(0,'#ffffff');capg.addColorStop(.3,'#e8edf3');capg.addColorStop(.7,'#9aa6b4');capg.addColorStop(1,'#5c6774');
 g.fillStyle=capg;g.strokeStyle='#2a3340';g.lineWidth=2.2;g.beginPath();g.arc(0,0,11,0,2*PI);g.fill();g.stroke();
 g.beginPath();g.arc(0,0,6.4,0,2*PI);g.stroke();
 g.strokeStyle='#4a5562';g.lineWidth=1.6;g.beginPath();g.moveTo(-3.2,0);g.lineTo(3.2,0);g.stroke()}
function drawPinVaness(g,hit){var cols=[['#ff3b4a','#ff8a9a'],['#ffd21a','#fff0a0'],['#3b8aff','#9cc8ff'],['#3bff8a','#b6ffd0'],['#ff7a1a','#ffc08a'],['#c77dff','#e8c4ff']];
 for(var pi=0;pi<6;pi++){g.save();g.rotate(pi*PI/3);var gr=g.createLinearGradient(0,0,0,-38);gr.addColorStop(0,cols[pi][1]);gr.addColorStop(1,cols[pi][0]);
  g.fillStyle=gr;g.strokeStyle='#3a1d00';g.lineWidth=1.8;g.beginPath();g.moveTo(0,0);g.quadraticCurveTo(18,-6,2,-40);g.quadraticCurveTo(-16,-8,0,0);g.closePath();g.fill();g.stroke();
  g.fillStyle='rgba(255,255,255,.45)';g.beginPath();g.moveTo(1,-6);g.quadraticCurveTo(8,-12,2,-28);g.quadraticCurveTo(0,-16,1,-6);g.fill();g.restore()}
 g.fillStyle='#fff6a0';g.strokeStyle='#3a1d00';g.lineWidth=2;g.beginPath();g.arc(0,0,7.5,0,2*PI);g.fill();g.stroke();
 g.fillStyle='#ffd21a';g.beginPath();g.arc(0,0,3.2,0,2*PI);g.fill();if(hit>.2){g.strokeStyle='rgba(255,255,255,.5)';g.lineWidth=2;g.beginPath();g.arc(0,0,11+6*hit,0,2*PI);g.stroke()}}
function drawPasteColumn(g,b){var u=gt-b.erupt;if(!b.erupt||u>2.5)return;
 var cols=['#ff5aad','#7af0ff','#ffe27a'],rise=clamp(u/.45,0,1),billow=u<.45?0:clamp((u-.45)/.5,0,1),slump=u<1?0:clamp((u-1)/.85,0,1),fade=u<1.8?1:clamp(1-(u-1.8)/.7,0,1);
 var h=50+rise*220*(1-slump*.55)+billow*24,spread=10+billow*20+slump*78,n=13,i,t,y,w,hh,c;
 g.save();g.translate(0,-b.sh/2+10);g.globalAlpha=fade;
 for(i=0;i<n;i++){t=i/(n-1);if(t*h<12)continue;y=-t*h+slump*t*t*90;w=(12+t*spread)*(1+.14*Math.sin(gt*7+i*1.2))+slump*(1-t)*42;hh=16+t*12;y+=slump*(1-t)*22;
  g.save();g.translate(Math.sin(gt*2.8+i)*7*(.25+billow),y);g.rotate(Math.sin(gt*2+i)*.18);
  c=cols[i%3];var rg=g.createRadialGradient(-w*.2,-hh*.3,2,0,0,w);rg.addColorStop(0,'rgba(255,255,255,.9)');rg.addColorStop(.35,c);rg.addColorStop(1,c);
  g.fillStyle=rg;g.beginPath();g.ellipse(0,0,w,hh,0,0,2*PI);g.fill();
  g.save();g.beginPath();g.ellipse(0,0,w,hh,0,0,2*PI);g.clip();
  g.strokeStyle=cols[(i+1)%3];g.lineWidth=3.2;g.globalAlpha=fade*.7;
  for(var s2=-2;s2<=2;s2++){g.beginPath();g.moveTo(-w,s2*6);g.bezierCurveTo(-w/3,s2*6+8+Math.sin(gt*4+i)*3,w/3,s2*6-8,w,s2*6);g.stroke()}
  g.restore();g.fillStyle='rgba(255,255,255,.45)';g.beginPath();g.ellipse(-w*.28,-hh*.3,w*.28,hh*.22,0,0,2*PI);g.fill();g.restore()}
 g.restore()}
defSpr('spin',96,96,function(g){g.translate(48,48);drawFidget(g,false);drawFidget(g,true)});
defSpr('pin',70,120,function(g){g.translate(35,96);var wd=g.createLinearGradient(-6,0,6,0);wd.addColorStop(0,'#6b3a12');wd.addColorStop(.35,'#d4a056');wd.addColorStop(.7,'#8a5a20');wd.addColorStop(1,'#4a2a10');
 g.fillStyle=wd;g.strokeStyle='#3a2414';g.lineWidth=3;g.beginPath();g.roundRect?g.roundRect(-5,-72,10,80,4):g.rect(-5,-72,10,80);g.fill();g.stroke();
 g.fillStyle='rgba(255,230,180,.4)';g.fillRect(-3,-68,2.2,70);
 g.fillStyle='#6b4520';g.beginPath();g.moveTo(-9,8);g.lineTo(9,8);g.lineTo(0,24);g.closePath();g.fill();g.stroke();
 g.fillStyle='#3a2414';g.beginPath();g.arc(0,-72,4,0,2*PI);g.fill()});
defSpr('jello',112,80,function(g){g.translate(56,56);drawJello(g,{sw:112,sh:80,hitT:-9,nearW:0,sink:0,position:{x:0,y:0}})});
function jelloShape(t,i,n,nw){var u=t>0?clamp(t/1.2,0,1):0,amp=u&&u<1?(u<.12?u/.12:Math.pow(1-u,1.15)):0;nw=(nw||0)*.12;
 var sq=amp*(u<.12?1:.7),sx=1+.46*Math.sin(u*PI*7)*sq+nw*Math.sin((gt||0)*8),sy=1-.4*Math.sin(u*PI*7)*sq-nw*Math.sin((gt||0)*8)*.7,sh=amp*.2*Math.sin(u*PI*5.5)+nw*.08*Math.sin((gt||0)*7);
 var a=-PI+i/n*PI, w=Math.sin(i*2.1+(gt||0)*14)*amp*7+Math.sin(i*1.3+(gt||0)*9)*amp*4;
 return {sx:sx,sy:sy,sh:sh,ox:Math.cos(a)*w,oy:Math.sin(a)*w*.55}}
function drawJello(g,b){var W=b.sw||112,H=b.sh||80,t=b.hitT?gt-b.hitT:-1,nw=b.nearW||0,j=jelloShape(t,0,16,nw),n=18,i,pts=[];
 g.save();g.translate(0,H/2);
 /* plate sits under the dome, only the rim peeks out */
 g.fillStyle='rgba(0,0,0,.16)';g.beginPath();g.ellipse(0,2,50,7,0,0,2*PI);g.fill();
 var pl=g.createLinearGradient(0,-6,0,8);pl.addColorStop(0,'#f7f3ee');pl.addColorStop(.6,'#d4ccc2');pl.addColorStop(1,'#8e857c');
 g.fillStyle=pl;g.strokeStyle='#4a443e';g.lineWidth=2.2;g.beginPath();g.ellipse(0,0,52,8,0,0,2*PI);g.fill();g.stroke();
 g.beginPath();g.ellipse(0,-3,40,4.5,0,0,2*PI);g.strokeStyle='rgba(255,255,255,.4)';g.lineWidth=1.5;g.stroke();
 /* jiggly dome anchored on the plate */
 g.save();g.transform(j.sx,j.sh,0,j.sy,0,0);
 for(i=0;i<=n;i++){var a=PI-i/n*PI,st=jelloShape(t,i,n,nw),rx=50*Math.cos(a)+st.ox,ry=-50*Math.sin(a)+st.oy;pts.push({x:rx,y:ry-2})}
 g.beginPath();g.moveTo(pts[0].x,2);for(i=0;i<pts.length;i++)g.lineTo(pts[i].x,pts[i].y);g.lineTo(pts[pts.length-1].x,2);g.quadraticCurveTo(0,10,pts[0].x,2);g.closePath();
 var gr=g.createLinearGradient(0,-52,0,8);gr.addColorStop(0,'rgba(255,220,230,.62)');gr.addColorStop(.2,'rgba(255,110,150,.4)');gr.addColorStop(.55,'rgba(214,24,74,.5)');gr.addColorStop(1,'rgba(110,0,32,.78)');
 g.fillStyle=gr;g.strokeStyle='#6b0020';g.lineWidth=3;g.fill();g.stroke();
 g.save();g.clip();
 g.fillStyle='rgba(255,255,255,.5)';g.beginPath();g.ellipse(-14,-28,15,9,-.4,0,2*PI);g.fill();
 g.fillStyle='rgba(255,255,255,.16)';g.beginPath();g.ellipse(16,-8,7,13,.35,0,2*PI);g.fill();
 var ballB=typeof ball!=='undefined'?ball:null;
 if(ballB&&b.position){var dx=ballB.position.x-b.position.x,dy=ballB.position.y-(b.position.y-(b.ofs?b.ofs.y:0)),inJ=(dx*dx)/(50*j.sx*50*j.sx)+(dy*dy)/(42*j.sy*42*j.sy)<1.15;
  if(inJ||(b.sink&&gt-b.sink<1)){g.globalAlpha=.5;g.fillStyle='rgba(40,0,18,.6)';g.beginPath();g.arc(dx/j.sx,(dy+8)/j.sy,BR+2,0,2*PI);g.fill();
   g.globalAlpha=.3;g.fillStyle='#fff';g.beginPath();g.arc(dx/j.sx-6,(dy+8)/j.sy-6,5,0,2*PI);g.fill();g.globalAlpha=1}}
 g.restore();
 g.strokeStyle='rgba(255,230,240,.4)';g.lineWidth=2;g.beginPath();g.ellipse(0,-10,34,7,0,1.1*PI,1.9*PI);g.stroke();
 g.restore();g.restore()}
function jelloForce(t,o){if(!o||o.isStatic)return;var u=gt-t.sink,v=o.velocity,dx=o.position.x-t.position.x,dy=o.position.y-(t.position.y-(t.ofs?t.ofs.y:0)),d=Math.max(1,Math.hypot(dx,dy));
 Sleeping.set(o,false);
 if(u<.2&&!t.blooped){Body.setVelocity(o,{x:v.x*.8-dx/d*.2,y:v.y*.58+.45})}
 else if(!t.blooped){t.blooped=1;Body.setVelocity(o,{x:v.x*.42+(dx/d)*3.6,y:v.y*.32+(dy/d)*2.6-2.4})}
 if(u>1.25)t.sink=0}
function jelloStep(t,sim){var near=0,list=[ball].concat(debris,XB||[]).filter(Boolean),i,o,dx,dy,d,spd,inx,iny,inside;
 for(i=0;i<list.length;i++){o=list[i];if(!o||o===t||o.isStatic)continue;
  dx=o.position.x-t.position.x;dy=o.position.y-(t.position.y-(t.ofs?t.ofs.y:0));d=Math.hypot(dx,dy);
  spd=Math.hypot(o.velocity.x,o.velocity.y);if(d<170&&spd>.45)near=Math.max(near,Math.min(1,spd/8)*(1-d/170));
  inx=t.sw*.5;iny=t.sh*.48;inside=(dx*dx)/(inx*inx)+(dy*dy)/(iny*iny)<1.2&&dy>-t.sh*.15;
  if(o.mat==='ball'&&inside){if(!t.sink){t.sink=gt;t.blooped=0;t.hitT=gt}if(t.sink)jelloForce(t,o)}}
 t.nearW=(t.nearW||0)*.86+near*.14}

defSpr('glove',110,70,function(g){g.translate(55,35);g.lineJoin='round';g.lineCap='round';
 g.fillStyle='rgba(0,0,0,.16)';g.beginPath();g.ellipse(4,28,40,6,0,0,2*PI);g.fill();
 g.strokeStyle='#5a3810';g.lineWidth=4.5;g.beginPath();g.moveTo(-48,8);for(var i=0;i<7;i++){var x=-48+i*6.2,y=(i%2?-11:9);g.lineTo(x,y)}g.lineTo(-8,8);g.stroke();
 g.strokeStyle='#d4a056';g.lineWidth=2;g.beginPath();g.moveTo(-46,8);for(i=0;i<7;i++){x=-46+i*6.2;y=(i%2?-9:7);g.lineTo(x,y)}g.stroke();
 var wr=g.createLinearGradient(-10,-16,10,16);wr.addColorStop(0,'#e08a40');wr.addColorStop(.5,'#c45a22');wr.addColorStop(1,'#8a3010');
 g.fillStyle=wr;g.strokeStyle='#6b2410';g.lineWidth=3;g.beginPath();g.moveTo(-12,18);g.lineTo(-12,-18);g.lineTo(10,-18);g.lineTo(10,18);g.closePath();g.fill();g.stroke();
 var gl=g.createRadialGradient(16,-8,4,28,0,36);gl.addColorStop(0,'#ff6a4a');gl.addColorStop(.55,'#e8342a');gl.addColorStop(1,'#9a1410');
 g.fillStyle=gl;g.strokeStyle='#7a120c';g.beginPath();g.moveTo(8,-20);g.quadraticCurveTo(58,-30,62,0);g.quadraticCurveTo(58,30,8,20);g.closePath();g.fill();g.stroke();
 g.fillStyle='#c42020';g.beginPath();g.ellipse(30,14,16,8,0,0,2*PI);g.fill();g.stroke();
 g.fillStyle='rgba(255,255,255,.4)';g.beginPath();g.ellipse(22,-9,11,7,-.3,0,2*PI);g.fill()});
defSpr('balloon',58,96,function(g){g.translate(29,34);
 g.strokeStyle='#6b4520';g.lineWidth=2.2;g.beginPath();g.moveTo(0,28);g.quadraticCurveTo(10,46,0,62);g.quadraticCurveTo(-6,70,-2,78);g.stroke();
 g.fillStyle='#6b4520';g.beginPath();g.arc(-2,78,2.2,0,2*PI);g.fill();
 var gr=g.createRadialGradient(-8,-10,3,2,6,28);gr.addColorStop(0,'#ffe0f0');gr.addColorStop(.4,'#ff7ab8');gr.addColorStop(1,'#e01070');
 g.fillStyle=gr;g.strokeStyle='#8a1450';g.lineWidth=3;g.beginPath();g.ellipse(0,0,23,27,0,0,2*PI);g.fill();g.stroke();
 g.fillStyle='#c01060';g.beginPath();g.moveTo(-6,25);g.lineTo(0,34);g.lineTo(6,25);g.closePath();g.fill();g.stroke();
 g.fillStyle='rgba(255,255,255,.7)';g.beginPath();g.ellipse(-8,-9,7,10,-.35,0,2*PI);g.fill();
 g.fillStyle='rgba(255,255,255,.35)';g.beginPath();g.ellipse(8,6,4,6,.4,0,2*PI);g.fill()});
defSpr('duck',84,72,function(g){g.translate(42,42);var ol='#c47a00';g.lineJoin='round';g.lineCap='round';g.lineWidth=3;g.strokeStyle=ol;
 g.fillStyle='rgba(40,20,0,.18)';g.beginPath();g.ellipse(-2,24,26,6,0,0,2*PI);g.fill();
 g.fillStyle='#ffd21a';g.beginPath();g.moveTo(-26,2);g.quadraticCurveTo(-40,-4,-34,-18);g.quadraticCurveTo(-26,-8,-16,-2);g.closePath();g.fill();g.stroke();
 var bg=g.createRadialGradient(-8,-6,6,0,6,32);bg.addColorStop(0,'#fff4a8');bg.addColorStop(.5,'#ffd21a');bg.addColorStop(1,'#f0a800');
 g.fillStyle=bg;g.beginPath();g.ellipse(-4,6,28,20,0,0,2*PI);g.fill();g.stroke();
 g.fillStyle='#f0b400';g.beginPath();g.ellipse(-6,8,13,8,-.2,0,2*PI);g.fill();g.stroke();
 var hg=g.createRadialGradient(16,-16,3,22,-10,16);hg.addColorStop(0,'#fff6b0');hg.addColorStop(1,'#ffd21a');
 g.fillStyle=hg;g.beginPath();g.arc(22,-10,15,0,2*PI);g.fill();g.stroke();
 var bill=g.createLinearGradient(32,-12,54,-6);bill.addColorStop(0,'#ffb02a');bill.addColorStop(1,'#ff6a00');
 g.fillStyle=bill;g.strokeStyle='#c45000';g.beginPath();g.moveTo(32,-11);g.quadraticCurveTo(56,-16,56,-8);g.quadraticCurveTo(56,-1,32,-4);g.closePath();g.fill();g.stroke();
 g.beginPath();g.moveTo(34,-7.5);g.lineTo(52,-8);g.stroke();
 g.fillStyle='#fff';g.beginPath();g.arc(24,-14,5,0,2*PI);g.fill();
 g.fillStyle='#1a1208';g.beginPath();g.arc(25.2,-14,2.6,0,2*PI);g.fill();
 g.fillStyle='#fff';g.beginPath();g.arc(24.2,-15.3,1.15,0,2*PI);g.fill();
 g.fillStyle='rgba(255,255,255,.55)';g.beginPath();g.ellipse(-14,-2,11,6,-.4,0,2*PI);g.fill()});
defSpr('paste',56,108,function(g){g.translate(28,56);var ol='#1a3a5a';g.lineJoin='round';g.lineWidth=3;g.strokeStyle=ol;
 g.fillStyle='rgba(0,0,0,.16)';g.beginPath();g.ellipse(0,50,18,5,0,0,2*PI);g.fill();
 /* Erlenmeyer flask, colorful liquid, no label */
 g.fillStyle='#d8e6f2';g.beginPath();g.moveTo(-8,-50);g.lineTo(8,-50);g.lineTo(8,-22);g.lineTo(22,42);g.quadraticCurveTo(0,54,-22,42);g.lineTo(-8,-22);g.closePath();g.fill();g.stroke();
 g.save();g.beginPath();g.moveTo(-8,-22);g.lineTo(8,-22);g.lineTo(22,42);g.quadraticCurveTo(0,54,-22,42);g.closePath();g.clip();
 var liq=g.createLinearGradient(0,-10,0,50);liq.addColorStop(0,'#ff7ad9');liq.addColorStop(.45,'#c77dff');liq.addColorStop(1,'#5ad0ff');
 g.fillStyle=liq;g.fillRect(-24,-6,48,64);
 g.fillStyle='rgba(255,255,255,.25)';g.beginPath();g.ellipse(-6,10,10,5,0,0,2*PI);g.fill();
 ['#ffe27a','#ff5aad','#7af0ff'].forEach(function(c,i){g.fillStyle=c;g.globalAlpha=.7;g.beginPath();g.arc(-8+i*8,18+i*4,3.5,0,2*PI);g.fill()});g.globalAlpha=1;g.restore();
 g.strokeStyle=ol;g.lineWidth=3;g.beginPath();g.moveTo(-8,-50);g.lineTo(8,-50);g.lineTo(8,-22);g.lineTo(22,42);g.quadraticCurveTo(0,54,-22,42);g.lineTo(-8,-22);g.closePath();g.stroke();
 /* glass highlight + lip */
 g.fillStyle='rgba(255,255,255,.45)';g.beginPath();g.moveTo(-6,-46);g.lineTo(-3,-46);g.lineTo(-14,36);g.lineTo(-18,34);g.closePath();g.fill();
 g.fillStyle='#c5d8ea';g.beginPath();g.roundRect?g.roundRect(-11,-54,22,8,3):g.rect(-11,-54,22,8);g.fill();g.stroke();
 g.fillStyle='rgba(255,120,200,.8)';g.beginPath();g.ellipse(0,-22,6,2,0,0,2*PI);g.fill()});
defSpr('foam',40,40,function(g){g.translate(20,20);var gr=g.createRadialGradient(-4,-5,2,0,0,18);gr.addColorStop(0,'rgba(255,255,255,.95)');gr.addColorStop(.45,'rgba(255,160,230,.8)');gr.addColorStop(1,'rgba(180,80,200,.5)');
 g.fillStyle=gr;g.beginPath();g.arc(0,0,16,0,2*PI);g.fill();g.fillStyle='rgba(255,255,255,.55)';g.beginPath();g.ellipse(-5,-6,5,4,0,0,2*PI);g.fill()});

function foamMk(x,y,i,src){var R=15+(i%4)*4,cols=['#ff5aad','#7af0ff','#ffe27a'];
 var b=Bodies.circle(x,y,R,{density:.00016,friction:0,frictionStatic:0,restitution:.05,frictionAir:.04,slop:.2});
 b.mat='wrap';b.kind='foam';b.toy=0;b.sw=R*2+8;b.sh=R*2+8;b.born=gt;b.col=cols[i%3];b.sk='foam';Composite.add(world,b);FOAM.push(b);
 var out=((i*3)%7-3)*(i<6?.35:1.3);Body.setVelocity(b,{x:out,y:-9-(i%5)*1.3});Body.setAngularVelocity(b,((i%5)-2)*.15);return b}
function pasteBurst(src,sim){var all=[ball].concat(debris,FOAM,XB||[]).filter(Boolean);
 all.forEach(function(b){if(!b||b===src||b.isStatic)return;var dx=b.position.x-src.position.x,dy=b.position.y-(src.position.y-src.sh/2),d=Math.hypot(dx,dy);if(d>240||d<1)return;
  Sleeping.set(b,false);var k=13*(1-d/240);Body.setVelocity(b,{x:b.velocity.x+dx/d*k,y:b.velocity.y+dy/d*k-8})});
 if(!sim){for(var i=0;i<22;i++)emit({k:'fb',x:src.position.x,y:src.position.y-src.sh/2,vx:(rnd()-.5)*200,vy:-240-rnd()*260,m:1.3+rnd()*.6,c:['#ff5aad','#7af0ff','#ffe27a'][i%3],s:12+rnd()*12})}}
function pasteForce(src,b){if(!src.erupt||!b||b===src||b.isStatic)return;var u=gt-src.erupt;if(u>2.2)return;
 var peak=u<.5?u/.5:u<1.15?1:Math.max(0,1-(u-1.15)/1.05),dx=b.position.x-src.position.x,dy=b.position.y-(src.position.y-src.sh/2),d=Math.hypot(dx,dy);
 if(d>250||d<1)return;Sleeping.set(b,false);var k=.32*peak*(1-d/250);Body.setVelocity(b,{x:b.velocity.x+dx/d*k,y:b.velocity.y+dy/d*k-.16*peak})}
function pasteStep(t,sim){if(!t.erupt)return;var u=gt-t.erupt;if(u>2.45){t.erupt=0;return}
 if(FOAM.length<22&&((gt*120)|0)%6===0){t.foamN=(t.foamN||0)+1;var i=t.foamN,a=-PI/2+((i*3)%7-3)*(i<6?.08:.22);foamMk(t.position.x+Math.cos(a)*12,t.position.y-t.sh/2-8-Math.min(80,i*6)+Math.sin(a)*4,i,t)}}
function foamStep(){for(var i=FOAM.length-1;i>=0;i--){var b=FOAM[i];if(gt-b.born>2.2||b.position.y>TABLE+40){Composite.remove(world,b);FOAM.splice(i,1)}}}
function pinAct(t,b,sim){if(!b)return;var wx=t.position.x,wy=t.position.y-36,dx=b.position.x-wx,dy=b.position.y-wy,d=Math.hypot(dx,dy);
 if(d<100){t.spinV=Math.min(1.2,(t.spinV||0)+.08);var k=.09*Math.pow(1-d/100,1.2);Sleeping.set(b,false);Body.setVelocity(b,{x:b.velocity.x+dx/(d||1)*k,y:b.velocity.y+dy/(d||1)*k*.4});
  if(!sim&&gt-(t.wT||-9)>.8){t.wT=gt;t.hitT=gt;if(toySndOk())pinSnd()}}
 t.spinV=(t.spinV||0)*0.985;t.spinA=(t.spinA||0)+t.spinV}
function gloveAct(t,b,sim){if(!b||b.mat!=='ball')return;if(gt-(t.punT||-9)<1.15)return;
 var dir=t.dir||1,dx=b.position.x-t.position.x,dy=b.position.y-t.position.y;
 if(dx*dir<16||dx*dir>86||Math.abs(dy)>36)return;
 t.punT=gt;t.hitT=gt;Sleeping.set(b,false);var v=b.velocity;Body.setVelocity(b,{x:v.x+dir*16,y:v.y-4});
 if(!sim)silly(t,t.position.x,t.position.y,8,toySndOk())}
function toyStep(b,sim){
 if(!toyStep._did){toyStep._did=1;
  for(var i=0;i<statics.length;i++){var t=statics[i];
   if(t.kind==='spin')t.spinA=(t.spinA||0)+(t.dir||1)*.32*(t.hitT&&gt-t.hitT<.45?2.6:1);
   else if(t.kind==='jello')jelloStep(t,sim);
   else if(t.kind==='paste'&&t.erupt){pasteStep(t,sim);[ball].concat(debris,FOAM,XB||[]).filter(Boolean).forEach(function(o){pasteForce(t,o)})}}
  foamStep()}
 if(b){for(var j=0;j<statics.length;j++){var t=statics[j];if(t.kind==='pin')pinAct(t,b,sim);else if(t.kind==='glove')gloveAct(t,b,sim)}
  if(FOAM.length){for(var i=0;i<FOAM.length;i++){var f=FOAM[i],d=Math.hypot(b.position.x-f.position.x,b.position.y-f.position.y);if(d<(f.circleRadius||14)+BR+2){Sleeping.set(b,false);b.friction=0;b.frictionAir=.002}}}}
}

Events.on(engine,'collisionStart',function(ev){var ps=ev.pairs;for(var i=0;i<ps.length;i++){var A=ps[i].bodyA.parent,B=ps[i].bodyB.parent;
 function hit(k){return A.kind===k&&A.toy?A:B.kind===k&&B.toy?B:null}
 var ballB=A.mat==='ball'?A:B.mat==='ball'?B:null,t,v;
 t=hit('spin');if(t&&ballB){v=ballB.velocity;var dx=ballB.position.x-t.position.x,dy=ballB.position.y-t.position.y,dir=t.dir||1,tx=-dy*dir,ty=dx*dir,L=Math.hypot(tx,ty)||1;ballB.spN=(ballB.spN||0)+1;if(ballB.spN<=5){Sleeping.set(ballB,false);Body.setVelocity(ballB,{x:v.x+tx/L*18,y:v.y+ty/L*18});t.hitT=gt}}
 t=hit('jello');if(t&&ballB){if(!t.sink){t.sink=gt;t.blooped=0}t.hitT=gt}
 t=hit('balloon');if(t&&ballB&&!t.popped){t.popped=1;t.hitT=gt;t.collisionFilter.mask=0;var p=t.position,all=[ballB].concat(debris,FOAM,XB||[]).filter(Boolean);
  all.forEach(function(o){if(!o||o.isStatic)return;var dx=o.position.x-p.x,dy=o.position.y-p.y,d=Math.hypot(dx,dy);if(d>86||d<1)return;Sleeping.set(o,false);var k=7*(1-d/86);Body.setVelocity(o,{x:o.velocity.x+dx/d*k,y:o.velocity.y+dy/d*k-2})});
  if(!SIM&&!SIMB){confetti(p.x,p.y,28);sparks(p.x,p.y,10,'#ffb3c7')}}
 t=hit('paste');if(t&&ballB&&!t.erupt){t.erupt=gt;t.hitT=gt;t.foamN=0;pasteBurst(t,SIM||SIMB)}
 }});

var RP={rec:false,play:false,frames:[],cat:[],t:0,acc:0,i:0,u:0,pt:0,back:null,kind:'shot',gen:0,ed:false,won:false,MAX:450,DT:1/30,SPD:.35};
var rpCss=document.createElement('style');rpCss.textContent=
 '#replay{position:fixed;left:50%;top:calc(78px + env(safe-area-inset-top));transform:translateX(-50%);z-index:12;display:none;font-size:min(7.2vmin,48px);padding:12px 26px;background:#e8762a;color:#fff;box-shadow:0 6px 0 #9a4a12,0 10px 18px #0006;border-radius:18px}'+
 '#rpCard{display:none;background:#e8762a;color:#fff;box-shadow:0 5px 0 #9a4a12,0 8px 14px #0005}'+
 '#slowmo{position:fixed;left:50%;top:calc(18px + env(safe-area-inset-top));transform:translateX(-50%);z-index:12;display:none;pointer-events:none;font-size:min(9vmin,68px);color:#ffde3b;-webkit-text-stroke:3px #3a1d00;text-shadow:0 4px 0 #3a1d00;letter-spacing:.04em}'+
 '#rpHint{position:fixed;left:50%;top:calc(92px + env(safe-area-inset-top));transform:translateX(-50%);z-index:12;display:none;pointer-events:none;font-size:min(4.2vmin,28px);color:#fff;text-shadow:0 2px 4px #000}'+
 '#rpNext{position:fixed;right:calc(14px + env(safe-area-inset-right));bottom:calc(14px + env(safe-area-inset-bottom));z-index:12;display:none;font-size:min(5vmin,32px);padding:10px 18px}';
document.head.appendChild(rpCss);
var rpBtn=mkEl('button','replay','btn mk','🎬 Replay!'),rpBadge=mkEl('div','slowmo','mk','SLOW-MO'),rpHint=mkEl('div','rpHint','mk','👆 Tap to skip'),rpNext=mkEl('button','rpNext','btn mk','Next level ▶');
var rpCard=mkEl('button','rpCard','btn alt mk','🎬 Replay!',$('next').parentNode);
$('next').parentNode.insertBefore(rpCard,$('next'));
function rpHide(){rpBtn.style.display=rpCard.style.display=rpBadge.style.display=rpHint.style.display=rpNext.style.display='none'}
function rpClear(){RP.rec=RP.play=false;RP.frames.length=0;RP.cat.length=0;RP.t=0;RP.won=false;rpHide()}
function rpBegin(kind){if(SIM)return;RP.rec=true;RP.play=false;RP.frames.length=0;RP.cat.length=0;RP.t=RP.acc=0;RP.kind=kind||'shot';RP.gen=(RP.gen|0)+1;RP.won=false;rpHide()}
function rpCid(b){if(b._rg!==RP.gen){b._rg=RP.gen;b._rp=RP.cat.length;RP.cat.push({sk:b.sk,sw:b.sw,sh:b.sh,kind:b.kind,mat:b.mat,toy:!!b.toy,ofs:b.ofs,ww:b.ww,wh:b.wh,soggy:b.soggy})}return b._rp}
function rpBod(b){var p=b.position,o={i:rpCid(b),x:p.x,y:p.y,a:b.angle||0};if(b.pops&&b.pops.length)o.p=b.pops.slice();if(b.hitT)o.h=b.hitT;if(b.anchor)o.an={x:b.anchor.x,y:b.anchor.y};if(b.spinA)o.sa=b.spinA;if(b.spinV)o.sv=b.spinV;if(b.punT)o.pu=b.punT;if(b.popped)o.pp=1;if(b.erupt)o.er=b.erupt;if(b.dir)o.dir=b.dir;return o}
function rpSample(dt){if(!RP.rec||SIM||RP.play)return;RP.t+=dt;RP.acc+=dt;if(RP.acc<RP.DT&&RP.frames.length)return;RP.acc=0;if(RP.frames.length>=RP.MAX||RP.t>15){RP.rec=false;return}
 RP.frames.push({gt:gt,h:[HOLE.y0,HOLE.y1],ex:{x:EX.x,tx:EX.tx,ty:EX.ty,ba:EX.ba,on:!!EX.on},
  st:statics.map(rpBod),mv:movers.map(rpBod),db:debris.map(rpBod),fl:flying.map(rpBod),
  po:PORT.map(function(q){return q?{x:q.x,y:q.y,a:q.a,d:q.d,fl:q.fl}:null}),
  gm:gems.map(function(g){return{x:g.x,y:g.y,got:!!g.got,ph:g.ph}}),
  rg:ring?{x:ring.x,y:ring.y,w:ring.w}:null,
  sh:shreds.map(function(s){return{x0:s.x0,x1:s.x1,h:s.h,sk:s.sk}}),
  bl:ball?{x:ball.position.x,y:ball.position.y,a:ball.angle,br:!!ball.burst}:null,
  xb:XB.map(function(b){return{x:b.position.x,y:b.position.y,a:b.angle}}),
  tr:trail.length?trail.map(function(p){return{x:p.x,y:p.y}}):[],
  edf:EDF.map(function(f){return{x:f.o.x,y:f.o.y}}),fm:(typeof FOAM!=='undefined'?FOAM:[]).map(rpBod)})}
function rpReady(){if(SIM)return;if(RP.rec)rpSample(RP.DT);RP.rec=false;if(RP.frames.length<8){rpHide();return}RP.won=(state==='won');rpBtn.style.display='block';rpCard.style.display='none'}
function rpOnWinCard(){if(RP.frames.length<8||RP.play)return;rpBtn.style.display='none';rpCard.style.display='inline-block'}
function rpLerp(a,b,u){if(a==null)return b;if(b==null)return a;return a+(b-a)*u}
function rpLerpP(a,b,u){if(!a)return b;if(!b)return a;var o={i:a.i,x:rpLerp(a.x,b.x,u),y:rpLerp(a.y,b.y,u),a:rpLerp(a.a,b.a,u)};var s=u<.5?a:b;if(s.p)o.p=s.p;if(s.h!=null)o.h=s.h;if(s.an)o.an=s.an;return o}
function rpLerpO(a,b,u){if(!a)return b;if(!b)return a;var o={};for(var k in a){var va=a[k],vb=b[k];o[k]=(typeof va==='number'&&typeof vb==='number')?rpLerp(va,vb,u):((u<.5||vb==null)?va:vb)}return o}
function rpMixArr(a,b,u){a=a||[];b=b||[];var n=Math.max(a.length,b.length),o=[],i,id,am={},bm={};a.forEach(function(p){am[p.i]=p});b.forEach(function(p){bm[p.i]=p});
 var seen={};function add(p){if(!p||seen[p.i])return;seen[p.i]=1;o.push(rpLerpP(am[p.i],bm[p.i],u))}a.forEach(add);b.forEach(add);return o}
function rpFrame(){var a=RP.frames[RP.i],b=RP.frames[RP.i+1]||a,u=RP.u;if(!a)return null;
 return{gt:rpLerp(a.gt,b.gt,u),h:[rpLerp(a.h[0],b.h[0],u),rpLerp(a.h[1],b.h[1],u)],ex:rpLerpO(a.ex,b.ex,u),
  st:rpMixArr(a.st,b.st,u),mv:rpMixArr(a.mv,b.mv,u),db:rpMixArr(a.db,b.db,u),fl:rpMixArr(a.fl,b.fl,u),
  po:(a.po||[]).map(function(p,i){return rpLerpO(p,b.po&&b.po[i],u)}),
  gm:(a.gm||[]).map(function(p,i){return rpLerpO(p,b.gm&&b.gm[i],u)}),
  rg:rpLerpO(a.rg,b.rg,u),sh:u<.5?a.sh:b.sh,bl:rpLerpO(a.bl,b.bl,u),
  xb:(a.xb||[]).map(function(p,i){return rpLerpO(p,b.xb&&b.xb[i],u)}),tr:u<.5?a.tr:b.tr,edf:u<.5?a.edf:b.edf,fm:rpMixArr(a.fm,b.fm,u)}}
var _rpH=null,_rpE=null,_rpP=null,_rpG;
function rpPushVis(){var f=rpFrame();if(!f)return;_rpH=[HOLE.y0,HOLE.y1];_rpE={x:EX.x,tx:EX.tx,ty:EX.ty,ba:EX.ba,on:EX.on};_rpG=gt;gt=f.gt;
 HOLE.y0=f.h[0];HOLE.y1=f.h[1];EX.x=f.ex.x;EX.tx=f.ex.tx;EX.ty=f.ex.ty;EX.ba=f.ex.ba;EX.on=f.ex.on;
 _rpP=PORT.map(function(q){return q?{x:q.x,y:q.y,a:q.a,fl:q.fl}:null});(f.po||[]).forEach(function(p,k){if(PORT[k]&&p){PORT[k].x=p.x;PORT[k].y=p.y;PORT[k].a=p.a;PORT[k].fl=p.fl}})}
function rpPopVis(){if(!_rpH)return;HOLE.y0=_rpH[0];HOLE.y1=_rpH[1];EX.x=_rpE.x;EX.tx=_rpE.tx;EX.ty=_rpE.ty;EX.ba=_rpE.ba;EX.on=_rpE.on;gt=_rpG;
 if(_rpP){_rpP.forEach(function(p,k){if(PORT[k]&&p){PORT[k].x=p.x;PORT[k].y=p.y;PORT[k].a=p.a;PORT[k].fl=p.fl}})}_rpH=_rpE=_rpP=null}
function rpDrawBod(g,pose){var c=RP.cat[pose.i];if(!c)return;var b={position:{x:pose.x,y:pose.y},angle:pose.a,sk:c.sk,sw:c.sw,sh:c.sh,kind:c.kind,mat:c.mat,toy:c.toy,ofs:c.ofs,ww:c.ww,wh:c.wh,soggy:c.soggy,pops:pose.p||[],hitT:pose.h||0,isStatic:true,spinA:pose.sa||0,spinV:pose.sv||0,punT:pose.pu||-9,popped:!!pose.pp,erupt:pose.er||0,dir:pose.dir||1};
 if(pose.an){g.strokeStyle='#5fd13a';g.lineWidth=5;g.beginPath();g.moveTo(pose.an.x,pose.an.y);g.lineTo(pose.x,pose.y);g.stroke()}drawBody(g,b,1)}
function rpDrawWorld(g,t){var f=rpFrame();if(!f)return;var i,s;
 (f.sh||[]).forEach(function(sh){s=spr(sh.sk);if(s)g.drawImage(s.c,sh.x0-15,FLOOR-sh.h,s.w,s.h)});
 (f.st||[]).forEach(function(p){rpDrawBod(g,p)});drawPortals(g,t);drawFans(g,t);(f.fm||[]).forEach(function(p){rpDrawBod(g,p)});
 (f.mv||[]).forEach(function(p){rpDrawBod(g,p)});(f.db||[]).forEach(function(p){rpDrawBod(g,p)});(f.fl||[]).forEach(function(p){rpDrawBod(g,p)});
 var gs=spr('gem');(f.gm||[]).forEach(function(gm){if(gm.got)return;var tw=Math.sin(t*3+(gm.ph||0));g.save();g.translate(gm.x,gm.y+tw*4);g.rotate(tw*.15);if(gs)g.drawImage(gs.c,-15,-15,gs.w,gs.h);g.restore()});
 if(f.rg){var rs=spr('ring');g.strokeStyle='#5fd13a';g.lineWidth=4;g.beginPath();g.moveTo(f.rg.x,TOP+6);g.lineTo(f.rg.x,f.rg.y-34);g.stroke();g.save();g.translate(f.rg.x,f.rg.y);if(rs)g.drawImage(rs.c,-42,-42,rs.w,rs.h);g.restore()}
 var bx,by,ba=0,bl=f.bl;if(bl){bx=bl.x;by=bl.y;ba=bl.a;var tr=f.tr||[];for(i=0;i<tr.length;i++){g.globalAlpha=i/tr.length*.25;g.fillStyle=modeCol();g.beginPath();g.arc(tr[i].x,tr[i].y,ballR()*(.4+.6*i/tr.length),0,2*PI);g.fill()}g.globalAlpha=1}
 (f.xb||[]).forEach(function(b){drawBallM(g,b.x,b.y,b.a,t,null)});
 if(bx!=null&&!(bl&&bl.br)){drawBallM(g,bx,by,ba,t,null);g.fillStyle='rgba(255,255,255,.75)';g.beginPath();g.arc(bx-7,by-8,5,0,2*PI);g.fill()}}
function rpPlay(){if(RP.play||RP.frames.length<8)return;aInit();RP.play=true;RP.rec=false;RP.i=0;RP.u=0;RP.pt=0;RP.back=state;RP.ed=(state==='edit'||RP.kind==='blow');RP.won=RP.won||state==='won'||$('win').classList.contains('on');
 rpHide();rpBadge.style.display='block';rpHint.style.display='block';if(RP.won){rpNext.textContent=$('next').textContent||'Next level ▶';rpNext.style.display='block';$('win').classList.remove('on')}
 if(RP.ed)showEd(false);hudEl.style.display='none';$('banner').classList.remove('on');state='replay';if(!memePlay('few_moments',1,.95)){tone(420,.18,{to:180,type:'sine',vol:.08});SFX.click()}}
function rpEnd(){if(!RP.play)return;RP.play=false;rpBadge.style.display=rpHint.style.display=rpNext.style.display='none';
 state=RP.back||'aim';if(state==='replay')state='aim';
 if(RP.ed){state='edit';showEd(true);placeTools();hudEl.style.display='none'}else hudEl.style.display='';
 if(RP.won){$('win').classList.add('on');rpOnWinCard()}else if(RP.frames.length>=8)rpBtn.style.display='block'}
function rpTick(dt){if(!RP.play)return;RP.pt+=dt*RP.SPD;var i=(RP.pt/RP.DT)|0;if(i>=RP.frames.length-1){rpEnd();return}RP.i=i;RP.u=RP.pt/RP.DT-i}
rpBtn.addEventListener('click',function(e){e.stopPropagation();SFX.click();rpPlay()});
rpCard.addEventListener('click',function(e){e.stopPropagation();SFX.click();rpPlay()});
rpNext.addEventListener('click',function(e){e.stopPropagation();rpEnd();$('next').click()});
addEventListener('pointerdown',function(e){if(state!=='replay')return;if(e.target&&e.target.closest&&e.target.closest('#rpNext,#next,#wedit,#rpCard'))return;e.preventDefault();rpEnd()},{capture:true});
rpHide();

checkHash();

window.EBED={open:function(){openEditor()},
 fly:function(){return flying.length},
 moveP:function(pr,x,y){ED.items.forEach(function(it){if(it.t==='portal'&&(it.pr|0)===pr){it.x=x;it.y=y;fit(it)}});edBuild();linkPair(pr);return true},flash:function(k){k=k||0;var A=PORT[k],B=PORT[k^1];if(!(A&&B))return false;A.fl=B.fl=gt;return true},
ptTest:function(k,vx,vy){var q=PORT[k];if(!q)return null;var b=mkBall(q.x,q.y);SIMB=true;Composite.add(world,b);Body.setVelocity(b,{x:vx,y:vy});var r=portalTP(b,true),o={tp:r,x:+b.position.x.toFixed(1),y:+b.position.y.toFixed(1),vx:+b.velocity.x.toFixed(2),vy:+b.velocity.y.toFixed(2),to:{x:PORT[k^1].x,y:PORT[k^1].y,d:PORT[k^1].d}};Composite.remove(world,b);SIMB=false;return o},
 enc:function(){return enc(ED.items,ED.hole,ED.name)},
 smp:function(){var o={};Object.keys(SMPL).forEach(function(k){o[k]=(SMP[k]||[]).length+'/'+SMPL[k].length});return o},
 smpTest:function(){if(!AC)return null;var n=0,orig=AC.createBufferSource.bind(AC),t=[];AC.createBufferSource=function(){n++;return orig()};var r={};
  Object.keys(SMPL).forEach(function(k){var t0=performance.now();r[k]={ok:playSample(k,.01),ms:+(performance.now()-t0).toFixed(2)}});AC.createBufferSource=orig;r._sources=n;r._muted=muted;return r},
 drop:function(h,old,kd){var pd=statics.filter(function(b){return b.kind===(kd||'pad')})[0];if(!pd)return null;var re=pd.restitution,mt=pd.mat;if(old){pd.restitution=1.05;pd.mat='wrap'}
  var top=pd.position.y-40,b=mkBall(pd.position.x,top-h-20),pc=pd.collisionFilter.category;pd.collisionFilter.category=8;b.collisionFilter.mask=8;SIMB=true;Composite.add(world,b);var ap=[],up=false,mn=1e9;for(var i=0;i<1400;i++){Engine.update(engine,FIXED);var y=b.position.y;
   if(b.velocity.y<0){up=true;mn=Math.min(mn,y)}else if(up&&b.velocity.y>0){ap.push(Math.round(top-20-mn));up=false;mn=1e9;if(ap.length>=5)break}}
  Composite.remove(world,b);SIMB=false;pd.restitution=re;pd.mat=mt;pd.collisionFilter.category=pc;return ap},
 gstep:function(){var b=mkBall(200,-2000);SIMB=true;Composite.add(world,b);Engine.update(engine,FIXED);var v0=b.velocity.y;Engine.update(engine,FIXED);var d=b.velocity.y-v0;Composite.remove(world,b);SIMB=false;return d},
 fanDev:function(a,p){var r1=simBall(a,p,true),sv=FANL;FANL=[];var r0=simBall(a,p,true);FANL=sv;var m=0,n=Math.min(r0.path.length,r1.path.length,40);for(var i=0;i<n;i++)m=Math.max(m,Math.hypot(r0.path[i].x-r1.path[i].x,r0.path[i].y-r1.path[i].y));return{dev:Math.round(m),win0:r0.res,win1:r1.res}},
 fanF:function(f,l){if(f!=null)FAN_F=f;if(l!=null)FAN_L=l;return[FAN_F,FAN_L]},edCode:function(c){var lv=dec(c);if(lv){ED.id=null;openEditor(lv)}return !!lv},st:function(){return{state:state,items:ED.items.length,sel:ED.sel,hole:ED.hole,name:ED.name,id:ED.id,cus:CUS.on,ch:CUS.challenge,levels:lvList().length}},
 items:function(){return JSON.parse(JSON.stringify(ED.items))},enc:function(){return enc(ED.items,ED.hole,ED.name)},dec:dec,url:function(){return shareURL(enc(ED.items,ED.hole,ED.name))},
 w2s:function(x,y){return{x:OX+x*S,y:OY+y*S}},sb:function(a,p){return simBall(a,p)},ports:function(){return{n:PORT.length,real:PTN[0],sim:PTN[1],ed:pEd(),p:PORT.map(function(q,k){return q?{x:q.x,y:q.y,a:q.a,fl:q.fl,d:q.d,col:pCol(k,!pEd()),n:pNo(k)}:null}),link:pEd()?PLINK:null}},toys:function(){return{toys:statics.concat(debris).filter(function(b){return b.toy}).map(function(b){return{k:b.kind,last:+b.lastHit.toFixed(2),x:b.position.x,y:b.position.y,a:+b.angle.toFixed(2)}}),ss:sprayCount(),P:P.length,shk:shk,gt:gt}},save:function(){return edSave(true)},hist:function(){return ED.hist.length},pg:function(){return palTab},tab:function(n){if(n!=null)showTab(n);return palTab},left:leftOf,add:function(t,x,y,a){if(state!=='edit')openEditor();var it={t:t,x:x,y:y};if(PT[t].flip||PT[t].rot)it.a=a||0;fit(it);ED.items.push(it);edBuild();return ED.items.length},playLv:function(lv){playCustom(lv,{fromEd:true});return true},erupt:function(){var t=statics.filter(function(b){return b.kind==='paste'})[0];if(!t)return false;t.erupt=gt;t.hitT=gt;t.foamN=0;pasteBurst(t,false);return true},foam:function(){return FOAM.length},lvs:function(){return lvList()}};

/* v1.6.2 recorded CC0 samples (CREDITS.md). Each synth sound stays as the automatic fallback if its file fails to load. */
smpReg('chick',['chick1.mp3','chick2.mp3','chick3.mp3']);/* v1.6.3: the Screaming Sheep clip, every hit (owner's request; not CC0, see CREDITS.md) */var GOATL=1.8;smpReg('goat',['sheep_scream.mp3']);smpReg('burp',['burp1.mp3','burp2.mp3']);
smpReg('honk',['honk1.mp3','honk2.mp3']);smpReg('whee',['whee1.mp3','whee2.mp3']);smpReg('tramp',['tramp1.mp3']);smpReg('boing',['boing1.mp3']);
smpReg('portal',['portal1.mp3','portal2.mp3']);smpReg('toot',['toot6.mp3','toot7.mp3','toot8.mp3']);smpReg('boom',['boom1.mp3']);
smpReg('spray',['spray1.mp3']);smpReg('blower',['blower1.mp3']);smpReg('fail',['fail.mp3']);smpReg('jello',['jello.mp3']);
smpReg('oof',['oof.mp3']);smpReg('anime_wow',['anime_wow.mp3']);smpReg('bruh',['bruh.mp3']);smpReg('yeet',['yeet.mp3']);smpReg('tom_scream',['tom_scream.mp3']);
smpReg('dundundun',['dundundun.mp3']);smpReg('scratch',['scratch.mp3']);smpReg('few_moments',['few_moments.mp3']);smpReg('fart_reverb',['fart_reverb.mp3']);smpReg('badumtss',['badumtss.mp3']);
smpReg('sad_guitar',['sad_guitar.mp3']);smpReg('fail_aww',['aww.mp3']);smpReg('okay',['okay.mp3']);smpReg('what',['what.mp3']);smpReg('suspense',['suspense.mp3']);smpReg('omg',['omg.mp3']);smpReg('god',['god.mp3']);
smpReg('throw',['throw.mp3']);smpReg('whoosh',['whoosh.mp3']);smpReg('hit_plate',['hit_plate.mp3']);smpReg('hit_cup',['hit_cup.mp3']);smpReg('hit_wrap',['hit_wrap.mp3']);smpReg('hit_wall',['hit_wall.mp3']);smpReg('hit_table',['hit_table.mp3']);smpReg('hit_card',['hit_card.mp3']);
smpReg('pop',['pop.mp3']);smpReg('balloon',['balloon.mp3']);smpReg('gem',['gem.mp3']);smpReg('ring',['ring.mp3']);smpReg('tick',['tick.mp3']);smpReg('fanfare',['fanfare.mp3']);smpReg('ok',['ok.mp3']);smpReg('no',['no.mp3']);
smpReg('thunk',['thunk.mp3']);smpReg('dump',['dump.mp3']);smpReg('click',['click.mp3']);smpReg('beep',['beep.mp3']);smpReg('stretch',['stretch.mp3']);
smpReg('duck',['duck.mp3']);smpReg('spin',['spin.mp3']);smpReg('punch',['punch.mp3']);smpReg('pin',['pin.mp3']);smpReg('paste',['paste.mp3']);smpReg('sparkle',['sparkle.mp3']);
smpReg('horn1',['horn1.mp3']);smpReg('horn2',['horn2.mp3']);smpReg('uvhum',['uvhum.mp3']);smpReg('engine',['engine.mp3']);
smpReg('crowdbed',['crowdbed.mp3']);smpReg('cheer',['cheer.mp3']);smpReg('cheer_sm',['cheer_sm.mp3']);smpReg('ooh',['ooh.mp3']);smpReg('crowd_aww',['crowd_aww.mp3']);smpReg('murmur',['murmur.mp3']);smpReg('squeak',['squeak.mp3']);
/* v1.7.4 data-driven piece/sting pools (sfx/pools.json), baked at build time. One-line swap: change PACK_URL. */
var PACK_URL='sfx/pools.json';
var PACK=/*PACK*/null;
function applyPack(m){if(!m||!m.pools)return;Object.keys(m.pools).forEach(function(k){if(m.pools[k]&&m.pools[k].length)smpReg(k,m.pools[k])})}
if(PACK)applyPack(PACK);
/* meme clips: at most one every 1.5s; win > fail > others. Vocals play at recorded pitch (lock). */
var MEME={t:0,pri:0};
function memePlay(k,pri,vol){if(!aok())return false;var n=performance.now();if(n-MEME.t<1500&&pri<=(MEME.pri||0))return false;if(!playSample(k,vol==null?.95:vol,null,1,0,true))return false;MEME.t=n;MEME.pri=pri||1;return true}
/* v1.7.3 fail pool: WA WA WA ~40%, the seven other approved miss lines share the rest; never repeat the last pick. */
var FAILPOOL=[{k:'fail',w:.4},{k:'sad_guitar',w:.6/7},{k:'fail_aww',w:.6/7},{k:'okay',w:.6/7},{k:'what',w:.6/7},{k:'suspense',w:.6/7},{k:'omg',w:.6/7},{k:'god',w:.6/7}],FAILLAST=null;
function failPick(){var opts=FAILPOOL.filter(function(x){return x.k!==FAILLAST});if(!opts.length)opts=FAILPOOL.slice();var tw=0,i;for(i=0;i<opts.length;i++)tw+=opts[i].w;var r=rnd()*tw,acc=0;for(i=0;i<opts.length;i++){acc+=opts[i].w;if(r<=acc){FAILLAST=opts[i].k;return FAILLAST}}FAILLAST=opts[opts.length-1].k;return FAILLAST}
function failPlay(){return memePlay(failPick(),2,.95)}
(function(){var w=function(k,f,v,pick,lock){return function(a){var vol=typeof v==='function'?v(a):v;if(!playSample(pick?pick(a):k,vol,null,1,0,!!lock))f(a)}};
 chickSquawk=w('chick',chickSquawk,1,function(big){return 'chick'});burpSnd=w('burp',burpSnd,1);honkSnd=w('honk',honkSnd,.9);goatSnd=w('goat',goatSnd,1,null,true);
 wheeSnd=w('whee',wheeSnd,.8);boingSnd=w('tramp',boingSnd,.9);vwoop=w('portal',vwoop,.7);jelloSnd=w('jello',jelloSnd,.95);
 duckSnd=w('duck',duckSnd,.9);spinSnd=w('spin',spinSnd,.8);powSnd=w('punch',powSnd,.9);popSnd=w('balloon',popSnd,.9);pasteSnd=w('paste',pasteSnd,.85);pinSnd=w('pin',pinSnd,.8);
 SFX.throw=w('throw',SFX.throw,function(p){return .5+.4*(p||0)});SFX.pop=w('pop',SFX.pop,.85);SFX.gem=w('gem',SFX.gem,.9);SFX.ring=w('ring',SFX.ring,.9);
 SFX.fanfare=w('fanfare',SFX.fanfare,.9,null,true);SFX.boom=w('boom',SFX.boom,.95);SFX.thunk=w('thunk',SFX.thunk,.9);SFX.dump=w('dump',SFX.dump,.9);
 SFX.click=w('click',SFX.click,.8);SFX.beep=w('beep',SFX.beep,.7,null,true);SFX.whoosh=w('whoosh',SFX.whoosh,.8);SFX.ok=w('ok',SFX.ok,.85,null,true);SFX.no=w('no',SFX.no,.85);
 var tick0=SFX.tick;SFX.tick=function(i){if(!playSample('tick',.55))tick0(i)};
 var st0=SFX.stretch;SFX.stretch=function(p){if(!lim('st',80))return;if(!playSample('stretch',.12+.2*(p||0),null,.85+(p||0)*.4,0,true))tone(180+p*420,.06,{type:'triangle',vol:.035})};
 var hit0=SFX.hit;SFX.hit=function(mat,v){var a=clamp(v/16,.08,1);if(!lim(mat,50))return;var k={plate:'hit_plate',cup:'hit_cup',wrap:'hit_wrap',wall:'hit_wall',table:'hit_table'}[mat]||'hit_card';if(!playSample(k,.35+.6*a))SFX.hitS(mat,a);if(a>.7&&rnd()<.4)memePlay('hit',1,.85)};
 var aww0=SFX.aww;SFX.aww=function(){if(!failPlay())aww0()};
})();

/* ===== v1.7.0 secret: Dad's invisible-ink pen (UV black light). Plain glossy blue barrel, no text. ===== */
var UV={on:false,x:0,y:0,px:0,py:0,ang:-.4,R:170,hum:null,ink:null,found:{},spark:[],t:0};
function uvKid(){var k;try{k=(location.search.match(/[?&](?:kid|mode)=(alex|zoe)\b/)||[])[1]}catch(e){}if(!k){try{k=localStorage.kidsHub}catch(e){}}return k==='zoe'?'zoe':'alex'}
function uvLoad(){var o=save.uv;if(!o||typeof o!=='object'||Array.isArray(o))o={};var a=o[uvKid()]||[];UV.found={};a.forEach(function(id){UV.found[id]=1});save.uv=o}
function uvSaveFound(id){if(UV.found[id])return;UV.found[id]=1;if(!save.uv||typeof save.uv!=='object'||Array.isArray(save.uv))save.uv={};var k=uvKid(),a=save.uv[k]?save.uv[k].slice():[];if(a.indexOf(id)<0)a.push(id);save.uv[k]=a;persist()}
/* Real SCStyle-style pen: translucent glossy blue barrel, side clip, chunky UV cap with clear window + loop. NO barrel text (Amazon photo only). */
function drawInkPen(g,x,y,ang,sc,lit){g.save();g.translate(x,y);g.rotate(ang);g.scale(sc||1,sc||1);
 /* local: cap/light at 0,0, barrel extends +y (down when ang=0) */
 var ol='#123a6e';
 /* UV cap body */
 var cap=g.createLinearGradient(-11,0,11,0);cap.addColorStop(0,'#1a5cb8');cap.addColorStop(.35,'#4aa0f0');cap.addColorStop(.55,'#c8ecff');cap.addColorStop(.8,'#2e7ad4');cap.addColorStop(1,'#0d3a7a');
 g.fillStyle=cap;g.strokeStyle=ol;g.lineWidth=1.6;g.beginPath();
 if(g.roundRect){g.roundRect(-10,-8,20,34,6)}else{g.rect(-10,-8,20,34)}g.fill();g.stroke();
 /* clear LED tip */
 var tip=g.createRadialGradient(0,-16,1,0,-14,10);tip.addColorStop(0,lit?'#f4e6ff':'#e8f6ff');tip.addColorStop(.45,lit?'#c9a0ff':'#9ad4ff');tip.addColorStop(1,'rgba(40,80,160,.2)');
 g.fillStyle=tip;g.beginPath();g.ellipse(0,-16,7,9,0,0,2*PI);g.fill();g.strokeStyle=ol;g.lineWidth=1.3;g.stroke();
 if(lit){g.shadowColor='#d8b0ff';g.shadowBlur=16;g.fillStyle='rgba(220,180,255,.55)';g.beginPath();g.ellipse(0,-16,5,6,0,0,2*PI);g.fill();g.shadowBlur=0}
 /* clear window */
 g.fillStyle='rgba(210,240,255,.7)';g.strokeStyle='rgba(20,50,100,.55)';g.lineWidth=1;g.beginPath();g.ellipse(0,2,5.5,7,0,0,2*PI);g.fill();g.stroke();
 g.fillStyle='rgba(255,255,255,.55)';g.beginPath();g.ellipse(-1.5,0,2,2.6,0,0,2*PI);g.fill();
 /* hanging loop / button */
 g.strokeStyle='#d8e8f8';g.lineWidth=2.2;g.lineCap='round';g.beginPath();g.arc(0,16,4.2,-.2,Math.PI+.2);g.stroke();
 g.strokeStyle=ol;g.lineWidth=.8;g.beginPath();g.arc(0,16,4.2,-.2,Math.PI+.2);g.stroke();
 /* barrel — plain translucent glossy blue, no text */
 var bar=g.createLinearGradient(-8,26,8,26);bar.addColorStop(0,'#1460b8');bar.addColorStop(.22,'#3d9eea');bar.addColorStop(.42,'#d2f0ff');bar.addColorStop(.62,'#3b8fe0');bar.addColorStop(1,'#0c3c88');
 g.fillStyle=bar;g.strokeStyle=ol;g.lineWidth=1.6;g.beginPath();
 if(g.roundRect){g.roundRect(-8,24,16,78,4)}else{g.rect(-8,24,16,78)}g.fill();g.stroke();
 /* gloss streak */
 g.fillStyle='rgba(255,255,255,.38)';g.beginPath();g.roundRect?g.roundRect(-5.5,28,3.2,68,1.5):g.rect(-5.5,28,3.2,68);g.fill();
 /* tip / nib */
 g.fillStyle='#1a4a8a';g.beginPath();g.moveTo(-3,100);g.lineTo(3,100);g.lineTo(1.2,108);g.lineTo(-1.2,108);g.closePath();g.fill();g.stroke();
 /* clip */
 g.fillStyle='#2a6fc0';g.strokeStyle=ol;g.lineWidth=1.3;g.beginPath();g.moveTo(8,30);g.lineTo(13,30);g.quadraticCurveTo(16,32,16,38);g.lineTo(16,86);g.quadraticCurveTo(16,92,11,92);g.lineTo(11,38);g.quadraticCurveTo(11,34,8,34);g.closePath();g.fill();g.stroke();
 g.fillStyle='rgba(255,255,255,.35)';g.fillRect(12,36,2,48);
 g.restore()}
function mkPenBtn(){var b=document.getElementById('inkPen');if(b)return b;
 var css=document.createElement('style');css.textContent=
  '#title{position:fixed}'+
  '#inkPen{position:absolute;z-index:22;width:52px;height:120px;padding:0;border:0;background:transparent;cursor:pointer;touch-action:none;transform:rotate(18deg);transform-origin:50% 20%}'+
  '#inkPen canvas{display:block;pointer-events:none;width:52px;height:120px}'+
  '#uvX{position:fixed;top:calc(10px + env(safe-area-inset-top));right:calc(12px + env(safe-area-inset-right));z-index:32;display:none;min-width:52px;min-height:52px;border-radius:16px;font-size:28px;padding:4px 14px}'+
  '#uvLayer{position:fixed;inset:0;z-index:30;display:none;touch-action:none;cursor:none}';
 document.head.appendChild(css);
 b=mkEl('button','inkPen',null,'');b.setAttribute('aria-label','A blue invisible-ink pen');b.title='';
 var c=document.createElement('canvas');c.width=104;c.height=240;b.appendChild(c);
 var g=c.getContext('2d');g.scale(2,2);drawInkPen(g,26,22,0,1,false);
 $('title').appendChild(b);
 b.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();aInit();if(UV.on)uvOff();else uvOn()});
 var x=mkEl('button','uvX','btn alt mk','✕');x.setAttribute('aria-label','Turn off the black light');x.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();uvOff()});
 var layer=mkEl('canvas','uvLayer');document.body.appendChild(layer);
 layer.addEventListener('pointerdown',uvPtr,true);layer.addEventListener('pointermove',uvPtr,true);
 addEventListener('pointerup',function(e){if(UV.on)uvPtr(e)},true);
 return b}
function placePen(){var b=$('inkPen'),t=$('tbox'),T=$('title');if(!b||!t||!T||T.classList.contains('off'))return;
 var r=t.getBoundingClientRect(),tr=T.getBoundingClientRect();
 /* tuck on the right edge of the arcade cabinet / title box */
 b.style.left=Math.round(r.right-tr.left-16)+'px';
 b.style.top=Math.round(r.top-tr.top+r.height*.28)+'px'}
function uvMsgs(){/* positions are fractions of the layer; kept clear of the logo / title sign */
 return[
  {id:'love',t:['I love you','- Dad'],x:.14,y:.15,c:'#ff4ec8',s:48,rot:.05},
  {id:'hi',t:['Hi Alex!','- Dad'],x:.86,y:.15,c:'#5ef6ff',s:48,rot:-.05},
  {id:'poop',t:['POOP'],x:.13,y:.42,c:'#b8ff3a',s:58,rot:-.06},
  {id:'toot',t:['Toot toot!'],x:.87,y:.42,c:'#ff4ec8',s:52,rot:.08},
  {id:'handsome',t:['MY DAD IS','HANDSOME'],x:.50,y:.58,c:'#5ef6ff',s:52,rot:-.03},
  {id:'goat',t:['Alex smells','like goat 🐐'],x:.16,y:.80,c:'#ffe14a',s:46,rot:.05},
  {id:'exc',t:['Dad > Excavator'],x:.84,y:.80,c:'#b8ff3a',s:46,rot:-.05},
  {id:'fav',t:["You're my",'favorite'],x:.50,y:.91,c:'#ffe14a',s:48,rot:.03}
 ]}
function uvInk(w,h){var c=mkc(w,h),g=c.getContext('2d');g.textAlign='center';g.textBaseline='middle';g.lineJoin='round';g.lineCap='round';
 var css=w/Math.max(1,(UV.mw?UV.mw/ (UV.ink&&1):0)|| (typeof innerWidth==='number'?w/Math.max(1,innerWidth):1));
 /* font size is CSS px * device pixel ratio; 44+ at 1024x768 */
 var dpr=typeof innerWidth==='number'?w/Math.max(1,innerWidth):1,sc=dpr*( (typeof innerWidth==='number'?innerWidth:1024)/1024);
 function glow(col,blur){g.shadowColor=col;g.shadowBlur=blur||16;g.fillStyle=col;g.strokeStyle=col}
 function hand(lines,x,y,s,col,rot){s=Math.max(44*dpr,s);g.save();g.translate(x,y);g.rotate(rot||0);g.font='800 '+s+'px '+MK;
  var lh=s*1.14,ys=lines.map(function(_,i){return (i-(lines.length-1)/2)*lh}),i;
  g.shadowColor='transparent';g.strokeStyle='rgba(8,0,16,.92)';g.lineWidth=Math.max(6,s*.14);
  for(i=0;i<lines.length;i++)g.strokeText(lines[i],0,ys[i]);
  g.shadowColor=col;g.shadowBlur=s*.75;g.fillStyle=col;
  for(i=0;i<lines.length;i++){g.fillText(lines[i],0,ys[i]);g.fillText(lines[i],0,ys[i])}
  g.restore()}
 var ms=uvMsgs();ms.forEach(function(m){hand(m.t,m.x*w,m.y*h,m.s*sc,m.c,m.rot)});
 /* doodles */
 function doodle(fn,x,y,sc,rot){g.save();g.translate(x*w,y*h);g.rotate(rot||0);g.scale(sc*(w/1180),sc*(w/1180));fn(g);g.restore()}
 doodle(function(g){ /* poop + stink + flies */
  glow('#c9a0ff',18);g.beginPath();g.ellipse(0,18,28,16,0,0,2*PI);g.ellipse(-8,6,18,12,0,0,2*PI);g.ellipse(8,4,16,11,0,0,2*PI);g.arc(0,-8,10,0,2*PI);g.fill();
  g.strokeStyle='#7dffb0';g.shadowColor='#7dffb0';g.lineWidth=2;for(var i=0;i<3;i++){g.beginPath();g.moveTo(-10+i*10,-22);g.quadraticCurveTo(-6+i*10,-36,-10+i*10,-46);g.stroke()}
  g.fillStyle='#5ef0ff';[[-30,-20],[24,-18],[8,-40]].forEach(function(p){g.beginPath();g.arc(p[0],p[1],3,0,2*PI);g.fill();g.beginPath();g.ellipse(p[0]-5,p[1],5,2,0,0,2*PI);g.stroke()});
 },.28,.42,1.0,-.1);
 doodle(function(g){glow('#ff7ad9',20);g.beginPath();g.moveTo(0,16);g.bezierCurveTo(-28,0,-22,-24,0,-8);g.bezierCurveTo(22,-24,28,0,0,16);g.fill()},.70,.48,1.15,.15);
 doodle(function(g){ /* goat in sunglasses */
  glow('#f4f1ea',14);g.fillStyle='#f4f1ea';g.beginPath();g.ellipse(0,10,22,14,0,0,2*PI);g.fill();g.stroke();
  g.beginPath();g.ellipse(16,-6,12,9,.3,0,2*PI);g.fill();g.stroke();
  g.strokeStyle='#c9a0ff';g.lineWidth=3;g.beginPath();g.moveTo(12,-16);g.quadraticCurveTo(4,-28,-4,-18);g.stroke();g.beginPath();g.moveTo(18,-16);g.quadraticCurveTo(16,-30,6,-26);g.stroke();
  g.fillStyle='#111';g.beginPath();g.ellipse(10,-8,7,5,0,0,2*PI);g.ellipse(20,-6,7,5,0,0,2*PI);g.fill();g.fillStyle='#5ef0ff';g.beginPath();g.arc(12,-8,1.6,0,2*PI);g.arc(22,-6,1.6,0,2*PI);g.fill();
  g.strokeStyle='#111';g.lineWidth=2;g.beginPath();g.moveTo(14,-8);g.lineTo(18,-7);g.stroke();
 },.70,.68,1.1,-.15);
 doodle(function(g){ /* little excavator */
  glow('#ffd21a',16);g.fillStyle='#ffd21a';g.strokeStyle='#ffe27a';g.lineWidth=2;
  g.beginPath();g.rect(-18,-8,36,18);g.fill();g.stroke();g.fillStyle='#7ad8ff';g.fillRect(-10,-20,16,12);g.strokeRect(-10,-20,16,12);
  g.strokeStyle='#ffd21a';g.lineWidth=6;g.lineCap='round';g.beginPath();g.moveTo(10,-16);g.lineTo(28,-28);g.lineTo(40,-12);g.stroke();
  g.fillStyle='#889';g.beginPath();g.moveTo(36,-16);g.lineTo(48,-8);g.lineTo(40,0);g.lineTo(30,-10);g.closePath();g.fill();
  g.fillStyle='#333';g.fillRect(-22,8,46,8);
 },.36,.80,1.0,.05);
 doodle(function(g){ /* stick-figure Dad: big smile, no mustache, muscles */
  glow('#5ef0ff',16);g.strokeStyle='#5ef0ff';g.fillStyle='#5ef0ff';g.lineWidth=3;
  g.beginPath();g.arc(0,-22,12,0,2*PI);g.stroke();
  g.beginPath();g.arc(-4,-24,1.6,0,2*PI);g.arc(4,-24,1.6,0,2*PI);g.fill();
  g.lineWidth=2.5;g.beginPath();g.arc(0,-20,6,.2*PI,.8*PI);g.stroke(); /* big smile, no 'stache */
  g.lineWidth=3;g.beginPath();g.moveTo(0,-10);g.lineTo(0,16);g.stroke(); /* body */
  g.beginPath();g.moveTo(0,0);g.lineTo(-22,-2);g.moveTo(0,0);g.lineTo(22,-2);g.stroke(); /* arms */
  /* muscles */
  g.beginPath();g.ellipse(-18,-2,7,6,0,0,2*PI);g.ellipse(18,-2,7,6,0,0,2*PI);g.stroke();
  g.beginPath();g.moveTo(0,16);g.lineTo(-12,32);g.moveTo(0,16);g.lineTo(12,32);g.stroke();
 },.66,.80,1.05,-.05);
 UV.ink=c;UV.mw=w;UV.mh=h;return c}
function uvHum(on){if(UV.hum){try{if(UV.hum.sample){stopLoop('uvhum')}else{UV.hum.g.gain.exponentialRampToValueAtTime(.0001,AC.currentTime+.08);UV.hum.o.stop(AC.currentTime+.12);UV.hum.o2.stop(AC.currentTime+.12);if(UV.hum.l)UV.hum.l.stop(AC.currentTime+.12)}}catch(e){}UV.hum=null}
 if(!on||!aok())return;if(playLoop('uvhum',.1)){UV.hum={sample:1};return}try{var o=AC.createOscillator(),o2=AC.createOscillator(),f=AC.createBiquadFilter(),g=AC.createGain(),l=AC.createOscillator(),lg=AC.createGain();
  o.type='sine';o.frequency.value=92;o2.type='triangle';o2.frequency.value=184;f.type='lowpass';f.frequency.value=420;f.Q.value=.8;
  l.type='sine';l.frequency.value=.7;lg.gain.value=8;l.connect(lg);lg.connect(o.frequency);
  g.gain.value=.0001;g.gain.linearRampToValueAtTime(.045,AC.currentTime+.2);
  o.connect(f);o2.connect(f);var g2=AC.createGain();g2.gain.value=.4;o2.connect(g2);g2.connect(f);f.connect(g);g.connect(sfxBus);
  o.start();o2.start();l.start();UV.hum={o:o,o2:o2,g:g,l:l}}catch(e){}}
function uvOn(){uvLoad();UV.on=true;UV.t=0;UV.spark=[];uvResize();
 var L=$('uvLayer'),X=$('uvX'),P=$('inkPen');L.style.display='block';X.style.display='block';if(P)P.style.zIndex=33;
 UV.x=innerWidth*.55;UV.y=innerHeight*.45;UV.px=UV.x;UV.py=UV.y;
 uvHum(true);SFX.click()}
function uvOff(){if(!UV.on)return;UV.on=false;uvHum(false);$('uvLayer').style.display='none';$('uvX').style.display='none';var P=$('inkPen');if(P)P.style.zIndex=22;SFX.click()}
function uvResize(){var L=$('uvLayer');if(!L)return;var d=Math.min(devicePixelRatio||1,2);L.width=Math.round(innerWidth*d);L.height=Math.round(innerHeight*d);L.style.width=innerWidth+'px';L.style.height=innerHeight+'px';uvInk(L.width,L.height);placePen()}
function uvPtr(e){if(!UV.on)return;e.preventDefault();UV.x=e.clientX;UV.y=e.clientY}
function uvTick(dt){UV.t+=dt;var dx=UV.x-UV.px,dy=UV.y-UV.py;if(dx*dx+dy*dy>4)UV.ang=Math.atan2(dx,-dy); /* cap toward motion; barrel trails */
 UV.px+=(UV.x-UV.px)*Math.min(1,dt*14);UV.py+=(UV.y-UV.py)*Math.min(1,dt*14);
 var L=$('uvLayer'),g=L.getContext('2d'),W=L.width,H=L.height,d=W/innerWidth,lx=UV.px*d,ly=UV.py*d,R=UV.R*d;
 g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,W,H);
 /* dark black-light wash */
 g.fillStyle='rgba(6,0,16,.93)';g.fillRect(0,0,W,H);
 /* flashlight hole + ink only inside the circle */
 g.save();g.beginPath();g.arc(lx,ly,R,0,2*PI);g.clip();
 var rg=g.createRadialGradient(lx,ly,R*.08,lx,ly,R);rg.addColorStop(0,'rgba(30,8,50,.10)');rg.addColorStop(.5,'rgba(16,0,32,.16)');rg.addColorStop(1,'rgba(8,0,18,0)');
 g.fillStyle=rg;g.fillRect(lx-R,ly-R,R*2,R*2);
 if(UV.ink)g.drawImage(UV.ink,0,0);
 g.restore();
 /* soft purple vignette ring around the beam */
 var ring=g.createRadialGradient(lx,ly,R*.72,lx,ly,R*1.35);ring.addColorStop(0,'rgba(80,0,140,0)');ring.addColorStop(.55,'rgba(60,0,100,.18)');ring.addColorStop(1,'rgba(10,0,24,0)');
 g.fillStyle=ring;g.beginPath();g.arc(lx,ly,R*1.35,0,2*PI);g.fill();
 /* pen sits at the bottom of the beam so it doesn't cover the words */
 var px=lx+Math.sin(UV.ang||0)*R*.58,py=ly+Math.cos(UV.ang||0)*R*.58;
 drawInkPen(g,px,py,UV.ang,1.15*d,true);
 g.save();g.translate(px,py);g.globalCompositeOperation='lighter';g.fillStyle='rgba(210,170,255,.22)';g.beginPath();g.arc(0,0,18*d,0,2*PI);g.fill();g.restore();
 /* reveal check */
 var ms=uvMsgs();ms.forEach(function(m){var mx=m.x*W,my=m.y*H,hit=Math.hypot(mx-lx,my-ly)<R*.88;m._see=(m._see||0)+(hit?dt:-dt*.4);if(m._see<0)m._see=0;if(m._see>.45&&!UV.found[m.id]){uvSaveFound(m.id);uvSpark(mx,my,m.c)}});
 for(var i=UV.spark.length-1;i>=0;i--){var s=UV.spark[i];s.l-=dt;if(s.l<=0){UV.spark.splice(i,1);continue}
  g.globalAlpha=clamp(s.l/.6,0,1);g.fillStyle=s.c;g.save();g.translate(s.x,s.y);g.rotate(s.a);g.fillRect(-s.s/2,-1.5*d,s.s,3*d);g.restore();s.x+=s.vx*dt;s.y+=s.vy*dt}g.globalAlpha=1}
function uvSpark(x,y,c){for(var i=0;i<18;i++){var a=rnd()*2*PI,sp=40+rnd()*180;UV.spark.push({x:x,y:y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,s:6+rnd()*10,a:a,c:c||'#fff',l:.55+rnd()*.3})}
 if(!playSample('sparkle',.7,null,1,0,true)){tone(720,.18,{to:1400,type:'sine',vol:.08});tone(1080,.22,{to:1800,type:'triangle',vol:.04,at:.04})}}
mkPenBtn();placePen();
addEventListener('resize',function(){clearTimeout(placePen.t);placePen.t=setTimeout(function(){placePen();if(UV.on)uvResize()},120)});
