// wait dom
document.addEventListener('DOMContentLoaded', () => {

  /* LOADER simulation */
  const loader = document.getElementById('loader-wrap');
  function hideLoader(){
    loader.style.transition = 'opacity 0.6s ease';
    loader.style.opacity = 0;
    setTimeout(()=> loader.remove(),700);
  }
  // fake loading sequence
  setTimeout(()=>{ hideLoader(); }, 1600);

  /* Parallax + mouse follow */
  const girl = document.getElementById('girl');
  const scene = document.querySelector('.scene');

  document.addEventListener('mousemove', (e) => {
    const x = (window.innerWidth / 2 - e.pageX) / 40;
    const y = (window.innerHeight / 2 - e.pageY) / 40;
    if (girl) girl.style.transform = `translate(${x}px, ${y}px) rotate(${x/25}deg)`;
    // small eye-shine follow
    const shine = document.getElementById('eye-shine');
    if (shine) {
      shine.style.left = (50 - x*1.2) + '%';
      shine.style.top = (46 - y*0.7) + '%';
    }
  });

  /* Random blink (brightness shim) */
  setInterval(() => {
    if (!girl) return;
    girl.style.filter = "brightness(0.7) saturate(0.9)";
    setTimeout(()=>{ girl.style.filter = "brightness(1) saturate(1)"; }, 120);
  }, Math.random()*8000 + 4000);

  /* Eye flash more visible sometimes */
  setInterval(() => {
    const e = document.querySelector('.eye-shine');
    if (!e) return;
    e.style.opacity = 1;
    setTimeout(()=> e.style.opacity = 0, 240);
  }, 6000);

  /* WIND effect: subtle horizontal motion + hair sway particles */
  const windCanvas = document.getElementById('wind-canvas');
  if (windCanvas) {
    const ctx = windCanvas.getContext('2d');
    function resizeWind(){ windCanvas.width = windCanvas.clientWidth; windCanvas.height = windCanvas.clientHeight; }
    resizeWind();
    window.addEventListener('resize', resizeWind);

    let gust = 0;
    function drawWind(){
      ctx.clearRect(0,0,windCanvas.width,windCanvas.height);
      // occasionally increase gust
      if (Math.random() < 0.008) gust = 1.2 + Math.random()*2.8;
      gust *= 0.98;
      // draw a few streaks
      for (let i=0;i<6;i++){
        const y = windCanvas.height*0.2 + i*(windCanvas.height*0.12) + Math.sin(Date.now()/2000 + i)*6;
        ctx.beginPath();
        ctx.moveTo( -50, y );
        ctx.lineTo( windCanvas.width + 50, y + gust*8 );
        ctx.strokeStyle = `rgba(255,60,60, ${0.02 + Math.abs(Math.sin(Date.now()/1000+i))/8})`;
        ctx.lineWidth = 2 + Math.abs(Math.sin(Date.now()/1200+i))*1;
        ctx.stroke();
      }
      requestAnimationFrame(drawWind);
    }
    drawWind();
  }

  /* Typewriter effect for the Japanese text */
  const typeTarget = document.getElementById('typewriter');
  const textToType = '未来はコードで書き換えられる。';
  function typewrite(el, text, delay = 80){
    let i = 0;
    el.textContent = '';
    const interval = setInterval(() => {
      el.textContent += text[i++];
      if (i >= text.length) clearInterval(interval);
    }, delay);
  }
  // start delayed after loader
  setTimeout(()=> typewrite(typeTarget, textToType, 100), 900);

});
