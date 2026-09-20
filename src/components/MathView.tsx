import React, { useState, useMemo } from 'react';
import katex from 'katex';
import { Copy, Check, Code } from 'lucide-react';

interface MathViewProps {
  math: string;
  displayMode?: boolean;
  className?: string;
  showCopy?: boolean;
  showToggle?: boolean;
}

export const MathView: React.FC<MathViewProps> = ({
  math,
  displayMode = true,
  className = '',
  showCopy = true,
  showToggle = true,
}) => {
  const [copied, setCopied] = useState(false);
  const [viewRaw, setViewRaw] = useState(false);

  // Clean the math formula if it has wrapping $ or $$ or markdown backticks
  const cleanedMath = useMemo(() => {
    if (!math) return '';
    let cleaned = math.trim();
    // Strip wrapping $$...$$ or $...$
    if (cleaned.startsWith('$$') && cleaned.endsWith('$$')) {
      cleaned = cleaned.slice(2, -2).trim();
    } else if (cleaned.startsWith('$') && cleaned.endsWith('$') && cleaned.length > 2) {
      cleaned = cleaned.slice(1, -1).trim();
    } else if (cleaned.startsWith('```') && cleaned.endsWith('```')) {
      cleaned = cleaned.replace(/^```[a-z]*\n?/, '').replace(/\n?```$/, '').trim();
    }
    return cleaned;
  }, [math]);

  const renderedHtml = useMemo(() => {
    if (!cleanedMath) return '';
    try {
      return katex.renderToString(cleanedMath, {
        displayMode,
        throwOnError: false,
        errorColor: '#f87171',
        output: 'htmlAndMathml',
      });
    } catch (err) {
      console.warn('KaTeX render warning:', err);
      return '';
    }
  }, [cleanedMath, displayMode]);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(cleanedMath);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  if (!cleanedMath) return null;

  // Inline mode
  if (!displayMode) {
    if (viewRaw || !renderedHtml) {
      return (
        <code className="font-mono text-emerald-300 text-xs px-1 py-0.5 bg-[#090b10] rounded border border-[#1b202c]">
          {cleanedMath}
        </code>
      );
    }
    return (
      <span
        className={`inline-math text-emerald-300 ${className}`}
        dangerouslySetInnerHTML={{ __html: renderedHtml }}
      />
    );
  }

  // Display (Block) mode
  return (
    <div
      className={`group relative my-2 rounded-lg bg-[#07090e] border border-[#1b212f] hover:border-[#283246] transition-all p-3 sm:p-4 overflow-x-auto ${className}`}
    >
      {/* Action controls (Copy LaTeX & Toggle Raw) */}
      <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        {showToggle && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setViewRaw(!viewRaw);
            }}
            title={viewRaw ? 'View Rendered Equation' : 'View Raw LaTeX'}
            className="p-1 rounded bg-[#131824] hover:bg-[#1c2436] border border-[#232d42] text-[#94a3b8] hover:text-white transition-colors text-[10px] font-mono flex items-center gap-1 px-1.5 cursor-pointer"
          >
            <Code className="w-3 h-3 text-cyan-400" />
            <span className="hidden sm:inline">{viewRaw ? 'Render' : 'LaTeX'}</span>
          </button>
        )}
        {showCopy && (
          <button
            onClick={handleCopy}
            title="Copy LaTeX"
            className="p-1 rounded bg-[#131824] hover:bg-[#1c2436] border border-[#232d42] text-[#94a3b8] hover:text-white transition-colors text-[10px] font-mono flex items-center gap-1 px-1.5 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span className="hidden sm:inline">Copy</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Rendered Equation or Raw View */}
      {viewRaw || !renderedHtml ? (
        <pre className="font-mono text-xs text-emerald-300 overflow-x-auto py-1 whitespace-pre-wrap">
          {cleanedMath}
        </pre>
      ) : (
        <div
          className="katex-display-wrapper py-1 text-center text-sm sm:text-base text-emerald-300 font-sans tracking-wide overflow-x-auto select-text"
          dangerouslySetInnerHTML={{ __html: renderedHtml }}
        />
      )}
    </div>
  );
};

/**
 * Helper component that renders text containing inline LaTeX like $x_t$ or math equations.
 */
export const FormattedMathText: React.FC<{ text: string; className?: string }> = ({
  text,
  className = '',
}) => {
  if (!text) return null;

  // Split text by single dollar signs $...$ or double dollar signs $$...$$
  const parts = text.split(/(\$\$[\s\S]+?\$\$|\$[^\$]+?\$)/g);

  return (
    <span className={className}>
      {parts.map((part, idx) => {
        if (part.startsWith('$$') && part.endsWith('$$')) {
          const formula = part.slice(2, -2);
          return <MathView key={idx} math={formula} displayMode={true} />;
        }
        if (part.startsWith('$') && part.endsWith('$')) {
          const formula = part.slice(1, -1);
          return <MathView key={idx} math={formula} displayMode={false} />;
        }
        return <span key={idx}>{part}</span>;
      })}
    </span>
  );
};
