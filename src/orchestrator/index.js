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
    this.memory = new Memory('trace-123');
    this.ajv = new Ajv();
    addFormats(this.ajv);
    this.validatePlan = this.ajv.compile(planSchema);
  }

  /**
   * The main loop that orchestrates the agent's actions.
   */
  async run() {
    this.memory.log({ event: 'start', goal: this.goal });

    await this.navigator.init();

    let isGoalAchieved = false;
    let maxCycles = 5;

    for (let i = 0; i < maxCycles; i++) {
      this.memory.log({ event: 'cycle_start', cycle: i + 1 });

      const perceptionData = await this.perception.summarize(this.navigator.page);
      this.memory.log({ event: 'perceive', data: perceptionData });

      const plan = await this.planner.createPlan(this.goal, perceptionData);
      this.memory.log({ event: 'plan', data: plan });

      const isPlanValid = this.validatePlan(plan);
      if (!isPlanValid) {
        this.memory.log({ event: 'error', message: 'Invalid plan schema', errors: this.validatePlan.errors });
        break;
      }

      if (plan.actions.length === 0) {
        this.memory.log({ event: 'no_actions' });
      } else {
        await this.navigator.execute(plan.actions);
        this.memory.log({ event: 'execute', actions: plan.actions });
      }

      isGoalAchieved = await this.verifier.verify(this.goal, this.navigator.page);
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

    await this.navigator.close();
    this.memory.log({ event: 'end' });
    return isGoalAchieved;
  }
}

module.exports = Orchestrator;
