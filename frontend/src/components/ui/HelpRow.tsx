import React from 'react';
import { Lock, Lightbulb, CheckCircle2, ChevronRight, Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Button } from './Button';

const customCodeTheme = {
  ...vscDarkPlus,
  comment: {
    color: '#6A9955',
    fontStyle: 'italic',
  },
};

export interface HelpRowProps {
  label: string;
  sublabel: string;
  isUnlocked: boolean;
  isLocked: boolean;
  lockReason?: string;
  content?: string | null;
  code?: string | null;
  complexity?: {
    time: string;
    space: string;
  };
  isLoading?: boolean;
  onReveal?: () => void;
  ctaText?: string;
  requiresConfirmation?: boolean;
}

export const HelpRow: React.FC<HelpRowProps> = ({
  label,
  sublabel,
  isUnlocked,
  isLocked,
  lockReason,
  content,
  code,
  complexity,
  isLoading = false,
  onReveal,
  ctaText = 'Reveal',
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopyCode = async () => {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  // Locked State
  if (isLocked) {
    return (
      <div className="p-4 rounded-control border border-dashed border-border-dashed bg-bg-subtle flex items-center justify-between text-text-muted">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-track flex items-center justify-center">
            <Lock className="w-3.5 h-3.5 text-text-subtle" />
          </div>
          <div>
            <span className="text-sm font-medium text-text-muted">{label}</span>
            <span className="mx-2 text-text-subtle">·</span>
            <span className="text-xs text-text-subtle">{sublabel}</span>
          </div>
        </div>
        {lockReason && (
          <span className="text-xs text-text-subtle italic">{lockReason}</span>
        )}
      </div>
    );
  }

  // Available to reveal State
  if (!isUnlocked) {
    return (
      <div className="p-4 rounded-control border border-border bg-surface flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-amber-50 flex items-center justify-center text-warning">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <span className="text-sm font-semibold text-text">{label}</span>
            <span className="mx-2 text-text-muted">·</span>
            <span className="text-xs text-text-muted">{sublabel}</span>
          </div>
        </div>
        {onReveal && (
          <Button
            variant="secondary"
            size="sm"
            onClick={onReveal}
            isLoading={isLoading}
            className="gap-1.5"
          >
            {ctaText}
            <ChevronRight className="w-3.5 h-3.5" />
          </Button>
        )}
      </div>
    );
  }

  // Unlocked State
  return (
    <div className="p-5 rounded-control border border-border bg-surface shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-border/60">
        <div className="flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-success" />
          <span className="text-sm font-semibold text-text">{label}</span>
          <span className="text-xs text-text-muted">({sublabel})</span>
        </div>
        {code && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopyCode}
            className="gap-1.5 text-xs"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-success" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copy Python 3
              </>
            )}
          </Button>
        )}
      </div>

      {content && (
        <div className="mt-3 text-sm text-text leading-relaxed prose prose-sm max-w-none">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      )}

      {complexity && (
        <div className="mt-3 flex gap-4 text-xs font-medium text-text-muted bg-bg-subtle p-2.5 rounded-control border border-border/60">
          <span>
            <strong className="text-text">Time Complexity:</strong> {complexity.time}
          </span>
          <span>·</span>
          <span>
            <strong className="text-text">Space Complexity:</strong> {complexity.space}
          </span>
        </div>
      )}

      {code && (
        <div className="mt-3 overflow-hidden rounded-control border border-neutral-800 shadow-sm">
          <SyntaxHighlighter
            language="python"
            style={customCodeTheme}
            showLineNumbers={true}
            wrapLongLines={true}
            customStyle={{
              backgroundColor: '#161b22',
              fontSize: '14px',
              lineHeight: '1.6',
              padding: '1.25rem',
              margin: 0,
              borderRadius: '0',
              fontFamily:
                'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
            }}
            lineNumberStyle={{
              color: '#6e7681',
              minWidth: '2.5em',
              paddingRight: '1em',
              userSelect: 'none',
            }}
          >
            {code}
          </SyntaxHighlighter>
        </div>
      )}
    </div>
  );
};
