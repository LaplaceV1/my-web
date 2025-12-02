(function(){
  const runBtn = document.getElementById('runBtn');
  const codeIn = document.getElementById('codeIn');
  const preview = document.getElementById('preview');
  const logBody = document.getElementById('logBody');
  const preset = document.getElementById('preset');
  const copyBtn = document.getElementById('copyBtn');
  const downloadBtn = document.getElementById('downloadBtn');

  function log(msg){
    logBody.textContent = (new Date()).toLocaleTimeString() + '  ' + msg + '\n' + logBody.textContent;
  }

  function simpleVisualObf(src, level){
    // safe visual-only transformations:
    // 1) base64 encode small strings
    // 2) replace variable names with visually complex names
    // 3) insert fake control flow comments
    let out = src || "// nothing provided";
    // base64 sample
    try {
      const b64 = btoa(unescape(encodeURIComponent(out))).slice(0, 80);
      out = `/* v.s-enc:${b64}... */\n` + out;
    } catch(e){}
    // rename some obvious identifiers (visual only)
    out = out.replace(/\b(function|var|let|const)\b/g, '/*ƒ*/$1');
    out = out.replace(/\b([a-zA-Z_]\w{2,12})\b/g, (m, p1) => {
      // avoid JS keywords
      if (['return','if','for','while','switch','case','break','else','new','this'].includes(p1)) return p1;
      // produce fancy name
      return p1.split('').map((c,i)=> (i%2? c : ['Δ','λ','ψ','∂','✕'][i%5])).join('');
    });
    // add fake control flow
    out = `/* --- Obfuscation Visual Preview (safe demo) --- */\n// preset: ${level}\n` + out + `\n\n// [control-flow virtualizer (visual-only)]\n/* >>> vm-encoded-block-1 >>> */\n`;
    return out;
  }

  runBtn && runBtn.addEventListener('click', () => {
    const src = codeIn.value;
    const level = preset.value;
    log('starting obfuscation (visual demo)... preset=' + level);
    preview.textContent = '// processing...';
    setTimeout(() => {
      const result = simpleVisualObf(src, level);
      preview.textContent = result;
      log('preview generated');
    }, 700 + Math.random()*700);
  });

  copyBtn && copyBtn.addEventListener('click', () => {
    const t = preview.textContent || '';
    navigator.clipboard?.writeText(t);
    log('preview copied to clipboard');
  });

  downloadBtn && downloadBtn.addEventListener('click', () => {
    const content = preview.textContent || '';
    const blob = new Blob([content], {type:'text/plain'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'obfuscation-preview.txt';
    a.click();
    URL.revokeObjectURL(a.href);
    log('report downloaded');
  });

})();
