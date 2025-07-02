const assert = require('assert');
const { describe, it, beforeEach, afterEach } = require('mocha');
const sinon = require('sinon');

const childProcess = require('child_process');
const iterm = require('../../src/iterm');

describe('.isCurrentSessionBusy', () => {
  let execSyncStub, shellStub;

  beforeEach(() => {
    execSyncStub = sinon.stub(childProcess, 'execSync');
    shellStub = sinon.stub(process.env, 'SHELL').value('/bin/zsh');
  });

  afterEach(() => {
    execSyncStub.restore();
    shellStub.restore();
  });

  it('returns false when the current session is busy', async () => {
    execSyncStub.onCall(0).returns('..sts-in-iterm (-zsh)');

    const result = iterm.isCurrentSessionBusy();

    assert(!result);
  });

  it('returns true when the current session is busy', async () => {
    execSyncStub.onCall(0).returns('bash (tail)');

    const result = iterm.isCurrentSessionBusy();

    assert(result);
  });
});

describe('.prepareScreen', () => {
  let openNewTabStub, clearTheScreenStub, isCurrentSessionBusyStub;

  beforeEach(() => {
    openNewTabStub = sinon.stub(iterm, 'openNewTab');
    clearTheScreenStub = sinon.stub(iterm, 'clearTheScreen');
    isCurrentSessionBusyStub = sinon.stub(iterm, 'isCurrentSessionBusy');
  });

  afterEach(() => {
    openNewTabStub.restore();
    clearTheScreenStub.restore();
    isCurrentSessionBusyStub.restore();
  });

  it('opens a new tab when the current session is busy', async () => {
    isCurrentSessionBusyStub.onCall(0).returns(true);

    iterm.prepareScreen();

    assert(openNewTabStub.calledOnce);
  });

  it('clears the screen when the current session is not busy', async () => {
    isCurrentSessionBusyStub.onCall(0).returns(false);

    iterm.prepareScreen();

    assert(clearTheScreenStub.calledOnce);
  });
});
