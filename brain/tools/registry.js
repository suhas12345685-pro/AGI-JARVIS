const webTool      = require('./web');
const fileTool     = require('./files');
const shellTool    = require('./shell');
const laptopTool   = require('./laptop');
const calendarTool = require('./calendar');

const toolMap = {
  web_search:      webTool.search,
  web_fetch:       webTool.fetch,
  file_read:       fileTool.read,
  file_write:      fileTool.write,
  shell_exec:      shellTool.exec,
  laptop_control:  laptopTool.action,
  calendar_read:   calendarTool.read,
  direct_response: async ({ input }) => input,
};

async function execute(toolName, params, previousResults = {}) {
  const tool = toolMap[toolName];
  if (!tool) throw new Error(`Unknown tool: ${toolName}`);
  return await tool(params, previousResults);
}

function list() {
  return Object.keys(toolMap);
}

module.exports = { execute, list };
