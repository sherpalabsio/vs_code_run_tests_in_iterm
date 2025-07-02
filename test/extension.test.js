const assert = require('assert');
const { describe, it, beforeEach, afterEach } = require('mocha');
const sinon = require('sinon');

const childProcess = require('child_process');
const vscode = require('vscode');
const iterm = require('../src/iterm');

describe('extension', () => {
  let execStub, itermStub;

  beforeEach(() => {
    execStub = sinon.stub(childProcess, 'exec');
    itermStub = sinon.stub(iterm, 'prepareScreen');
  });

  afterEach(() => {
    execStub.restore();
    itermStub.restore();
  });

  it('runs the correct command for a Ruby file', async () => {
    const document = await vscode.workspace.openTextDocument({
      content: 'line1\nline2\nline3\nline4\nline5\n',
    });
    const editor = await vscode.window.showTextDocument(document);

    // Move cursor to line 5
    const position = new vscode.Position(2, 0);
    editor.selection = new vscode.Selection(position, position);

    await vscode.commands.executeCommand('run-tests-in-iterm.runAtCursor');

    assert(execStub.calledOnce);
    const expectedCommand = `make test ${document.uri.fsPath}:3`;
    assert.match(
      execStub.firstCall.args[0],
      new RegExp(`write text "${expectedCommand}"`)
    );
  });
});
