(function () {
  'use strict';

  var STORAGE_KEY = 'circlelab-game-hub';
  var SOUND = { enabled: true };
  var hub = loadHub();

  var tabs = [];
  var panels = {};
  var soundToggleBtn = null;

  var angleState = {
    running: false,
    paused: false,
    difficulty: 'easy',
    questionIndex: 0,
    totalQuestions: 8,
    score: 0,
    streak: 0,
    bestStreak: 0,
    current: null,
    timeLeft: 0,
    timerId: null,
  };

  var matcherState = {
    running: false,
    paused: false,
    score: 0,
    matches: 0,
    selectedDiagram: null,
    selectedName: null,
    matched: {},
    nameOrder: [],
    timeLeft: 0,
    timerId: null,
  };

  var constructorState = {
    running: false,
    score: 0,
    index: 0,
    points: [],
    solvedCurrent: false,
  };

  var angleEls = {};
  var matcherEls = {};
  var constructorEls = {};

  var MATCHER_IDS = ['centre_angle', 'same_segment', 'semicircle', 'cyclic_quad', 'tangent_radius', 'tangent_lengths'];
  var CONSTRUCTOR_CHALLENGES = ['inscribed_angle', 'diameter', 'semicircle_angle', 'tangent_point', 'chord', 'cyclic_quad'];

  function t(key) {
    if (window.CircleLab && window.CircleLab.i18n && typeof window.CircleLab.i18n.t === 'function') {
      return window.CircleLab.i18n.t(key);
    }
    return key;
  }

  function getLang() {
    if (window.CircleLab && window.CircleLab.i18n && typeof window.CircleLab.i18n.getLanguage === 'function') {
      return window.CircleLab.i18n.getLanguage();
    }
    return 'en';
  }

  function loadHub() {
    try {
      var stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        return { totalScore: 0, gamesPlayed: 0, attempts: 0, correct: 0, bestStreak: 0 };
      }
      var parsed = JSON.parse(stored);
      return {
        totalScore: Number(parsed.totalScore) || 0,
        gamesPlayed: Number(parsed.gamesPlayed) || 0,
        attempts: Number(parsed.attempts) || 0,
        correct: Number(parsed.correct) || 0,
        bestStreak: Number(parsed.bestStreak) || 0,
      };
    } catch (err) {
      return { totalScore: 0, gamesPlayed: 0, attempts: 0, correct: 0, bestStreak: 0 };
    }
  }

  function saveHub() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(hub));
    } catch (err) {
      // Ignore storage errors in restricted environments.
    }
  }

  function updateHubView() {
    var accuracy = hub.attempts > 0 ? Math.round((hub.correct / hub.attempts) * 100) : 0;
    setText('hub-total-score', String(hub.totalScore));
    setText('hub-games-played', String(hub.gamesPlayed));
    setText('hub-accuracy', accuracy + '%');
    setText('hub-best-streak', String(hub.bestStreak));
  }

  function setText(id, value) {
    var el = document.getElementById(id);
    if (el) {
      el.textContent = value;
    }
  }

  function initTabs() {
    tabs = Array.prototype.slice.call(document.querySelectorAll('.game-tab'));
    panels = {
      angle: document.getElementById('panel-angle'),
      matcher: document.getElementById('panel-matcher'),
      constructor: document.getElementById('panel-constructor'),
    };
    tabs.forEach(function (btn) {
      btn.addEventListener('click', function () {
        switchTab(btn.getAttribute('data-tab'));
      });
    });
  }

  function switchTab(name) {
    tabs.forEach(function (btn) {
      var active = btn.getAttribute('data-tab') === name;
      btn.classList.toggle('game-tab--active', active);
    });
    Object.keys(panels).forEach(function (key) {
      if (panels[key]) {
        panels[key].classList.toggle('game-panel--active', key === name);
      }
    });
  }

  function bindSoundToggle() {
    soundToggleBtn = document.getElementById('sound-toggle');
    if (!soundToggleBtn) return;
    soundToggleBtn.addEventListener('click', function () {
      SOUND.enabled = !SOUND.enabled;
      refreshSoundButton();
    });
    refreshSoundButton();
  }

  function refreshSoundButton() {
    if (!soundToggleBtn) return;
    soundToggleBtn.textContent = SOUND.enabled ? t('sound.on') : t('sound.off');
  }

  function tone(freq) {
    if (!SOUND.enabled) return;
    var AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    var ctx = new AudioCtx();
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = freq;
    gain.gain.value = 0.05;
    osc.start();
    osc.stop(ctx.currentTime + 0.08);
    osc.onended = function () {
      ctx.close();
    };
  }

  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function flashScreen(type) {
    var el = document.createElement('div');
    el.className = 'game-flash game-flash--' + type;
    document.body.appendChild(el);
    el.addEventListener('animationend', function () { el.remove(); });
  }

  function showStreakBurst(streak) {
    if (streak < 2) return;
    var labels = { 2: '2× Streak!', 3: '3× Streak! 🔥', 5: '5× COMBO!!', 10: '10× GODLIKE!!' };
    var text = labels[streak] || (streak + '× Streak!');
    var el = document.createElement('div');
    el.className = 'streak-burst';
    el.textContent = text;
    document.body.appendChild(el);
    el.addEventListener('animationend', function () { el.remove(); });
  }

  function showRoundComplete(score) {
    var el = document.createElement('div');
    el.className = 'round-complete';
    el.innerHTML = '&#10003; Round Complete<br><span style="font-size:1rem;color:var(--color-accent)">' + score + ' pts</span>';
    document.body.appendChild(el);
    setTimeout(function () { el.remove(); }, 2200);
  }

  function flashCard(el, type) {
    el.classList.remove('angle-question-card--correct', 'angle-question-card--wrong');
    void el.offsetWidth;
    el.classList.add('angle-question-card--' + type);
    setTimeout(function () {
      el.classList.remove('angle-question-card--correct', 'angle-question-card--wrong');
    }, 800);
  }

  function initAngleGame() {
    angleEls = {
      difficulty: document.getElementById('angle-difficulty'),
      start: document.getElementById('angle-start'),
      progress: document.getElementById('angle-progress'),
      score: document.getElementById('angle-score'),
      timer: document.getElementById('angle-timer'),
      streak: document.getElementById('angle-streak'),
      theorem: document.getElementById('angle-theorem'),
      prompt: document.getElementById('angle-question'),
      answer: document.getElementById('angle-answer'),
      submit: document.getElementById('angle-submit'),
      next: document.getElementById('angle-next'),
      feedback: document.getElementById('angle-feedback'),
    };

    angleEls.pauseBtn = document.getElementById('angle-pause');
    angleEls.pauseLabel = document.getElementById('angle-pause-label');

    angleEls.start.addEventListener('click', startAngleRound);
    angleEls.submit.addEventListener('click', submitAngleAnswer);
    angleEls.next.addEventListener('click', nextAngleQuestion);
    angleEls.answer.addEventListener('keydown', function (evt) {
      if (evt.key === 'Enter') submitAngleAnswer();
    });
    if (angleEls.pauseBtn) {
      angleEls.pauseBtn.addEventListener('click', toggleAnglePause);
    }
    resetAngleRound();
  }

  function getAngleTime() {
    var value = angleState.difficulty;
    if (value === 'hard') return 12;
    if (value === 'medium') return 18;
    return 24;
  }

  function toggleAnglePause() {
    if (!angleState.running) return;
    angleState.paused = !angleState.paused;
    if (angleState.paused) {
      stopAngleTimer();
      angleEls.answer.disabled = true;
      angleEls.submit.disabled = true;
      if (angleEls.pauseLabel) angleEls.pauseLabel.textContent = t('game1.resume') || 'Resume';
      angleEls.pauseBtn.classList.add('game-pause-btn--paused');
      showPauseOverlay('angle');
    } else {
      hidePauseOverlay('angle-panel');
      angleEls.answer.disabled = false;
      angleEls.submit.disabled = false;
      if (angleEls.pauseLabel) angleEls.pauseLabel.textContent = t('game1.pause') || 'Pause';
      angleEls.pauseBtn.classList.remove('game-pause-btn--paused');
      startAngleTimer();
    }
  }

  function showPauseOverlay(panelId) {
    var panel = document.getElementById('panel-' + panelId.replace('panel-', '').replace('-panel', ''));
    if (!panel) panel = document.querySelector('.game-panel--active');
    if (!panel) return;
    var existing = panel.querySelector('.game-pause-overlay');
    if (existing) return;
    var lang = window.CircleLab && window.CircleLab.i18n ? window.CircleLab.i18n.getLanguage() : 'en';
    var overlay = document.createElement('div');
    overlay.className = 'game-pause-overlay';
    overlay.setAttribute('role', 'button');
    overlay.setAttribute('tabindex', '0');
    overlay.setAttribute('aria-label', lang === 'zh' ? '点击继续游戏' : 'Click to resume game');
    overlay.innerHTML = '<div class="game-pause-overlay__box">'
      + '<svg width="32" height="32" viewBox="0 0 32 32" fill="none"><rect x="4" y="4" width="10" height="24" rx="2" fill="currentColor"/><rect x="18" y="4" width="10" height="24" rx="2" fill="currentColor"/></svg>'
      + '<p>' + (lang === 'zh' ? '游戏已暂停' : 'Game Paused') + '</p>'
      + '<span>' + (lang === 'zh' ? '点击此处继续游戏' : 'Click anywhere to resume') + '</span>'
      + '</div>';

    var resumeFn = panelId === 'angle' ? toggleAnglePause : toggleMatcherPause;
    overlay.addEventListener('click', resumeFn);
    overlay.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); resumeFn(); }
    });

    panel.appendChild(overlay);
  }

  function hidePauseOverlay(panelId) {
    var panel = document.querySelector('.game-panel--active');
    if (!panel) return;
    var overlay = panel.querySelector('.game-pause-overlay');
    if (overlay) overlay.remove();
  }

  function startAngleRound() {
    resetAngleRound();
    angleState.running = true;
    angleState.paused = false;
    angleState.difficulty = angleEls.difficulty.value;
    if (angleEls.pauseBtn) angleEls.pauseBtn.style.display = '';
    loadAngleQuestion();
  }

  function resetAngleRound() {
    if (angleState.timerId) {
      clearInterval(angleState.timerId);
      angleState.timerId = null;
    }
    angleState.running = false;
    angleState.questionIndex = 0;
    angleState.score = 0;
    angleState.streak = 0;
    angleState.bestStreak = 0;
    angleState.current = null;
    angleState.timeLeft = 0;
    angleEls.feedback.textContent = '';
    angleEls.feedback.classList.remove('feedback--correct', 'feedback--wrong');
    angleEls.prompt.textContent = '';
    angleEls.theorem.textContent = '';
    angleEls.answer.value = '';
    angleEls.answer.disabled = true;
    angleEls.submit.disabled = true;
    angleEls.next.disabled = true;
    if (angleEls.pauseBtn) angleEls.pauseBtn.style.display = 'none';
    hidePauseOverlay('angle');
    renderAngleStats();
    updateProgressBar();
  }

  function makeAngleQuestion() {
    var kinds = ['centre_angle', 'same_segment', 'semicircle', 'cyclic_quad', 'tangent_radius', 'tangent_lengths'];
    var kind = kinds[randInt(0, kinds.length - 1)];
    var q = { kind: kind, theoremKey: kind, answer: 0, a: 0, b: 0 };

    if (kind === 'centre_angle') {
      if (angleState.difficulty === 'hard' && Math.random() > 0.5) {
        q.a = randInt(60, 150);
        q.answer = q.a / 2;
        q.reverse = true;
      } else {
        q.a = randInt(20, 75);
        q.answer = q.a * 2;
      }
    } else if (kind === 'same_segment') {
      q.a = randInt(25, 85);
      q.answer = q.a;
    } else if (kind === 'semicircle') {
      q.answer = 90;
    } else if (kind === 'cyclic_quad') {
      q.a = randInt(38, 142);
      q.answer = 180 - q.a;
    } else if (kind === 'tangent_radius') {
      q.answer = 90;
    } else if (kind === 'tangent_lengths') {
      q.a = randInt(4, 20);
      q.answer = q.a;
    }

    return q;
  }

  function angleQuestionText(q) {
    var zh = getLang() === 'zh';
    if (q.kind === 'centre_angle') {
      if (q.reverse) {
        return zh
          ? '圆心角是 ' + q.a + '°。同弧对应的圆周角是多少度？'
          : 'The angle at the centre is ' + q.a + ' degrees. What is the angle at the circumference on the same arc?';
      }
      return zh
        ? '同弧上的圆周角为 ' + q.a + '°。圆心角是多少度？'
        : 'An angle at the circumference is ' + q.a + ' degrees. Find the angle at the centre on the same arc.';
    }
    if (q.kind === 'same_segment') {
      return zh
        ? '同一弧上一个圆周角是 ' + q.a + '°。另一个同弧圆周角是多少度？'
        : 'One angle in the same segment is ' + q.a + ' degrees. Find the other angle in the same segment.';
    }
    if (q.kind === 'semicircle') {
      return zh
        ? '一个角在半圆上（由直径所对）。该角是多少度？'
        : 'An angle is subtended by a diameter in a semicircle. What is the angle?';
    }
    if (q.kind === 'cyclic_quad') {
      return zh
        ? '圆内接四边形中，一个角是 ' + q.a + '°。它的对角是多少度？'
        : 'In a cyclic quadrilateral, one angle is ' + q.a + ' degrees. Find the opposite angle.';
    }
    if (q.kind === 'tangent_radius') {
      return zh
        ? '切线与切点处半径形成的角是多少度？'
        : 'What is the angle between a tangent and the radius at the point of contact?';
    }
    return zh
      ? '从圆外一点引两条切线，其中一条长度是 ' + q.a + '。另一条长度是多少？'
      : 'From an external point, one tangent segment has length ' + q.a + '. What is the length of the other tangent segment?';
  }

  function loadAngleQuestion() {
    angleState.current = makeAngleQuestion();
    angleState.timeLeft = getAngleTime();
    angleEls.answer.value = '';
    angleEls.answer.disabled = false;
    angleEls.submit.disabled = false;
    angleEls.next.disabled = true;
    angleEls.feedback.textContent = '';
    renderAngleStats();
    renderAngleQuestion();
    startAngleTimer();
    angleEls.answer.focus();
  }

  function renderAngleQuestion() {
    if (!angleState.current) return;
    angleEls.theorem.textContent = t('game1.theorem') + ': ' + t('game1.theorems.' + angleState.current.theoremKey);
    angleEls.prompt.textContent = angleQuestionText(angleState.current);
  }

  function renderAngleStats() {
    setText('angle-progress', (angleState.questionIndex + 1) + '/' + angleState.totalQuestions);
    setText('angle-score', t('game1.score') + ': ' + angleState.score);
    setText('angle-timer', t('game1.timer') + ': ' + angleState.timeLeft + t('seconds'));
    setText('angle-streak', t('game1.streak') + ': ' + angleState.streak);
  }

  function stopAngleTimer() {
    if (angleState.timerId) {
      clearInterval(angleState.timerId);
      angleState.timerId = null;
    }
  }

  function startAngleTimer() {
    stopAngleTimer();
    angleState.timerId = setInterval(function () {
      angleState.timeLeft -= 1;
      renderAngleStats();
      if (angleState.timeLeft <= 0) {
        stopAngleTimer();
        revealAngleResult(false, true);
      }
    }, 1000);
  }

  function submitAngleAnswer() {
    if (!angleState.running || !angleState.current || angleEls.submit.disabled) return;
    var value = parseFloat(angleEls.answer.value);
    if (Number.isNaN(value)) return;
    var ok = Math.abs(value - angleState.current.answer) < 0.1;
    revealAngleResult(ok, false);
  }

  function setFeedback(el, text, type) {
    el.textContent = text;
    el.classList.remove('feedback--correct', 'feedback--wrong');
    void el.offsetWidth; // force reflow for re-trigger
    if (type === 'correct') el.classList.add('feedback--correct');
    if (type === 'wrong') el.classList.add('feedback--wrong');
  }

  function flashHubValue(id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.classList.remove('hub-card__value--flash');
    void el.offsetWidth;
    el.classList.add('hub-card__value--flash');
  }

  function revealAngleResult(correct, timeout) {
    stopAngleTimer();
    angleEls.answer.disabled = true;
    angleEls.submit.disabled = true;
    angleEls.next.disabled = false;

    hub.attempts += 1;
    if (correct) {
      var gain = angleState.difficulty === 'hard' ? 20 : (angleState.difficulty === 'medium' ? 15 : 10);
      angleState.score += gain;
      hub.totalScore += gain;
      angleState.streak += 1;
      hub.correct += 1;
      if (angleState.streak > angleState.bestStreak) angleState.bestStreak = angleState.streak;
      if (angleState.streak > hub.bestStreak) hub.bestStreak = angleState.streak;
      setFeedback(angleEls.feedback, t('game1.correct') + ' (' + angleState.current.answer + '°)', 'correct');
      flashHubValue('hub-total-score');
      flashScreen('correct');
      flashCard(document.querySelector('.angle-question-card'), 'correct');
      showStreakBurst(angleState.streak);
      tone(820);
    } else {
      angleState.streak = 0;
      setFeedback(angleEls.feedback, (timeout ? t('game1.timeout') : t('game1.wrong')) + ' ' + t('game1.answer') + ' ' + angleState.current.answer + '°', 'wrong');
      flashScreen('wrong');
      flashCard(document.querySelector('.angle-question-card'), 'wrong');
      tone(220);
    }
    saveHub();
    updateHubView();
    renderAngleStats();
    updateProgressBar();
  }

  function nextAngleQuestion() {
    if (!angleState.running) return;
    angleState.questionIndex += 1;
    if (angleState.questionIndex >= angleState.totalQuestions) {
      finishAngleRound();
      return;
    }
    loadAngleQuestion();
  }

  function finishAngleRound() {
    angleState.running = false;
    stopAngleTimer();
    hub.gamesPlayed += 1;
    saveHub();
    updateHubView();
    angleEls.theorem.textContent = '';
    angleEls.prompt.textContent = t('game1.round_complete') + ' ' + t('game1.final_score') + ': ' + angleState.score + ' ' + t('points');
    angleEls.feedback.textContent = t('game1.questions_correct') + ': ' + hub.correct + '/' + hub.attempts;
    showRoundComplete(angleState.score);
    angleEls.answer.disabled = true;
    angleEls.submit.disabled = true;
    angleEls.next.disabled = true;
    renderAngleStats();
  }

  function initMatcherGame() {
    matcherEls = {
      start: document.getElementById('matcher-start'),
      reset: document.getElementById('matcher-reset'),
      timer: document.getElementById('matcher-timer'),
      matches: document.getElementById('matcher-matches'),
      diagrams: document.getElementById('matcher-diagrams'),
      names: document.getElementById('matcher-names'),
      feedback: document.getElementById('matcher-feedback'),
    };

    matcherEls.pauseBtn = document.getElementById('matcher-pause');
    matcherEls.pauseLabel = document.getElementById('matcher-pause-label');

    matcherEls.start.addEventListener('click', startMatcher);
    matcherEls.reset.addEventListener('click', resetMatcher);
    if (matcherEls.pauseBtn) {
      matcherEls.pauseBtn.addEventListener('click', toggleMatcherPause);
    }
    resetMatcher();
  }

  function resetMatcher() {
    stopMatcherTimer();
    matcherState.running = false;
    matcherState.paused = false;
    if (matcherEls.pauseBtn) matcherEls.pauseBtn.style.display = 'none';
    hidePauseOverlay('matcher');
    matcherState.score = 0;
    matcherState.matches = 0;
    matcherState.selectedDiagram = null;
    matcherState.selectedName = null;
    matcherState.matched = {};
    matcherState.nameOrder = shuffle(MATCHER_IDS.slice());
    matcherState.timeLeft = 75;
    matcherEls.feedback.textContent = '';
    renderMatcherBoard();
    renderMatcherStats();
  }

  function toggleMatcherPause() {
    if (!matcherState.running) return;
    matcherState.paused = !matcherState.paused;
    if (matcherState.paused) {
      stopMatcherTimer();
      if (matcherEls.pauseLabel) matcherEls.pauseLabel.textContent = t('game1.resume') || 'Resume';
      matcherEls.pauseBtn.classList.add('game-pause-btn--paused');
      showPauseOverlay('matcher');
    } else {
      hidePauseOverlay('matcher');
      if (matcherEls.pauseLabel) matcherEls.pauseLabel.textContent = t('game1.pause') || 'Pause';
      matcherEls.pauseBtn.classList.remove('game-pause-btn--paused');
      startMatcherTimer();
    }
  }

  function startMatcher() {
    resetMatcher();
    matcherState.running = true;
    matcherState.paused = false;
    if (matcherEls.pauseBtn) matcherEls.pauseBtn.style.display = '';
    startMatcherTimer();
  }

  function renderMatcherStats() {
    setText('matcher-timer', t('game2.timer') + ': ' + matcherState.timeLeft + t('seconds'));
    setText('matcher-matches', t('game2.matches') + ': ' + matcherState.matches + '/' + MATCHER_IDS.length);
  }

  function startMatcherTimer() {
    stopMatcherTimer();
    matcherState.timerId = setInterval(function () {
      matcherState.timeLeft -= 1;
      renderMatcherStats();
      if (matcherState.timeLeft <= 0) {
        finishMatcher(false);
      }
    }, 1000);
  }

  function stopMatcherTimer() {
    if (matcherState.timerId) {
      clearInterval(matcherState.timerId);
      matcherState.timerId = null;
    }
  }

  function renderMatcherBoard() {
    matcherEls.diagrams.innerHTML = '';
    matcherEls.names.innerHTML = '';

    MATCHER_IDS.forEach(function (id) {
      var dBtn = document.createElement('button');
      dBtn.type = 'button';
      dBtn.className = 'matcher-diagram';
      dBtn.setAttribute('data-id', id);
      dBtn.innerHTML = getDiagramSvg(id);
      if (matcherState.matched[id]) dBtn.classList.add('matcher-matched');
      if (matcherState.selectedDiagram === id) dBtn.classList.add('matcher-selected');
      dBtn.addEventListener('click', function () {
        if (!matcherState.running || matcherState.matched[id]) return;
        if (matcherState.selectedDiagram === id) {
          matcherState.selectedDiagram = null;
          renderMatcherBoard();
          return;
        }
        matcherState.selectedDiagram = id;
        if (matcherState.selectedName) evaluateMatcherPair();
        renderMatcherBoard();
      });
      matcherEls.diagrams.appendChild(dBtn);
    });

    matcherState.nameOrder.forEach(function (id) {
      var nBtn = document.createElement('button');
      nBtn.type = 'button';
      nBtn.className = 'matcher-name';
      nBtn.setAttribute('data-id', id);
      nBtn.textContent = t('game2.names.' + id);
      if (matcherState.matched[id]) nBtn.classList.add('matcher-matched');
      if (matcherState.selectedName === id) nBtn.classList.add('matcher-selected');
      nBtn.addEventListener('click', function () {
        if (!matcherState.running || matcherState.matched[id]) return;
        if (matcherState.selectedName === id) {
          matcherState.selectedName = null;
          renderMatcherBoard();
          return;
        }
        matcherState.selectedName = id;
        if (matcherState.selectedDiagram) evaluateMatcherPair();
        renderMatcherBoard();
      });
      matcherEls.names.appendChild(nBtn);
    });
  }

  function evaluateMatcherPair() {
    var d = matcherState.selectedDiagram;
    var n = matcherState.selectedName;
    if (!d || !n) return;

    hub.attempts += 1;
    if (d === n) {
      matcherState.matched[d] = true;
      matcherState.matches += 1;
      matcherState.score += 12;
      hub.correct += 1;
      hub.totalScore += 12;
      setFeedback(matcherEls.feedback, t('game2.correct'), 'correct');
      flashHubValue('hub-total-score');
      tone(740);
      if (matcherState.matches >= MATCHER_IDS.length) {
        finishMatcher(true);
      }
    } else {
      matcherState.score = Math.max(0, matcherState.score - 3);
      setFeedback(matcherEls.feedback, t('game2.wrong'), 'wrong');
      tone(240);
    }

    matcherState.selectedDiagram = null;
    matcherState.selectedName = null;
    saveHub();
    updateHubView();
    renderMatcherStats();
  }

  function finishMatcher(completed) {
    matcherState.running = false;
    stopMatcherTimer();
    hub.gamesPlayed += 1;
    saveHub();
    updateHubView();
    matcherEls.feedback.textContent = (completed ? t('game2.complete') : t('game2.timeout')) + ' | ' + t('game2.final_score') + ': ' + matcherState.score;
    renderMatcherBoard();
  }

  function shuffle(arr) {
    var out = arr.slice();
    for (var i = out.length - 1; i > 0; i--) {
      var j = randInt(0, i);
      var tmp = out[i];
      out[i] = out[j];
      out[j] = tmp;
    }
    return out;
  }

  function getDiagramSvg(id) {
    var c = 'var(--color-secondary)';
    var p = 'var(--color-primary)';
    var r = 'var(--color-cta)';
    var g = 'var(--color-success)';

    if (id === 'centre_angle') {
      // Circle with centre O, circumference point C, arc points A & B. Central angle 2α, inscribed angle α
      return '<svg viewBox="0 0 160 140" role="img" aria-label="Angle at centre theorem">'
        + '<circle cx="70" cy="74" r="52" fill="none" stroke="' + p + '" stroke-width="2"/>'
        + '<circle cx="70" cy="74" r="3" fill="' + p + '"/>'
        + '<text x="74" y="71" fill="' + p + '" font-family="monospace" font-size="11" font-weight="700">O</text>'
        + '<circle cx="34" cy="108" r="4" fill="' + c + '"/><text x="22" y="122" fill="' + c + '" font-family="monospace" font-size="10">A</text>'
        + '<circle cx="106" cy="108" r="4" fill="' + c + '"/><text x="110" y="122" fill="' + c + '" font-family="monospace" font-size="10">B</text>'
        + '<circle cx="70" cy="22" r="4" fill="' + r + '"/><text x="74" y="18" fill="' + r + '" font-family="monospace" font-size="10">C</text>'
        + '<line x1="70" y1="74" x2="34" y2="108" stroke="' + p + '" stroke-width="2"/>'
        + '<line x1="70" y1="74" x2="106" y2="108" stroke="' + p + '" stroke-width="2"/>'
        + '<line x1="70" y1="22" x2="34" y2="108" stroke="' + r + '" stroke-width="1.5"/>'
        + '<line x1="70" y1="22" x2="106" y2="108" stroke="' + r + '" stroke-width="1.5"/>'
        + '<path d="M 58 85 A 16 16 0 0 1 82 85" fill="none" stroke="' + p + '" stroke-width="1.5"/>'
        + '<text x="62" y="100" fill="' + p + '" font-family="monospace" font-size="9">2α</text>'
        + '<path d="M 63 33 A 10 10 0 0 1 77 33" fill="none" stroke="' + r + '" stroke-width="1.5"/>'
        + '<text x="65" y="46" fill="' + r + '" font-family="monospace" font-size="9">α</text>'
        + '</svg>';
    }

    if (id === 'same_segment') {
      // Two inscribed angles C and D subtending same chord AB, both equal α
      return '<svg viewBox="0 0 160 140" role="img" aria-label="Angles in same segment">'
        + '<circle cx="76" cy="74" r="52" fill="none" stroke="' + p + '" stroke-width="2"/>'
        + '<circle cx="40" cy="96" r="4" fill="' + c + '"/><text x="24" y="94" fill="' + c + '" font-family="monospace" font-size="10">A</text>'
        + '<circle cx="112" cy="96" r="4" fill="' + c + '"/><text x="116" y="94" fill="' + c + '" font-family="monospace" font-size="10">B</text>'
        + '<circle cx="50" cy="30" r="4" fill="' + r + '"/><text x="34" y="26" fill="' + r + '" font-family="monospace" font-size="10">C</text>'
        + '<circle cx="102" cy="30" r="4" fill="' + r + '"/><text x="106" y="26" fill="' + r + '" font-family="monospace" font-size="10">D</text>'
        + '<line x1="40" y1="96" x2="112" y2="96" stroke="' + c + '" stroke-width="1.5" stroke-dasharray="5 3"/>'
        + '<line x1="50" y1="30" x2="40" y2="96" stroke="' + r + '" stroke-width="1.5"/>'
        + '<line x1="50" y1="30" x2="112" y2="96" stroke="' + r + '" stroke-width="1.5"/>'
        + '<line x1="102" y1="30" x2="40" y2="96" stroke="' + r + '" stroke-width="1.5" opacity="0.6"/>'
        + '<line x1="102" y1="30" x2="112" y2="96" stroke="' + r + '" stroke-width="1.5" opacity="0.6"/>'
        + '<path d="M 40 44 A 16 16 0 0 1 60 44" fill="none" stroke="' + r + '" stroke-width="1.5"/>'
        + '<text x="44" y="58" fill="' + r + '" font-family="monospace" font-size="9">α</text>'
        + '<path d="M 92 44 A 16 16 0 0 1 112 44" fill="none" stroke="' + r + '" stroke-width="1.5"/>'
        + '<text x="96" y="58" fill="' + r + '" font-family="monospace" font-size="9">α</text>'
        + '</svg>';
    }

    if (id === 'semicircle') {
      // Diameter AB, point C on circle, angle ACB = 90°
      return '<svg viewBox="0 0 160 140" role="img" aria-label="Angle in semicircle">'
        + '<circle cx="80" cy="80" r="52" fill="none" stroke="' + p + '" stroke-width="2"/>'
        + '<circle cx="28" cy="80" r="4" fill="' + c + '"/><text x="12" y="78" fill="' + c + '" font-family="monospace" font-size="10">A</text>'
        + '<circle cx="132" cy="80" r="4" fill="' + c + '"/><text x="136" y="78" fill="' + c + '" font-family="monospace" font-size="10">B</text>'
        + '<circle cx="80" cy="28" r="4" fill="' + r + '"/><text x="84" y="24" fill="' + r + '" font-family="monospace" font-size="10">C</text>'
        + '<line x1="28" y1="80" x2="132" y2="80" stroke="' + c + '" stroke-width="2"/>'
        + '<circle cx="80" cy="80" r="3" fill="' + p + '"/>'
        + '<line x1="80" y1="28" x2="28" y2="80" stroke="' + r + '" stroke-width="1.5"/>'
        + '<line x1="80" y1="28" x2="132" y2="80" stroke="' + r + '" stroke-width="1.5"/>'
        + '<rect x="72" y="28" width="10" height="10" fill="none" stroke="' + r + '" stroke-width="1.5" transform="rotate(-38 77 33)"/>'
        + '<text x="48" y="50" fill="' + r + '" font-family="monospace" font-size="11" font-weight="700">90°</text>'
        + '</svg>';
    }

    if (id === 'cyclic_quad') {
      // Cyclic quadrilateral ABCD with opposite angles summing to 180°
      return '<svg viewBox="0 0 160 140" role="img" aria-label="Cyclic quadrilateral">'
        + '<circle cx="80" cy="72" r="52" fill="none" stroke="' + p + '" stroke-width="2"/>'
        + '<circle cx="80" cy="20" r="4" fill="' + r + '"/><text x="84" y="16" fill="' + r + '" font-family="monospace" font-size="10">A</text>'
        + '<circle cx="128" cy="96" r="4" fill="' + c + '"/><text x="132" y="100" fill="' + c + '" font-family="monospace" font-size="10">B</text>'
        + '<circle cx="70" cy="122" r="4" fill="' + r + '"/><text x="56" y="136" fill="' + r + '" font-family="monospace" font-size="10">C</text>'
        + '<circle cx="32" cy="72" r="4" fill="' + c + '"/><text x="14" y="70" fill="' + c + '" font-family="monospace" font-size="10">D</text>'
        + '<polygon points="80,20 128,96 70,122 32,72" fill="none" stroke="' + c + '" stroke-width="1.5"/>'
        + '<path d="M 70 32 A 14 14 0 0 1 90 32" fill="none" stroke="' + r + '" stroke-width="2"/>'
        + '<text x="60" y="44" fill="' + r + '" font-family="monospace" font-size="9">α</text>'
        + '<path d="M 60 112 A 14 14 0 0 0 80 112" fill="none" stroke="' + r + '" stroke-width="2"/>'
        + '<text x="62" y="108" fill="' + r + '" font-family="monospace" font-size="9">γ</text>'
        + '<text x="86" y="86" fill="' + g + '" font-family="monospace" font-size="9">α+γ=180°</text>'
        + '</svg>';
    }

    if (id === 'tangent_radius') {
      // Radius OP to point of tangency P, tangent line through P, right angle marker
      return '<svg viewBox="0 0 160 140" role="img" aria-label="Tangent-radius theorem">'
        + '<circle cx="64" cy="72" r="48" fill="none" stroke="' + p + '" stroke-width="2"/>'
        + '<circle cx="64" cy="72" r="3" fill="' + p + '"/>'
        + '<text x="50" y="68" fill="' + p + '" font-family="monospace" font-size="11" font-weight="700">O</text>'
        + '<circle cx="112" cy="72" r="4" fill="' + r + '"/>'
        + '<text x="116" y="68" fill="' + r + '" font-family="monospace" font-size="10">P</text>'
        + '<line x1="64" y1="72" x2="112" y2="72" stroke="' + c + '" stroke-width="2"/>'
        + '<text x="82" y="64" fill="' + c + '" font-family="monospace" font-size="9">r</text>'
        + '<line x1="112" y1="20" x2="112" y2="124" stroke="' + r + '" stroke-width="2.5" stroke-linecap="round"/>'
        + '<rect x="100" y="60" width="12" height="12" fill="none" stroke="' + r + '" stroke-width="1.5"/>'
        + '<text x="118" y="56" fill="' + r + '" font-family="monospace" font-size="10">90°</text>'
        + '<text x="116" y="26" fill="' + r + '" font-family="monospace" font-size="9" opacity="0.8">tangent</text>'
        + '</svg>';
    }

    // tangent_lengths: two equal tangents from external point P
    return '<svg viewBox="0 0 160 140" role="img" aria-label="Equal tangent lengths">'
      + '<circle cx="62" cy="72" r="44" fill="none" stroke="' + p + '" stroke-width="2"/>'
      + '<circle cx="62" cy="72" r="3" fill="' + p + '"/>'
      + '<text x="50" y="68" fill="' + p + '" font-family="monospace" font-size="10">O</text>'
      + '<circle cx="144" cy="72" r="4" fill="' + r + '"/>'
      + '<text x="148" y="68" fill="' + r + '" font-family="monospace" font-size="10">P</text>'
      + '<circle cx="96" cy="34" r="4" fill="' + c + '"/><text x="100" y="28" fill="' + c + '" font-family="monospace" font-size="10">A</text>'
      + '<circle cx="96" cy="110" r="4" fill="' + c + '"/><text x="100" y="124" fill="' + c + '" font-family="monospace" font-size="10">B</text>'
      + '<line x1="144" y1="72" x2="96" y2="34" stroke="' + r + '" stroke-width="2"/>'
      + '<line x1="144" y1="72" x2="96" y2="110" stroke="' + r + '" stroke-width="2"/>'
      + '<line x1="116" y1="46" x2="124" y2="56" stroke="' + r + '" stroke-width="2"/>'
      + '<line x1="112" y1="48" x2="120" y2="58" stroke="' + r + '" stroke-width="2"/>'
      + '<line x1="116" y1="98" x2="124" y2="88" stroke="' + r + '" stroke-width="2"/>'
      + '<line x1="112" y1="96" x2="120" y2="86" stroke="' + r + '" stroke-width="2"/>'
      + '<line x1="62" y1="72" x2="96" y2="34" stroke="' + p + '" stroke-width="1" stroke-dasharray="5 3" opacity="0.4"/>'
      + '<line x1="62" y1="72" x2="96" y2="110" stroke="' + p + '" stroke-width="1" stroke-dasharray="5 3" opacity="0.4"/>'
      + '<text x="106" y="76" fill="' + g + '" font-family="monospace" font-size="9">PA=PB</text>'
      + '</svg>';
  }

  function initConstructorGame() {
    constructorEls = {
      start: document.getElementById('constructor-start'),
      check: document.getElementById('constructor-check'),
      next: document.getElementById('constructor-next'),
      undo: document.getElementById('constructor-undo'),
      clear: document.getElementById('constructor-clear'),
      level: document.getElementById('constructor-level'),
      score: document.getElementById('constructor-score'),
      challenge: document.getElementById('constructor-challenge'),
      hint: document.getElementById('constructor-hint'),
      feedback: document.getElementById('constructor-feedback'),
      board: document.getElementById('constructor-board'),
      lines: document.getElementById('constructor-lines'),
      points: document.getElementById('constructor-points'),
    };

    constructorEls.start.addEventListener('click', startConstructor);
    constructorEls.check.addEventListener('click', checkConstructor);
    constructorEls.next.addEventListener('click', nextConstructorChallenge);
    constructorEls.undo.addEventListener('click', undoConstructorPoint);
    constructorEls.clear.addEventListener('click', clearConstructorPoints);
    constructorEls.board.addEventListener('click', onBoardClick);
    resetConstructor();
  }

  function resetConstructor() {
    constructorState.running = false;
    constructorState.score = 0;
    constructorState.index = 0;
    constructorState.points = [];
    constructorState.solvedCurrent = false;
    constructorEls.feedback.textContent = '';
    renderConstructorMeta();
    renderConstructorStage();
  }

  function startConstructor() {
    resetConstructor();
    constructorState.running = true;
    renderConstructorMeta();
    renderConstructorStage();
  }

  function renderConstructorMeta() {
    var level = constructorState.index + 1;
    setText('constructor-level', t('game3.level') + ': ' + level + '/' + CONSTRUCTOR_CHALLENGES.length);
    setText('constructor-score', t('game3.score') + ': ' + constructorState.score);

    var challengeId = CONSTRUCTOR_CHALLENGES[constructorState.index];
    if (challengeId) {
      constructorEls.challenge.textContent = t('game3.challenge') + ': ' + t('game3.challenges.' + challengeId);
      constructorEls.hint.textContent = t('game3.hint') + ': ' + t('game3.hints.' + challengeId);
    } else {
      constructorEls.challenge.textContent = t('game3.complete');
      constructorEls.hint.textContent = '';
    }
  }

  function onBoardClick(evt) {
    if (!constructorState.running) return;
    var point = projectToCircle(evt);
    if (!point) return;
    constructorState.points.push(point);
    constructorState.solvedCurrent = false;
    renderConstructorStage();
  }

  function projectToCircle(evt) {
    var rect = constructorEls.board.getBoundingClientRect();
    var sx = (evt.clientX - rect.left) * (320 / rect.width);
    var sy = (evt.clientY - rect.top) * (320 / rect.height);
    var dx = sx - 160;
    var dy = sy - 160;
    var dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 10) return null;
    var scale = 120 / dist;
    return { x: 160 + dx * scale, y: 160 + dy * scale };
  }

  function renderConstructorStage() {
    constructorEls.lines.innerHTML = '';
    constructorEls.points.innerHTML = '';
    var i;

    for (i = 1; i < constructorState.points.length; i++) {
      var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', constructorState.points[i - 1].x.toFixed(2));
      line.setAttribute('y1', constructorState.points[i - 1].y.toFixed(2));
      line.setAttribute('x2', constructorState.points[i].x.toFixed(2));
      line.setAttribute('y2', constructorState.points[i].y.toFixed(2));
      line.setAttribute('class', 'constructor-line');
      constructorEls.lines.appendChild(line);
    }

    for (i = 0; i < constructorState.points.length; i++) {
      var node = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      node.setAttribute('cx', constructorState.points[i].x.toFixed(2));
      node.setAttribute('cy', constructorState.points[i].y.toFixed(2));
      node.setAttribute('r', '5');
      node.setAttribute('class', 'constructor-point');
      constructorEls.points.appendChild(node);
    }
  }

  function clearConstructorPoints() {
    constructorState.points = [];
    constructorState.solvedCurrent = false;
    constructorEls.feedback.textContent = '';
    renderConstructorStage();
  }

  function undoConstructorPoint() {
    constructorState.points.pop();
    constructorState.solvedCurrent = false;
    renderConstructorStage();
  }

  function validateConstructor(challengeId, points) {
    if (challengeId === 'inscribed_angle') return points.length === 3;
    if (challengeId === 'diameter') return points.length === 2 && distance(points[0], points[1]) > 220;
    if (challengeId === 'semicircle_angle') return points.length === 3 && distance(points[0], points[1]) > 215;
    if (challengeId === 'tangent_point') return points.length === 1;
    if (challengeId === 'chord') return points.length === 2 && distance(points[0], points[1]) < 210;
    if (challengeId === 'cyclic_quad') return points.length === 4;
    return false;
  }

  function distance(a, b) {
    var dx = a.x - b.x;
    var dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function checkConstructor() {
    if (!constructorState.running) return;
    var id = CONSTRUCTOR_CHALLENGES[constructorState.index];
    if (!id) return;
    hub.attempts += 1;
    var ok = validateConstructor(id, constructorState.points);
    if (ok) {
      hub.correct += 1;
      constructorState.score += 15;
      hub.totalScore += 15;
      constructorState.solvedCurrent = true;
      setFeedback(constructorEls.feedback, t('game3.correct'), 'correct');
      flashHubValue('hub-total-score');
      tone(700);
    } else {
      constructorState.solvedCurrent = false;
      setFeedback(constructorEls.feedback, t('game3.wrong'), 'wrong');
      tone(220);
    }
    saveHub();
    updateHubView();
    renderConstructorMeta();
  }

  function nextConstructorChallenge() {
    if (!constructorState.running) return;
    constructorState.index += 1;
    constructorState.points = [];
    constructorState.solvedCurrent = false;
    if (constructorState.index >= CONSTRUCTOR_CHALLENGES.length) {
      constructorState.running = false;
      constructorState.index = CONSTRUCTOR_CHALLENGES.length - 1;
      constructorEls.feedback.textContent = t('game3.complete') + ' | ' + t('game3.score') + ': ' + constructorState.score;
      hub.gamesPlayed += 1;
      saveHub();
      updateHubView();
      return;
    }
    constructorEls.feedback.textContent = '';
    renderConstructorMeta();
    renderConstructorStage();
  }

  function updateProgressBar() {
    var fill = document.getElementById('angle-progress-fill');
    if (!fill) return;
    var pct = (angleState.questionIndex / angleState.totalQuestions) * 100;
    fill.style.width = pct + '%';
  }

  function refreshRuntimeLanguage() {
    refreshSoundButton();
    renderAngleQuestion();
    renderAngleStats();
    renderMatcherStats();
    renderMatcherBoard();
    renderConstructorMeta();
  }

  function init() {
    initTabs();
    bindSoundToggle();
    initAngleGame();
    initMatcherGame();
    initConstructorGame();
    updateHubView();
    switchTab('angle');
    document.addEventListener('languagechange', refreshRuntimeLanguage);
    refreshRuntimeLanguage();
  }

  window.CircleLabGame = {
    init: init,
  };
})();
