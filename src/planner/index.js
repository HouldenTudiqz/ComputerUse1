// src/planner/index.js

class Planner {
  /**
   * Generates a plan of actions based on the goal and perception data.
   * @param {string} goal - The user's goal.
   * @param {object} perceptionData - The summarized page content.
   * @returns {Promise<object>} A structured plan of actions.
   */
  async createPlan(goal, perceptionData) {
    console.log('Planner: Creating a plan for goal:', goal);

    // If we are already on the search results page, the plan is complete.
    if (perceptionData.url.includes('google.com/search')) {
      return { actions: [] };
    }

    // This is a hardcoded plan for the specific goal.
    if (goal.includes('weather in Tokyo')) {
      return {
        actions: [
          {
            type: 'navigate',
            url: 'https://www.google.com',
          },
          {
            type: 'type',
            selector: 'textarea[name="q"]',
            text: 'weather in Tokyo Japan',
          },
          {
            type: 'click',
            selector: 'input[name="btnK"]',
          },
        ],
      };
    }

    // Default case: no plan.
    return { actions: [] };
  }
}

module.exports = Planner;
