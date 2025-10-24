// src/navigator/index.js

const { chromium } = require('playwright');

class Navigator {
  constructor() {
    this.browser = null;
    this.page = null;
  }

  /**
   * Initializes the browser and creates a new page.
   */
  async init() {
    this.browser = await chromium.launch();
    this.page = await this.browser.newPage();
  }

  /**
   * Executes a series of low-level browser actions.
   * @param {Array<object>} actions - A list of actions to perform.
   */
  async execute(actions) {
    for (const action of actions) {
      switch (action.type) {
        case 'navigate':
          await this.page.goto(action.url);
          break;
        case 'type':
          await this.page.locator(action.selector).type(action.text);
          break;
        case 'click':
          await this.page.locator(action.selector).first().click();
          break;
        default:
          throw new Error(`Unsupported action type: ${action.type}`);
      }
    }
  }

  /**
   * Closes the browser.
   */
  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

module.exports = Navigator;
