
/* ========================================
   BY AADIRA. — INTERACTIONS & ANIMATIONS
   ======================================== */

document.addEventListener("DOMContentLoaded", () => {
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // 1. INTRO ANIMATION
  const intro = document.querySelector(
    ".intro-overlay, #intro-overlay, #intro"
  );

  if (intro) {
    if (reduceMotion) {
      intro.remove();
    } else {
      intro.style.transition =
        "opacity 900ms ease, visibility 900ms ease";

      window.setTimeout(() => {
        intro.style.opacity = "0";
        intro.style.visibility = "hidden";
        intro.style.pointerEvents = "none";

        window.setTimeout(() => {
          intro.remove();
        }, 950);
      }, 1600);
    }
  }

  // 2. SCROLL REVEALS
  const revealElements = document.querySelectorAll(
    ".reveal, .section-heading"
  );

  const revealElement = (element) => {
    element.classList.add("is-visible", "revealed");
    element.style.opacity = "1";
    element.style.transform = "translateY(0)";
  };

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealElements.forEach(revealElement);
  } else {
    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            revealElement(entry.target);
            currentObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -35px 0px"
      }
    );

    revealElements.forEach((element) => {
      observer.observe(element);
    });
  }

  // 3. CV POPUP
  const cvDialog = document.querySelector("#cv-dialog");
  const openCvButton = document.querySelector("#open-cv");
  const closeCvButton = document.querySelector("#close-cv");

  if (cvDialog && openCvButton) {
    openCvButton.addEventListener("click", () => {
      if (typeof cvDialog.showModal === "function") {
        cvDialog.showModal();
      } else {
        cvDialog.setAttribute("open", "");
      }
    });
  }

  if (cvDialog && closeCvButton) {
    closeCvButton.addEventListener("click", () => {
      if (typeof cvDialog.close === "function") {
        cvDialog.close();
      } else {
        cvDialog.removeAttribute("open");
      }
    });
  }

  // Close the popup only when the backdrop is clicked.
  if (cvDialog) {
    cvDialog.addEventListener("click", (event) => {
      if (event.target === cvDialog) {
        if (typeof cvDialog.close === "function") {
          cvDialog.close();
        } else {
          cvDialog.removeAttribute("open");
        }
      }
    });
  }

  // 4. AUTOMATIC FOOTER YEAR
  const yearElement = document.querySelector("#current-year");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // 5. CONTACT FORM — FORMSPREE
  
  // 5. CONTACT FORM — AJAX FORMSPREE SUBMISSION
  const contactForm = document.querySelector("#contact-form");

  if (contactForm) {
    const formStatus = contactForm.querySelector("#form-status");
    const submitButton = contactForm.querySelector('button[type="submit"]');

    contactForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      if (!contactForm.reportValidity()) return;

      const originalButtonHTML = submitButton?.innerHTML;

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "Sending…";
      }

      if (formStatus) {
        formStatus.textContent = "Sending your message…";
      }

      try {
        const response = await fetch(contactForm.action, {
          method: "POST",
          body: new FormData(contactForm),
          headers: { Accept: "application/json" }
        });

        if (!response.ok) {
          throw new Error("Formspree did not accept the submission.");
        }

        contactForm.reset();

        if (formStatus) {
          formStatus.textContent =
            "Message sent successfully. Thank you for reaching out!";
        }
      } catch (error) {
        if (formStatus) {
          formStatus.textContent =
            "Sorry, your message couldn't be sent. Please try again.";
        }
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.innerHTML = originalButtonHTML;
        }
      }
    });
  }


  // 6. CURRENT NAVIGATION SECTION
  const navLinks = document.querySelectorAll(
    'header nav a[href^="#"]'
  );

  const sections = [...navLinks]
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          navLinks.forEach((link) => {
            const isCurrent =
              link.getAttribute("href") === `#${entry.target.id}`;

            if (isCurrent) {
              link.setAttribute("aria-current", "location");
            } else {
              link.removeAttribute("aria-current");
            }
          });
        });
      },
      {
        threshold: 0,
        rootMargin: "-35% 0px -55% 0px"
      }
    );

    sections.forEach((section) => sectionObserver.observe(section));
  }
});
