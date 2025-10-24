// src/orchestrator/index.js

const Navigator = require('../navigator');
const Perception = require('../perception');
const Planner = require('../planner');
const Verifier = require('../verifier');
const Memory = require('../memory');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const planSchema = require('../schemas/plan.schema.json');

class Orchestrator {
  constructor(goal) {
    this.goal = goal;
    this.navigator = new Navigator();
    this.perception = new Perception();
    this.planner = new Planner();
    this.verifier = new Verifier();
    this.memory = new Memory('trace-123'); // Using a static trace ID for now
    this.ajv = new Ajv();
    addFormats(this.ajv);
    this.validatePlan = this.ajv.compile(planSchema);
  }

  /**
   * The main loop that orchestrates the agent's actions.
   */
  async run() {
    this.memory.log({ event: 'start', goal: this.goal });

    let isGoalAchieved = false;
    let maxCycles = 5; // To prevent infinite loops

    for (let i = 0; i < maxCycles; i++) {
      this.memory.log({ event: 'cycle_start', cycle: i + 1 });

      // 1. Perceive
      const perceptionData = await this.perception.summarize();
      this.memory.log({ event: 'perceive', data: perceptionData });

      // 2. Plan
      const plan = await this.planner.createPlan(this.goal, perceptionData);
      this.memory.log({ event: 'plan', data: plan });

      // Validate the plan
      const isPlanValid = this.validatePlan(plan);
      if (!isPlanValid) {
        this.memory.log({ event: 'error', message: 'Invalid plan schema', errors: this.validatePlan.errors });
        console.error('Planner generated an invalid plan:', this.validatePlan.errors);
        break;
      }

      // 3. Execute
      await this.navigator.execute(plan.actions);
      this.memory.log({ event: 'execute', actions: plan.actions });

      // 4. Verify
      isGoalAchieved = await this.verifier.verify(this.goal, perceptionData);
      this.memory.log({ event: 'verify', achieved: isGoalAchieved });

      if (isGoalAchieved) {
        this.memory.log({ event: 'goal_achieved' });
        console.log('Orchestrator: Goal has been achieved!');
        break;
      }
    }

    if (!isGoalAchieved) {
        this.memory.log({ event: 'goal_not_achieved' });
        console.log('Orchestrator: Failed to achieve goal within the cycle limit.');
    }

    this.memory.log({ event: 'end' });
  }
}

module.exports = Orchestrator;
