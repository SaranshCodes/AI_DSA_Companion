import React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { Button } from './Button';

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  confirmVariant?: 'primary' | 'danger';
  onConfirm?: () => void;
  isLoading?: boolean;
  children?: React.ReactNode;
}

export const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  title,
  description,
  confirmLabel = 'Confirm',
  confirmVariant = 'primary',
  onConfirm,
  isLoading = false,
  children,
}) => {
  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity animate-in fade-in" />
        <DialogPrimitive.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] rounded-card bg-surface p-6 shadow-xl border border-border transition-all duration-200">
          <div className="flex items-start justify-between">
            <DialogPrimitive.Title className="text-lg font-bold text-text">
              {title}
            </DialogPrimitive.Title>
            <DialogPrimitive.Close asChild>
              <button
                type="button"
                className="rounded-full p-1 text-text-muted hover:text-text hover:bg-bg-subtle transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </DialogPrimitive.Close>
          </div>

          {description && (
            <DialogPrimitive.Description className="mt-2 text-sm text-text-muted leading-relaxed">
              {description}
            </DialogPrimitive.Description>
          )}

          {children && <div className="mt-4">{children}</div>}

          <div className="mt-6 flex justify-end gap-3">
            <Button variant="secondary" size="md" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            {onConfirm && (
              <Button
                variant={confirmVariant}
                size="md"
                onClick={onConfirm}
                isLoading={isLoading}
              >
                {confirmLabel}
              </Button>
            )}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};
