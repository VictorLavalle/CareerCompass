// CareerCompass — App (Main Orchestrator)
// Connects all modules: ApiClient, QuizEngine, Matching, CareerData, UI.
// Runs last — all other modules are already loaded on window.CareerCompass.

(function () {
  'use strict';

  // ── Module References ─────────────────────────────────────────────────

  var ApiClient = window.CareerCompass.ApiClient;
  var QuizEngine = window.CareerCompass.QuizEngine;
  var Matching = window.CareerCompass.Matching;
  var CareerData = window.CareerCompass.CareerData;
  var UI = window.CareerCompass.UI;
  var ResultsExport = window.CareerCompass.ResultsExport;

  // ── DOM References ────────────────────────────────────────────────────

  var btnStart = document.getElementById('btn-start');
  var btnNext = document.getElementById('btn-next');
  var btnPrev = document.getElementById('btn-prev');
  var btnRestart = document.getElementById('btn-restart');
  var btnRetry = document.getElementById('btn-retry');
  var btnDownload = document.getElementById('btn-download');
  var btnEmail = document.getElementById('btn-email');

  if (!btnStart || !btnNext || !btnPrev || !btnRestart || !btnRetry) {
    console.error('Required DOM elements not found. Cannot initialize app.');
    return;
  }

  // ── Internal State ────────────────────────────────────────────────────

  var dataLoaded = false;
  var totalQuestions = 8;
  var lastResults = null;

  // ── Initialization ────────────────────────────────────────────────────

  /**
   * Loads data from the API and transitions to Welcome or Error screen.
   */
  function initialize() {
    dataLoaded = false;
    btnStart.disabled = true;
    UI.showLoading();

    ApiClient.loadData()
      .then(function () {
        dataLoaded = true;
        btnStart.disabled = false;
        UI.showScreen('screen-welcome');
      })
      .catch(function (error) {
        dataLoaded = false;
        btnStart.disabled = true;
        UI.showError(error.message || 'Could not load data. Check your connection and try again.');
      });
  }

  // ── Quiz Flow ─────────────────────────────────────────────────────────

  /**
   * Starts the quiz: initializes QuizEngine, renders first question, shows Quiz screen.
   */
  function startQuiz() {
    QuizEngine.init();
    currentStepIndex = 0;
    var question = QuizEngine.getCurrentQuestion();
    UI.renderQuestion(question, 0, totalQuestions);
    UI.showScreen('screen-quiz');
    updateNavigationButtons(0);
  }

  /**
   * Handles "Next" button: saves answer, advances or shows results.
   */
  function handleNext() {
    var selection = UI.getSelection();

    // Validate that something is selected
    if (selection === null || (Array.isArray(selection) && selection.length === 0)) {
      return; // Do nothing if no selection
    }

    var hasMore;
    try {
      hasMore = QuizEngine.answerAndNext(selection);
    } catch (e) {
      // Validation error from QuizEngine — ignore, user needs to fix selection
      return;
    }

    if (hasMore) {
      // Render next question
      currentStepIndex++;
      var question = QuizEngine.getCurrentQuestion();
      var stepIndex = getStepIndex();
      UI.renderQuestion(question, stepIndex, totalQuestions);
      updateNavigationButtons(stepIndex);
    } else {
      // Quiz complete — calculate and show results
      showResults();
    }
  }

  /**
   * Handles "Previous" button: goes back one question.
   */
  function handlePrev() {
    try {
      QuizEngine.goBack();
    } catch (e) {
      // Already at first question
      return;
    }

    currentStepIndex--;
    var question = QuizEngine.getCurrentQuestion();
    var stepIndex = getStepIndex();
    UI.renderQuestion(question, stepIndex, totalQuestions);
    updateNavigationButtons(stepIndex);
  }

  /**
   * Calculates scores and renders the results screen.
   */
  function showResults() {
    var profile = QuizEngine.getProfile();
    var cached = ApiClient.getCachedData();

    if (!cached || !cached.programs || !cached.courses) {
      UI.showError('Data not available. Please restart the quiz.');
      return;
    }

    var programs = cached.programs;
    var courses = cached.courses;

    var results = Matching.calculateScores(profile, programs, courses);
    lastResults = results;
    UI.renderResults(results, CareerData);
  }

  /**
   * Restarts the quiz: resets QuizEngine, shows Welcome without re-fetching API.
   */
  function handleRestart() {
    QuizEngine.reset();
    showToast('🎉 Thank you for taking the quiz!');
    UI.showScreen('screen-welcome');
    // Data is still cached — button stays enabled
  }

  /**
   * Retries loading data after an error.
   */
  function handleRetry() {
    initialize();
  }

  // ── Navigation Button State ───────────────────────────────────────────

  /**
   * Updates the enabled/disabled state of Previous and Next buttons.
   *
   * @param {number} stepIndex - Current zero-based step index
   */
  function updateNavigationButtons(stepIndex) {
    // "Previous" disabled on first question
    btnPrev.disabled = (stepIndex === 0);

    // "Next" — check if current question requires validation
    updateNextButtonState();
  }

  /**
   * Updates the "Next" button state based on current selection.
   * For competencies (multi), requires at least 1 selection.
   * For single-select, requires a selection.
   */
  function updateNextButtonState() {
    var selection = UI.getSelection();

    if (selection === null) {
      btnNext.disabled = true;
    } else if (Array.isArray(selection)) {
      // Multi-select: need at least 1
      btnNext.disabled = (selection.length < 1);
    } else {
      // Single-select: has a value
      btnNext.disabled = false;
    }
  }

  var currentStepIndex = 0;

  /**
   * Derives the current step index from QuizEngine's current question.
   */
  function getStepIndex() {
    return currentStepIndex;
  }

  // ── Selection Change Monitoring ───────────────────────────────────────

  /**
   * Monitors clicks on the question container to update the Next button
   * state whenever the user selects or deselects an option.
   */
  function setupSelectionMonitoring() {
    var questionContainer = document.getElementById('question-container');
    if (questionContainer) {
      questionContainer.addEventListener('click', function () {
        // Defer to next tick so UI module updates _currentSelection first
        setTimeout(updateNextButtonState, 0);
      });
      questionContainer.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          setTimeout(updateNextButtonState, 0);
        }
      });
    }
  }

  // ── Event Binding ─────────────────────────────────────────────────────

  function bindEvents() {
    btnStart.addEventListener('click', function () {
      if (!dataLoaded) return;
      startQuiz();
    });

    btnNext.addEventListener('click', handleNext);
    btnPrev.addEventListener('click', handlePrev);
    btnRestart.addEventListener('click', handleRestart);
    btnRetry.addEventListener('click', handleRetry);

    if (btnDownload) {
      btnDownload.addEventListener('click', function () {
        ResultsExport.downloadResults();
      });
    }

    if (btnEmail) {
      btnEmail.addEventListener('click', function () {
        if (lastResults) {
          ResultsExport.sendEmail(lastResults, CareerData);
        }
      });
    }

    setupSelectionMonitoring();
    setupFeedback();
  }

  // ── Toast Notification ──────────────────────────────────────────────

  function showToast(message, duration) {
    duration = duration || 3000;
    var toast = document.getElementById('toast');
    var toastMessage = document.getElementById('toast-message');
    if (!toast || !toastMessage) return;

    toastMessage.textContent = message;
    toast.hidden = false;

    // Trigger reflow then show
    void toast.offsetWidth;
    toast.classList.add('visible');

    setTimeout(function () {
      toast.classList.remove('visible');
      setTimeout(function () {
        toast.hidden = true;
      }, 300);
    }, duration);
  }

  // ── Feedback ──────────────────────────────────────────────────────────

  function setupFeedback() {
    var feedbackSection = document.getElementById('feedback-section');
    var feedbackText = document.getElementById('feedback-text');
    var btnFeedbackSubmit = document.getElementById('btn-feedback-submit');
    var feedbackThanks = document.getElementById('feedback-thanks');
    var selectedRating = 0;

    if (!feedbackSection || !btnFeedbackSubmit) return;

    // Star rating selection
    var stars = feedbackSection.querySelectorAll('.feedback-star');
    for (var i = 0; i < stars.length; i++) {
      stars[i].addEventListener('click', function () {
        selectedRating = parseInt(this.getAttribute('data-rating'), 10);
        for (var j = 0; j < stars.length; j++) {
          if (j < selectedRating) {
            stars[j].classList.add('active');
          } else {
            stars[j].classList.remove('active');
          }
        }
        btnFeedbackSubmit.disabled = false;
      });
      stars[i].addEventListener('mouseenter', function () {
        var hoverRating = parseInt(this.getAttribute('data-rating'), 10);
        for (var j = 0; j < stars.length; j++) {
          if (j < hoverRating) {
            stars[j].style.color = '#f0c040';
          } else {
            stars[j].style.color = '';
          }
        }
      });
      stars[i].addEventListener('mouseleave', function () {
        for (var j = 0; j < stars.length; j++) {
          stars[j].style.color = '';
        }
      });
    }

    // Submit feedback
    btnFeedbackSubmit.addEventListener('click', function () {
      var feedback = {
        rating: selectedRating,
        suggestion: feedbackText ? feedbackText.value.trim() : '',
        timestamp: new Date().toISOString()
      };

      // Store in localStorage (no backend)
      try {
        var stored = JSON.parse(localStorage.getItem('mynextstep_feedback') || '[]');
        stored.push(feedback);
        localStorage.setItem('mynextstep_feedback', JSON.stringify(stored));
      } catch (e) {
        // localStorage not available — silently ignore
      }

      // Show thank you message
      btnFeedbackSubmit.hidden = true;
      if (feedbackText) feedbackText.hidden = true;
      feedbackThanks.hidden = false;

      // Hide emoji buttons
      var ratingDiv = feedbackSection.querySelector('.feedback-rating');
      if (ratingDiv) ratingDiv.hidden = true;

      // Show toast
      showToast('🎉 Thank you for taking the quiz!');
    });
  }

  // ── Boot ──────────────────────────────────────────────────────────────

  bindEvents();
  initialize();
})();
