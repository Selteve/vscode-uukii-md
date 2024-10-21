// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as marked from 'marked';
import hljs from 'highlight.js'; // 确保正确导入

let isDarkMode = false; // 用于跟踪当前模式
interface Code {
    text: string;
    lang?: string;
    escaped?: boolean; // 将 escaped 属性设为可选
}


// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "uukii-md" is now active!');

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

function getWebviewContent(markdown: string, isDarkMode: boolean): string {
	// Create a custom renderer for marked
	const renderer = new marked.Renderer();
	renderer.code = ({ text, lang, escaped }: Code) => {
		const language = hljs.getLanguage(lang || '') ? lang : 'plaintext';
		const highlighted = hljs.highlight(text, { language: language || 'plaintext' }).value;
		return `<pre><code class="hljs">${highlighted}</code></pre>`;
	};

	// Set marked options with the custom renderer
	marked.setOptions({
		renderer: renderer,
	});

	const htmlContent = marked.parse(markdown);
	const styles = isDarkMode ? `
		body {
			background-color: #1e1e1e;
			color: #d4d4d4;
		}
	` : `
		body {
			background-color: #ffffff;
			color: #333333;
		}
	`;

	return `
		<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>Markdown Preview</title>
			<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.5.1/styles/default.min.css">
			<style>
				${styles}
				h1, h2, h3, h4, h5, h6 {
					color: ${isDarkMode ? '#569cd6' : '#2c3e50'};
				}
				a {
					color: ${isDarkMode ? '#9cdcfe' : '#3498db'};
					text-decoration: none;
				}
				a:hover {
					text-decoration: underline;
				}
			</style>
		</head>
		<body>
			${htmlContent}
		</body>
		</html>
	`;
}

// This method is called when your extension is deactivated
export function deactivate() {}
