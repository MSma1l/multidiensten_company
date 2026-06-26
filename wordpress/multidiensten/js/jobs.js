/**
 * Jobs page: client-side filtering & sorting over the server-rendered job
 * cards. Mirrors src/pages/Jobs/jobFilters.js exactly. Vanilla JS, no deps.
 */
(function () {
  'use strict';

  var grid = document.getElementById('md-jobs-grid');
  if (!grid) return; // Not the jobs page.

  var i18n = (window.MD_JOBS && window.MD_JOBS.i18n) || {};

  var toggle = document.querySelector('.filters-toggle');
  var filtersGrid = document.getElementById('md-filters-grid');
  var searchInput = document.getElementById('md-search');
  var locationSelect = document.getElementById('md-location');
  var levelSelect = document.getElementById('md-level');
  var experienceSelect = document.getElementById('md-experience');
  var hoursSelect = document.getElementById('md-hours');
  var sortSelect = document.getElementById('md-sort');
  var resultsCount = document.getElementById('md-results-count');
  var emptyEl = document.getElementById('md-empty');

  // Snapshot every card and its data once, preserving original (recommended) order.
  var cards = Array.prototype.slice.call(grid.querySelectorAll('.job-card'));
  var jobs = cards.map(function (el) {
    return {
      el: el,
      title: el.getAttribute('data-title') || '',
      titleEN: el.getAttribute('data-titleen') || '',
      desc: el.getAttribute('data-desc') || '',
      descEN: el.getAttribute('data-descen') || '',
      company: el.getAttribute('data-company') || '',
      location: el.getAttribute('data-location') || '',
      level: el.getAttribute('data-level') || '',
      experienceYears: parseInt(el.getAttribute('data-experience'), 10) || 0,
      hoursPerWeek: parseInt(el.getAttribute('data-hours'), 10) || 0,
      salaryMin: parseInt(el.getAttribute('data-salarymin'), 10) || 0,
      salaryMax: parseInt(el.getAttribute('data-salarymax'), 10) || 0,
    };
  });

  var totalJobs = jobs.length;

  function currentLang() {
    return document.body.classList.contains('lang-en') ? 'en' : 'nl';
  }

  function t(key) {
    var lang = currentLang();
    return (i18n[lang] && i18n[lang][key]) || '';
  }

  // Bounds for a range option value: "3-5" -> [3,5], "6+" -> [6, Infinity].
  function rangeBounds(value) {
    if (value.charAt(value.length - 1) === '+') {
      return [Number(value.slice(0, -1)), Infinity];
    }
    var parts = value.split('-').map(Number);
    return [parts[0], parts[1]];
  }

  // Filter the jobs that match every active criterion (mirrors jobFilters.js).
  function filterJobs() {
    var search = (searchInput && searchInput.value) || '';
    var location = (locationSelect && locationSelect.value) || '';
    var level = (levelSelect && levelSelect.value) || '';
    var experience = (experienceSelect && experienceSelect.value) || '';
    var hours = (hoursSelect && hoursSelect.value) || '';

    var terms = search
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean);

    var expBounds = experience ? rangeBounds(experience) : [0, Infinity];
    var expLo = expBounds[0];
    var expHi = expBounds[1];

    return jobs.filter(function (job) {
      var haystack = (
        job.title +
        ' ' +
        job.titleEN +
        ' ' +
        job.desc +
        ' ' +
        job.descEN +
        ' ' +
        job.company +
        ' ' +
        job.location
      ).toLowerCase();

      var matchSearch = terms.every(function (term) {
        return haystack.indexOf(term) !== -1;
      });
      var matchLocation = !location || job.location === location;
      var matchLevel = !level || job.level === level;
      var matchExperience =
        !experience || (job.experienceYears >= expLo && job.experienceYears <= expHi);
      var matchHours = !hours || job.hoursPerWeek === Number(hours);

      return matchSearch && matchLocation && matchLevel && matchExperience && matchHours;
    });
  }

  // Sort by minimum salary; anything else keeps the original order.
  function sortJobs(list) {
    var sort = (sortSelect && sortSelect.value) || 'recommended';
    if (sort !== 'salaryAsc' && sort !== 'salaryDesc') return list.slice();
    var dir = sort === 'salaryAsc' ? 1 : -1;
    return list.slice().sort(function (a, b) {
      return (a.salaryMin - b.salaryMin) * dir;
    });
  }

  function apply() {
    var matched = sortJobs(filterJobs());

    // Hide everything, then show + reorder the matches.
    jobs.forEach(function (job) {
      job.el.style.display = 'none';
    });
    matched.forEach(function (job) {
      job.el.style.display = '';
      grid.appendChild(job.el); // Reorder for sorting.
    });

    if (resultsCount) {
      resultsCount.textContent = matched.length + ' ' + t('resultsLabel');
    }

    if (emptyEl) {
      if (matched.length === 0) {
        emptyEl.textContent = totalJobs === 0 ? t('empty') : t('noResults');
        emptyEl.hidden = false;
      } else {
        emptyEl.hidden = true;
      }
    }
  }

  // Update language-dependent option labels + placeholder.
  function updateLabels() {
    var lang = currentLang();

    if (searchInput) {
      var ph = searchInput.getAttribute('data-ph-' + lang);
      searchInput.placeholder = ph || t('searchPlaceholder');
    }

    [locationSelect, levelSelect, experienceSelect, hoursSelect, sortSelect].forEach(function (sel) {
      if (!sel) return;
      Array.prototype.forEach.call(sel.options, function (opt) {
        var label = opt.getAttribute('data-' + lang);
        if (label !== null) opt.textContent = label;
      });
    });
  }

  // Collapsible filters panel.
  if (toggle && filtersGrid) {
    toggle.addEventListener('click', function () {
      var open = filtersGrid.hasAttribute('hidden');
      if (open) {
        filtersGrid.removeAttribute('hidden');
      } else {
        filtersGrid.setAttribute('hidden', '');
      }
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      var chevron = toggle.querySelector('.fa-chevron-down, .fa-chevron-up');
      if (chevron) {
        chevron.classList.toggle('fa-chevron-down', !open);
        chevron.classList.toggle('fa-chevron-up', open);
      }
    });
  }

  // Wire up the filter controls.
  [locationSelect, levelSelect, experienceSelect, hoursSelect, sortSelect].forEach(function (el) {
    if (el) el.addEventListener('change', apply);
  });
  if (searchInput) {
    searchInput.addEventListener('keyup', apply);
    searchInput.addEventListener('change', apply);
  }

  // Re-localise labels when main.js flips the language.
  document.addEventListener('md:langchange', function () {
    updateLabels();
    apply();
  });

  // Initial render.
  updateLabels();
  apply();
})();
