import React from 'react';
import Editor from '@monaco-editor/react';

export default function CodeEditor({ code, setCode, language }) {
    return (
        <Editor
            height="400px"
            language={language}
            value={code}
            onChange={val => setCode(val)}
            theme="vs-dark"
        />
    );
}
