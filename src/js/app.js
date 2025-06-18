import Star from "./star.js";

var frame = 0;

var stars = [];

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  function resizeCanvas() {
    const parent = canvas.parentElement;
    canvas.style.width = parent.clientWidth + "px";
    canvas.style.height = parent.clientHeight + "px";
    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;
  }

  const observer = new ResizeObserver(() => {
    resizeCanvas();
  });

  observer.observe(canvas.parentElement);

  resizeCanvas();
  var dim = canvas.width / 5;

  for (var i = 0; i <= 4; i++) {
    stars.push(new Star(i * dim, 0, dim, dim));
    stars.push(new Star(i * dim, dim, dim, dim));
  }

  function update() {
    frame++;
    stars.forEach((star) => star.SetPressed(pressednotes));
  }

  // Renderização do stage
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach((star) => star.draw(ctx));
    ctx.fillStyle = "white";
    ctx.textAlign = "right";
    ctx.fillText(frame, canvas.width - 10, canvas.height - 10);
  }

  function drawLoop() {
    update();
    draw();
    requestAnimationFrame(drawLoop);
  }

  drawLoop();
});
