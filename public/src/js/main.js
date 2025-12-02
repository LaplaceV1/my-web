/* main.js
 - Parallax + float + wind + glitch + particles + typewriter + loading
 - Expects image at ../public/girl.png sized roughly 450px wide
*/

/* UTIL: wait for DOM */
function ready(fn){ if(document.readyState!='loading') fn(); else document.addEventListener('DOMContentLoaded',fn); }

ready(()=>{

  const girlWrap = document.getElementById('girlWrap');
  const girl = document.getElementById('girl');
  const maskGlow = document.getElementById('maskGlow');
  const particlesCanvas = document.getElementById('particles');
  const loading = document.getElementById('loading');
  const typeTarget = document.getElementById('typewriterTarget');

  /* -------------------------
     Loading simulation
     ------------------------- */
  setTimeout(()=> {
    // reveal after short simulated load
    if(loading) loading.style.display = 'none';
  }, 1600); // keep short for testing; increase if you want longer

  /* -------------------------
     Typewriter
     ------------------------- */
  const text = '未来はコードで書き換えられる。';
  function typewrite(target, str, speed=60, cb){
    target.textContent = '';
    let i = 0;
    const t = setInterval(()=>{
      target.textContent += str[i] || '';
      i++;
      if(i>str.length){
        clearInterval(t);
        if(cb) cb();
      }
    }, speed);
  }
  if(typeTarget) typewrite(typeTarget, text, 80);

  /* -------------------------
     Parallax + float + wind physics
     ------------------------- */
  // store base transform for float animation
  let floatY = 0;
  let wind = 0;
  let lastMouse = {x:window.innerWidth/2, y:window.innerHeight/2};

  document.addEventListener('mousemove', (e)=>{
    const mx = e.clientX;
    const my = e.clientY;
    lastMouse = {x:mx, y:my};
    // small parallax map: move image slightly relative to center
    const cx = (window.innerWidth / 2 - mx) / 35;
    const cy = (window.innerHeight / 2 - my) / 50;
    // tilt effect
    const tiltX = (mx - window.innerWidth/2) / 80;
    const tiltY = (my - window.innerHeight/2) / 120;
    if(girlWrap){
      // combine transforms: parallax + tilt + floating + subtle rotate for hairsway
      const translate = `translate(${cx}px, ${cy + floatY}px) rotate(${tiltX}deg)`;
      girlWrap.style.transform = translate;
    }
    // emulate wind rush when mouse moves fast
    wind = Math.min(6, Math.abs((e.movementX||0)/5));
  });

  // float loop
  let up = true;
  setInterval(()=>{
    floatY = up ? -8 : 0;
    up = !up;
    // decay wind
    wind *= 0.85;
    // apply hair sway (CSS transform through JS on image)
    if(girl){
      const hairSway = Math.sin(Date.now() / 800) * (1 + wind*0.6);
      girl.style.transform = `translateZ(0) rotate(${hairSway}deg)`;
    }
  }, 2200);

  /* -------------------------
     Random blink (brightness) to simulate eyelid
     ------------------------- */
  setInterval(()=>{
    if(!girl) return;
    girl.style.filter = 'brightness(0.7)';
    setTimeout(()=> girl.style.filter = 'brightness(1)', 120);
  }, Math.random()*6000 + 4000);

  /* -------------------------
     Glitch micro-shifts (very subtle)
     ------------------------- */
  setInterval(()=>{
    if(!girlWrap) return;
    girlWrap.style.transition = 'transform 120ms ease-out';
    // quick offset then back
    girlWrap.style.transform += ' translateX(0px)';
    setTimeout(()=> { girlWrap.style.transition = ''; }, 140);
  }, 3000 + Math.random()*2000);

  /* -------------------------
     Particles canvas: tiny neon dust
     ------------------------- */
  if(particlesCanvas && particlesCanvas.getContext){
    const dpi = window.devicePixelRatio || 1;
    function resizeCanvas(){
      particlesCanvas.width = 540 * dpi;
      particlesCanvas.height = 540 * dpi;
      particlesCanvas.style.width = '540px';
      particlesCanvas.style.height = '540px';
    }
    resizeCanvas();
    const ctx = particlesCanvas.getContext('2d');
    ctx.scale(dpi, dpi);

    // generate particles
    const partCount = 40;
    const parts = [];
    for(let i=0;i<partCount;i++){
      parts.push({
        x: Math.random()*540,
        y: Math.random()*540,
        r: Math.random()*1.6+0.3,
        vx: (Math.random()-0.5)*0.2,
        vy: -0.1 - Math.random()*0.4,
        hue: 350 + Math.random()*20
      });
    }

    function draw(){
      ctx.clearRect(0,0,540,540);
      for(let p of parts){
        p.x += p.vx + wind*0.02;
        p.y += p.vy;
        if(p.y < -10) { p.y = 560; p.x = Math.random()*540; }
        if(p.x < -10) p.x = 550;
        if(p.x > 550) p.x = -10;
        ctx.beginPath();
        const g = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*6);
        g.addColorStop(0, `hsla(${p.hue}, 90%, 60%, 0.9)`);
        g.addColorStop(0.4, `hsla(${p.hue}, 80%, 55%, 0.35)`);
        g.addColorStop(1, `hsla(${p.hue}, 70%, 50%, 0)`);
        ctx.fillStyle = g;
        ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fill();
      }
      requestAnimationFrame(draw);
    }
    draw();
    window.addEventListener('resize', resizeCanvas);
  }

  /* Accessibility fallback: ensure hero image size fixed (450px) */
  if(girl){
    girl.width = 450;
  }

}); // ready
