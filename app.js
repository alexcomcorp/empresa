const navigation = document.querySelector('#navegacion');
const menuToggle = document.querySelector('.menu-toggle');
const mobile = window.matchMedia('(max-width: 740px)');

function updateMenu(open = false) {
  menuToggle.hidden = !mobile.matches;
  menuToggle.setAttribute('aria-expanded', String(mobile.matches && open));
  navigation.hidden = mobile.matches && !open;
}

updateMenu();
mobile.addEventListener('change', () => updateMenu());
menuToggle.addEventListener('click', () => {
  updateMenu(menuToggle.getAttribute('aria-expanded') === 'false');
});
navigation.addEventListener('click', (event) => {
  if (mobile.matches && event.target.closest('a')) updateMenu();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
    updateMenu();
    menuToggle.focus();
  }
});

const form = document.querySelector('.quote-form');
const service = form.elements.servicio;
const details = form.elements.detalles;
const status = document.querySelector('#resultado');
const manualCopy = document.querySelector('#copia-manual');
const quoteWhatsApp = document.querySelector('.quote-whatsapp');
form.hidden = false;

function resetFeedback() {
  status.textContent = '';
  manualCopy.hidden = true;
  quoteWhatsApp.hidden = true;
}

for (const link of document.querySelectorAll('[data-service]')) {
  link.addEventListener('click', () => {
    service.value = link.dataset.service;
    resetFeedback();
  });
}

form.addEventListener('input', () => {
  details.setCustomValidity('');
  resetFeedback();
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const description = details.value.trim();
  if (!description) {
    details.setCustomValidity('Escribe una breve descripción de tu proyecto.');
    details.reportValidity();
    return;
  }

  const topic = service.value ? '\nServicio: ' + service.value + '.' : '';
  const message = 'Hola, Alexcom. Quisiera solicitar una cotización.' + topic + '\nProyecto: ' + description;
  try {
    await navigator.clipboard.writeText(message);
    manualCopy.hidden = true;
    status.textContent = 'Consulta copiada. Abre WhatsApp y pégala en el chat.';
  } catch {
    manualCopy.value = message;
    manualCopy.hidden = false;
    manualCopy.focus();
    manualCopy.select();
    status.textContent = 'Copia la consulta seleccionada y pégala en WhatsApp.';
  }
  quoteWhatsApp.hidden = false;
});
