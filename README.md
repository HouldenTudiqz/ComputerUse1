# ComputerUse1

A modular AI agent for browser automation that can accomplish tasks through standard DOM manipulation or virtual keyboard/mouse input when necessary.

## Overview

ComputerUse1 is a cleanly architected browser automation framework that separates concerns into distinct modules:

- **Browser Controller**: Manages browser instances and navigation
- **DOM Manipulator**: Handles standard DOM interactions (clicks, typing, reading)
- **Virtual Input**: Provides virtual keyboard and mouse control for complex interactions
- **Task Parser**: Interprets user requests (natural language or structured)
- **AI Agent**: Orchestrates all modules to execute complex workflows

## Architecture

```
src/
├── agent/          # Main orchestration module
│   └── ComputerUseAgent.ts
├── browser/        # Browser lifecycle management
│   └── BrowserController.ts
├── dom/            # DOM manipulation utilities
│   └── DOMManipulator.ts
├── input/          # Virtual keyboard and mouse
│   └── VirtualInput.ts
├── parser/         # Task parsing and interpretation
│   └── TaskParser.ts
└── index.ts        # Main exports
```

## Installation

```bash
npm install
```

## Building

```bash
npm run build
```

## Usage

### Basic Example

```typescript
import { ComputerUseAgent } from './src/agent/ComputerUseAgent';

const agent = new ComputerUseAgent();

// Initialize the agent
await agent.initialize(false); // false = visible browser

// Navigate to a website
await agent.executeTask({
  type: 'navigate',
  target: 'https://example.com'
});

// Take a screenshot
await agent.executeTask({
  type: 'screenshot',
  target: './screenshot.png'
});

// Clean up
await agent.shutdown();
```

### Natural Language Commands

```typescript
await agent.executeFromNaturalLanguage('go to https://example.com');
await agent.executeFromNaturalLanguage('wait 2 seconds');
await agent.executeFromNaturalLanguage('screenshot');
```

### Direct Module Access

```typescript
// Get individual modules for advanced control
const browser = agent.getBrowserController();
const dom = agent.getDOMManipulator();
const input = agent.getVirtualInput();

// Use DOM manipulation
const title = await dom.getTitle();
await dom.click('#submit-button');

// Use virtual input
await input.pressKey('Enter');
await input.clickAt(100, 200);
```

### Multiple Tasks

```typescript
const tasks = [
  { type: 'navigate', target: 'https://example.com' },
  { type: 'click', target: '#login-button' },
  { type: 'type', target: '#username', value: 'myuser' },
  { type: 'type', target: '#password', value: 'mypass' },
  { type: 'click', target: '#submit' }
];

await agent.executeTasks(tasks);
```

## Modules

### BrowserController
Manages browser lifecycle and navigation:
- `launch(headless)`: Launch browser
- `navigateTo(url)`: Navigate to URL
- `screenshot(path)`: Take screenshot
- `goBack()`, `goForward()`, `reload()`: Navigation controls
- `close()`: Close browser

### DOMManipulator
Standard DOM interactions:
- `click(selector)`: Click element
- `type(selector, text)`: Type into input
- `getText(selector)`: Get text content
- `waitForElement(selector)`: Wait for element
- `evaluate(fn)`: Execute JavaScript
- And more...

### VirtualInput
Virtual keyboard and mouse control:
- `pressKey(key)`: Press keyboard key
- `typeText(text, delay)`: Type with delay
- `clickAt(x, y)`: Click at coordinates
- `dragAndDrop(x1, y1, x2, y2)`: Drag and drop
- `scroll(deltaX, deltaY)`: Scroll page
- And more...

### TaskParser
Parse and validate tasks:
- `parseNaturalLanguage(request)`: Parse natural language
- `parseStructured(taskData)`: Parse structured task
- `validateTask(task)`: Validate task
- `createTask(...)`: Create task object

### ComputerUseAgent
Main orchestrator:
- `initialize(headless)`: Initialize agent
- `executeTask(task)`: Execute single task
- `executeTasks(tasks)`: Execute multiple tasks
- `executeFromNaturalLanguage(request)`: Execute from natural language
- `shutdown()`: Clean up resources

## Task Types

- `navigate`: Navigate to URL
- `click`: Click element (DOM or coordinates)
- `type`: Type text into input
- `select`: Select dropdown option
- `wait`: Wait for time period
- `scroll`: Scroll to element or by delta
- `screenshot`: Capture screenshot
- `custom`: Execute custom JavaScript

## Examples

See the `examples/` directory for comprehensive usage examples:

```bash
npm run build
node dist/examples/basic-usage.js
```

## Dependencies

- **Playwright**: Modern browser automation
- **TypeScript**: Type-safe development
- **Node.js**: Runtime environment

## License

ISC
