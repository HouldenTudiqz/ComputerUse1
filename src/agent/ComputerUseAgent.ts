import { BrowserController } from '../browser/BrowserController';
import { DOMManipulator } from '../dom/DOMManipulator';
import { VirtualInput } from '../input/VirtualInput';
import { TaskParser, Task } from '../parser/TaskParser';

/**
 * ComputerUseAgent is the main orchestrator that coordinates all modules.
 * It manages the browser, DOM manipulation, virtual input, and task execution.
 */
export class ComputerUseAgent {
  private browserController: BrowserController;
  private domManipulator: DOMManipulator | null = null;
  private virtualInput: VirtualInput | null = null;
  private taskParser: TaskParser;
  private isInitialized: boolean = false;

  constructor() {
    this.browserController = new BrowserController();
    this.taskParser = new TaskParser();
  }

  /**
   * Initialize the agent by launching the browser
   */
  async initialize(headless: boolean = true): Promise<void> {
    await this.browserController.launch(headless);
    const page = this.browserController.getPage();
    this.domManipulator = new DOMManipulator(page);
    this.virtualInput = new VirtualInput(page);
    this.isInitialized = true;
  }

  /**
   * Execute a single task
   */
  async executeTask(task: Task): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('Agent not initialized. Call initialize() first.');
    }

    if (!this.taskParser.validateTask(task)) {
      throw new Error(`Invalid task: ${JSON.stringify(task)}`);
    }

    switch (task.type) {
      case 'navigate':
        await this.browserController.navigateTo(task.target!);
        break;

      case 'click':
        if (task.options?.useVirtualMouse) {
          await this.virtualInput!.clickElementByCoordinates(task.target!);
        } else {
          await this.domManipulator!.click(task.target!);
        }
        break;

      case 'type':
        if (task.options?.useVirtualKeyboard) {
          await this.virtualInput!.typeText(task.value!, task.options?.delay);
        } else {
          await this.domManipulator!.type(task.target!, task.value!, task.options?.delay);
        }
        break;

      case 'select':
        await this.domManipulator!.selectOption(task.target!, task.value!);
        break;

      case 'wait':
        const waitTime = parseInt(task.value || '1000');
        const unit = task.options?.unit || 'milliseconds';
        const milliseconds = unit === 'seconds' ? waitTime * 1000 : waitTime;
        await this.browserController.wait(milliseconds);
        break;

      case 'scroll':
        if (task.target) {
          await this.domManipulator!.scrollToElement(task.target);
        } else if (task.options?.deltaX !== undefined && task.options?.deltaY !== undefined) {
          await this.virtualInput!.scroll(task.options.deltaX, task.options.deltaY);
        }
        break;

      case 'screenshot':
        await this.browserController.screenshot(task.target);
        break;

      case 'custom':
        // Allow for custom task execution via evaluate
        if (task.options?.evaluate) {
          await this.domManipulator!.evaluate(task.options.evaluate);
        }
        break;

      default:
        throw new Error(`Unknown task type: ${task.type}`);
    }
  }

  /**
   * Execute multiple tasks in sequence
   */
  async executeTasks(tasks: Task[]): Promise<void> {
    for (const task of tasks) {
      await this.executeTask(task);
    }
  }

  /**
   * Execute tasks from a natural language request
   */
  async executeFromNaturalLanguage(request: string): Promise<void> {
    const tasks = this.taskParser.parseNaturalLanguage(request);
    await this.executeTasks(tasks);
  }

  /**
   * Execute tasks from structured data
   */
  async executeFromStructured(tasksData: any[]): Promise<void> {
    const tasks = this.taskParser.parseStructuredArray(tasksData);
    await this.executeTasks(tasks);
  }

  /**
   * Get access to individual components for advanced usage
   */
  getBrowserController(): BrowserController {
    return this.browserController;
  }

  getDOMManipulator(): DOMManipulator {
    if (!this.domManipulator) {
      throw new Error('Agent not initialized. Call initialize() first.');
    }
    return this.domManipulator;
  }

  getVirtualInput(): VirtualInput {
    if (!this.virtualInput) {
      throw new Error('Agent not initialized. Call initialize() first.');
    }
    return this.virtualInput;
  }

  getTaskParser(): TaskParser {
    return this.taskParser;
  }

  /**
   * Shutdown the agent
   */
  async shutdown(): Promise<void> {
    await this.browserController.close();
    this.isInitialized = false;
  }
}
