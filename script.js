/*
  Scrollscape - Scroll Interaction Script

  This script controls the scroll-based interaction. The main action of the
  prototype is scroll, so the interface responds when the user moves through
  different sections.

  Intersection Observer detects when a section enters the viewport. When a section
  becomes visible, the script adds a "visible" class. CSS uses this class to fade in
  the card and visual symbol.

  Each section also has a data-mood value. When a section appears, the body receives
  the same class name. This changes the background colour and creates a different mood.

  The progress bar shows how far the user has scrolled. The Next Mood button adds
  extra interaction by smoothly scrolling to the next section. This supports the
  scroll concept while giving the user more control over the journey.

  No external JavaScript libraries are used.
*/

const sections = document.querySelectorAll(".section");
const progressFill = document.querySelector("#progressFill");
const nextButton = document.querySelector("#nextButton");

let currentIndex = 0;

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const mood = entry.target.dataset.mood;

        entry.target.classList.add("visible");

        document.body.className = "";
        document.body.classList.add(mood);

        currentIndex = Array.from(sections).indexOf(entry.target);
      }
    });
  },
  {
    threshold: 0.5
  }
);

sections.forEach((section) => {
  observer.observe(section);
});

window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY;
  const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = (scrollTop / pageHeight) * 100;

  progressFill.style.width = progress + "%";
});

nextButton.addEventListener("click", () => {
  currentIndex++;

  if (currentIndex >= sections.length) {
    currentIndex = 0;
  }

  sections[currentIndex].scrollIntoView({
    behavior: "smooth"
  });
});