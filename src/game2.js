/* ---------- background (pre-rendered on resize) ---------- */
var BG=null,BG1=null,BG1Y=0,BGM=40,SIGN=null,CEIL=null,PANEL=null;
function worldView(){return{x0:-OX/S-BGM/S,x1:(CW-OX)/S+BGM/S,y0:-OY/S-BGM/S,y1:(CH-OY)/S+BGM/S}}
function drawBG(){var c=mkc((CW+2*BGM)*DPR,(CH+2*BGM)*DPR),g=c.getContext('2d'),v=worldView(),r=rng(3);
 g.setTransform(DPR*S,0,0,DPR*S,DPR*(OX+BGM),DPR*(OY+BGM));
 // red stage curtain
 var cx1=1010;g.fillStyle='#6a0b16';g.fillRect(v.x0,v.y0,cx1-v.x0,TABLE-v.y0);
 for(var x=Math.floor(v.x0/56)*56;x<cx1;x+=56){var gr=g.createLinearGradient(x,0,x+56,0);gr.addColorStop(0,'rgba(0,0,0,.35)');gr.addColorStop(.45,'rgba(255,80,90,.22)');gr.addColorStop(.6,'rgba(255,120,130,.12)');gr.addColorStop(1,'rgba(0,0,0,.3)');g.fillStyle=gr;g.fillRect(x,v.y0,56,TABLE-v.y0)}
 var vg=g.createLinearGradient(0,v.y0,0,120);vg.addColorStop(0,'rgba(0,0,0,.45)');vg.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=vg;g.fillRect(v.x0,v.y0,cx1-v.x0,140-v.y0);
 // brick wall
 g.fillStyle='#d8c7a0';g.fillRect(cx1,v.y0,v.x1-cx1,TABLE-v.y0);g.strokeStyle='#b9a47a';g.lineWidth=3;
 for(var y=Math.floor(v.y0/34)*34,row=0;y<TABLE;y+=34,row++){g.beginPath();g.moveTo(cx1,y);g.lineTo(v.x1,y);g.stroke();for(x=cx1+((row&1)?40:0);x<v.x1;x+=80){g.beginPath();g.moveTo(x,y);g.lineTo(x,y+34);g.stroke()}}
 for(var i=0;i<300;i++){g.fillStyle='rgba(120,90,50,'+r()*.12+')';g.fillRect(cx1+r()*(v.x1-cx1),v.y0+r()*(TABLE-v.y0),2+r()*8,2+r()*5)}
 var sg=g.createLinearGradient(cx1,0,cx1+60,0);sg.addColorStop(0,'rgba(0,0,0,.35)');sg.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=sg;g.fillRect(cx1,v.y0,60,TABLE-v.y0);
 // navy flag with gold fringe (no emblem)
 g.fillStyle='#c9a227';g.fillRect(986,v.y0,6,330-v.y0);g.beginPath();g.moveTo(992,-20);g.quadraticCurveTo(1030,80,1010,250);g.lineTo(1040,240);g.quadraticCurveTo(1060,90,1035,-20);g.closePath();g.fillStyle='#1c2a6b';g.fill();g.strokeStyle='#e0b83a';g.lineWidth=5;g.beginPath();g.moveTo(1010,250);g.lineTo(1040,240);g.stroke();
 drawBanner(g);BG=c;
 // ---- front layer (table, box) drawn over the crowd ----
 BG1Y=Math.max(0,Math.floor(DPR*(OY+BGM+(TOP-34)*S)));c=mkc((CW+2*BGM)*DPR,(CH+2*BGM)*DPR-BG1Y);g=c.getContext('2d');g.setTransform(DPR*S,0,0,DPR*S,DPR*(OX+BGM),DPR*(OY+BGM)-BG1Y);
 drawLunch(g);
 // gym floor tiles + table
 g.fillStyle='#e9e4d6';g.fillRect(v.x0,TABLE,v.x1-v.x0,v.y1-TABLE);g.fillStyle='#22306e';
 for(x=Math.floor(v.x0/120)*120;x<v.x1;x+=120)for(y=TABLE+40;y<v.y1;y+=120){g.beginPath();g.moveTo(x+60,y);g.lineTo(x+120,y+40);g.lineTo(x+60,y+80);g.lineTo(x,y+40);g.closePath();g.fill()}
 g.fillStyle='#f4f2ec';g.fillRect(v.x0,TABLE,v.x1-v.x0,26);g.fillStyle='#cfcabd';g.fillRect(v.x0,TABLE+26,v.x1-v.x0,6);
 g.fillStyle='rgba(0,0,0,.18)';g.fillRect(v.x0,TABLE+32,v.x1-v.x0,20);
 g.fillStyle='#8a8f98';[260,1440].forEach(function(lx){g.fillRect(lx,TABLE+32,14,v.y1-TABLE)});
 // red prize bin (right) back
 g.fillStyle='#b81414';g.fillRect(1402,810,100,90);
 // box: interior back panel
 g.save();g.beginPath();g.rect(FX1,TOP,BX0-FX1,FLOOR-TOP);g.fillStyle=g.createPattern(CBT,'repeat');g.fill();g.fillStyle='rgba(50,25,5,.38)';g.fill();
 var ig=g.createLinearGradient(0,TOP,0,FLOOR);ig.addColorStop(0,'rgba(0,0,0,.35)');ig.addColorStop(.25,'rgba(0,0,0,0)');ig.addColorStop(1,'rgba(0,0,0,.12)');g.fillStyle=ig;g.fill();
 g.strokeStyle='rgba(60,30,5,.25)';g.lineWidth=2;for(i=0;i<6;i++){g.beginPath();var yy=TOP+60+i*80;g.moveTo(FX1,yy);g.lineTo(BX0,yy+((i%2)?6:-6));g.stroke()}
 g.font='34px '+MK;g.fillStyle='rgba(47,138,58,.55)';g.save();g.translate(1240,TOP+70);g.rotate(-.05);g.fillText('PRIZE',-50,0);g.restore();
 g.restore();
 // box floor panel + cut edges of near side
 g.beginPath();g.rect(FX0-4,FLOOR,BX1-FX0+8,TABLE-FLOOR);cbFill(g,.15);
 jag(g,[[FX0-6,TOP-16],[BX1+6,TOP-16],[BX1+6,TOP],[FX0-6,TOP]],r,3);cbFill(g,.08);g.strokeStyle='#7a5328';g.lineWidth=2;g.stroke();
 g.strokeStyle='rgba(122,83,40,.6)';g.lineWidth=1.5;for(x=FX0;x<BX1;x+=8){g.beginPath();g.moveTo(x,TOP-14);g.quadraticCurveTo(x+4,TOP-4,x+8,TOP-14);g.stroke()}
 // dark inside of the oval opening (seen through the front panel)
 g.beginPath();g.ellipse(470,(GAP0+GAP1)/2,30,(GAP1-GAP0)/2+16,0,0,2*PI);g.fillStyle='#2a1808';g.fill();
 BG1=c;var bg=BG.getContext('2d');bg.setTransform(1,0,0,1,0,0);bg.drawImage(BG1,0,BG1Y)}
/* front panel: dark blue painted, oval opening, rhinestones, pipe-cleaner ring */
function panelPath(g){g.beginPath();g.moveTo(418,TOP-22);g.lineTo(FX1+2,TOP-8);g.lineTo(FX1+2,FLOOR+6);g.lineTo(412,FLOOR+22);g.closePath();
 g.moveTo(492,(GAP0+GAP1)/2);g.ellipse(470,(GAP0+GAP1)/2,30,(GAP1-GAP0)/2+16,0,0,2*PI,true)}
function mkPanel(){var w=140,h=FLOOR-TOP+60,c=mkc(w*K,h*K),g=c.getContext('2d'),r=rng(21);g.scale(K,K);g.translate(-400,-(TOP-30));
 panelPath(g);g.fillStyle='#22386a';g.fill('evenodd');g.save();g.clip('evenodd');
 for(var i=0;i<160;i++){g.strokeStyle=['#1a2d58','#2b4a86','#16264c','#34558f'][(r()*4)|0];g.globalAlpha=.6;g.lineWidth=3+r()*6;g.beginPath();var x=405+r()*120,y=TOP-30+r()*(FLOOR-TOP+60);g.moveTo(x,y);g.lineTo(x+(r()-.5)*30,y+(r()-.5)*60);g.stroke()}
 g.globalAlpha=1;for(i=0;i<30;i++){g.fillStyle='rgba(200,150,90,.5)';g.fillRect(410+r()*110,TOP-26+r()*(FLOOR-TOP+40),2+r()*4,2+r()*4)}
 // rhinestone strips (like Alex's box)
 function strip(x0,y0,x1,y1,n){for(var k=0;k<n;k++){var t=k/(n-1),x=lerp(x0,x1,t),y=lerp(y0,y1,t);for(var j=0;j<2;j++){g.beginPath();g.arc(x+j*7,y+j*1,3.2,0,2*PI);var gr=g.createRadialGradient(x+j*7-1,y-1,.5,x+j*7,y,3.4);gr.addColorStop(0,'#fff');gr.addColorStop(1,'#9fb3c8');g.fillStyle=gr;g.fill()}}}
 strip(436,TOP+30,452,TOP+170,16);strip(432,FLOOR-150,436,FLOOR-40,12);strip(490,TOP+40,494,TOP+120,9);
 g.restore();
 // oval rim + white string like the photo
 g.beginPath();g.ellipse(470,(GAP0+GAP1)/2,30,(GAP1-GAP0)/2+16,0,0,2*PI);g.strokeStyle='#0f1a36';g.lineWidth=4;g.stroke();
 g.strokeStyle='rgba(255,255,255,.7)';g.lineWidth=1.5;g.beginPath();g.moveTo(414,GAP1+40);g.quadraticCurveTo(470,GAP1+20,FX1,GAP1+44);g.stroke();
 // pipe-cleaner ring stuck on front
 var cols=['#ff7a1a','#3cc43c','#e8342a','#ffd21a'];for(i=0;i<24;i++){var a=i/24*2*PI;g.strokeStyle=cols[(i>>1)%4];g.lineWidth=7;g.lineCap='round';g.beginPath();g.ellipse(486,FLOOR-80,13,24,0,a,a+.3);g.stroke()}
 // green pipe cleaner post
 g.strokeStyle='#5fd13a';g.lineWidth=6;g.beginPath();g.moveTo(496,TOP+4);g.lineTo(500,TOP-70);g.stroke();
 g.lineWidth=2;g.strokeStyle='#0d1a33';panelPath(g);g.stroke();
 PANEL={c:c,x:400,y:TOP-30,w:w,h:h}}
function mkSign(){var w=640,h=250,c=mkc(w*K,h*K),g=c.getContext('2d'),r=rng(8);g.scale(K,K);
 jag(g,[[6,30],[120,12],[250,26],[380,8],[520,22],[634,10],[630,236],[340,246],[10,240]],r,6);cbFill(g,0);g.strokeStyle='#8a6232';g.lineWidth=3;g.stroke();
 g.fillStyle='rgba(255,255,255,.18)';g.fillRect(20,150,90,40);g.fillRect(500,170,100,30);
 g.strokeStyle='#7a4bc4';g.lineWidth=6;g.lineCap='round';for(var i=0;i<6;i++){g.beginPath();g.moveTo(520+i*14,110);g.lineTo(560+i*14,40);g.stroke()}
 g.fillStyle='#2f8a3a';g.font='74px '+MK;g.textBaseline='middle';var t='Excavator Blowout',x=34,fs=Math.min(74,74*500/g.measureText(t).width);g.font=fs.toFixed(1)+'px '+MK;
 for(i=0;i<t.length;i++){var ch=t[i];g.save();g.translate(x,128+(r()-.5)*10);g.rotate((r()-.5)*.12);g.fillText(ch,0,0);g.restore();x+=g.measureText(ch).width*.98}
 g.font='26px '+MK;g.fillStyle='#5b3f9e';g.fillText('by Alex and friends',360,205);
 SIGN={c:c,w:w,h:h}}
function mkCeil(){var w=BX1-FX0+40,h=46,c=mkc(w*K,h*K),g=c.getContext('2d'),r=rng(4);g.scale(K,K);
 g.beginPath();g.moveTo(0,10);for(var x=0;x<=w;x+=30)g.quadraticCurveTo(x+15,4+r()*10,x+30,10+r()*6);g.lineTo(w,36);for(x=w;x>=0;x-=30)g.quadraticCurveTo(x-15,40+r()*8,x-30,34+r()*6);g.closePath();
 g.fillStyle='rgba(220,238,255,.42)';g.fill();g.strokeStyle='rgba(255,255,255,.8)';g.lineWidth=2;g.stroke();
 for(x=12;x<w;x+=20)for(var y=14;y<34;y+=12){g.beginPath();g.arc(x+((y/12)&1)*10,y,5,0,2*PI);g.fillStyle='rgba(255,255,255,.35)';g.fill();g.strokeStyle='rgba(255,255,255,.6)';g.lineWidth=1;g.stroke()}
 CEIL={c:c,w:w,h:h}}
/* ---------- excavator (drawn in code; Michigan maize & blue with a mitten decal) ---------- */
var EX={x:EXPARK,tx:EXPARK-400,ty:TOP-30,ba:1.5,load:null,carry:null,cof:null,ph:0,on:false,speed:1,bt:0,vis:1};
function ik(sx,sy,tx,ty){var dx=tx-sx,dy=ty-sy,d=Math.hypot(dx,dy),dd=clamp(d,80,L1+L2-2),a=Math.atan2(dy,dx),c=(L1*L1+dd*dd-L2*L2)/(2*L1*dd),b=Math.acos(clamp(c,-1,1));
 var e1x=sx+L1*Math.cos(a-b),e1y=sy+L1*Math.sin(a-b),e2x=sx+L1*Math.cos(a+b),e2y=sy+L1*Math.sin(a+b),up=e1y<e2y;
 return{ex:up?e1x:e2x,ey:up?e1y:e2y,wx:sx+dd*Math.cos(a),wy:sy+dd*Math.sin(a)}}
function shoulder(){return{x:EX.x-60,y:TOP-92}}
function armSeg(g,x0,y0,x1,y1,w0,w1,col){var a=Math.atan2(y1-y0,x1-x0),nx=-Math.sin(a),ny=Math.cos(a);g.beginPath();g.moveTo(x0+nx*w0,y0+ny*w0);g.lineTo(x1+nx*w1,y1+ny*w1);g.lineTo(x1-nx*w1,y1-ny*w1);g.lineTo(x0-nx*w0,y0-ny*w0);g.closePath();
 g.fillStyle=col;g.fill();g.strokeStyle='#5a4300';g.lineWidth=3;g.stroke();g.beginPath();g.arc(x1,y1,w1*.8,0,2*PI);g.fillStyle='#444';g.fill()}
function mitten(g,x,y,s,col){g.save();g.translate(x,y);g.scale(s,s);g.beginPath();g.moveTo(-8,14);g.lineTo(-10,-4);g.quadraticCurveTo(-12,-16,-2,-17);g.quadraticCurveTo(8,-17,9,-6);g.lineTo(10,2);g.quadraticCurveTo(16,-4,17,1);g.quadraticCurveTo(17,6,10,12);g.lineTo(8,14);g.closePath();g.fillStyle=col;g.fill();g.restore()}
function drawExc(g,t){var x=EX.x,b=TOP,sh=shoulder(),k=ik(sh.x,sh.y,EX.tx,EX.ty);
 g.save();g.globalAlpha=EX.vis;
 // tracks
 g.beginPath();g.moveTo(x-120,b-30);g.arcTo(x-140,b-30,x-140,b-12,16);g.arcTo(x-140,b+4,x-110,b+4,16);g.lineTo(x+105,b+4);g.arcTo(x+130,b+4,x+130,b-14,16);g.arcTo(x+130,b-34,x+100,b-34,16);g.closePath();g.fillStyle='#2b2b2b';g.fill();
 g.strokeStyle='#555';g.lineWidth=3;for(var i=0;i<14;i++){var px=x-130+((i*19+EX.ph)%266);g.beginPath();g.moveTo(px,b+2);g.lineTo(px,b-4);g.stroke()}
 for(i=0;i<5;i++){var wx=x-108+i*53;g.beginPath();g.arc(wx,b-14,11,0,2*PI);g.fillStyle='#777';g.fill();g.strokeStyle='#333';g.lineWidth=2;g.beginPath();g.moveTo(wx+Math.cos(EX.ph/9)*10,b-14+Math.sin(EX.ph/9)*10);g.lineTo(wx-Math.cos(EX.ph/9)*10,b-14-Math.sin(EX.ph/9)*10);g.stroke()}
 // body
 g.fillStyle='#ffcb05';g.strokeStyle='#5a4300';g.lineWidth=3;g.beginPath();g.moveTo(x-110,b-36);g.lineTo(x+120,b-36);g.lineTo(x+128,b-70);g.quadraticCurveTo(x+130,b-112,x+90,b-112);g.lineTo(x-14,b-112);g.lineTo(x-110,b-100);g.closePath();g.fill();g.stroke();
 g.fillStyle='#e0aa00';g.fillRect(x+60,b-104,62,10);
 mitten(g,x+40,b-72,1.4,'#00274c');g.font='18px '+MK;g.fillStyle='#00274c';g.fillText('EB-1',x+70,b-50);
 // cab
 g.beginPath();g.moveTo(x-104,b-100);g.lineTo(x-104,b-196);g.quadraticCurveTo(x-104,b-210,x-88,b-210);g.lineTo(x-26,b-210);g.lineTo(x-10,b-112);g.closePath();g.fillStyle='#ffcb05';g.fill();g.stroke();
 g.beginPath();g.moveTo(x-94,b-110);g.lineTo(x-94,b-196);g.lineTo(x-34,b-196);g.lineTo(x-20,b-116);g.closePath();g.fillStyle='rgba(120,190,235,.75)';g.fill();g.strokeStyle='#00274c';g.lineWidth=2;g.stroke();
 // driver with a hard hat
 g.fillStyle='#f2c79a';g.beginPath();g.arc(x-58,b-152,13,0,2*PI);g.fill();g.fillStyle='#ffcb05';g.beginPath();g.arc(x-58,b-158,14,PI,0);g.fill();g.fillRect(x-75,b-160,34,4);g.fillStyle='#222';g.fillRect(x-63,b-153,3,3);g.fillRect(x-54,b-153,3,3);
 g.strokeStyle='#222';g.lineWidth=1.5;g.beginPath();g.arc(x-58,b-149,5,.2*PI,.8*PI);g.stroke();
 // exhaust + beacon
 g.fillStyle='#555';g.fillRect(x+40,b-150,10,40);var on=EX.on&&((t*4)|0)%2===0;g.fillStyle=on?'#ff8a00':'#a55a00';g.beginPath();g.arc(x-60,b-216,8,PI,0);g.fill();
 if(on){g.fillStyle='rgba(255,160,0,.25)';g.beginPath();g.arc(x-60,b-216,24,0,2*PI);g.fill()}
 // hydraulic cylinder
 var mx=lerp(sh.x,k.ex,.55),my=lerp(sh.y,k.ey,.55);g.strokeStyle='#666';g.lineWidth=10;g.beginPath();g.moveTo(x-20,b-60);g.lineTo(mx,my);g.stroke();g.strokeStyle='#ddd';g.lineWidth=5;g.beginPath();g.moveTo(lerp(x-20,mx,.5),lerp(b-60,my,.5));g.lineTo(mx,my);g.stroke();
 armSeg(g,sh.x,sh.y,k.ex,k.ey,20,15,'#ffcb05');armSeg(g,k.ex,k.ey,k.wx,k.wy,14,10,'#ffcb05');
 // bucket
 g.save();g.translate(k.wx,k.wy);g.rotate(EX.ba);g.beginPath();g.moveTo(-6,-24);g.quadraticCurveTo(46,-30,52,8);g.lineTo(44,30);g.lineTo(-10,26);g.closePath();g.fillStyle='#4a4a4a';g.fill();g.strokeStyle='#222';g.lineWidth=3;g.stroke();
 g.fillStyle='#bbb';for(i=0;i<4;i++){g.beginPath();g.moveTo(-8+i*14,26);g.lineTo(-2+i*14,38);g.lineTo(4+i*14,27);g.fill()}
 if(EX.load){var lr=rng(EX.load.seed);for(i=0;i<9;i++){g.fillStyle=['#fff','#e8342a','#4fb6d6','#c9975e','#7fd34a'][(lr()*5)|0];g.beginPath();g.arc(4+lr()*36,-22-lr()*16,6+lr()*8,0,2*PI);g.fill()}}
 g.restore();g.restore();return k}
