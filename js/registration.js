// Habilita las inscripciones automáticamente al llegar la fecha de apertura.
(() => {
  // Home: los botones "Inscribirse" vienen deshabilitados; al abrir pasan a ser un enlace al form.
  const enableCtas = () => {
    document.querySelectorAll(".btnDisabled").forEach((cta) => {
      const link = document.createElement("a");
      link.href = "./form.html";
      link.className = "btnPrimary";
      link.textContent = "Inscribirse";
      cta.replaceWith(link);
    });
  };

  if (isRegistrationOpen()) {
    enableCtas();
    return;
  }

  // Si la página sigue abierta cuando llega la fecha, se recarga ya habilitada.
  // (setInterval y no setTimeout: faltan más de 24 días y setTimeout no admite tanto.)
  const watcher = setInterval(() => {
    if (isRegistrationOpen()) {
      clearInterval(watcher);
      location.reload();
    }
  }, 1000);
})();
