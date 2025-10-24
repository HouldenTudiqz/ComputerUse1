/**
 * Task represents a single action to be performed
 */
export interface Task {
  type: 'navigate' | 'click' | 'type' | 'select' | 'wait' | 'scroll' | 'screenshot' | 'custom';
  target?: string;
  value?: string;
  options?: Record<string, any>;
}

/**
 * TaskParser interprets user requests and converts them into executable tasks.
 * This module provides methods to parse natural language or structured commands.
 */
export class TaskParser {
  /**
   * Parse a natural language request into tasks
   * This is a simple implementation - in production, this would use NLP/AI
   */
  parseNaturalLanguage(request: string): Task[] {
    const tasks: Task[] = [];
    const lowerRequest = request.toLowerCase();

    // Navigation patterns
    if (lowerRequest.includes('go to') || lowerRequest.includes('navigate to') || lowerRequest.includes('open')) {
      const urlMatch = request.match(/(?:go to|navigate to|open)\s+([^\s]+)/i);
      if (urlMatch) {
        tasks.push({
          type: 'navigate',
          target: urlMatch[1]
        });
      }
    }

    // Click patterns
    if (lowerRequest.includes('click')) {
      const clickMatch = request.match(/click\s+(?:on\s+)?["']?([^"']+)["']?/i);
      if (clickMatch) {
        tasks.push({
          type: 'click',
          target: clickMatch[1]
        });
      }
    }

    // Type/input patterns
    if (lowerRequest.includes('type') || lowerRequest.includes('enter') || lowerRequest.includes('input')) {
      const typeMatch = request.match(/(?:type|enter|input)\s+["']([^"']+)["']\s+(?:in|into)\s+["']?([^"']+)["']?/i);
      if (typeMatch) {
        tasks.push({
          type: 'type',
          target: typeMatch[2],
          value: typeMatch[1]
        });
      }
    }

    // Wait patterns
    if (lowerRequest.includes('wait')) {
      const waitMatch = request.match(/wait\s+(\d+)\s*(?:seconds?|ms|milliseconds?)?/i);
      if (waitMatch) {
        const time = parseInt(waitMatch[1]);
        tasks.push({
          type: 'wait',
          value: time.toString(),
          options: { unit: waitMatch[2] || 'seconds' }
        });
      }
    }

    // Screenshot patterns
    if (lowerRequest.includes('screenshot') || lowerRequest.includes('capture')) {
      tasks.push({
        type: 'screenshot'
      });
    }

    return tasks;
  }

  /**
   * Parse a structured task object
   */
  parseStructured(taskData: any): Task {
    return {
      type: taskData.type || 'custom',
      target: taskData.target,
      value: taskData.value,
      options: taskData.options
    };
  }

  /**
   * Parse an array of structured tasks
   */
  parseStructuredArray(tasksData: any[]): Task[] {
    return tasksData.map(taskData => this.parseStructured(taskData));
  }

  /**
   * Validate a task
   */
  validateTask(task: Task): boolean {
    if (!task.type) {
      return false;
    }

    switch (task.type) {
      case 'navigate':
        return !!task.target;
      case 'click':
      case 'select':
      case 'scroll':
        return !!task.target;
      case 'type':
        return !!task.target && !!task.value;
      case 'wait':
      case 'screenshot':
      case 'custom':
        return true;
      default:
        return false;
    }
  }

  /**
   * Create a simple task
   */
  createTask(type: Task['type'], target?: string, value?: string, options?: Record<string, any>): Task {
    return {
      type,
      target,
      value,
      options
    };
  }
}
