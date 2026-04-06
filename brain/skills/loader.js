const fs = require('fs');
const path = require('path');
const logger = require('../../shared/logger');

const skillsDir = path.resolve('.skills');

function loadAllSkills() {
  const registry = {};

  if (!fs.existsSync(skillsDir)) {
    logger.info('No .skills directory found. Skills will be loaded after installation.');
    return registry;
  }

  const entries = fs.readdirSync(skillsDir, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const skillMdPath = path.join(skillsDir, entry.name, 'SKILL.md');
    if (fs.existsSync(skillMdPath)) {
      const content = fs.readFileSync(skillMdPath, 'utf-8');
      const name = entry.name;

      // Extract triggers from SKILL.md
      const triggerMatch = content.match(/TRIGGER\s+when:\s*(.+)/i);
      const triggers = triggerMatch ? triggerMatch[1].trim() : '';

      registry[name] = { name, content, triggers };
      logger.info(`Skill loaded: ${name}`);
    }
  }

  logger.info(`Total skills loaded: ${Object.keys(registry).length}`);
  return registry;
}

function matchSkill(input, registry) {
  const matches = [];
  for (const [name, skill] of Object.entries(registry)) {
    if (skill.triggers) {
      const keywords = skill.triggers.toLowerCase().split(/[,|;]/);
      const inputLower = input.toLowerCase();
      for (const kw of keywords) {
        if (inputLower.includes(kw.trim())) {
          matches.push(skill);
          break;
        }
      }
    }
  }
  return matches;
}

module.exports = { loadAllSkills, matchSkill };
