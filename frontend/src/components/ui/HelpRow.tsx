import React from 'react';
import { Lock, Lightbulb, CheckCircle2, ChevronRight, Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import clsx from 'clsx';
import { Button } from './Button';
import { MultiLanguageCode } from '@/api/types';

export type SolutionLanguage = 'python' | 'cpp' | 'java';

const LANGUAGE_OPTIONS: { id: SolutionLanguage; label: string; copyLabel: string }[] = [
  { id: 'python', label: 'Python', copyLabel: 'Copy Python' },
  { id: 'cpp', label: 'C++', copyLabel: 'Copy C++' },
  { id: 'java', label: 'Java', copyLabel: 'Copy Java' },
];

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
  solutions?: MultiLanguageCode | null;
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
  solutions,
  complexity,
  isLoading = false,
  onReveal,
  ctaText = 'Reveal',
}) => {
  const [copied, setCopied] = React.useState(false);
  const [activeLang, setActiveLang] = React.useState<SolutionLanguage>(() => {
    try {
      const stored = localStorage.getItem('dsa_preferred_language');
      if (stored === 'python' || stored === 'cpp' || stored === 'java') {
        return stored;
      }
    } catch {
      // ignore
    }
    return 'python';
  });

  const handleSelectLang = (lang: SolutionLanguage) => {
    setActiveLang(lang);
    try {
      localStorage.setItem('dsa_preferred_language', lang);
    } catch {
      // ignore
    }
  };

  const hasCodeToDisplay = Boolean(code || solutions);

  // Safe fallback for active code string
  const activeCode =
    solutions?.[activeLang] ||
    (activeLang === 'python'
      ? (code ?? '')
      : '// Legacy cached session — re-generate solution for C++/Java');

  const activeLangConfig =
    LANGUAGE_OPTIONS.find((l) => l.id === activeLang) || LANGUAGE_OPTIONS[0];

  const handleCopyCode = async () => {
    if (!activeCode) return;
    try {
      await navigator.clipboard.writeText(activeCode);
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
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border/60">
        <div className="flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
          <span className="text-sm font-semibold text-text">{label}</span>
          <span className="text-xs text-text-muted">({sublabel})</span>
        </div>

        {hasCodeToDisplay && (
          <div className="flex items-center gap-2">
            {/* Segmented language switcher tabs */}
            <div
              role="tablist"
              aria-label="Solution language"
              className="flex items-center p-0.5 bg-track border border-border/60 rounded-control text-xs"
            >
              {LANGUAGE_OPTIONS.map((lang) => {
                const isActive = activeLang === lang.id;
                return (
                  <button
                    key={lang.id}
                    role="tab"
                    type="button"
                    aria-selected={isActive}
                    onClick={() => handleSelectLang(lang.id)}
                    className={clsx(
                      'px-2.5 py-1 font-medium rounded-md transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-text',
                      isActive
                        ? 'bg-surface text-text shadow-xs font-semibold'
                        : 'text-text-muted hover:text-text'
                    )}
                  >
                    {lang.label}
                  </button>
                );
              })}
            </div>

            {/* Copy button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyCode}
              className="gap-1.5 text-xs h-7 px-2.5"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-success" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  {activeLangConfig.copyLabel}
                </>
              )}
            </Button>
          </div>
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

      {hasCodeToDisplay && (
        <div className="mt-3 overflow-hidden rounded-control border border-neutral-800 shadow-sm">
          <SyntaxHighlighter
            language={activeLang}
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
            {activeCode}
          </SyntaxHighlighter>
        </div>
      )}
    </div>
  );
};
