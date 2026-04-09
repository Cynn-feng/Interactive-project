(function () {
  'use strict';

  var rawQuestions = [
    // --- Level 1: 基础 (组长原题 + 补充) ---
    {
      level: 1, img: 'images/q1.png',
      zh: { text: '直径所对的圆周角是多少度？', opts: ['45°', '60°', '90°', '180°'], exp: '正确！直径所对的圆周角永远是 90°。' },
      en: { text: 'What is the angle subtended by a diameter?', opts: ['45°', '60°', '90°', '180°'], exp: 'Correct! Angle in a semicircle is 90°.' },
      ans: 2
    },
    {
      level: 1, img: 'images/q2.png',
      zh: { text: '已知圆心角为 110°，同弧圆周角是多少？', opts: ['55°', '110°', '220°'], exp: '正确！圆周角是圆心角的一半。' },
      en: { text: 'If the center angle is 110°, the circumference angle is?', opts: ['55°', '110°', '220°'], exp: 'Correct! Angle at circumference is half of center angle.' },
      ans: 0
    },
    {
      level: 1, img: 'images/q3.png',
      zh: { text: '同弧所对的两个圆周角的关系是？', opts: ['互补', '相等', '互余'], exp: '正确！同弧所对的圆周角相等。' },
      en: { text: 'Angles subtended by the same arc are?', opts: ['Equal', 'Supplementary', 'Complementary'], exp: 'Correct! Angles in the same segment are equal.' },
      ans: 0
    },
    // --- Level 2: 进阶 ---
    {
      level: 2, img: 'images/q4.png',
      zh: { text: '圆内接四边形的对角之和是多少？', opts: ['90°', '180°', '360°'], exp: '正确！对角互补（180°）。' },
      en: { text: 'Sum of opposite angles in a cyclic quadrilateral?', opts: ['90°', '180°', '360°'], exp: 'Correct! Opposite angles sum to 180°.' },
      ans: 1
    },
    {
      level: 2, img: 'images/q5.png',
      zh: { text: '切线与过切点的半径成多少度角？', opts: ['0°', '45°', '90°'], exp: '正确！切线垂直于半径。' },
      en: { text: 'Angle between tangent and radius at contact point?', opts: ['0°', '45°', '90°'], exp: 'Correct! Tangent is perpendicular to radius.' },
      ans: 2
    },
    {
      level: 2, img: 'images/q6.png',
      zh: { text: '垂直于弦的直径会如何处理该弦？', opts: ['平分', '三等分', '不确定'], exp: '正确！垂直于弦的直径平分该弦。' },
      en: { text: 'A perpendicular line from center to a chord will?', opts: ['Bisect', 'Trisect', 'Uncertain'], exp: 'Correct! It bisects the chord.' },
      ans: 0
    },
    // --- Level 3: 挑战 ---
    {
      level: 3, img: 'images/q7.png',
      zh: { text: '从圆外一点向圆引两条切线，这两条切线的长度关系是？', opts: ['相等', '不等', '互补'], exp: '正确！从圆外一点引出的两条切线长相等。' },
      en: { text: 'Lengths of two tangents from an external point are?', opts: ['Equal', 'Unequal', 'Supplementary'], exp: 'Correct! Tangents from a point are equal.' },
      ans: 0
    },
    {
      level: 3, img: 'images/q8.png',
      zh: { text: '弦切角等于它所夹弧对的什么角？', opts: ['圆心角', '圆周角', '直角'], exp: '正确！弦切角定理。' },
      en: { text: 'Angle between tangent and chord equals angle in?', opts: ['Center', 'Alternate segment', 'Right angle'], exp: 'Correct! Alternate segment theorem.' },
      ans: 1
    },
    {
      level: 3, img: 'images/q9.png',
      zh: { text: '两圆外切时，圆心距等于？', opts: ['半径之差', '半径之和', '不确定'], exp: '正确！外切时圆心距等于半径之和。' },
      en: { text: 'Distance between centers of two externally touching circles?', opts: ['Difference', 'Sum', 'Uncertain'], exp: 'Correct! It equals sum of radii.' },
      ans: 1
    },
    {
      level: 3, img: 'images/q10.png',
      zh: { text: '圆的内接正六边形的边长等于圆的？', opts: ['直径', '半径', '周长的一半'], exp: '正确！等于半径。' },
      en: { text: 'Side length of an inscribed regular hexagon equals?', opts: ['Diameter', 'Radius', 'Half circumference'], exp: 'Correct! It equals the radius.' },
      ans: 1
    }
  ];

  // 状态与逻辑逻辑保持组长原样
  var state = { order: [], index: 0, solvedCurrent: false, completed: false };
  var els = {};
  function t(k, f) { return (window.CircleLab && window.CircleLab.i18n) ? window.CircleLab.i18n.t(k) : f; }
  function getLang() { return (window.CircleLab && window.CircleLab.i18n) ? window.CircleLab.i18n.getLanguage() : 'en'; }
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
    for (var i = 0; i < rawQuestions.length; i++) state.order.push(i);
    for (var j = state.order.length - 1; j > 0; j--) {
      var k = Math.floor(Math.random() * (j + 1));
      var temp = state.order[j]; state.order[j] = state.order[k]; state.order[k] = temp;
    }
  }
  function getQuestion() { return rawQuestions[state.order[state.index]]; }
  function currentLangData(q) { return getLang() === 'zh' ? q.zh : q.en; }
  function setFeedback(t, c) { els.feedback.textContent = t; els.feedback.className = 'quiz-feedback ' + (c || ''); }
  function renderQuestion() {
    if (state.completed) return;
    var q = getQuestion(); var text = currentLangData(q);
    els.progress.textContent = (state.index + 1) + ' / ' + rawQuestions.length;
    els.counter.textContent = (state.index + 1) + ' / ' + rawQuestions.length;
    els.level.textContent = q.level;
    els.question.textContent = text.text;
    els.image.src = q.img;
    els.options.innerHTML = '';
    text.opts.forEach((opt, i) => {
      var btn = document.createElement('button');
      btn.className = 'quiz-option'; btn.textContent = opt;
      btn.onclick = () => {
        if (state.solvedCurrent) return;
        if (i === q.ans) {
          state.solvedCurrent = true;
          setFeedback('✅ ' + text.exp, 'quiz-feedback--ok');
          if (state.index < rawQuestions.length - 1) els.next.classList.remove('quiz-btn--hidden');
          else { state.completed = true; setFeedback(t('quiz.finished', 'Finished!'), 'quiz-feedback--done'); els.restart.classList.remove('quiz-btn--hidden'); }
        } else setFeedback('❌ ' + t('quiz.incorrect', 'Try again!'), 'quiz-feedback--err');
      };
      els.options.appendChild(btn);
    });
    els.next.classList.add('quiz-btn--hidden');
    els.restart.classList.add('quiz-btn--hidden');
    state.solvedCurrent = false;
  }
  function init() {
    cacheEls();
    els.next.onclick = () => { state.index++; renderQuestion(); };
    els.restart.onclick = () => { state.index = 0; state.completed = false; shuffleOrder(); renderQuestion(); };
    shuffleOrder(); renderQuestion();
  }
  window.CircleLabQuiz = { init: init };
})();
