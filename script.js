const items = document.querySelectorAll(".item");
const label = document.getElementById("label");

function showFeedback(item) {
  label.textContent = item.dataset.label;

  const sound = document.getElementById(item.dataset.sound);

  if (sound) {
    sound.currentTime = 0;
    sound.volume = 0.35;

    sound.play().catch(function () {
      label.textContent = item.dataset.label + " Click once if sound is blocked.";
    });
  }
}

function resetFeedback() {
  label.textContent = "Hover over an object to relax";
}

items.forEach(function (item) {
  item.addEventListener("mouseenter", function () {
    showFeedback(item);
  });

  item.addEventListener("mouseleave", resetFeedback);

  item.addEventListener("focus", function () {
    showFeedback(item);
  });

  item.addEventListener("blur", resetFeedback);
});
