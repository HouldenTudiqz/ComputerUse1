import { ComputerUseAgent } from '../src/agent/ComputerUseAgent';

/**
 * Example 1: Basic Navigation and Interaction
 * This example shows how to navigate to a website and interact with it using DOM methods
 */
async function basicExample() {
  const agent = new ComputerUseAgent();

  try {
    // Initialize the agent (launches browser)
    await agent.initialize(false); // headless = false to see the browser

    // Navigate to a website
    await agent.executeTask({
      type: 'navigate',
      target: 'https://example.com'
    });

    // Wait for page to load
    await agent.executeTask({
      type: 'wait',
      value: '2',
      options: { unit: 'seconds' }
    });

    // Take a screenshot
    await agent.executeTask({
      type: 'screenshot',
      target: './screenshot.png'
    });

    console.log('Basic example completed successfully!');
  } catch (error) {
    console.error('Error in basic example:', error);
  } finally {
    // Clean up
    await agent.shutdown();
  }
}

/**
 * Example 2: Using Natural Language
 * This example shows how to use natural language commands
 */
async function naturalLanguageExample() {
  const agent = new ComputerUseAgent();

  try {
    await agent.initialize(false);

    // Execute from natural language
    await agent.executeFromNaturalLanguage('go to https://example.com');
    await agent.executeFromNaturalLanguage('wait 2 seconds');
    await agent.executeFromNaturalLanguage('screenshot');

    console.log('Natural language example completed successfully!');
  } catch (error) {
    console.error('Error in natural language example:', error);
  } finally {
    await agent.shutdown();
  }
}

/**
 * Example 3: Advanced - Direct Module Access
 * This example shows how to use individual modules directly
 */
async function advancedExample() {
  const agent = new ComputerUseAgent();

  try {
    await agent.initialize(false);

    // Get direct access to modules
    const browser = agent.getBrowserController();
    const dom = agent.getDOMManipulator();
    const input = agent.getVirtualInput();

    // Navigate
    await browser.navigateTo('https://example.com');

    // Get page title
    const title = await dom.getTitle();
    console.log('Page title:', title);

    // Use virtual keyboard to press a key
    await input.pressKey('PageDown');

    // Wait and take screenshot
    await browser.wait(1000);
    await browser.screenshot('./advanced-screenshot.png');

    console.log('Advanced example completed successfully!');
  } catch (error) {
    console.error('Error in advanced example:', error);
  } finally {
    await agent.shutdown();
  }
}

/**
 * Example 4: Multiple Tasks
 * This example shows how to execute multiple tasks in sequence
 */
async function multipleTasksExample() {
  const agent = new ComputerUseAgent();

  try {
    await agent.initialize(false);

    const tasks = [
      { type: 'navigate' as const, target: 'https://example.com' },
      { type: 'wait' as const, value: '2', options: { unit: 'seconds' } },
      { type: 'screenshot' as const, target: './screenshot1.png' },
      { type: 'wait' as const, value: '1', options: { unit: 'seconds' } },
      { type: 'screenshot' as const, target: './screenshot2.png' }
    ];

    await agent.executeTasks(tasks);

    console.log('Multiple tasks example completed successfully!');
  } catch (error) {
    console.error('Error in multiple tasks example:', error);
  } finally {
    await agent.shutdown();
  }
}

// Run examples
if (require.main === module) {
  (async () => {
    console.log('Running Computer Use Agent Examples\n');

    console.log('1. Basic Example:');
    await basicExample();
    console.log('\n');

    console.log('2. Natural Language Example:');
    await naturalLanguageExample();
    console.log('\n');

    console.log('3. Advanced Example:');
    await advancedExample();
    console.log('\n');

    console.log('4. Multiple Tasks Example:');
    await multipleTasksExample();
    console.log('\n');

    console.log('All examples completed!');
  })();
}
