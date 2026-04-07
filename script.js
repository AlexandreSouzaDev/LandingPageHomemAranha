const cursor = document.getElementById('cursor');
 
document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top  = e.clientY + 'px';
});
 
document.addEventListener('mousedown', () => cursor.classList.add('click'));
document.addEventListener('mouseup',   () => cursor.classList.remove('click'));
 
 
/* ===========================
   BACKGROUND WEB CANVAS
=========================== */
const bgCanvas = document.getElementById('web-canvas');
const bgCtx    = bgCanvas.getContext('2d');
let nodes = [];
 
function resizeBg() {
  bgCanvas.width  = window.innerWidth;
  bgCanvas.height = window.innerHeight;
}
resizeBg();
window.addEventListener('resize', resizeBg);
 
// Create floating nodes
for (let i = 0; i < 18; i++) {
  nodes.push({
    x:  Math.random() * window.innerWidth,
    y:  Math.random() * window.innerHeight,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4
  });
}
 
let mouseX = 0, mouseY = 0;
document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});
 
function drawBgWeb() {
  bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
 
  // Move nodes
  nodes.forEach(n => {
    n.x += n.vx;
    n.y += n.vy;
    if (n.x < 0 || n.x > bgCanvas.width)  n.vx *= -1;
    if (n.y < 0 || n.y > bgCanvas.height) n.vy *= -1;
  });
 
  // Draw connections between nodes
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[j].x - nodes[i].x;
      const dy = nodes[j].y - nodes[i].y;
      const d  = Math.sqrt(dx * dx + dy * dy);
      if (d < 180) {
        bgCtx.beginPath();
        bgCtx.moveTo(nodes[i].x, nodes[i].y);
        bgCtx.lineTo(nodes[j].x, nodes[j].y);
        bgCtx.strokeStyle = `rgba(232,25,44,${(1 - d / 180) * 0.18})`;
        bgCtx.lineWidth   = 0.5;
        bgCtx.stroke();
      }
    }
 
    // Connect nodes to mouse
    const dx = mouseX - nodes[i].x;
    const dy = mouseY - nodes[i].y;
    const d  = Math.sqrt(dx * dx + dy * dy);
    if (d < 200) {
      bgCtx.beginPath();
      bgCtx.moveTo(nodes[i].x, nodes[i].y);
      bgCtx.lineTo(mouseX, mouseY);
      bgCtx.strokeStyle = `rgba(232,25,44,${(1 - d / 200) * 0.35})`;
      bgCtx.lineWidth   = 0.8;
      bgCtx.stroke();
    }
  }
 
  requestAnimationFrame(drawBgWeb);
}
drawBgWeb();
 
 
/* ===========================
   WEB SHOOTER
=========================== */
const shootCanvas = document.getElementById('shoot-canvas');
const sCtx        = shootCanvas.getContext('2d');
const shootMsg    = document.getElementById('shoot-msg');
 
const webMessages = [
  "TEIA DISPARADA!",
  "BULL'S-EYE!",
  "SUA VIZINHANÇA ESTÁ SEGURA!",
  "SENTIDO DE ARANHA ATIVADO!",
  "NOVA YORK AGRADECE!",
  "IMPOSSÍVEL ESCAPAR!"
];
 
let webs = [];
 
function resizeShoot() {
  const rect = document.querySelector('.webshooter-section').getBoundingClientRect();
  shootCanvas.width  = rect.width;
  shootCanvas.height = rect.height;
}
resizeShoot();
window.addEventListener('resize', resizeShoot);
 
function shootWeb(x, y) {
  webs.push({ x, y, threads: 12, born: Date.now() });
 
  const msg = webMessages[Math.floor(Math.random() * webMessages.length)];
  shootMsg.textContent = msg;
  shootMsg.classList.add('show');
  setTimeout(() => shootMsg.classList.remove('show'), 1800);
}
 
// Button click
document.getElementById('web-shoot-btn').addEventListener('click', () => {
  const r = document.querySelector('.webshooter-section').getBoundingClientRect();
  shootWeb(
    r.width / 2 + (Math.random() - 0.5) * 200,
    r.height * 0.3
  );
});
 
// Click anywhere in the section
document.querySelector('.webshooter-section').addEventListener('click', e => {
  const r = document.querySelector('.webshooter-section').getBoundingClientRect();
  shootWeb(e.clientX - r.left, e.clientY - r.top);
});
 
function drawWebs() {
  const r = document.querySelector('.webshooter-section').getBoundingClientRect();
  if (shootCanvas.width !== r.width) resizeShoot();
 
  sCtx.clearRect(0, 0, shootCanvas.width, shootCanvas.height);
 
  const now = Date.now();
  webs = webs.filter(w => (now - w.born) < 3000);
 
  webs.forEach(w => {
    const age    = (now - w.born) / 3000;
    const alpha  = age < 0.3 ? age / 0.3 : 1 - (age - 0.3) / 0.7;
    const expand = Math.min(1, age * 4);
 
    for (let i = 0; i < w.threads; i++) {
      const angle = (i / w.threads) * Math.PI * 2;
      const len   = 80 + Math.random() * 60;
      const ex    = w.x + Math.cos(angle) * len * expand;
      const ey    = w.y + Math.sin(angle) * len * expand;
 
      // Radial threads
      sCtx.beginPath();
      sCtx.moveTo(w.x, w.y);
      sCtx.lineTo(ex, ey);
      sCtx.strokeStyle = `rgba(232,25,44,${alpha * 0.8})`;
      sCtx.lineWidth   = 1;
      sCtx.stroke();
 
      // Circular rings connecting threads
      for (let r2 = 0.3; r2 <= 1; r2 += 0.35) {
        const ax  = w.x + Math.cos(angle) * len * expand * r2;
        const ay  = w.y + Math.sin(angle) * len * expand * r2;
        const bx  = w.x + Math.cos(angle + 2 * Math.PI / w.threads) * len * expand * r2;
        const by  = w.y + Math.sin(angle + 2 * Math.PI / w.threads) * len * expand * r2;
        sCtx.beginPath();
        sCtx.moveTo(ax, ay);
        sCtx.lineTo(bx, by);
        sCtx.strokeStyle = `rgba(232,25,44,${alpha * 0.4})`;
        sCtx.lineWidth   = 0.7;
        sCtx.stroke();
      }
    }
 
    // Center dot
    sCtx.beginPath();
    sCtx.arc(w.x, w.y, 4 * expand, 0, Math.PI * 2);
    sCtx.fillStyle = `rgba(232,25,44,${alpha})`;
    sCtx.fill();
  });
 
  requestAnimationFrame(drawWebs);
}
drawWebs();
 
 
/* ===========================
   POWER BARS (scroll-triggered)
=========================== */
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const pct = e.target.dataset.pct;
      e.target.querySelector('.power-bar').style.width = pct + '%';
    }
  });
}, { threshold: 0.2 });
 
document.querySelectorAll('.power-card').forEach(card => observer.observe(card));