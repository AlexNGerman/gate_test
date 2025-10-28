(() => {
  const TOOLTIP_ATTR = 'data-tooltip';
  const PLACEMENT_ATTR = 'data-placement';
  const DEFAULT_PLACEMENT = 'top';

  const tooltip = document.createElement('div');
  tooltip.className = 'tooltip';
  tooltip.setAttribute('role', 'tooltip');
  tooltip.setAttribute('aria-hidden', 'true');
  tooltip.id = 'tooltip-' + Math.random().toString(36).slice(2, 9);
  document.body.appendChild(tooltip);

  let currentTrigger = null;

  const ensureFocusable = el => {
    if (!(el instanceof Element)) return;
    const tag = el.tagName.toLowerCase();
    const naturallyFocusable = ['a', 'button', 'input', 'textarea', 'select'].includes(tag) && (tag !== 'a' || el.hasAttribute('href'));
    if (!naturallyFocusable && !el.hasAttribute('tabindex')) {
      el.setAttribute('tabindex', '0');
    }
  };

  const makeAllTooltipTriggersFocusable = (root = document) => {
    root.querySelectorAll(`[${TOOLTIP_ATTR}]`).forEach(ensureFocusable);
  };

  const showTooltipFor = el => {
    if (!(el instanceof Element)) return;
    const text = el.getAttribute(TOOLTIP_ATTR);
    if (!text) return;

    if (currentTrigger && currentTrigger !== el) hideTooltip();
    currentTrigger = el;

    tooltip.textContent = text;
    tooltip.dataset.placement = el.getAttribute(PLACEMENT_ATTR) || DEFAULT_PLACEMENT;
    tooltip.dataset.state = 'visible';
    tooltip.setAttribute('aria-hidden', 'false');
    el.setAttribute('aria-describedby', tooltip.id);

    requestAnimationFrame(positionTooltip);
  };

  const hideTooltip = () => {
    if (!currentTrigger) return;
    tooltip.dataset.state = 'hidden';
    tooltip.setAttribute('aria-hidden', 'true');
    currentTrigger.removeAttribute('aria-describedby');
    currentTrigger = null;
  };

  const positionTooltip = () => {
    if (!currentTrigger) return;
    tooltip.style.left = '0px';
    tooltip.style.top = '0px';
    const prevVisibility = tooltip.style.visibility;
    tooltip.style.visibility = 'hidden';
    tooltip.style.display = 'inline-block';

    const rect = currentTrigger.getBoundingClientRect();
    const ttRect = tooltip.getBoundingClientRect();
    const gap = 8;
    const viewport = { width: document.documentElement.clientWidth, height: document.documentElement.clientHeight };
    const preferred = tooltip.dataset.placement || DEFAULT_PLACEMENT;
    const candidates = [preferred, 'top', 'right', 'bottom', 'left'].filter((v, i, a) => a.indexOf(v) === i);

    const computeCoords = placement => {
      let left = 0, top = 0;
      switch (placement) {
        case 'top':
          left = rect.left + (rect.width - ttRect.width) / 2;
          top = rect.top - ttRect.height - gap;
          break;
        case 'bottom':
          left = rect.left + (rect.width - ttRect.width) / 2;
          top = rect.bottom + gap;
          break;
        case 'left':
          left = rect.left - ttRect.width - gap;
          top = rect.top + (rect.height - ttRect.height) / 2;
          break;
        case 'right':
        default:
          left = rect.right + gap;
          top = rect.top + (rect.height - ttRect.height) / 2;
          break;
      }
      return { left: Math.round(left), top: Math.round(top), w: ttRect.width, h: ttRect.height };
    };

    let chosen = candidates.find(p => {
      const c = computeCoords(p);
      return c.left >= 0 && c.top >= 0 && (c.left + c.w) <= viewport.width && (c.top + c.h) <= viewport.height;
    });

    if (!chosen) {
      let best = { area: -1, place: candidates[0] };
      candidates.forEach(p => {
        const c = computeCoords(p);
        const x1 = Math.max(0, c.left);
        const y1 = Math.max(0, c.top);
        const x2 = Math.min(viewport.width, c.left + c.w);
        const y2 = Math.min(viewport.height, c.top + c.h);
        const area = Math.max(0, x2 - x1) * Math.max(0, y2 - y1);
        if (area > best.area) best = { area, place: p };
      });
      chosen = best.place;
    }

    tooltip.dataset.placement = chosen;
    const final = computeCoords(chosen);
    const pad = 6;
    const left = Math.min(Math.max(final.left, pad), viewport.width - final.w - pad);
    const top = Math.min(Math.max(final.top, pad), viewport.height - final.h - pad);

    tooltip.style.left = (left + window.scrollX) + 'px';
    tooltip.style.top = (top + window.scrollY) + 'px';
    tooltip.style.visibility = prevVisibility;
  };

  const closestIfElement = (node, selector) => node instanceof Element ? node.closest(selector) : null;

  document.addEventListener('pointerenter', e => {
    const el = closestIfElement(e.target, `[${TOOLTIP_ATTR}]`);
    if (el) showTooltipFor(el);
  }, true);

  document.addEventListener('pointerleave', e => {
    const from = closestIfElement(e.target, `[${TOOLTIP_ATTR}]`);
    if (!from) return;
    const related = e.relatedTarget;
    if (related instanceof Node && from.contains(related)) return;
    hideTooltip();
  }, true);

  document.addEventListener('focusin', e => {
    const el = closestIfElement(e.target, `[${TOOLTIP_ATTR}]`);
    if (el) showTooltipFor(el);
  });

  document.addEventListener('focusout', e => {
    const el = closestIfElement(e.target, `[${TOOLTIP_ATTR}]`);
    if (!el) return;
    const related = e.relatedTarget;
    if (related instanceof Node && el.contains(related)) return;
    hideTooltip();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') hideTooltip();
  });

  window.addEventListener('scroll', () => {
    if (currentTrigger) requestAnimationFrame(positionTooltip);
  }, { passive: true });

  window.addEventListener('resize', () => {
    if (currentTrigger) requestAnimationFrame(positionTooltip);
  });

  const mo = new MutationObserver(mutations => {
    mutations.forEach(m => {
      if (m.type === 'childList' && m.addedNodes.length) {
        m.addedNodes.forEach(n => {
          if (n instanceof Element) {
            if (n.hasAttribute(TOOLTIP_ATTR)) ensureFocusable(n);
            makeAllTooltipTriggersFocusable(n);
          }
        });
      }
    });
  });

  mo.observe(document.body, { childList: true, subtree: true });
  makeAllTooltipTriggersFocusable();

  const addBtn = document.getElementById('add');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      const span = document.createElement('span');
      span.className = 'dynamic';
      span.setAttribute(TOOLTIP_ATTR, 'Dynamically added tooltip description');
      span.textContent = 'Dynamically added element';
      const container = document.getElementById('container');
      if (container) container.appendChild(span);
      ensureFocusable(span);
    });
  }

  window.addEventListener('unload', () => mo.disconnect());
})();
