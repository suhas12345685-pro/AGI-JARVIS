const { execSync } = require('child_process');
const CURATED_SKILLS = require('./curatedSkills');
const logger = require('../../shared/logger');

async function installAll() {
  logger.info(`Installing ${CURATED_SKILLS.length} curated skills...`);
  const results = { success: [], failed: [] };

  for (const skill of CURATED_SKILLS) {
    try {
      execSync(skill.installCmd, { stdio: 'pipe', timeout: 60000 });
      results.success.push(skill.name);
      logger.info(`Installed: ${skill.name}`);
    } catch (err) {
      results.failed.push(skill.name);
      logger.warn(`Failed: ${skill.name} — ${err.message}`);
    }
  }

  logger.info(`Skills installed: ${results.success.length}/${CURATED_SKILLS.length}`);
  return results;
}

module.exports = { installAll };
