/* ===== v1.11.0: iPhone landscape. Phone = shorter side <= 500 CSS px. The playfield crops a little sky (world y<150) and
   floor (y>950) so it fills the phone screen; toolbars go compact/icon-only; every touch target >= 44pt; portrait shows a rotate prompt. ===== */
function isPhone(){return Math.min(innerWidth,innerHeight)<=500}
(function(){var st=document.createElement('style');st.textContent=
 '#rot .ph{display:none}'+
 '@media (orientation:portrait) and (max-width:500px){#rot{display:flex!important;position:fixed;inset:0;z-index:2147483001;flex-direction:column;align-items:center;justify-content:center;gap:14px;pointer-events:auto;background:repeating-linear-gradient(90deg,#6e0d18 0 6vw,#8d1622 6vw 10vw,#5e0a14 10vw 16vw);font-size:30px;padding:24px;text-align:center}'+
 '#rot .ip{display:none}#rot .ph{display:block}#rot .phi{font-size:96px;line-height:1;animation:rotp 2.2s ease-in-out infinite}#rot b{font-size:34px;color:#ffde3b;-webkit-text-stroke:1px #3a1d00}#rot small{font-size:20px;color:#ffe9b8}}'+
 '@keyframes rotp{0%,25%{transform:rotate(0)}55%,100%{transform:rotate(-90deg)}}'+
 '@media (max-height:500px) and (orientation:landscape){'+
 '#hubHome{transform:scale(1.2);transform-origin:top left}'+
 /* HUD */
 '#hud{gap:6px;padding:calc(4px + env(safe-area-inset-top)) calc(6px + env(safe-area-inset-right)) 0 calc(58px + env(safe-area-inset-left))}'+
 '#hud .tag{font-size:15px;min-height:44px;min-width:44px;padding:4px 8px;display:flex;align-items:center;justify-content:center}#hud #lvl{max-width:24vw;display:block;line-height:36px}#mbadge span{display:none}#mbadge{max-width:none}'+
 '#balls i{width:20px;height:20px}#tix b,#pbtn b{font-size:17px}#mute{width:44px}#gear{width:44px!important;font-size:18px!important}#edbtn{font-size:15px!important}'+
 '#skip,#help{font-size:17px;min-height:44px;padding:8px 12px}'+
 '#banner{font-size:min(11vmin,60px)}'+
 /* overlays + cards */
 '.card{padding:10px 14px;max-height:calc(100% - 12px - env(safe-area-inset-top) - env(safe-area-inset-bottom));max-width:calc(100vw - 20px - env(safe-area-inset-left) - env(safe-area-inset-right))}'+
 '.card h2{font-size:28px;margin-bottom:2px}.btn{font-size:19px;padding:8px 14px;margin:4px;min-height:44px}'+
 '#prizeBig{font-size:54px}#prizeName{font-size:22px;margin-bottom:2px}#tkRows{font-size:15px;line-height:1.3;margin:2px 0}#stk{font-size:16px}#math{padding:4px 8px;margin:4px auto}#math .q{font-size:18px}#math .ch{font-size:22px;min-width:56px;min-height:44px;padding:4px 10px;margin:3px}#math .r{font-size:17px;min-height:20px}'+
 '#grandMsg{font-size:18px!important}#dadRes .big{font-size:30px}#dadRes .sub{font-size:16px}'+
 '#shelfGrid{grid-template-columns:repeat(8,1fr)}#mgrid{grid-template-columns:repeat(4,1fr)}.mt{min-height:110px}.mt img{width:40px;height:40px}'+
 /* title */
 '#title .small .btn{min-height:44px;font-size:16px}#play{min-height:52px}#tgear{width:52px!important;height:52px!important;font-size:24px!important}#how{font-size:13px}'+
 '#chBan{font-size:18px;min-height:50px;padding:4px 14px;top:calc(6px + env(safe-area-inset-top))}#chBan.old{font-size:15px}#chBan .cnt{min-width:34px;height:34px;line-height:34px;font-size:20px}'+
 /* challenge list + celebration */
 '#chl h2{font-size:24px}#chTal{font-size:20px;margin:0 0 4px}#chRows{max-height:calc(100vh - 170px)}.chr{padding:4px 8px}.chr b{font-size:19px}.chr small{font-size:14px}.chr .btn{min-width:56px;min-height:48px;font-size:22px}.chr .tagr,.chr .tagn{font-size:14px}'+
 '#dadcel .card>div:first-child{font-size:40px!important}#dadcel h2{font-size:30px}#dcName{font-size:22px}#dcScore{font-size:19px;margin:2px 0}#dcStat{font-size:17px;min-height:22px;margin:2px 0}#dcOk{font-size:21px;min-height:48px}'+
 /* settings */
 '.srow{margin:6px 4px;font-size:20px}.stg{width:52px;height:46px;font-size:22px}'+
 /* builder: icon-only bar, compact shelf, 44pt tools */
 '#edTop{padding:calc(4px + env(safe-area-inset-top)) calc(6px + env(safe-area-inset-right)) 0 calc(58px + env(safe-area-inset-left))}#edTop .grp{gap:6px}#edTop .lbl{display:none}'+
 '#edTop .tag,#edMore .tag,#edTools .tag{font-size:19px;min-height:44px;min-width:48px;padding:2px 8px}#edMore .tag{font-size:15px}#edMore{gap:6px;padding:8px;width:min(400px,62vw);overflow:auto}'+
 '#edPal{padding:5px;gap:5px;border-radius:14px}#edPal .shelfT{display:none}#edTabs{gap:4px}#edTabs .tab{min-height:44px;min-width:44px;padding:2px}#edTabs .tab span{display:none}#edTabs .tab b{font-size:22px}'+
 '#edPcs{gap:5px}#edPal .pc{min-height:52px;min-width:44px;padding:3px 1px}#edPal .pc img{width:36px;height:36px}#edPal .pc .pn{display:none}#edPal .pc .left{font-size:12px;height:18px;line-height:18px;min-width:18px;padding:0 4px}'+
 '#edHint{font-size:15px}#edTools{gap:5px}'+
 '#edFlag{font-size:13px;min-height:44px;padding:2px 6px;max-width:34vw;border-width:2px}#edFlag small{font-size:.78em}'+
 '#edMore #edChk{grid-column:1/4}'+
 '#edMore{grid-template-columns:1fr 1fr 1fr;width:min(560px,72vw)}#edMore .wide{grid-column:auto}#edMore #edName,#edMore #edMoreX{grid-column:1/4}'+
 '.ov{padding:env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)}'+
 /* win card: two columns so the result + buttons fit without scrolling */
 '#win .card{display:flex;align-items:center;gap:14px;width:760px}#wL,#wR{display:flex!important;flex-direction:column;align-items:center;justify-content:center}#wL{flex:0 0 36%}#wR{flex:1 1 auto;min-width:0}#wbtns .btn{margin:3px}'+
 '}';document.head.appendChild(st);
 /* wrap the win card's buttons in one row (same look on iPad; lets the phone layout place them as a group) */
 try{var wc=$('next').parentNode,wb=document.createElement('div');wb.id='wbtns';var bs=[].filter.call(wc.children,function(e){return e.tagName==='BUTTON'||e.id==='rpCard'});if(bs.length){wc.insertBefore(wb,bs[0]);bs.forEach(function(e){wb.appendChild(e)})}
  /* two column wrappers: display:contents on iPad (layout unchanged), real columns on phone */
  var wl=document.createElement('div'),wr=document.createElement('div');wl.id='wL';wr.id='wR';wl.style.display=wr.style.display='contents';
  var kids=[].slice.call(wc.children);wc.insertBefore(wl,kids[0]);wc.appendChild(wr);kids.forEach(function(e){(/^(H2)$/.test(e.tagName)||/^(prizeBig|prizeName|tkRows|stk)$/.test(e.id)?wl:wr).appendChild(e)})}catch(e){}
 var r=$('rot');if(r)r.innerHTML='<span class="ip">'+r.innerHTML+'</span><div class="ph phi">📱</div><b class="ph mk">Turn your phone sideways!</b><small class="ph mk">Excavator Blowout plays best in landscape.</small>'})();
