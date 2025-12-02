// main.js - safe, dependency free

(function(){
  // ---------- DOM helpers ----------
  const $ = (sel) => document.querySelector(sel);

  // ---------- LOADING SCREEN ----------
  const loading = $('#loading-screen');
  function hideLoading(){
    if(!loading) return;
    loading.style.transition = 'opacity 400ms ease';
    loading.style.opacity = '0';
    setTimeout(()=>{ loading && loading.remove(); }, 500);
  }

  // simulate loading then hide
  document.addEventListener('DOMContentLoaded', () => {
    // ensure assets loaded (image)
    const img = document.getElementById('girl');
    let loaded = false;
    function tryHide(){
      if(loaded) return hideLoading();
      // fallback in case image slow
      setTimeout(hideLoading, 1200);
    }
    if(img && img.complete) { loaded = true; tryHide(); }
    else if(img){
      img.addEventListener('load', ()=>{ loaded=true; tryHide(); });
      img.addEventListener('error', ()=>{ loaded=true; tryHide(); });
    } else {
      setTimeout(hideLoading, 800);
    }
  });

  // ---------- TYPEWRITER ----------
  const phrases = ["未来はコードで", "書き換えられる。"];
  const typeEl = document.getElementById('typewriter');
  const cursor = document.querySelector('.cursor');
  let pIndex=0, cIndex=0;
  function typewrite(){
    if(!typeEl) return;
    const current = phrases[pIndex];
    if(cIndex <= current.length){
      typeEl.textContent = current.slice(0, cIndex);
      cIndex++;
      setTimeout(typewrite, 80 + Math.random()*60);
    } else {
      // pause then next phrase or loop
      setTimeout(()=>{ cIndex=0; pIndex=(pIndex+1) % phrases.length; typewrite(); }, 900);
    }
  }
  // start after small delay
  setTimeout(typewrite, 900);

  // ---------- PARALLAX + PUPIL + FLOAT tweaks ----------
  const girl = document.getElementById('girl');
  const eye = document.getElementById('eye-shine');
  const wrap = document.querySelector('.girl-wrap');

  // safe defaults if missing
  const win = window;

  // parallax: compute offsets relative to center of viewport
  document.addEventListener('mousemove', (e)=>{
    if(!girl) return;
    const cx = win.innerWidth/2, cy = win.innerHeight/2;
    const dx = (e.clientX - cx)/40;
    const dy = (e.clientY - cy)/60;
    girl.style.transform = `translate(${ -dx }px, ${ -dy }px) rotate(${ dx*0.08 }deg)`;
    // move pupil (eye-shine) relative to image box
    if(eye && wrap){
      const rect = wrap.getBoundingClientRect();
      const rx = (e.clientX - rect.left) / rect.width; // 0..1
      const ry = (e.clientY - rect.top) / rect.height;
      // clamp and convert to small movement range
      const mx = (rx - 0.5) * 32; // +/-16px
      const my = (ry - 0.5) * 24; // +/-12px
      eye.style.transform = `translate(calc(-50% + ${mx}px), calc(-50% + ${my}px)) scale(1)`;
      eye.style.opacity = 0.95;
    }
  });

  // small random blink (simulate) using filter brightness
  setInterval(()=>{
    if(!girl) return;
    girl.style.filter = "brightness(0.72)";
    setTimeout(()=>{ girl.style.filter = "brightness(1)"; }, 110);
  }, 4000 + Math.random()*6000);

  // ---------- WIND PARTICLES (canvas) ----------
  function initWind(){
    const canvas = document.getElementById('windCanvas');
    if(!canvas) return;
    const wrapRect = canvas.parentElement.getBoundingClientRect();
    canvas.width = wrapRect.width;
    canvas.height = wrapRect.height;
    const ctx = canvas.getContext('2d');
    const particles = [];
    function spawn(){
      // spawn at left or right depending viewport
      const side = Math.random() < 0.5 ? -1 : 1;
      particles.push({
        x: side < 0 ? -10 : canvas.width + 10,
        y: Math.random()*canvas.height*0.9,
        vx: (side<0?1:-1)*(1 + Math.random()*3),
        vy: (Math.random()-0.5)*0.6,
        life: 200 + Math.random()*200,
        size: 1 + Math.random()*2,
        alpha: 0.05 + Math.random()*0.12
      });
    }
    function step(){
      ctx.clearRect(0,0,canvas.width,canvas.height);
      if(Math.random()<0.25) spawn();
      for(let i=particles.length-1;i>=0;i--){
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
        // draw line
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - p.vx*2, p.y - p.vy*2);
        ctx.strokeStyle = `rgba(230,40,40, ${p.alpha})`;
        ctx.lineWidth = p.size;
        ctx.stroke();
        if(p.life <=0 || p.x < -50 || p.x > canvas.width+50) particles.splice(i,1);
      }
      requestAnimationFrame(step);
    }
    step();
    // resize observer for responsiveness
    new ResizeObserver(()=> {
      const r = canvas.parentElement.getBoundingClientRect();
      canvas.width = r.width;
      canvas.height = r.height;
    }).observe(canvas.parentElement);
  }
  // init after load
  window.addEventListener('load', initWind);

  // ---------- SAFE: avoid errors on old browsers ----------
  // small polyfills/failsafes
  if(!window.ResizeObserver){
    // ignore, wind effect will be ok on most browsers
  }

})();
