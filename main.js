import*as T from 'three';
window.__nx=1;
const $=s=>document.querySelector(s),coarse=matchMedia('(pointer:coarse)').matches;
const ld=(k,d)=>{try{return{...d,...JSON.parse(localStorage.getItem(k))}}catch{return d}};
const S=ld('nexus-save',{xp:0,disc:[],inv:[],f:{},done:[]}),O=ld('nexus-set',{snd:1,sens:1,q:coarse?0:1});
const save=()=>{try{localStorage.setItem('nexus-save',JSON.stringify(S));localStorage.setItem('nexus-set',JSON.stringify(O))}catch{}};
if(coarse)document.body.classList.add('t');

// ---------- audio (created only after a user gesture) ----------
let AC,mg;
const setSnd=()=>{if(mg)mg.gain.value=O.snd?.4:0};
function audio(){if(!AC){try{AC=new(window.AudioContext||window.webkitAudioContext)();mg=AC.createGain();mg.connect(AC.destination);setSnd();const f=AC.createBiquadFilter();f.frequency.value=380;f.connect(mg);[55,55.5,82.4].forEach(h=>{const o=AC.createOscillator(),g=AC.createGain();o.type='sawtooth';o.frequency.value=h;g.gain.value=.1;o.connect(g).connect(f);o.start()});const l=AC.createOscillator(),lg=AC.createGain();l.frequency.value=.07;lg.gain.value=180;l.connect(lg).connect(f.frequency);l.start()}catch{AC=null}}if(AC&&AC.state==='suspended')AC.resume()}
const sfx=(h,d=.2,ty='sine',v=.15,dl=0)=>{if(!AC||!O.snd)return;const t=AC.currentTime+dl,o=AC.createOscillator(),g=AC.createGain();o.type=ty;o.frequency.value=h;g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(g).connect(mg);o.start(t);o.stop(t+d)};

// ---------- renderer / scene ----------
let R;try{R=new T.WebGLRenderer({canvas:$('#c'),antialias:!coarse})}catch(e){$('#load').hidden=true;$('#err').hidden=false;$('#err p').textContent='Your browser or device could not start WebGL, which NEXUS needs. Try a recent Chrome, Edge, Firefox or Safari and turn on hardware acceleration.';throw e}
const sc=new T.Scene(),cam=new T.PerspectiveCamera(65,1,.1,700),hemi=new T.HemisphereLight(0x5577cc,0x110022,1.1),lt=new T.PointLight(0xaaddff,260,30,2);
sc.background=new T.Color(0x03050c);sc.fog=new T.FogExp2(0x050818,.013);sc.add(hemi,lt,new T.DirectionalLight(0x6688ff,.6));
let sd=7;const rnd=()=>(sd=sd*16807%2147483647)/2147483647;
const cols=[0x00f0ff,0x8a4dff,0xff2fb3],col=[],I=[],spin=[],PT=[],cars=[],AM=[],FD={c:.013,l:.03,v:.004};
let libD,portD,cardM,hatchM,swTop,stars,hl;
const N=c=>new T.MeshBasicMaterial({color:c}),M=(c,e=0,i=.8)=>new T.MeshStandardMaterial({color:c,emissive:e,emissiveIntensity:i,roughness:.35,metalness:.5});
const base=x=>x>200?-40:0,ar=()=>Pl.x>200?'l':Pl.x<-200?'v':'c';
function box(x,y,z,w,h,d,m,s){const o=new T.Mesh(new T.BoxGeometry(w,h,d),m);o.position.set(x,y,z);sc.add(o);if(s)col.push(o.c={x0:x-w/2,x1:x+w/2,z0:z-d/2,z1:z+d/2,b:y-h/2,t:y+h/2});return o}
function item(g,c,x,y,z){const m=new T.Mesh(g,M(c,c,1.2));m.position.set(x,y,z);sc.add(m);spin.push([m,1.6,y]);return m}
const add=(id,x,y,z,t,go,o={})=>{const i={id,x,y,z,t,go,r:3.5,a:x>200?'l':x<-200?'v':'c',...o};I.push(i);return i};
const ln=(x0,z0,x1,z1,c)=>box((x0+x1)/2,.06,(z0+z1)/2,Math.abs(x1-x0)||.5,.04,Math.abs(z1-z0)||.5,N(c));
function mkp(cx,cy,cz,sx,sy,sz,n,c){const a=new Float32Array(n*3);for(let i=0;i<n;i++){a[i*3]=cx+(rnd()-.5)*sx;a[i*3+1]=cy+rnd()*sy;a[i*3+2]=cz+(rnd()-.5)*sz}const g=new T.BufferGeometry();g.setAttribute('position',new T.BufferAttribute(a,3));const p=new T.Points(g,new T.PointsMaterial({color:c,size:.22,transparent:true,opacity:.7,depthWrite:false}));p.n=n;PT.push(p);sc.add(p)}
function winTex(){const c=document.createElement('canvas');c.width=c.height=64;const g=c.getContext('2d');g.fillStyle='#000';g.fillRect(0,0,64,64);for(let y=0;y<8;y++)for(let x=0;x<8;x++)if(rnd()<.42){g.fillStyle=['#7ff','#a8f','#fd8','#6cf'][rnd()*4|0];g.fillRect(x*8+2,y*8+2,4,5)}const t=new T.CanvasTexture(c);t.wrapS=t.wrapT=T.RepeatWrapping;t.colorSpace=T.SRGBColorSpace;return t}

// ---------- state, missions, HUD ----------
const lv=()=>1+(S.xp/100|0),shards=()=>S.inv.filter(n=>n.startsWith('Shard')).length;
const toast=m=>{const d=document.createElement('div');d.textContent=m;$('#toasts').append(d);setTimeout(()=>d.remove(),4200)};
const gain=n=>{const l=lv();S.xp+=n;if(lv()>l){toast('Level up — LV '+lv());sfx(660,.3,'triangle',.2);sfx(990,.4,'triangle',.2,.15)}};
const disc=(id,n)=>{if(!S.disc.includes(id)){S.disc.push(id);toast('Discovered: '+n);gain(25);sfx(520,.25,'triangle')}};
const MS=[['Discover the central hologram',()=>S.f.holo,'Scan the hologram in the central plaza.'],
['Find the hidden access card',()=>S.f.card,'Decrypt the plaza terminal, then follow the magenta line.'],
['Unlock the underground lab',()=>S.f.lab,'Use the card on the sealed hatch (check the map).'],
['Collect three digital artifacts',()=>shards()>=3,'Two shards in the library, one in the lab.'],
['Activate the ancient portal',()=>S.f.portal,'The portal waits near the plaza (check the map).']];
function hud(){$('#lv').textContent='LV '+lv();$('#xpb').style.width=S.xp%100+'%';$('#dc').textContent='◈ '+S.disc.length;const c=MS.findIndex((m,i)=>!S.done.includes(i));$('#ms').innerHTML=MS.map((m,i)=>`<li class="${S.done.includes(i)?'d':i===c?'c':''}">${m[0]}</li>`).join('');$('#hint').textContent=c<0?'All missions complete. The Nexus Core is waiting in the Void.':MS[c][2]}
function check(){MS.forEach((m,i)=>{if(!S.done.includes(i)&&m[1]()){S.done.push(i);toast('Mission complete: '+m[0]);gain(100);[523,659,784].forEach((f,k)=>sfx(f,.3,'triangle',.2,k*.12));if(S.done.length===5)setTimeout(()=>toast('All missions complete. A secret area is open.'),1800)}})}
function sync(){cardM.visible=!!S.f.sw&&!S.f.card;hemi.intensity=S.f.sw?1.9:1.1;swTop.material.color.set(S.f.sw?0xff2fb3:0x443344);const c=S.f.lab?0x00f0ff:0xff2244;hatchM.color.set(c);hatchM.emissive.set(c);if(S.f.lib)libD.c.off=1;AM.forEach(([n,m])=>m.visible=!S.inv.includes(n))}
let ui='intro',cur=null,hbf=null,pk='';
function holo(t,b,bl,f){$('#ht').textContent=t;$('#hbd').textContent=b;const h=$('#hb');h.hidden=!bl;h.textContent=bl||'';hbf=f;$('#holo').hidden=false;ui='holo';sfx(700,.2,'triangle',.08)}
const closeHolo=()=>{$('#holo').hidden=true;ui=''};
function tp(a,x,z){ui='tp';$('#fade').style.opacity=1;sfx(200,.6,'sawtooth',.1);setTimeout(()=>{Pl.x=x;Pl.z=z;Pl.y=base(x);Pl.vy=0;setA();follow(0,true);$('#fade').style.opacity=0;ui=''},350)}
const setA=()=>{sc.fog.density=FD[ar()]};

// ---------- world ----------
function ground(){const g=new T.Mesh(new T.PlaneGeometry(340,340),new T.MeshStandardMaterial({color:0x04060f,roughness:.1,metalness:.4}));g.rotation.x=-Math.PI/2;sc.add(g);const gr=new T.GridHelper(340,68,0x00aacc,0x3a1a77);gr.position.y=.03;gr.material.transparent=true;gr.material.opacity=.28;sc.add(gr);
 const sp=[];for(let i=0;i<700;i++){const a=rnd()*6.28,b=Math.acos(rnd()*2-1);sp.push(Math.sin(b)*Math.cos(a)*400,Math.cos(b)*400,Math.sin(b)*Math.sin(a)*400)}const sg=new T.BufferGeometry();sg.setAttribute('position',new T.Float32BufferAttribute(sp,3));stars=new T.Points(sg,new T.PointsMaterial({color:0xaaccff,size:1.6,sizeAttenuation:false,fog:false}));sc.add(stars);
 mkp(0,1,0,280,45,280,500,0x7ff);mkp(300,-39,0,22,7,22,80,0x7ff);mkp(-300,0,0,30,20,30,120,0xa8f)}
function city(){const ms=[0,1,2].map(()=>{const m=M(0x0a0f22,0xffffff,1);m.emissiveMap=winTex();return m});
 for(let i=-4;i<=4;i++)for(let j=-4;j<=4;j++){if(!i&&!j)continue;const w=10+rnd()*4,d=10+rnd()*4,h=16+rnd()*rnd()*70,g=new T.BoxGeometry(w,h,d),uv=g.attributes.uv;for(let k=0;k<uv.count;k++)uv.setXY(k,uv.getX(k)*(w+d)/24,uv.getY(k)*h/28);
  const b=new T.Mesh(g,ms[(j+9)%3]);b.position.set(i*24,h/2,j*24);sc.add(b);col.push({x0:i*24-w/2,x1:i*24+w/2,z0:j*24-d/2,z1:j*24+d/2,b:0,t:h});
  if(rnd()<.4)box(i*24+w/2+.15,6+rnd()*h*.5,j*24,.3,3+rnd()*4,3+rnd()*3,N(cols[rnd()*3|0]))}
 for(let k=0;k<6;k++){const m=box(0,14+k*2,[-60,-36,-12,12,36,60][k],3,.5,1.4,N(cols[k%3]));m.position.x=rnd()*300-150;cars.push({m,v:(8+rnd()*10)*(k%2?1:-1)})}}
function plaza(){const m=new T.Mesh(new T.CircleGeometry(14,48),M(0x0a1430,0x001122,.5));m.rotation.x=-Math.PI/2;m.position.y=.05;sc.add(m);
 [14,10,6].forEach((r,i)=>{const t=new T.Mesh(new T.TorusGeometry(r,.06,6,64),N(cols[i]));t.rotation.x=Math.PI/2;t.position.y=.1;sc.add(t)});
 const b=new T.Mesh(new T.CylinderGeometry(2.4,3,.8,24),M(0x0a1a30,0x00f0ff,.6));b.position.y=.4;sc.add(b);col.push({x0:-3,x1:3,z0:-3,z1:3,b:0,t:1});
 const k=new T.Mesh(new T.TorusKnotGeometry(1,.3,96,12),new T.MeshBasicMaterial({color:0x00f0ff,wireframe:true,transparent:true,opacity:.8})),ic=new T.Mesh(new T.IcosahedronGeometry(1.9,1),new T.MeshBasicMaterial({color:0x8a4dff,wireframe:true,transparent:true,opacity:.6}));k.scale.setScalar(2);k.position.y=ic.position.y=5.5;sc.add(k,ic);spin.push([k,.8],[ic,-.5]);
 hl=new T.PointLight(0x00f0ff,500,45,2);hl.position.set(0,5,0);sc.add(hl);
 ln(0,12,118,12,cols[0]);ln(12,12,12,34,cols[0]);ln(-36,12,0,12,cols[1]);ln(60,-48,60,12,cols[2])}
function places(){
 add('holo',0,0,0,'Scan the hologram',()=>{S.f.holo=1;disc('holo','Central Hologram');gain(40);holo('NEXUS HOLOGRAM','Archive fragment: "Before the blackout this city dreamed in light. Four seals keep its memory: a card, a vault, three shards and a gate."')},{r:6,loc:1,n:'Hologram'});
 box(8,1,6,1.6,2,1,M(0x0a1630,0x00f0ff,.6),true);
 add('term',8,0,6,'Use the terminal',()=>holo('NODE-07 TERMINAL','Encrypted signal detected. Decryption needs a manual trigger.','Decrypt signal',()=>{S.f.dec=1;disc('term','Data Terminal');save();holo('SIGNAL TRACED','A dormant switch hums at the end of the magenta line. Pull it — something is hidden there.')}));
 box(60,1.2,-36,.8,2.4,.8,M(0x1a0a2a,0xff2fb3,.5),true);swTop=box(60,2.6,-36,.6,.4,.6,N(0x443344));
 add('sw',60,0,-36,'Pull the hidden switch',()=>{S.f.sw=1;disc('sw','Hidden Switch');toast('The city lights surge. Something appeared nearby.');sfx(120,.5,'square',.2)},{off:()=>S.f.sw,loc:1,hid:1,n:'Hidden Switch'});
 cardM=item(new T.BoxGeometry(.9,.6,.08),0xff2fb3,60,1.4,-48);
 add('card',60,0,-48,'Take the access card',()=>{S.f.card=1;S.inv.push('Access Card');disc('card','Access Card');gain(60);toast('Access card acquired.')},{off:()=>!S.f.sw||S.f.card});
 hatchM=M(0x300008,0xff2244,1);const hc=new T.Mesh(new T.CylinderGeometry(2.2,2.2,.15,24),hatchM);hc.position.set(12,.08,36);sc.add(hc);
 add('lab',12,0,36,()=>!S.f.card?'Sealed hatch (needs access card)':S.f.lab?'Descend into the lab':'Unlock the hatch',()=>{if(!S.f.card){toast('Access denied. Find the access card.');sfx(110,.4,'sawtooth');return}if(!S.f.lab){S.f.lab=1;disc('lab','Underground Lab');gain(80)}tp('l',300,3)},{loc:1,n:'Lab Hatch'});
 // library (x 118..142, z 0..24)
 const wm=M(0x0b1226,0x1a1050,.5);box(130,4,0,24,8,1,wm,1);box(130,4,24,24,8,1,wm,1);box(142,4,12,1,8,24,wm,1);box(118,4,4.5,1,8,9,wm,1);box(118,4,19.5,1,8,9,wm,1);box(130,8.5,12,25,1,25,wm,1);box(130,.05,12,24,.1,24,M(0x080a1e,0x8a4dff,.25));box(130,7.2,1,22,.15,.1,N(0x00f0ff));box(130,7.2,23,22,.15,.1,N(0x8a4dff));
 libD=box(118,4,12,1,8,6,M(0x101a38,0x00f0ff,.5),true);
 for(let k=0;k<3;k++){const sm=M(0x120a30,0x5522aa,.6);box(124+k*7,2.5,2.5,5,5,1.2,sm,1);box(124+k*7,2.5,21.5,5,5,1.2,sm,1)}
 add('lib',115.5,0,12,'Open the library door',()=>{S.f.lib=1;disc('lib','Digital Library');libD.c.off=1;sfx(160,.6,'square',.15)},{off:()=>S.f.lib,loc:1,n:'Library'});
 [['Shard Alpha',130,0,6,'Fragment 01: "The city never slept. It was waiting for a visitor to remember it."'],['Shard Beta',136,0,18,'Fragment 02: "Every neon sign is a sentence. Read them in order and the streets spell a name."'],['Shard Gamma',300,-40,-6,'Fragment 03: "Beneath the city, the first machine still dreams of the sky."']].forEach(([n,x,y,z,tx])=>{
  const m=item(new T.OctahedronGeometry(.6),0x8a4dff,x,y+1.9,z),p=new T.Mesh(new T.CylinderGeometry(.7,.9,1.1,12),M(0x0a0f20,0x8a4dff,.4));p.position.set(x,y+.55,z);sc.add(p);AM.push([n,m]);
  add(n,x,y,z,'Collect '+n,()=>{S.inv.push(n);disc(n,n);gain(30);holo(n.toUpperCase(),tx)},{off:()=>S.inv.includes(n)})});
 const ring=new T.Mesh(new T.TorusGeometry(5,.4,12,48),M(0x8a4dff,0x8a4dff,.9));ring.position.set(-36,5.5,12);ring.rotation.y=Math.PI/2;sc.add(ring);
 portD=new T.MeshBasicMaterial({color:0x8a4dff,transparent:true,opacity:.2,side:T.DoubleSide});const pd=new T.Mesh(new T.CircleGeometry(4.6,32),portD);pd.position.copy(ring.position);pd.rotation.y=Math.PI/2;sc.add(pd);
 const pi=new T.Mesh(new T.IcosahedronGeometry(1.3,0),new T.MeshBasicMaterial({color:0xff2fb3,wireframe:true}));pi.position.copy(ring.position);sc.add(pi);spin.push([pi,2]);
 add('portal',-36,0,12,()=>S.f.portal?'Enter the portal':shards()>=3?'Activate the ancient portal':'Portal dormant (needs 3 shards)',()=>{if(!S.f.portal){if(shards()<3){toast('The portal is dormant. Collect 3 shards.');sfx(110,.4,'sawtooth');return}S.f.portal=1;disc('portal','Ancient Portal');gain(100)}tp('v',-300,6)},{r:5,loc:1,n:'Portal'})}
function lab(){const y=-40,wm=M(0x08121e,0x003344,.5);box(300,y-.05,0,24,.1,24,M(0x050c14,0x00f0ff,.15));box(300,y+4,-12,24,8,1,wm,1);box(300,y+4,12,24,8,1,wm,1);box(288,y+4,0,1,8,24,wm,1);box(312,y+4,0,1,8,24,wm,1);box(300,y+8.5,0,25,1,25,wm,1);box(300,y+7.4,-11.4,22,.15,.1,N(0x00f0ff));box(300,y+7.4,11.4,22,.15,.1,N(0x00f0ff));
 const tk=new T.Mesh(new T.CylinderGeometry(1.5,1.5,5,24),new T.MeshStandardMaterial({color:0x00f0ff,emissive:0x00aacc,emissiveIntensity:.6,transparent:true,opacity:.35}));tk.position.set(294,y+2.5,5);sc.add(tk);col.push({x0:292.5,x1:295.5,z0:3.5,z1:6.5,b:y,t:y+5});
 for(let k=0;k<4;k++)box(294+k*4,y+1,-10.4,2.5,2,1.2,M(0x0a1a2a,0x00f0ff,.5),true);
 const p=new T.Mesh(new T.CylinderGeometry(1.6,1.6,.1,24),M(0x003344,0x00f0ff,1));p.position.set(300,y+.05,9);sc.add(p);
 add('exitL',300,y,9,'Ascend to the city',()=>tp('c',12,31))}
function voidA(){const p=new T.Mesh(new T.CylinderGeometry(16,16,1,48),M(0x070a1c,0x3a1a77,.4));p.position.set(-300,-.5,0);sc.add(p);const r=new T.Mesh(new T.TorusGeometry(16,.12,6,64),N(0x8a4dff));r.rotation.x=Math.PI/2;r.position.set(-300,0,0);sc.add(r);
 item(new T.IcosahedronGeometry(1.8,1),0x00f0ff,-300,3.5,0);const w=new T.Mesh(new T.IcosahedronGeometry(3,1),new T.MeshBasicMaterial({color:0x8a4dff,wireframe:true}));w.position.set(-300,3.5,0);sc.add(w);spin.push([w,-.6]);
 add('core',-300,0,0,'Touch the NEXUS Core',()=>{S.f.end=1;disc('core','The Nexus Core');gain(200);holo('SECRET ENDING','The seals dissolve and the city wakes around you. You were never just a visitor. You are the memory it was waiting for. Thank you for exploring NEXUS.')},{r:5});
 const e=new T.Mesh(new T.CylinderGeometry(1.6,1.6,.1,24),M(0x220044,0x8a4dff,1));e.position.set(-300,.05,11);sc.add(e);
 add('exitV',-300,0,11,'Return to the city',()=>tp('c',-31,12))}

// ---------- player ----------
const Pl={x:0,y:0,z:20,vy:0,f:Math.PI},PG=new T.Group(),legs=[],K={},js={x:0,y:0};
let yaw=0,pitch=.35,phase=0,jq=0,runT=0;
function mkPlayer(){const sk=M(0x1b2a55,0x0a1a40,.5),gl=N(0x00f0ff),a=(g,m,x,y,z)=>{const o=new T.Mesh(g,m);o.position.set(x,y,z);PG.add(o);return o};
 a(new T.CapsuleGeometry(.36,.55,4,10),sk,0,1.15,0);a(new T.SphereGeometry(.3,16,12),sk,0,1.85,0);a(new T.BoxGeometry(.4,.14,.2),gl,0,1.88,.22);a(new T.BoxGeometry(.4,.5,.2),N(0x8a4dff),0,1.2,-.38);
 [-.17,.17].forEach(x=>{const g=new T.Group();g.position.set(x,.72,0);const l=new T.Mesh(new T.BoxGeometry(.2,.7,.22),sk);l.position.y=-.35;g.add(l);const f=new T.Mesh(new T.BoxGeometry(.22,.06,.3),gl);f.position.set(0,-.7,.04);g.add(f);PG.add(g);legs.push(g)});
 const r=a(new T.TorusGeometry(.6,.03,6,32),gl,0,.04,0);r.rotation.x=Math.PI/2;sc.add(PG)}
const hit=(x,y,z)=>col.some(c=>!c.off&&x>c.x0-.3&&x<c.x1+.3&&z>c.z0-.3&&z<c.z1+.3&&y>c.b-.3&&y<c.t+.3);
function resolve(){const r=.45;for(const c of col){if(c.off||Pl.y+1.8<c.b||Pl.y>c.t)continue;const cx=Math.max(c.x0,Math.min(Pl.x,c.x1)),cz=Math.max(c.z0,Math.min(Pl.z,c.z1)),dx=Pl.x-cx,dz=Pl.z-cz,d=Math.hypot(dx,dz);if(d<r){if(d>1e-4){Pl.x+=dx/d*(r-d);Pl.z+=dz/d*(r-d)}else Pl.x=c.x0-r}}}
function upd(dt){
 let ix=(K.KeyD||K.ArrowRight?1:0)-(K.KeyA||K.ArrowLeft?1:0)+js.x,iy=(K.KeyW||K.ArrowUp?1:0)-(K.KeyS||K.ArrowDown?1:0)+js.y;const l=Math.hypot(ix,iy);if(l>1){ix/=l;iy/=l}
 const run=K.ShiftLeft||K.ShiftRight||runT,v=run?9:5,s=Math.sin(yaw),c=Math.cos(yaw),vx=(-s*iy+c*ix)*v,vz=(-c*iy-s*ix)*v,mv=Math.min(1,l);
 Pl.x+=vx*dt;Pl.z+=vz*dt;resolve();const a=ar();
 if(a==='c'){Pl.x=Math.max(-148,Math.min(148,Pl.x));Pl.z=Math.max(-148,Math.min(148,Pl.z))}else if(a==='v'){const dx=Pl.x+300,d=Math.hypot(dx,Pl.z);if(d>15){Pl.x=-300+dx/d*15;Pl.z=Pl.z/d*15}}
 const fl=base(Pl.x);if((K.Space||jq)&&Pl.y<=fl+.01){Pl.vy=7.5;sfx(300,.15,'sine',.1)}jq=0;Pl.vy-=22*dt;Pl.y+=Pl.vy*dt;if(Pl.y<fl){Pl.y=fl;Pl.vy=0}
 if(mv>.05){let d=Math.atan2(vx,vz)-Pl.f;d=Math.atan2(Math.sin(d),Math.cos(d));Pl.f+=d*Math.min(1,dt*12);phase+=dt*(run?14:9);legs[0].rotation.x=Math.sin(phase)*.8;legs[1].rotation.x=-Math.sin(phase)*.8}else legs.forEach(g=>g.rotation.x*=.8);
 PG.position.set(Pl.x,Pl.y,Pl.z);PG.rotation.y=Pl.f;
 cur=null;let bd=1e9;for(const o of I){if(o.a!==a||(o.off&&o.off()))continue;const d=Math.hypot(o.x-Pl.x,o.z-Pl.z);if(d<o.r&&d<bd){bd=d;cur=o}}}
const V=new T.Vector3();
function follow(dt,snap){const cp=Math.cos(pitch),dx=Math.sin(yaw)*cp,dy=Math.sin(pitch),dz=Math.cos(yaw)*cp,y0=Pl.y+1.6;let d=7;for(let s=1;s<=14;s++){const k=s/2;if(hit(Pl.x+dx*k,y0+dy*k,Pl.z+dz*k)){d=Math.max(1.2,k-.5);break}}
 V.set(Pl.x+dx*d,Math.max(y0+dy*d,Pl.y+.4),Pl.z+dz*d);if(snap)cam.position.copy(V);else cam.position.lerp(V,1-Math.exp(-dt*10));cam.lookAt(Pl.x,y0,Pl.z)}
function interact(){if(ui==='holo')return closeHolo();if(ui||!cur)return;audio();sfx(440,.12,'square',.08);cur.go();check();sync();hud();save()}
function prompt(){const s=!ui&&cur?(coarse?'TAP  ':'[E]  ')+(typeof cur.t==='function'?cur.t():cur.t):'';if(s!==pk){pk=s;const p=$('#pr');p.hidden=!s;p.textContent=s;$('#ba').classList.toggle('on',!!s)}}

// ---------- menu / map ----------
function map(){const g=$('#map').getContext('2d'),W=200,s=W/300,X=x=>W/2+x*s;g.fillStyle='#050a18';g.fillRect(0,0,W,W);g.strokeStyle='#1c3a6a';g.strokeRect(.5,.5,W-1,W-1);g.font='10px sans-serif';
 for(const o of I){if(!o.loc||(o.hid&&!S.f.dec&&!S.disc.includes(o.id)))continue;const k=S.disc.includes(o.id);g.fillStyle=k?'#00f0ff':'#45506a';g.beginPath();g.arc(X(o.x),X(o.z),4,0,7);g.fill();g.fillStyle='#d8f6ff';g.textAlign=o.x>60?'right':'left';g.fillText(k?o.n:'?',X(o.x)+(o.x>60?-7:7),X(o.z)+3)}
 g.textAlign='left';if(ar()==='c'){g.fillStyle='#ff2fb3';g.beginPath();g.arc(X(Pl.x),X(Pl.z),3.5,0,7);g.fill()}else{g.fillStyle='#8a4dff';g.fillText('You are in a hidden area',30,100)}}
function openMenu(){ui='menu';$('#menu').hidden=false;$('#inv').innerHTML=S.inv.length?S.inv.map(n=>`<li>${n}</li>`).join(''):'<li>Empty</li>';map()}
const closeMenu=()=>{$('#menu').hidden=true;ui=''};
const esc=()=>ui==='holo'?closeHolo():ui==='menu'?closeMenu():ui===''&&openMenu();
const resize=()=>{R.setSize(innerWidth,innerHeight,false);cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix()};
function applyQ(){R.setPixelRatio(Math.min(devicePixelRatio,[1,1.5,2][O.q]));resize();PT.forEach(p=>p.geometry.setDrawRange(0,p.n*[.3,.6,1][O.q]|0))}

// ---------- input ----------
addEventListener('keydown',e=>{if(e.repeat&&e.code!=='Space')return;K[e.code]=1;if(e.code==='KeyE')interact();else if(e.code==='Escape')esc();else if(e.code==='KeyM'){O.snd^=1;$('#snd').checked=!!O.snd;setSnd();save();toast(O.snd?'Sound on':'Sound muted')}if(e.code==='Space')e.preventDefault()});
addEventListener('keyup',e=>K[e.code]=0);addEventListener('blur',()=>{for(const k in K)K[k]=0});
const cv=$('#c'),pt={};
cv.addEventListener('pointerdown',e=>{pt[e.pointerId]=[e.clientX,e.clientY];cv.setPointerCapture(e.pointerId)});
cv.addEventListener('pointermove',e=>{const p=pt[e.pointerId];if(!p)return;if(!ui){yaw-=(e.clientX-p[0])*.005*O.sens;pitch=Math.max(.05,Math.min(1.2,pitch+(e.clientY-p[1])*.005*O.sens))}p[0]=e.clientX;p[1]=e.clientY});
['pointerup','pointercancel'].forEach(n=>cv.addEventListener(n,e=>delete pt[e.pointerId]));
const st=$('#stick'),kn=$('#knob');let sid=null;
const jm=e=>{const r=st.getBoundingClientRect(),dx=e.clientX-r.left-r.width/2,dy=e.clientY-r.top-r.height/2,d=Math.min(50,Math.hypot(dx,dy)),a=Math.atan2(dy,dx),nx=Math.cos(a)*d,ny=Math.sin(a)*d;kn.style.transform=`translate(${nx}px,${ny}px)`;js.x=nx/50;js.y=-ny/50;if(Math.hypot(js.x,js.y)<.15)js.x=js.y=0};
st.addEventListener('pointerdown',e=>{sid=e.pointerId;st.setPointerCapture(sid);jm(e)});st.addEventListener('pointermove',e=>{if(e.pointerId===sid)jm(e)});
['pointerup','pointercancel'].forEach(n=>st.addEventListener(n,e=>{if(e.pointerId===sid){sid=null;js.x=js.y=0;kn.style.transform=''}}));
$('#bj').addEventListener('pointerdown',()=>jq=1);$('#br').addEventListener('pointerdown',e=>{runT^=1;e.currentTarget.classList.toggle('on',!!runT)});$('#ba').addEventListener('pointerdown',interact);$('#pr').addEventListener('pointerdown',interact);
$('#bm').onclick=()=>{audio();esc()};$('#rsm').onclick=closeMenu;$('#hb').onclick=()=>hbf&&hbf();$('#hx').onclick=closeHolo;
const sn=$('#snd'),se=$('#sens'),qq=$('#qual');sn.checked=!!O.snd;se.value=O.sens;qq.value=O.q;
sn.onchange=()=>{O.snd=sn.checked?1:0;setSnd();save()};se.oninput=()=>{O.sens=+se.value;save()};qq.onchange=()=>{O.q=+qq.value;applyQ();save()};
if(!document.fullscreenEnabled)$('#fs').hidden=true;
$('#fs').onclick=()=>document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen().catch(()=>toast('Fullscreen was blocked by the browser'));
$('#rs').onclick=()=>{if(confirm('Erase all NEXUS progress and restart?')){localStorage.removeItem('nexus-save');location.reload()}};
$('#skip').onclick=()=>$('#intro').classList.add('go');
$('#play').onclick=()=>{audio();$('#intro').hidden=true;$('#hud').hidden=false;ui='';hud();follow(0,true);toast(coarse?'Joystick to move · drag to look · ACT to interact':'WASD move · Shift run · Space jump · E interact · Esc menu')};
addEventListener('resize',resize);

// ---------- loop ----------
let t=0,last=performance.now();
function loop(now){requestAnimationFrame(loop);const dt=Math.min(.05,(now-last)/1000);last=now;t+=dt;
 spin.forEach(([m,r,y])=>{m.rotation.y+=r*dt;if(y!=null)m.position.y=y+Math.sin(t*2+r)*.15});
 cars.forEach(c=>{const p=c.m.position;p.x+=c.v*dt;if(p.x>150)p.x=-150;if(p.x<-150)p.x=150});
 PT.forEach((p,i)=>p.position.y=Math.sin(t*.5+i)*.6);hl.intensity=450+Math.sin(t*3)*120;
 libD.position.y+=((S.f.lib?12:4)-libD.position.y)*Math.min(1,dt*3);portD.opacity=(S.f.portal?.5:.15)+Math.sin(t*3)*.08;stars.position.copy(cam.position);
 if(ui==='intro'){cam.position.set(Math.sin(t*.12)*34,12+Math.sin(t*.3)*3,Math.cos(t*.12)*34);cam.lookAt(0,7,0)}else{if(!ui)upd(dt);follow(dt)}
 lt.position.set(Pl.x,Pl.y+4,Pl.z);prompt();R.render(sc,cam)}

(async()=>{try{const steps=[ground,city,plaza,places,lab,voidA,mkPlayer];for(let i=0;i<steps.length;i++){steps[i]();$('#bar').style.width=(i+1)/steps.length*100+'%';await new Promise(r=>setTimeout(r,40))}
 applyQ();sync();hud();setA();PG.position.set(Pl.x,0,Pl.z);PG.rotation.y=Pl.f;$('#load').hidden=true;$('#intro').hidden=false;requestAnimationFrame(loop)}
catch(e){console.error(e);$('#err').hidden=false;$('#err p').textContent='Something went wrong while building the city: '+e.message}})();
