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
Object.defineProperty(exports, "__esModule", { value: true });
exports.runScript = void 0;
const vscode = __importStar(require("vscode"));
const child_process = __importStar(require("child_process"));
function runScript(directoryPath) {
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
exports.runScript = runScript;
//# sourceMappingURL=runScript.js.map