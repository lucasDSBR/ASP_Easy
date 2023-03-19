"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const config_1 = require("./config");
const utils_1 = require("./utils");
/**
 * Our implementation of CodeLensProvider
 */
class Provider {
    constructor() {
        this.updateEventEmitter = new vscode_1.EventEmitter();
        this.onDidChangeCodeLenses = this.updateEventEmitter.event;
        this.update = () => {
            this.updateEventEmitter.fire();
        };
    }
    async provideCodeLenses(document) {
        const config = (0, config_1.getCurrentConfig)();
        const language = document.languageId;
        // just ignore computation if this extension is disabled
        if (!config.useCodeLens) {
            return null;
        }
        // parse document's symbols and find interested for us
        const symbols = await vscode_1.commands.executeCommand('vscode.executeDocumentSymbolProvider', document.uri);
        // sometimes symbol is unavailable (empty file ?)
        if (symbols === undefined) {
            vscode_1.window.showErrorMessage('Erro ao encontrar simbolos no arquivo aberto.');
            return null;
        }
        const rangesList = [];
        for (const symbol of symbols) {
            // Still don't know why I wrote this
            // Just filtration of DocumentSymbol, I never seen SymbolInformation here.
            if ((0, utils_1.isDocumentSymbol)(symbol)) {
                rangesList.push(...(0, utils_1.parseDocumentSymbol)(symbol, language));
            }
        }
        // TODO
        // We need to create list of async commands first for perfomance purposes.
        // it's potentially better to move filtration to this.resolveCodeLens
        // BUT: https://stackoverflow.com/questions/53015793
        const asyncResult = rangesList.map(async (data) => {
            const { name, range } = data;
            const startLine = range.start.line;
            // line with found symbol
            const line = document.lineAt(startLine);
            // try to get entry of symbol in that line
            const charStartPosition = line.text.indexOf(name);
            // Sometimes we can't find "name" entry inside the line.
            // For example "name" equals "<function>" for anonymous callbacks.
            // ...have no idea why
            if (charStartPosition === -1) {
                return null;
            }
            const newStartPosition = new vscode_1.Position(startLine, charStartPosition);
            const toResolve = await this.hasZeroReferences(document.uri, newStartPosition);
            // resolve only symbols with zero references
            if (toResolve) {
                return new vscode_1.CodeLens(range, {
                    title: `"${name}" n�o possui referencias`,
                    command: ''
                });
            }
            return null;
        });
        const result = await Promise.all(asyncResult);
        // finally return only instances of CodeLens
        return result.filter((lens) => lens !== null);
    }
    /**
     * Returns true if symbol has zero references and false otherwise.
     */
    async hasZeroReferences(uri, startPosition) {
        const locations = await vscode_1.commands.executeCommand('vscode.executeReferenceProvider', uri, startPosition);
        if (locations === undefined) { // sometimes location is undefined
            return false;
        }
        else if (locations.length === 0) { // obvioulsy no references (actually never match)
            return true;
        }
        else if (locations.length === 1) { // one reference (basically to itself)
            return locations[0].range.start.isEqual(startPosition);
        }
        else { // well we have references
            return false;
        }
    }
}
exports.default = Provider;
//# sourceMappingURL=CodeLensProvider.js.map