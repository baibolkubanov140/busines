/* Business Innovation — скрипты лендинга */
document.addEventListener('DOMContentLoaded', () => {

  /* ===== Шапка: фон при прокрутке ===== */
  const header = document.getElementById('header');
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 20);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ===== Мобильное меню ===== */
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');

  function toggleMenu(open) {
    burger.classList.toggle('is-open', open);
    nav.classList.toggle('is-open', open);
    header.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
  }
  burger.addEventListener('click', () => toggleMenu(!nav.classList.contains('is-open')));
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggleMenu(false)));

  /* ===== Появление элементов при прокрутке ===== */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObs = new IntersectionObserver((entries, obs) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('is-visible'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => revealObs.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ===== Счётчики статистики ===== */
  const counters = document.querySelectorAll('[data-count]');

  function runCounter(el) {
    const target = +el.dataset.count;
    const suffix = el.dataset.suffix || '';
    const duration = 1800;
    const start = performance.now();
    (function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3); // плавное замедление
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    })(start);
  }

  if ('IntersectionObserver' in window) {
    const countObs = new IntersectionObserver((entries, obs) => {
      entries.forEach(e => {
        if (e.isIntersecting) { runCounter(e.target); obs.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(c => countObs.observe(c));
  } else {
    counters.forEach(c => { c.textContent = c.dataset.count + (c.dataset.suffix || ''); });
  }

  /* ===== Модальное окно «Подробнее» ===== */
  const projects = {
    EcoMarket: 'Интернет-магазин экотоваров: каталог на 1200 позиций, онлайн-оплата и доставка по стране. Через полгода после запуска продажи выросли в три раза.',
    FitBot: 'Telegram-бот для сети фитнес-клубов. Записывает на занятия, напоминает о тренировках и продлевает абонементы. Нагрузка на администраторов снизилась на 70%.',
    LogiTrack: 'Панель аналитики для логистической компании. Объединяет данные о маршрутах, расходах и сроках, а отчёты формируются автоматически с помощью ИИ.'
  };
  const modal = document.getElementById('modal');
  const modalTitle = document.getElementById('modalTitle');
  const modalText = document.getElementById('modalText');
  let lastFocus = null;

  function openModal(name) {
    lastFocus = document.activeElement;
    modalTitle.textContent = name;
    modalText.textContent = projects[name];
    modal.hidden = false;
    document.getElementById('modalClose').focus();
  }
  function closeModal() {
    modal.hidden = true;
    if (lastFocus) lastFocus.focus();
  }
  document.querySelectorAll('[data-project]').forEach(btn =>
    btn.addEventListener('click', () => openModal(btn.dataset.project)));
  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.getElementById('modalCta').addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { if (!modal.hidden) closeModal(); toggleMenu(false); }
  });

  /* ===== Проверка формы ===== */
  const form = document.getElementById('form');
  const success = document.getElementById('success');

  const rules = {
    name: v => v.trim().length >= 2 ? '' : 'Введите имя (не менее 2 символов).',
    phone: v => /^\+?[\d\s()-]{9,18}$/.test(v.trim()) && v.replace(/\D/g, '').length >= 9
      ? '' : 'Введите телефон в формате +996 555 123 456.',
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Введите корректный адрес почты, например name@example.com.',
    message: v => v.trim().length >= 10 ? '' : 'Опишите задачу (не менее 10 символов).'
  };

  function validateField(input) {
    const msg = rules[input.name](input.value);
    const field = input.closest('.field');
    field.classList.toggle('has-error', !!msg);
    field.querySelector('.error').textContent = msg;
    input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    return !msg;
  }

  const inputs = form.querySelectorAll('input, textarea');
  inputs.forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      success.hidden = true;
      if (input.closest('.field').classList.contains('has-error')) validateField(input);
    });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const results = [...inputs].map(validateField);
    if (results.includes(false)) {
      form.querySelector('.has-error input, .has-error textarea').focus();
      return;
    }
    // Здесь можно подключить отправку на сервер (fetch) или сервис форм, например Formspree
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Отправляем…';
    setTimeout(() => {
      form.reset();
      btn.disabled = false;
      btn.textContent = 'Отправить заявку';
      success.hidden = false;
    }, 900);
  });

  /* ===== Год в подвале ===== */
  document.getElementById('year').textContent = new Date().getFullYear();
});
