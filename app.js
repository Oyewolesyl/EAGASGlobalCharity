const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(open));
  });
}

const activePath = location.pathname.split("/").pop() || "index.html";
document.querySelectorAll(".nav-links a").forEach((link) => {
  const href = link.getAttribute("href");
  if (href === activePath || (activePath === "" && href === "index.html")) {
    link.classList.add("active");
  }
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));

const countObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const node = entry.target;
      const target = Number(node.dataset.count || "0");
      const suffix = node.dataset.suffix || "+";
      const duration = 1200;
      const start = performance.now();
      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        node.textContent = `${Math.round(target * eased).toLocaleString()}${suffix}`;
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      countObserver.unobserve(node);
    });
  },
  { threshold: 0.35 }
);

document.querySelectorAll("[data-count]").forEach((node) => countObserver.observe(node));

const lightbox = document.querySelector(".lightbox");
const lightboxImg = document.querySelector(".lightbox img");
const lightboxClose = document.querySelector(".lightbox button");

document.querySelectorAll(".gallery-item").forEach((button) => {
  button.addEventListener("click", () => {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = button.dataset.full || button.querySelector("img").src;
    lightboxImg.alt = button.querySelector("img").alt;
    const source = lightboxImg.src;
    const isPrivate =
      source.includes("DAVEWITHKIDS") ||
      source.includes("WHITEPERSONDAVEKIDS") ||
      source.includes("WHITEDAVEKIDS") ||
      source.includes("GROUPPHOTO") ||
      source.includes("DAVEOVERSEEINGPLAY");
    lightboxImg.classList.toggle("privacy-blur", isPrivate);
    lightbox.classList.add("open");
  });
});

if (lightboxClose) {
  lightboxClose.addEventListener("click", () => lightbox.classList.remove("open"));
}

if (lightbox) {
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) lightbox.classList.remove("open");
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && lightbox) lightbox.classList.remove("open");
});

document.querySelectorAll(".filter-btn").forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    document.querySelectorAll(".filter-btn").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    document.querySelectorAll("[data-category]").forEach((item) => {
      item.hidden = filter !== "all" && item.dataset.category !== filter;
    });
  });
});

document.querySelectorAll("form[data-validate]").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const honeypot = form.querySelector("[name='website']");
    if (honeypot && honeypot.value) return;
    const status = form.querySelector(".form-status");
    if (status) status.textContent = "Thank you. Your message is ready to be connected to the foundation inbox.";
    form.reset();
  });
});
