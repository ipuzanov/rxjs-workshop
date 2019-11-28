const canvas = document.getElementById('canvas');
const c2d = canvas.getContext('2d');
const widthInput = document.getElementById('width');
const colorBtns = Array.prototype.slice.call(document.getElementsByClassName('color-btn'));

const rect = canvas.getBoundingClientRect();

let drawing = false;
const buffer = [];
let width = widthInput.value;
let color = colorBtns[0].style.color;

widthInput.addEventListener('change', evt => {
  width = evt.target.value;
});
colorBtns.forEach(btn =>
  btn.addEventListener('click', evt => {
    color = evt.target.style.color;
  }),
);

canvas.addEventListener('mousedown', () => {
  drawing = true;
});
canvas.addEventListener('mouseup', () => {
  drawing = false;
});
canvas.addEventListener('mousemove', evt => {
  if (drawing) {
    buffer.push({ x: evt.pageX - rect.left, y: evt.pageY - rect.top });
    if (buffer.length > 2) buffer.shift();
    if (buffer.length === 2) {
      const [p1, p2] = buffer;
      c2d.beginPath();
      c2d.moveTo(p1.x, p1.y);
      c2d.lineTo(p2.x, p2.y);
      c2d.lineWidth = width * 2;
      c2d.strokeStyle = color;
      c2d.stroke();

      c2d.beginPath();
      c2d.arc(p1.x, p1.y, width, 0, 2 * Math.PI, false);
      c2d.fillStyle = color;
      c2d.fill();
    }
  } else {
    buffer.length = 0;
  }
});
