// URL del backend: en local apunta al servidor de desarrollo, en producción a Vercel.
const IS_LOCAL = location.hostname === 'localhost' || location.hostname === '127.0.0.1';
const API_URL = IS_LOCAL ? 'http://localhost:3000' : 'https://back.moval.uy';

// Las inscripciones abren solas en esta fecha: 27/11/2026 00:00 (UTC-3).
// Cambiarla cada año, junto con REGISTRATION_OPENS_AT en el backend.
const REGISTRATION_OPENS_AT = new Date('2026-10-26T00:00:00-03:00');
// En local siempre está abierto, para poder desarrollar y probar sin esperar la fecha.
const isRegistrationOpen = () => IS_LOCAL || Date.now() >= REGISTRATION_OPENS_AT.getTime();
