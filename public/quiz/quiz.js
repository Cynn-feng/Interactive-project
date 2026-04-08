(function () {
  'use strict';

  var rawQuestions = [
    {
      level: 1,
      img: 'images/q1.png',
      zh: {
        text: '如图 q1 所示，直径所对的圆周角是多少度？',
        opts: ['45°', '60°', '90°', '180°'],
        exp: '正确！直径所对的圆周角永远是 90°。'
      },
      en: {
        text: 'In q1, what is the size of the angle subtended by the diameter?',
        opts: ['45°', '60°', '90°', '180°'],
        exp: 'Correct! Angle in a semicircle is always 90°.'
      },
      ans: 2
    },
    {
      level: 1,
      img: 'images/q2.png',
      zh: {
        text: '观察 q2，已知圆心角为 110°，其对应的圆周角是多少？',
        opts: ['55°', '110°', '220°'],
        exp: '正确！同弧所对圆周角等于圆心角的一半。'
      },
      en: {
        text: 'In q2, if the center angle is 110°, what is the angle at the circumference?',
        opts: ['55°', '110°', '220°'],
        exp: 'Correct! The angle at the center is twice the angle at the circumference.'
      },
      ans: 0
    },
    {
      level: 2,
      img: 'images/q3.png',
      zh: {
        text: '图 q3 展示了两个 52° 的角，这证明了什么定理？',
        opts: ['对角互补', '同弧所对圆周角相等', '切线垂直于半径'],
        exp: '正确！同弧所对的圆周角相等。'
      },
      en: {
        text: 'What theorem does q3 demonstrate with the two 52° angles?',
        opts: ['Cyclic quadrilateral theorem', 'Angles in the same segment are equal', 'Tangent-radius theorem'],
        exp: 'Correct! Angles subtended by the same arc are equal.'
      },
      ans: 1
    },
    {
      level: 2,
      img: 'images/q4.png',
      zh: {
        text: '看图 q4，圆内接四边形的对角（如 99° 和 81°）之和是多少？',
        opts: ['90°', '180°', '360°'],
        exp: '正确！圆内接四边形对角互补。'
      },
      en: {
        text: 'In q4, what is the sum of opposite angles in this cyclic quadrilateral?',
        opts: ['90°', '180°', '360°'],
        exp: 'Correct! Opposite angles in a cyclic quadrilateral sum to 180°.'
      },
      ans: 1
    }
  ];

  var state = {
    order: [],
    index: 0,
    solvedCurrent: false,
    completed: false
  };

  var els = {};

  function t(key, fallback) {
    if (window.CircleLab && window.CircleLab.i18n && typeof window.CircleLab.i18n.t === 'function') {
      return window.CircleLab.i18n.t(key);
    }
    return fallback || key;
  }

  function getLang() {
    if (window.CircleLab && window.CircleLab.i18n && typeof window.CircleLab.i18n.getLanguage === 'function') {
      return window.CircleLab.i18n.getLanguage();
    }
    return 'en';
  }

  function cacheEls() {
    els.progress = document.getElementById('quiz-progress');
    els.level = document.getElementById('quiz-level');
    els.counter = document.getElementById('quiz-question-counter');
    els.question = document.getElementById('quiz-question-text');
    els.image = document.getElementById('quiz-image');
    els.options = document.getElementById('quiz-options');
    els.feedback = document.getElementById('quiz-feedback');
    els.next = document.getElementById('quiz-next');
    els.restart = document.getElementById('quiz-restart');
  }

  function shuffleOrder() {
    state.order = [];
    for (var i = 0; i < rawQuestions.length; i++) {
      state.order.push(i);
    }
    for (var j = state.order.length - 1; j > 0; j--) {
      var k = Math.floor(Math.random() * (j + 1));
      var temp = state.order[j];
      state.order[j] = state.order[k];
      state.order[k] = temp;
    }
  }

  function getQuestion() {
    var idx = state.order[state.index];
    return rawQuestions[idx];
  }

  function currentLangData(question) {
    return getLang() === 'zh' ? question.zh : question.en;
  }

  function setFeedback(text, cls) {
    els.feedback.textContent = text;
    els.feedback.className = 'quiz-feedback';
    if (cls) {
      els.feedback.classList.add(cls);
    }
  }

  function hideNext() {
    els.next.classList.add('quiz-btn--hidden');
  }

  function showNext() {
    els.next.classList.remove('quiz-btn--hidden');
  }

  function setFinishedView() {
    state.completed = true;
    setFeedback(t('finished', 'Quiz finished! Great work.') + ' ' + t('doneHint', 'You can restart to practice with a new order.'), 'quiz-feedback--done');
    hideNext();
    els.restart.classList.remove('quiz-btn--hidden');
  }

  function setOptionState(answerIndex, selectedIndex) {
    var buttons = els.options.querySelectorAll('.quiz-option');
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].disabled = true;
      if (i === answerIndex) {
        buttons[i].classList.add('quiz-option--correct');
      } else if (selectedIndex === i) {
        buttons[i].classList.add('quiz-option--wrong');
      }
    }
  }

  function renderQuestion() {
    if (state.completed) {
      return;
    }
    var q = getQuestion();
    var text = currentLangData(q);

    els.progress.textContent = (state.index + 1) + ' / ' + rawQuestions.length;
    els.counter.textContent = (state.index + 1) + ' / ' + rawQuestions.length;
    els.level.textContent = String(q.level);
    els.question.textContent = text.text;
    els.image.src = q.img;
    els.image.alt = text.text;
    els.options.innerHTML = '';

    for (var i = 0; i < text.opts.length; i++) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'quiz-option';
      btn.textContent = text.opts[i];
      bindOption(btn, i);
      els.options.appendChild(btn);
    }

    hideNext();
    els.restart.classList.add('quiz-btn--hidden');
    setFeedback('', '');
    state.solvedCurrent = false;
  }

  function bindOption(btn, idx) {
    btn.addEventListener('click', function () {
      if (state.solvedCurrent || state.completed) {
        return;
      }
      var q = getQuestion();
      var text = currentLangData(q);
      if (idx === q.ans) {
        state.solvedCurrent = true;
        setOptionState(q.ans, idx);
        setFeedback('✅ ' + text.exp, 'quiz-feedback--ok');
        if (state.index < rawQuestions.length - 1) {
          showNext();
        } else {
          setFinishedView();
        }
      } else {
        setFeedback('❌ ' + t('incorrect', 'Incorrect, try again.'), 'quiz-feedback--err');
      }
    });
  }

  function nextQuestion() {
    if (!state.solvedCurrent || state.completed) {
      return;
    }
    state.index += 1;
    renderQuestion();
  }

  function restartQuiz() {
    state.index = 0;
    state.solvedCurrent = false;
    state.completed = false;
    shuffleOrder();
    renderQuestion();
  }

  function onLanguageChange() {
    if (state.completed) {
      setFeedback(t('finished', 'Quiz finished! Great work.') + ' ' + t('doneHint', 'You can restart to practice with a new order.'), 'quiz-feedback--done');
      return;
    }

    var q = getQuestion();
    var langPack = currentLangData(q);
    els.question.textContent = langPack.text;
    els.image.alt = langPack.text;

    var buttons = els.options.querySelectorAll('.quiz-option');
    for (var i = 0; i < buttons.length; i++) {
      if (langPack.opts[i]) {
        buttons[i].textContent = langPack.opts[i];
      }
    }

    if (state.solvedCurrent) {
      setFeedback('✅ ' + langPack.exp, 'quiz-feedback--ok');
    } else if (els.feedback.classList.contains('quiz-feedback--err')) {
      setFeedback('❌ ' + t('incorrect', 'Incorrect, try again.'), 'quiz-feedback--err');
    }
  }

  function init() {
    cacheEls();
    if (!els.question || !els.options || !els.next || !els.restart) {
      return;
    }

    els.next.addEventListener('click', nextQuestion);
    els.restart.addEventListener('click', restartQuiz);
    document.addEventListener('languagechange', onLanguageChange);

    restartQuiz();
  }

  window.CircleLabQuiz = {
    init: init
  };
})();
