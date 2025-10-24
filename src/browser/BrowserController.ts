import { Browser, Page, chromium } from 'playwright';

/**
 * BrowserController manages the browser instance and page navigation.
 * This module is responsible for launching browsers, creating pages, and handling navigation.
 */
export class BrowserController {
  private browser: Browser | null = null;
  private page: Page | null = null;

  /**
   * Launch a new browser instance
   */
  async launch(headless: boolean = true): Promise<void> {
    this.browser = await chromium.launch({
      headless,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    this.page = await this.browser.newPage();
  }

  /**
   * Navigate to a URL
   */
  async navigateTo(url: string): Promise<void> {
    if (!this.page) {
      throw new Error('Browser not launched. Call launch() first.');
    }
    await this.page.goto(url, { waitUntil: 'networkidle' });
  }

  /**
   * Get the current page instance
   */
  getPage(): Page {
    if (!this.page) {
      throw new Error('Browser not launched. Call launch() first.');
    }
    return this.page;
  }

  /**
   * Get the current URL
   */
  async getCurrentUrl(): Promise<string> {
    if (!this.page) {
      throw new Error('Browser not launched. Call launch() first.');
    }
    return this.page.url();
  }

  /**
   * Take a screenshot
   */
  async screenshot(path?: string): Promise<Buffer> {
    if (!this.page) {
      throw new Error('Browser not launched. Call launch() first.');
    }
    return await this.page.screenshot({ path, fullPage: true });
  }

  /**
   * Wait for a specific amount of time
   */
  async wait(milliseconds: number): Promise<void> {
    if (!this.page) {
      throw new Error('Browser not launched. Call launch() first.');
    }
    await this.page.waitForTimeout(milliseconds);
  }

  /**
   * Go back in browser history
   */
  async goBack(): Promise<void> {
    if (!this.page) {
      throw new Error('Browser not launched. Call launch() first.');
    }
    await this.page.goBack();
  }

  /**
   * Go forward in browser history
   */
  async goForward(): Promise<void> {
    if (!this.page) {
      throw new Error('Browser not launched. Call launch() first.');
    }
    await this.page.goForward();
  }

  /**
   * Reload the current page
   */
  async reload(): Promise<void> {
    if (!this.page) {
      throw new Error('Browser not launched. Call launch() first.');
    }
    await this.page.reload();
  }

  /**
   * Close the browser
   */
  async close(): Promise<void> {
    if (this.page) {
      await this.page.close();
      this.page = null;
    }
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}
