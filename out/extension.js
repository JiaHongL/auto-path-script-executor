"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(require("vscode"));
const fs = require('fs');
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
function getDefaultScriptConfig() {
    const scripts = getPackagesScripts();
    let config = [];
    scripts.forEach((script) => {
        config.push({
            script,
            paramName: getDefaultParamName()
        });
    });
    return config;
}
function getDefaultParamName() {
    var _a;
    const packageJson = readPackageJson();
    return ((_a = packageJson === null || packageJson === void 0 ? void 0 : packageJson.autoPathScriptExecutor) === null || _a === void 0 ? void 0 : _a.defaultParamName) || 'path';
}
function getCustomScriptConfig() {
    var _a;
    const packageJson = readPackageJson();
    const scriptExecutorScripts = ((_a = packageJson === null || packageJson === void 0 ? void 0 : packageJson.autoPathScriptExecutor) === null || _a === void 0 ? void 0 : _a.scripts) || [];
    let config = [];
    scriptExecutorScripts.forEach((scriptConfig) => {
        if (typeof scriptConfig === 'string') {
            const script = scriptConfig;
            config.push({
                script: script,
                paramName: getDefaultParamName()
            });
        }
        else {
            config.push({
                script: scriptConfig.script,
                paramName: scriptConfig.paramName || getDefaultParamName()
            });
        }
    });
    return config;
}
function activate(context) {
    let disposable = vscode.commands.registerCommand('extension.autoPathScriptExecutor', (folder) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        console.log('Folder object:', folder);
        try {
            if (folder && folder.fsPath) {
                const terminalName = 'Run Script';
                const customScriptConfig = getCustomScriptConfig().length ? getCustomScriptConfig() : getDefaultScriptConfig().length ? getDefaultScriptConfig() : [];
                const scripts = customScriptConfig.map((scriptConfig) => scriptConfig.script);
                const selectedScript = yield vscode.window.showQuickPick(scripts);
                if (selectedScript) {
                    let terminal = vscode.window.terminals.find(t => t.name === terminalName);
                    const paramName = ((_a = customScriptConfig.find((scriptConfig) => scriptConfig.script === selectedScript)) === null || _a === void 0 ? void 0 : _a.paramName) || getDefaultParamName();
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
            }
            else {
                console.error('Invalid folder object');
            }
        }
        catch (error) {
            console.error('Script execution failed:', error);
        }
    }));
    context.subscriptions.push(disposable);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map