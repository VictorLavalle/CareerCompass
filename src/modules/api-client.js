// CareerCompass — API Client
// Loads program/course data from embedded local JSON scripts.

(function () {
  'use strict';

  let cachedData = null;

  function loadData() {
    if (cachedData !== null) {
      return Promise.resolve(cachedData);
    }

    const source = window.__API_DATA__;
    if (!source || !Array.isArray(source.programs) || !Array.isArray(source.courses)) {
      return Promise.reject(new Error('API data not available. Ensure data-programs.js and data-courses.js are loaded.'));
    }

    cachedData = Object.freeze({ programs: Object.freeze(source.programs), courses: Object.freeze(source.courses) });
    return Promise.resolve(cachedData);
  }

  function getCachedData() {
    return cachedData;
  }

  function _clearCache() {
    cachedData = null;
  }

  window.CareerCompass = window.CareerCompass || {};
  window.CareerCompass.ApiClient = {
    loadData: loadData,
    getCachedData: getCachedData,
    _clearCache: _clearCache
  };
})();
