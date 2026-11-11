/* ===== walk-by toot event (real CC0 recordings) + juice polish ===== */
var FA={on:false,t:0,x:0,dir:1,k:null,tooted:false,next:40+rnd()*30,clouds:[],wind:0,tt:0,buf:[],load:0,count:0};
function loadFarts(){if(!AC||FA.load)return;FA.load=1;[1,2,3,4,5].forEach(function(i){try{fetch('sfx/fart'+i+'.mp3').then(function(r){return r.arrayBuffer()}).then(function(b){AC.decodeAudioData(b,function(buf){FA.buf.push(buf)},function(){})}).catch(function(){})}catch(e){}})}
function playFart(){if(!aok())return;if(!FA.buf.length){noise(.35,{ft:'lowpass',f:260,fto:120,q:4,vol:.4});tone(90,.35,{to:60,type:'sawtooth',vol:.12});return}
 try{var s=AC.createBufferSource(),g=AC.createGain();s.buffer=FA.buf[(rnd()*FA.buf.length)|0];s.playbackRate.value=.88+rnd()*.24;g.gain.value=.9;s.connect(g);g.connect(sfxBus);s.start()}catch(e){}}
function eww(){voices(7,540,360,.75,[[300,8],[2300,9]],.045);for(var i=0;i<10;i++)voices(1,620+rnd()*260,700+rnd()*200,.07,[[720,6],[1900,8]],.035,.75+i*.1+rnd()*.04)}
defSpr('stink',130,96,function(g){var r=rng(3);g.translate(65,52);g.fillStyle='rgba(150,205,70,.85)';g.strokeStyle='rgba(70,120,20,.9)';g.lineWidth=3;g.beginPath();
 [[-30,6,24],[-6,-10,30],[24,2,26],[4,16,24],[-22,-6,20]].forEach(function(c){g.moveTo(c[0]+c[2],c[1]);g.arc(c[0],c[1],c[2],0,2*PI)});g.fill();
 g.strokeStyle='rgba(90,140,30,.9)';g.lineWidth=3;g.lineCap='round';[-24,0,24].forEach(function(x){g.beginPath();g.moveTo(x,-34);g.bezierCurveTo(x+8,-40,x-8,-46,x,-52);g.stroke()});
 g.fillStyle='rgba(230,255,180,.6)';g.beginPath();g.ellipse(-10,-14,10,6,-.4,0,2*PI);g.fill()});
function startFart(){if(FA.on)return;FA.on=true;FA.t=0;FA.tooted=false;FA.dir=rnd()<.5?1:-1;FA.x=FA.dir>0?-90:1590;FA.count++;
 var r=rng(500+FA.count);FA.k={i:'w'+(FA.count%4),x:FA.x,hy:TOP-64,s:.5,skin:SKIN[(r()*6)|0],hair:HAIR[(r()*7)|0],hs:(r()*6)|0,shirt:SHIRT[(r()*10)|0],gl:r()<.25,ph:0,dl:0,bp:3,deco:0,dir:FA.dir};FA.next=75+rnd()*60}
function toot(){FA.tooted=true;playFart();after(.55,function(){if(rnd()<.5)playFart()});shake(4);banner('💨 Stinky wind! Wobbly aim!',1);after(.5,function(){crowd('stink',3.4);eww()});
 for(var i=0;i<6;i++){var c={x:FA.x-FA.dir*20+(rnd()-.5)*60,y:TOP-40-rnd()*60,vx:-(45+rnd()*55),vy:12+rnd()*14,sc:.6+rnd()*.5,a:0,l:0,ph:rnd()*6};if(i>=4){c.x=500+rnd()*700;c.y=430+rnd()*260;c.l=-.4*(i-3)}FA.clouds.push(c)}}
function updFart(dt){FA.tt+=dt;
 if(!FA.on){if(state==='aim'&&!AS.on&&!MS.on&&!titleOn&&!SIM&&!$('win').classList.contains('on'))FA.next-=dt}
 if(!FA.on&&FA.next<=0)startFart();
 if(FA.on){FA.t+=dt;FA.x+=FA.dir*250*dt;FA.k.x=FA.x;if(!FA.tooted&&(FA.dir>0?FA.x>720:FA.x<820))toot();if(FA.x<-120||FA.x>1620)FA.on=false}
 var w=0;for(var i=FA.clouds.length-1;i>=0;i--){var c=FA.clouds[i];c.l+=dt;if(c.l<0)continue;c.x+=c.vx*dt;c.y+=c.vy*dt+Math.sin(c.l*2+c.ph)*12*dt;c.sc+=dt*.08;c.a=Math.min(1,c.l*2)*Math.max(0,1-c.l/7.5);if(c.l>7.5||c.x<-160){FA.clouds.splice(i,1);continue}w=Math.max(w,c.a)}
 FA.wind=w}
function stinkWob(A){if(!FA.wind||AS.on||!A)return A;var w=FA.wind*(Math.sin(FA.tt*2.4)*4+Math.sin(FA.tt*6.3)*1.3);return{ang:A.ang+w,p:A.p,len:A.len,snap:A.snap,stink:true}}
function drawStink(g,t){if(!FA.clouds.length)return;var s=spr('stink');for(var i=0;i<FA.clouds.length;i++){var c=FA.clouds[i];if(c.l<0||c.a<=0)continue;g.globalAlpha=c.a*.5;var w=130*c.sc,h=96*c.sc,wb=1+Math.sin(t*3+c.ph)*.06;g.drawImage(s.c,c.x-w/2*wb,c.y-h/2/wb,w*wb,h/wb)}g.globalAlpha=1}
/* ---- polish: squash on impact, slow-mo "almost in!", trick-shot bounces ---- */
var SLOW={t:0,used:false};
function squashHit(b,n,rv){if(!b||rv<4)return;b.sq=Math.min(1,rv/14);b.sqT=gt;b.sqN=Math.atan2(n.y,n.x)}
function squashXf(g,b){if(!b||!b.sq)return;var k=b.sq*Math.exp(-(gt-b.sqT)*16);if(k<.02){b.sq=0;return}g.rotate(b.sqN);g.scale(1-.28*k,1+.16*k);g.rotate(-b.sqN)}
function slowTS(dt){if(state!=='fly'||!ball||SIM){SLOW.t=0;return 1}if(SLOW.t>0){SLOW.t-=dt;return SLOW.t>0?.38:1}
 if(!SLOW.used){var p=ball.position,v=ball.velocity,cy=(HOLE.y0+HOLE.y1)/2;if(v.x>2&&p.x>BX0-190&&p.x<BX0-30&&Math.abs(p.y-cy)<(HOLE.y1-HOLE.y0)/2+30){SLOW.used=true;SLOW.t=.55;tone(520,.5,{to:260,type:'sine',vol:.08});return .38}}return 1}
function drawSlow(g){if(!(SLOW.t>0))return;var a=Math.min(1,SLOW.t*3)*.35;var gr=g.createRadialGradient(W/2,H/2,H*.35,W/2,H/2,H*.85);gr.addColorStop(0,'rgba(0,0,0,0)');gr.addColorStop(1,'rgba(20,10,0,'+a+')');g.fillStyle=gr;g.fillRect(-200,-200,W+400,H+400)}
