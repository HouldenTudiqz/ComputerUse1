// src/memory/index.js

class Memory {
  /**
   * Stores and retrieves recent actions, page states, and logs.
   * @param {string} traceId - A unique ID for the current run.
   */
  constructor(traceId) {
    this.traceId = traceId;
    this.logs = [];
  }

  /**
   * Logs an event.
   * @param {object} event - The event to log.
   */
  log(event) {
    this.logs.push(event);
    console.log(`Memory (${this.traceId}):`, event);
  }
}

module.exports = Memory;
