import * as assert from 'assert';
import * as vscode from 'vscode';
import * as myExtension from '../src/extension';

suite('Extension Test Suite', () => {
  vscode.window.showInformationMessage('Start all tests.');

  test('runScript', () => {
    const directoryPath = '/path/to/directory';
    const scriptName = 'testScript';

    // 模拟 `getDirectoryPath` 和 `vscode.window.showQuickPick`
    sinon.stub(myExtension, 'getDirectoryPath').returns(directoryPath);
    sinon.stub(vscode.window, 'showQuickPick').returns(Promise.resolve(scriptName));

    return myExtension.runScript().then(() => {
      // 验证 `vscode.tasks.executeTask` 被正确调用
      assert.ok(vscode.tasks.executeTask.calledWith(sinon.match.has('definition', {
        type: 'npm',
        script: scriptName,
        path: directoryPath
      })));
    });
  });
});