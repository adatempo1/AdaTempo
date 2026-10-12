(() => {
  const picker = document.getElementById('experiment-task');
  const player = document.getElementById('experiment-player');
  const caption = document.getElementById('experiment-player-caption');
  const panel = document.getElementById('experiment-video-panel');
  const tabs = [...document.querySelectorAll('[data-video-category]')];
  if (!picker || !player || !panel || !tabs.length) return;

  const choices = new Map();
  let category;

  function loadTask() {
    const option = picker.selectedOptions[0];
    if (!option) return;
    choices.set(category, option.value);
    player.pause();
    player.querySelectorAll('source').forEach(source => source.remove());
    player.src = option.value;
    player.setAttribute('aria-label', `${option.textContent} ${category === 'simulation' ? 'simulation' : 'real-world'} comparison`);
    if (option.dataset.poster) player.setAttribute('poster', option.dataset.poster);
    else player.removeAttribute('poster');
    caption.textContent = option.dataset.caption || `${option.textContent} — simulation comparison.`;
    player.load();
  }

  function selectCategory(next) {
    const template = document.getElementById(`${next}-tasks`);
    if (!template || next === category) return;
    category = next;
    panel.querySelectorAll('[data-category-intro]').forEach(intro => {
      intro.hidden = intro.dataset.categoryIntro !== next;
    });
    picker.replaceChildren(template.content.cloneNode(true));
    picker.value = choices.get(next) || template.dataset.defaultTask;
    tabs.forEach(tab => {
      const active = tab.dataset.videoCategory === next;
      tab.classList.toggle('is-selected', active);
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      if (active) panel.setAttribute('aria-labelledby', tab.id);
    });
    loadTask();
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectCategory(tab.dataset.videoCategory));
    tab.addEventListener('keydown', event => {
      const keys = ['ArrowLeft', 'ArrowRight', 'Home', 'End'];
      if (!keys.includes(event.key)) return;
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1
        : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
      tabs[next].focus();
      selectCategory(tabs[next].dataset.videoCategory);
    });
  });
  picker.addEventListener('change', loadTask);
  // Retain links to the two old sections while using a single player.
  const selectFromHash = () => {
    if (location.hash === '#real-world-videos') selectCategory('real-world');
    else if (location.hash === '#simulation-videos') selectCategory('simulation');
  };
  selectCategory(location.hash === '#real-world-videos' ? 'real-world' : 'simulation');
  window.addEventListener('hashchange', selectFromHash);
})();
