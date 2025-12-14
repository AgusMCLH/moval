// -----------------------------
// Render condicional de inputs
// -----------------------------
const renderIllness = () => {
  const render = document.getElementById("illnessChkInput").value === "true";
  document.getElementById("illnessInputContainer").style.display = render
    ? "flex"
    : "none";
};

const renderTreatment = () => {
  const render = document.getElementById("treatmentChkInput").value === "si";
  document.getElementById("treatmentInputContainer").style.display = render
    ? "flex"
    : "none";
};

const renderContraindicated = () => {
  const render =
    document.getElementById("contraindicatedChkInput").value === "si";
  document.getElementById("contraindicatedInputContainer").style.display =
    render ? "flex" : "none";
};

// -----------------------------
// Validación UI (solo al submit)
// -----------------------------
const submitFormBtn = document.getElementById("submitFormBtn");
const authorizationChkInput = document.getElementById("authorizationChkInput");

const requiredFields = [
  document.getElementById("nameInput"),
  document.getElementById("ageInput"),
  document.getElementById("ciInput"),
  document.getElementById("telInput"),
  document.getElementById("parentCelInput"),
  document.getElementById("addressInput"),
  document.getElementById("hospitalInput"),
  document.getElementById("medicalEmergencyInput"),
];

let triedSubmit = false;

const isEmpty = (el) => !el || el.value.trim() === "";

const setError = (el, hasError) => {
  if (!el) return;
  el.classList.toggle("inputError", hasError);
  el.setAttribute("aria-invalid", hasError ? "true" : "false");
};

// solo valida cuando se hizo click en enviar (triedSubmit = true)
const validateRequiredFields = () => {
  let ok = true;

  requiredFields.forEach((field) => {
    const empty = isEmpty(field);
    setError(field, empty);
    if (empty) ok = false;
  });

  return ok;
};

// antes del submit: no marca rojo
// después del primer submit: marca/limpia en vivo
const wireLiveValidation = () => {
  requiredFields.forEach((field) => {
    if (!field) return;

    field.addEventListener("input", () => {
      if (!triedSubmit) return; // no marcar nada antes del submit
      setError(field, isEmpty(field));
    });

    field.addEventListener("blur", () => {
      if (!triedSubmit) return; // no marcar nada antes del submit
      setError(field, isEmpty(field));
    });
  });
};

wireLiveValidation();

// -----------------------------
// Envío (tu lógica)
// -----------------------------
const sendFormData = async () => {
  const name = document.getElementById("nameInput").value.trim();
  const age = document.getElementById("ageInput").value;
  const dni = document.getElementById("ciInput").value;
  const tel = document.getElementById("telInput").value;
  const parentCell = document.getElementById("parentCelInput").value;
  const addressInput = document.getElementById("addressInput").value.trim();
  const hospital = document.getElementById("hospitalInput").value.trim();
  const medicalEmergency = document
    .getElementById("medicalEmergencyInput")
    .value.trim();
  const illness = document.getElementById("illnessInput").value.trim();
  const treatment = document.getElementById("treatmentInput").value.trim();
  const contraindicated = document
    .getElementById("contraindicatedInput")
    .value.trim();
  const serialNumber = document
    .getElementById("serialNumberInput")
    .value.trim();

  const suceptibleOidos = document.getElementById("suceptibleOidos").checked;
  const suceptibleGarganta =
    document.getElementById("suceptibleGarganta").checked;
  const suceptibleBronquitis = document.getElementById(
    "suceptibleBronquitis"
  ).checked;
  const suceptibleAsma = document.getElementById("suceptibleAsma").checked;
  const suceptibleDolorCabeza = document.getElementById(
    "suceptibleDolorCabeza"
  ).checked;
  const suceptibleMareos = document.getElementById("suceptibleMareos").checked;
  const suceptibletrastornosDigestivos = document.getElementById(
    "suceptibleTrastornosDigestivos"
  ).checked;
  const suceptibleResfrioTos = document.getElementById(
    "suceptibleResfrioTos"
  ).checked;

  let suceptiveness = "";
  suceptibleOidos && (suceptiveness += "Oídos, ");
  suceptibleGarganta && (suceptiveness += "Garganta, ");
  suceptibleBronquitis && (suceptiveness += "Bronquitis, ");
  suceptibleAsma && (suceptiveness += "Asma, ");
  suceptibleDolorCabeza && (suceptiveness += "Dolor de cabeza, ");
  suceptibleMareos && (suceptiveness += "Mareos, ");
  suceptibletrastornosDigestivos &&
    (suceptiveness += "Trastornos digestivos, ");
  suceptibleResfrioTos && (suceptiveness += "Resfrío y tos, ");

  const medicationsName = document.getElementsByClassName(
    "tableMedicationsInputName"
  );
  const medicationsDosage = document.getElementsByClassName(
    "tableMedicationsInputDosis"
  );

  let medications = [];
  for (let i = 0; i < medicationsName.length; i++) {
    const medName = medicationsName[i].value.trim();
    const medDosage = medicationsDosage[i].value.trim();
    if (medName && medDosage) {
      medications.push({ name: medName, dosage: medDosage });
    }
  }

  const data = {
    name,
    age,
    dni,
    direction: addressInput,
    telephone: tel,
    parentsCellphone: parentCell,
    hospital,
    medicalEmergency,
    illness,
    treatment,
    contraindications: contraindicated,
    susceptibleIllness: suceptiveness,
    secured: serialNumber,
    medications,
  };

  try {
    const response = await fetch("https://back.moval.uy/api/campers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const nombreUsuario = name.split(" ")[0];
      window.location.href = "/registroExitoso.html?name=" + nombreUsuario;
      return;
    }

    alert("No se pudo enviar la ficha. Intenta de nuevo.");
  } catch (error) {
    console.error("Fetch falló:", error);
    alert("Error de red o CORS al enviar la ficha. Abre la consola.");
  }
};

submitFormBtn.addEventListener("click", (e) => {
  e.preventDefault();

  triedSubmit = true; // a partir de acá se empiezan a marcar los vacíos

  // 1) Validar campos principales
  const ok = validateRequiredFields();
  if (!ok) {
    const firstError = requiredFields.find((f) =>
      f.classList.contains("inputError")
    );
    if (firstError) firstError.focus();
    return; // no envía
  }

  // 2) Validar autorización
  if (!authorizationChkInput.checked) {
    alert("Debe autorizar la asistencia al campamento para enviar la ficha.");
    return;
  }

  // 3) Enviar
  sendFormData();
});
