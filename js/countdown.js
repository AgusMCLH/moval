// Cuenta regresiva hasta el 7 de enero a las 00:00 (UTC-3, hora de Uruguay).
// Trabaja con la hora de Uruguay "corrida" a campos UTC, así no depende de la zona del visitante.
(() => {
  const OFFSET_MS = 3 * 60 * 60 * 1000; // UTC-3
  const START_MONTH = 0; // enero
  const START_DAY = 7;
  const CAMP_DAYS = 8; // del 7 al 14 de enero inclusive el campamento está en curso

  const root = document.getElementById("countdown");
  if (!root) return;

  const pad = (n) => String(n).padStart(2, "0");
  const daysInMonth = (year, month) => new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const plural = (n, one, many) => (n === 1 ? one : many);

  // Fecha/hora actual en Uruguay, expresada como campos UTC.
  const uruguayNow = () => new Date(Date.now() - OFFSET_MS);

  // Suma `months` meses a `date` sin desbordar (31 ene + 1 mes = 28/29 feb).
  const addMonths = (date, months) => {
    const total = date.getUTCFullYear() * 12 + date.getUTCMonth() + months;
    const year = Math.floor(total / 12);
    const month = total % 12;
    return Date.UTC(
      year,
      month,
      Math.min(date.getUTCDate(), daysInMonth(year, month)),
      date.getUTCHours(),
      date.getUTCMinutes(),
      date.getUTCSeconds()
    );
  };

  const set = (id, value, singular, pluralName) => {
    document.getElementById(`cd${id}`).textContent = pad(value);
    document.getElementById(`cd${id}Name`).textContent = plural(value, singular, pluralName);
  };

  const tick = () => {
    const now = uruguayNow();
    const year = now.getUTCFullYear();
    const thisStart = Date.UTC(year, START_MONTH, START_DAY);
    const campEnd = thisStart + CAMP_DAYS * 24 * 60 * 60 * 1000;

    // Durante el campamento, mensaje en lugar de la cuenta.
    if (now.getTime() >= thisStart && now.getTime() < campEnd) {
      root.classList.add("countdownDone");
      document.getElementById("countdownLabel").textContent = "¡Moval ya comenzó!";
      return;
    }
    root.classList.remove("countdownDone");
    document.getElementById("countdownLabel").textContent = "Faltan para el campamento";

    const target = now.getTime() < thisStart ? thisStart : Date.UTC(year + 1, START_MONTH, START_DAY);

    let months = (new Date(target).getUTCFullYear() - year) * 12 + (START_MONTH - now.getUTCMonth());
    if (addMonths(now, months) > target) months -= 1;

    const rest = target - addMonths(now, months);
    const days = Math.floor(rest / 86400000);
    const hours = Math.floor((rest % 86400000) / 3600000);
    const minutes = Math.floor((rest % 3600000) / 60000);

    set("Months", months, "Mes", "Meses");
    set("Days", days, "Día", "Días");
    set("Hours", hours, "Hora", "Horas");
    set("Minutes", minutes, "Minuto", "Minutos");
  };

  tick();
  setInterval(tick, 1000);
})();
