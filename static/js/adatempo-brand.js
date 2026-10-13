(() => {
  // Decorate readable prose, not metadata, citation code, or the existing logo title.
  function decorate(root) {
    if (!root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        return /\bAdaTempo\b/.test(node.data) &&
          !node.parentElement.closest('script, style, pre, code, textarea, select, .adatempo-brand, .publication-title')
          ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      const fragment = document.createDocumentFragment();
      node.data.split(/\bAdaTempo\b/).forEach((part, index) => {
        if (index) {
          const brand = document.createElement('span');
          brand.className = 'adatempo-brand';
          if (node.parentElement.closest('.media-caption')) {
            const icon = document.createElement('img');
            icon.src = 'static/images/adatempo-favicon-v3.png';
            icon.alt = '';
            icon.setAttribute('aria-hidden', 'true');
            brand.append(icon);
          }
          const name = document.createElement('strong');
          name.textContent = 'AdaTempo';
          brand.append(name);
          fragment.append(brand);
        }
        fragment.append(document.createTextNode(part));
      });
      node.replaceWith(fragment);
    });
  }
  decorate(document.getElementById('main-content'));
  const caption = document.getElementById('experiment-player-caption');
  if (caption) {
    new MutationObserver(() => decorate(caption)).observe(caption, { childList: true });
  }
})();
