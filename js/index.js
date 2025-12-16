// Navbar scroll behavior
let lastScroll = 0;
const navbar = document.querySelector("nav");
const scrollThreshold = 100; // Píxeles para empezar a ocultar

window.addEventListener("scroll", () => {
  const currentScroll = window.pageYOffset;

  // Si estamos cerca del top, siempre mostrar
  if (currentScroll <= scrollThreshold) {
    navbar.classList.remove("nav-hidden");
    navbar.classList.add("nav-visible");
    lastScroll = currentScroll;
    return;
  }

  // Scroll hacia abajo - ocultar navbar
  if (currentScroll > lastScroll && currentScroll > scrollThreshold) {
    navbar.classList.remove("nav-visible");
    navbar.classList.add("nav-hidden");
  }
  // Scroll hacia arriba - mostrar navbar
  else if (currentScroll < lastScroll) {
    navbar.classList.remove("nav-hidden");
    navbar.classList.add("nav-visible");
  }

  lastScroll = currentScroll;
});

function showSidebar() {
  const sidebar = document.querySelector(".sidebar");
  sidebar.style.display = "flex";
}

function hideSidebar() {
  const sidebar = document.querySelector(".sidebar");
  sidebar.style.display = "none";
}

function toggleFaq(element) {
  // Cerrar todas las demás FAQs
  const allFaqs = document.querySelectorAll(".Faq");
  allFaqs.forEach((faq) => {
    if (faq !== element && faq.classList.contains("active")) {
      faq.classList.remove("active");
    }
  });

  // Toggle la FAQ clickeada
  element.classList.toggle("active");
}

// Cerrar FAQ al hacer clic fuera
document.addEventListener("click", function (event) {
  const clickedInsideFaq = event.target.closest(".Faq");
  if (!clickedInsideFaq) {
    const allFaqs = document.querySelectorAll(".Faq");
    allFaqs.forEach((faq) => {
      faq.classList.remove("active");
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const navLinks = document.querySelectorAll("a.nav-scroll");

  navLinks.forEach((link) => {
    link.addEventListener("click", function (event) {
      const targetId = this.getAttribute("href");

      // solo manejamos anchors internos (#...)
      if (!targetId || !targetId.startsWith("#")) return;

      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      event.preventDefault(); // acá evitamos que el navegador cambie la URL

      targetEl.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      // opcional: cerrar sidebar después de hacer click en mobile
      if (this.closest(".sidebar")) {
        if (typeof hideSidebar === "function") {
          hideSidebar();
        }
      }
    });
  });

  // Limpia el hash si llegaste desde otra página con index.html#algo
  if (window.location.hash) {
    // Opcional: si querés asegurar que se vea bien la sección:
    const target = document.querySelector(window.location.hash);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    // Quitar el hash de la barra de direcciones
    history.replaceState(
      null,
      document.title,
      window.location.pathname + window.location.search
    );
  }
});
