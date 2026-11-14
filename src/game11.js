/* ===== v1.10.0: Challenge Dad, synced across devices through a private ntfy.sh topic (no app, no accounts) =====
   Sending: {v,code,name,score,kid,from,cid}. "from" is a random per-device id (not personal) so a device doesn't show its own challenges.
   Offline/failed sends are queued in localStorage and retried on load, on 'online' and every 60s. At most 1 push per 30s.
   Receiving: on load + on returning to the home screen, poll the topic. ntfy.sh keeps messages 12h for anonymous users,
   so everything fetched is cached here in localStorage. */
var DADURL='https://ntfy.sh/'+'wilson-exb-s4q2dpakqoa64ch6tngzojmm',DQK='aeb_dadq',DLK='aeb_dadlast',DIK='aeb_chin',DSK='aeb_chsince',DTK='aeb_tally',DEVK='aeb_dev',DCAP=30000;
function lsG(k,d){try{var v=JSON.parse(localStorage.getItem(k)||'null');return v==null?d:v}catch(e){return d}}
function lsS(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
function rid(n){var c='abcdefghijklmnopqrstuvwxyz0123456789',s='',a;try{a=new Uint8Array(n);crypto.getRandomValues(a)}catch(e){a=[];for(var j=0;j<n;j++)a.push((Math.random()*256)|0)}for(var i=0;i<n;i++)s+=c[a[i]%36];return s}
var DEV=lsG(DEVK,null);if(typeof DEV!=='string'||DEV.length<6){DEV=rid(12);lsS(DEVK,DEV)}
function kidName(k){return k==='zoe'?'Zoe':'Alex'}
/* ---------- UI ---------- */
(function(){var st=document.createElement('style');st.textContent=
 '#dadcel{z-index:34;overflow:hidden}#dadcel .card{width:min(92vw,680px);text-align:center;position:relative;z-index:2}'+
 '#dadcel h2{font-size:min(7.5vmin,58px);color:#e8342a;-webkit-text-stroke:2px #3a1d00;margin:4px 0;animation:dcPop .6s cubic-bezier(.2,1.6,.4,1) both}'+
 '@keyframes dcPop{0%{transform:scale(.2) rotate(-12deg)}100%{transform:scale(1) rotate(-2deg)}}'+
 '#dcName{font-size:34px;color:#1f3a6e}#dcScore{font-size:28px;color:#2f8a3a;margin:6px 0}#dcStat{font-size:24px;min-height:34px;color:#6b4520;margin:6px 0}#dcStat.ok{color:#2f8a3a}#dcStat.wait{color:#b36b00}'+
 '#dcOk{font-size:30px;min-height:66px;min-width:200px}'+
 '.cf{position:absolute;top:-30px;width:14px;height:22px;border-radius:3px;z-index:1;animation:cfFall linear forwards;pointer-events:none}'+
 '@keyframes cfFall{0%{transform:translateY(0) rotate(0)}100%{transform:translateY(115vh) rotate(900deg)}}'+
 '#chBan{position:absolute;left:50%;top:calc(12px + env(safe-area-inset-top));transform:translateX(-50%);z-index:4;display:none;align-items:center;gap:10px;min-height:66px;padding:8px 22px;border-radius:20px;font-size:min(4.2vmin,30px);color:#3a1d00;background:linear-gradient(180deg,#ffe36b,#ffc21f);box-shadow:0 5px 0 #b8860a,0 8px 18px #0006;white-space:nowrap;cursor:pointer}'+
 '#chBan.new{animation:chPulse 1.1s ease-in-out infinite}#chBan.old{font-size:min(3.4vmin,24px);background:linear-gradient(180deg,#fff2c0,#f3d27a)}'+
 '@keyframes chPulse{0%,100%{transform:translateX(-50%) scale(1)}50%{transform:translateX(-50%) scale(1.07)}}'+
 '#chBan .cnt{display:inline-block;min-width:44px;height:44px;line-height:44px;border-radius:22px;background:#e8342a;color:#fff;font-size:28px;text-align:center;box-shadow:0 3px 0 #8a1a12}'+
 '#chl{z-index:31}#chl .card{width:min(94vw,700px)}#chTal{font-size:30px;color:#1f3a6e;margin:4px 0 8px}#chRows{display:flex;flex-direction:column;gap:8px;max-height:52vh;overflow:auto;margin:6px 0}'+
 '.chr{display:flex;align-items:center;gap:10px;background:#fff7e3;border-radius:14px;padding:6px 10px;text-align:left}.chr b{flex:1;font-size:24px;color:#1f3a6e;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.chr small{display:block;font-size:17px;color:#6b4520}'+
 '.chr .tagn{font-size:18px;padding:4px 10px;border-radius:10px;background:#e8342a;color:#fff;white-space:nowrap}.chr .tagr{font-size:18px;white-space:nowrap;color:#2f8a3a}'+
 '.chr .btn{min-width:78px;min-height:64px;font-size:28px;margin:0}'+
 '#dadRes{display:none;margin:4px 0 6px}#dadRes .big{font-size:min(7vmin,52px);-webkit-text-stroke:2px #3a1d00;animation:dcPop .6s cubic-bezier(.2,1.6,.4,1) both}#dadRes .sub{font-size:22px;color:#1f3a6e}';
 document.head.appendChild(st);
 var c=document.createElement('div');c.id='dadcel';c.className='ov';c.innerHTML='<div class="card cb"><div style="font-size:64px;line-height:1">📣🚜🏆</div><h2 class="mk">Dad has been CHALLENGED!</h2><div id="dcName" class="mk"></div><div id="dcScore" class="mk"></div><div id="dcStat" class="mk"></div><button id="dcOk" class="btn">🎉 Yeah!</button></div>';document.body.appendChild(c);
 var l=document.createElement('div');l.id='chl';l.className='ov';l.innerHTML='<div class="card cb"><h2 class="mk">🏆 Challenges from Alex</h2><div id="chTal" class="mk"></div><div id="chRows"></div><button id="chlX" class="btn alt">Close</button></div>';document.body.appendChild(l);
 var b=document.createElement('button');b.id='chBan';b.className='mk';$('title').appendChild(b);
 var r=document.createElement('div');r.id='dadRes';var g=$('grandMsg');g.parentNode.insertBefore(r,g)})();
function confettiDom(el,n){var cols=['#ffcb05','#2f8a3a','#e8342a','#1f6fd1','#ff7ac8','#7a4bc4','#fff'];[].forEach.call(el.querySelectorAll('.cf'),function(x){x.remove()});
 for(var i=0;i<n;i++){var d=document.createElement('div');d.className='cf';d.style.left=(Math.random()*100)+'%';d.style.background=cols[i%7];d.style.animationDuration=(2.2+Math.random()*2.2)+'s';d.style.animationDelay=(Math.random()*1.2)+'s';d.style.width=(8+Math.random()*10)+'px';el.appendChild(d)}}
function tw(k){return k+' throw'+(k===1?'':'s')}
/* ---------- sending ---------- */
var DQ={busy:false,t:0,cur:null};
function dqList(){var q=lsG(DQK,[]);return Array.isArray(q)?q:[]}
function dcStat(txt,cls){var e=$('dcStat');if(!e)return;e.textContent=txt;e.className='mk'+(cls?' '+cls:'')}
function dqStatus(){if(!DQ.cur||!$('dadcel').classList.contains('on'))return;var q=dqList(),inq=q.some(function(x){return x.p.cid===DQ.cur});
 if(!inq){dcStat('✅ Sent to Dad!','ok');return}
 if(navigator.onLine===false||q.some(function(x){return x.p.cid===DQ.cur&&x.fail})){dcStat('📶 We\'ll send it when the internet\'s back.','wait');return}
 dcStat('📡 Sending to Dad…','wait')}
function dqFlush(){if(DQ.busy)return;var q=dqList();if(!q.length){dqStatus();return}
 var wait=(+lsG(DLK,0)||0)+DCAP-Date.now();if(wait>0){clearTimeout(DQ.t);DQ.t=setTimeout(dqFlush,Math.min(wait,DCAP)+60);dqStatus();return}
 if(navigator.onLine===false){dqStatus();return}
 var m=q[0];DQ.busy=true;lsS(DLK,Date.now());
 var done=function(ok){DQ.busy=false;var q2=dqList();if(ok)q2=q2.filter(function(x){return x.p.cid!==m.p.cid});else q2.forEach(function(x){if(x.p.cid===m.p.cid){x.fail=(x.fail||0)+1}});lsS(DQK,q2);dqStatus();
  if(ok&&m.p.cid===DQ.cur)try{SFX.ok()}catch(e){}if(q2.length){clearTimeout(DQ.t);DQ.t=setTimeout(dqFlush,ok?DCAP+60:60000)}};
 try{fetch(DADURL,{method:'POST',body:JSON.stringify(m.p),cache:'no-store',credentials:'omit',referrerPolicy:'no-referrer'}).then(function(r){done(!!(r&&r.ok))},function(){done(false)})}catch(e){done(false)}}
function dadChallenge(lv){aInit();var bst=0;try{bst=lvBest(lv)||0}catch(e){}var code=enc(lv.items,lv.hole,lv.name,bst),nm=cleanName(lv.name)||'My Level';
 var q=dqList(),ex=null;q.forEach(function(x){if(x.p.code===code)ex=x});
 if(!ex){ex={p:{v:1,code:code,name:nm,score:bst,kid:sndKid(),from:DEV,cid:rid(10)},at:Date.now()};q.push(ex);lsS(DQK,q.slice(-20))}
 DQ.cur=ex.p.cid;$('dcName').textContent='"'+nm+'"';
 $('dcScore').textContent=bst?'⭐ Score to beat: '+tw(bst)+'!':'Can Dad beat it? 💪';
 var el=$('dadcel');el.classList.add('on');confettiDom(el,70);dcStat('📡 Sending to Dad…','wait');
 try{SFX.fanfare()}catch(e){}try{shake(10)}catch(e){}dqFlush();dqStatus()}
$('dcOk').addEventListener('click',function(){SFX.click();$('dadcel').classList.remove('on')});
addEventListener('online',function(){dqFlush();inbPoll()});setInterval(function(){dqFlush()},60000);setTimeout(dqFlush,1500);
/* ---------- receiving ---------- */
var INB={busy:false};
function inbList(){var a=lsG(DIK,[]);return Array.isArray(a)?a:[]}
/* tally = each challenge's best result for Dad, counted from the cached list */
function tally(){var t={alex:0,dad:0,tie:0};inbList().forEach(function(x){if(x.res&&t[x.res]!=null)t[x.res]++});return t}
function inbPoll(){if(INB.busy||navigator.onLine===false)return;INB.busy=true;var since=lsG(DSK,null)||'12h';
 try{fetch(DADURL+'/json?poll=1&since='+encodeURIComponent(since),{cache:'no-store',credentials:'omit',referrerPolicy:'no-referrer'}).then(function(r){if(!r.ok)throw 0;return r.text()}).then(function(t){var a=inbList(),ids={},last=null,add=0;a.forEach(function(x){ids[x.id]=1;if(x.cid)ids['c:'+x.cid]=1});
  String(t).split('\n').forEach(function(ln){if(!ln.trim())return;try{var m=JSON.parse(ln);if(m.event!=='message'||!m.id)return;last=m.id;if(ids[m.id])return;var p=JSON.parse(m.message);
   if(!p||typeof p.code!=='string'||p.from===DEV||(p.cid&&ids['c:'+p.cid]))return;var lv=dec(p.code);if(!lv)return;
   a.push({id:m.id,time:+m.time||0,cid:p.cid||'',code:p.code,name:cleanName(p.name)||lv.name||'Mystery Level',score:Math.max(0,p.score|0)||(lv.best|0),kid:p.kid==='zoe'?'zoe':'alex',played:0,res:null});ids[m.id]=1;if(p.cid)ids['c:'+p.cid]=1;add++}catch(e){}});
  if(last)lsS(DSK,last);lsS(DIK,a.slice(-60));INB.busy=false;inbBadge();if(add&&!$('title').classList.contains('off'))try{SFX.pop()}catch(e){}}).catch(function(){INB.busy=false})}catch(e){INB.busy=false}}
function inbBadge(){var b=$('chBan');if(!b)return;var a=inbList(),nw=a.filter(function(x){return !x.played});
 if(!a.length){b.style.display='none';return}b.style.display='flex';b.classList.toggle('new',nw.length>0);b.classList.toggle('old',!nw.length);
 b.innerHTML=nw.length?'🏆 New challenge from '+kidName(nw[nw.length-1].kid)+'! <span class="cnt">'+nw.length+'</span>':'🏆 Alex vs Dad';b.setAttribute('aria-label',nw.length?nw.length+' new challenges':'Challenges')}
function chlOpen(){aInit();var a=inbList().slice().reverse(),t=tally(),h='';$('chTal').textContent='Alex '+t.alex+' — Dad '+t.dad;
 a.forEach(function(x){var st=!x.played?'<span class="tagn mk">NEW!</span>':x.res==='dad'?'<span class="tagr mk">Dad beat it! 🏆</span>':x.res==='alex'?'<span class="tagr mk">'+kidName(x.kid)+' wins! 😜</span>':x.res==='tie'?'<span class="tagr mk">Tie! 🤝</span>':'<span class="tagr mk">Played</span>';
  var ago=x.time?Math.max(0,Math.round((Date.now()/1000-x.time)/60)):0,when=!x.time?'':ago<2?'just now':ago<90?ago+' min ago':Math.round(ago/60)+' h ago';
  h+='<div class="chr"><div style="flex:1;min-width:0"><b class="mk">'+esc(x.name)+'</b><small>'+(x.score?kidName(x.kid)+': '+tw(x.score)+' to beat':'From '+kidName(x.kid))+(when?' · '+when:'')+'</small></div>'+st+'<button class="btn" data-id="'+esc(x.id)+'" aria-label="Play '+esc(x.name)+'">▶</button></div>'});
 if(!a.length)h='<div class="mk" style="font-size:22px;color:#6b4520;padding:10px">No challenges yet!</div>';
 $('chRows').innerHTML=h;$('chl').classList.add('on')}
$('chBan').addEventListener('click',function(){SFX.click();chlOpen()});
$('chlX').addEventListener('click',function(){SFX.click();$('chl').classList.remove('on')});
$('chRows').addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;var a=inbList(),x=null;a.forEach(function(o){if(o.id===b.dataset.id)x=o});if(!x)return;var lv=dec(x.code);if(!lv){SFX.no();return}
 if(!lv.best&&x.score)lv.best=x.score;x.played=x.played||Date.now();lsS(DIK,a);inbBadge();SFX.click();$('chl').classList.remove('on');playCustom(lv,{challenge:true,inb:x.id})});
/* play hooks: remember which inbox challenge is being played, and score it on a win */
var playCustom0=playCustom;playCustom=function(lv,o){playCustom0(lv,o);CUS.inb=(o&&o.inb)||null};
var customWon0=customWon;customWon=function(){var n=CUS.on?stats.throws-CUS.th0:0,id=CUS.inb,lv=CUS.lv||{};customWon0();var r=$('dadRes');if(!r)return;if(!id||!CUS.on){r.style.display='none';return}
 var a=inbList(),x=null;a.forEach(function(o){if(o.id===id)x=o});if(!x){r.style.display='none';return}var bs=x.score||lv.best||0,res=!bs||n<bs?'dad':n===bs?'tie':'alex',t,k=kidName(x.kid);
 var RK={alex:0,tie:1,dad:2};if(!x.res||RK[res]>RK[x.res])x.res=res;x.played=x.played||Date.now();x.n=Math.min(x.n||99,n);lsS(DIK,a);t=tally();inbBadge();
 r.innerHTML=res==='dad'?'<div class="big mk" style="color:#2f8a3a">🏆 Dad beat it! 💪</div><div class="sub mk">Dad: '+tw(n)+(bs?' · '+k+': '+tw(bs):'')+'. Time for a rematch, '+k+'!</div>':
  res==='alex'?'<div class="big mk" style="color:#e8342a">😜 '+k+' wins!</div><div class="sub mk">Dad needed '+tw(n)+'. '+k+' did it in '+tw(bs)+'! Ha ha!</div>':
  '<div class="big mk" style="color:#1f6fd1">🤝 It\'s a tie!</div><div class="sub mk">You both did it in '+tw(n)+'.</div>';
 r.innerHTML+='<div class="sub mk" style="margin-top:4px">🏆 '+k+' '+t.alex+' — Dad '+t.dad+'</div>';r.style.display='block';$('grandMsg').textContent='';
 try{if(res==='alex'){if(!memePlay('bruh',1,.9))SFX.aww()}else SFX.fanfare()}catch(e){}};
/* poll on load, whenever the home screen comes back, and every 60s while it's showing */
var chWasT=false;setInterval(function(){var tv=!$('title').classList.contains('off');if(tv&&!chWasT)inbPoll();chWasT=tv},1000);
setInterval(function(){if(!$('title').classList.contains('off'))inbPoll()},60000);setTimeout(function(){inbBadge();inbPoll()},800);
window.EBDAD={q:dqList,inb:inbList,tally:tally,poll:inbPoll,flush:dqFlush,dev:function(){return DEV},send:function(lv){dadChallenge(lv||edSnapshot());return DQ.cur},list:chlOpen,
 cap:function(ms){if(ms!=null)DCAP=ms;return DCAP},res:function(n){var x=null;inbList().forEach(function(o){if(o.id===n)x=o});return x}};
