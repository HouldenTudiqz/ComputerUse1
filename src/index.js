// src/index.js

const Orchestrator = require('./orchestrator');

// The main function to run the browser assistant.
async function main() {
  const goal = 'Click the login button on the page.';
  const orchestrator = new Orchestrator(goal);
  await orchestrator.run();
}

main().catch(console.error);
