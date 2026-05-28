// CareerCompass — Results Export
// Provides download (print-to-PDF) and email (mailto) export of quiz results.
// Zero external dependencies — uses window.print() and mailto: links.

(function () {
  'use strict';

  var DISCLAIMER = 'These are suggestions to explore — not enrollment decisions. ' +
    'Your match score reflects competency alignment with program coursework.';

  var QUIZ_URL = 'https://victorlavalle.github.io/CareerCompass/';

  /**
   * Builds a plain-text summary of the top N results.
   *
   * @param {Array} results - Match results array from Matching.calculateScores()
   * @param {object} careerData - CareerData module with getOutlook()
   * @param {number} [count=5] - Number of top results to include
   * @returns {string} Plain-text summary
   */
  function buildTextSummary(results, careerData, count) {
    count = count || 5;
    var top = results.slice(0, count);

    var lines = [];
    lines.push('CareerCompass — Your Program Matches');
    lines.push('==================================');
    lines.push('');
    lines.push('Based on your quiz answers, here are your top program matches:');
    lines.push('');

    for (var i = 0; i < top.length; i++) {
      var r = top[i];
      var line = (i + 1) + '. ' + r.programName + ' — ' + r.matchScore + '% match';
      lines.push(line);
      lines.push('   School: ' + r.college + ' | Type: ' + formatType(r.type));

      // Include top career role for the first match
      if (i === 0 && careerData) {
        var roles = careerData.getOutlook(r.programId);
        if (roles && roles.length > 0) {
          var role = roles[0];
          var salary = role.marketInfo || '';
          lines.push('   Top career: ' + role.title + ' (' + salary + ')');
        }
      }
      lines.push('');
    }

    lines.push('--');
    lines.push('');
    lines.push('' + DISCLAIMER);
    lines.push('');
    lines.push('Take the quiz again: ' + QUIZ_URL);
    lines.push('Learn more: github.com/VictorLavalle/CareerCompass');

    return lines.join('\n');
  }

  /**
   * Formats program type for display.
   */
  function formatType(type) {
    if (type === 'undergraduate') return "Bachelor's";
    if (type === 'graduate') return "Master's";
    return type || 'N/A';
  }

  /**
   * Triggers the browser print dialog for the results screen.
   * The @media print styles in styles.css handle formatting.
   */
  function downloadResults() {
    window.print();
  }

  /**
   * Opens the user's email client with a pre-filled summary of results.
   *
   * @param {Array} results - Match results array
   * @param {object} careerData - CareerData module
   */
  function sendEmail(results, careerData) {
    var subject = 'My CareerCompass Results — Program Recommendations';
    var body = buildTextSummary(results, careerData, 5);

    var mailto = 'mailto:?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(body);

    window.location.href = mailto;
  }

  // ── Expose on namespace ───────────────────────────────────────────────

  window.CareerCompass = window.CareerCompass || {};
  window.CareerCompass.ResultsExport = {
    downloadResults: downloadResults,
    sendEmail: sendEmail,
    buildTextSummary: buildTextSummary
  };
})();
