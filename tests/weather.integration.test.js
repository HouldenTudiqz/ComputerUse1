// tests/weather.integration.test.js

const Orchestrator = require('../src/orchestrator');

describe('Weather Integration Test', () => {
  it('should find the weather in Tokyo', async () => {
    const goal = 'Find the current weather in Tokyo, Japan';
    const orchestrator = new Orchestrator(goal);

    // Increase the timeout for this test, as it involves browser automation.
    jest.setTimeout(30000); // 30 seconds

    const result = await orchestrator.run();
    expect(result).toBe(true);
  }, 30000); // Also set the timeout here for Jest
});
