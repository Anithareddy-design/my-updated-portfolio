// ── NAVBAR ──
const nb = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  nb.classList.toggle('scrolled', window.scrollY > 60);
  updateActive();
});
function updateActive() {
  const s = window.scrollY + 120;
  document.querySelectorAll('section[id]').forEach(sec => {
    const lnk = document.querySelector('.nav-links a[href="#'+sec.id+'"]');
    if (lnk) lnk.classList.toggle('active', s >= sec.offsetTop && s < sec.offsetTop + sec.offsetHeight);
  });
}

// ── HAMBURGER ──
const ham = document.getElementById('ham'), drawer = document.getElementById('drawer'), dc = document.getElementById('dc');
ham.addEventListener('click', () => drawer.classList.add('open'));
dc.addEventListener('click', () => drawer.classList.remove('open'));
document.querySelectorAll('.dl').forEach(l => l.addEventListener('click', () => drawer.classList.remove('open')));

// ── SMOOTH SCROLL ──
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior:'smooth' }); }
  });
});

// ── SCROLL REVEAL ──
const obs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
document.querySelectorAll('.reveal,.reveal-left,.reveal-right').forEach(el => obs.observe(el));

// ── HERO CANVAS ──
(function() {
  const c = document.getElementById('hero-canvas'), ctx = c.getContext('2d');
  let W, H, pts = [], nodes = [];
  function resize() { W = c.width = window.innerWidth; H = c.height = window.innerHeight; }
  function rnd(a,b) { return Math.random()*(b-a)+a; }
  function init() {
    pts = Array.from({length:Math.floor(W/18)}, () => ({
      x:rnd(0,W),y:rnd(0,H),vx:rnd(-.2,.2),vy:rnd(-.3,-.05),
      r:rnd(.5,1.8),o:rnd(.15,.5),
      col:['#c9a84c','#7c5cbf','#1a8fff'][Math.floor(Math.random()*3)]
    }));
    nodes = Array.from({length:Math.floor(W/120)}, () => ({
      x:rnd(0,W),y:rnd(0,H),vx:rnd(-.1,.1),vy:rnd(-.1,.1)
    }));
  }
  function hexRGBA(hex,a) {
    return 'rgba('+parseInt(hex.slice(1,3),16)+','+parseInt(hex.slice(3,5),16)+','+parseInt(hex.slice(5,7),16)+','+a+')';
  }
  function draw() {
    ctx.clearRect(0,0,W,H);
    ctx.lineWidth=.5;
    for(let i=0;i<nodes.length;i++){
      for(let j=i+1;j<nodes.length;j++){
        const dx=nodes[i].x-nodes[j].x,dy=nodes[i].y-nodes[j].y,d=Math.sqrt(dx*dx+dy*dy);
        if(d<200){ctx.strokeStyle='rgba(201,168,76,'+(1-d/200)*.08+')';ctx.beginPath();ctx.moveTo(nodes[i].x,nodes[i].y);ctx.lineTo(nodes[j].x,nodes[j].y);ctx.stroke();}
      }
      const n=nodes[i]; n.x+=n.vx; n.y+=n.vy;
      if(n.x<0||n.x>W) n.vx*=-1;
      if(n.y<0||n.y>H) n.vy*=-1;
      ctx.beginPath();ctx.arc(n.x,n.y,1.5,0,Math.PI*2);ctx.fillStyle='rgba(201,168,76,.2)';ctx.fill();
    }
    pts.forEach(p => {
      ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle=hexRGBA(p.col,p.o);ctx.fill();
      p.x+=p.vx;p.y+=p.vy;
      if(p.y<-10){p.y=H+10;p.x=rnd(0,W);}
      if(p.x<0||p.x>W) p.vx*=-1;
    });
    requestAnimationFrame(draw);
  }
  window.addEventListener('resize', () => { resize(); init(); });
  resize(); init(); draw();
})();

// ── JARVIS OS ──
const jos = document.getElementById('jos'), jmsg = document.getElementById('jmsg');
const WELCOME = "Hello Ma'am Anita. I'm JARVIS, your personal AI assistant. How can I help you today?";
let ti = null, ttsActive = false;

function openJOS() {
  jos.classList.add('active');
  document.body.style.overflow = 'hidden';
  typeMsg('"' + WELCOME + '"');
  if ('speechSynthesis' in window && !ttsActive) {
    ttsActive = true;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(WELCOME);
    u.rate=.92;u.pitch=.9;u.volume=.85;
    u.onend=()=>{ttsActive=false;};
    speechSynthesis.speak(u);
  }
}
function closeJOS() {
  jos.classList.remove('active');
  document.body.style.overflow='';
  speechSynthesis.cancel();ttsActive=false;
  if(ti) clearInterval(ti);
}
function typeMsg(msg) {
  if(ti) clearInterval(ti);
  jmsg.innerHTML='';
  let i=0;
  ti=setInterval(()=>{
    if(i<msg.length){jmsg.innerHTML=msg.slice(0,i+1)+'<span class="cursor"></span>';i++;}
    else{jmsg.innerHTML=msg;clearInterval(ti);}
  },30);
}
function jPanel(p) {
  speechSynthesis.cancel();
  if(p==='about') typeMsg('"JARVIS is an evolving personal AI assistant built by Anita Reddy, designed to make technology feel personal and effortless. It understands screens, speaks naturally, and assists with daily tasks."');
  if(p==='caps') typeMsg('"My capabilities include: Screen Understanding, Natural Voice Interaction, Persistent Memory, System Assistance, and I am being developed into a full real-world AI application."');
}
function toggleNote(){
  const n=document.getElementById('dn');
  n.style.display=n.style.display==='none'||n.style.display===''?'block':'none';
}
jos.addEventListener('click',e=>{ if(e.target===jos) closeJOS(); });
document.addEventListener('keydown',e=>{ if(e.key==='Escape'&&jos.classList.contains('active')) closeJOS(); });

// ── CONTACT FORM ──
function handleForm(e) {
  e.preventDefault();
  const btn=document.getElementById('fsub');
  btn.textContent='Sending\u2026';btn.disabled=true;
  setTimeout(()=>{
    document.getElementById('cf').style.display='none';
    document.getElementById('fsucc').style.display='block';
  },1200);
}