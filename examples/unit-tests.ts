import { TaskParser } from '../src/parser/TaskParser';
import { ComputerUseAgent } from '../src/agent/ComputerUseAgent';

/**
 * Unit tests that don't require browser installation
 */
async function runUnitTests() {
  console.log('Starting Computer Use AI Unit Tests...\n');

  let testsPassed = 0;
  let testsFailed = 0;

  // Test 1: TaskParser - Natural Language Navigation
  console.log('Test 1: TaskParser Natural Language - Navigation');
  try {
    const parser = new TaskParser();
    const tasks = parser.parseNaturalLanguage('go to https://example.com');
    
    if (tasks.length === 1 && 
        tasks[0].type === 'navigate' && 
        tasks[0].target === 'https://example.com') {
      console.log('✓ PASSED: Navigate command parsed correctly\n');
      testsPassed++;
    } else {
      console.log('✗ FAILED: Navigate command parsing failed\n');
      console.log('  Expected: 1 task with type="navigate", target="https://example.com"');
      console.log('  Got:', JSON.stringify(tasks, null, 2));
      testsFailed++;
    }
  } catch (error) {
    console.log('✗ FAILED: Error in navigate parsing:', error, '\n');
    testsFailed++;
  }

  // Test 2: TaskParser - Natural Language Click
  console.log('Test 2: TaskParser Natural Language - Click');
  try {
    const parser = new TaskParser();
    const tasks = parser.parseNaturalLanguage('click on submit button');
    
    if (tasks.length === 1 && 
        tasks[0].type === 'click' && 
        tasks[0].target === 'submit button') {
      console.log('✓ PASSED: Click command parsed correctly\n');
      testsPassed++;
    } else {
      console.log('✗ FAILED: Click command parsing failed\n');
      console.log('  Got:', JSON.stringify(tasks, null, 2));
      testsFailed++;
    }
  } catch (error) {
    console.log('✗ FAILED: Error in click parsing:', error, '\n');
    testsFailed++;
  }

  // Test 3: TaskParser - Natural Language Type
  console.log('Test 3: TaskParser Natural Language - Type');
  try {
    const parser = new TaskParser();
    const tasks = parser.parseNaturalLanguage('type "hello world" into search box');
    
    if (tasks.length === 1 && 
        tasks[0].type === 'type' && 
        tasks[0].value === 'hello world' &&
        tasks[0].target === 'search box') {
      console.log('✓ PASSED: Type command parsed correctly\n');
      testsPassed++;
    } else {
      console.log('✗ FAILED: Type command parsing failed\n');
      console.log('  Got:', JSON.stringify(tasks, null, 2));
      testsFailed++;
    }
  } catch (error) {
    console.log('✗ FAILED: Error in type parsing:', error, '\n');
    testsFailed++;
  }

  // Test 4: TaskParser - Natural Language Wait
  console.log('Test 4: TaskParser Natural Language - Wait');
  try {
    const parser = new TaskParser();
    const tasks = parser.parseNaturalLanguage('wait 5 seconds');
    
    if (tasks.length === 1 && 
        tasks[0].type === 'wait' && 
        tasks[0].value === '5') {
      console.log('✓ PASSED: Wait command parsed correctly\n');
      testsPassed++;
    } else {
      console.log('✗ FAILED: Wait command parsing failed\n');
      console.log('  Got:', JSON.stringify(tasks, null, 2));
      testsFailed++;
    }
  } catch (error) {
    console.log('✗ FAILED: Error in wait parsing:', error, '\n');
    testsFailed++;
  }

  // Test 5: TaskParser - Natural Language Screenshot
  console.log('Test 5: TaskParser Natural Language - Screenshot');
  try {
    const parser = new TaskParser();
    const tasks = parser.parseNaturalLanguage('take a screenshot');
    
    if (tasks.length === 1 && tasks[0].type === 'screenshot') {
      console.log('✓ PASSED: Screenshot command parsed correctly\n');
      testsPassed++;
    } else {
      console.log('✗ FAILED: Screenshot command parsing failed\n');
      console.log('  Got:', JSON.stringify(tasks, null, 2));
      testsFailed++;
    }
  } catch (error) {
    console.log('✗ FAILED: Error in screenshot parsing:', error, '\n');
    testsFailed++;
  }

  // Test 6: TaskParser - Task Creation
  console.log('Test 6: TaskParser Task Creation');
  try {
    const parser = new TaskParser();
    const task = parser.createTask('navigate', 'https://example.com');
    
    if (task.type === 'navigate' && task.target === 'https://example.com') {
      console.log('✓ PASSED: Task creation works correctly\n');
      testsPassed++;
    } else {
      console.log('✗ FAILED: Task creation failed\n');
      console.log('  Got:', JSON.stringify(task, null, 2));
      testsFailed++;
    }
  } catch (error) {
    console.log('✗ FAILED: Error in task creation:', error, '\n');
    testsFailed++;
  }

  // Test 7: TaskParser - Task Validation (Valid)
  console.log('Test 7: TaskParser Task Validation - Valid Tasks');
  try {
    const parser = new TaskParser();
    const validNavigate = parser.createTask('navigate', 'https://example.com');
    const validClick = parser.createTask('click', '#button');
    const validType = parser.createTask('type', '#input', 'test');
    const validWait = parser.createTask('wait', undefined, '1000');
    
    if (parser.validateTask(validNavigate) && 
        parser.validateTask(validClick) && 
        parser.validateTask(validType) &&
        parser.validateTask(validWait)) {
      console.log('✓ PASSED: Valid task validation works correctly\n');
      testsPassed++;
    } else {
      console.log('✗ FAILED: Valid task validation failed\n');
      testsFailed++;
    }
  } catch (error) {
    console.log('✗ FAILED: Error in valid task validation:', error, '\n');
    testsFailed++;
  }

  // Test 8: TaskParser - Task Validation (Invalid)
  console.log('Test 8: TaskParser Task Validation - Invalid Tasks');
  try {
    const parser = new TaskParser();
    const invalidNavigate = parser.createTask('navigate'); // missing target
    const invalidType = parser.createTask('type', '#input'); // missing value
    
    if (!parser.validateTask(invalidNavigate) && !parser.validateTask(invalidType)) {
      console.log('✓ PASSED: Invalid task validation works correctly\n');
      testsPassed++;
    } else {
      console.log('✗ FAILED: Invalid task validation failed\n');
      testsFailed++;
    }
  } catch (error) {
    console.log('✗ FAILED: Error in invalid task validation:', error, '\n');
    testsFailed++;
  }

  // Test 9: TaskParser - Structured Parsing
  console.log('Test 9: TaskParser Structured Parsing');
  try {
    const parser = new TaskParser();
    const taskData = { type: 'navigate', target: 'https://example.com' };
    const task = parser.parseStructured(taskData);
    
    if (task.type === 'navigate' && task.target === 'https://example.com') {
      console.log('✓ PASSED: Structured parsing works correctly\n');
      testsPassed++;
    } else {
      console.log('✗ FAILED: Structured parsing failed\n');
      console.log('  Got:', JSON.stringify(task, null, 2));
      testsFailed++;
    }
  } catch (error) {
    console.log('✗ FAILED: Error in structured parsing:', error, '\n');
    testsFailed++;
  }

  // Test 10: TaskParser - Structured Array Parsing
  console.log('Test 10: TaskParser Structured Array Parsing');
  try {
    const parser = new TaskParser();
    const tasksData = [
      { type: 'navigate', target: 'https://example.com' },
      { type: 'click', target: '#button' },
      { type: 'wait', value: '1000' }
    ];
    const tasks = parser.parseStructuredArray(tasksData);
    
    if (tasks.length === 3 && 
        tasks[0].type === 'navigate' &&
        tasks[1].type === 'click' &&
        tasks[2].type === 'wait') {
      console.log('✓ PASSED: Structured array parsing works correctly\n');
      testsPassed++;
    } else {
      console.log('✗ FAILED: Structured array parsing failed\n');
      console.log('  Got:', JSON.stringify(tasks, null, 2));
      testsFailed++;
    }
  } catch (error) {
    console.log('✗ FAILED: Error in structured array parsing:', error, '\n');
    testsFailed++;
  }

  // Test 11: ComputerUseAgent - Instantiation
  console.log('Test 11: ComputerUseAgent Instantiation');
  try {
    const agent = new ComputerUseAgent();
    const parser = agent.getTaskParser();
    
    if (agent && parser) {
      console.log('✓ PASSED: ComputerUseAgent instantiation works correctly\n');
      testsPassed++;
    } else {
      console.log('✗ FAILED: ComputerUseAgent instantiation failed\n');
      testsFailed++;
    }
  } catch (error) {
    console.log('✗ FAILED: Error in agent instantiation:', error, '\n');
    testsFailed++;
  }

  // Results
  console.log('\n=================================');
  console.log('Test Results:');
  console.log(`Passed: ${testsPassed}`);
  console.log(`Failed: ${testsFailed}`);
  console.log(`Total: ${testsPassed + testsFailed}`);
  console.log('=================================\n');

  if (testsFailed === 0) {
    console.log('🎉 All unit tests passed!');
    process.exit(0);
  } else {
    console.log('⚠️ Some tests failed.');
    process.exit(1);
  }
}

// Run tests
if (require.main === module) {
  runUnitTests().catch(error => {
    console.error('Fatal error running tests:', error);
    process.exit(1);
  });
}
