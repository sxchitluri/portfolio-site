// Dark mode toggle
const darkModeToggle = document.getElementById("darkModeToggle");
const html = document.documentElement;

// Check for saved theme preference or use device preference
const savedTheme = localStorage.getItem("theme");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

// Set the initial theme
if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
  html.classList.add("dark");
} else {
  html.classList.remove("dark");
}

// Toggle dark mode
darkModeToggle.addEventListener("click", () => {
  html.classList.toggle("dark");

  // Save preference
  if (html.classList.contains("dark")) {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }
});

// Mobile menu functionality
const mobileMenuToggle = document.getElementById("mobileMenuToggle");
const mobileMenu = document.getElementById("mobileMenu");
const body = document.body;

let isMenuOpen = false;

function toggleMenu() {
  isMenuOpen = !isMenuOpen;

  // Toggle menu visibility
  mobileMenu.classList.toggle("hidden");

  // Toggle body scroll
  body.style.overflow = isMenuOpen ? "hidden" : "";

  // Animate menu button
  const spans = mobileMenuToggle.querySelectorAll("span");
  if (isMenuOpen) {
    spans[0].style.transform = "rotate(45deg) translate(5px, 5px)";
    spans[1].style.transform = "rotate(-45deg)";
  } else {
    spans[0].style.transform = "";
    spans[1].style.transform = "";
  }

  // Add transition styles to spans
  spans.forEach((span) => {
    span.style.transition = "transform 0.3s ease";
  });
}

mobileMenuToggle.addEventListener("click", toggleMenu);

// Close menu when clicking menu items
mobileMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    if (isMenuOpen) toggleMenu();
  });
});

// Close menu on escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && isMenuOpen) toggleMenu();
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      const headerOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  });
});

// Optional: Simple animation on scroll
const fadeInElements = document.querySelectorAll(".fade-in");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("opacity-100");
        entry.target.classList.remove("opacity-0", "translate-y-10");
      }
    });
  },
  { threshold: 0.1 }
);

fadeInElements.forEach((element) => {
  element.classList.add(
    "opacity-0",
    "translate-y-10",
    "transition-all",
    "duration-700"
  );
  observer.observe(element);
});

// Form handling and validation
const contactForm = document.querySelector("form");
const formInputs = contactForm.querySelectorAll(
  'input[type="text"], input[type="email"], textarea'
);
const submitButton = contactForm.querySelector('button[type="submit"]');

function validateForm() {
  let isValid = true;
  formInputs.forEach((input) => {
    if (!input.value.trim()) {
      isValid = false;
      input.classList.add("border-red-500");
    } else {
      input.classList.remove("border-red-500");
    }

    if (input.type === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(input.value.trim())) {
        isValid = false;
        input.classList.add("border-red-500");
      }
    }
  });
  return isValid;
}

formInputs.forEach((input) => {
  input.addEventListener("input", () => {
    if (input.value.trim()) {
      input.classList.remove("border-red-500");
    }
  });
});

contactForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Check honeypot field
  const honeypot = contactForm.querySelector('input[name="website"]');
  if (honeypot && honeypot.value) {
    console.log("Spam submission detected");
    return;
  }

  if (!validateForm()) {
    // Show error message
    const errorMsg = document.createElement("p");
    errorMsg.className = "text-red-500 mt-4";
    errorMsg.textContent = "Please fill in all fields correctly.";
    submitButton.parentNode.insertBefore(errorMsg, submitButton.nextSibling);
    setTimeout(() => errorMsg.remove(), 3000);
    return;
  }

  // Show loading state
  const originalText = submitButton.textContent;
  submitButton.disabled = true;
  submitButton.textContent = "Sending...";

  try {
    // Get form data
    const formData = new FormData(contactForm);
    const csrfToken = document.querySelector('input[name="_csrf"]').value;

    // Here you would typically send the form data to your backend
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "CSRF-Token": csrfToken,
      },
      body: JSON.stringify(Object.fromEntries(formData)),
    });

    if (!response.ok) {
      throw new Error("Failed to send message");
    }

    // Show success message
    const successMsg = document.createElement("p");
    successMsg.className = "text-green-500 mt-4";
    successMsg.textContent = "Message sent successfully!";
    submitButton.parentNode.insertBefore(successMsg, submitButton.nextSibling);

    // Reset form
    contactForm.reset();
    setTimeout(() => successMsg.remove(), 3000);
  } catch (error) {
    // Log error to Sentry
    Sentry.captureException(error);

    // Show error message
    const errorMsg = document.createElement("p");
    errorMsg.className = "text-red-500 mt-4";
    errorMsg.textContent = "Failed to send message. Please try again.";
    submitButton.parentNode.insertBefore(errorMsg, submitButton.nextSibling);
    setTimeout(() => errorMsg.remove(), 3000);
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = originalText;
  }
});

// Lightbox functionality
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxClose = document.getElementById("lightboxClose");
const lightboxPrev = document.getElementById("lightboxPrev");
const lightboxNext = document.getElementById("lightboxNext");

let currentGallery = null;
let currentIndex = 0;

// Touch handling variables
let touchStartX = 0;
let touchEndX = 0;
let touchStartY = 0;
let touchEndY = 0;
let isSwiping = false;

function handleTouchStart(e) {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
  isSwiping = true;
}

function handleTouchMove(e) {
  if (!isSwiping) return;

  touchEndX = e.touches[0].clientX;
  touchEndY = e.touches[0].clientY;

  // Prevent vertical scrolling when swiping horizontally
  const deltaX = Math.abs(touchEndX - touchStartX);
  const deltaY = Math.abs(touchEndY - touchStartY);

  if (deltaX > deltaY) {
    e.preventDefault();
  }
}

function handleTouchEnd() {
  if (!isSwiping) return;

  const swipeDistance = touchEndX - touchStartX;
  const swipeDistanceY = Math.abs(touchEndY - touchStartY);
  const minSwipeDistance = 50;

  // Only handle horizontal swipes
  if (Math.abs(swipeDistance) > minSwipeDistance && swipeDistanceY < 100) {
    if (swipeDistance > 0) {
      showPrevImage();
    } else {
      showNextImage();
    }
  }

  isSwiping = false;
}

function openLightbox(button) {
  const picture = button.querySelector("picture");
  const gallery = button.closest(".gallery");
  const galleryPictures = Array.from(gallery.querySelectorAll("picture"));

  currentGallery = galleryPictures;
  currentIndex = galleryPictures.indexOf(picture);

  updateLightboxImage();
  lightbox.classList.remove("hidden");
  document.body.style.overflow = "hidden";

  // Add loading indicator
  lightboxImage.style.opacity = "0";
  lightboxImage.addEventListener("load", function onLoad() {
    lightboxImage.style.opacity = "1";
    lightboxImage.removeEventListener("load", onLoad);
  });
}

function updateLightboxImage() {
  const picture = currentGallery[currentIndex];
  const webpSource = picture.querySelector("source");
  const img = picture.querySelector("img");

  // Show loading state
  lightboxImage.style.opacity = "0";

  // Use WebP if supported, fallback to jpg
  if (webpSource && "webp" in document.createElement("canvas").toDataURL()) {
    lightboxImage.src = webpSource.srcset;
  } else {
    lightboxImage.src = img.src;
  }
  lightboxImage.alt = img.alt;

  // Fade in when loaded
  lightboxImage.addEventListener("load", function onLoad() {
    lightboxImage.style.opacity = "1";
    lightboxImage.removeEventListener("load", onLoad);
  });

  // Update navigation button states
  lightboxPrev.style.visibility = currentIndex > 0 ? "visible" : "hidden";
  lightboxNext.style.visibility =
    currentIndex < currentGallery.length - 1 ? "visible" : "hidden";
}

function closeLightbox() {
  lightbox.classList.add("hidden");
  document.body.style.overflow = "";
  lightboxImage.src = "";
  currentGallery = null;
  isSwiping = false;
}

function showPrevImage() {
  if (currentIndex > 0) {
    currentIndex--;
    updateLightboxImage();
  }
}

function showNextImage() {
  if (currentIndex < currentGallery.length - 1) {
    currentIndex++;
    updateLightboxImage();
  }
}

// Event listeners for lightbox controls
lightboxClose.addEventListener("click", closeLightbox);
lightboxPrev.addEventListener("click", showPrevImage);
lightboxNext.addEventListener("click", showNextImage);

// Touch event listeners
lightbox.addEventListener("touchstart", handleTouchStart, { passive: false });
lightbox.addEventListener("touchmove", handleTouchMove, { passive: false });
lightbox.addEventListener("touchend", handleTouchEnd);

// Close lightbox with escape key and arrow navigation
document.addEventListener("keydown", (e) => {
  if (!lightbox.classList.contains("hidden")) {
    switch (e.key) {
      case "Escape":
        closeLightbox();
        break;
      case "ArrowLeft":
        showPrevImage();
        break;
      case "ArrowRight":
        showNextImage();
        break;
    }
  }
});

// Close lightbox when clicking outside the image
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) {
    closeLightbox();
  }
});
