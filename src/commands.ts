import * as vscode from 'vscode';
import { getWebviewContent } from './webviewContent';

let isDarkMode = false;

export function registerCommands(context: vscode.ExtensionContext) {
    const previewCommand = vscode.commands.registerCommand('uukii-md.previewMarkdown', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor && editor.document.languageId === 'markdown') {
            const panel = vscode.window.createWebviewPanel(
                'markdownPreview',
                'Markdown Preview',
                vscode.ViewColumn.Beside,
                {}
            );

            const updateWebview = () => {
                const markdownContent = editor.document.getText();
                panel.webview.html = getWebviewContent(markdownContent, isDarkMode);
            };

            updateWebview();

            const changeDocumentSubscription = vscode.workspace.onDidChangeTextDocument(event => {
                if (event.document === editor.document) {
                    updateWebview();
                }
            });

            panel.onDidDispose(() => {
                changeDocumentSubscription.dispose();
            }, null, context.subscriptions);
        } else {
            vscode.window.showInformationMessage('Please open a Markdown file to preview.');
        }
    });

    const toggleLightModeCommand = vscode.commands.registerCommand('uukii-md.toggleLightMode', () => {
        isDarkMode = false;
        vscode.window.showInformationMessage('Switched to Light Mode');
    });

    const toggleDarkModeCommand = vscode.commands.registerCommand('uukii-md.toggleDarkMode', () => {
        isDarkMode = true;
        vscode.window.showInformationMessage('Switched to Dark Mode');
    });

    context.subscriptions.push(previewCommand, toggleLightModeCommand, toggleDarkModeCommand);
}
