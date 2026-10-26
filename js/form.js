// -----------------------------
// Render condicional de inputs
// -----------------------------
// Al ocultar el campo se vacía: si no, se enviaría texto de una opción ya descartada.
const toggleConditional = (selectId, containerId, inputId, showWhen) => {
  const show = document.getElementById(selectId).value === showWhen;
  document.getElementById(containerId).style.display = show ? "flex" : "none";
  if (!show) document.getElementById(inputId).value = "";
};

const renderIllness = () =>
  toggleConditional("illnessChkInput", "illnessInputContainer", "illnessInput", "true");

const renderTreatment = () =>
  toggleConditional("treatmentChkInput", "treatmentInputContainer", "treatmentInput", "si");

const renderContraindicated = () =>
  toggleConditional(
    "contraindicatedChkInput",
    "contraindicatedInputContainer",
    "contraindicatedInput",
    "si"
  );

// -----------------------------
// Validación UI (solo al submit)
// -----------------------------
const submitFormBtn = document.getElementById("submitFormBtn");
const authorizationChkInput = document.getElementById("authorizationChkInput");
const privacyChkInput = document.getElementById("privacyChkInput");

const byId = (id) => document.getElementById(id);

// Deja solo dígitos y saca ceros iniciales ("098 181 614" -> "98181614").
const digitsOf = (value) => value.replace(/\D/g, "").replace(/^0+/, "");

const isEmpty = (el) => !el || el.value.trim() === "";

// Cada campo tiene su regla; las mismas se aplican en el backend.
const validators = [
  { el: byId("nameInput"), valid: (v) => v.trim() !== "" },
  {
    el: byId("ageInput"),
    valid: (v) => /^\d+$/.test(v.trim()) && Number(v) >= 1 && Number(v) <= 19,
  },
  { el: byId("ciInput"), valid: (v) => /^\d{7,8}$/.test(digitsOf(v)) },
  { el: byId("telInput"), valid: (v) => /^\d{8}$/.test(digitsOf(v)) },
  { el: byId("parentCelInput"), valid: (v) => /^9\d{7}$/.test(digitsOf(v)) },
  { el: byId("addressInput"), valid: (v) => v.trim() !== "" },
  { el: byId("hospitalInput"), valid: (v) => v.trim() !== "" },
  { el: byId("medicalEmergencyInput"), valid: (v) => v.trim() !== "" },
  // Preguntas de salud: sin responder no se puede asumir "ninguna".
  { el: byId("illnessChkInput"), valid: (v) => v !== "" },
  { el: byId("treatmentChkInput"), valid: (v) => v !== "" },
  { el: byId("contraindicatedChkInput"), valid: (v) => v !== "" },
  {
    el: byId("illnessInput"),
    valid: (v) => byId("illnessChkInput").value !== "true" || v.trim() !== "",
  },
  {
    el: byId("treatmentInput"),
    valid: (v) => byId("treatmentChkInput").value !== "si" || v.trim() !== "",
  },
  {
    el: byId("contraindicatedInput"),
    valid: (v) => byId("contraindicatedChkInput").value !== "si" || v.trim() !== "",
  },
];

// Un nombre de medicamento sin dosis es válido; una dosis sin nombre no.
const medicationRowsValid = () => {
  const names = document.getElementsByClassName("tableMedicationsInputName");
  const dosages = document.getElementsByClassName("tableMedicationsInputDosis");
  let ok = true;
  for (let i = 0; i < names.length; i++) {
    const bad = isEmpty(names[i]) && !isEmpty(dosages[i]);
    setError(names[i], bad);
    if (bad) ok = false;
  }
  return ok;
};

let triedSubmit = false;

const setError = (el, hasError) => {
  if (!el) return;
  el.classList.toggle("inputError", hasError);
  el.setAttribute("aria-invalid", hasError ? "true" : "false");
};

const validateField = ({ el, valid }) => {
  const ok = valid(el.value);
  setError(el, !ok);
  return ok;
};

// solo valida cuando se hizo click en enviar (triedSubmit = true)
const validateAll = () => {
  const results = validators.map(validateField);
  return results.every(Boolean) && medicationRowsValid();
};

// antes del submit: no marca rojo
// después del primer submit: marca/limpia en vivo
validators.forEach((validator) => {
  ["input", "change", "blur"].forEach((eventName) =>
    validator.el.addEventListener(eventName, () => {
      if (triedSubmit) validateField(validator);
    })
  );
});

// -----------------------------
// Envío
// -----------------------------
const SUSCEPTIBLE_OPTIONS = [
  ["suceptibleOidos", "Oídos"],
  ["suceptibleGarganta", "Garganta"],
  ["suceptibleBronquitis", "Bronquitis"],
  ["suceptibleAsma", "Asma"],
  ["suceptibleDolorCabeza", "Dolor de cabeza"],
  ["suceptibleMareos", "Mareos"],
  ["suceptibleTrastornosDigestivos", "Trastornos digestivos"],
  ["suceptibleResfrioTos", "Resfrío y tos"],
];

const collectMedications = () => {
  const names = document.getElementsByClassName("tableMedicationsInputName");
  const dosages = document.getElementsByClassName("tableMedicationsInputDosis");
  const medications = [];
  for (let i = 0; i < names.length; i++) {
    const name = names[i].value.trim();
    if (name) medications.push({ name, dosage: dosages[i].value.trim() });
  }
  return medications;
};

const buildPayload = () => ({
  name: byId("nameInput").value.trim(),
  age: byId("ageInput").value,
  dni: digitsOf(byId("ciInput").value),
  direction: byId("addressInput").value.trim(),
  telephone: digitsOf(byId("telInput").value),
  parentsCellphone: digitsOf(byId("parentCelInput").value),
  hospital: byId("hospitalInput").value.trim(),
  medicalEmergency: byId("medicalEmergencyInput").value.trim(),
  illness: byId("illnessInput").value.trim(),
  treatment: byId("treatmentInput").value.trim(),
  contraindications: byId("contraindicatedInput").value.trim(),
  susceptibleIllness: SUSCEPTIBLE_OPTIONS.filter(([id]) => byId(id).checked).map(
    ([, label]) => label
  ),
  medications: collectMedications(),
  authorization: authorizationChkInput.checked,
  privacyAccepted: privacyChkInput.checked,
  secured: byId("serialNumberInput").value.trim(),
});

let sending = false;

const sendFormData = async () => {
  if (sending) return;
  sending = true;
  submitFormBtn.disabled = true;
  const originalLabel = submitFormBtn.textContent;
  submitFormBtn.textContent = "Enviando...";

  const payload = buildPayload();

  try {
    const response = await fetch(`${API_URL}/api/campers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const firstName = encodeURIComponent(payload.name.split(" ")[0]);
      window.location.href = "/registroExitoso.html?name=" + firstName;
      return;
    }

    const body = await response.json().catch(() => ({}));
    alert(
      response.status >= 500 || !body.error
        ? "No se pudo enviar la ficha. Intentá de nuevo en unos minutos."
        : `No se pudo enviar la ficha: ${body.error}`
    );
  } catch (error) {
    console.error("Fetch falló:", error);
    alert("No se pudo conectar con el servidor. Revisá tu conexión e intentá de nuevo.");
  }

  sending = false;
  submitFormBtn.disabled = false;
  submitFormBtn.textContent = originalLabel;
};

submitFormBtn.addEventListener("click", (e) => {
  e.preventDefault();

  triedSubmit = true; // a partir de acá se empiezan a marcar los inválidos

  // 1) Validar campos
  if (!validateAll()) {
    const firstError = document.querySelector(".inputError");
    if (firstError) firstError.focus();
    return; // no envía
  }

  // 2) Validar autorización
  if (!authorizationChkInput.checked) {
    alert("Debe autorizar la asistencia al campamento para enviar la ficha.");
    return;
  }

  // 3) Validar aviso de privacidad (datos de salud)
  if (!privacyChkInput.checked) {
    alert("Debe aceptar el aviso de privacidad para guardar los datos de salud y enviar la ficha.");
    return;
  }

  // 4) Enviar
  sendFormData();
});

// -----------------------------
// Inscripciones cerradas
// -----------------------------
// El modal viene visible en el HTML (sin JS también se ve); si las inscripciones están abiertas se quita.
const avisoModal = document.getElementById("avisoInscripcion");

if (isRegistrationOpen()) {
  avisoModal.remove();
} else {
  // Todo lo demás queda inerte: sin clics, foco ni lectores de pantalla por debajo del modal.
  [...document.body.children]
    .filter((el) => el !== avisoModal && el.tagName !== "SCRIPT")
    .forEach((el) => el.setAttribute("inert", ""));
  document.querySelector(".fichaDelAcampante").classList.add("formClosed");
  document.querySelector(".finalFormPart").classList.add("formClosed");
  document
    .querySelectorAll(".fichaDelAcampante input, .fichaDelAcampante select, #authorizationChkInput, #privacyChkInput")
    .forEach((el) => (el.disabled = true));
  submitFormBtn.disabled = true;
  submitFormBtn.textContent = "No disponible";
}
