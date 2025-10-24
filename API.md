# API Documentation

## Table of Contents
- [ComputerUseAgent](#computeruseagent)
- [BrowserController](#browsercontroller)
- [DOMManipulator](#dommanipulator)
- [VirtualInput](#virtualinput)
- [TaskParser](#taskparser)
- [Task Types](#task-types)

---

## ComputerUseAgent

The main orchestrator that coordinates all modules.

### Constructor
```typescript
const agent = new ComputerUseAgent();
```

### Methods

#### `initialize(headless: boolean = true): Promise<void>`
Initialize the agent by launching the browser.

**Parameters:**
- `headless` (boolean): Run browser in headless mode. Default: `true`

**Example:**
```typescript
await agent.initialize(false); // visible browser
```

#### `executeTask(task: Task): Promise<void>`
Execute a single task.

**Parameters:**
- `task` (Task): Task object to execute

**Example:**
```typescript
await agent.executeTask({
  type: 'navigate',
  target: 'https://example.com'
});
```

#### `executeTasks(tasks: Task[]): Promise<void>`
Execute multiple tasks in sequence.

**Parameters:**
- `tasks` (Task[]): Array of tasks to execute

**Example:**
```typescript
await agent.executeTasks([
  { type: 'navigate', target: 'https://example.com' },
  { type: 'click', target: '#button' }
]);
```

#### `executeFromNaturalLanguage(request: string): Promise<void>`
Execute tasks from natural language request.

**Parameters:**
- `request` (string): Natural language command

**Example:**
```typescript
await agent.executeFromNaturalLanguage('go to https://example.com');
```

#### `executeFromStructured(tasksData: any[]): Promise<void>`
Execute tasks from structured data.

**Parameters:**
- `tasksData` (any[]): Array of task data objects

#### `getBrowserController(): BrowserController`
Get the browser controller instance.

#### `getDOMManipulator(): DOMManipulator`
Get the DOM manipulator instance.

#### `getVirtualInput(): VirtualInput`
Get the virtual input instance.

#### `getTaskParser(): TaskParser`
Get the task parser instance.

#### `shutdown(): Promise<void>`
Shutdown the agent and close the browser.

**Example:**
```typescript
await agent.shutdown();
```

---

## BrowserController

Manages browser instance and navigation.

### Methods

#### `launch(headless: boolean = true): Promise<void>`
Launch a new browser instance.

#### `navigateTo(url: string): Promise<void>`
Navigate to a URL.

**Example:**
```typescript
await browser.navigateTo('https://example.com');
```

#### `getPage(): Page`
Get the current Playwright page instance.

#### `getCurrentUrl(): Promise<string>`
Get the current URL.

#### `screenshot(path?: string): Promise<Buffer>`
Take a screenshot.

**Parameters:**
- `path` (string, optional): File path to save screenshot

**Returns:** Screenshot buffer

#### `wait(milliseconds: number): Promise<void>`
Wait for a specific time.

#### `goBack(): Promise<void>`
Go back in browser history.

#### `goForward(): Promise<void>`
Go forward in browser history.

#### `reload(): Promise<void>`
Reload the current page.

#### `close(): Promise<void>`
Close the browser.

---

## DOMManipulator

Handles standard DOM interactions.

### Methods

#### `click(selector: string): Promise<void>`
Click an element.

**Example:**
```typescript
await dom.click('#submit-button');
```

#### `type(selector: string, text: string, delay?: number): Promise<void>`
Type text into an input field.

**Parameters:**
- `selector` (string): CSS selector
- `text` (string): Text to type
- `delay` (number, optional): Delay between keystrokes in ms

**Example:**
```typescript
await dom.type('#username', 'myuser', 100);
```

#### `getText(selector: string): Promise<string | null>`
Get text content from an element.

#### `getValue(selector: string): Promise<string>`
Get the value of an input element.

#### `getAttribute(selector: string, attribute: string): Promise<string | null>`
Get an attribute from an element.

#### `exists(selector: string): Promise<boolean>`
Check if an element exists.

#### `isVisible(selector: string): Promise<boolean>`
Check if an element is visible.

#### `waitForElement(selector: string, timeout?: number): Promise<void>`
Wait for an element to appear.

**Parameters:**
- `selector` (string): CSS selector
- `timeout` (number, optional): Timeout in milliseconds. Default: 30000

#### `getElements(selector: string): Promise<string[]>`
Get all elements matching a selector and return their text content.

#### `selectOption(selector: string, value: string): Promise<void>`
Select an option from a dropdown.

#### `check(selector: string): Promise<void>`
Check a checkbox.

#### `uncheck(selector: string): Promise<void>`
Uncheck a checkbox.

#### `hover(selector: string): Promise<void>`
Hover over an element.

#### `focus(selector: string): Promise<void>`
Focus an element.

#### `evaluate<T>(fn: string | Function, arg?: any): Promise<T>`
Execute JavaScript in the page context.

**Example:**
```typescript
const result = await dom.evaluate(() => document.title);
```

#### `getTitle(): Promise<string>`
Get the page title.

#### `scrollToElement(selector: string): Promise<void>`
Scroll to an element.

---

## VirtualInput

Handles virtual mouse and keyboard interactions.

### Keyboard Methods

#### `pressKey(key: string): Promise<void>`
Press a single key.

**Example:**
```typescript
await input.pressKey('Enter');
```

#### `typeText(text: string, delay?: number): Promise<void>`
Type text character by character.

**Parameters:**
- `text` (string): Text to type
- `delay` (number, optional): Delay between keystrokes in ms. Default: 100

#### `keyDown(key: string): Promise<void>`
Press key down (without releasing).

#### `keyUp(key: string): Promise<void>`
Release a key.

#### `pressKeyCombination(modifiers: string[], key: string): Promise<void>`
Press a combination of keys.

**Example:**
```typescript
await input.pressKeyCombination(['Control'], 'c'); // Ctrl+C
```

### Mouse Methods

#### `moveMouse(x: number, y: number): Promise<void>`
Move mouse to specific coordinates.

#### `clickMouse(button?: 'left' | 'right' | 'middle'): Promise<void>`
Click at current mouse position.

#### `clickAt(x: number, y: number, button?: 'left' | 'right' | 'middle'): Promise<void>`
Click at specific coordinates.

**Example:**
```typescript
await input.clickAt(100, 200, 'left');
```

#### `doubleClickAt(x: number, y: number): Promise<void>`
Double click at specific coordinates.

#### `mouseDown(button?: 'left' | 'right' | 'middle'): Promise<void>`
Mouse down (press without releasing).

#### `mouseUp(button?: 'left' | 'right' | 'middle'): Promise<void>`
Mouse up (release button).

#### `dragAndDrop(startX: number, startY: number, endX: number, endY: number): Promise<void>`
Drag and drop from one position to another.

**Example:**
```typescript
await input.dragAndDrop(100, 100, 300, 300);
```

#### `scroll(deltaX: number, deltaY: number): Promise<void>`
Scroll the page.

#### `getElementPosition(selector: string): Promise<BoundingBox | null>`
Get the bounding box of an element.

**Returns:** Object with `x`, `y`, `width`, `height` properties

#### `clickElementByCoordinates(selector: string): Promise<void>`
Click on the center of an element using coordinates.

---

## TaskParser

Parse and validate tasks.

### Methods

#### `parseNaturalLanguage(request: string): Task[]`
Parse natural language into tasks.

**Example:**
```typescript
const tasks = parser.parseNaturalLanguage('go to https://example.com');
```

**Supported Patterns:**
- Navigation: "go to URL", "navigate to URL", "open URL"
- Click: "click on ELEMENT"
- Type: "type TEXT into ELEMENT", "enter TEXT into ELEMENT"
- Wait: "wait N seconds"
- Screenshot: "screenshot", "capture"

#### `parseStructured(taskData: any): Task`
Parse a structured task object.

#### `parseStructuredArray(tasksData: any[]): Task[]`
Parse an array of structured tasks.

#### `validateTask(task: Task): boolean`
Validate a task.

#### `createTask(type, target?, value?, options?): Task`
Create a task object.

**Example:**
```typescript
const task = parser.createTask('navigate', 'https://example.com');
```

---

## Task Types

### Task Interface
```typescript
interface Task {
  type: 'navigate' | 'click' | 'type' | 'select' | 'wait' | 'scroll' | 'screenshot' | 'custom';
  target?: string;
  value?: string;
  options?: Record<string, any>;
}
```

### Task Types

#### Navigate
Navigate to a URL.
```typescript
{
  type: 'navigate',
  target: 'https://example.com'
}
```

#### Click
Click an element.
```typescript
{
  type: 'click',
  target: '#button',
  options: {
    useVirtualMouse: false  // Use coordinates instead of DOM click
  }
}
```

#### Type
Type text into an input.
```typescript
{
  type: 'type',
  target: '#input',
  value: 'text to type',
  options: {
    delay: 100,  // Delay between keystrokes
    useVirtualKeyboard: false
  }
}
```

#### Select
Select dropdown option.
```typescript
{
  type: 'select',
  target: '#dropdown',
  value: 'option-value'
}
```

#### Wait
Wait for time period.
```typescript
{
  type: 'wait',
  value: '2000',
  options: {
    unit: 'milliseconds'  // or 'seconds'
  }
}
```

#### Scroll
Scroll to element or by delta.
```typescript
// Scroll to element
{
  type: 'scroll',
  target: '#element'
}

// Scroll by delta
{
  type: 'scroll',
  options: {
    deltaX: 0,
    deltaY: 100
  }
}
```

#### Screenshot
Take a screenshot.
```typescript
{
  type: 'screenshot',
  target: './screenshot.png'  // Optional file path
}
```

#### Custom
Execute custom JavaScript.
```typescript
{
  type: 'custom',
  options: {
    evaluate: () => console.log('custom code')
  }
}
```
