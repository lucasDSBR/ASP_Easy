
import * as vscode from 'vscode';
import Provider from './CodeLensProvider';
import { updateConfig, getCurrentConfig, getDocumentFilter } from './config';
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

export function activate(context: vscode.ExtensionContext) {
	const codeLensProvider = new Provider();
  	const documentFilter = getDocumentFilter();

	let disposable = vscode.commands.registerCommand('asp-easy.asp-easy-start', () => {

		vscode.window.showInformationMessage('Obrigado por utilizar ASP_Easy!');

		//Verificação (por exemplo, verifica se uma função é "chamada" em mais de um document ou mais de uma vez no mesmo document)
		//context.subscriptions.push(vscode.languages.registerDefinitionProvider({language: "asp"}, new GoDefinitionProvider() ));
		const config = getCurrentConfig();
		const newConfig = { ...config, ...{ useCodeLens: !config.useCodeLens } };

		updateConfig(newConfig, codeLensProvider.update);
	});

	context.subscriptions.push(disposable);
	context.subscriptions.push(
		vscode.languages.registerCodeLensProvider(documentFilter, codeLensProvider)
	  );
}

// This method is called when your extension is deactivated
export function deactivate() {}
