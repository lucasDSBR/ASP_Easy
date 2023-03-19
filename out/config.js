"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateConfig = exports.getCurrentConfig = exports.getDocumentFilter = exports.supportedKinds = void 0;
const vscode_1 = require("vscode");
// supported languages and its kinds
// https://code.visualstudio.com/docs/languages/identifiers#_known-language-identifiers
//
// We will ignore kinds not listed here
exports.supportedKinds = new Map([
    ['typescript', [
            vscode_1.SymbolKind.Class,
            vscode_1.SymbolKind.Function,
            vscode_1.SymbolKind.Method,
            vscode_1.SymbolKind.Property,
            vscode_1.SymbolKind.Variable,
            vscode_1.SymbolKind.Enum,
            vscode_1.SymbolKind.Interface,
            vscode_1.SymbolKind.Module
        ]],
    ['typescriptreact', [
            vscode_1.SymbolKind.Class,
            vscode_1.SymbolKind.Function,
            vscode_1.SymbolKind.Method,
            vscode_1.SymbolKind.Property,
            vscode_1.SymbolKind.Variable,
            vscode_1.SymbolKind.Enum,
            vscode_1.SymbolKind.Interface,
            vscode_1.SymbolKind.Module
        ]],
    ['javascript', [
            vscode_1.SymbolKind.Class,
            vscode_1.SymbolKind.Function,
            vscode_1.SymbolKind.Method,
            vscode_1.SymbolKind.Property,
            vscode_1.SymbolKind.Variable
        ]],
    ['javascriptreact', [
            vscode_1.SymbolKind.Class,
            vscode_1.SymbolKind.Function,
            vscode_1.SymbolKind.Method,
            vscode_1.SymbolKind.Property,
            vscode_1.SymbolKind.Variable
        ]],
    ['asp', [
            vscode_1.SymbolKind.Class,
            vscode_1.SymbolKind.Function,
            vscode_1.SymbolKind.Method,
            vscode_1.SymbolKind.Property,
            vscode_1.SymbolKind.Variable,
            vscode_1.SymbolKind.Sub
        ]]
]);
/**
 * Returns document filter which is required to activate commands
 * for supported file types only.
 */
function getDocumentFilter() {
    return [...exports.supportedKinds.keys()].map((languageId) => {
        return { language: languageId };
    });
}
exports.getDocumentFilter = getDocumentFilter;
// Get corrent configuration of this extension
function getCurrentConfig() {
    const config = vscode_1.workspace.getConfiguration().get('zeroReference');
    if (config === undefined) {
        return { useCodeLens: false };
    }
    return config;
}
exports.getCurrentConfig = getCurrentConfig;
// Update global configuration
async function updateConfig(config, callback) {
    const configuration = vscode_1.workspace.getConfiguration('zeroReference');
    await configuration.update('useCodeLens', config.useCodeLens, vscode_1.ConfigurationTarget.Global);
    callback && await callback();
}
exports.updateConfig = updateConfig;
//# sourceMappingURL=config.js.map