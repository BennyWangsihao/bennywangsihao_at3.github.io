/*
  Scrollscape - Scroll Interaction Script

  This script controls the scroll-based interaction. The main action of the
  prototype is scroll, so the interface changes when the user moves through
  the page.

  Intersection Observer detects when a section enters the viewport. When the
  section becomes visible, the script adds a "visible" class. CSS then uses
  that class to fade in the text card and visual element.

  Each section has a data-mood value, such as "morning", "rain" or "night".
  When a section is visible, the same value is added as a class to the body.
  This changes the page background and makes each scroll section feel like a
  different mood.

  The progress bar shows the user's scroll position. As the user scrolls down,
  the bar becomes wider. The side dots also update to show the current section.
  These features make the scroll action more visible to the user.

  No external JavaScript libraries are used.
*/

const sections = document.querySelectorAll(".section");
const progressFill = document.querySelector("#progressFill");
const dots = document.querySelectorAll(".dot");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const currentSection = entry.target;
        const mood = currentSection.dataset.mood;

        currentSection.classList.add("visible");

        document.body.className = "";
        document.body.classList.add(mood);

        updateDots(currentSection);
      }
    });
  },
  {
    threshold: 0.45
  }
);

sections.forEach((section) => {
  observer.observe(section);
});

function updateDots(currentSection) {
  const sectionList = Array.from(sections);
  const index = sectionList.indexOf(currentSection);

  dots.forEach((dot) => {
    dot.classList.remove("active");
  });

  if (dots[index]) {
    dots[index].classList.add("active");
  }
}

window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY;
  const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = (scrollTop / pageHeight) * 100;

  progressFill.style.width = progress + "%";
});