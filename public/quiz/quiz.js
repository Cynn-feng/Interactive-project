(function () {
  'use strict';

  var OPTION_KEYS = ['A', 'B', 'C', 'D'];

  var MODE_COPY = {
    zh: {
      easyButton: '简单模式',
      hardButton: '困难模式',
      easyLabel: '简单',
      hardLabel: '困难',
      modeTitle: '模式',
      finished: '本模式题目已完成，做得很好！',
      doneHint: '点击 Restart 可以重新挑战当前模式。',
      incorrect: '回答不对，再试一次。',
      correctPrefix: '正确！',
      incorrectPrefix: '再想想：'
    },
    en: {
      easyButton: 'Easy Mode',
      hardButton: 'Hard Mode',
      easyLabel: 'Easy',
      hardLabel: 'Hard',
      modeTitle: 'Mode',
      finished: 'Quiz complete! Great work.',
      doneHint: 'Press Restart to try this mode again.',
      incorrect: 'Incorrect - try again!',
      correctPrefix: 'Correct!',
      incorrectPrefix: 'Try again:'
    }
  };

  var rawQuestions = [
    {
      mode: 'easy',
      level: 1,
      img: 'images/q1.png',
      zh: {
        text: '如图所示，直径所对的圆周角是多少度？',
        opts: ['45°', '60°', '90°', '120°'],
        exp: '直径所对的圆周角恒为 90°，这是半圆上的圆周角定理。'
      },
      en: {
        text: 'What is the angle subtended by the diameter at the circumference?',
        opts: ['45°', '60°', '90°', '120°'],
        exp: 'The angle in a semicircle is always 90°.'
      },
      ans: 2
    },
    {
      mode: 'easy',
      level: 1,
      img: 'images/q2.png',
      zh: {
        text: '已知圆心角为 110°，同弧所对的圆周角是多少？',
        opts: ['45°', '55°', '110°', '220°'],
        exp: '同弧所对的圆周角等于圆心角的一半，所以是 55°。'
      },
      en: {
        text: 'If the central angle is 110°, what is the inscribed angle subtending the same arc?',
        opts: ['45°', '55°', '110°', '220°'],
        exp: 'An inscribed angle is half the central angle, so it is 55°.'
      },
      ans: 1
    },
    {
      mode: 'easy',
      level: 1,
      img: 'images/q3.png',
      zh: {
        text: '图中两个圆周角都等于 52°，这说明了哪个圆定理？',
        opts: ['对角互补', '同弧所对圆周角相等', '切线垂直于半径', '半径平分弦'],
        exp: '同一弧所对的圆周角相等，这就是“同弧所对圆周角相等”定理。'
      },
      en: {
        text: 'Both inscribed angles in the diagram are 52°. Which circle theorem does this show?',
        opts: ['Opposite angles are supplementary', 'Angles in the same segment are equal', 'A tangent is perpendicular to a radius', 'A radius bisects a chord'],
        exp: 'Angles subtended by the same arc in the same segment are equal.'
      },
      ans: 1
    },
    {
      mode: 'easy',
      level: 2,
      img: 'images/q4.png',
      zh: {
        text: '圆内接四边形的对角之和是多少？',
        opts: ['90°', '180°', '270°', '360°'],
        exp: '圆内接四边形的对角互补，所以和为 180°。'
      },
      en: {
        text: 'What is the sum of opposite angles in a cyclic quadrilateral?',
        opts: ['90°', '180°', '270°', '360°'],
        exp: 'Opposite angles in a cyclic quadrilateral add up to 180°.'
      },
      ans: 1
    },
    {
      mode: 'easy',
      level: 2,
      img: 'images/q5.png',
      zh: {
        text: '切线与过切点的半径所成的角是多少？',
        opts: ['0°', '45°', '90°', '180°'],
        exp: '切线在切点处一定垂直于半径，所以夹角是 90°。'
      },
      en: {
        text: 'What is the angle between a tangent and the radius at the point of contact?',
        opts: ['0°', '45°', '90°', '180°'],
        exp: 'A tangent is perpendicular to the radius at the point of tangency.'
      },
      ans: 2
    },
    {
      mode: 'easy',
      level: 2,
      img: 'images/q6.png',
      zh: {
        text: '从圆心向弦作垂线，这条垂线会怎样处理这条弦？',
        opts: ['平分它', '三等分它', '不一定', '延长成切线'],
        exp: '圆心到弦的垂线会平分这条弦。'
      },
      en: {
        text: 'A perpendicular from the centre to a chord does what to the chord?',
        opts: ['Bisects it', 'Trisects it', 'It depends', 'Turns it into a tangent'],
        exp: 'The perpendicular from the centre to a chord bisects the chord.'
      },
      ans: 0
    },
    {
      mode: 'easy',
      level: 1,
      img: 'images/q11.png',
      zh: {
        text: '图中穿过圆心并连接圆上两点的线段叫什么？',
        opts: ['弦', '切线', '直径', '半径'],
        exp: '穿过圆心并连接圆上两点的线段叫直径。'
      },
      en: {
        text: 'What is the line segment called when it passes through the centre and joins two points on the circle?',
        opts: ['Chord', 'Tangent', 'Diameter', 'Radius'],
        exp: 'A segment through the centre joining two points on the circle is a diameter.'
      },
      ans: 2
    },
    {
      mode: 'easy',
      level: 1,
      img: 'images/q12.png',
      zh: {
        text: '如果一个圆周角是 35°，所对同弧的圆心角是多少？',
        opts: ['35°', '55°', '70°', '105°'],
        exp: '圆心角等于同弧所对圆周角的 2 倍，所以是 70°。这属于一步推理。'
      },
      en: {
        text: 'If an inscribed angle is 35°, what is the central angle subtending the same arc?',
        opts: ['35°', '55°', '70°', '105°'],
        exp: 'The central angle is double the inscribed angle, so it is 70°.'
      },
      ans: 2
    },
    {
      mode: 'easy',
      level: 2,
      img: 'images/q13.png',
      zh: {
        text: '圆内接四边形中，如果一个角是 68°，它的对角是多少？',
        opts: ['68°', '102°', '112°', '122°'],
        exp: '圆内接四边形对角互补，所以另一个角是 180° - 68° = 112°。'
      },
      en: {
        text: 'In a cyclic quadrilateral, if one angle is 68°, what is the opposite angle?',
        opts: ['68°', '102°', '112°', '122°'],
        exp: 'Opposite angles are supplementary, so the opposite angle is 112°.'
      },
      ans: 2
    },
    {
      mode: 'easy',
      level: 2,
      img: 'images/q14.png',
      zh: {
        text: '根据图示，下列哪一句一定正确？',
        opts: ['半径平行于切线', '切线经过圆心', '切线在切点处垂直于半径', '所有弦都是直径'],
        exp: '切线在切点处垂直于半径，这是切线的基本定理。'
      },
      en: {
        text: 'According to the diagram, which statement is always true?',
        opts: ['A radius is parallel to a tangent', 'A tangent passes through the centre', 'A tangent is perpendicular to the radius at the point of contact', 'Every chord is a diameter'],
        exp: 'A tangent is perpendicular to the radius at the point of tangency.'
      },
      ans: 2
    },

    {
      mode: 'hard',
      level: 3,
      img: 'images/q7.png',
      zh: {
        text: '从圆外一点向圆引两条切线，这两条切线的长度关系是？',
        opts: ['相等', '不相等', '互补', '一长一短'],
        exp: '从圆外同一点引出的两条切线长度相等。'
      },
      en: {
        text: 'Two tangents drawn from the same external point to a circle are?',
        opts: ['Equal in length', 'Unequal in length', 'Supplementary', 'One longer than the other'],
        exp: 'Tangents from the same external point are equal in length.'
      },
      ans: 0
    },
    {
      mode: 'hard',
      level: 3,
      img: 'images/q8.png',
      zh: {
        text: '弦切角等于它所夹弧在另一侧所对的什么角？',
        opts: ['圆心角', '圆周角', '直角', '外角'],
        exp: '弦切角等于另一侧同弧所对的圆周角，这是切割线定理。'
      },
      en: {
        text: 'The angle between a tangent and a chord equals which angle on the opposite side of the arc?',
        opts: ['The central angle', 'The inscribed angle', 'A right angle', 'An exterior angle'],
        exp: 'It equals the inscribed angle in the alternate segment.'
      },
      ans: 1
    },
    {
      mode: 'hard',
      level: 3,
      img: 'images/q9.png',
      zh: {
        text: '两圆外切时，圆心距等于什么？',
        opts: ['两半径之差', '两半径之和', '两直径之和', '无法确定'],
        exp: '两圆外切时，圆心距等于两圆半径之和。'
      },
      en: {
        text: 'When two circles are externally tangent, the distance between their centres equals?',
        opts: ['Difference of radii', 'Sum of radii', 'Sum of diameters', 'Cannot be determined'],
        exp: 'For externally tangent circles, the distance between centres is the sum of the radii.'
      },
      ans: 1
    },
    {
      mode: 'hard',
      level: 3,
      img: 'images/q10.png',
      zh: {
        text: '圆的内接正六边形的边长等于圆的什么？',
        opts: ['直径', '半径', '周长的六分之一', '面积的一半'],
        exp: '正六边形每条边都等于圆的半径。'
      },
      en: {
        text: 'The side length of a regular hexagon inscribed in a circle equals the circle’s?',
        opts: ['Diameter', 'Radius', 'One-sixth of circumference', 'Half its area'],
        exp: 'Each side of an inscribed regular hexagon equals the radius.'
      },
      ans: 1
    },
    {
      mode: 'hard',
      level: 2,
      img: 'images/q15.png',
      zh: {
        text: '若圆心到两条弦的距离相等，那么这两条弦怎样？',
        opts: ['长度相等', '一定平行', '一定垂直', '一长一短'],
        exp: '在同圆或等圆中，到圆心距离相等的弦长度相等，这是弦与圆心距离的对应性质。'
      },
      en: {
        text: 'If two chords are the same distance from the centre, what can you conclude?',
        opts: ['They are equal in length', 'They must be parallel', 'They must be perpendicular', 'One must be longer'],
        exp: 'Chords that are equidistant from the centre are equal in length.'
      },
      ans: 0
    },
    {
      mode: 'hard',
      level: 3,
      img: 'images/q16.png',
      zh: {
        text: '若弦切角为 41°，那么另一侧同弧所对的圆周角是多少？',
        opts: ['41°', '49°', '82°', '139°'],
        exp: '根据切割线定理，弦切角等于另一侧同弧所对的圆周角，所以也是 41°。这比直接识记更强调应用。'
      },
      en: {
        text: 'If the angle between a tangent and a chord is 41°, what is the inscribed angle in the alternate segment?',
        opts: ['41°', '49°', '82°', '139°'],
        exp: 'By the alternate segment theorem, the inscribed angle is also 41°.'
      },
      ans: 0
    },
    {
      mode: 'hard',
      level: 3,
      img: 'images/q17.png',
      zh: {
        text: '半径分别为 4 cm 和 9 cm 的两个圆外切时，圆心距是多少？',
        opts: ['5 cm', '9 cm', '13 cm', '18 cm'],
        exp: '外切时圆心距等于两半径之和，所以是 13 cm。这里要求把图形关系转成数值计算。'
      },
      en: {
        text: 'Two circles with radii 4 cm and 9 cm are externally tangent. What is the distance between their centres?',
        opts: ['5 cm', '9 cm', '13 cm', '18 cm'],
        exp: 'Externally tangent circles have centre distance equal to the sum of the radii, so it is 13 cm.'
      },
      ans: 2
    },
    {
      mode: 'hard',
      level: 3,
      img: 'images/q18.png',
      zh: {
        text: '从圆外点 P 引两条切线 PA、PB，若 PA = 12 cm，则 PB = ?',
        opts: ['6 cm', '12 cm', '18 cm', '24 cm'],
        exp: '同一点引出的两条切线长度相等，所以 PB 也等于 12 cm。'
      },
      en: {
        text: 'From an external point P, tangents PA and PB are drawn. If PA = 12 cm, what is PB?',
        opts: ['6 cm', '12 cm', '18 cm', '24 cm'],
        exp: 'Tangents from the same external point are equal, so PB is also 12 cm.'
      },
      ans: 1
    },
    {
      mode: 'hard',
      level: 3,
      img: 'images/q19.png',
      zh: {
        text: '若某圆半径为 8 cm，则其内接正六边形的边长是多少？',
        opts: ['4 cm', '8 cm', '12 cm', '16 cm'],
        exp: '圆内接正六边形的每条边都等于圆半径，所以边长为 8 cm。'
      },
      en: {
        text: 'If a circle has radius 8 cm, what is the side length of a regular hexagon inscribed in it?',
        opts: ['4 cm', '8 cm', '12 cm', '16 cm'],
        exp: 'Each side of an inscribed regular hexagon equals the radius, so the side length is 8 cm.'
      },
      ans: 1
    },
    {
      mode: 'hard',
      level: 3,
      img: 'images/q20.png',
      zh: {
        text: '圆内接四边形中，一个角是 97°，则其对角是多少？',
        opts: ['83°', '87°', '93°', '97°'],
        exp: '对角互补，所以另一个角是 180° - 97° = 83°。困难点在于需要立刻识别出“互补”关系。'
      },
      en: {
        text: 'In a cyclic quadrilateral, one angle is 97°. What is the opposite angle?',
        opts: ['83°', '87°', '93°', '97°'],
        exp: 'Opposite angles are supplementary, so the opposite angle is 83°.'
      },
      ans: 0
    }
  ];

  var state = {
    mode: 'easy',
    order: [],
    index: 0,
    solvedCurrent: false,
    completed: false
  };

  var els = {};

  function getLang() {
    return (window.CircleLab && window.CircleLab.i18n)
      ? window.CircleLab.i18n.getLanguage()
      : 'en';
  }

  function getModeCopy() {
    return getLang() === 'zh' ? MODE_COPY.zh : MODE_COPY.en;
  }

  function getQuestionsForMode() {
    return rawQuestions.filter(function (question) {
      return question.mode === state.mode;
    });
  }

  function getQuestion() {
    var questions = getQuestionsForMode();
    return questions[state.order[state.index]];
  }

  function getLangData(question) {
    return getLang() === 'zh' ? question.zh : question.en;
  }

  function cacheEls() {
    els.progress = document.getElementById('quiz-progress');
    els.modeChipLabel = document.getElementById('quiz-mode-chip-label');
    els.mode = document.getElementById('quiz-mode-label');
    els.level = document.getElementById('quiz-level');
    els.counter = document.getElementById('quiz-question-counter');
    els.question = document.getElementById('quiz-question-text');
    els.image = document.getElementById('quiz-image');
    els.options = document.getElementById('quiz-options');
    els.feedback = document.getElementById('quiz-feedback');
    els.next = document.getElementById('quiz-next');
    els.restart = document.getElementById('quiz-restart');
    els.easyMode = document.getElementById('quiz-mode-easy');
    els.hardMode = document.getElementById('quiz-mode-hard');
    els.modeSwitcherLabel = document.querySelector('.quiz-mode-switcher__label');
  }

  function setFeedback(text, cls) {
    els.feedback.textContent = text;
    els.feedback.className = 'quiz-feedback' + (cls ? ' ' + cls : '');
  }

  function lockOptions(correctIdx, selectedIdx) {
    var buttons = els.options.querySelectorAll('.quiz-option');
    for (var i = 0; i < buttons.length; i += 1) {
      buttons[i].disabled = true;
      if (i === correctIdx) {
        buttons[i].classList.add('quiz-option--correct');
      } else if (i === selectedIdx) {
        buttons[i].classList.add('quiz-option--wrong');
      }
    }
  }

  function setFinishedView() {
    var copy = getModeCopy();
    state.completed = true;
    setFeedback(copy.finished + ' ' + copy.doneHint, 'quiz-feedback--done');
    els.next.classList.add('quiz-btn--hidden');
    els.restart.classList.remove('quiz-btn--hidden');
  }

  function updateModeUI() {
    var copy = getModeCopy();
    var isEasy = state.mode === 'easy';

    if (els.mode) {
      els.mode.textContent = isEasy ? copy.easyLabel : copy.hardLabel;
    }
    if (els.modeChipLabel) {
      els.modeChipLabel.textContent = copy.modeTitle;
    }
    if (els.easyMode) {
      els.easyMode.textContent = copy.easyButton;
      els.easyMode.classList.toggle('is-active', isEasy);
      els.easyMode.setAttribute('aria-pressed', String(isEasy));
    }
    if (els.hardMode) {
      els.hardMode.textContent = copy.hardButton;
      els.hardMode.classList.toggle('is-active', !isEasy);
      els.hardMode.setAttribute('aria-pressed', String(!isEasy));
    }
    if (els.modeSwitcherLabel) {
      els.modeSwitcherLabel.textContent = copy.modeTitle;
    }
  }

  function shuffleOrder() {
    var questions = getQuestionsForMode();
    state.order = questions.map(function (_, index) {
      return index;
    });
    for (var i = state.order.length - 1; i > 0; i -= 1) {
      var swapIndex = Math.floor(Math.random() * (i + 1));
      var temp = state.order[i];
      state.order[i] = state.order[swapIndex];
      state.order[swapIndex] = temp;
    }
  }

  function renderOptions(question) {
    var lang = getLangData(question);

    els.options.innerHTML = '';
    lang.opts.forEach(function (optText, index) {
      var button = document.createElement('button');
      var key = document.createElement('span');
      var text = document.createElement('span');

      button.type = 'button';
      button.className = 'quiz-option';
      button.setAttribute('tabindex', '0');

      key.className = 'quiz-option__key';
      key.textContent = OPTION_KEYS[index];

      text.className = 'quiz-option__text';
      text.textContent = optText;

      button.appendChild(key);
      button.appendChild(text);
      button.addEventListener('click', function () {
        onOptionClick(index);
      });

      els.options.appendChild(button);
    });
  }

  function renderQuestion() {
    if (state.completed) {
      return;
    }

    var questions = getQuestionsForMode();
    var question = getQuestion();
    var lang = getLangData(question);
    var current = state.index + 1;
    var total = questions.length;

    updateModeUI();

    els.progress.textContent = current + ' / ' + total;
    els.counter.textContent = current + ' / ' + total;
    els.level.textContent = String(question.level);
    els.question.textContent = lang.text;
    els.image.src = question.img;
    els.image.alt = lang.text;

    renderOptions(question);

    setFeedback('', '');
    els.next.classList.add('quiz-btn--hidden');
    els.restart.classList.add('quiz-btn--hidden');
    state.solvedCurrent = false;
  }

  function onOptionClick(selectedIdx) {
    if (state.solvedCurrent || state.completed) {
      return;
    }

    var question = getQuestion();
    var lang = getLangData(question);
    var copy = getModeCopy();

    if (selectedIdx === question.ans) {
      state.solvedCurrent = true;
      lockOptions(question.ans, selectedIdx);
      setFeedback(copy.correctPrefix + ' ' + lang.exp, 'quiz-feedback--ok');
      if (state.index < getQuestionsForMode().length - 1) {
        els.next.classList.remove('quiz-btn--hidden');
      } else {
        setFinishedView();
      }
      return;
    }

    setFeedback(copy.incorrectPrefix + ' ' + copy.incorrect, 'quiz-feedback--err');
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

  function switchMode(mode) {
    if (state.mode === mode) {
      return;
    }

    state.mode = mode;
    restartQuiz();
  }

  function onLanguageChange() {
    updateModeUI();

    if (state.completed) {
      setFinishedView();
      return;
    }

    var question = getQuestion();
    var lang = getLangData(question);
    var buttons = els.options.querySelectorAll('.quiz-option__text');

    els.question.textContent = lang.text;
    els.image.alt = lang.text;

    for (var i = 0; i < buttons.length; i += 1) {
      buttons[i].textContent = lang.opts[i];
    }

    if (state.solvedCurrent) {
      setFeedback(getModeCopy().correctPrefix + ' ' + lang.exp, 'quiz-feedback--ok');
    } else if (els.feedback.classList.contains('quiz-feedback--err')) {
      setFeedback(getModeCopy().incorrectPrefix + ' ' + getModeCopy().incorrect, 'quiz-feedback--err');
    }
  }

  function init() {
    cacheEls();

    if (!els.question || !els.options || !els.next || !els.restart || !els.easyMode || !els.hardMode) {
      console.warn('[CircleLabQuiz] Required DOM elements not found.');
      return;
    }

    els.next.addEventListener('click', nextQuestion);
    els.restart.addEventListener('click', restartQuiz);
    els.easyMode.addEventListener('click', function () { switchMode('easy'); });
    els.hardMode.addEventListener('click', function () { switchMode('hard'); });
    document.addEventListener('languagechange', onLanguageChange);

    // Keyboard navigation: A/B/C/D or 1/2/3/4 to select, ArrowUp/Down to move focus, Enter to confirm
    document.addEventListener('keydown', function (e) {
      if (state.solvedCurrent || state.completed) {
        if (e.key === 'Enter' || e.key === 'ArrowRight') {
          var visibleNext = !els.next.classList.contains('quiz-btn--hidden');
          if (visibleNext) nextQuestion();
        }
        return;
      }

      var btns = Array.prototype.slice.call(els.options.querySelectorAll('.quiz-option:not([disabled])'));
      if (!btns.length) return;

      var focused = document.activeElement;
      var focusedIdx = btns.indexOf(focused);

      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        var next = focusedIdx < btns.length - 1 ? focusedIdx + 1 : 0;
        btns[next].focus();
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        var prev = focusedIdx > 0 ? focusedIdx - 1 : btns.length - 1;
        btns[prev].focus();
      } else if (e.key === 'Enter' || e.key === ' ') {
        if (focusedIdx !== -1) {
          e.preventDefault();
          onOptionClick(focusedIdx);
        }
      } else {
        // A/B/C/D or 1/2/3/4 shortcut
        var keyMap = { 'a': 0, 'b': 1, 'c': 2, 'd': 3, '1': 0, '2': 1, '3': 2, '4': 3 };
        var idx = keyMap[e.key.toLowerCase()];
        if (idx !== undefined && idx < btns.length) {
          btns[idx].focus();
          onOptionClick(idx);
        }
      }
    });

    restartQuiz();
  }

  window.CircleLabQuiz = { init: init };
})();
