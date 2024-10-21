// 模块 'vscode' 包含了 VS Code 的扩展 API
// 在代码中导入该模块，并使用别名 vscode 来引用
import * as vscode from 'vscode';

// 从 'commands' 模块中导入 registerCommands 函数
import { registerCommands } from './commands';

// activate 函数是 VS Code 扩展的入口点
// 当扩展被激活时，VS Code 会调用这个函数
export function activate(context: vscode.ExtensionContext) {
	// 使用控制台输出诊断信息（console.log）和错误信息（console.error）
	// 这行代码只会在扩展被激活时执行一次
	console.log('Congratulations, your extension "uukii-md" is now active!');

	// 调用 registerCommands 函数来注册扩展的命令
	// context 参数用于管理扩展的生命周期
	registerCommands(context);
}

export function deactivate() {}
