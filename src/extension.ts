import * as vscode from 'vscode';
const fs = require('fs');

interface ScriptConfig {
    script: string,
    paramName: string
}

function readPackageJson() {
    const packageJsonPath = getWorkspaceFolder().uri.fsPath + '/package.json';
    if (fs.existsSync(packageJsonPath)) {
        return JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    }
    return null;
}

function getWorkspaceFolder() {
    const workspaceFolders = vscode.workspace.workspaceFolders || [];
    const workspaceFolder = workspaceFolders[0];
    return workspaceFolder;

}

function getPackagesScripts() {
    const packageJson = readPackageJson();
    const scripts = packageJson.scripts || {};
    return Object.keys(scripts);
}

function getDefaultScriptConfig(){
    const scripts = getPackagesScripts();
    let config: ScriptConfig[] = [];
    scripts.forEach((script) => {
        config.push({
            script,
            paramName: getDefaultParamName()
        });
    });
    return config;
}

function getDefaultParamName() {
    const packageJson = readPackageJson();
    return packageJson?.autoPathScriptExecutor?.defaultParamName || 'path';
}

function getCustomScriptConfig() {
    const packageJson = readPackageJson();
    const scriptExecutorScripts = packageJson?.autoPathScriptExecutor?.scripts || [];
    let config: ScriptConfig[] = [];
    scriptExecutorScripts.forEach((scriptConfig: any) => {
        if (typeof scriptConfig === 'string') {
            const script = scriptConfig;
            config.push({
                script: script,
                paramName: getDefaultParamName()
            });
        } else {
            config.push({
                script: scriptConfig.script,
                paramName: scriptConfig.paramName || getDefaultParamName()
            });
        }
    });
    return config;
}

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension.autoPathScriptExecutor', async (folder) => {
        console.log('Folder object:', folder);

        try {
            if (folder && folder.fsPath) {

                const terminalName = 'Run Script';
                const customScriptConfig:ScriptConfig[] = getCustomScriptConfig().length ? getCustomScriptConfig() : getDefaultScriptConfig().length ? getDefaultScriptConfig() : [];
                const scripts = customScriptConfig.map((scriptConfig:ScriptConfig) => scriptConfig.script);

                const selectedScript = await vscode.window.showQuickPick(scripts);

                if (selectedScript) {

                    let terminal = vscode.window.terminals.find(t => t.name === terminalName);

                    const paramName = customScriptConfig.find((scriptConfig:ScriptConfig) => scriptConfig.script === selectedScript)?.paramName || getDefaultParamName();

                    if (!terminal) {
                        terminal = vscode.window.createTerminal({
                            name: terminalName
                        });
                    }

                    const workspaceFolder = getWorkspaceFolder();
                    const relativePath = folder.fsPath.replace(workspaceFolder.uri.fsPath, '');
                    
                    terminal.sendText(`npm run ${selectedScript} -- --${paramName}=${relativePath}`);
                    terminal.show();
                }
            } else {
                console.error('Invalid folder object');
            }
        } catch (error) {
            console.error('Script execution failed:', error);
        }
    });
    context.subscriptions.push(disposable);
}

export function deactivate() { }