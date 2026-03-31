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

    angleEls.start.addEventListener('click', startAngleRound);
    angleEls.submit.addEventListener('click', submitAngleAnswer);
    angleEls.next.addEventListener('click', nextAngleQuestion);
    angleEls.answer.addEventListener('keydown', function (evt) {
      if (evt.key === 'Enter') submitAngleAnswer();
    });
    resetAngleRound();
  }

  function getAngleTime() {
    var value = angleState.difficulty;
    if (value === 'hard') return 12;
    if (value === 'medium') return 18;
    return 24;
  }

  function startAngleRound() {
    resetAngleRound();
    angleState.running = true;
    angleState.difficulty = angleEls.difficulty.value;
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
    angleEls.prompt.textContent = t('game1.start');
    angleEls.theorem.textContent = '';
    angleEls.answer.value = '';
    angleEls.answer.disabled = true;
    angleEls.submit.disabled = true;
    angleEls.next.disabled = true;
    renderAngleStats();
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
      angleEls.feedback.textContent = t('game1.correct') + ' (' + angleState.current.answer + '°)';
      tone(820);
    } else {
      angleState.streak = 0;
      angleEls.feedback.textContent = (timeout ? t('game1.timeout') : t('game1.wrong')) + ' ' + t('game1.answer') + ' ' + angleState.current.answer + '°';
      tone(220);
    }
    saveHub();
    updateHubView();
    renderAngleStats();
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

    matcherEls.start.addEventListener('click', startMatcher);
    matcherEls.reset.addEventListener('click', resetMatcher);
    resetMatcher();
  }

  function resetMatcher() {
    stopMatcherTimer();
    matcherState.running = false;
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

  function startMatcher() {
    resetMatcher();
    matcherState.running = true;
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
      matcherEls.feedback.textContent = t('game2.correct');
      tone(740);
      if (matcherState.matches >= MATCHER_IDS.length) {
        finishMatcher(true);
      }
    } else {
      matcherState.score = Math.max(0, matcherState.score - 3);
      matcherEls.feedback.textContent = t('game2.wrong');
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
    matcherEls.feedback.textContent = (completed ? t('game2.complete') : t('game2.timer')) + ' | ' + t('game2.final_score') + ': ' + matcherState.score;
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
    if (id === 'centre_angle') {
      return '<svg viewBox="0 0 120 80"><circle cx="40" cy="40" r="28" fill="none" stroke="' + p + '" /><line x1="40" y1="40" x2="64" y2="30" stroke="' + c + '" /><line x1="40" y1="40" x2="64" y2="50" stroke="' + c + '" /><text x="72" y="44" fill="' + c + '" font-size="10">2a</text></svg>';
    }
    if (id === 'same_segment') {
      return '<svg viewBox="0 0 120 80"><circle cx="40" cy="40" r="28" fill="none" stroke="' + p + '" /><line x1="20" y1="22" x2="60" y2="22" stroke="' + c + '" /><text x="70" y="24" fill="' + c + '" font-size="10">a=a</text></svg>';
    }
    if (id === 'semicircle') {
      return '<svg viewBox="0 0 120 80"><path d="M12 54 A28 28 0 0 1 68 54" fill="none" stroke="' + p + '" /><line x1="12" y1="54" x2="68" y2="54" stroke="' + c + '" /><text x="74" y="54" fill="' + c + '" font-size="10">90deg</text></svg>';
    }
    if (id === 'cyclic_quad') {
      return '<svg viewBox="0 0 120 80"><circle cx="40" cy="40" r="28" fill="none" stroke="' + p + '" /><polygon points="38,14 61,34 42,62 18,40" fill="none" stroke="' + c + '" /><text x="70" y="44" fill="' + c + '" font-size="10">180deg</text></svg>';
    }
    if (id === 'tangent_radius') {
      return '<svg viewBox="0 0 120 80"><circle cx="36" cy="40" r="24" fill="none" stroke="' + p + '" /><line x1="36" y1="40" x2="60" y2="40" stroke="' + c + '" /><line x1="60" y1="20" x2="60" y2="60" stroke="' + c + '" /><text x="70" y="44" fill="' + c + '" font-size="10">90deg</text></svg>';
    }
    return '<svg viewBox="0 0 120 80"><circle cx="32" cy="40" r="20" fill="none" stroke="' + p + '" /><line x1="76" y1="40" x2="52" y2="24" stroke="' + c + '" /><line x1="76" y1="40" x2="52" y2="56" stroke="' + c + '" /><text x="82" y="44" fill="' + c + '" font-size="10">PA=PB</text></svg>';
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
      constructorEls.feedback.textContent = t('game3.correct');
      tone(700);
    } else {
      constructorState.solvedCurrent = false;
      constructorEls.feedback.textContent = t('game3.wrong');
      tone(220);
    }
    saveHub();
    updateHubView();
    renderConstructorMeta();
  }

  function nextConstructorChallenge() {
    if (!constructorState.running) return;
    if (!constructorState.solvedCurrent) {
      constructorEls.feedback.textContent = t('game3.check') + ' -> ' + t('game3.wrong');
      return;
    }
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
