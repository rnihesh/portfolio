/**
 * Text Split Utility
 * Manual SplitText alternative for staggered text animations
 * Splits text into characters or words for GSAP animations
 */

/**
 * Split text content into individual spans for animation
 * @param {HTMLElement} element - The element containing text to split
 * @param {Object} options - Configuration options
 * @param {string} options.type - Split type: 'chars', 'words', or 'both' (default: 'chars')
 * @param {string} options.charClass - Class name for character spans (default: 'split-char')
 * @param {string} options.wordClass - Class name for word spans (default: 'split-word')
 * @returns {Object} Object containing arrays of chars and/or words elements
 */
export function splitText(element, options = {}) {
  if (!element) return { chars: [], words: [] };

  const { type = "chars", charClass = "split-char", wordClass = "split-word" } = options;

  // Store original HTML for revert
  if (!element.dataset.originalHtml) {
    element.dataset.originalHtml = element.innerHTML;
  }

  const text = element.textContent;
  const words = text.split(/\s+/).filter(Boolean);
  const result = { chars: [], words: [] };

  let html = "";

  if (type === "words" || type === "both") {
    // Split into words only
    words.forEach((word, wordIndex) => {
      if (type === "both") {
        // Split each word into characters
        let wordHtml = `<span class="${wordClass}" data-word="${wordIndex}">`;
        [...word].forEach((char, charIndex) => {
          wordHtml += `<span class="${charClass}" data-char="${charIndex}">${char}</span>`;
        });
        wordHtml += "</span>";
        html += wordHtml;
      } else {
        html += `<span class="${wordClass}" data-word="${wordIndex}">${word}</span>`;
      }
      // Add space between words (except last)
      if (wordIndex < words.length - 1) {
        html += " ";
      }
    });
  } else {
    // Split into characters only (preserving spaces)
    let charIndex = 0;
    [...text].forEach((char) => {
      if (char === " ") {
        html += " ";
      } else {
        html += `<span class="${charClass}" data-char="${charIndex}">${char}</span>`;
        charIndex++;
      }
    });
  }

  element.innerHTML = html;

  // Collect created elements
  result.chars = Array.from(element.querySelectorAll(`.${charClass}`));
  result.words = Array.from(element.querySelectorAll(`.${wordClass}`));

  return result;
}

/**
 * Revert split text back to original content
 * @param {HTMLElement} element - The element to revert
 */
export function revertSplit(element) {
  if (!element) return;

  if (element.dataset.originalHtml) {
    element.innerHTML = element.dataset.originalHtml;
    delete element.dataset.originalHtml;
  }
}

/**
 * Split multiple elements at once
 * @param {string|NodeList|HTMLElement[]} selector - CSS selector or element collection
 * @param {Object} options - Same options as splitText
 * @returns {Object} Combined result with all chars and words from all elements
 */
export function splitTextAll(selector, options = {}) {
  const elements =
    typeof selector === "string" ? document.querySelectorAll(selector) : selector;

  const result = { chars: [], words: [], elements: [] };

  elements.forEach((element) => {
    const split = splitText(element, options);
    result.chars.push(...split.chars);
    result.words.push(...split.words);
    result.elements.push(element);
  });

  return result;
}

/**
 * Revert multiple split elements
 * @param {string|NodeList|HTMLElement[]} selector - CSS selector or element collection
 */
export function revertSplitAll(selector) {
  const elements =
    typeof selector === "string" ? document.querySelectorAll(selector) : selector;

  elements.forEach((element) => revertSplit(element));
}
