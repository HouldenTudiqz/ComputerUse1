// src/perception/index.js

class Perception {
  /**
   * Extracts and summarizes visible content from the page.
   * @param {import('playwright').Page} page - The Playwright page object.
   * @returns {Promise<object>} A structured summary of the page content.
   */
  async summarize(page) {
    const url = page.url();
    const title = await page.title();

    const interactiveElements = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('a, button, input'));
      return elements.map(el => ({
        tag: el.tagName.toLowerCase(),
        selector: el.outerHTML, // This is a simple way to get a selector, but it's not robust.
        text: el.innerText,
      }));
    });

    return {
      url,
      title,
      interactive_elements: interactiveElements,
      content_summary: `The page at ${url} has ${interactiveElements.length} interactive elements.`,
    };
  }
}

module.exports = Perception;
