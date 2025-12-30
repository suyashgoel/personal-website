'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCreateEntry } from '@/lib/query/entries';
import { isDialogOpenAtom } from '@/lib/state';
import { useAtom } from 'jotai';
import { Plus } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';

export function AddButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [, setIsDialogOpen] = useAtom(isDialogOpenAtom);

  const { mutate: createEntry, isPending } = useCreateEntry();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    createEntry(
      { type: 'image', title, body, image: image! },
      {
        onSuccess: () => handleOpenChange(false),
        onError: () => setErrorMessage('Failed to create entry'),
      }
    );
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    setIsDialogOpen(open);
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
        className="fixed bottom-8 left-8 h-14 w-14 rounded-full"
        onClick={() => handleOpenChange(true)}
      >
        <Plus className="h-5 w-5" />
      </Button>

      <Dialog open={isOpen} onOpenChange={handleOpenChange} modal={false}>
        <DialogContent className="w-[90vw] max-w-md max-h-[90vh] p-1 flex flex-col rounded-lg">
          <DialogHeader className="px-4 pt-4">
            <DialogTitle className="text-lg">Create Entry</DialogTitle>
            <DialogDescription className="sr-only">
              Create a new entry with title, body, and image
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col flex-1 min-h-0"
          >
            <div className="flex-1 overflow-y-auto px-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-light">
                  Title
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  disabled={isPending}
                  placeholder="Entry title"
                  className="font-light text-sm"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="body" className="text-sm font-light">
                  Body
                </Label>
                <Textarea
                  id="body"
                  value={body}
                  onChange={e => setBody(e.target.value)}
                  disabled={isPending}
                  className="min-h-[140px] resize-none font-light text-sm"
                  placeholder="Entry body"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image" className="text-sm font-light">
                  Image
                </Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={e => setImage(e.target.files?.[0] || null)}
                  disabled={isPending}
                  required
                />
              </div>

              {errorMessage && (
                <p className="text-sm text-destructive">{errorMessage}</p>
              )}
            </div>

            <DialogFooter className="mt-2 px-4 py-3">
              <Button
                type="submit"
                variant="outline"
                disabled={isPending}
                className="w-full sm:w-auto"
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
