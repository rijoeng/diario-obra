/*
 * Diário de Obra Rijo · configuração
 * API_URL = App da Web do Apps Script "API Vobi 06 - APP Diário de Obras Rijo" (termina em /exec).
 * Com API_URL = 'demo' o app roda em demonstração, com dados de exemplo e sem servidor.
 */
window.RDO_CONFIG = {
  API_URL: 'https://script.google.com/macros/s/AKfycbzCaC4qqu4PEjqHnbKXk0jDBz7tFOO-ae4mnV-lcF4bPUUUAP6iA0V1vwPe0woj2SD-/exec',
  CARIMBO_FOTO: true,      // grava a marca d'água Rijo (obra, data, hora, coordenadas) na foto
  FOTO_MAX_PX: 1600,       // maior lado da foto depois de comprimida
  FOTO_QUALIDADE: 0.72     // JPEG: ~300 a 600 KB por foto
};
