// tests/planner.test.js

const Planner = require('../src/planner');

describe('Planner', () => {
  it('should create a plan with a valid structure', async () => {
    const planner = new Planner();
    const goal = 'Test goal';
    const perceptionData = {
      url: 'about:blank', // Mock URL to prevent error
      content: 'Test perception data',
    };

    const plan = await planner.createPlan(goal, perceptionData);

    expect(plan).toBeDefined();
    expect(plan.actions).toBeInstanceOf(Array);
    // The default plan for a non-weather goal is now an empty array.
    expect(plan.actions.length).toBe(0);
  });
});
