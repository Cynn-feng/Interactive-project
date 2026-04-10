(function () {
  'use strict';

  // ─── 题目数据 ────────────────────────────────────────────────────────────────
  // level 1 = 基础  level 2 = 进阶  level 3 = 挑战
  var rawQuestions = [
    // Level 1 ─ 基础
    {
      level: 1, img: 'images/q1.png',
      zh: {
        text: '如图所示，直径所对的圆周角是多少度？',
        opts: ['45°', '60°', '90°', '180°'],
        exp: '正确！直径所对的圆周角永远是 90°（半圆上的圆周角定理）。'
      },
      en: {
        text: 'What is the size of the angle subtended by the diameter at the circumference?',
        opts: ['45°', '60°', '90°', '180°'],
        exp: 'Correct! The angle in a semicircle is always 90° (Thales\' Theorem).'
      },
      ans: 2
    },
    {
      level: 1, img: 'images/q2.png',
      zh: {
        text: '已知圆心角为 110°，同弧所对的圆周角是多少？',
        opts: ['55°', '110°', '220°'],
        exp: '正确！圆周角等于圆心角的一半（55°）。'
      },
      en: {
        text: 'If the central angle is 110°, what is the inscribed angle subtending the same arc?',
        opts: ['55°', '110°', '220°'],
        exp: 'Correct! The inscribed angle is half the central angle (55°).'
      },
      ans: 0
    },
    {
      level: 1, img: 'images/q3.png',
      zh: {
        text: '图中两个角都是 52°，这说明了哪个圆定理？',
        opts: ['对角互补', '同弧所对圆周角相等', '切线垂直于半径'],
        exp: '正确！同一弧所对的圆周角相等。'
      },
      en: {
        text: 'Both angles in the diagram are 52°. Which circle theorem does this demonstrate?',
        opts: ['Opposite angles are supplementary', 'Angles in the same segment are equal', 'Tangent is perpendicular to radius'],
        exp: 'Correct! Angles subtended by the same arc in the same segment are equal.'
      },
      ans: 1
    },
    // Level 2 ─ 进阶
    {
      level: 2, img: 'images/q4.png',
      zh: {
        text: '圆内接四边形的对角之和是多少？',
        opts: ['90°', '180°', '360°'],
        exp: '正确！圆内接四边形的对角互补，之和为 180°。'
      },
      en: {
        text: 'What is the sum of opposite angles in a cyclic quadrilateral?',
        opts: ['90°', '180°', '360°'],
        exp: 'Correct! Opposite angles in a cyclic quadrilateral are supplementary (sum to 180°).'
      },
      ans: 1
    },
    {
      level: 2, img: 'images/q5.png',
      zh: {
        text: '切线与过切点的半径成多少度角？',
        opts: ['0°', '45°', '90°'],
        exp: '正确！切线总是垂直于过切点的半径（切线-半径定理）。'
      },
      en: {
        text: 'What is the angle between a tangent and the radius at the point of contact?',
        opts: ['0°', '45°', '90°'],
        exp: 'Correct! A tangent is always perpendicular to the radius at the point of tangency.'
      },
      ans: 2
    },
    {
      level: 2, img: 'images/q6.png',
      zh: {
        text: '从圆心向弦作垂线，该垂线会如何处理这条弦？',
        opts: ['平分', '三等分', '不确定'],
        exp: '正确！圆心到弦的垂线平分该弦（垂径定理）。'
      },
      en: {
        text: 'A perpendicular line from the centre to a chord will do what to the chord?',
        opts: ['Bisect it', 'Trisect it', 'It depends'],
        exp: 'Correct! The perpendicular from the centre to a chord bisects the chord.'
      },
      ans: 0
    },
    // Level 3 ─ 挑战
    {
      level: 3, img: 'images/q7.png',
      zh: {
        text: '从圆外一点向圆引两条切线，这两条切线的长度关系是？',
        opts: ['相等', '不相等', '互补'],
        exp: '正确！从圆外同一点引出的两条切线长度相等（等切线定理）。'
      },
      en: {
        text: 'Two tangents drawn from the same external point to a circle are?',
        opts: ['Equal in length', 'Unequal in length', 'Supplementary'],
        exp: 'Correct! Tangent lines from an external point are equal in length.'
      },
      ans: 0
    },
    {
      level: 3, img: 'images/q8.png',
      zh: {
        text: '弦切角等于它所夹弧在另一侧所对的什么角？',
        opts: ['圆心角', '圆周角（交错弓形角）', '直角'],
        exp: '正确！这是切割线定理（交错弓形角定理）。'
      },
      en: {
        text: 'The angle between a tangent and a chord equals the inscribed angle in the?',
        opts: ['Same segment', 'Alternate segment', 'Opposite arc'],
        exp: 'Correct! This is the Alternate Segment Theorem (Tangent-Chord angle).'
      },
      ans: 1
    },
    {
      level: 3, img: 'images/q9.png',
      zh: {
        text: '两圆外切时，圆心距等于？',
        opts: ['两半径之差', '两半径之和', '无法确定'],
        exp: '正确！外切时两圆圆心之间的距离等于两半径之和。'
      },
      en: {
        text: 'When two circles are externally tangent, the distance between their centres equals?',
        opts: ['Difference of radii', 'Sum of radii', 'Cannot be determined'],
        exp: 'Correct! For externally tangent circles, the distance between centres equals the sum of their radii.'
      },
      ans: 1
    },
    {
      level: 3, img: 'images/q10.png',
      zh: {
        text: '圆的内接正六边形的边长等于圆的什么？',
        opts: ['直径', '半径', '周长的六分之一'],
        exp: '正确！内接正六边形的边长恰好等于圆的半径。'
      },
      en: {
        text: 'The side length of a regular hexagon inscribed in a circle equals the circle\'s?',
        opts: ['Diameter', 'Radius', 'One-sixth of circumference'],
        exp: 'Correct! Each side of an inscribed regular hexagon equals the radius of the circle.'
      },
      ans: 1
    }
  ];

  // ─── 状态 ────────────────────────────────────────────────────────────────────
  var state = {
    order: [],
    index: 0,
    solvedCurrent: false,
    completed: false
  };

  var els = {};

  // ─── i18n 辅助 ───────────────────────────────────────────────────────────────
  function getLang() {
    return (window.CircleLab && window.CircleLab.i18n)
      ? window.CircleLab.i18n.getLanguage()
      : 'en';
  }

  function t(key, fallback) {
    if (window.CircleLab && window.CircleLab.i18n && typeof window.CircleLab.i18n.t === 'function') {
      var val = window.CircleLab.i18n.t(key);
      // 如果 key 没找到翻译，i18n.t 会原样返回 key，此时用 fallback
      return (val && val !== key) ? val : (fallback || key);
    }
    return fallback || key;
  }

  // ─── DOM 缓存 ────────────────────────────────────────────────────────────────
  function cacheEls() {
    els.progress = document.getElementById('quiz-progress');
    els.level    = document.getElementById('quiz-level');
    els.counter  = document.getElementById('quiz-question-counter');
    els.question = document.getElementById('quiz-question-text');
    els.image    = document.getElementById('quiz-image');
    els.options  = document.getElementById('quiz-options');
    els.feedback = document.getElementById('quiz-feedback');
    els.next     = document.getElementById('quiz-next');
    els.restart  = document.getElementById('quiz-restart');
  }

  // ─── 题目顺序随机化（Fisher-Yates） ─────────────────────────────────────────
  function shuffleOrder() {
    state.order = rawQuestions.map(function (_, i) { return i; });
    for (var j = state.order.length - 1; j > 0; j--) {
      var k = Math.floor(Math.random() * (j + 1));
      var tmp = state.order[j];
      state.order[j] = state.order[k];
      state.order[k] = tmp;
    }
  }

  function getQuestion() {
    return rawQuestions[state.order[state.index]];
  }

  function getLangData(q) {
    return getLang() === 'zh' ? q.zh : q.en;
  }

  // ─── 反馈显示 ────────────────────────────────────────────────────────────────
  function setFeedback(text, cls) {
    els.feedback.textContent = text;
    els.feedback.className = 'quiz-feedback' + (cls ? ' ' + cls : '');
  }

  // ─── 选项状态（答对/答错着色）────────────────────────────────────────────────
  function lockOptions(correctIdx, selectedIdx) {
    var buttons = els.options.querySelectorAll('.quiz-option');
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].disabled = true;
      if (i === correctIdx) {
        buttons[i].classList.add('quiz-option--correct');
      } else if (i === selectedIdx) {
        buttons[i].classList.add('quiz-option--wrong');
      }
    }
  }

  // ─── 完成状态 ────────────────────────────────────────────────────────────────
  function setFinishedView() {
    state.completed = true;
    var msg = t('quiz.finished', 'Quiz complete! Great work.')
              + ' '
              + t('quiz.doneHint', 'Press Restart to try again with a new order.');
    setFeedback(msg, 'quiz-feedback--done');
    els.next.classList.add('quiz-btn--hidden');
    els.restart.classList.remove('quiz-btn--hidden');
  }

  // ─── 渲染题目 ────────────────────────────────────────────────────────────────
  function renderQuestion() {
    if (state.completed) return;

    var q    = getQuestion();
    var lang = getLangData(q);
    var num  = state.index + 1;
    var total = rawQuestions.length;

    // 进度
    els.progress.textContent = num + ' / ' + total;
    els.counter.textContent  = num + ' / ' + total;
    els.level.textContent    = String(q.level);

    // 题目与图片
    els.question.textContent = lang.text;
    els.image.src = q.img;
    els.image.alt = lang.text;

    // 选项
    els.options.innerHTML = '';
    lang.opts.forEach(function (optText, i) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'quiz-option';
      btn.textContent = optText;
      btn.addEventListener('click', function () { onOptionClick(i); });
      els.options.appendChild(btn);
    });

    // 重置状态
    setFeedback('', '');
    els.next.classList.add('quiz-btn--hidden');
    els.restart.classList.add('quiz-btn--hidden');
    state.solvedCurrent = false;
  }

  // ─── 点击选项 ────────────────────────────────────────────────────────────────
  function onOptionClick(idx) {
    if (state.solvedCurrent || state.completed) return;

    var q    = getQuestion();
    var lang = getLangData(q);

    if (idx === q.ans) {
      state.solvedCurrent = true;
      lockOptions(q.ans, idx);
      setFeedback('✅ ' + lang.exp, 'quiz-feedback--ok');
      if (state.index < rawQuestions.length - 1) {
        els.next.classList.remove('quiz-btn--hidden');
      } else {
        setFinishedView();
      }
    } else {
      setFeedback('❌ ' + t('quiz.incorrect', 'Incorrect — try again!'), 'quiz-feedback--err');
    }
  }

  // ─── 下一题 ──────────────────────────────────────────────────────────────────
  function nextQuestion() {
    if (!state.solvedCurrent || state.completed) return;
    state.index += 1;
    renderQuestion();
  }

  // ─── 重新开始 ────────────────────────────────────────────────────────────────
  function restartQuiz() {
    state.index = 0;
    state.solvedCurrent = false;
    state.completed = false;
    shuffleOrder();
    renderQuestion();
  }

  // ─── 语言切换时同步更新题目文字和选项 ───────────────────────────────────────
  function onLanguageChange() {
    if (state.completed) {
      var msg = t('quiz.finished', 'Quiz complete! Great work.')
                + ' '
                + t('quiz.doneHint', 'Press Restart to try again with a new order.');
      setFeedback(msg, 'quiz-feedback--done');
      return;
    }

    var q    = getQuestion();
    var lang = getLangData(q);

    els.question.textContent = lang.text;
    els.image.alt = lang.text;

    var buttons = els.options.querySelectorAll('.quiz-option');
    for (var i = 0; i < buttons.length; i++) {
      if (lang.opts[i] !== undefined) {
        buttons[i].textContent = lang.opts[i];
      }
    }

    if (state.solvedCurrent) {
      setFeedback('✅ ' + lang.exp, 'quiz-feedback--ok');
    } else if (els.feedback.classList.contains('quiz-feedback--err')) {
      setFeedback('❌ ' + t('quiz.incorrect', 'Incorrect — try again!'), 'quiz-feedback--err');
    }
  }

  // ─── 初始化 ──────────────────────────────────────────────────────────────────
  function init() {
    cacheEls();

    // 必要元素检查
    if (!els.question || !els.options || !els.next || !els.restart) {
      console.warn('[CircleLabQuiz] Required DOM elements not found.');
      return;
    }

    els.next.addEventListener('click', nextQuestion);
    els.restart.addEventListener('click', restartQuiz);
    document.addEventListener('languagechange', onLanguageChange);

    restartQuiz();
  }

  // ─── 公开 API ────────────────────────────────────────────────────────────────
  window.CircleLabQuiz = { init: init };

})();
