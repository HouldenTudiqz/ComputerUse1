# Architecture Overview

## Design Philosophy

ComputerUse1 follows a modular architecture with clear separation of concerns. Each module has a specific responsibility and can be used independently or as part of the orchestrated system.

## Module Structure

```
ComputerUse1
│
├── Agent Layer (Orchestration)
│   └── ComputerUseAgent
│       ├── Coordinates all modules
│       ├── Executes task workflows
│       └── Provides high-level API
│
├── Browser Layer (Lifecycle Management)
│   └── BrowserController
│       ├── Browser launch/close
│       ├── Navigation
│       └── Page management
│
├── Interaction Layer (User Actions)
│   ├── DOMManipulator
│   │   ├── Standard DOM operations
│   │   ├── Element queries
│   │   └── JavaScript execution
│   │
│   └── VirtualInput
│       ├── Virtual keyboard
│       └── Virtual mouse
│
└── Parser Layer (Task Interpretation)
    └── TaskParser
        ├── Natural language parsing
        ├── Structured parsing
        └── Task validation
```

## Module Responsibilities

### 1. ComputerUseAgent (Orchestration)
**Purpose:** Main entry point and workflow orchestrator

**Responsibilities:**
- Initialize and coordinate all other modules
- Execute tasks in sequence or from natural language
- Provide unified API for all operations
- Manage module lifecycle

**Dependencies:** All other modules

**Use When:** You want a complete, ready-to-use solution

### 2. BrowserController (Browser Management)
**Purpose:** Manage browser lifecycle and basic navigation

**Responsibilities:**
- Launch/close browser instances
- Handle page navigation (forward, back, reload)
- Manage page lifecycle
- Take screenshots
- Wait operations

**Dependencies:** Playwright

**Use When:** You need browser-level operations

### 3. DOMManipulator (DOM Interactions)
**Purpose:** Perform standard DOM-based interactions

**Responsibilities:**
- Click, type, select elements
- Query element properties
- Wait for elements
- Execute JavaScript in page context
- Read page content

**Dependencies:** Playwright Page

**Use When:** Working with standard web elements

**Advantages:**
- Fast and reliable
- Works with dynamic content
- Automatically waits for elements
- Framework-aware

### 4. VirtualInput (Low-Level Input)
**Purpose:** Provide virtual keyboard and mouse control

**Responsibilities:**
- Simulate keyboard input
- Simulate mouse movements and clicks
- Handle key combinations
- Drag and drop operations
- Coordinate-based interactions

**Dependencies:** Playwright Page

**Use When:**
- DOM manipulation is not possible
- Need precise coordinate control
- Interacting with canvas or game elements
- Complex gestures required

**Advantages:**
- Works with any visual element
- Precise control
- Handles edge cases

### 5. TaskParser (Task Interpretation)
**Purpose:** Convert user requests into executable tasks

**Responsibilities:**
- Parse natural language commands
- Parse structured task definitions
- Validate task objects
- Create task objects

**Dependencies:** None

**Use When:** Converting user input to tasks

## Data Flow

### Typical Workflow

```
User Request
    ↓
TaskParser (parse natural language)
    ↓
Task Objects
    ↓
ComputerUseAgent (orchestrate)
    ↓
┌─────────────────┬──────────────────┬─────────────────┐
│                 │                  │                 │
BrowserController DOMManipulator    VirtualInput
(navigate, wait)  (click, type)     (keyboard, mouse)
    ↓                 ↓                  ↓
        Playwright Browser Engine
                ↓
            Web Page
```

### Example Flow: Form Submission

1. **User Request:** "go to example.com and fill form"
2. **TaskParser:** Converts to tasks:
   - `{ type: 'navigate', target: 'example.com' }`
   - `{ type: 'type', target: '#name', value: 'John' }`
   - `{ type: 'click', target: '#submit' }`
3. **ComputerUseAgent:** Executes each task
4. **BrowserController:** Navigates to URL
5. **DOMManipulator:** Types into field and clicks button
6. **Playwright:** Executes actions in browser

## Design Patterns

### 1. Facade Pattern
**ComputerUseAgent** acts as a facade, providing a simplified interface to the complex subsystem of modules.

### 2. Strategy Pattern
**VirtualInput vs DOMManipulator** - Different strategies for the same goal (interacting with page elements).

### 3. Command Pattern
**Task objects** encapsulate actions as objects, allowing for queuing, logging, and undo operations.

### 4. Factory Pattern
**TaskParser.createTask()** creates task objects in a consistent manner.

## Extensibility

### Adding New Task Types

1. Add type to `Task` interface in `TaskParser.ts`
2. Add validation logic in `TaskParser.validateTask()`
3. Add execution logic in `ComputerUseAgent.executeTask()`
4. Add natural language patterns if needed

### Adding New Modules

1. Create module in appropriate directory
2. Export from `src/index.ts`
3. Inject into `ComputerUseAgent` if needed
4. Provide getter method in `ComputerUseAgent`

### Custom Task Execution

```typescript
await agent.executeTask({
  type: 'custom',
  options: {
    evaluate: () => {
      // Custom JavaScript code
      document.querySelector('.special').click();
    }
  }
});
```

## Error Handling

Each module throws errors for invalid operations:
- Missing initialization
- Invalid selectors
- Timeout errors
- Invalid task types

Errors propagate up to the caller for handling.

## Performance Considerations

### DOM Manipulation vs Virtual Input

**DOMManipulator (Preferred):**
- ✅ Faster execution
- ✅ More reliable
- ✅ Framework-aware
- ✅ Automatic waiting

**VirtualInput (When Needed):**
- ✅ Works with any visual element
- ✅ Precise coordinate control
- ❌ Slower
- ❌ May require manual waits

**Recommendation:** Use DOMManipulator by default, VirtualInput only when necessary.

### Headless vs Headed Mode

**Headless (headless: true):**
- ✅ Faster
- ✅ Less resource usage
- ✅ Better for automation

**Headed (headless: false):**
- ✅ Visual debugging
- ✅ Development mode
- ❌ Slower
- ❌ More resources

## Security Considerations

1. **Input Validation:** All user inputs should be validated
2. **URL Whitelisting:** Consider whitelisting allowed domains
3. **Sandbox:** Browser runs in sandboxed environment
4. **No Persistent Storage:** Browser data cleared on close

## Testing Strategy

### Unit Tests
Test individual modules in isolation:
- TaskParser logic
- Task validation
- Module instantiation

### Integration Tests
Test module interactions:
- Agent with browser
- Agent with parser
- Complete workflows

### E2E Tests
Test complete user scenarios:
- Form submission
- Multi-page navigation
- Complex interactions

## Future Enhancements

1. **AI Integration:** Use LLMs for better natural language understanding
2. **Vision:** Screenshot analysis for visual feedback
3. **Recording:** Record user actions to generate tasks
4. **Debugging:** Enhanced debugging and logging
5. **Parallel Execution:** Execute independent tasks in parallel
6. **State Management:** Track page state for smarter decisions
7. **Error Recovery:** Automatic retry and error handling

## Dependencies

### Core Dependencies
- **Playwright:** Browser automation engine
- **TypeScript:** Type-safe development
- **Node.js:** Runtime environment

### Why Playwright?
- Modern and well-maintained
- Supports multiple browsers
- Excellent TypeScript support
- Auto-waiting mechanisms
- Rich API for both DOM and virtual input

## Module Independence

Each module can be used independently:

```typescript
// Use only BrowserController
const browser = new BrowserController();
await browser.launch();
await browser.navigateTo('https://example.com');

// Use only DOMManipulator (with existing page)
const dom = new DOMManipulator(page);
await dom.click('#button');

// Use only VirtualInput (with existing page)
const input = new VirtualInput(page);
await input.pressKey('Enter');

// Use only TaskParser
const parser = new TaskParser();
const tasks = parser.parseNaturalLanguage('go to example.com');
```

This independence allows for:
- Flexible integration into existing systems
- Easy testing
- Gradual adoption
- Mix and match functionality
