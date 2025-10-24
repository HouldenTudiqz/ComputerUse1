// src/verifier/index.js

class Verifier {
  /**
   * Verifies that the success criteria have been met.
   * @param {string} goal - The user's goal.
   * @param {import('playwright').Page} page - The Playwright page object.
   * @returns {Promise<boolean>} True if the goal is achieved, false otherwise.
   */
  async verify(goal, page) {
    console.log('Verifier: Verifying the goal:', goal);

    if (goal.includes('weather in Tokyo')) {
      const pageContent = await page.textContent('body');
      const hasWeatherInfo = pageContent.includes('°C') || pageContent.includes('°F') || pageContent.toLowerCase().includes('weather');
      return hasWeatherInfo;
    }

    return false;
  }
}

module.exports = Verifier;
