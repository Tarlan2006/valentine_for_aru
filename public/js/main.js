document.addEventListener('DOMContentLoaded', () => {
  const noBtn = document.getElementById('noBtn');
  const yesBtn = document.getElementById('yesBtn');
  const zone = document.getElementById('buttonZone');

  let yesScale = 1;
  let noScale = 1;
  const yesScaleStep = 1.12;
  const noScaleStep = 0.94;
  const padding = 12;

  const addTapFeedback = (el) => {
    if (!el) return;
    const add = () => el.classList.add('tapped');
    const remove = () => el.classList.remove('tapped');
    ['pointerdown', 'touchstart'].forEach(evt => el.addEventListener(evt, add, { passive: true }));
    ['pointerup', 'pointercancel', 'touchend', 'touchcancel', 'mouseleave'].forEach(evt => el.addEventListener(evt, remove));
  };

  [yesBtn, noBtn].forEach(addTapFeedback);

  const maxScaleForYes = () => {
    const zoneRect = zone.getBoundingClientRect();
    const yesRect = yesBtn.getBoundingClientRect();

    const baseWidth = yesRect.width / yesScale;
    const baseHeight = yesRect.height / yesScale;

    const widthLimit = (zoneRect.width - padding * 2) / baseWidth;
    const heightLimit = (zoneRect.height - padding * 2) / baseHeight;

    // stay inside the white card while still allowing generous growth
    return Math.max(1, Math.min(widthLimit, heightLimit));
  };

  const growYes = () => {
    const targetScale = yesScale * yesScaleStep;
    yesScale = Math.min(maxScaleForYes(), targetScale);
    yesBtn.style.transform = `translateX(-50%) scale(${yesScale.toFixed(3)})`;
  };

  const shrinkNo = () => {
    noScale = Math.max(0.55, noScale * noScaleStep);
    noBtn.style.transform = `scale(${noScale.toFixed(3)})`;
  };

  const overlapsYes = (x, y, noSize, zoneRect, yesRect) => {
    const noBox = {
      left: x,
      right: x + noSize.width,
      top: y,
      bottom: y + noSize.height
    };
    const yesBox = {
      left: yesRect.left - zoneRect.left,
      right: yesRect.right - zoneRect.left,
      top: yesRect.top - zoneRect.top,
      bottom: yesRect.bottom - zoneRect.top
    };

    return !(
      noBox.right < yesBox.left ||
      noBox.left > yesBox.right ||
      noBox.bottom < yesBox.top ||
      noBox.top > yesBox.bottom
    );
  };

  const moveNoButton = () => {
    const zoneRect = zone.getBoundingClientRect();
    const yesRect = yesBtn.getBoundingClientRect();
    const noRect = noBtn.getBoundingClientRect();

    const maxX = Math.max(0, zoneRect.width - noRect.width - padding * 2);
    const maxY = Math.max(0, zoneRect.height - noRect.height - padding * 2);

    let attempt = 0;
    let x = padding;
    let y = padding;

    while (attempt < 10) {
      x = padding + Math.random() * maxX;
      y = padding + Math.random() * maxY;
      if (!overlapsYes(x, y, { width: noRect.width, height: noRect.height }, zoneRect, yesRect)) {
        break;
      }
      attempt += 1;
    }

    noBtn.style.left = `${x}px`;
    noBtn.style.top = `${y}px`;
    growYes();
  };

  ['pointerenter', 'touchstart'].forEach(eventName => {
    noBtn.addEventListener(eventName, (e) => {
      if (eventName === 'touchstart') e.preventDefault();
      shrinkNo();
      moveNoButton();
    });
  });

  yesBtn.addEventListener('click', () => {
    window.location.href = '/yes';
  });

  // Place buttons nicely on load and keep them in bounds on resize.
  const initialPlace = () => {
    // Reset yes scale
    yesScale = 1;
    yesBtn.style.transform = 'translateX(-50%) scale(1)';
    // Reset no scale
    noScale = 1;
    noBtn.style.transform = 'scale(1)';
    moveNoButton();
  };

  initialPlace();
  window.addEventListener('resize', initialPlace);
});
