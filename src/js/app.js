import Star from "./star.js";

var frame = 0;

const star = new Star(0, 0, 400, 400);

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

  function update() {
    frame++;
    star.SetPressed(pressednotes);
  }

  // Renderização do stage
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    star.draw(ctx);
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
