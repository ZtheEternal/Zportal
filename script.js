const deck = document.querySelector('#deck');
const slides = [...document.querySelectorAll('.slide')];
const dots = [...document.querySelectorAll('.progress span')];
const previous = document.querySelector('#previous');
const next = document.querySelector('#next');
let activeIndex = 0;
let wheelLocked = false;

function goTo(index) { deck.scrollTo({ left: Math.max(0, Math.min(index, slides.length - 1)) * window.innerWidth, behavior: 'smooth' }); }
function setActive(index) {
  activeIndex = index;
  dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
  slides.forEach((slide, i) => slide.classList.toggle('in-view', i === index));
  document.querySelector('#progress').setAttribute('aria-label', `Page ${index + 1} of ${slides.length}`);
  previous.disabled = index === 0; next.disabled = index === slides.length - 1;
}
previous.addEventListener('click', () => goTo(activeIndex - 1));
next.addEventListener('click', () => goTo(activeIndex + 1));
dots.forEach((dot, index) => dot.addEventListener('click', () => goTo(index)));
deck.addEventListener('scroll', () => setActive(Math.round(deck.scrollLeft / window.innerWidth)), { passive: true });
window.addEventListener('keydown', (event) => {
  if (['TEXTAREA', 'INPUT'].includes(document.activeElement.tagName)) return;
  if (event.key === 'ArrowRight') goTo(activeIndex + 1);
  if (event.key === 'ArrowLeft') goTo(activeIndex - 1);
});
deck.addEventListener('wheel', event => {
  if (Math.abs(event.deltaY) < Math.abs(event.deltaX) || wheelLocked) return;
  event.preventDefault(); wheelLocked = true;
  goTo(activeIndex + (event.deltaY > 0 ? 1 : -1));
  setTimeout(() => wheelLocked = false, 650);
}, { passive: false });
document.querySelector('#copyEmail').addEventListener('click', async () => {
  const message = document.querySelector('#copyMessage');
  try { await navigator.clipboard.writeText('drzbusinesss@gmail.com'); message.textContent = 'COPIED!'; }
  catch { message.textContent = 'COPY FAILED'; }
  setTimeout(() => message.textContent = '', 1600);
});
document.querySelector('#mailForm').addEventListener('submit', event => {
  event.preventDefault();
  const body = encodeURIComponent(document.querySelector('#mailMessage').value.trim());
  window.location.href = `mailto:drzbusinesss@gmail.com?subject=${encodeURIComponent('Message from Dr Z Portfolio')}&body=${body}`;
});
document.querySelectorAll('.external-link').forEach(link => link.addEventListener('click', () => {
  link.animate([{ transform: 'scale(1)' }, { transform: 'scale(.94)' }, { transform: 'scale(1)' }], { duration: 280, easing: 'ease-out' });
}));
setActive(0);
