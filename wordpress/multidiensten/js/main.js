/**
 * Language switcher.
 *
 * Both NL and EN copy live in the markup; CSS shows one set based on the body's
 * lang-nl / lang-en class. This script restores the saved language on load and
 * flips it when a .lang-btn is clicked, persisting the choice to localStorage.
 *
 * A `md:langchange` custom event is dispatched on every change so other scripts
 * (e.g. the jobs filter) can re-render their dynamic labels.
 */
(function () {
	'use strict';

	var STORAGE_KEY = 'language';
	var DEFAULT_LANG = 'nl';

	/**
	 * Apply a language: update <html lang>, swap the body class and the active
	 * state of the language buttons. Other body classes are preserved.
	 *
	 * @param {string} lang 'nl' or 'en'.
	 */
	function applyLanguage(lang) {
		document.documentElement.lang = lang;

		document.body.classList.remove('lang-nl', 'lang-en');
		document.body.classList.add('lang-' + lang);

		var buttons = document.querySelectorAll('.lang-btn');
		for (var i = 0; i < buttons.length; i++) {
			if (buttons[i].getAttribute('data-lang') === lang) {
				buttons[i].classList.add('active');
			} else {
				buttons[i].classList.remove('active');
			}
		}
	}

	/**
	 * Set, persist and broadcast a language change.
	 *
	 * @param {string} lang 'nl' or 'en'.
	 */
	function setLanguage(lang) {
		applyLanguage(lang);

		try {
			localStorage.setItem(STORAGE_KEY, lang);
		} catch (e) {
			// localStorage may be unavailable (private mode); ignore.
		}

		document.dispatchEvent(new CustomEvent('md:langchange', { detail: { lang: lang } }));
	}

	function init() {
		var saved = DEFAULT_LANG;
		try {
			saved = localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
		} catch (e) {
			saved = DEFAULT_LANG;
		}

		applyLanguage(saved);

		var buttons = document.querySelectorAll('.lang-btn');
		for (var i = 0; i < buttons.length; i++) {
			buttons[i].addEventListener('click', function () {
				setLanguage(this.getAttribute('data-lang'));
			});
		}

		initNavToggle();
	}

	/**
	 * Mobile hamburger menu: toggle the nav dropdown open/closed and animate the
	 * icon to an X. Closes when a nav link is tapped.
	 */
	function initNavToggle() {
		var toggle = document.getElementById('md-nav-toggle');
		var nav = document.getElementById('md-nav');
		if (!toggle || !nav) return;

		function setOpen(open) {
			toggle.classList.toggle('open', open);
			nav.classList.toggle('open', open);
			toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
		}

		toggle.addEventListener('click', function () {
			setOpen(!nav.classList.contains('open'));
		});

		var links = nav.querySelectorAll('.nav-btn');
		for (var i = 0; i < links.length; i++) {
			links[i].addEventListener('click', function () {
				setOpen(false);
			});
		}
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
})();
