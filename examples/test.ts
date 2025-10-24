import { ComputerUseAgent } from '../src/agent/ComputerUseAgent';
import { TaskParser } from '../src/parser/TaskParser';

/**
 * Simple test to validate the modules work correctly
 */
async function runTests() {
  console.log('Starting Computer Use AI Tests...\n');

  let testsPassed = 0;
  let testsFailed = 0;

  // Test 1: TaskParser - Natural Language
  console.log('Test 1: TaskParser Natural Language Parsing');
  try {
    const parser = new TaskParser();
    const tasks = parser.parseNaturalLanguage('go to https://example.com');
    
    if (tasks.length === 1 && tasks[0].type === 'navigate' && tasks[0].target === 'https://example.com') {
      console.log('✓ PASSED: Natural language parsing works correctly\n');
      testsPassed++;
    } else {
      console.log('✗ FAILED: Natural language parsing did not produce expected result\n');
      testsFailed++;
    }
  } catch (error) {
    console.log('✗ FAILED: Error in natural language parsing:', error, '\n');
    testsFailed++;
  }

  // Test 2: TaskParser - Task Validation
  console.log('Test 2: TaskParser Task Validation');
  try {
    const parser = new TaskParser();
    const validTask = parser.createTask('navigate', 'https://example.com');
    const invalidTask = parser.createTask('navigate');
    
    if (parser.validateTask(validTask) && !parser.validateTask(invalidTask)) {
      console.log('✓ PASSED: Task validation works correctly\n');
      testsPassed++;
    } else {
      console.log('✗ FAILED: Task validation did not work as expected\n');
      testsFailed++;
    }
  } catch (error) {
    console.log('✗ FAILED: Error in task validation:', error, '\n');
    testsFailed++;
  }

  // Test 3: ComputerUseAgent - Initialization
  console.log('Test 3: ComputerUseAgent Initialization');
  let agent: ComputerUseAgent | null = null;
  try {
    agent = new ComputerUseAgent();
    await agent.initialize(true); // headless mode
    
    const browser = agent.getBrowserController();
    const dom = agent.getDOMManipulator();
    const input = agent.getVirtualInput();
    const parser = agent.getTaskParser();
    
    if (browser && dom && input && parser) {
      console.log('✓ PASSED: Agent initialization and module access works\n');
      testsPassed++;
    } else {
      console.log('✗ FAILED: Agent modules not accessible\n');
      testsFailed++;
    }
  } catch (error) {
    console.log('✗ FAILED: Error in agent initialization:', error, '\n');
    testsFailed++;
  }

  // Test 4: Browser Navigation
  console.log('Test 4: Browser Navigation');
  try {
    if (agent) {
      await agent.executeTask({
        type: 'navigate',
        target: 'https://example.com'
      });
      
      const url = await agent.getBrowserController().getCurrentUrl();
      if (url === 'https://example.com/') {
        console.log('✓ PASSED: Browser navigation works correctly\n');
        testsPassed++;
      } else {
        console.log('✗ FAILED: Browser navigated to wrong URL:', url, '\n');
        testsFailed++;
      }
    } else {
      console.log('✗ FAILED: Agent not initialized\n');
      testsFailed++;
    }
  } catch (error) {
    console.log('✗ FAILED: Error in browser navigation:', error, '\n');
    testsFailed++;
  }

  // Test 5: DOM Manipulation
  console.log('Test 5: DOM Manipulation - Get Title');
  try {
    if (agent) {
      const dom = agent.getDOMManipulator();
      const title = await dom.getTitle();
      
      if (title === 'Example Domain') {
        console.log('✓ PASSED: DOM manipulation works correctly\n');
        testsPassed++;
      } else {
        console.log('✗ FAILED: Unexpected page title:', title, '\n');
        testsFailed++;
      }
    } else {
      console.log('✗ FAILED: Agent not initialized\n');
      testsFailed++;
    }
  } catch (error) {
    console.log('✗ FAILED: Error in DOM manipulation:', error, '\n');
    testsFailed++;
  }

  // Test 6: Multiple Tasks Execution
  console.log('Test 6: Multiple Tasks Execution');
  try {
    if (agent) {
      const tasks = [
        { type: 'wait' as const, value: '500' },
        { type: 'screenshot' as const, target: './test-screenshot.png' }
      ];
      
      await agent.executeTasks(tasks);
      console.log('✓ PASSED: Multiple tasks execution works correctly\n');
      testsPassed++;
    } else {
      console.log('✗ FAILED: Agent not initialized\n');
      testsFailed++;
    }
  } catch (error) {
    console.log('✗ FAILED: Error in multiple tasks execution:', error, '\n');
    testsFailed++;
  }

  // Cleanup
  if (agent) {
    await agent.shutdown();
  }

  // Results
  console.log('\n=================================');
  console.log('Test Results:');
  console.log(`Passed: ${testsPassed}`);
  console.log(`Failed: ${testsFailed}`);
  console.log(`Total: ${testsPassed + testsFailed}`);
  console.log('=================================\n');

  if (testsFailed === 0) {
    console.log('🎉 All tests passed!');
    process.exit(0);
  } else {
    console.log('⚠️ Some tests failed.');
    process.exit(1);
  }
}

// Run tests
if (require.main === module) {
  runTests().catch(error => {
    console.error('Fatal error running tests:', error);
    process.exit(1);
  });
}
