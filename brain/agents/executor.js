const tools = require('../tools/registry');
const logger = require('../../shared/logger');

async function execute(plan) {
  const results = {};
  const pending = [...plan.tasks];

  while (pending.length > 0) {
    const ready = pending.filter(task =>
      task.dependsOn.every(dep => dep in results)
    );

    if (ready.length === 0) {
      logger.error('Circular dependency detected in plan');
      break;
    }

    const executing = ready.map(async task => {
      logger.info(`Executing task: ${task.id} — ${task.description}`);
      try {
        const result = await tools.execute(task.tool, task.params, results);
        results[task.id] = { status: 'success', output: result };
      } catch (err) {
        results[task.id] = { status: 'failed', error: err.message };
        logger.error(`Task ${task.id} failed: ${err.message}`);
      }
    });

    await Promise.all(executing);

    ready.forEach(task => {
      const idx = pending.findIndex(t => t.id === task.id);
      if (idx > -1) pending.splice(idx, 1);
    });
  }

  return results;
}

module.exports = { execute };
