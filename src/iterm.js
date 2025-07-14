const vscode = require('vscode');
const childProcess = require('child_process');

class Iterm {
  static run(command) {
    Iterm.prepareScreen();

    const config = vscode.workspace.getConfiguration('runTestsInIterm');
    const activationScript = config.get('bringItermForwardOnExecution')
      ? 'activate'
      : '';

    const appleScript = `
      tell application "iterm"
        ${activationScript}

        tell current session of current window
          write text "${command}"
        end tell
      end tell
    `;

    console.log(`Running in iTerm: ${command}`);

    childProcess.exec(
      `osascript -e '${appleScript}'`,
      (error, _stdout, stderr) => {
        if (error) {
          console.error(`Run test in iTerm failed: ${command}`, error, stderr);
          vscode.window.showErrorMessage(
            `Run tests in iTerm failed: ${error.message}`
          );
          return;
        }
      }
    );
  }

  static prepareScreen() {
    const config = vscode.workspace.getConfiguration('runTestsInIterm');

    if (
      config.get('openNewTab') &&
      !config.get('iUseTmux') &&
      Iterm.isCurrentSessionBusy()
    ) {
      Iterm.openNewTab();
    } else if (config.get('clearTheScreen')) {
      Iterm.clearTheScreen();
    }
  }

  static isCurrentSessionBusy() {
    const shell = process.env.SHELL.split('/').pop();

    const appleScript = `
        tell application "iterm"
          tell current session of current window
            get name
          end tell
        end tell
      `;

    const currentSessionTitle = childProcess
      .execSync(`osascript -e '${appleScript}'`)
      .toString()
      .trim();
    return (
      !currentSessionTitle.endsWith(`(-${shell})`) &&
      currentSessionTitle != `-${shell}`
    );
  }

  static clearTheScreen() {
    const appleScript = `
      tell application "iterm"
        tell current session of current window
          -- Clear the current prompt - Equivalent to Ctrl+U (delete line in Bash)
          write text (ASCII character 21) without newline

          -- Clear the screen and the scrollback buffer
          write text " clear && printf \\"\\\\e[3J\\""
          delay 0.1
        end tell
      end tell
    `;

    childProcess.execSync(`osascript -e '${appleScript}'`);
  }

  static openNewTab() {
    const appleScript = `
        tell application "iterm"
          activate

          tell current window
            create tab with default profile
            delay 0.7 -- wait for the shell to start
          end tell
        end tell
      `;

    childProcess.execSync(`osascript -e '${appleScript}'`);
  }
}

module.exports = Iterm;
