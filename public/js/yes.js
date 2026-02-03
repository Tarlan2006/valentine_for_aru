// Handles the three-stage Valentine flow on yes.html

document.addEventListener('DOMContentLoaded', () => {
  const flow = document.getElementById('stageFlow');
  const stages = Array.from(document.querySelectorAll('.stage'));
  const nextButtons = document.querySelectorAll('[data-next]');
  const giftButton = document.getElementById('giftButton');
  const presentCards = document.querySelectorAll('.present-card');
  const detailBox = document.getElementById('giftDetail');
  const detailTitle = document.getElementById('giftTitle');
  const detailText = document.getElementById('giftText');

  const giftCopy = {
    photos: {
      title: 'Memory lane',
      text: 'A gallery of our sweetest snapshots is coming right here. Until then, imagine us smiling in every frame.'
    },
    song: {
      title: 'Love song',
      text: 'Queue our playlist tonight. I will hum your favorite chorus and dance with you in the kitchen.'
    },
    letter: {
      title: 'Little letters',
      text: 'Three handwritten notes are on the way: one for today, one for tough days, and one for our future adventures.'
    }
  };

  const showStage = (stageNumber) => {
    stages.forEach((stage) => {
      stage.classList.toggle('active', stage.dataset.stage === String(stageNumber));
    });
    if (flow) flow.dataset.stage = String(stageNumber);
  };

  nextButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.next;
      if (target) showStage(target);
    });
  });

  if (giftButton) {
    giftButton.addEventListener('touchstart', () => giftButton.classList.add('tapped'), { passive: true });
    ['touchend', 'touchcancel', 'pointerup', 'pointercancel', 'mouseleave'].forEach(evt =>
      giftButton.addEventListener(evt, () => giftButton.classList.remove('tapped'))
    );

    giftButton.addEventListener('click', () => showStage(3));
    giftButton.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        showStage(3);
      }
    });
  }

  presentCards.forEach((card) => {
    card.addEventListener('touchstart', () => card.classList.add('tapped'), { passive: true });
    ['touchend', 'touchcancel', 'pointerup', 'pointercancel', 'mouseleave'].forEach(evt =>
      card.addEventListener(evt, () => card.classList.remove('tapped'))
    );

    card.addEventListener('click', () => {
      const key = card.dataset.gift;
      if (key === 'photos') {
        window.location.href = '/memories';
        return;
      }
      if (key === 'song') {
        window.location.href = '/love-song';
        return;
      }
      if (key === 'letter') {
        window.location.href = '/love-letter';
        return;
      }

      presentCards.forEach((btn) => btn.classList.remove('selected'));
      card.classList.add('selected');

      const copy = giftCopy[key];
      if (!copy) return;
      if (detailBox) detailBox.hidden = false;
      if (detailTitle) detailTitle.textContent = copy.title;
      if (detailText) detailText.textContent = copy.text;
    });
  });

  const params = new URLSearchParams(window.location.search);
  const hash = (window.location.hash || '').replace('#', '').toLowerCase();
  let initialStage = 1;

  if (params.get('stage') === '3' || hash === 'presents' || hash === 'stage3') {
    initialStage = 3;
  } else if (params.get('stage') === '2' || hash === 'stage2') {
    initialStage = 2;
  }

  showStage(initialStage);
});
