# Quick Start Guide

Get started with ComputerUse1 in minutes!

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

1. **Clone the repository:**
```bash
git clone https://github.com/HouldenTudiqz/ComputerUse1.git
cd ComputerUse1
```

2. **Install dependencies:**
```bash
npm install
```

3. **Install Playwright browsers:**
```bash
npx playwright install chromium
```

4. **Build the project:**
```bash
npm run build
```

## Your First Script

Create a file `my-first-script.js`:

```javascript
const { ComputerUseAgent } = require('./dist/src/index');

async function main() {
  // Create agent
  const agent = new ComputerUseAgent();
  
  try {
    // Initialize browser (visible mode for learning)
    await agent.initialize(false);
    
    // Navigate to a website
    await agent.executeTask({
      type: 'navigate',
      target: 'https://example.com'
    });
    
    // Wait a moment
    await agent.executeTask({
      type: 'wait',
      value: '2',
      options: { unit: 'seconds' }
    });
    
    // Take a screenshot
    await agent.executeTask({
      type: 'screenshot',
      target: './my-screenshot.png'
    });
    
    console.log('Success! Check my-screenshot.png');
    
  } finally {
    // Always clean up
    await agent.shutdown();
  }
}

main().catch(console.error);
```

Run it:
```bash
node my-first-script.js
```

## Using Natural Language

```javascript
const { ComputerUseAgent } = require('./dist/src/index');

async function main() {
  const agent = new ComputerUseAgent();
  
  try {
    await agent.initialize(false);
    
    // Use natural language commands!
    await agent.executeFromNaturalLanguage('go to https://example.com');
    await agent.executeFromNaturalLanguage('wait 2 seconds');
    await agent.executeFromNaturalLanguage('screenshot');
    
    console.log('Done!');
    
  } finally {
    await agent.shutdown();
  }
}

main().catch(console.error);
```

## Running Examples

The repository includes comprehensive examples:

```bash
# Run unit tests
npm test

# Run usage examples (requires browser installation)
npm run example
```

## Common Tasks

### Navigate and Click
```javascript
await agent.executeTasks([
  { type: 'navigate', target: 'https://example.com' },
  { type: 'click', target: '#my-button' }
]);
```

### Fill a Form
```javascript
await agent.executeTasks([
  { type: 'navigate', target: 'https://example.com/form' },
  { type: 'type', target: '#username', value: 'myuser' },
  { type: 'type', target: '#password', value: 'mypass' },
  { type: 'click', target: '#submit' }
]);
```

### Use Virtual Keyboard
```javascript
const input = agent.getVirtualInput();
await input.pressKey('Enter');
await input.typeText('Hello World', 50); // 50ms delay between keys
```

### Use Virtual Mouse
```javascript
const input = agent.getVirtualInput();
await input.clickAt(100, 200); // Click at coordinates
await input.dragAndDrop(100, 100, 300, 300); // Drag and drop
```

### Get Page Information
```javascript
const dom = agent.getDOMManipulator();
const title = await dom.getTitle();
const text = await dom.getText('#content');
console.log('Page title:', title);
console.log('Content:', text);
```

## Troubleshooting

### Browser not installed
```bash
npx playwright install chromium
```

### TypeScript errors
```bash
npm run rebuild
```

### Module not found
Make sure to build before running:
```bash
npm run build
node your-script.js
```

## Next Steps

1. **Read the full [README.md](README.md)** for overview
2. **Check [API.md](API.md)** for detailed API reference
3. **Review [ARCHITECTURE.md](ARCHITECTURE.md)** to understand the design
4. **Explore [examples/](examples/)** for more use cases

## Tips

- Use **headless mode** (`initialize(true)`) in production for better performance
- Use **visible mode** (`initialize(false)`) during development to see what's happening
- Prefer **DOM manipulation** over virtual input when possible (it's faster)
- Use **virtual input** when DOM manipulation doesn't work (canvas, games, etc.)
- Always call `shutdown()` to clean up resources

## Getting Help

- Check the documentation files in this repository
- Look at the examples in `examples/` directory
- Review the source code (it's well-commented!)

## What's Next?

Now that you have the basics, you can:
- Automate web forms
- Scrape website content
- Test web applications
- Create automated workflows
- Build custom automation tools

Happy automating! 🚀
