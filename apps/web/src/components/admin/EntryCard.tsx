import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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
import { useDeleteEntry, useUpdateEntry } from '@/lib/query/entries';
import { isDialogOpenAtom } from '@/lib/state';
import { EntryCardProps } from '@/lib/types/types';
import { useAtom } from 'jotai';
import Image from 'next/image';
import type React from 'react';
import { useEffect, useState } from 'react';

export function EntryCard({
  entry,
  isAboveFold,
}: EntryCardProps & { isAboveFold: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState(entry.title);
  const [body, setBody] = useState(entry.body);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [, setIsDialogOpen] = useAtom(isDialogOpenAtom);

  const { mutate: updateEntry, isPending: isUpdating } = useUpdateEntry();
  const { mutate: deleteEntry, isPending: isDeleting } = useDeleteEntry();

  const isPending = isUpdating || isDeleting;

  useEffect(() => {
    setTitle(entry.title);
    setBody(entry.body);
  }, [entry]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    updateEntry(
      {
        slug: entry.slug,
        entry: { title, body },
      },
      {
        onSuccess: () => {
          setIsOpen(false);
          setIsDialogOpen(false);
        },
        onError: error => {
          console.error('[ERROR] Edit entry failed', {
            error,
            component: 'EntryCard',
            timestamp: new Date().toISOString(),
          });
          setErrorMessage('Failed to edit entry');
        },
      }
    );
  };

  const handleDelete = () => {
    if (!confirm('Are you sure you want to delete this entry?')) return;
    setErrorMessage(null);
    deleteEntry(entry.slug, {
      onSuccess: () => {
        setIsOpen(false);
        setIsDialogOpen(false);
      },
      onError: error => {
        console.error('[ERROR] Delete entry failed', {
          error,
          component: 'EntryCard',
          timestamp: new Date().toISOString(),
        });
        setErrorMessage('Failed to delete entry');
      },
    });
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    setIsDialogOpen(open);
    if (!open) {
      setTitle(entry.title);
      setBody(entry.body);
      setErrorMessage(null);
    }
  };

  return (
    <>
      <Card
        className="cursor-pointer overflow-hidden border-hairline transition-all duration-300 hover:border-foreground/30 hover:shadow-sm"
        onClick={() => handleOpenChange(true)}
      >
        <div className="relative aspect-video w-full">
          <Image
            src={entry.imageContent.url}
            alt={entry.title}
            fill
            className="object-cover transition-transform duration-300 hover:scale-[1.02]"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading={isAboveFold ? 'eager' : 'lazy'}
          />
        </div>
      </Card>

      <Dialog open={isOpen} onOpenChange={handleOpenChange} modal={false}>
        <DialogContent className="w-[90vw] max-w-md max-h-[90vh] p-1 flex flex-col rounded-md border-hairline">
          <DialogHeader className="px-5 pt-5">
            <DialogTitle className="text-lg font-light tracking-tight">
              Edit Entry
            </DialogTitle>
            <DialogDescription className="sr-only">
              Edit the entry with title, body, and image
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col flex-1 min-h-0"
          >
            <div className="flex-1 overflow-y-auto px-5 space-y-5">
              <div className="space-y-2.5">
                <Label
                  htmlFor="title"
                  className="text-sm font-light tracking-tight text-foreground/70"
                >
                  Title
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  disabled={isPending}
                  placeholder="Entry title"
                  className="text-sm font-light border-hairline"
                  required
                />
              </div>

              <div className="space-y-2.5">
                <Label
                  htmlFor="body"
                  className="text-sm font-light tracking-tight text-foreground/70"
                >
                  Body
                </Label>
                <Textarea
                  id="body"
                  value={body}
                  onChange={e => setBody(e.target.value)}
                  disabled={isPending}
                  placeholder="Entry body"
                  className="min-h-[140px] resize-none text-sm font-light border-hairline"
                  required
                />
              </div>

              <div className="space-y-2.5">
                <details className="group">
                  <summary className="list-none cursor-pointer flex items-center gap-1.5 text-sm font-light tracking-tight text-foreground/60 hover:text-foreground transition-colors duration-200">
                    <span>Image</span>
                    <span className="transition-transform duration-200 group-open:rotate-90">
                      ▸
                    </span>
                  </summary>

                  <div className="mt-3 relative aspect-video w-full overflow-hidden rounded-md border-hairline">
                    <Image
                      src={entry.imageContent.url}
                      alt={entry.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </details>
              </div>

              {errorMessage && (
                <p className="text-sm font-light text-destructive">
                  {errorMessage}
                </p>
              )}
            </div>

            <DialogFooter className="mt-3 px-5 py-4">
              <Button
                type="button"
                onClick={handleDelete}
                variant="destructive"
                disabled={isPending}
                className="w-full sm:w-auto text-sm font-light border-hairline"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
              <Button
                type="submit"
                variant="outline"
                disabled={isPending}
                className="w-full sm:w-auto text-sm font-light border-hairline"
              >
                {isUpdating ? 'Updating...' : 'Update'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
