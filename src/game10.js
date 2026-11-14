/* ===== v1.8.0: cinematic intro + theme-music system (sting / menu loop / full song) + per-kid sound settings ===== */
var MUSIC=/*MUSIC*/null;
smpReg('intro_rumble',['intro_rumble.mp3']);smpReg('intro_tracks',['intro_tracks.mp3']);smpReg('intro_smash',['intro_smash.mp3']);smpReg('intro_debris',['intro_debris.mp3']);
/* ---------- per-kid sound settings ---------- */
function sndKid(){try{return uvKid()}catch(e){return 'alex'}}
var SNDK='aeb_snd_'+sndKid(),SND={mv:.75,sv:1,mo:1,so:1};
try{var sn0=JSON.parse(localStorage.getItem(SNDK)||'null');if(sn0&&typeof sn0==='object')['mv','sv','mo','so'].forEach(function(k){if(typeof sn0[k]==='number'&&isFinite(sn0[k]))SND[k]=clamp(sn0[k],0,1)})}catch(e){}
function sndSave(){try{localStorage.setItem(SNDK,JSON.stringify(SND))}catch(e){}}
/* ---------- theme music: files are optional; anything missing is just silence ---------- */
var MZ={buf:{},ld:0,loop:null,full:null,sting:null,tg:null,dg:null,cfg:(MUSIC&&MUSIC.cfg)||{},have:(MUSIC&&MUSIC.have)||{}};
function mzCfg(k){return MZ.cfg[k]||{}}
function mzGain(k){var c=mzCfg(k);return c.gain==null?1:+c.gain||0}
function sndApply(){if(!AC)return;var n=AC.currentTime;function sv(node,v){if(!node)return;try{node.gain.cancelScheduledValues(n);node.gain.setTargetAtTime(v,n,.03)}catch(e){try{node.gain.value=v}catch(e2){}}}
 var mg=SND.mo?SND.mv:0,sg=SND.so?SND.sv:0;sv(musBus,.15*mg);sv(MZ.tg,(MZ.cfg.gain==null?.55:+MZ.cfg.gain)*mg);sv(sfxBus,.85*sg);sv(crowdBus,.75*sg)}
function mzNodes(){if(!AC||MZ.dg||!master)return;try{MZ.dg=AC.createGain();MZ.dg.connect(master);MZ.tg=AC.createGain();MZ.tg.connect(MZ.dg);try{musBus.disconnect()}catch(e){}musBus.connect(MZ.dg)}catch(e){}sndApply()}
function mzLoad(){if(!AC||MZ.ld)return;MZ.ld=1;['sting','loop','full'].forEach(function(k){var f=MZ.have[k];if(!f)return;try{fetch(f).then(function(r){if(!r.ok)throw 0;return r.arrayBuffer()}).then(function(b){AC.decodeAudioData(b,function(buf){MZ.buf[k]=buf;try{updSett()}catch(e){}},function(){})}).catch(function(){})}catch(e){}})}
function mzSrc(buf){var s=AC.createBufferSource(),g=AC.createGain();s.buffer=buf;g.gain.value=0;s.connect(g);g.connect(MZ.tg);return{s:s,g:g}}
function mzFade(o,to,d){if(!o)return;try{var n=AC.currentTime;o.g.gain.cancelScheduledValues(n);o.g.gain.setValueAtTime(o.g.gain.value,n);o.g.gain.linearRampToValueAtTime(to,n+d)}catch(e){}}
function mzKill(o,d){if(!o)return;mzFade(o,0,d);try{o.s.stop(AC.currentTime+d+.05)}catch(e){}}
function mzLoopOn(){if(MZ.loop||!MZ.tg||!aok())return;var k=MZ.buf.loop?'loop':MZ.buf.full?'full':null;if(!k)return;try{var b=MZ.buf[k],c=mzCfg(k),o=mzSrc(b),ls=+c.loopStart||0,le=+c.loopEnd||0;o.s.loop=true;
 if(le>ls+.25&&le<=b.duration+.01){o.s.loopStart=ls;o.s.loopEnd=le}o.s.start(AC.currentTime+.05);mzFade(o,mzGain(k),1.2);MZ.loop=o}catch(e){}}
function mzLoopOff(d){if(!MZ.loop)return;mzKill(MZ.loop,d==null?.7:d);MZ.loop=null}
function mzFullToggle(){if(MZ.full){mzKill(MZ.full,.5);MZ.full=null;return false}if(!MZ.buf.full||!MZ.tg||!aok())return false;mzLoopOff(.4);try{var o=mzSrc(MZ.buf.full);o.s.start(AC.currentTime+.05);mzFade(o,mzGain('full'),.3);o.s.onended=function(){if(MZ.full===o){MZ.full=null;try{updSett()}catch(e){}}};MZ.full=o;return true}catch(e){return false}}
/* rem = seconds until the logo smash; the sting starts so its "hit" point (music.json sting.hit) lands on the smash */
function mzSting(rem){if(MZ.sting||!MZ.buf.sting||!MZ.tg||!aok())return false;var hit=+mzCfg('sting').hit||0;if(rem>hit+.03)return false;var off=Math.max(0,hit-rem);if(off>=MZ.buf.sting.duration-.05)return true;
 try{var o=mzSrc(MZ.buf.sting);o.g.gain.value=mzGain('sting');o.s.start(AC.currentTime,off);MZ.sting=o;o.s.onended=function(){if(MZ.sting===o)MZ.sting=null}}catch(e){}return true}
function mzDuck(depth,hold){if(!MZ.dg||!AC)return;try{var n=AC.currentTime,p=MZ.dg.gain;p.cancelScheduledValues(n);p.setValueAtTime(Math.max(.0001,p.value),n);p.linearRampToValueAtTime(depth,n+.05);p.setTargetAtTime(1,n+.05+hold,.3)}catch(e){}}
/* hooks: build the music buses whenever audio starts; duck music under big hits / stings */
var aInit0=aInit;aInit=function(){aInit0();if(AC){mzNodes();mzLoad()}};
var shake0=shake;shake=function(a){shake0(a);if(a>=12&&!SIM)mzDuck(.45,.45)};
['boom','fanfare'].forEach(function(k){var f=SFX[k];if(typeof f==='function')SFX[k]=function(){mzDuck(.35,.7);return f.apply(this,arguments)}});
var meme0=memePlay;memePlay=function(k,pri,vol){var r=meme0(k,pri,vol);if(r)mzDuck(.4,.9);return r};
/* iPad Safari: unlock audio on the very first touch anywhere (capture phase, before any game handler) */
function auUnlock(){try{aInit();if(AC&&!auUnlock.done&&AC.state==='running'){auUnlock.done=1;var s=AC.createBufferSource();s.buffer=AC.createBuffer(1,1,22050);s.connect(AC.destination);s.start(0)}}catch(e){}}
['touchstart','touchend','pointerdown','mousedown','click','keydown'].forEach(function(ev){document.addEventListener(ev,auUnlock,{capture:true,passive:true})});
setInterval(function(){if(!AC||!MZ.tg)return;var tv=!$('title').classList.contains('off'),has=!!(MZ.buf.loop||MZ.buf.full);
 var want=has&&!IN.on&&tv&&!MZ.full&&SND.mo&&aok();
 if(want){if(MZ.sting){mzKill(MZ.sting,1.2);MZ.sting=null}if(!MZ.loop)mzLoopOn();if(MZ.loop&&MUS.on)MUS.on=false}
 else if(MZ.loop&&(!tv||IN.on||MZ.full||!SND.mo))mzLoopOff()},250);

/* ---------- settings panel (Music + Sounds sliders and mute toggles, saved per kid) ---------- */
(function(){var st=document.createElement('style');st.textContent=
 '#sett{z-index:36}#sett .card{width:min(92vw,560px)}'+
 '.srow{display:flex;align-items:center;gap:14px;margin:14px 6px;font-size:28px;color:#21571f}.srow span{width:118px;text-align:left}'+
 '.stg{width:66px;height:58px;border-radius:14px;font-size:30px;background:#2f8a3a;box-shadow:0 4px 0 #1d5a25,0 6px 10px #0004;flex:none}.stg.off{background:#a0927a;box-shadow:0 4px 0 #6b5a40}'+
 '.srow input{flex:1;min-width:0;-webkit-appearance:none;appearance:none;height:18px;border-radius:9px;margin:0;background:linear-gradient(90deg,#2f8a3a var(--p,50%),rgba(0,0,0,.2) var(--p,50%));outline:none;touch-action:none}'+
 '.srow input:disabled{opacity:.4}.srow input::-webkit-slider-thumb{-webkit-appearance:none;width:46px;height:46px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff6c0,#ffcf2e 45%,#d99a00);border:3px solid #6b4520;box-shadow:0 3px 6px #0006}'+
 '.srow input::-moz-range-thumb{width:40px;height:40px;border-radius:50%;background:#ffcf2e;border:3px solid #6b4520}'+
 '#snote{font-size:15px;color:#4a2e10;opacity:.85;margin:2px 0 8px}'+
 '#tgear{position:absolute;right:calc(14px + env(safe-area-inset-right));top:calc(12px + env(safe-area-inset-top));font-size:30px;width:62px;height:62px;border-radius:16px;box-shadow:0 4px 0 #6b4520,0 6px 14px #0006;z-index:3;display:flex;align-items:center;justify-content:center}'+
 '#gear{font-size:20px;width:44px;text-align:center;padding:6px 0}'+
 '#intro{position:fixed;inset:0;z-index:40;background:#000;touch-action:none;transition:opacity .45s ease,transform .45s ease}#intro.out{opacity:0;transform:scale(1.06)}'+
 '#intro canvas{position:absolute;left:0;top:0;width:100%;height:100%;display:block;touch-action:none}';
 document.head.appendChild(st);
 var ov=document.createElement('div');ov.id='sett';ov.className='ov';ov.innerHTML='<div class="card cb"><h2 class="mk">⚙️ Sound</h2>'+
 '<div class="srow"><button id="mtg" class="stg" aria-label="Music on or off">🎵</button><span class="mk">Music</span><input id="mvol" type="range" min="0" max="100" step="1" aria-label="Music volume"></div>'+
 '<div class="srow"><button id="stg" class="stg" aria-label="Sounds on or off">💥</button><span class="mk">Sounds</span><input id="svol" type="range" min="0" max="100" step="1" aria-label="Sound effects volume"></div>'+
 '<div id="snote"></div><button id="rint" class="btn alt">🎬 Replay intro</button><button id="fsong" class="btn alt" style="display:none">🎤 Theme song</button><br><button id="sdone" class="btn">Done</button></div>';
 document.body.appendChild(ov);
 var tg=document.createElement('button');tg.id='tgear';tg.className='cb';tg.setAttribute('aria-label','Sound settings');tg.textContent='⚙️';$('title').appendChild(tg);
 var hg=document.createElement('button');hg.id='gear';hg.className='tag cb';hg.setAttribute('aria-label','Sound settings');hg.textContent='⚙️';$('hud').insertBefore(hg,$('mute'));
 function openS(){aInit();SFX.click();updSett();ov.classList.add('on')}
 tg.addEventListener('click',openS);hg.addEventListener('click',openS);
 $('sdone').addEventListener('click',function(){SFX.click();ov.classList.remove('on')});
 ov.addEventListener('click',function(e){if(e.target===ov){ov.classList.remove('on')}});
 $('mtg').addEventListener('click',function(){aInit();SND.mo=SND.mo?0:1;if(!SND.mo&&MZ.full){mzKill(MZ.full,.3);MZ.full=null}sndApply();sndSave();updSett();SFX.click()});
 $('stg').addEventListener('click',function(){aInit();SND.so=SND.so?0:1;sndApply();sndSave();updSett();SFX.click()});
 $('mvol').addEventListener('input',function(e){SND.mv=clamp(+e.target.value/100,0,1);sndApply();updSett()});$('mvol').addEventListener('change',sndSave);
 $('svol').addEventListener('input',function(e){SND.sv=clamp(+e.target.value/100,0,1);sndApply();updSett()});$('svol').addEventListener('change',function(){sndSave();SFX.click()});
 $('rint').addEventListener('click',function(){aInit();ov.classList.remove('on');$('modes').classList.remove('on');if(state!=='title'&&$('title').classList.contains('off')){/* mid-game: play over the game, then come back to it */}inStart('full',true)});
 $('fsong').addEventListener('click',function(){aInit();if(!SND.mo){SND.mo=1;sndApply();sndSave()}mzFullToggle();updSett()});
})();
function updSett(){var m=$('mvol'),s=$('svol');if(!m)return;m.value=Math.round(SND.mv*100);s.value=Math.round(SND.sv*100);m.style.setProperty('--p',m.value+'%');s.style.setProperty('--p',s.value+'%');
 $('mtg').classList.toggle('off',!SND.mo);$('mtg').textContent=SND.mo?'🎵':'🔇';$('stg').classList.toggle('off',!SND.so);$('stg').textContent=SND.so?'💥':'🔇';m.disabled=!SND.mo;s.disabled=!SND.so;
 var hasAny=!!(MZ.have.loop||MZ.have.full||MZ.have.sting),f=$('fsong');f.style.display=MZ.have.full?'':'none';f.textContent=MZ.full?'⏹ Stop the song':'🎤 Theme song';
 $('snote').textContent=hasAny?(muted?'The 🔇 button at the top is on, so everything is quiet.':''):'🎸 The Excavator Blowout theme song is coming soon. Music turns on here when it arrives.'}

/* ---------- cinematic intro ---------- */
var IN={on:false,mode:'full',t:0,last:0,raf:0,el:null,cv:null,g:null,dpr:1,s:1,cw:1,ch:1,P:[],F:[],fired:{},paused:false,ending:false,hit:0,R:Math.random,snd:[],eng:null,fc:0,fs:0,lastTap:0,skipped:false,silent:false,tTap:6.5,tEnd:9,sky:null,vig:null,wall:null,logo:null,glow:null,glint:null,kw:0,stung:false};
var T_IMP=4.6,GY=800,WX0=620,WX1=1560,WY0=140,WW=WX1-WX0,WH=GY-WY0,LGX=1060,LGY=388,LGW=900,LGH=470,EXF=220;
function iseg(t,a,b){return clamp((t-a)/(b-a),0,1)}
function eo3(u){u=clamp(u,0,1);return 1-Math.pow(1-u,3)}
function ei3(u){u=clamp(u,0,1);return u*u*u}
function eio(u){u=clamp(u,0,1);return u<.5?4*u*u*u:1-Math.pow(-2*u+2,3)/2}
function eBack(u){u=clamp(u,0,1);var c1=1.9,c3=c1+1;return 1+c3*Math.pow(u-1,3)+c1*Math.pow(u-1,2)}
function inSeenKey(){return 'aeb_intro1_'+sndKid()}
function inSeen(){try{return localStorage.getItem(inSeenKey())==='1'}catch(e){return false}}
function inMarkSeen(){try{localStorage.setItem(inSeenKey(),'1')}catch(e){}}
/* deterministic scenery */
var SC=(function(){var r=rng(77),o={mA:[],mB:[],bld:[],win:[],peb:[],fg:[]},x,i;
 var pa=[r()*6,r()*6,r()*6],pb=[r()*6,r()*6];
 for(x=-1000;x<=2600;x+=40){o.mA.push([x,640-Math.abs(Math.sin(x/260+pa[0]))*150-Math.sin(x/97+pa[1])*30-Math.sin(x/530+pa[2])*60]);o.mB.push([x,712-Math.abs(Math.sin(x/170+pb[0]))*70-Math.sin(x/61+pb[1])*14])}
 for(x=-700;x<2400;){var w=50+r()*110,h=60+r()*220;o.bld.push([x,w,h]);for(i=0;i<w*h/1400;i++)if(r()<.45)o.win.push([x+6+r()*(w-16),770-h+10+r()*(h-30)]);x+=w+r()*30}
 for(i=0;i<70;i++)o.peb.push([-800+r()*3200,GY+8+r()*190,2+r()*7,r()]);
 return o})();
function inSpr(rgb,sz){var c=mkc(sz,sz),g=c.getContext('2d'),gr=g.createRadialGradient(sz/2,sz/2,0,sz/2,sz/2,sz/2);gr.addColorStop(0,'rgba('+rgb+',1)');gr.addColorStop(.45,'rgba('+rgb+',.55)');gr.addColorStop(1,'rgba('+rgb+',0)');g.fillStyle=gr;g.fillRect(0,0,sz,sz);return c}
var ISP={dust:inSpr('205,165,120',64),smoke:inSpr('58,52,52',64),glow:inSpr('255,170,60',64),hot:inSpr('255,240,200',32)};
ISP.rays=(function(){var n=640,c=mkc(n,n),g=c.getContext('2d'),h=n/2,rg=g.createRadialGradient(h,h,12,h,h,h);rg.addColorStop(0,'rgba(255,220,120,.9)');rg.addColorStop(.5,'rgba(255,170,80,.35)');rg.addColorStop(1,'rgba(255,140,60,0)');g.fillStyle=rg;g.beginPath();
 for(var i=0;i<18;i++){var a=i/18*2*PI;g.moveTo(h,h);g.lineTo(h+Math.cos(a)*h,h+Math.sin(a)*h);g.lineTo(h+Math.cos(a+.13)*h,h+Math.sin(a+.13)*h);g.closePath()}g.fill();return c})();
/* text cards are pre-rendered once (shadowBlur every frame is slow on iPad) */
function inTextCv(txt,fs,track,fill,stroke,glow){var pad=fs*.9,g0=mkc(4,4).getContext('2d');g0.font=fs+'px '+MK;var ws=[],tw=0,i;for(i=0;i<txt.length;i++){ws.push(g0.measureText(txt[i]).width);tw+=ws[i]+(i<txt.length-1?track:0)}
 var c=mkc(tw+pad*2,fs*1.6+pad*2),g=c.getContext('2d');g.font=fs+'px '+MK;g.textBaseline='middle';g.lineJoin='round';var y=c.height/2,x=pad;
 for(i=0;i<txt.length;i++){g.shadowColor=glow;g.shadowBlur=fs*.4;if(stroke){g.strokeStyle=stroke;g.lineWidth=fs*.18;g.strokeText(txt[i],x,y)}g.shadowBlur=stroke?0:fs*.4;
  if(typeof fill==='string')g.fillStyle=fill;else{var gr=g.createLinearGradient(0,y-fs*.5,0,y+fs*.45);gr.addColorStop(0,fill[0]);gr.addColorStop(.5,fill[1]);gr.addColorStop(1,fill[2]);g.fillStyle=gr}g.fillText(txt[i],x,y);x+=ws[i]+track}
 return{c:c,w:c.width,h:c.height,tw:tw}}
function inEl(){if(IN.el)return;var d=document.createElement('div');d.id='intro';d.style.display='none';var c=document.createElement('canvas');d.appendChild(c);document.body.appendChild(d);IN.el=d;IN.cv=c;IN.g=c.getContext('2d',{alpha:false});
 d.addEventListener('pointerdown',function(e){inTap()});addEventListener('resize',function(){if(IN.on){clearTimeout(inEl.rt);inEl.rt=setTimeout(inResize,120)}})}
function inResize(){var cw=Math.max(1,innerWidth),ch=Math.max(1,innerHeight),dp=Math.min(window.devicePixelRatio||1,2);if(IN.lowq)dp=Math.min(dp,1.25);IN.cw=cw;IN.ch=ch;IN.dpr=dp;
 IN.s=cw>=ch?Math.max(ch/1000,cw/1600):cw/1350;IN.cv.width=Math.round(cw*dp);IN.cv.height=Math.round(ch*dp);
 var W=IN.cv.width,H=IN.cv.height;
 /* sky: dusk gradient, sun glow, stars, wispy clouds */
 var c=mkc(W,H),g=c.getContext('2d'),gr=g.createLinearGradient(0,0,0,H),r=rng(9);gr.addColorStop(0,'#070a26');gr.addColorStop(.38,'#231a4d');gr.addColorStop(.62,'#6a2a55');gr.addColorStop(.76,'#c4473a');gr.addColorStop(.86,'#f39a45');gr.addColorStop(1,'#ffcf7a');g.fillStyle=gr;g.fillRect(0,0,W,H);
 var sg=g.createRadialGradient(W*.7,H*.74,0,W*.7,H*.74,H*.55);sg.addColorStop(0,'rgba(255,214,140,.85)');sg.addColorStop(.18,'rgba(255,160,80,.45)');sg.addColorStop(1,'rgba(255,120,60,0)');g.fillStyle=sg;g.fillRect(0,0,W,H);
 for(var i=0;i<140;i++){var sy=r()*H*.5,a=(1-sy/(H*.5))*(.35+r()*.65);g.fillStyle='rgba(255,255,240,'+a.toFixed(2)+')';var sz=(r()<.1?2.2:1.1)*dp;g.fillRect(r()*W,sy,sz,sz)}
 for(i=0;i<9;i++){var cy=H*(.42+r()*.2),cx=r()*W,cwid=W*(.15+r()*.25);var cg=g.createRadialGradient(cx,cy,0,cx,cy,cwid);cg.addColorStop(0,'rgba(255,150,170,.16)');cg.addColorStop(1,'rgba(255,150,170,0)');g.save();g.translate(cx,cy);g.scale(1,.12);g.translate(-cx,-cy);g.fillStyle=cg;g.beginPath();g.arc(cx,cy,cwid,0,2*PI);g.fill();g.restore()}
 IN.sky=c;
 var v=mkc(W,H),vg=v.getContext('2d'),gg=vg.createRadialGradient(W/2,H*.48,Math.min(W,H)*.35,W/2,H*.5,Math.max(W,H)*.75);gg.addColorStop(0,'rgba(0,0,0,0)');gg.addColorStop(1,'rgba(0,0,0,.62)');vg.fillStyle=gg;vg.fillRect(0,0,W,H);IN.vig=v;
 IN.kw=IN.s*dp*1.08;IN.wall=null;IN.logo=null;IN.glow=null;IN.glint=null;IN.F.forEach(function(f){f.cv=null})}
/* the cardboard wall the bucket smashes through */
function inWall(){if(IN.wall)return IN.wall;var k=IN.kw,c=mkc(WW*k,WH*k),g=c.getContext('2d'),r=rng(31);g.scale(k,k);
 var pat=g.createPattern(CBT,'repeat');var rows=[[0,210],[210,220],[430,230]],x,y;
 rows.forEach(function(rw,ri){x=-40*ri-r()*60;while(x<WW){var bw=220+r()*140;y=rw[0];var bh=rw[1];
  g.save();g.beginPath();g.rect(x+2,y+2,bw-4,bh-4);g.clip();g.fillStyle=pat;g.fillRect(x,y,bw,bh);
  var sh=g.createLinearGradient(x,y,x+bw,y+bh);sh.addColorStop(0,'rgba(255,235,190,.18)');sh.addColorStop(.6,'rgba(0,0,0,0)');sh.addColorStop(1,'rgba(60,30,5,.32)');g.fillStyle=sh;g.fillRect(x,y,bw,bh);
  g.fillStyle='rgba(225,200,150,.55)';g.fillRect(x+bw/2-18,y,36,bh);g.fillStyle='rgba(255,255,255,.18)';g.fillRect(x+bw/2-18,y,6,bh);
  var mk=r();g.save();g.translate(x+bw*.27,y+bh*.62);g.rotate((r()-.5)*.25);
  if(mk<.3){g.strokeStyle='rgba(30,25,20,.75)';g.lineWidth=5;g.beginPath();g.moveTo(0,22);g.lineTo(0,-22);g.moveTo(-14,-8);g.lineTo(0,-24);g.lineTo(14,-8);g.stroke();g.beginPath();g.moveTo(26,22);g.lineTo(26,-22);g.moveTo(12,-8);g.lineTo(26,-24);g.lineTo(40,-8);g.stroke()}
  else if(mk<.55){g.strokeStyle='rgba(180,30,25,.75)';g.lineWidth=4;g.strokeRect(-36,-20,112,38);g.fillStyle='rgba(180,30,25,.8)';g.font='26px '+MK;g.fillText('FRAGILE',-30,10)}
  else if(mk<.75){g.fillStyle='rgba(30,25,20,.6)';g.font='22px '+MK;g.fillText('THIS SIDE UP',-20,0)}
  g.restore();g.restore();g.strokeStyle='rgba(70,40,10,.85)';g.lineWidth=4;g.strokeRect(x+2,y+2,bw-4,bh-4);g.strokeStyle='rgba(255,230,180,.25)';g.lineWidth=1.5;g.strokeRect(x+5,y+5,bw-10,bh-10);x+=bw}});
 /* stencil + caution tape */
 g.save();g.translate(WW*.5,WH*.47);g.rotate(-.04);g.font='118px '+MK;g.textAlign='center';g.textBaseline='middle';g.fillStyle='rgba(20,18,30,.82)';g.fillText('KEEP OUT!',0,0);g.font='44px '+MK;g.fillStyle='rgba(170,25,20,.85)';g.fillText('DANGER: BLOWOUT ZONE',0,92);g.restore();
 function tape(y0,ang){g.save();g.translate(WW/2,y0);g.rotate(ang);g.fillStyle='#ffd21a';g.fillRect(-WW,-26,WW*2,52);g.fillStyle='#16161c';for(var i=-WW;i<WW;i+=56){g.beginPath();g.moveTo(i,-26);g.lineTo(i+22,-26);g.lineTo(i-4,26);g.lineTo(i-26,26);g.closePath();g.fill()}
  g.fillStyle='rgba(255,255,255,.22)';g.fillRect(-WW,-26,WW*2,7);g.fillStyle='rgba(0,0,0,.25)';g.fillRect(-WW,20,WW*2,6);g.restore()}
 tape(WH*.17,.07);tape(WH*.83,-.05);
 var sh=g.createLinearGradient(0,0,70,0);sh.addColorStop(0,'rgba(0,0,0,.45)');sh.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=sh;g.fillRect(0,0,70,WH);
 var tp=g.createLinearGradient(0,0,0,40);tp.addColorStop(0,'rgba(255,190,120,.45)');tp.addColorStop(1,'rgba(255,190,120,0)');g.fillStyle=tp;g.fillRect(0,0,WW,40);
 IN.wall=c;return c}
/* wall shards: jittered grid, shared vertices so it tiles perfectly, each quad split in two */
function inFrags(){var r=rng(5150),C=8,Rw=6,V=[],x,y,F=[];for(y=0;y<=Rw;y++){V.push([]);for(x=0;x<=C;x++){var px=x/C*WW,py=y/Rw*WH;if(x>0&&x<C)px+=(r()-.5)*WW/C*.7;if(y>0&&y<Rw)py+=(r()-.5)*WH/Rw*.7;V[y].push([px,py])}}
 for(y=0;y<Rw;y++)for(x=0;x<C;x++){var a=V[y][x],b=V[y][x+1],c=V[y+1][x+1],d=V[y+1][x],tr=r()<.5?[[a,b,c],[a,c,d]]:[[a,b,d],[b,c,d]];
  tr.forEach(function(p){var cx=(p[0][0]+p[1][0]+p[2][0])/3,cy=(p[0][1]+p[1][1]+p[2][1])/3,mnx=1e9,mny=1e9,mxx=-1e9,mxy=-1e9;p.forEach(function(q){mnx=Math.min(mnx,q[0]);mny=Math.min(mny,q[1]);mxx=Math.max(mxx,q[0]);mxy=Math.max(mxy,q[1])});
   F.push({p:p,lx:cx,ly:cy,mnx:mnx-3,mny:mny-3,bw:mxx-mnx+6,bh:mxy-mny+6,x:WX0+cx,y:WY0+cy,vx:0,vy:0,a:0,va:0,z:1,vz:0,al:1,go:0,del:0,rest:0,cv:null,toward:false,sz:Math.min(mxx-mnx,mxy-mny)})})}
 return F}
function inFragCv(f){if(f.cv)return f.cv;var k=IN.kw,c=mkc(f.bw*k,f.bh*k),g=c.getContext('2d');g.scale(k,k);g.translate(-f.mnx,-f.mny);g.beginPath();g.moveTo(f.p[0][0],f.p[0][1]);g.lineTo(f.p[1][0],f.p[1][1]);g.lineTo(f.p[2][0],f.p[2][1]);g.closePath();g.save();g.clip();g.drawImage(inWall(),0,0,WW,WH);
 g.strokeStyle='rgba(70,40,12,.9)';g.lineWidth=5;g.stroke();g.strokeStyle='rgba(255,236,190,.65)';g.lineWidth=1.6;g.stroke();g.restore();f.cv=c;return c}
/* logo: extruded, bevelled, glossy, with a glow layer + a glint mask */
function inLogo(){if(IN.logo)return;var k=IN.s*IN.dpr*1.02,W=Math.ceil(LGW*k),H=Math.ceil(LGH*k),c=mkc(W,H),g=c.getContext('2d'),gl=mkc(W,H),gg=gl.getContext('2d');
 var lines=[{t:'EXCAVATOR',fs:132,y:168,face:['#fffbe2','#ffe45c','#ffcb05','#e08e00'],ex:['#00122a','#0b3a72'],ol:'#05112a'},{t:'BLOWOUT!',fs:176,y:352,face:['#fff6b8','#ffb400','#ff5a00','#c41400'],ex:['#3a0500','#951a00'],ol:'#2a0600'}];
 function fit(G,L){G.font=L.fs+'px '+MK;var w=G.measureText(L.t).width;return Math.min(1,800/w)}
 lines.forEach(function(L){var sx=fit(g,L);
  /* glow */
  gg.save();gg.scale(k,k);gg.translate(LGW/2,L.y);gg.scale(sx,1);gg.font=L.fs+'px '+MK;gg.textAlign='center';gg.textBaseline='alphabetic';gg.shadowColor=L.ex[1]==='#951a00'?'rgba(255,110,20,1)':'rgba(255,200,60,1)';gg.shadowBlur=38*k;gg.fillStyle='rgba(255,170,40,.9)';gg.fillText(L.t,0,0);gg.fillText(L.t,0,0);gg.restore();
  g.save();g.scale(k,k);g.translate(LGW/2,L.y);g.scale(sx,1);g.font=L.fs+'px '+MK;g.textAlign='center';g.textBaseline='alphabetic';g.lineJoin='round';
  /* extrusion (depth) */
  var D=20;for(var i=D;i>=1;i--){var u=i/D;g.fillStyle=u>.5?L.ex[0]:L.ex[1];g.strokeStyle=g.fillStyle;g.lineWidth=14;g.strokeText(L.t,i*.55,i);g.fillText(L.t,i*.55,i)}
  g.strokeStyle=L.ol;g.lineWidth=16;g.strokeText(L.t,0,0);g.restore();
  /* face with bevel + gloss, built on its own canvas so the bevel strokes stay inside the letters */
  var fc=mkc(W,H),f=fc.getContext('2d');f.scale(k,k);f.translate(LGW/2,L.y);f.scale(sx,1);f.font=L.fs+'px '+MK;f.textAlign='center';f.textBaseline='alphabetic';f.lineJoin='round';
  var fg=f.createLinearGradient(0,-L.fs*.78,0,L.fs*.1);fg.addColorStop(0,L.face[0]);fg.addColorStop(.35,L.face[1]);fg.addColorStop(.62,L.face[2]);fg.addColorStop(1,L.face[3]);f.fillStyle=fg;f.fillText(L.t,0,0);
  f.globalCompositeOperation='source-atop';f.strokeStyle='rgba(90,30,0,.45)';f.lineWidth=7;f.strokeText(L.t,3,4);f.strokeStyle='rgba(255,255,255,.75)';f.lineWidth=5;f.strokeText(L.t,-2.5,-3);
  var gs=f.createLinearGradient(0,-L.fs*.8,0,-L.fs*.3);gs.addColorStop(0,'rgba(255,255,255,.55)');gs.addColorStop(1,'rgba(255,255,255,.04)');f.fillStyle=gs;f.fillRect(-LGW,-L.fs,LGW*2,L.fs*.55);
  g.drawImage(fc,0,0)});
 /* subtitle */
 g.save();g.scale(k,k);g.translate(LGW/2,432);g.rotate(-.02);g.font='44px '+MK;g.textAlign='center';g.lineJoin='round';g.strokeStyle='#05112a';g.lineWidth=10;g.strokeText('by Alex and friends',0,0);g.fillStyle='#ffffff';g.fillText('by Alex and friends',0,0);g.restore();
 IN.logo=c;IN.glow=gl;IN.glint=mkc(W,H)}
/* ---------- excavator (drawn in code, faces right; origin = ground under the track centre) ---------- */
var EXL1=290,EXL2=225,EXFX=168,EXFY=-170;
var WK=[[0,250,120,.35],[3.5,250,120,.35],[4.25,95,-318,-1.05],[T_IMP,300,-92,.8],[T_IMP+.18,322,-80,.95],[5.95,205,-292,-.55]];
function inPose(t){var i=0;while(i<WK.length-2&&t>=WK[i+1][0])i++;var a=WK[i],b=WK[i+1],u=iseg(t,a[0],b[0]),e=i===2?ei3(u):i===3?eo3(u):i===4?eBack(u):eio(u);
 var x=lerp(a[1],b[1],e),y=lerp(a[2],b[2],e),ba=lerp(a[3],b[3],e);if(t>5.95){x+=Math.sin((t-5.95)*2.2)*5;y+=Math.sin((t-5.95)*1.6)*7;ba+=Math.sin((t-5.95)*1.6)*.05}return{x:x,y:y,ba:ba}}
function inIK(fx,fy,wx,wy){var dx=wx-fx,dy=wy-fy,d=Math.hypot(dx,dy);d=clamp(d,Math.abs(EXL1-EXL2)+2,EXL1+EXL2-2);var a=Math.atan2(dy,dx),cb=(EXL1*EXL1+d*d-EXL2*EXL2)/(2*EXL1*d),b=Math.acos(clamp(cb,-1,1)),ea=a-b;
 var ex=fx+Math.cos(ea)*EXL1,ey=fy+Math.sin(ea)*EXL1,wa=Math.atan2(wy-ey,wx-ex);return{ex:ex,ey:ey,wx:ex+Math.cos(wa)*EXL2,wy:ey+Math.sin(wa)*EXL2,a1:ea,a2:wa}}
function exX(t){return t<1.3?-760:lerp(-760,EXF,eo3(iseg(t,1.3,3.5)))}
function exSpeed(t){return(exX(t+.02)-exX(t))/.02}
function exGeo(t){var x=exX(t),p=inPose(t),tilt=0;if(t>3.4)tilt=-.02*Math.exp(-(t-3.4)*4)*Math.sin((t-3.4)*13);
 var sp=exSpeed(t),bob=Math.abs(sp)>5?Math.sin(t*34)*1.4:0;if(t>=T_IMP&&t<T_IMP+.6)tilt+=.018*Math.exp(-(t-T_IMP)*7)*Math.cos((t-T_IMP)*30);
 var k=inIK(EXFX,EXFY,EXFX+p.x,EXFY+p.y);return{x:x,bob:bob,tilt:tilt,k:k,ba:p.ba}}
function exTip(G){/* bucket teeth tip, world coords */var k=G.k,ca=Math.cos(k.a2+G.ba),sa=Math.sin(k.a2+G.ba),lx=74,ly=34;var px=k.wx+ca*lx-sa*ly,py=k.wy+sa*lx+ca*ly;
 var ct=Math.cos(G.tilt),st=Math.sin(G.tilt);return{x:G.x+px*ct-py*st,y:GY+G.bob+px*st+py*ct}}
function inRR(g,x,y,w,h,r){g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath()}
function inArm(g,ax,ay,bx,by,wa,wb){var dx=bx-ax,dy=by-ay,l=Math.hypot(dx,dy)||1,nx=-dy/l,ny=dx/l;g.beginPath();g.moveTo(ax+nx*wa/2,ay+ny*wa/2);g.lineTo(bx+nx*wb/2,by+ny*wb/2);g.lineTo(bx-nx*wb/2,by-ny*wb/2);g.lineTo(ax-nx*wa/2,ay-ny*wa/2);g.closePath();
 var gr=g.createLinearGradient(ax-nx*wa/2,ay-ny*wa/2,ax+nx*wa/2,ay+ny*wa/2);gr.addColorStop(0,'#fff07a');gr.addColorStop(.35,'#ffcb05');gr.addColorStop(1,'#b98800');g.fillStyle=gr;g.fill();g.strokeStyle='#4a3500';g.lineWidth=3.5;g.stroke();
 g.strokeStyle='rgba(255,255,255,.35)';g.lineWidth=2;g.beginPath();g.moveTo(ax-nx*(wa/2-4),ay-ny*(wa/2-4));g.lineTo(bx-nx*(wb/2-4),by-ny*(wb/2-4));g.stroke()}
function inPin(g,x,y,r){g.beginPath();g.arc(x,y,r,0,2*PI);g.fillStyle='#3a3a3a';g.fill();g.strokeStyle='#111';g.lineWidth=2;g.stroke();g.beginPath();g.arc(x-r*.3,y-r*.3,r*.35,0,2*PI);g.fillStyle='#9a9a9a';g.fill()}
function inCyl(g,ax,ay,bx,by,w){var mx=lerp(ax,bx,.55),my=lerp(ay,by,.55);g.lineCap='round';g.strokeStyle='#2c2c2c';g.lineWidth=w+4;g.beginPath();g.moveTo(ax,ay);g.lineTo(mx,my);g.stroke();g.strokeStyle='#5a5a5a';g.lineWidth=w;g.stroke();
 g.strokeStyle='#cfd6dc';g.lineWidth=w*.5;g.beginPath();g.moveTo(mx,my);g.lineTo(bx,by);g.stroke();g.strokeStyle='rgba(255,255,255,.8)';g.lineWidth=1.5;g.beginPath();g.moveTo(mx,my-w*.12);g.lineTo(bx,by-w*.12);g.stroke();g.lineCap='butt'}
function drawExcav(g,G,t){var ph=G.x;g.save();g.translate(G.x,GY+G.bob);g.rotate(G.tilt);
 /* tracks */
 inRR(g,-232,-80,464,80,40);var tg=g.createLinearGradient(0,-80,0,0);tg.addColorStop(0,'#4a4a4a');tg.addColorStop(.5,'#262626');tg.addColorStop(1,'#111');g.fillStyle=tg;g.fill();g.strokeStyle='#0a0a0a';g.lineWidth=3;g.stroke();
 g.fillStyle='#5b5b5b';var o=((ph%26)+26)%26,i;for(i=-200+o;i<200;i+=26)g.fillRect(i,-84,13,7);o=((-ph%26)+26)%26;for(i=-200+o;i<200;i+=26)g.fillRect(i,-4,13,7);
 inRR(g,-200,-62,400,44,18);g.fillStyle='#1b1b1b';g.fill();
 var ang=ph/34;[[-192,-40,34],[192,-40,34]].forEach(function(w){g.save();g.translate(w[0],w[1]);g.rotate(ang);g.beginPath();for(var j=0;j<10;j++){var a=j/10*2*PI;g.lineTo(Math.cos(a)*w[2],Math.sin(a)*w[2]);g.lineTo(Math.cos(a+.18)*(w[2]-7),Math.sin(a+.18)*(w[2]-7));g.lineTo(Math.cos(a+.45)*(w[2]-7),Math.sin(a+.45)*(w[2]-7))}g.closePath();g.fillStyle='#3d3d3d';g.fill();g.strokeStyle='#111';g.lineWidth=2;g.stroke();inPin(g,0,0,11);g.restore()});
 for(i=0;i<4;i++){var rx=-110+i*73;g.save();g.translate(rx,-40);g.rotate(ang*1.4);g.beginPath();g.arc(0,0,19,0,2*PI);g.fillStyle='#4d4d4d';g.fill();g.strokeStyle='#151515';g.lineWidth=2;g.stroke();g.strokeStyle='#777';g.lineWidth=3;g.beginPath();g.moveTo(-14,0);g.lineTo(14,0);g.moveTo(0,-14);g.lineTo(0,14);g.stroke();g.restore()}
 /* turntable + counterweight + house */
 g.fillStyle='#232323';g.fillRect(-100,-100,200,22);
 inRR(g,-262,-196,150,104,22);var cg=g.createLinearGradient(0,-196,0,-92);cg.addColorStop(0,'#ffd84a');cg.addColorStop(1,'#a87b00');g.fillStyle=cg;g.fill();g.strokeStyle='#4a3500';g.lineWidth=3.5;g.stroke();
 g.beginPath();g.moveTo(-150,-96);g.lineTo(150,-96);g.lineTo(156,-150);g.quadraticCurveTo(158,-206,110,-206);g.lineTo(-150,-206);g.closePath();var hg=g.createLinearGradient(0,-206,0,-96);hg.addColorStop(0,'#fff07a');hg.addColorStop(.22,'#ffcb05');hg.addColorStop(1,'#c49100');g.fillStyle=hg;g.fill();g.stroke();
 g.fillStyle='#00274c';g.fillRect(-262,-130,416,13);g.fillStyle='rgba(255,255,255,.25)';g.fillRect(-262,-130,416,3);
 g.strokeStyle='rgba(60,40,0,.65)';g.lineWidth=3;for(i=0;i<6;i++){g.beginPath();g.moveTo(-232+i*16,-186);g.lineTo(-232+i*16,-150);g.stroke()}
 g.font='42px '+MK;g.fillStyle='#00274c';g.fillText('EB-1',-120,-146);
 /* exhaust */
 g.fillStyle='#3a3a3a';g.fillRect(-186,-262,18,66);g.fillStyle='#1a1a1a';g.fillRect(-190,-268,26,10);
 /* cab */
 g.beginPath();g.moveTo(-14,-112);g.lineTo(-14,-322);g.quadraticCurveTo(-14,-338,4,-338);g.lineTo(78,-338);g.lineTo(122,-252);g.lineTo(122,-112);g.closePath();var kg=g.createLinearGradient(-14,0,122,0);kg.addColorStop(0,'#c49100');kg.addColorStop(.25,'#ffcb05');kg.addColorStop(.7,'#ffe45a');kg.addColorStop(1,'#d9a400');g.fillStyle=kg;g.fill();g.strokeStyle='#4a3500';g.lineWidth=3.5;g.stroke();
 /* driver (behind glass) */
 g.fillStyle='#00274c';inRR(g,30,-206,52,60,14);g.fill();g.fillStyle='#f2c79a';g.beginPath();g.arc(56,-230,17,0,2*PI);g.fill();g.fillStyle='#ffcb05';g.beginPath();g.arc(56,-238,19,PI,0);g.fill();g.fillRect(32,-240,50,6);g.fillStyle='#222';g.fillRect(60,-233,4,4);g.strokeStyle='#222';g.lineWidth=2;g.beginPath();g.arc(62,-226,6,.1*PI,.8*PI);g.stroke();
 g.beginPath();g.moveTo(2,-124);g.lineTo(2,-318);g.lineTo(72,-322);g.lineTo(106,-254);g.lineTo(106,-124);g.closePath();var wg=g.createLinearGradient(0,-322,60,-124);wg.addColorStop(0,'rgba(170,215,245,.72)');wg.addColorStop(.5,'rgba(90,140,190,.5)');wg.addColorStop(1,'rgba(20,40,80,.7)');g.fillStyle=wg;g.fill();g.strokeStyle='#00274c';g.lineWidth=3;g.stroke();
 g.save();g.clip();g.fillStyle='rgba(255,255,255,.35)';g.beginPath();g.moveTo(10,-318);g.lineTo(40,-318);g.lineTo(-10,-150);g.lineTo(-40,-150);g.closePath();g.fill();g.fillStyle='rgba(255,255,255,.18)';g.beginPath();g.moveTo(52,-318);g.lineTo(64,-318);g.lineTo(14,-150);g.lineTo(2,-150);g.closePath();g.fill();g.restore();
 /* beacon + headlight housing */
 var bo=Math.sin(t*9)>.0;g.fillStyle='#333';g.fillRect(28,-346,26,8);g.beginPath();g.arc(41,-346,12,PI,0);g.fillStyle=bo?'#ffb020':'#a85a00';g.fill();
 g.fillStyle='#333';inRR(g,116,-236,22,20,5);g.fill();g.fillStyle=t>1.05?'#fff6c8':'#666';g.beginPath();g.arc(134,-226,7,0,2*PI);g.fill();
 /* boom, stick, bucket */
 var k=G.k;
 inCyl(g,128,-106,lerp(EXFX,k.ex,.42)+Math.cos(k.a1+PI/2)*16,lerp(EXFY,k.ey,.42)+Math.sin(k.a1+PI/2)*16,15);
 inArm(g,EXFX,EXFY,k.ex,k.ey,46,34);
 inCyl(g,lerp(EXFX,k.ex,.7)+Math.cos(k.a1-PI/2)*22,lerp(EXFY,k.ey,.7)+Math.sin(k.a1-PI/2)*22,k.ex+Math.cos(k.a2-PI/2)*20-Math.cos(k.a2)*36,k.ey+Math.sin(k.a2-PI/2)*20-Math.sin(k.a2)*36,12);
 inArm(g,k.ex,k.ey,k.wx,k.wy,32,22);
 inCyl(g,lerp(k.ex,k.wx,.25)+Math.cos(k.a2-PI/2)*16,lerp(k.ey,k.wy,.25)+Math.sin(k.a2-PI/2)*16,k.wx+Math.cos(k.a2+G.ba-PI/2)*20,k.wy+Math.sin(k.a2+G.ba-PI/2)*20,10);
 g.save();g.translate(k.wx,k.wy);g.rotate(k.a2+G.ba);g.beginPath();g.moveTo(-12,-30);g.quadraticCurveTo(70,-44,78,14);g.lineTo(66,44);g.lineTo(-16,36);g.closePath();var bg=g.createLinearGradient(0,-40,20,44);bg.addColorStop(0,'#7a7a7a');bg.addColorStop(.5,'#4a4a4a');bg.addColorStop(1,'#262626');g.fillStyle=bg;g.fill();g.strokeStyle='#111';g.lineWidth=3.5;g.stroke();
 g.strokeStyle='rgba(255,255,255,.3)';g.lineWidth=2;g.beginPath();g.moveTo(-6,-26);g.quadraticCurveTo(62,-38,70,10);g.stroke();
 g.fillStyle='#d8dde2';g.strokeStyle='#333';g.lineWidth=1.5;for(i=0;i<5;i++){var tx=-12+i*17;g.beginPath();g.moveTo(tx,37);g.lineTo(tx+8,52);g.lineTo(tx+14,38);g.closePath();g.fill();g.stroke()}
 g.restore();inPin(g,EXFX,EXFY,10);inPin(g,k.ex,k.ey,9);inPin(g,k.wx,k.wy,8);
 g.restore()}
/* ---------- particles ---------- */
function pAdd(o){if(IN.P.length>=700)return;if(IN.lowq&&(o.k==='dust'||o.k==='smoke'||o.k==='bit')&&Math.random()<.4)return;IN.P.push(o)}
function inImpact(G){var R=IN.R,tip=exTip(G),i;IN.ip=tip;inMarkSeen();
 for(i=0;i<90;i++){var a=-PI*.95+R()*PI*1.25,s=500+R()*1500;pAdd({k:'spark',x:tip.x,y:tip.y,vx:Math.cos(a)*s+250,vy:Math.sin(a)*s-200,age:0,life:.4+R()*.8})}
 for(i=0;i<18;i++){a=-PI*.9+R()*PI*.95;s=80+R()*420;pAdd({k:'dust',x:tip.x+(R()-.2)*120,y:tip.y+(R()-.5)*160,vx:Math.cos(a)*s+120,vy:Math.sin(a)*s*.6,age:0,life:1.2+R()*1.2,r:50+R()*50,gr:60+R()*60,al:.52})}
 for(i=0;i<12;i++){pAdd({k:'dust',x:WX0+R()*WW,y:GY-10-R()*30,vx:(R()-.3)*500,vy:-30-R()*80,age:0,life:1.6+R()*1.2,r:40+R()*50,gr:40+R()*60,al:.5})}
 for(i=0;i<38;i++){a=-PI*.8+R()*PI*.9;s=500+R()*1100;pAdd({k:'rock',x:tip.x,y:tip.y,vx:Math.cos(a)*s+300,vy:Math.sin(a)*s-300,age:0,life:4,r:3+R()*8,a:R()*6,va:(R()-.5)*20,c:R()<.5?'#3a2a1c':'#c9975e'})}
 for(i=0;i<40;i++){a=-PI*.9+R()*PI;s=300+R()*900;pAdd({k:'bit',x:WX0+R()*200,y:tip.y+(R()-.5)*300,vx:Math.cos(a)*s+400,vy:Math.sin(a)*s-200,age:0,life:2.5+R()*2,w:6+R()*16,h:4+R()*8,a:R()*6,va:(R()-.5)*16,c:R()<.3?'#ffd21a':'#c9975e'})}
 IN.F.forEach(function(f){var dx=f.x-tip.x,dy=f.y-tip.y,d=Math.hypot(dx,dy)||1,s=Math.max(650,1700-d*1.05)+R()*450;f.go=1;f.del=d/3600;f.vx=dx/d*s+240;f.vy=dy/d*s*.8-320-R()*420;f.va=(R()-.5)*(9+R()*6);f.toward=R()<.34;f.vz=f.toward?.9+R()*1.6:0})}
function inSim(dt){var t=IN.t,R=IN.R,G=exGeo(t),i;
 if(!IN.hit&&t>=T_IMP){IN.hit=1;inImpact(G)}
 /* rumble: dust sifting off the wall top + pebbles hopping */
 if(IN.mode==='full'&&t<3.6&&!IN.hit){if(R()<dt*14)pAdd({k:'dust',x:WX0+R()*WW,y:WY0+4,vx:(R()-.5)*20,vy:70+R()*60,age:0,life:1.4,r:6+R()*10,gr:20,al:.5});
  if(R()<dt*9)pAdd({k:'peb',x:200+R()*1300,y:GY+2+R()*60,vx:(R()-.5)*60,vy:-140-R()*220,age:0,life:1.2,r:2+R()*4,gy:0})}
 /* rolling: track dust + exhaust */
 var sp=exSpeed(t);if(Math.abs(sp)>20&&R()<dt*Math.min(60,Math.abs(sp)/12)){pAdd({k:'dust',x:G.x-200+R()*60,y:GY-8-R()*20,vx:-60-R()*150,vy:-20-R()*70,age:0,life:1.4+R()*1.2,r:18+R()*26,gr:50+R()*50,al:.5})}
 if(t>1.2&&R()<dt*(t>4.2&&t<4.7?40:t<3.6?14:6)){var ex=G.x-177,ey=GY+G.bob-270;pAdd({k:'smoke',x:ex,y:ey,vx:-30-R()*40,vy:-70-R()*60,age:0,life:1.5+R(),r:8+R()*6,gr:40+R()*30,al:t>4.2&&t<4.7?.75:.5})}
 if(IN.hit&&t>T_IMP+.3&&R()<dt*7)pAdd({k:'ember',x:WX0+R()*700,y:GY-R()*80,vx:(R()-.5)*40,vy:-40-R()*80,age:0,life:2+R()*2,r:2+R()*3,ph:R()*6});
 for(i=IN.P.length-1;i>=0;i--){var p=IN.P[i];p.age+=dt;if(p.age>=p.life){IN.P.splice(i,1);continue}
  if(p.k==='spark'){p.vy+=1100*dt;p.vx*=1-1.2*dt}else if(p.k==='rock'||p.k==='bit'||p.k==='peb'){p.vy+=(p.k==='bit'?1300:2000)*dt;if(p.k==='bit'){p.vx*=1-1.6*dt;p.vy=Math.min(p.vy,420)}if(p.a!=null)p.a+=p.va*dt;
   if(p.y>GY+6&&p.vy>0){p.y=GY+6;p.vy*=-.32;p.vx*=.6;if(p.va)p.va*=.5;if(Math.abs(p.vy)<40){p.vy=0;p.vx*=.8}}}
  else if(p.k==='dust'||p.k==='smoke'){p.vx*=1-1.8*dt;p.vy*=1-1.6*dt;if(p.k==='smoke')p.vx-=8*dt;p.r=Math.min(190,p.r+p.gr*dt*(1-p.age/p.life))}
  else if(p.k==='ember'){p.vx+=Math.sin(p.age*3+p.ph)*30*dt}
  p.x+=p.vx*dt;p.y+=p.vy*dt}
 /* wall shards */
 if(IN.hit)IN.F.forEach(function(f){if(!f.go||f.rest)return;if(f.del>0){f.del-=dt;return}f.x+=f.vx*dt;f.y+=f.vy*dt;f.a+=f.va*dt;
  if(f.toward){f.z+=f.vz*dt*f.z;f.vy+=500*dt;f.al=Math.max(0,f.al-dt*1.25);return}
  f.vy+=2300*dt;f.vx*=1-.5*dt;var b=GY-f.sz*.16;if(f.y>b&&f.vy>0){f.y=b;f.vy*=-.28;f.vx*=.55;f.va*=.45;if(Math.abs(f.vy)<70){f.rest=1;f.vy=0}}})}
/* ---------- camera ---------- */
function inCam(t){var cx,cy=500,z;if(t<1.3){cx=700;z=1.0}else if(t<3.5){cx=lerp(700,780,eio(iseg(t,1.3,3.5)));z=1}else if(t<T_IMP){var u=eio(iseg(t,3.5,T_IMP));cx=lerp(780,745,u);z=lerp(1,1.07,u);cy=lerp(500,486,u)}
 else{var v=eo3(iseg(t,T_IMP,T_IMP+.8));cx=lerp(745,826,v);z=lerp(.965,1,v)+.014*iseg(t,T_IMP+.8,T_IMP+6);cy=lerp(486,500,v)}var s=inShake(t);return{cx:cx,cy:cy,z:z,sx:s.x,sy:s.y}}
function inShake(t){var a=0;if(IN.mode==='full'&&t<3.6&&!IN.skipped)a=2.6*Math.sin(PI*iseg(t,0,3.6));
 var u=(t-T_IMP)/.9;if(u>=0&&u<1)a+=34*Math.pow(1-u,2.5);if(a<=0)return{x:0,y:0,a:0};return{x:a*(Math.sin(t*83.1)*.62+Math.sin(t*137.7+1.3)*.38),y:a*(Math.sin(t*97.3+.7)*.6+Math.sin(t*151.1+2.1)*.4),a:a}}
/* ---------- render ---------- */
function inDraw(){var g=IN.g,t=IN.t,dp=IN.dpr,W=IN.cv.width,H=IN.cv.height,cam=inCam(t),G=exGeo(t),i;
 if(!IN.sky)inResize();
 function L(p){var k=IN.s*dp*(1+(cam.z-1)*p),cx=800+(cam.cx-800)*p,cy=500+(cam.cy-500)*p;g.setTransform(k,0,0,k,W/2-cx*k+cam.sx*p*IN.s*dp,H/2-cy*k+cam.sy*p*IN.s*dp)}
 g.setTransform(1,0,0,1,0,0);g.globalAlpha=1;g.globalCompositeOperation='source-over';g.drawImage(IN.sky,0,0);
 /* far mountains */
 L(.12);g.beginPath();g.moveTo(-1000,1400);SC.mA.forEach(function(q){g.lineTo(q[0],q[1])});g.lineTo(2600,1400);g.closePath();var mg=g.createLinearGradient(0,470,0,760);mg.addColorStop(0,'#4a2a5e');mg.addColorStop(1,'#8a3f5a');g.fillStyle=mg;g.fill();
 L(.2);g.beginPath();g.moveTo(-1000,1400);SC.mB.forEach(function(q){g.lineTo(q[0],q[1])});g.lineTo(2600,1400);g.closePath();g.fillStyle='#3a2048';g.fill();
 /* city + tower cranes */
 L(.34);g.fillStyle='#1f1430';SC.bld.forEach(function(b){g.fillRect(b[0],770-b[2],b[1],b[2]+300)});g.fillStyle='rgba(255,205,110,.75)';SC.win.forEach(function(w){g.fillRect(w[0],w[1],6,8)});
 [[260,1],[1420,-1]].forEach(function(c){var x=c[0],d=c[1];g.strokeStyle='#1a1028';g.lineWidth=3;g.fillStyle='#1a1028';g.fillRect(x-10,230,20,560);g.beginPath();for(var y=240;y<780;y+=26){g.moveTo(x-10,y);g.lineTo(x+10,y+26);g.moveTo(x+10,y);g.lineTo(x-10,y+26)}g.stroke();
  g.fillRect(x-130*d,226,(130+420)*d,12);g.beginPath();for(var j=0;j<420;j+=24){g.moveTo(x+j*d,226);g.lineTo(x+(j+12)*d,208);g.lineTo(x+(j+24)*d,226)}g.moveTo(x,180);g.lineTo(x+420*d,226);g.moveTo(x,180);g.lineTo(x-130*d,226);g.stroke();g.fillRect(x-6,170,12,60);g.fillRect(x-130*d,236,60*d,28);
  var hx=x+(250+Math.sin(t*.6)*20)*d;g.lineWidth=2;g.beginPath();g.moveTo(hx,238);g.lineTo(hx,420);g.stroke();g.fillRect(hx-6,420,12,10);
  var bl=((t*1.2+(d>0?0:.5))%1)<.5;g.fillStyle=bl?'#ff3a2a':'#5a1410';g.beginPath();g.arc(x+420*d,226,5,0,2*PI);g.arc(x,172,5,0,2*PI);g.fill();if(bl){g.globalCompositeOperation='lighter';g.globalAlpha=.6;g.drawImage(ISP.glow,x+420*d-18,208,36,36);g.drawImage(ISP.glow,x-18,154,36,36);g.globalAlpha=1;g.globalCompositeOperation='source-over'}});
 /* mounds + cones */
 L(.62);[[-260,560,150],[170,380,80],[1260,600,160],[1800,520,110]].forEach(function(m){g.beginPath();g.moveTo(m[0]-m[1]/2,GY+30);g.quadraticCurveTo(m[0]-m[1]*.25,GY-m[2],m[0],GY-m[2]);g.quadraticCurveTo(m[0]+m[1]*.25,GY-m[2],m[0]+m[1]/2,GY+30);g.closePath();var dg=g.createLinearGradient(0,GY-m[2],0,GY);dg.addColorStop(0,'#4a3020');dg.addColorStop(1,'#24160e');g.fillStyle=dg;g.fill();
  g.strokeStyle='rgba(255,150,70,.5)';g.lineWidth=3;g.beginPath();g.moveTo(m[0]-m[1]*.3,GY-m[2]*.7);g.quadraticCurveTo(m[0],GY-m[2]*1.05,m[0]+m[1]*.3,GY-m[2]*.7);g.stroke()});
 [[560],[1500],[1560]].forEach(function(c){var x=c[0];g.fillStyle='#e8561a';g.beginPath();g.moveTo(x-22,GY+20);g.lineTo(x,GY-50);g.lineTo(x+22,GY+20);g.closePath();g.fill();g.fillStyle='#f4efe6';g.fillRect(x-12,GY-18,24,9);g.fillStyle='#1d1d1d';g.fillRect(x-30,GY+16,60,8)});
 /* ground */
 L(1);var gg=g.createLinearGradient(0,GY,0,GY+260);gg.addColorStop(0,'#7a5232');gg.addColorStop(.25,'#5a3a22');gg.addColorStop(1,'#24150b');g.fillStyle=gg;g.fillRect(-1500,GY,4200,700);
 g.fillStyle='rgba(255,180,100,.35)';g.fillRect(-1500,GY,4200,3);
 g.fillStyle='rgba(30,18,8,.45)';for(i=-900;i<320;i+=30){g.fillRect(i,GY+34,18,6);g.fillRect(i+8,GY+72,18,7)}
 SC.peb.forEach(function(q){g.fillStyle=q[3]<.5?'rgba(40,26,14,.8)':'rgba(150,110,70,.7)';g.beginPath();g.ellipse(q[0],q[1],q[2],q[2]*.6,0,0,2*PI);g.fill()});
 /* revealed: sun rays + logo (behind the wall) */
 var lt=t-T_IMP;if(IN.hit){inLogo();var ra=clamp(lt/.3,0,1);g.save();g.translate(LGX,LGY);g.rotate(t*.12);g.globalCompositeOperation='lighter';g.globalAlpha=.42*ra;var rs=1100*(.6+.4*eo3(clamp(lt/.5,0,1)));g.drawImage(ISP.rays,-rs,-rs,rs*2,rs*2);g.restore();
  g.save();g.globalCompositeOperation='lighter';g.globalAlpha=Math.min(1,(.5+.18*Math.sin(t*3))+Math.max(0,1-lt/.6)*1.2)*ra;g.drawImage(ISP.glow,LGX-700,LGY-420,1400,840);g.restore()}
 /* wall (whole before the smash, shards after) */
 L(1);var wob=IN.mode==='full'&&t<3.6?Math.sin(t*41)*1.2*Math.sin(PI*iseg(t,0,3.6)):0;
 if(!IN.hit){g.drawImage(inWall(),WX0,WY0+wob,WW,WH);var sg2=g.createLinearGradient(0,GY-6,0,GY+40);sg2.addColorStop(0,'rgba(0,0,0,.5)');sg2.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=sg2;g.fillRect(WX0-20,GY,WW+40,40)}
 else IN.F.forEach(function(f){if(f.toward&&!f.del&&f.go&&f.al<=0)return;if(f.toward&&f.del<=0)return;g.save();g.translate(f.x,f.y);g.rotate(f.a);g.drawImage(inFragCv(f),f.mnx-f.lx,f.mny-f.ly,f.bw,f.bh);g.restore()});
 /* headlight beam + light pool on the wall */
 if(t>1.05){var on=t<1.25?((t*30)|0)%2:1;if(on){var hx=G.x+134,hy=GY+G.bob-226;g.save();g.globalCompositeOperation='lighter';var hb=g.createLinearGradient(hx,hy,hx+900,hy+120);hb.addColorStop(0,'rgba(255,240,190,.32)');hb.addColorStop(1,'rgba(255,240,190,0)');g.fillStyle=hb;g.beginPath();g.moveTo(hx,hy-6);g.lineTo(hx+950,hy-150);g.lineTo(hx+950,hy+330);g.lineTo(hx,hy+8);g.closePath();g.fill();g.globalAlpha=.55;g.drawImage(ISP.hot,hx-26,hy-26,52,52);g.restore()}}
 /* excavator */
 g.fillStyle='rgba(0,0,0,.45)';g.beginPath();g.ellipse(G.x,GY+4,260,16,0,0,2*PI);g.fill();
 if(G.x>-700)drawExcav(g,G,t);
 /* beacon glow */
 if(t>1.3&&G.x>-700){g.save();g.globalCompositeOperation='lighter';var bx2=G.x+41,by2=GY+G.bob-350,bl2=.5+.5*Math.sin(t*9);g.globalAlpha=.25+.55*bl2;g.drawImage(ISP.glow,bx2-60,by2-60,120,120);g.globalAlpha=.18*bl2;g.translate(bx2,by2);g.rotate(t*4.5);g.fillStyle='rgba(255,180,60,1)';g.beginPath();g.moveTo(0,0);g.lineTo(380,-40);g.lineTo(380,40);g.closePath();g.fill();g.restore()}
 /* particles */
 for(i=0;i<IN.P.length;i++){var p=IN.P[i],u=p.age/p.life;
  if(p.k==='dust'||p.k==='smoke'){g.globalAlpha=p.al*(1-u)*Math.min(1,p.age*8);g.drawImage(p.k==='dust'?ISP.dust:ISP.smoke,p.x-p.r,p.y-p.r,p.r*2,p.r*2)}}
 g.globalAlpha=1;
 /* logo in front of the dust so it always reads */
 if(IN.hit){var sc=lt<0?1.6:lerp(1.55,1,eBack(iseg(lt,0,.5))),rot=lerp(-.12,-.035,eo3(iseg(lt,0,.5)))+(lt>.6?Math.sin(t*1.3)*.008:0),fl=lt>.6?Math.sin(t*1.7)*4:0,la=clamp(lt/.07,0,1);
  g.save();g.translate(LGX,LGY+fl);g.rotate(rot);g.scale(sc,sc);g.globalAlpha=la;g.globalCompositeOperation='lighter';g.globalAlpha=la*(.55+.2*Math.sin(t*3.2)+Math.max(0,.8-lt));g.drawImage(IN.glow,-LGW/2,-LGH/2,LGW,LGH);g.globalCompositeOperation='source-over';g.globalAlpha=la;
  g.drawImage(IN.logo,-LGW/2,-LGH/2,LGW,LGH);
  var gt0=lt-1.1,gp=gt0>=0?(gt0%3.4)/.75:2;if(gp<1){var gc=IN.glint,q=gc.getContext('2d');q.setTransform(1,0,0,1,0,0);q.globalCompositeOperation='source-over';q.clearRect(0,0,gc.width,gc.height);q.drawImage(IN.logo,0,0);q.globalCompositeOperation='source-in';var bx=lerp(-.3,1.3,eio(gp))*gc.width,bgd=q.createLinearGradient(bx-gc.width*.12,0,bx+gc.width*.12,gc.height*.3);bgd.addColorStop(0,'rgba(255,255,255,0)');bgd.addColorStop(.5,'rgba(255,255,255,.85)');bgd.addColorStop(1,'rgba(255,255,255,0)');q.fillStyle=bgd;q.fillRect(0,0,gc.width,gc.height);g.globalCompositeOperation='lighter';g.globalAlpha=.75;g.drawImage(gc,-LGW/2,-LGH/2,LGW,LGH)}
  g.restore()}
 g.globalAlpha=1;g.globalCompositeOperation='source-over';
 for(i=0;i<IN.P.length;i++){p=IN.P[i];u=p.age/p.life;
  if(p.k==='rock'||p.k==='peb'){g.globalAlpha=1-Math.max(0,(u-.8)*5);g.fillStyle=p.c||'#2c1c10';g.beginPath();g.ellipse(p.x,p.y,p.r,p.r*.7,p.a||0,0,2*PI);g.fill()}
  else if(p.k==='bit'){g.globalAlpha=1-Math.max(0,(u-.8)*5);g.save();g.translate(p.x,p.y);g.rotate(p.a);g.fillStyle=p.c;g.fillRect(-p.w/2,-p.h/2,p.w,p.h);g.restore()}}
 g.globalAlpha=1;g.globalCompositeOperation='lighter';
 for(i=0;i<IN.P.length;i++){p=IN.P[i];u=p.age/p.life;if(p.k==='spark'){g.globalAlpha=1-u;g.strokeStyle=u<.3?'#fff7d0':u<.6?'#ffc640':'#ff6a10';g.lineWidth=3*(1-u)+1;g.beginPath();g.moveTo(p.x,p.y);g.lineTo(p.x-p.vx*.025,p.y-p.vy*.025);g.stroke()}
  else if(p.k==='ember'){g.globalAlpha=(1-u)*(.6+.4*Math.sin(p.age*12+p.ph));g.drawImage(ISP.glow,p.x-p.r*4,p.y-p.r*4,p.r*8,p.r*8)}}
 g.globalAlpha=1;g.globalCompositeOperation='source-over';
 /* shards flying toward the camera (projected out from the camera centre) */
 if(IN.hit)IN.F.forEach(function(f){if(!f.toward||f.del>0||f.al<=0)return;var px=cam.cx+(f.x-cam.cx)*f.z,py=cam.cy+(f.y-cam.cy)*f.z;g.save();g.globalAlpha=f.al;g.translate(px,py);g.rotate(f.a);g.scale(f.z,f.z);g.drawImage(inFragCv(f),f.mnx-f.lx,f.mny-f.ly,f.bw,f.bh);g.restore()});
 g.globalAlpha=1;
 /* impact: shockwave + speed lines */
 if(IN.hit&&lt<.55&&IN.ip){var su=lt/.5;g.strokeStyle='rgba(255,255,255,'+(.75*(1-su))+')';g.lineWidth=26*(1-su)+2;g.beginPath();g.arc(IN.ip.x,IN.ip.y,40+eo3(su)*720,0,2*PI);g.stroke();
  if(lt<.28){g.strokeStyle='rgba(255,250,220,'+(.8*(1-lt/.28))+')';g.lineWidth=5;g.beginPath();for(i=0;i<28;i++){var aa=i/28*2*PI+.1,r0=120+(i%3)*40+lt*900,r1=r0+220+(i%4)*60;g.moveTo(IN.ip.x+Math.cos(aa)*r0,IN.ip.y+Math.sin(aa)*r0);g.lineTo(IN.ip.x+Math.cos(aa)*r1,IN.ip.y+Math.sin(aa)*r1)}g.stroke()}}
 /* foreground silhouettes */
 L(1.45);g.fillStyle='#0c0704';g.beginPath();g.moveTo(-200,1100);g.lineTo(-200,930);g.lineTo(-60,900);g.lineTo(40,925);g.lineTo(140,905);g.lineTo(260,950);g.lineTo(330,1100);g.closePath();g.fill();
 g.beginPath();g.moveTo(1240,1100);g.lineTo(1300,950);g.lineTo(1400,930);g.lineTo(1500,905);g.lineTo(1620,930);g.lineTo(1800,915);g.lineTo(1800,1100);g.closePath();g.fill();
 g.strokeStyle='#0c0704';g.lineWidth=7;g.beginPath();g.moveTo(1380,940);g.lineTo(1350,820);g.moveTo(1430,935);g.lineTo(1460,800);g.lineTo(1500,790);g.stroke();
 g.globalAlpha=.1;for(i=0;i<6;i++){var mx=((i*347+t*(14+i*5))%2000)-200,my=200+((i*211)%600)+Math.sin(t*.5+i)*20;g.drawImage(ISP.dust,mx-90,my-90,180,180)}g.globalAlpha=1;
 /* ---- screen space ---- */
 g.setTransform(1,0,0,1,0,0);g.drawImage(IN.vig,0,0);
 var S=IN.s*dp,bh=H*.085*(1-eo3(iseg(t,T_IMP-.05,T_IMP+.5)));if(bh>.5){g.fillStyle='#000';g.fillRect(0,0,W,bh);g.fillRect(0,H-bh,W,bh)}
 if(IN.mode==='full'&&!IN.skipped&&t>.4&&t<2.4){var pa=Math.min(iseg(t,.4,.9),1-iseg(t,1.9,2.4));if(!IN.pres||IN.pres.k!==S){IN.pres=inTextCv('ALEX AND FRIENDS PRESENT',Math.round(44*S),Math.round(12*S),'#ffffff',null,'rgba(255,150,60,.95)');IN.pres.k=S}
  var pz=lerp(.94,1.04,iseg(t,.4,2.4));g.save();g.globalAlpha=pa;g.translate(W/2,H*.3);g.scale(pz,pz);g.drawImage(IN.pres.c,-IN.pres.w/2,-IN.pres.h/2);g.restore()}
 if(IN.mode==='full'&&!IN.hit&&t>.8){g.save();g.globalAlpha=.5;g.font=Math.round(17*S)+'px '+MK;g.textAlign='right';g.textBaseline='bottom';g.fillStyle='#fff';g.fillText('tap to skip ⏩',W-18*S,H-bh-12*S);g.restore()}
 if(IN.mode==='full'&&t>=IN.tTap&&!IN.ending){var tu=t-IN.tTap,ps=eBack(iseg(tu,0,.4))*(1+.06*Math.sin(tu*5.5)),pa2=Math.min(1,tu/.15);
  if(!IN.tapc||IN.tapc.k!==S){IN.tapc=inTextCv('TAP TO PLAY',Math.round(78*S),Math.round(3*S),['#ffffff','#ffe45c','#ffb000'],'#05112a','rgba(255,190,40,.9)');IN.tapc.k=S}
  g.save();g.translate(W/2,H*.9);g.scale(ps,ps);g.globalAlpha=pa2;g.drawImage(IN.tapc.c,-IN.tapc.w/2,-IN.tapc.h/2);g.globalCompositeOperation='lighter';g.globalAlpha=pa2*(.25+.25*Math.sin(tu*5.5));g.drawImage(IN.tapc.c,-IN.tapc.w/2,-IN.tapc.h/2);g.globalCompositeOperation='source-over';g.globalAlpha=pa2;
  g.font=Math.round(62*S)+'px sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText('👆',IN.tapc.tw/2+72*S,(Math.sin(tu*7)*6+6)*S);g.restore()}
 /* impact frame: 1 inverted frame, then a white flash */
 if(IN.hit&&lt<.012){g.globalCompositeOperation='difference';g.fillStyle='#fff';g.fillRect(0,0,W,H);g.globalCompositeOperation='source-over'}
 else if(IN.hit&&lt<.13){g.fillStyle='rgba(255,250,235,'+(.7*Math.pow(1-iseg(lt,.012,.13),2))+')';g.fillRect(0,0,W,H)}
 /* fade in from black */
 var fi=IN.mode==='full'?1-iseg(t,0,.9):1-iseg(t,IN.t0,IN.t0+.2);if(fi>0){g.fillStyle='rgba(0,0,0,'+fi+')';g.fillRect(0,0,W,H)}}
/* ---------- sound cues (real CC0 recordings; see CREDITS.md) ---------- */
function ip(k,vol,rate,loop){if(!aok())return null;var a=SMP[k];if(!a||!a.length)return null;try{var s=AC.createBufferSource(),g=AC.createGain();s.buffer=a[0];s.playbackRate.value=rate||1;s.loop=!!loop;g.gain.value=vol;s.connect(g);g.connect(sfxBus);s.start();var o={s:s,g:g,loop:!!loop};IN.snd.push(o);return o}catch(e){return null}}
function ipStop(o,d){if(!o)return;try{var n=AC.currentTime;o.g.gain.cancelScheduledValues(n);o.g.gain.setValueAtTime(o.g.gain.value,n);o.g.gain.linearRampToValueAtTime(0,n+d);o.s.stop(n+d+.05)}catch(e){}}
var CUES=[[.05,'rumble'],[1.2,'engine'],[1.35,'tracks'],[3.55,'rev'],[4.3,'swing'],[T_IMP,'smash'],[T_IMP+.08,'debris'],[T_IMP+1.3,'idle']];
function inCue(c){var n=AC&&AC.currentTime;switch(c){
 case 'rumble':ip('intro_rumble',.95);break;
 case 'engine':if(!IN.eng)IN.eng=ip('engine',0,.8,true);if(IN.eng){IN.eng.g.gain.setValueAtTime(0,n);IN.eng.g.gain.linearRampToValueAtTime(.5,n+.5)}break;
 case 'tracks':ip('intro_tracks',.8,1);break;
 case 'rev':if(IN.eng)try{IN.eng.s.playbackRate.setTargetAtTime(1.45,n,.15);IN.eng.g.gain.setTargetAtTime(.65,n,.1)}catch(e){}break;
 case 'swing':playSample('whoosh',.9,null,.72,0,true);break;
 case 'smash':ip('intro_smash',1);if(!IN.eng)IN.eng=ip('engine',.3,1.1,true);playSample('boom',.75,null,.85,0,true);if(IN.eng)try{IN.eng.s.playbackRate.setTargetAtTime(1.1,n+.3,.3)}catch(e){}break;
 case 'debris':ip('intro_debris',.8);break;
 case 'idle':if(IN.eng)try{IN.eng.s.playbackRate.setTargetAtTime(.9,n,.4);IN.eng.g.gain.setTargetAtTime(.22,n,.5)}catch(e){}break}}
function inCues(){if(!AC)return;var t=IN.t;CUES.forEach(function(c){if(IN.fired[c[1]]||t<c[0])return;if(aok()){IN.fired[c[1]]=1;if(t-c[0]<.35)inCue(c[1])}else if(t-c[0]>=.35)IN.fired[c[1]]=1});
 if(IN.eng&&t>1.2&&t<3.55){try{IN.eng.s.playbackRate.setTargetAtTime(.85+Math.min(.45,Math.abs(exSpeed(t))/1600),AC.currentTime,.1)}catch(e){}}
 if(!IN.stung&&t<T_IMP+.3&&MZ.buf.sting){if(mzSting(Math.max(0,T_IMP-t)))IN.stung=true}}
/* ---------- control ---------- */
function inStart(mode,replay){inEl();IN.mode=mode==='quick'?'quick':'full';IN.on=true;IN.ending=false;IN.paused=false;IN.hit=0;IN.ip=null;IN.skipped=false;IN.stung=false;IN.fired={};IN.P=[];IN.R=rng(20261114);IN.F=inFrags();IN.last=0;IN.fc=0;IN.fs=0;
 IN.snd.forEach(function(o){if(o.loop)ipStop(o,.2)});IN.snd=[];IN.eng=null;mzLoopOff(.4);if(MZ.full){mzKill(MZ.full,.4);MZ.full=null}
 IN.t=IN.mode==='quick'?T_IMP-.6:0;IN.t0=IN.t;IN.tTap=T_IMP+1.9;IN.tEnd=T_IMP+1.0;IN.dts=[];
 CUES.forEach(function(c){if(c[0]<IN.t)IN.fired[c[1]]=1});if(IN.mode==='quick'){IN.fired.rumble=1;IN.fired.tracks=1}
 IN.st=performance.now();IN.el.style.display='';IN.el.classList.remove('out');inResize();cancelAnimationFrame(IN.raf);IN.raf=requestAnimationFrame(inFrame);
 if(IN.mode==='quick'&&aok()&&!IN.eng){IN.eng=ip('engine',.3,1,true)}}
function inFrame(ts){if(!IN.on)return;IN.raf=requestAnimationFrame(inFrame);var dt=IN.last?Math.min(.05,(ts-IN.last)/1000):1/60;IN.last=ts;if(IN.paused)return;if(IN.dts&&IN.dts.length<900)IN.dts.push(dt*1000);
 if(IN.fc<60){IN.fc++;if(IN.fc===60&&!IN.lowq&&IN.dpr>1.25){var md=(IN.dts||[]).slice(15).sort(function(x,y){return x-y});md=md[md.length>>1]||0;if(md>21){IN.lowq=1;inResize()}}}
 inStep(dt);try{inDraw()}catch(e){}}
function inStep(dt){var ts=(IN.t>=T_IMP&&IN.t<T_IMP+.03)?.2:1,d=dt*ts;IN.t+=d;inSim(d);if(!IN.silent)inCues();if(IN.mode==='quick'&&!IN.ending&&(IN.t>=IN.tEnd||(!IN.silent&&performance.now()-IN.st>1750)))inEnd()}
function inJump(){/* skip straight to the smash so the payoff (and its sound) still lands */IN.skipped=true;IN.t=T_IMP-.14;CUES.forEach(function(c){if(c[0]<IN.t)IN.fired[c[1]]=1});IN.tTap=T_IMP+.9;IN.P=IN.P.filter(function(p){return p.k!=='peb'});
 if(!IN.eng&&aok())IN.eng=ip('engine',.3,1,true)}
function inTap(){if(!IN.on||IN.ending)return;var n=performance.now();if(n-IN.lastTap<300)return;IN.lastTap=n;
 if(IN.mode==='full'&&IN.t<T_IMP-.2){inJump();return}if(IN.mode==='full'&&IN.t<T_IMP+.45)return;inEnd()}
function inEnd(now){if(!IN.on||IN.ending&&!now)return;IN.ending=true;inMarkSeen();IN.snd.forEach(function(o){if(o.loop)ipStop(o,.5)});IN.el.classList.add('out');
 function fin(){if(!IN.ending)return;IN.on=false;cancelAnimationFrame(IN.raf);IN.el.style.display='none';IN.el.classList.remove('out');IN.P=[];IN.F=[];IN.wall=null;IN.logo=null;IN.glow=null;IN.glint=null;IN.snd=[];IN.eng=null;IN.ending=false;try{drawTitleBox()}catch(e){}}
 if(now)fin();else setTimeout(fin,470)}
function inSeek(t,mode){inStart(mode||IN.mode||'full');IN.silent=true;var n=0;while(IN.t<t&&n++<4000)inStep(1/60);IN.silent=false;IN.paused=true;inDraw();return IN.t}
window.EBI={state:function(){var s=inShake(IN.t);return{on:IN.on,mode:IN.mode,t:+IN.t.toFixed(3),hit:!!IN.hit,ending:IN.ending,shake:+s.a.toFixed(4),parts:IN.P.length,shards:IN.F.length,dpr:IN.dpr,lowq:!!IN.lowq,seen:inSeen(),tap:IN.mode==='full'&&IN.t>=IN.tTap,au:AC?AC.state:null,fired:Object.keys(IN.fired)}},
 play:function(m){inStart(m||'full');return IN.mode},seek:function(t,m){return inSeek(t,m)},pause:function(p){IN.paused=p!==false;return IN.paused},tap:function(){inTap();return IN.t},end:function(){inEnd(true);return IN.on},
 shakeAt:function(t){return inShake(t).a},music:function(){return{have:MZ.have,cfg:MZ.cfg,loaded:Object.keys(MZ.buf),loop:!!MZ.loop,full:!!MZ.full,sting:!!MZ.sting,nodes:!!MZ.dg,duck:MZ.dg?+MZ.dg.gain.value.toFixed(3):null}},
 perf:function(){var a=(IN.dts||[]).slice(5).sort(function(x,y){return x-y});if(!a.length)return null;return{n:a.length,avg:+(a.reduce(function(s,v){return s+v},0)/a.length).toFixed(2),p95:+a[Math.floor(a.length*.95)].toFixed(2),max:+a[a.length-1].toFixed(2)}},
 drawCost:function(n){n=n||30;var t0=performance.now();for(var i=0;i<n;i++)inDraw();return +((performance.now()-t0)/n).toFixed(2)},
 snd:function(){return{key:SNDK,s:JSON.parse(JSON.stringify(SND)),sfx:sfxBus?+sfxBus.gain.value.toFixed(3):null,mus:musBus?+musBus.gain.value.toFixed(3):null}},duck:function(){mzDuck(.35,.7);return true}};
/* boot: full intro on a kid's first launch, a ~2 s quick version after that; ?intro=full|quick forces one, ?nointro skips it */
(function(){var q=location.search,f=(q.match(/[?&]intro=(full|quick)\b/)||[])[1];if(/[?&]nointro\b/.test(q))return;var m=f||(inSeen()?'quick':'full');try{aInit()}catch(e){}inStart(m)})();
