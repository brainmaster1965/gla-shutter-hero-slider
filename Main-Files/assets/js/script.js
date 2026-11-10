/**
 * ==============================================================================
 * Project Name: Gla Shutter Hero Slider
 * Description: Dynamic JSON parser and slider engine (Shutter + Parallax)
 * Version: 2.3.0
 * Author: WebDevGLa
 * License: Commercial / MIT
 * ==============================================================================
 */

/**
 * Escapes a value for safe use inside an HTML attribute (alt, href).
 * Text fields (title, topic, description, ...) are intentionally NOT escaped,
 * so simple markup like <br> or <em> in slides.json keeps working.
 */
function escapeAttr(value) {
	return String(value)
		.replace(/&/g, '&amp;')
		.replace(/"/g, '&quot;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;');
}

/**
 * Shows a visible error message inside the slider instead of a black screen.
 */
function showSliderError(container, error) {
	const list = container.querySelector('.slide-list');
	if (!list) return;
	const hint =
		location.protocol === 'file:'
			? ' Please open this page through a local web server (e.g. VS Code Live Server) instead of file:// – see Documentation.'
			: '';
	list.innerHTML = '';
	const box = document.createElement('div');
	box.className = 'slide-error';
	box.textContent = `Slider could not be loaded: ${error.message}.${hint}`;
	list.appendChild(box);
}

document.addEventListener('DOMContentLoaded', async () => {
	const sliderContainer = document.querySelector('.wp-block-gla-heroslider');
	if (!sliderContainer) return;

	try {
		// Fetch JSON data from new object structure
		const response = await fetch('assets/json/slides.json');
		if (!response.ok) throw new Error('Fehler beim Laden der slides.json');
		const data = await response.json();

		// Extract slides object and convert to array
		const slidesObj = data.slides;
		if (!slidesObj) throw new Error("Keine 'slides' in der JSON gefunden.");
		const slides = Object.values(slidesObj);

		if (slides.length === 0) return;

		// Build DOM dynamically based on JSON slides
		const slideListDom = sliderContainer.querySelector('.slide-list');
		slideListDom.innerHTML = '';

		slides.forEach((slide, index) => {
			const isActive = index === 0 ? ' active' : '';
			const slideNrClass = ` slide-${index + 1}`;

			// Compile inline CSS variables for styling
			const authorColor = slide.authorColor || '#ffffff';
			const authorSize = (slide.authorFontSize || 14) + 'px';
			const authorFamily =
				slide.authorFontFamily || '"Open Sans", sans-serif';
			const titleColor = slide.titleColor || '#ffffff';
			const titleSize = (slide.titleFontSize || 48) + 'px';
			const titleFamily =
				slide.titleFontFamily || '"Open Sans", sans-serif';
			const topicColor = slide.topicColor || '#f1683a';
			const topicSize = (slide.topicFontSize || 48) + 'px';
			const topicFamily =
				slide.topicFontFamily || '"Open Sans", sans-serif';

			let styles =
				`--slider-author-color: ${authorColor}; --slider-author-size: ${authorSize}; --slider-author-font: ${authorFamily}; ` +
				`--slider-title-color: ${titleColor}; --slider-title-size: ${titleSize}; --slider-title-font: ${titleFamily};  ` +
				`--slider-topic-color: ${topicColor}; --slider-topic-size: ${topicSize}; --slider-topic-font: ${topicFamily};`;

			// Helper to generate button styles dynamically
			const getButtonStyles = (prefix, s) => {
				let bStyles = [];
				if (s[prefix + 'Color'])
					bStyles.push(
						`--slider-${prefix}-color: ${s[prefix + 'Color']};`,
					);
				if (s[prefix + 'TextColor'])
					bStyles.push(
						`--slider-${prefix}-textcolor: ${s[prefix + 'TextColor']};`,
					);
				if (s[prefix + 'HoverColor'])
					bStyles.push(
						`--slider-${prefix}-hovercolor: ${s[prefix + 'HoverColor']};`,
					);
				if (s[prefix + 'HoverTextColor'])
					bStyles.push(
						`--slider-${prefix}-hovertextcolor: ${s[prefix + 'HoverTextColor']};`,
					);
				if (s[prefix + 'BorderRadius'])
					bStyles.push(
						`--slider-${prefix}-borderradius: ${s[prefix + 'BorderRadius']}px;`,
					);
				if (s[prefix + 'OutlineColor'])
					bStyles.push(
						`--slider-${prefix}-outlinecolor: ${s[prefix + 'OutlineColor']};`,
					);
				if (s[prefix + 'OutlineWidth'])
					bStyles.push(
						`--slider-${prefix}-outlinewidth: ${s[prefix + 'OutlineWidth']}px;`,
					);
				return bStyles.join(' ');
			};

			styles += ' ' + getButtonStyles('button1', slide);
			styles += ' ' + getButtonStyles('button2', slide);

			const showContent = slide.showContent || {};
			const anyVisible = Object.values(showContent).some(
				(val) => val === true,
			);

			// Dynamically determine alignment class from JSON (e.g. center-right, center-left)
			const alignmentClass = slide.alignment
				? `align-${slide.alignment}`
				: 'align-center-center';

			// Generate HTML markup for each slide
			const slideItemHTML = `
                <div class="slide-item${isActive}${slideNrClass}" style="${styles}">
                    <div class="slide-wrapper">
                        ${slide.imageUrl ? `<img src="${escapeAttr(slide.imageUrl)}" alt="${escapeAttr(slide.title || '')}" />` : ''}
                        
                        ${
							anyVisible
								? `
                            <div class="slide-content ${alignmentClass}">
                                ${showContent.author && slide.author ? `<div class="slide-author">${slide.author}</div>` : ''}
                                ${showContent.title && slide.title ? `<div class="slide-title">${slide.title}</div>` : ''}
                                ${showContent.topic && slide.topic ? `<div class="slide-topic">${slide.topic}</div>` : ''}
                                ${showContent.description && slide.description ? `<div class="slide-description">${slide.description}</div>` : ''}
                                
                                ${
									showContent.button1 || showContent.button2
										? `
                                    <div class="slide-buttons">
                                        ${
											showContent.button1 &&
											slide.button1Text
												? `
                                            <a href="${escapeAttr(slide.button1Url || '#')}" class="button-1 ${slide.button1Outline ? 'has-outline' : ''}">${slide.button1Text}</a>
                                        `
												: ''
										}
                                        ${
											showContent.button2 &&
											slide.button2Text
												? `
                                            <a href="${escapeAttr(slide.button2Url || '#')}" class="button-2 ${slide.button2Outline ? 'has-outline' : ''}">${slide.button2Text}</a>
                                        `
												: ''
										}
                                    </div>
                                `
										: ''
								}
                            </div>
                        `
								: ''
						}
                    </div>
                </div>
            `;
			slideListDom.insertAdjacentHTML('beforeend', slideItemHTML);
		});

		// Initialize slider engine functionality
		initializeSliderEngine(sliderContainer);
	} catch (error) {
		console.error('Fehler beim Initialisieren des Sliders:', error);
		showSliderError(sliderContainer, error);
	}
});

/**
 * Core Slider Engine handling navigation, animations, autoplay, parallax, touch/mouse swipe gestures, and configurable stop-on-hover.
 */
function initializeSliderEngine(sliderContainer) {
	let nextDom = sliderContainer.querySelector('#next');
	let prevDom = sliderContainer.querySelector('#prev');
	let sliderDom = sliderContainer.querySelector('.slide-list');
	let paginationDom = sliderContainer.querySelector('.slide-pagination');
	let isPaused = false;
	let isHovering = false;

	const isAutoplayEnabled = sliderContainer.dataset.autoplay === 'true';
	const dynamicInterval = parseInt(sliderContainer.dataset.interval) || 7000;
	const isStopOnHoverEnabled =
		sliderContainer.dataset.stopOnHover !== 'false';

	if (!nextDom || !prevDom || !sliderDom || !paginationDom) return;

	// Shutter duration is defined once in CSS (--shutter-duration), fallback 1500ms
	let timeRunning = readShutterDuration(sliderContainer);
	let timeAutoNext = dynamicInterval;

	let numItems = sliderDom.querySelectorAll('.slide-item').length;
	let globalCurrentIndex = 0;
	let runTimeOut;
	let runNextAuto;

	// Keeps keyboard focus and screen readers out of the hidden slides
	function syncSlideA11y() {
		sliderDom.querySelectorAll('.slide-item').forEach((item) => {
			item.inert = !item.classList.contains('active');
		});
	}

	function updatePaginationClass(newIndex) {
		let allButtons = paginationDom.querySelectorAll('button');
		allButtons.forEach((btn) => {
			btn.classList.remove('active');
			btn.removeAttribute('aria-current');
		});
		if (allButtons[newIndex]) {
			allButtons[newIndex].classList.add('active');
			allButtons[newIndex].setAttribute('aria-current', 'true');
		}
		updateValidPaginationState();
	}

	function updateValidPaginationState() {
		let allButtons = paginationDom.querySelectorAll('button');
		allButtons.forEach((btn, idx) => {
			let isNextNeighbor = idx === (globalCurrentIndex + 1) % numItems;
			let isPrevNeighbor =
				idx === (globalCurrentIndex - 1 + numItems) % numItems;
			let isActive = idx === globalCurrentIndex;

			if (isNextNeighbor || isPrevNeighbor || isActive) {
				btn.style.opacity = '1';
				btn.style.cursor = 'pointer';
				btn.style.pointerEvents = 'auto';
			} else {
				// btn.style.opacity = '0.3';
				btn.style.cursor = 'default';
				btn.style.pointerEvents = 'none';
			}
		});
	}

	function releaseUI() {
		nextDom.style.pointerEvents = '';
		prevDom.style.pointerEvents = '';
		paginationDom.classList.remove('is-disabled');
		sliderContainer.classList.remove('is-animating');
		updateValidPaginationState();
	}

	function initPagination() {
		paginationDom.innerHTML = '';
		for (let i = 0; i < numItems; i++) {
			let button = document.createElement('button');
			button.dataset.index = i;
			button.setAttribute('aria-label', `Go to slide ${i + 1}`);
			if (i === 0) {
				button.classList.add('active');
				button.setAttribute('aria-current', 'true');
			}

			button.onclick = function () {
				let targetIndex = parseInt(this.dataset.index);
				let activeIndex = globalCurrentIndex;

				let isNextNeighbor =
					targetIndex === (activeIndex + 1) % numItems;
				let isPrevNeighbor =
					targetIndex === (activeIndex - 1 + numItems) % numItems;

				if (
					(isNextNeighbor || isPrevNeighbor) &&
					!sliderContainer.classList.contains('is-animating')
				) {
					if (isAutoplayEnabled) resetAutoPlay();

					nextDom.style.pointerEvents = 'none';
					prevDom.style.pointerEvents = 'none';
					paginationDom.classList.add('is-disabled');
					sliderContainer.classList.add('is-animating');

					let direction = isNextNeighbor ? 'next' : 'prev';

					showSlider(direction, false);
					setTimeout(() => {
						releaseUI();
					}, timeRunning);
				}
			};
			paginationDom.appendChild(button);
		}
		updateValidPaginationState();
	}

	function resetAutoPlay() {
		if (!isAutoplayEnabled || isPaused) return;
		clearTimeout(runNextAuto);
		runNextAuto = setTimeout(() => {
			nextDom.click();
		}, timeAutoNext);
	}

	function showSlider(type, autoPlayReset = true) {
		let sliderItemsDom = sliderDom.querySelectorAll('.slide-item');

		if (type === 'next') {
			sliderContainer.classList.add('next');
			globalCurrentIndex = (globalCurrentIndex + 1) % numItems;

			setTimeout(() => {
				sliderItemsDom[0].classList.remove('active');
				sliderDom.appendChild(sliderItemsDom[0]);
				sliderDom
					.querySelector('.slide-item:nth-child(1)')
					.classList.add('active');
				syncSlideA11y();
				updatePaginationClass(globalCurrentIndex);
			}, timeRunning);
		} else {
			sliderContainer.classList.add('prev');
			globalCurrentIndex = (globalCurrentIndex - 1 + numItems) % numItems;

			sliderItemsDom[0].classList.remove('active');
			sliderDom.prepend(sliderItemsDom[sliderItemsDom.length - 1]);
			sliderDom
				.querySelector('.slide-item:nth-child(1)')
				.classList.add('active');
			syncSlideA11y();
			updatePaginationClass(globalCurrentIndex);
		}

		clearTimeout(runTimeOut);
		runTimeOut = setTimeout(() => {
			sliderContainer.classList.remove('next');
			sliderContainer.classList.remove('prev');
		}, timeRunning);

		if (autoPlayReset) resetAutoPlay();
	}

	nextDom.onclick = () => {
		if (sliderContainer.classList.contains('is-animating')) return;
		sliderContainer.classList.add('is-animating');
		showSlider('next');
		setTimeout(() => releaseUI(), timeRunning);
	};

	prevDom.onclick = () => {
		if (sliderContainer.classList.contains('is-animating')) return;
		sliderContainer.classList.add('is-animating');
		showSlider('prev');
		setTimeout(() => releaseUI(), timeRunning);
	};

	// Configurable Pause-on-Hover Handler
	sliderContainer.addEventListener('mouseenter', () => {
		isHovering = true;
		if (!isStopOnHoverEnabled) return;
		isPaused = true;
		clearTimeout(runNextAuto);
	});

	sliderContainer.addEventListener('mouseleave', () => {
		isHovering = false;
		if (!isStopOnHoverEnabled) return;
		isPaused = false;
		if (isAutoplayEnabled) resetAutoPlay();
	});

	// Touch & Mouse Swipe Gestures Support
	let startX = 0;
	let endX = 0;
	let isDragging = false;
	const minSwipeDistance = 50;

	sliderContainer.addEventListener(
		'touchstart',
		(e) => {
			startX = e.changedTouches[0].screenX;
			isPaused = true;
			clearTimeout(runNextAuto);
		},
		{ passive: true },
	);

	sliderContainer.addEventListener(
		'touchend',
		(e) => {
			endX = e.changedTouches[0].screenX;
			handleSwipe(true);
		},
		{ passive: true },
	);

	// Browser aborted the gesture (e.g. vertical scroll took over): resume autoplay
	sliderContainer.addEventListener(
		'touchcancel',
		() => {
			isPaused = false;
			if (isAutoplayEnabled) resetAutoPlay();
		},
		{ passive: true },
	);

	sliderContainer.addEventListener('mousedown', (e) => {
		if (e.target.closest('a') || e.target.closest('button')) return;
		startX = e.clientX;
		isDragging = true;
		isPaused = true;
		clearTimeout(runNextAuto);
		e.preventDefault();
	});

	window.addEventListener('mouseup', (e) => {
		if (!isDragging) return;
		endX = e.clientX;
		isDragging = false;
		handleSwipe();
	});

	sliderContainer.addEventListener('mouseleave', () => {
		if (isDragging) {
			isDragging = false;
			isPaused = false;
			if (isAutoplayEnabled) resetAutoPlay();
		}
	});

	// Swipes go through the arrow buttons, so the is-animating lock always applies
	function handleSwipe(fromTouch = false) {
		let distance = endX - startX;

		if (Math.abs(distance) >= minSwipeDistance) {
			if (distance < 0) {
				nextDom.click();
			} else {
				prevDom.click();
			}
		}

		// After a mouse drag the pointer is usually still over the slider
		isPaused = !fromTouch && isStopOnHoverEnabled && isHovering;
		if (!isPaused && isAutoplayEnabled) resetAutoPlay();
	}

	if (!prevDom.hasAttribute('aria-label'))
		prevDom.setAttribute('aria-label', 'Previous slide');
	if (!nextDom.hasAttribute('aria-label'))
		nextDom.setAttribute('aria-label', 'Next slide');

	sliderDom.querySelector('.slide-item:nth-child(1)').classList.add('active');
	syncSlideA11y();
	initPagination();

	if (isAutoplayEnabled) {
		runNextAuto = setTimeout(() => {
			nextDom.click();
		}, timeAutoNext);
	}

	// Parallax & Ready State Handler
	const updateParallax = () => {
		const rect = sliderContainer.getBoundingClientRect();
		const viewportHeight = window.innerHeight;
		if (rect.top <= viewportHeight && rect.bottom >= 0) {
			const totalDistance = viewportHeight + rect.height;
			const currentProgress = (viewportHeight - rect.top) / totalDistance;
			const maxMovement = viewportHeight * 0.5;
			sliderContainer.style.setProperty(
				'--parallax-offset',
				`${-(currentProgress * maxMovement)}px`,
			);
		}
	};

	updateParallax();
	window.requestAnimationFrame(() => {
		sliderContainer.classList.add('is-ready');
	});
	window.addEventListener('scroll', updateParallax, { passive: true });
}

/**
 * Reads the shutter duration (ms) from the CSS custom property --shutter-duration.
 * Supports "1500ms" and "1.5s". Falls back to 1500ms.
 */
function readShutterDuration(container) {
	const raw = getComputedStyle(container)
		.getPropertyValue('--shutter-duration')
		.trim();
	const value = parseFloat(raw);
	if (!Number.isFinite(value) || value <= 0) return 1500;
	return raw.endsWith('ms') ? value : value * 1000;
}
