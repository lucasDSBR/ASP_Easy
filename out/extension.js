"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const CodeLensProvider_1 = require("./CodeLensProvider");
const config_1 = require("./config");
/*
class GoDefinitionProvider implements vscode.DefinitionProvider {
    public provideDefinition(
        document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken):
        Thenable<vscode.Definition>{
            return new Promise((resolve, reject) =>{
                const range = document.getWordRangeAtPosition(position);
                const selectedWord = document.getText(range);
                let definitions:vscode.Definition = [];
                for (let i = 0; i < document.lineCount; i++) {
                    let eachLine = document.lineAt(i).text.toLowerCase().trim();
                    if (eachLine.startsWith("cursor")) {
                        if ( eachLine.includes(selectedWord)){  //only selectedWord
                            definitions.push({
                                uri: document.uri,
                                range: document.lineAt(i).range
                            });
                        }
                    }
                }

                resolve(definitions);
            });
    }
}
*/
function activate(context) {
    const codeLensProvider = new CodeLensProvider_1.default();
    const documentFilter = (0, config_1.getDocumentFilter)();
    let disposable = vscode.commands.registerCommand('asp-easy.asp-easy-start', () => {
        vscode.window.showInformationMessage('Obrigado por utilizar ASP_Easy!');
        //Verifica��o (por exemplo, verifica se uma fun��o � "chamada" em mais de um document ou mais de uma vez no mesmo document)
        //context.subscriptions.push(vscode.languages.registerDefinitionProvider({language: "asp"}, new GoDefinitionProvider() ));
        const config = (0, config_1.getCurrentConfig)();
        const newConfig = { ...config, ...{ useCodeLens: !config.useCodeLens } };
        (0, config_1.updateConfig)(newConfig, codeLensProvider.update);
    });
    context.subscriptions.push(disposable);
    context.subscriptions.push(vscode.languages.registerCodeLensProvider(documentFilter, codeLensProvider));
}
exports.activate = activate;
// This method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map