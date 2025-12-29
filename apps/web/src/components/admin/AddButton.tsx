'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCreateEntry } from '@/lib/query/entries';
import { Plus } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';

export function AddButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { mutate: createEntry, isPending } = useCreateEntry();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    createEntry(
      {
        type: 'image',
        title,
        body,
        image: image!,
      },
      {
        onSuccess: () => {
          setIsOpen(false);
          setTitle('');
          setBody('');
          setImage(null);
          setErrorMessage(null);
        },
        onError: error => {
          console.error('[ERROR] Create entry failed', {
            error,
            component: 'AddButton',
            timestamp: new Date().toISOString(),
          });
          setErrorMessage('Failed to create entry');
        },
      }
    );
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setTitle('');
      setBody('');
      setImage(null);
      setErrorMessage(null);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="fixed bottom-8 left-8 h-14 w-14 rounded-full border-border font-light transition-colors hover:text-accent"
        onClick={() => setIsOpen(true)}
      >
        <Plus className="h-5 w-5" />
      </Button>

      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="w-[85vw] sm:w-full max-w-[85vw] sm:max-w-md md:max-w-lg max-h-[85vh] sm:max-h-[90vh] overflow-y-auto p-3 sm:p-4 md:p-6 rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl md:text-2xl font-light tracking-tight">
              Create Entry
            </DialogTitle>
          </DialogHeader>

          <form
            onSubmit={handleSubmit}
            className="space-y-3 sm:space-y-4 md:space-y-6"
          >
            <div className="space-y-1.5 sm:space-y-2">
              <Label
                htmlFor="title"
                className="text-xs sm:text-sm md:text-base font-light"
              >
                Title
              </Label>
              <Input
                id="title"
                type="text"
                placeholder="Entry title"
                className="h-9 sm:h-10 md:h-12 px-3 sm:px-4 text-sm sm:text-base font-light"
                value={title}
                onChange={e => setTitle(e.target.value)}
                disabled={isPending}
                required
              />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label
                htmlFor="body"
                className="text-xs sm:text-sm md:text-base font-light"
              >
                Body
              </Label>
              <Textarea
                id="body"
                placeholder="Entry content"
                className="min-h-[120px] sm:min-h-[150px] md:min-h-[200px] px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base font-light resize-none"
                value={body}
                onChange={e => setBody(e.target.value)}
                disabled={isPending}
                required
              />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label
                htmlFor="image"
                className="text-xs sm:text-sm md:text-base font-light"
              >
                Image
              </Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                className="h-9 sm:h-10 md:h-12 px-3 sm:px-4 text-sm sm:text-base font-light file:mr-2 sm:file:mr-4 file:py-1.5 sm:file:py-2 file:px-2 sm:file:px-4 file:rounded-md file:border-0 file:text-xs sm:file:text-sm file:font-light file:bg-accent file:text-accent-foreground hover:file:bg-accent/90"
                onChange={e => setImage(e.target.files?.[0] || null)}
                disabled={isPending}
                required
              />
            </div>
            {errorMessage && (
              <p className="m-2 text-sm text-destructive">{errorMessage}</p>
            )}
            <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
              <Button
                type="submit"
                variant="outline"
                disabled={isPending}
                className="font-light w-full sm:w-auto h-9 sm:h-10"
              >
                {isPending ? 'Publishing...' : 'Publish'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
