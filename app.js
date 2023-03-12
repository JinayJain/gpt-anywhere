document.addEventListener("mousemove", function (event) {
  const x = event.clientX;
  const y = event.clientY;

  const el = document.getElementById("cursor-glow");

  el.style.left = x + "px";
  el.style.top = y + "px";
});
