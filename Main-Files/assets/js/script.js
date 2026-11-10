/**
 * ==============================================================================
 * Project Name: Gla Shutter Hero Slider
 * Description: Dynamic JSON parser and slider engine (Shutter + Parallax)
 * Version: 2.1.0
 * Author: WebDevGLa
 * License: Commercial / MIT
 * ==============================================================================
 */

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
                        ${slide.imageUrl ? `<img src="${slide.imageUrl}" alt="${slide.title || ''}" />` : ''}
                        
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
                                            <a href="${slide.button1Url || '#'}" class="button-1 ${slide.button1Outline ? 'has-outline' : ''}">${slide.button1Text}</a>
                                        `
												: ''
										}
                                        ${
											showContent.button2 &&
											slide.button2Text
												? `
                                            <a href="${slide.button2Url || '#'}" class="button-2 ${slide.button2Outline ? 'has-outline' : ''}">${slide.button2Text}</a>
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
	let timeDom = sliderContainer.querySelector('.slide-time');
	let isPaused = false;

	const isAutoplayEnabled = sliderContainer.dataset.autoplay === 'true';
	const dynamicInterval = parseInt(sliderContainer.dataset.interval) || 7000;
	// Konfigurierbares Attribut: Standardmäßig true, außer data-stop-on-hover="false" wird explizit gesetzt
	const isStopOnHoverEnabled =
		sliderContainer.dataset.stopOnHover !== 'false';

	if (!nextDom || !prevDom || !sliderDom || !paginationDom) return;

	let timeRunning = 1500;
	let timeAutoNext = dynamicInterval;

	// if (!isAutoplayEnabled && timeDom) {	// v2.1.0 removed
	// 	timeDom.style.display = 'none';
	// }

	let numItems = sliderDom.querySelectorAll('.slide-item').length;
	let globalCurrentIndex = 0;
	let runTimeOut;
	let runNextAuto;

	function updatePaginationClass(newIndex) {
		let allButtons = paginationDom.querySelectorAll('button');
		allButtons.forEach((btn) => btn.classList.remove('active'));
		if (allButtons[newIndex]) {
			allButtons[newIndex].classList.add('active');
		}
	}

	function initPagination() {
		paginationDom.innerHTML = '';
		for (let i = 0; i < numItems; i++) {
			let button = document.createElement('button');
			button.dataset.index = i;
			if (i === 0) button.classList.add('active');

			button.onclick = function () {
				let targetIndex = parseInt(this.dataset.index);
				let activeIndex = globalCurrentIndex;

				if (targetIndex !== activeIndex) {
					if (isAutoplayEnabled) resetAutoPlay();

					let distance = targetIndex - activeIndex;
					let clicks = Math.abs(distance);
					let isNext =
						(distance > 0 && clicks <= numItems / 2) ||
						(distance < 0 && clicks > numItems / 2);

					nextDom.style.pointerEvents = 'none';
					prevDom.style.pointerEvents = 'none';

					function executeClickSequence(k) {
						if (k >= clicks) {
							setTimeout(() => {
								nextDom.style.pointerEvents = '';
								prevDom.style.pointerEvents = '';
							}, timeRunning);
							return;
						}
						setTimeout(() => {
							showSlider(isNext ? 'next' : 'prev', false);
							executeClickSequence(k + 1);
						}, timeRunning);
					}

					showSlider(isNext ? 'next' : 'prev', false);
					if (clicks > 1) {
						executeClickSequence(1);
					} else {
						setTimeout(() => {
							nextDom.style.pointerEvents = '';
							prevDom.style.pointerEvents = '';
						}, timeRunning);
					}
				}
			};
			paginationDom.appendChild(button);
		}
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
			updatePaginationClass(globalCurrentIndex);
		}

		clearTimeout(runTimeOut);
		runTimeOut = setTimeout(() => {
			sliderContainer.classList.remove('next');
			sliderContainer.classList.remove('prev');
		}, timeRunning);

		if (autoPlayReset) resetAutoPlay();
	}

	nextDom.onclick = () => showSlider('next');
	prevDom.onclick = () => showSlider('prev');

	// Configurable Pause-on-Hover Handler
	sliderContainer.addEventListener('mouseenter', () => {
		if (!isStopOnHoverEnabled) return;
		isPaused = true;
		clearTimeout(runNextAuto);
	});

	sliderContainer.addEventListener('mouseleave', () => {
		if (!isStopOnHoverEnabled) return;
		isPaused = false;
		if (isAutoplayEnabled) resetAutoPlay();
	});

	// Touch & Mouse Swipe Gestures Support (Mobile & Desktop PC)
	let startX = 0;
	let endX = 0;
	let isDragging = false;
	const minSwipeDistance = 50;

	// Touch Events
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
			handleSwipe();
		},
		{ passive: true },
	);

	// Mouse Events (Desktop Drag Simulation)
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

	function handleSwipe() {
		let distance = endX - startX;

		if (Math.abs(distance) >= minSwipeDistance) {
			if (distance < 0) {
				showSlider('next');
			} else {
				showSlider('prev');
			}
		}

		isPaused = false;
		if (isAutoplayEnabled) resetAutoPlay();
	}

	sliderDom.querySelector('.slide-item:nth-child(1)').classList.add('active');
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
