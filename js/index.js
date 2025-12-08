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
