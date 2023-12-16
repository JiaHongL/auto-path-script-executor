import * as vscode from 'vscode';
import * as child_process from 'child_process';

export function runScript(directoryPath: string) {
    const packageJsonPath = `${directoryPath}/package.json`;

    child_process.exec(`npm run --prefix ${packageJsonPath}`, (error, stdout, stderr) => {
        if (error) {
            vscode.window.showErrorMessage(`Error running script: ${error.message}`);
            return;
        }

        if (stderr) {
            vscode.window.showErrorMessage(`Error running script: ${stderr}`);
            return;
        }

        vscode.window.showInformationMessage(`Script output: ${stdout}`);
    });
}