const widthInput = document.getElementById('widthInput');
const heightInput = document.getElementById('heightInput');
const colorPicker = document.getElementById('colorPicker');
const textInput = document.getElementById('textInput');
const textColor = document.getElementById('textColor');
const textAlignInput = document.getElementById('textAlign');
const fontStyleInput = document.getElementById('fontStyle');

const overlayInput = document.getElementById('overlayInput');
const overlayDropzone = document.getElementById('overlayDropzone');

const blendModeInput = document.getElementById('blendMode');
const overlayOpacityInput = document.getElementById('overlayOpacity');
const overlaySizeInput = document.getElementById('overlaySize');


const exportBtn = document.getElementById('exportBtn');
const canvas = document.getElementById('previewCanvas');
const ctx = canvas.getContext('2d');

const overlay2Input = document.getElementById('overlay2Input');
const overlaySize2Input = document.getElementById('overlaySize2');
const overlay2Dropzone = document.getElementById('overlay2Dropzone');
const blendMode2Input = document.getElementById('blendMode2');
const overlayOpacity2Input = document.getElementById('overlayOpacity2');


let overlayImage = null;
let overlayImage2 = null;

overlayDropzone.addEventListener('click', () => {
  overlayInput.click();
});

overlayDropzone.addEventListener('dragover', (e) => {
  e.preventDefault();
});

overlayDropzone.addEventListener('drop', (e) => {
  e.preventDefault();
  const file = e.dataTransfer.files[0];

  loadImage(file, (img) => {
    overlayImage = img;
    render();
  });
});

overlayInput.addEventListener('change', () => {
  const file = overlayInput.files[0];

  loadImage(file, (img) => {
    overlayImage = img;
    render();
  });
});

overlay2Dropzone.addEventListener('click', () => {
  overlay2Input.click();
});

overlay2Dropzone.addEventListener('dragover', (e) => {
  e.preventDefault();
});

overlay2Dropzone.addEventListener('drop', (e) => {
  e.preventDefault();
  const file = e.dataTransfer.files[0];

  loadImage(file, (img) => {
    overlayImage2 = img;
    render();
  });
});

overlay2Input.addEventListener('change', () => {
  const file = overlay2Input.files[0];

  loadImage(file, (img) => {
    overlayImage2 = img;
    render();
  });
});


/* ---------- helpers ---------- */
function randomString(len = 6) {
  return Math.random().toString(36).slice(2, 2 + len);
}

function drawText(w, h) {
  const text = textInput.value;
  if (!text) return;

  const lines = text.split('\n');
  const padding = 14;
  const maxWidth = w - padding * 2;

  let fontSize = 23;
  ctx.font = `${fontStyleInput.value} ${fontSize}px "Draconian", monospace`;

  while (lines.some(l => ctx.measureText(l).width > maxWidth) && fontSize > 5) {
    fontSize--;
    ctx.font = `${fontStyleInput.value} ${fontSize}px "Draconian"`;
  }

  ctx.fillStyle = textColor.value;
  ctx.textAlign = textAlignInput.value;
  ctx.textBaseline = 'middle';

  const lineHeight = fontSize * 0.65;
  const totalHeight = lineHeight * lines.length;
  let startY;

  const align = textAlignInput.value;

let x;
let y;

// ---------- horizontal ----------
if (align.includes('left')) {
  ctx.textAlign = 'left';
  x = padding;
} else if (align.includes('right')) {
  ctx.textAlign = 'right';
  x = w - padding;
} else {
  ctx.textAlign = 'center';
  x = w / 2;
}

// ---------- vertical anchor ----------
if (align.includes('top')) {
  ctx.textBaseline = 'top';
  y = padding;
} else if (align.includes('bottom')) {
  ctx.textBaseline = 'bottom';
  y = h - padding;
} else {
  ctx.textBaseline = 'middle';
  y = h / 2;
}

// ---------- multiline offset ----------

if (align.includes('top')) {
  startY = y;
} else if (align.includes('bottom')) {
  startY = y - (lines.length - 1) * lineHeight;
} else {
  startY = y - ((lines.length - 1) * lineHeight) / 2;
}

  lines.forEach((line, i) => {
    ctx.fillText(line, x, startY + i * lineHeight);
  });
}

function drawOverlayImage(img, w, h, blendMode, opacity, sizeMode) {
  if (!img) return;

  let dw, dh, dx, dy;

  const iw = img.width;
  const ih = img.height;
  const mode = sizeMode;

  if (mode === 'contain') {
    const scale = Math.min(w / iw, h / ih, 1);
    dw = iw * scale;
    dh = ih * scale;
  } else {
    const scale = Math.max(w / iw, h / ih, 1);
    dw = iw * scale;
    dh = ih * scale;
  }

  dx = (w - dw) / 2;
  dy = (h - dh) / 2;

  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.globalCompositeOperation = blendMode;
  ctx.drawImage(img, dx, dy, dw, dh);
  ctx.restore();
}

/* ---------- render ---------- */
function render() {
  const w = parseInt(widthInput.value) || 500;
  const h = parseInt(heightInput.value) || 500;

  canvas.width = w;
  canvas.height = h;

  ctx.clearRect(0, 0, w, h);

  ctx.fillStyle = colorPicker.value;
  ctx.fillRect(0, 0, w, h);

  const overlay1Opacity = overlayOpacityInput.value / 100;
const overlay2Opacity = overlayOpacity2Input.value / 100;

 drawOverlayImage(
  overlayImage,
  w,
  h,
  blendModeInput.value,
  overlay1Opacity,
  overlaySizeInput.value
);

drawOverlayImage(
  overlayImage2,
  w,
  h,
  blendMode2Input.value,
  overlay2Opacity,
  overlaySize2Input.value
);
  drawText(w, h);

}

/* ---------- events ---------- */
document.querySelectorAll('input, textarea, select').forEach(el =>
  el.addEventListener('input', render)
);

function loadImage(file, callback) {
  if (!file || !file.type.startsWith('image/')) return;

  const img = new Image();
  img.onload = () => callback(img);
  img.src = URL.createObjectURL(file);
}

exportBtn.addEventListener('click', () => {
  render();
  const link = document.createElement('a');
  link.download = `placeholder-${randomString()}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
});

/* initial */
async function init() {
  await document.fonts.load('33px Draconian');
  render();
}
init();
