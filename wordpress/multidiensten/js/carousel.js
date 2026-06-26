/**
 * Horizontal scroll-snap carousel — vanilla port of the React
 * components/Carousel/Carousel.jsx. Enhances any markup of the form:
 *
 *   <div class="md-carousel" data-autoplay="2000">
 *     <div class="md-carousel-viewport">
 *       <button class="md-carousel-arrow md-carousel-prev">…</button>
 *       <div class="md-carousel-track" style="--per:3"> .slide* </div>
 *       <button class="md-carousel-arrow md-carousel-next">…</button>
 *     </div>
 *     <div class="md-carousel-dots"></div>
 *   </div>
 *
 * Arrows scroll one card at a time; dots jump to a scroll position; controls
 * hide when nothing overflows (e.g. 3 cards / 3 per view on desktop). On phones
 * the CSS shows ~one card with a peek and arrows are hidden — swipe + dots.
 */
(function () {
	'use strict';

	function initCarousel(root) {
		var track = root.querySelector('.md-carousel-track');
		if (!track) return;

		var prev = root.querySelector('.md-carousel-prev');
		var next = root.querySelector('.md-carousel-next');
		var dotsWrap = root.querySelector('.md-carousel-dots');
		var autoplay = parseInt(root.getAttribute('data-autoplay'), 10) || 0;
		var paused = false;
		var index = 0;

		function slideStep() {
			var slide = track.querySelector('.md-carousel-slide');
			var gap = parseInt(getComputedStyle(track).columnGap, 10) || 0;
			return slide ? slide.offsetWidth + gap : track.clientWidth;
		}

		function maxScroll() {
			return track.scrollWidth - track.clientWidth;
		}

		function pageCount() {
			var step = slideStep();
			return step ? Math.max(1, Math.round(maxScroll() / step) + 1) : 1;
		}

		function scrollable() {
			return maxScroll() > 4;
		}

		function buildDots() {
			if (!dotsWrap) return;
			dotsWrap.innerHTML = '';
			if (!scrollable()) {
				dotsWrap.style.display = 'none';
				return;
			}
			dotsWrap.style.display = '';
			var pages = pageCount();
			for (var i = 0; i < pages; i++) {
				var dot = document.createElement('button');
				dot.type = 'button';
				dot.className = 'md-carousel-dot';
				dot.setAttribute('aria-label', 'Ga naar slide ' + (i + 1));
				(function (target) {
					dot.addEventListener('click', function () {
						track.scrollTo({ left: target * slideStep(), behavior: 'smooth' });
					});
				})(i);
				dotsWrap.appendChild(dot);
			}
			updateActive();
		}

		function updateActive() {
			var step = slideStep();
			index = step ? Math.min(pageCount() - 1, Math.round(track.scrollLeft / step)) : 0;

			if (dotsWrap) {
				var dots = dotsWrap.querySelectorAll('.md-carousel-dot');
				for (var i = 0; i < dots.length; i++) {
					if (i === index) {
						dots[i].classList.add('active');
						dots[i].setAttribute('aria-current', 'true');
					} else {
						dots[i].classList.remove('active');
						dots[i].removeAttribute('aria-current');
					}
				}
			}

			// Toggle arrow availability / visibility.
			var canScroll = scrollable();
			[prev, next].forEach(function (btn) {
				if (btn) btn.hidden = !canScroll;
			});
			if (prev) prev.disabled = track.scrollLeft <= 4;
			if (next) next.disabled = track.scrollLeft >= maxScroll() - 4;
		}

		if (prev) {
			prev.addEventListener('click', function () {
				track.scrollBy({ left: -slideStep(), behavior: 'smooth' });
			});
		}
		if (next) {
			next.addEventListener('click', function () {
				track.scrollBy({ left: slideStep(), behavior: 'smooth' });
			});
		}

		track.addEventListener('scroll', updateActive, { passive: true });
		window.addEventListener('resize', function () {
			buildDots();
			updateActive();
		});

		// Auto-advance one card on an interval; loop at the end. Pause on hover.
		if (autoplay) {
			root.addEventListener('mouseenter', function () { paused = true; });
			root.addEventListener('mouseleave', function () { paused = false; });
			setInterval(function () {
				if (paused || !scrollable()) return;
				var atEnd = track.scrollLeft >= maxScroll() - 4;
				if (atEnd) {
					track.scrollTo({ left: 0, behavior: 'smooth' });
				} else {
					track.scrollBy({ left: slideStep(), behavior: 'smooth' });
				}
			}, autoplay);
		}

		buildDots();
		updateActive();
	}

	function init() {
		var carousels = document.querySelectorAll('.md-carousel');
		for (var i = 0; i < carousels.length; i++) {
			initCarousel(carousels[i]);
		}
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
})();
