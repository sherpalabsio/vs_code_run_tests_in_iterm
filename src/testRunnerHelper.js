const vscode = require('vscode');

const defaultTestRunners = [
  {
    suffix: '_test.rb',
    command: 'rails test',
  },
  {
    suffix: '_spec.rb',
    command: 'rspec',
  },
  {
    language: 'elixir',
    command: 'mix test',
  },
  {
    language: 'javascript',
    command: 'yarn test',
  },
];

function getExecutable(filePath, languageId) {
  const config = vscode.workspace.getConfiguration('runTestsInIterm');
  const userSpecifiedTestRunners = config.get('testRunners');
  const testRunners = userSpecifiedTestRunners.concat(defaultTestRunners);

  // Check file endings
  const suffixMatch = testRunners.find(
    (entry) => entry.suffix && filePath.endsWith(entry.suffix)
  );
  if (suffixMatch) {
    return suffixMatch.command;
  }

  // Check language ID
  const languageMatch = testRunners.find(
    (entry) => entry.language === languageId
  );

  if (languageMatch) return languageMatch.command;

  return config.get('defaultTestRunner');
}

module.exports = {
  getExecutable,
};
