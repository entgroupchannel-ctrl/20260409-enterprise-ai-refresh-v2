/**
 * useDocumentDraft
 *
 * Generic draft-save hook for all document pages:
 * quote_requests → invoices → tax_invoices → receipts / credit_notes
 *
 * Behaviour (mirrors Flowaccount UX):
 *  1. User edits any field  → local state updates instantly (no DB call)
 *  2. isDirty = true        → "ยังไม่ได้บันทึก" badge shows in navbar/header
 *  3. On leaving the page   → auto-flush to DB via beforeunload + React Router v6 blocker
 *  4. Explicit save button  → flush immediately
 *  5. On save success       → isDirty = false, lastSaved = now
 */

import {
  useState, useEffect, useCallback, useRef,
} from 'react';
import { useBeforeUnload, useBlocker } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type DocumentTable =
  | 'quote_requests'
  | 'invoices'
  | 'tax_invoices'
  | 'receipts'
  | 'credit_notes'
  | 'sale_orders';

interface UseDocumentDraftOptions<T extends Record<string, any>> {
  /** Supabase table name */
  table: DocumentTable;
  /** Document ID (UUID) */
  id: string | undefined;
  /** Initial values loaded from DB */
  initialData: T | null;
  /** Fields to include in patch (omit read-only / computed fields) */
  patchFields: (keyof T)[];
  /** Called after successful save so parent can reload if needed */
  onSaved?: (saved: T) => void;
}

interface UseDocumentDraftResult<T extends Record<string, any>> {
  /** Current local draft — bind to all form inputs */
  draft: T | null;
  /** True when local draft differs from last saved state */
  isDirty: boolean;
  /** True during DB write */
  saving: boolean;
  /** Timestamp of last successful save */
  lastSaved: Date | null;
  /** Update one or more fields in local draft */
  setField: (field: keyof T, value: any) => void;
  /** Update multiple fields at once */
  setFields: (patch: Partial<T>) => void;
  /** Flush draft to DB immediately */
  save: () => Promise<boolean>;
  /** Discard local changes and revert to last saved */
  discard: () => void;
}

export function useDocumentDraft<T extends Record<string, any>>({
  table,
  id,
  initialData,
  patchFields,
  onSaved,
}: UseDocumentDraftOptions<T>): UseDocumentDraftResult<T> {
  const { toast } = useToast();
  const [draft, setDraft] = useState<T | null>(null);
  const [savedData, setSavedData] = useState<T | null>(null);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const saveRef = useRef<() => Promise<boolean>>();

  // Sync when initialData arrives (page load / reload after save)
  useEffect(() => {
    if (initialData) {
      setDraft(initialData);
      setSavedData(initialData);
    }
  }, [initialData]);

  // Compute isDirty by comparing draft vs savedData on patch fields only
  const isDirty = (() => {
    if (!draft || !savedData) return false;
    return patchFields.some((field) => {
      const a = draft[field];
      const b = savedData[field];
      // Deep-compare arrays/objects via JSON
      if (typeof a === 'object' || typeof b === 'object') {
        return JSON.stringify(a) !== JSON.stringify(b);
      }
      return a !== b;
    });
  })();

  const setField = useCallback((field: keyof T, value: any) => {
    setDraft((prev) => (prev ? { ...prev, [field]: value } : prev));
  }, []);

  const setFields = useCallback((patch: Partial<T>) => {
    setDraft((prev) => (prev ? { ...prev, ...patch } : prev));
  }, []);

  const discard = useCallback(() => {
    setDraft(savedData);
  }, [savedData]);

  const save = useCallback(async (): Promise<boolean> => {
    if (!id || !draft) return false;
    setSaving(true);
    try {
      const patch: Partial<T> = {};
      patchFields.forEach((field) => {
        (patch as any)[field] = draft[field] ?? null;
      });

      const { error } = await (supabase as any)
        .from(table)
        .update(patch)
        .eq('id', id);

      if (error) throw error;

      setSavedData({ ...draft });
      setLastSaved(new Date());
      onSaved?.(draft);
      return true;
    } catch (e: any) {
      toast({
        title: 'บันทึกไม่สำเร็จ',
        description: e.message,
        variant: 'destructive',
      });
      return false;
    } finally {
      setSaving(false);
    }
  }, [id, draft, table, patchFields, onSaved, toast]);

  // Keep ref up-to-date for beforeunload
  saveRef.current = save;

  // Block browser tab close / refresh when dirty
  useBeforeUnload(
    useCallback(
      (event: BeforeUnloadEvent) => {
        if (isDirty) {
          event.preventDefault();
          // Auto-save on unload (best-effort — browsers may block async)
          saveRef.current?.();
        }
      },
      [isDirty]
    )
  );

  // Block React Router navigation when dirty — prompt user
  useBlocker(
    useCallback(
      ({ currentLocation, nextLocation }: { currentLocation: any; nextLocation: any }) => {
        if (!isDirty) return false;
        if (currentLocation.pathname === nextLocation.pathname) return false;
        // Auto-save then unblock
        saveRef.current?.();
        return false; // don't block; save first then navigate
      },
      [isDirty]
    )
  );

  return {
    draft,
    isDirty,
    saving,
    lastSaved,
    setField,
    setFields,
    save,
    discard,
  };
}
