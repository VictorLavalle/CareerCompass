// CareerCompass — UI Renderer
// DOM rendering functions separated from business logic.

(function () {
  'use strict';

  // ── Internal State ────────────────────────────────────────────────────

  /** Tracks the current selection for the active question */
  var _currentSelection = null;

  // ── Score-to-Color Mapping ────────────────────────────────────────────

  /**
   * Maps a match score (0-100) to a color category.
   * Green [70-100], Yellow [40-69], Red [0-39].
   *
   * @param {number} score - Integer 0-100
   * @returns {string} "green" | "yellow" | "red"
   */
  function getScoreColor(score) {
    if (score >= 70) return 'green';
    if (score >= 40) return 'yellow';
    return 'red';
  }

  // ── Screen Navigation ─────────────────────────────────────────────────

  /**
   * Hides all sections with class `.screen`, shows the one with matching id
   * by adding class `.active`. Applies CSS transition.
   *
   * @param {string} screenId - The id of the screen to show (e.g., "screen-welcome")
   */
  function showScreen(screenId) {
    var screens = document.querySelectorAll('.screen');
    for (var i = 0; i < screens.length; i++) {
      screens[i].classList.remove('active');
    }
    var target = document.getElementById(screenId);
    if (target) {
      // Force reflow so CSS transition triggers on the new screen
      void target.offsetWidth;
      target.classList.add('active');
    }
  }

  // ── Loading & Error ───────────────────────────────────────────────────

  /**
   * Shows the loading screen.
   */
  function showLoading() {
    showScreen('screen-loading');
  }

  /**
   * Shows the error screen with a custom message and retry button.
   *
   * @param {string} message - Error message to display
   */
  function showError(message) {
    var errorMsg = document.getElementById('error-message');
    if (errorMsg) {
      errorMsg.textContent = message || 'An unexpected error occurred.';
    }
    showScreen('screen-error');
  }

  // ── Get Current Selection ─────────────────────────────────────────────

  /**
   * Returns the current selection for the active question.
   * For single-select questions: returns a string value or null.
   * For multi-select questions: returns an array of selected values.
   *
   * @returns {string|string[]|null}
   */
  function getSelection() {
    return _currentSelection;
  }

  // ── Question Rendering ────────────────────────────────────────────────

  /**
   * Renders a quiz question into the question container.
   * Updates the progress bar with current step info.
   *
   * @param {Question} question - The question object from QuizEngine
   * @param {number} stepIndex - Zero-based step index
   * @param {number} totalSteps - Total number of questions
   */
  function renderQuestion(question, stepIndex, totalSteps) {
    var container = document.getElementById('question-container');
    if (!container) return;

    // Reset selection state
    _currentSelection = question.type === 'multi' ? [] : null;

    // ── Update progress bar ──
    _updateProgressBar(stepIndex, totalSteps);

    // ── Build question HTML ──
    var html = '';
    html += '<h2 class="question-text">' + _escapeHtml(question.text) + '</h2>';

    if (question.type === 'multi') {
      html += _renderMultiQuestion(question);
    } else {
      html += _renderSingleQuestion(question);
    }

    container.innerHTML = html;

    // ── Attach event listeners ──
    if (question.type === 'multi') {
      _attachMultiListeners(container, question);
    } else {
      _attachSingleListeners(container, question);
    }
  }

  /**
   * Updates the progress bar with current step information.
   * Sets aria-valuenow, aria-current, fill width, and step text.
   */
  function _updateProgressBar(stepIndex, totalSteps) {
    var progressBar = document.getElementById('progress-bar');
    if (!progressBar) return;

    var stepNumber = stepIndex + 1;
    var percentage = (stepNumber / totalSteps) * 100;

    progressBar.setAttribute('aria-valuenow', String(stepNumber));
    progressBar.setAttribute('aria-valuemax', String(totalSteps));
    progressBar.setAttribute('aria-current', 'step');

    var fill = progressBar.querySelector('.progress-bar-fill');
    if (fill) {
      fill.style.width = percentage + '%';
    }

    var text = progressBar.querySelector('.progress-bar-text');
    if (text) {
      text.textContent = 'Step ' + stepNumber + ' of ' + totalSteps;
    }
  }

  // ── Multi-Select (Competencies) ───────────────────────────────────────

  /**
   * Renders a grid of selectable chips for multi-select questions.
   */
  function _renderMultiQuestion(question) {
    var html = '';
    html += '<p class="selection-counter" aria-live="polite">0 of ' + question.maxSelections + ' selected</p>';
    html += '<div class="chips-grid" role="group" aria-label="Competency options">';

    for (var i = 0; i < question.options.length; i++) {
      var opt = question.options[i];
      html += '<button type="button" class="chip" data-value="' + _escapeHtml(opt.value) + '"';
      html += ' role="checkbox" aria-checked="false"';
      html += ' aria-label="' + _escapeHtml(opt.label) + '">';
      html += '<span class="chip-label">' + _escapeHtml(opt.label) + '</span>';
      if (opt.description) {
        html += '<span class="chip-description">' + _escapeHtml(opt.description) + '</span>';
      }
      html += '</button>';
    }

    html += '</div>';
    return html;
  }

  /**
   * Attaches click/keyboard listeners to multi-select chips.
   * Handles toggle, max selection limit, counter update, and visual feedback.
   */
  function _attachMultiListeners(container, question) {
    var chips = container.querySelectorAll('.chip');
    var counter = container.querySelector('.selection-counter');
    var maxSel = question.maxSelections || 3;

    for (var i = 0; i < chips.length; i++) {
      chips[i].addEventListener('click', function () {
        var value = this.getAttribute('data-value');
        var idx = _currentSelection.indexOf(value);

        if (idx > -1) {
          // Deselect
          _currentSelection.splice(idx, 1);
          this.classList.remove('selected');
          this.setAttribute('aria-checked', 'false');
        } else if (_currentSelection.length < maxSel) {
          // Select
          _currentSelection.push(value);
          this.classList.add('selected');
          this.setAttribute('aria-checked', 'true');
        }
        // If at max and trying to add, do nothing (selection disabled)

        // Update counter
        if (counter) {
          counter.textContent = _currentSelection.length + ' of ' + maxSel + ' selected';
        }

        // Update disabled visual state on all chips
        _updateChipStates(container, maxSel);
      });

      // Keyboard support: Enter and Space toggle
      chips[i].addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.click();
        }
      });
    }
  }

  /**
   * Updates visual disabled state on chips when max selections reached.
   */
  function _updateChipStates(container, maxSel) {
    var chips = container.querySelectorAll('.chip');
    var atMax = _currentSelection.length >= maxSel;

    for (var i = 0; i < chips.length; i++) {
      var isSelected = chips[i].classList.contains('selected');
      if (atMax && !isSelected) {
        chips[i].classList.add('disabled');
        chips[i].setAttribute('aria-disabled', 'true');
      } else {
        chips[i].classList.remove('disabled');
        chips[i].removeAttribute('aria-disabled');
      }
    }
  }

  // ── Single-Select (Radio-style) ──────────────────────────────────────

  /**
   * Renders radio-style options for single-select questions.
   */
  function _renderSingleQuestion(question) {
    var html = '';
    html += '<div class="options-list" role="radiogroup" aria-label="' + _escapeHtml(question.text) + '">';

    for (var i = 0; i < question.options.length; i++) {
      var opt = question.options[i];
      html += '<button type="button" class="option-btn" data-value="' + _escapeHtml(opt.value) + '"';
      html += ' role="radio" aria-checked="false"';
      html += ' aria-label="' + _escapeHtml(opt.label) + '">';
      html += '<span class="option-label">' + _escapeHtml(opt.label) + '</span>';
      if (opt.description) {
        html += '<span class="option-description">' + _escapeHtml(opt.description) + '</span>';
      }
      html += '</button>';
    }

    html += '</div>';
    return html;
  }

  /**
   * Attaches click/keyboard listeners to single-select options.
   * Only one option can be selected at a time (radio behavior).
   */
  function _attachSingleListeners(container, question) {
    var buttons = container.querySelectorAll('.option-btn');

    for (var i = 0; i < buttons.length; i++) {
      (function(buttonElement) {
        buttonElement.addEventListener('click', function () {
          var value = this.getAttribute('data-value');

          // Deselect all
          var allButtons = container.querySelectorAll('.option-btn');
          for (var j = 0; j < allButtons.length; j++) {
            allButtons[j].classList.remove('selected');
            allButtons[j].setAttribute('aria-checked', 'false');
          }

          // Select this one
          this.classList.add('selected');
          this.setAttribute('aria-checked', 'true');
          _currentSelection = value;
        });

        // Keyboard support: Enter and Space select
        buttonElement.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.click();
          }
        });
      })(buttons[i]);
    }
  }

  // ── Results Rendering ─────────────────────────────────────────────────

  /**
   * Renders the list of Program Cards ordered by score.
   * Highlights the top card (highest score) with a "Mejor Match" badge.
   *
   * @param {MatchResult[]} matchResults - Sorted descending by matchScore
   * @param {object} careerData - CareerData module reference (has getOutlook)
   */
  function renderResults(matchResults, careerData) {
    var resultsList = document.getElementById('results-list');
    if (!resultsList) return;

    var html = '';

    for (var i = 0; i < matchResults.length; i++) {
      var result = matchResults[i];
      var color = getScoreColor(result.matchScore);
      var isTop = (i === 0);
      var cardClass = 'program-card' + (isTop ? ' top-match' : '');

      html += '<div class="' + cardClass + '" data-program-id="' + _escapeHtml(result.programId) + '"';
      html += ' role="article" aria-label="' + _escapeHtml(result.programName) + '"';
      html += ' tabindex="0">';

      // Card header (always visible)
      html += '<div class="card-header">';

      if (isTop) {
        html += '<span class="badge-top-match">⭐ Best Match</span>';
      }

      html += '<div class="card-title-row">';
      html += '<h3 class="card-title">' + _escapeHtml(result.programName) + '</h3>';
      html += '<span class="score-badge score-' + color + '" aria-label="Match score: ' + Number(result.matchScore) + ' percent">';
      html += Number(result.matchScore) + '%';
      html += '</span>';
      html += '</div>';

      html += '<div class="card-meta">';
      html += '<span class="card-college">' + _escapeHtml(result.college) + '</span>';
      html += '<span class="card-type">' + _escapeHtml(_formatType(result.type)) + '</span>';
      html += '</div>';

      html += '<p class="card-description">' + _escapeHtml(result.description) + '</p>';

      html += '<button type="button" class="card-expand-btn" aria-expanded="false" aria-label="View more details for ' + _escapeHtml(result.programName) + '">';
      html += 'View details ▼';
      html += '</button>';

      html += '</div>'; // .card-header

      // Card details (hidden by default, toggled by expandCard)
      html += '<div class="card-details" id="details-' + _escapeHtml(result.programId) + '" hidden>';
      html += '<div class="card-stats">';
      html += '<div class="stat"><span class="stat-label">Minimum Credits</span><span class="stat-value">' + Number(result.minimumCredits) + '</span></div>';
      html += '<div class="stat"><span class="stat-label">Required Courses</span><span class="stat-value">' + Number(result.requiredCoursesCount) + '</span></div>';
      html += '</div>';

      // Career Outlook section
      var roles = careerData ? careerData.getOutlook(result.programId) : [];
      if (roles.length > 0) {
        html += '<div class="career-outlook">';
        html += '<h4 class="career-outlook-title">Career Outlook</h4>';
        html += '<ul class="career-roles-list">';
        for (var j = 0; j < roles.length; j++) {
          var role = roles[j];
          html += '<li class="career-role">';
          html += '<strong class="role-title">' + _escapeHtml(role.title) + '</strong>';
          html += '<p class="role-description">' + _escapeHtml(role.description) + '</p>';
          html += '<p class="role-market">' + _escapeHtml(role.marketInfo) + '</p>';
          if (role.companies && role.companies.length > 0) {
            html += '<div class="role-companies">';
            html += '<span class="companies-label">Who\'s hiring: </span>';
            for (var k = 0; k < role.companies.length; k++) {
              if (k > 0) html += '<span class="company-sep"> · </span>';
              html += '<span class="company-name">' + _escapeHtml(role.companies[k]) + '</span>';
            }
            html += '</div>';
          }
          html += '</li>';
        }
        html += '</ul>';
        html += '</div>';
      }

      html += '</div>'; // .card-details

      html += '</div>'; // .program-card
    }

    resultsList.innerHTML = html;

    // Attach expand/collapse listeners to all cards
    _attachCardListeners(resultsList);

    showScreen('screen-results');
  }

  /**
   * Attaches click and keyboard listeners to program cards for expansion.
   */
  function _attachCardListeners(resultsList) {
    var cards = resultsList.querySelectorAll('.program-card');

    for (var i = 0; i < cards.length; i++) {
      var expandBtn = cards[i].querySelector('.card-expand-btn');
      if (expandBtn) {
        expandBtn.addEventListener('click', function (e) {
          e.stopPropagation();
          var card = this.closest('.program-card');
          var programId = card.getAttribute('data-program-id');
          expandCard(programId);
        });
      }

      // Also allow clicking the card header area or pressing Enter/Space
      cards[i].addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          var programId = this.getAttribute('data-program-id');
          expandCard(programId);
        }
      });
    }
  }

  // ── Card Expansion ────────────────────────────────────────────────────

  /**
   * Toggles expansion of a program card to show/hide details.
   *
   * @param {string} programId - The program identifier
   */
  function expandCard(programId) {
    var details = document.getElementById('details-' + programId);
    if (!details) return;

    var card = details.closest('.program-card');
    var expandBtn = card ? card.querySelector('.card-expand-btn') : null;
    var isExpanded = !details.hidden;

    if (isExpanded) {
      // Collapse
      details.hidden = true;
      if (card) card.classList.remove('expanded');
      if (expandBtn) {
        expandBtn.setAttribute('aria-expanded', 'false');
        expandBtn.textContent = 'View details ▼';
      }
    } else {
      // Expand
      details.hidden = false;
      if (card) card.classList.add('expanded');
      if (expandBtn) {
        expandBtn.setAttribute('aria-expanded', 'true');
        expandBtn.textContent = 'Hide details ▲';
      }
    }
  }

  // ── Helpers ───────────────────────────────────────────────────────────

  /**
   * Escapes HTML special characters to prevent XSS.
   */
  function _escapeHtml(str) {
    if (typeof str !== 'string') return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /**
   * Formats program type for display.
   */
  function _formatType(type) {
    if (type === 'undergraduate') return 'Undergraduate';
    if (type === 'graduate') return 'Graduate';
    return type || '';
  }

  // ── Expose on Namespace ───────────────────────────────────────────────

  window.CareerCompass = window.CareerCompass || {};
  window.CareerCompass.UI = {
    showScreen: showScreen,
    renderQuestion: renderQuestion,
    renderResults: renderResults,
    expandCard: expandCard,
    showLoading: showLoading,
    showError: showError,
    getScoreColor: getScoreColor,
    getSelection: getSelection
  };
})();
