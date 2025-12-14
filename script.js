const widthInput = document.getElementById('widthInput');
const heightInput = document.getElementById('heightInput');
const colorPicker = document.getElementById('colorPicker');
const textInput = document.getElementById('textInput');
const textColor = document.getElementById('textColor');
const textAlignInput = document.getElementById('textAlign');
const fontStyleInput = document.getElementById('fontStyle');

const overlayInput = document.getElementById('overlayInput');
const blendModeInput = document.getElementById('blendMode');
const overlayOpacityInput = document.getElementById('overlayOpacity');
const overlaySizeInput = document.getElementById('overlaySize');
const affectsTextInput = document.getElementById('affectsText');

const exportBtn = document.getElementById('exportBtn');
const canvas = document.getElementById('previewCanvas');
const ctx = canvas.getContext('2d');

let overlayImage = null;

/* ---------- helpers ---------- */
function randomString(len = 6) {
  return Math.random().toString(36).slice(2, 2 + len);
}

function drawText(w, h) {
  const text = textInput.value;
  if (!text) return;

  const lines = text.split('\n');
  const padding = 50;
  const maxWidth = w - padding * 2;

  let fontSize = 500;
  ctx.font = `${fontStyleInput.value} ${fontSize}px Helvetica, Arial`;

  while (lines.some(l => ctx.measureText(l).width > maxWidth) && fontSize > 5) {
    fontSize--;
    ctx.font = `${fontStyleInput.value} ${fontSize}px Helvetica, Arial`;
  }

  ctx.fillStyle = textColor.value;
  ctx.textAlign = textAlignInput.value;
  ctx.textBaseline = 'middle';

  const lineHeight = fontSize * 0.65;
  const totalHeight = lineHeight * lines.length;
  const startY = (h - totalHeight) / 2 + lineHeight / 2;

  let x =
    textAlignInput.value === 'left' ? padding :
    textAlignInput.value === 'right' ? w - padding :
    w / 2;

  lines.forEach((line, i) => {
    ctx.fillText(line, x, startY + i * lineHeight);
  });
}

function drawOverlay(w, h) {
  if (!overlayImage) return;

  let dw, dh, dx, dy;

  const iw = overlayImage.width;
  const ih = overlayImage.height;
  const mode = overlaySizeInput.value;

  if (mode === 'contain') {
    const scale = Math.min(w / iw, h / ih, 1);
    dw = iw * scale;
    dh = ih * scale;
  } else { // cover
    const scale = Math.max(w / iw, h / ih, 1);
    dw = iw * scale;
    dh = ih * scale;
    // prevent upscaling beyond original
    if (dw > iw) dw = iw;
    if (dh > ih) dh = ih;
  }

  dx = (w - dw) / 2;
  dy = (h - dh) / 2;

  ctx.save();
  ctx.globalAlpha = overlayOpacityInput.value / 100;
  ctx.globalCompositeOperation = blendModeInput.value;
  ctx.drawImage(overlayImage, dx, dy, dw, dh);
  ctx.restore();
}

/* ---------- render ---------- */
function render() {
  const w = parseInt(widthInput.value) || 300;
  const h = parseInt(heightInput.value) || 300;

  canvas.width = w;
  canvas.height = h;

  ctx.clearRect(0, 0, w, h);

  ctx.fillStyle = colorPicker.value;
  ctx.fillRect(0, 0, w, h);

  if (affectsTextInput.checked) {
    drawText(w, h);
    drawOverlay(w, h);
  } else {
    drawOverlay(w, h);
    drawText(w, h);
  }
}

/* ---------- events ---------- */
document.querySelectorAll('input, textarea, select').forEach(el =>
  el.addEventListener('input', render)
);

overlayInput.addEventListener('change', () => {
  const file = overlayInput.files[0];
  if (!file) return;

  overlayImage = new Image();
  overlayImage.onload = render;
  overlayImage.src = URL.createObjectURL(file);
});

exportBtn.addEventListener('click', () => {
  render();
  const link = document.createElement('a');
  link.download = `placeholder-${randomString()}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
});

/* initial */
render();
