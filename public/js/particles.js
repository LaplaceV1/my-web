// basic particle field (neon dust)
(() => {
  const canvas = document.getElementById('particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, particles = [];

  function resize() {
    w = canvas.width = innerWidth;
    h = canvas.height = innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  function rand(min,max){return Math.random()*(max-min)+min}

  for (let i=0;i<60;i++){
    particles.push({
      x: rand(0,w),
      y: rand(0,h),
      r: rand(0.4,2.2),
      vx: rand(-0.2,0.2),
      vy: rand(-0.1,0.1),
      a: rand(0.05,0.9),
      hue: rand(330,10)
    });
  }

  function draw(){
    ctx.clearRect(0,0,w,h);
    for (let p of particles){
      p.x += p.vx;
      p.y += p.vy;
      p.a += Math.sin(Date.now()/10000)*0.002;
      if (p.x < -10) p.x = w+10;
      if (p.x > w+10) p.x = -10;
      if (p.y < -10) p.y = h+10;
      if (p.y > h+10) p.y = -10;

      ctx.beginPath();
      ctx.fillStyle = `rgba(255,59,59,${0.06 + Math.abs(Math.sin(p.a))*0.18})`;
      ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }
  draw();
})();
