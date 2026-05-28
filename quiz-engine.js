// CareerCompass — Quiz Engine
// Manages the sequential quiz flow, questions, answers, and UserProfile.

(function () {
  'use strict';

  // ── Valid Competency Tags ──────────────────────────────────────────────

  var VALID_TAGS = [
    'quantitative', 'interpersonal', 'strategic', 'investigative',
    'technical', 'creative', 'caring', 'systematic'
  ];

  // ── Quiz Questions ───────────────────────────────────────────────────

  var QUESTIONS = [
    // ── Category 1: Personality (2 questions) ──
    {
      id: 'personality-teamwork',
      text: 'In a group project, what role do you prefer to take?',
      type: 'single',
      category: 'personality',
      options: [
        { value: 'organizer', label: 'Coordinate the team and define the strategy', competencyTags: ['strategic', 'interpersonal'] },
        { value: 'analyst', label: 'Analyze the data and find patterns', competencyTags: ['quantitative', 'investigative'] },
        { value: 'executor', label: 'Build the solution and solve technical problems', competencyTags: ['technical', 'systematic'] }
      ],
      maxSelections: null,
      profileKey: null,
      profileMapping: null
    },
    {
      id: 'personality-conflict',
      text: 'When there is a disagreement on your team, what do you do first?',
      type: 'single',
      category: 'personality',
      options: [
        { value: 'listen', label: 'Listen to everyone and find a middle ground', competencyTags: ['interpersonal', 'caring'] },
        { value: 'evidence', label: 'Look for objective data to make a decision', competencyTags: ['investigative', 'quantitative'] },
        { value: 'prototype', label: 'Propose a quick test to compare options', competencyTags: ['creative', 'technical'] }
      ],
      maxSelections: null,
      profileKey: null,
      profileMapping: null
    },

    // ── Category 2: Interests (2 questions) ──
    {
      id: 'interest-weekend',
      text: 'On a free weekend, what activity appeals to you most?',
      type: 'single',
      category: 'interests',
      options: [
        { value: 'volunteer', label: 'Help as a volunteer for a social cause', competencyTags: ['caring', 'interpersonal'] },
        { value: 'puzzle', label: 'Solve a puzzle or logical problem', competencyTags: ['systematic', 'quantitative'] },
        { value: 'create', label: 'Design or create something new from scratch', competencyTags: ['creative', 'technical'] }
      ],
      maxSelections: null,
      profileKey: 'careerGoal',
      profileMapping: {
        'volunteer': 'health',
        'puzzle': 'statistics',
        'create': 'tech'
      }
    },
    {
      id: 'interest-reading',
      text: 'What type of content do you prefer to read or study?',
      type: 'single',
      category: 'interests',
      options: [
        { value: 'cases', label: 'Business success stories and strategy', competencyTags: ['strategic', 'quantitative'] },
        { value: 'science', label: 'Scientific or research articles', competencyTags: ['investigative', 'systematic'] },
        { value: 'stories', label: 'Stories about people and their community impact', competencyTags: ['caring', 'creative'] }
      ],
      maxSelections: null,
      profileKey: null,
      profileMapping: null
    },

    // ── Category 3: Learning Style (2 questions) ──
    {
      id: 'style-challenge',
      text: 'How do you prefer to face a new challenge?',
      type: 'single',
      category: 'style',
      options: [
        { value: 'research', label: 'Research thoroughly before taking action', competencyTags: ['investigative', 'systematic'] },
        { value: 'experiment', label: 'Experiment directly with trial and error', competencyTags: ['technical', 'creative'] },
        { value: 'mentor', label: 'Find someone experienced and learn together', competencyTags: ['interpersonal', 'caring'] }
      ],
      maxSelections: null,
      profileKey: 'difficulty',
      profileMapping: {
        'research': 'advanced',
        'experiment': 'intermediate',
        'mentor': 'beginner'
      }
    },
    {
      id: 'style-learning',
      text: 'In what environment do you learn best?',
      type: 'single',
      category: 'style',
      options: [
        { value: 'independent', label: 'Working alone at my own pace', competencyTags: ['systematic', 'investigative'] },
        { value: 'team', label: 'Collaborating with a team on hands-on projects', competencyTags: ['interpersonal', 'strategic'] },
        { value: 'guided', label: 'With a mentor or instructor guiding me step by step', competencyTags: ['caring', 'creative'] }
      ],
      maxSelections: null,
      profileKey: 'programType',
      profileMapping: {
        'independent': 'graduate',
        'team': 'undergraduate',
        'guided': 'both'
      }
    },

    // ── Category 4: Aspirations (2 questions) ──
    {
      id: 'aspiration-impact',
      text: 'What kind of impact would you like to have in your career?',
      type: 'single',
      category: 'aspirations',
      options: [
        { value: 'innovate', label: 'Create innovative solutions that change industries', competencyTags: ['technical', 'strategic'] },
        { value: 'help', label: 'Directly improve people\'s lives', competencyTags: ['caring', 'interpersonal'] },
        { value: 'discover', label: 'Discover new knowledge through data', competencyTags: ['quantitative', 'investigative'] }
      ],
      maxSelections: null,
      profileKey: null,
      profileMapping: null
    },
    {
      id: 'aspiration-future',
      text: 'In 5 years, where do you see yourself professionally?',
      type: 'single',
      category: 'aspirations',
      options: [
        { value: 'lead', label: 'Leading a team or my own business', competencyTags: ['strategic', 'creative'] },
        { value: 'specialist', label: 'Being a recognized expert in my field', competencyTags: ['systematic', 'technical'] },
        { value: 'educator', label: 'Teaching or mentoring others', competencyTags: ['interpersonal', 'caring'] }
      ],
      maxSelections: null,
      profileKey: 'college',
      profileMapping: {
        'lead': 'Business',
        'specialist': 'Technology',
        'educator': 'Education'
      }
    }
  ];

  // ── Tag-to-College Mapping ──────────────────────────────────────────────

  var TAG_TO_COLLEGE = {
    'strategic':     'College of Business',
    'quantitative':  'College of IT',
    'technical':     'College of IT',
    'systematic':    'College of IT',
    'caring':        'College of Health',
    'interpersonal': 'College of Education',
    'investigative': 'College of Health',
    'creative':      'College of Liberal Arts'
  };

  // ── Tag-to-CareerGoal Mapping ─────────────────────────────────────────

  var TAG_TO_CAREER_GOAL = {
    'caring':        'health',
    'interpersonal': 'teaching',
    'quantitative':  'statistics',
    'systematic':    'statistics',
    'technical':     'tech',
    'creative':      'tech',
    'strategic':     'business',
    'investigative': 'health'
  };

  // ── Internal State ────────────────────────────────────────────────────

  var currentStep = 0;
  var profile = {};
  var _personalityAnswers = [];

  // ── Helpers ───────────────────────────────────────────────────────────

  /**
   * Validates an answer for the given question.
   * Throws an Error if the answer is invalid.
   */
  function validateAnswer(question, answer) {
    if (typeof answer !== 'string') {
      throw new Error('Answer to a single question must be a string');
    }
    var valid = question.options.some(function (o) { return o.value === answer; });
    if (!valid) {
      throw new Error('Invalid option: ' + answer);
    }
  }

  /**
   * Aggregates competency tags from all answers.
   * Counts frequency of each tag and returns the top 3 most frequent.
   * Tie-breaking: order of first appearance in answers.
   *
   * @returns {string[]} Array of up to 3 competency tags
   */
  function _aggregateCompetencies() {
    var tagCounts = {};
    var tagOrder = [];

    for (var i = 0; i < _personalityAnswers.length; i++) {
      var tags = _personalityAnswers[i].tags;
      for (var j = 0; j < tags.length; j++) {
        var tag = tags[j];
        if (tagCounts[tag] === undefined) {
          tagCounts[tag] = 0;
          tagOrder.push(tag);
        }
        tagCounts[tag]++;
      }
    }

    // Sort by frequency descending, tie-break by first appearance
    var sorted = tagOrder.slice();
    sorted.sort(function(a, b) {
      if (tagCounts[b] !== tagCounts[a]) {
        return tagCounts[b] - tagCounts[a];
      }
      return tagOrder.indexOf(a) - tagOrder.indexOf(b);
    });

    return sorted.slice(0, 3);
  }

  /**
   * Derives the college based on the user's dominant competency tag.
   * @returns {string} College name
   */
  function _deriveCollege() {
    var topTags = _aggregateCompetencies();
    if (topTags.length === 0) {
      return 'College of IT';
    }
    return TAG_TO_COLLEGE[topTags[0]] || 'College of IT';
  }

  /**
   * Derives the career goal based on the user's dominant competency tag.
   * @returns {string} Career goal value
   */
  function _deriveCareerGoal() {
    var topTags = _aggregateCompetencies();
    if (topTags.length === 0) {
      return 'tech';
    }
    return TAG_TO_CAREER_GOAL[topTags[0]] || 'tech';
  }

  // ── Public API ────────────────────────────────────────────────────────

  function init() {
    currentStep = 0;
    profile = {};
    _personalityAnswers = [];
    return { step: currentStep, totalQuestions: QUESTIONS.length };
  }

  function getCurrentQuestion() {
    if (currentStep < 0 || currentStep >= QUESTIONS.length) {
      return null;
    }
    return QUESTIONS[currentStep];
  }

  function answerAndNext(answer) {
    var question = QUESTIONS[currentStep];
    if (!question) {
      throw new Error('No current question');
    }

    validateAnswer(question, answer);

    // All questions store tags in _personalityAnswers
    var selectedOption = question.options.find(function(o) { return o.value === answer; });
    _personalityAnswers.push({
      questionId: question.id,
      selectedValue: answer,
      tags: selectedOption.competencyTags.slice()
    });

    // If the question also derives a profileKey, write the mapped value
    if (question.profileKey !== null && question.profileMapping !== null) {
      profile[question.profileKey] = question.profileMapping[answer];
    }

    currentStep++;
    return currentStep < QUESTIONS.length;
  }

  function goBack() {
    if (currentStep <= 0) {
      throw new Error('Already at the first question');
    }
    currentStep--;
    var question = QUESTIONS[currentStep];

    // All questions store in _personalityAnswers, so always pop
    _personalityAnswers.pop();

    // If the question also derived a profileKey, clean it
    if (question.profileKey !== null) {
      delete profile[question.profileKey];
    }

    return question;
  }

  function getProfile() {
    var copy = {};
    var keys = Object.keys(profile);
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      copy[key] = profile[key];
    }

    // Add derived competencies
    copy.competencies = _aggregateCompetencies();

    // Derive college if not directly assigned
    if (copy.college === undefined) {
      copy.college = _deriveCollege();
    }

    // Derive careerGoal if not directly assigned
    if (copy.careerGoal === undefined) {
      copy.careerGoal = _deriveCareerGoal();
    }

    return copy;
  }

  function reset() {
    currentStep = 0;
    profile = {};
    _personalityAnswers = [];
  }

  // ── Expose on namespace ───────────────────────────────────────────────

  window.CareerCompass = window.CareerCompass || {};
  window.CareerCompass.QuizEngine = {
    init: init,
    getCurrentQuestion: getCurrentQuestion,
    answerAndNext: answerAndNext,
    goBack: goBack,
    getProfile: getProfile,
    reset: reset
  };
})();
