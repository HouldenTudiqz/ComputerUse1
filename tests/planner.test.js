// tests/planner.test.js

const Planner = require('../src/planner');

describe('Planner', () => {
  it('should create a plan with a valid structure', async () => {
    const planner = new Planner();
    const goal = 'Test goal';
    const perceptionData = { content: 'Test perception data' };

    const plan = await planner.createPlan(goal, perceptionData);

    expect(plan).toBeDefined();
    expect(plan.actions).toBeInstanceOf(Array);
    expect(plan.actions.length).toBeGreaterThan(0);
    expect(plan.actions[0]).toHaveProperty('type');
  });
});
