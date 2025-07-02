const vscode = require('vscode');
const { runAll, runCurrentFile, runAtCursor } = require('./src/commands');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  let disposable = vscode.commands.registerCommand(
    'run-tests-in-iterm.runAll',
    runAll
  );
  context.subscriptions.push(disposable);

  disposable = vscode.commands.registerCommand(
    'run-tests-in-iterm.runCurrentFile',
    runCurrentFile
  );
  context.subscriptions.push(disposable);

  disposable = vscode.commands.registerCommand(
    'run-tests-in-iterm.runAtCursor',
    runAtCursor
  );
  context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
