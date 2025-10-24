import { Page } from 'playwright';

/**
 * DOMManipulator handles standard DOM interactions using selectors.
 * This module provides methods for clicking, typing, reading, and manipulating DOM elements.
 */
export class DOMManipulator {
  constructor(private page: Page) {}

  /**
   * Click an element by selector
   */
  async click(selector: string): Promise<void> {
    await this.page.click(selector);
  }

  /**
   * Type text into an input field
   */
  async type(selector: string, text: string, delay: number = 0): Promise<void> {
    await this.page.fill(selector, text);
    if (delay > 0) {
      await this.page.type(selector, text, { delay });
    }
  }

  /**
   * Get text content from an element
   */
  async getText(selector: string): Promise<string | null> {
    return await this.page.textContent(selector);
  }

  /**
   * Get the value of an input element
   */
  async getValue(selector: string): Promise<string> {
    return await this.page.inputValue(selector);
  }

  /**
   * Get an attribute from an element
   */
  async getAttribute(selector: string, attribute: string): Promise<string | null> {
    return await this.page.getAttribute(selector, attribute);
  }

  /**
   * Check if an element exists
   */
  async exists(selector: string): Promise<boolean> {
    const element = await this.page.$(selector);
    return element !== null;
  }

  /**
   * Check if an element is visible
   */
  async isVisible(selector: string): Promise<boolean> {
    return await this.page.isVisible(selector);
  }

  /**
   * Wait for an element to appear
   */
  async waitForElement(selector: string, timeout: number = 30000): Promise<void> {
    await this.page.waitForSelector(selector, { timeout });
  }

  /**
   * Get all elements matching a selector
   */
  async getElements(selector: string): Promise<string[]> {
    const elements = await this.page.$$(selector);
    const texts: string[] = [];
    for (const element of elements) {
      const text = await element.textContent();
      if (text) {
        texts.push(text);
      }
    }
    return texts;
  }

  /**
   * Select an option from a dropdown
   */
  async selectOption(selector: string, value: string): Promise<void> {
    await this.page.selectOption(selector, value);
  }

  /**
   * Check a checkbox
   */
  async check(selector: string): Promise<void> {
    await this.page.check(selector);
  }

  /**
   * Uncheck a checkbox
   */
  async uncheck(selector: string): Promise<void> {
    await this.page.uncheck(selector);
  }

  /**
   * Hover over an element
   */
  async hover(selector: string): Promise<void> {
    await this.page.hover(selector);
  }

  /**
   * Focus an element
   */
  async focus(selector: string): Promise<void> {
    await this.page.focus(selector);
  }

  /**
   * Execute JavaScript in the page context
   */
  async evaluate<T>(fn: string | ((arg: any) => T), arg?: any): Promise<T> {
    return await this.page.evaluate(fn, arg);
  }

  /**
   * Get the page title
   */
  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Scroll to an element
   */
  async scrollToElement(selector: string): Promise<void> {
    await this.page.locator(selector).scrollIntoViewIfNeeded();
  }
}
