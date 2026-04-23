(function () {
  'use strict';

  var OPTION_KEYS = ['A', 'B', 'C', 'D'];
  var QUIZ_LENGTH = 10;
  var POINTS_PER_QUESTION = 10;
  var MAX_SCORE = QUIZ_LENGTH * POINTS_PER_QUESTION;
  var rawQuestions = (window.CircleLabQuizData && window.CircleLabQuizData.questions) || [];

  var MODE_COPY = {
    zh: {
      easyButton: '简单模式',
      hardButton: '困难模式',
      easyLabel: '简单',
      hardLabel: '困难',
      modeTitle: '模式',
      scoreTitle: '得分',
      nextLabel: '下一题',
      finishLabel: '完成测验',
      finished: '本模式题目已完成，做得很不错！',
      doneHint: '点击 Restart 可以重新挑战当前模式。',
      incorrect: '回答不对。',
      lateCorrectNotice: '这题之前答错过，所以本题得分仍为 0。',
      correctPrefix: '回答正确：'
    },
    en: {
      easyButton: 'Easy Mode',
      hardButton: 'Hard Mode',
      easyLabel: 'Easy',
      hardLabel: 'Hard',
      modeTitle: 'Mode',
      scoreTitle: 'Score',
      nextLabel: 'Next Question',
      finishLabel: 'Finish Quiz',
      finished: 'Quiz complete! Great work.',
      doneHint: 'Press Restart to try this mode again.',
      incorrect: 'Incorrect.',
      lateCorrectNotice: 'This question stays at 0 points because there was an earlier wrong attempt.',
      correctPrefix: 'Correct!'
    }
  };

  var state = {
    mode: 'easy',
    order: [],
    index: 0,
    score: {
      easy: 0,
      hard: 0
    },
    solvedCurrent: false,
    currentHadWrongAttempt: false,
    currentResult: null,
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

  function getQuizTotal() {
    return state.order.length;
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
    els.scoreChipLabel = document.getElementById('quiz-score-chip-label');
    els.score = document.getElementById('quiz-score');
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

  function getScore() {
    return state.score[state.mode];
  }

  function updateScoreUI() {
    if (els.score) {
      els.score.textContent = getScore() + ' / ' + MAX_SCORE;
    }
  }

  function canAdvanceCurrent() {
    return state.currentHadWrongAttempt || state.currentResult === 'correct';
  }

  function clearOptionState() {
    var buttons = els.options.querySelectorAll('.quiz-option');
    for (var i = 0; i < buttons.length; i += 1) {
      buttons[i].classList.remove('quiz-option--wrong');
      buttons[i].classList.remove('quiz-option--correct');
      buttons[i].disabled = false;
    }
  }

  function markWrongAttempt(selectedIdx) {
    var buttons = els.options.querySelectorAll('.quiz-option');
    clearOptionState();
    if (buttons[selectedIdx]) {
      buttons[selectedIdx].classList.add('quiz-option--wrong');
    }
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

  function updateAdvanceButton() {
    var copy = getModeCopy();
    if (state.index < getQuizTotal() - 1) {
      els.next.textContent = copy.nextLabel;
    } else {
      els.next.textContent = copy.finishLabel;
    }
  }

  function setFinishedView() {
    var copy = getModeCopy();
    state.completed = true;
    setFeedback(copy.finished + ' ' + copy.scoreTitle + ': ' + getScore() + ' / ' + MAX_SCORE + '. ' + copy.doneHint, 'quiz-feedback--done');
    els.next.classList.add('quiz-btn--hidden');
    els.restart.classList.remove('quiz-btn--hidden');
  }

  function updateModeUI() {
    var copy = getModeCopy();
    var isEasy = state.mode === 'easy';

    els.mode.textContent = isEasy ? copy.easyLabel : copy.hardLabel;
    els.modeChipLabel.textContent = copy.modeTitle;
    els.scoreChipLabel.textContent = copy.scoreTitle;
    els.easyMode.textContent = copy.easyButton;
    els.hardMode.textContent = copy.hardButton;
    els.easyMode.classList.toggle('is-active', isEasy);
    els.hardMode.classList.toggle('is-active', !isEasy);
    els.easyMode.setAttribute('aria-pressed', String(isEasy));
    els.hardMode.setAttribute('aria-pressed', String(!isEasy));
    if (els.modeSwitcherLabel) {
      els.modeSwitcherLabel.textContent = copy.modeTitle;
    }
  }

  function buildRandomOrder() {
    var questions = getQuestionsForMode();
    var indices = questions.map(function (_, index) {
      return index;
    });
    var i;

    for (i = indices.length - 1; i > 0; i -= 1) {
      var swapIndex = Math.floor(Math.random() * (i + 1));
      var temp = indices[i];
      indices[i] = indices[swapIndex];
      indices[swapIndex] = temp;
    }

    state.order = indices.slice(0, Math.min(QUIZ_LENGTH, indices.length));
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

    var question = getQuestion();
    var lang = getLangData(question);
    var current = state.index + 1;
    var total = getQuizTotal();

    updateModeUI();
    updateScoreUI();

    els.progress.textContent = current + ' / ' + total;
    els.counter.textContent = current + ' / ' + total;
    els.level.textContent = String(question.level);
    els.question.textContent = lang.text;
    els.image.src = question.img;
    els.image.alt = lang.text;

    renderOptions(question);
    updateAdvanceButton();

    setFeedback('', '');
    els.next.classList.add('quiz-btn--hidden');
    els.restart.classList.add('quiz-btn--hidden');
    state.solvedCurrent = false;
    state.currentHadWrongAttempt = false;
    state.currentResult = null;
  }

  function onOptionClick(selectedIdx) {
    if (state.completed || state.currentResult === 'correct') {
      return;
    }

    var question = getQuestion();
    var lang = getLangData(question);
    var copy = getModeCopy();

    if (selectedIdx === question.ans) {
      state.currentResult = 'correct';
      state.solvedCurrent = true;
      if (!state.currentHadWrongAttempt) {
        state.score[state.mode] += POINTS_PER_QUESTION;
      }
      lockOptions(question.ans, selectedIdx);
      updateScoreUI();
      if (state.currentHadWrongAttempt) {
        setFeedback(copy.correctPrefix + ' ' + lang.exp + ' ' + copy.lateCorrectNotice, 'quiz-feedback--ok');
      } else {
        setFeedback(copy.correctPrefix + ' ' + lang.exp, 'quiz-feedback--ok');
      }
    } else {
      state.currentHadWrongAttempt = true;
      state.currentResult = 'wrong';
      state.solvedCurrent = false;
      markWrongAttempt(selectedIdx);
      setFeedback(copy.incorrect + ' ' + lang.exp, 'quiz-feedback--err');
    }

    els.next.classList.remove('quiz-btn--hidden');
  }

  function nextQuestion() {
    if (!canAdvanceCurrent() || state.completed) {
      return;
    }

    if (state.index >= getQuizTotal() - 1) {
      setFinishedView();
      return;
    }

    state.index += 1;
    renderQuestion();
  }

  function restartQuiz() {
    state.index = 0;
    state.score[state.mode] = 0;
    state.solvedCurrent = false;
    state.currentHadWrongAttempt = false;
    state.currentResult = null;
    state.completed = false;
    buildRandomOrder();
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
    var i;

    els.question.textContent = lang.text;
    els.image.alt = lang.text;

    for (i = 0; i < buttons.length; i += 1) {
      buttons[i].textContent = lang.opts[i];
    }

    updateAdvanceButton();

    if (state.currentResult === 'correct') {
      if (state.currentHadWrongAttempt) {
        setFeedback(getModeCopy().correctPrefix + ' ' + lang.exp + ' ' + getModeCopy().lateCorrectNotice, 'quiz-feedback--ok');
      } else {
        setFeedback(getModeCopy().correctPrefix + ' ' + lang.exp, 'quiz-feedback--ok');
      }
    } else if (state.currentResult === 'wrong') {
      setFeedback(getModeCopy().incorrect + ' ' + lang.exp, 'quiz-feedback--err');
    }

    updateScoreUI();
  }

  function init() {
    cacheEls();

    if (!els.question || !els.options || !els.next || !els.restart || !els.easyMode || !els.hardMode || !rawQuestions.length) {
      console.warn('[CircleLabQuiz] Required data or DOM elements not found.');
      return;
    }

    els.next.addEventListener('click', nextQuestion);
    els.restart.addEventListener('click', restartQuiz);
    els.easyMode.addEventListener('click', function () {
      switchMode('easy');
    });
    els.hardMode.addEventListener('click', function () {
      switchMode('hard');
    });
    document.addEventListener('languagechange', onLanguageChange);

    restartQuiz();
  }

  window.CircleLabQuiz = { init: init };
})();
