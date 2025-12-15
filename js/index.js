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

// Funciones del sidebar (las que ya tenías)
function showSidebar() {
  const sidebar = document.querySelector(".sidebar");
  sidebar.style.display = "flex";
}

function hideSidebar() {
  const sidebar = document.querySelector(".sidebar");
  sidebar.style.display = "none";
}

/* FAQ */
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
