"use client";

import { useState } from "react";

function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="code-block-copy"
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

function parseInline(text: string, key: string | number): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  let lastIndex = 0;
  let match;
  let idx = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith("**")) {
      parts.push(
        <strong key={`${key}-${idx++}`} className="text-white font-semibold">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith("`")) {
      parts.push(
        <code
          key={`${key}-${idx++}`}
          className="bg-zinc-800 px-1.5 py-0.5 rounded text-xs font-mono text-zinc-200"
        >
          {token.slice(1, -1)}
        </code>
      );
    }
    lastIndex = match.index + token.length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length === 1 ? parts[0] : <span key={key}>{parts}</span>;
}

export function LessonContent({ content }: { content: string }) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Code block
    if (line.startsWith("```")) {
      const lang = line.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      const code = codeLines.join("\n");
      elements.push(
        <div key={i} className="code-block">
          <div className="code-block-header">
            <span className="code-block-lang">{lang || "code"}</span>
            <CopyButton code={code} />
          </div>
          <pre>
            <code>{code}</code>
          </pre>
        </div>
      );
      i++; // skip closing ```
      continue;
    }

    // h1
    if (line.startsWith("# ") && !line.startsWith("## ")) {
      elements.push(<h1 key={i}>{line.slice(2)}</h1>);
      i++;
      continue;
    }

    // h2
    if (line.startsWith("## ") && !line.startsWith("### ")) {
      elements.push(<h2 key={i}>{line.slice(3)}</h2>);
      i++;
      continue;
    }

    // h3
    if (line.startsWith("### ")) {
      elements.push(<h3 key={i}>{line.slice(4)}</h3>);
      i++;
      continue;
    }

    // Blockquote / callout
    if (line.startsWith("> ")) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].startsWith("> ")) {
        quoteLines.push(lines[i].slice(2));
        i++;
      }
      elements.push(
        <blockquote key={i}>
          {quoteLines.map((ql, qi) => (
            <p key={qi}>{parseInline(ql, `bq-${i}-${qi}`)}</p>
          ))}
        </blockquote>
      );
      continue;
    }

    // Image
    const imgMatch = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (imgMatch) {
      elements.push(
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={i}
          src={imgMatch[2]}
          alt={imgMatch[1]}
          className=""
        />
      );
      i++;
      continue;
    }

    // Skip blank lines
    if (line.trim() === "") {
      i++;
      continue;
    }

    // Paragraph — accumulate consecutive non-special lines
    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !lines[i].startsWith("```") &&
      !lines[i].startsWith("#") &&
      !lines[i].startsWith("> ") &&
      !lines[i].match(/^!\[/)
    ) {
      paraLines.push(lines[i]);
      i++;
    }
    if (paraLines.length > 0) {
      elements.push(
        <p key={i}>{parseInline(paraLines.join(" "), i)}</p>
      );
    }
  }

  return <div className="lesson-content">{elements}</div>;
}
