import { Page } from 'playwright';

/**
 * VirtualInput handles virtual mouse and keyboard interactions.
 * This module is used when standard DOM manipulation is not sufficient.
 */
export class VirtualInput {
  constructor(private page: Page) {}

  /**
   * Virtual Keyboard Methods
   */

  /**
   * Press a single key
   */
  async pressKey(key: string): Promise<void> {
    await this.page.keyboard.press(key);
  }

  /**
   * Type text character by character with optional delay
   */
  async typeText(text: string, delay: number = 100): Promise<void> {
    await this.page.keyboard.type(text, { delay });
  }

  /**
   * Press key down (without releasing)
   */
  async keyDown(key: string): Promise<void> {
    await this.page.keyboard.down(key);
  }

  /**
   * Release a key
   */
  async keyUp(key: string): Promise<void> {
    await this.page.keyboard.up(key);
  }

  /**
   * Press a combination of keys (e.g., Ctrl+C)
   */
  async pressKeyCombination(modifiers: string[], key: string): Promise<void> {
    // Press all modifiers
    for (const modifier of modifiers) {
      await this.page.keyboard.down(modifier);
    }
    
    // Press the main key
    await this.page.keyboard.press(key);
    
    // Release all modifiers
    for (const modifier of modifiers.reverse()) {
      await this.page.keyboard.up(modifier);
    }
  }

  /**
   * Virtual Mouse Methods
   */

  /**
   * Move mouse to specific coordinates
   */
  async moveMouse(x: number, y: number): Promise<void> {
    await this.page.mouse.move(x, y);
  }

  /**
   * Click at current mouse position
   */
  async clickMouse(button: 'left' | 'right' | 'middle' = 'left'): Promise<void> {
    await this.page.mouse.click(0, 0, { button });
  }

  /**
   * Click at specific coordinates
   */
  async clickAt(x: number, y: number, button: 'left' | 'right' | 'middle' = 'left'): Promise<void> {
    await this.page.mouse.click(x, y, { button });
  }

  /**
   * Double click at specific coordinates
   */
  async doubleClickAt(x: number, y: number): Promise<void> {
    await this.page.mouse.dblclick(x, y);
  }

  /**
   * Mouse down (press without releasing)
   */
  async mouseDown(button: 'left' | 'right' | 'middle' = 'left'): Promise<void> {
    await this.page.mouse.down({ button });
  }

  /**
   * Mouse up (release button)
   */
  async mouseUp(button: 'left' | 'right' | 'middle' = 'left'): Promise<void> {
    await this.page.mouse.up({ button });
  }

  /**
   * Drag and drop from one position to another
   */
  async dragAndDrop(startX: number, startY: number, endX: number, endY: number): Promise<void> {
    await this.page.mouse.move(startX, startY);
    await this.page.mouse.down();
    await this.page.mouse.move(endX, endY);
    await this.page.mouse.up();
  }

  /**
   * Scroll the page
   */
  async scroll(deltaX: number, deltaY: number): Promise<void> {
    await this.page.mouse.wheel(deltaX, deltaY);
  }

  /**
   * Get the bounding box of an element (useful for clicking)
   */
  async getElementPosition(selector: string): Promise<{ x: number; y: number; width: number; height: number } | null> {
    const element = await this.page.$(selector);
    if (!element) {
      return null;
    }
    return await element.boundingBox();
  }

  /**
   * Click on the center of an element using coordinates
   */
  async clickElementByCoordinates(selector: string): Promise<void> {
    const box = await this.getElementPosition(selector);
    if (!box) {
      throw new Error(`Element not found: ${selector}`);
    }
    const x = box.x + box.width / 2;
    const y = box.y + box.height / 2;
    await this.clickAt(x, y);
  }
}
