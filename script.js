/*
  Scrollscape - Scroll Interaction Script

  This JavaScript file controls the scroll-based interaction. The prototype uses
  scroll as the main browser action, so the script listens to the user's position
  on the page and changes the interface in response.

  The first part uses Intersection Observer. This browser API detects when each
  section enters the viewport. When a section becomes visible, the script adds a
  "visible" class. CSS then uses that class to fade in text cards and visual shapes.
  This creates a clear response to the user's scroll movement.

  The script also reads the data-mood value on each section. For example, a section
  may have data-mood="morning" or data-mood="rain". When that section is visible,
  the body receives the same class name. This changes the background gradient and
  makes each part of the scroll journey feel like a different environment.

  The progress bar is another feedback system. It shows how far the user has moved
  through the page. As the user scrolls down, the bar grows from left to right. This
  makes the action of scrolling more visible and gives the user a sense of progress.

  The navigation dots on the right side are updated based on the current section.
  They are not used as the main interaction, because the assignment focus is scroll.
  Instead, they support the scroll interaction by showing which stage of the journey
  the user is currently viewing.

  No external JavaScript libraries are used. The code uses standard browser features
  only, which keeps the prototype original and suitable for the assignment requirements.
*/

const sections = document.querySelectorAll(".section");
const progressFill = document.querySelector("#progressFill");
const dots = document.querySelectorAll(".dot");

const observerOptions = {
  threshold: 0.45
};

const sectionObserver = new IntersectionObserver((entries) => {
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
}, observerOptions);

sections.forEach((section) => {
  sectionObserver.observe(section);
});

function updateDots(currentSection) {
  const sectionArray = Array.from(sections);
  const index = sectionArray.indexOf(currentSection);

  dots.forEach((dot) => {
    dot.classList.remove("active");
  });

  if (dots[index]) {
    dots[index].classList.add("active");
  }
}

window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY;
  const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = (scrollTop / documentHeight) * 100;

  progressFill.style.width = progress + "%";
});