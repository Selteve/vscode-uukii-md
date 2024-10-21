import * as marked from 'marked';
import hljs from 'highlight.js';

interface Code {
    text: string;
    lang?: string;
    escaped?: boolean;
}

export function getWebviewContent(markdown: string, isDarkMode: boolean): string {
    const renderer = new marked.Renderer();
    renderer.code = ({ text, lang, escaped }: Code) => {
        const language = hljs.getLanguage(lang || '') ? lang : 'plaintext';
        const highlighted = hljs.highlight(text, { language: language || 'plaintext' }).value;
        return `<pre><code class="hljs">${highlighted}</code></pre>`;
    };

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

