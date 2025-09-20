'use client';

import * as React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { eventSchema, type EventData } from '@/lib/types';
import Header from '@/components/header';
import EventForm from '@/components/event-form';
import PosterPreview from '@/components/poster-preview';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Share2, Download, Copy } from 'lucide-react';
import { doc, setDoc } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';

function generateShortCode(length = 7) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export default function CreatorStudio() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isShareModalOpen, setShareModalOpen] = React.useState(false);
  const [posterDataUrl, setPosterDataUrl] = React.useState('');
  const [shortUrl, setShortUrl] = React.useState('');
  const posterCanvasRef = React.useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const form = useForm<EventData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: 'My Awesome Event',
      description: '',
      dateTime: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000), // Default to one week from now
      venue: 'The Coolest Place in Town',
      themeColor: '#9F5BBA',
      rsvpUrl: '',
    },
  });

  const watchedData = form.watch();

  const handleCreateEvent = async (data: EventData) => {
    setIsSubmitting(true);
    
    try {
      const eventCode = generateShortCode();
      const eventId = `local-${Date.now()}`;
      const eventData = {
        ...data,
        createdBy: 'local-user',
        eventCode: eventCode,
        createdAt: new Date().toISOString(),
        dateTime: data.dateTime.toISOString(),
      };
      
      await setDoc(doc(firestore, "events", eventId), eventData);
      await setDoc(doc(firestore, "codes", eventCode), { eventId: eventId });
      
      const generatedShortUrl = `${window.location.origin}/e/${eventCode}`;
      setShortUrl(generatedShortUrl);

      if (posterCanvasRef.current) {
          setPosterDataUrl(posterCanvasRef.current.toDataURL('image/png'));
      }
      setShareModalOpen(true);

    } catch(error) {
        console.error("Error creating event:", error);
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Failed to create the event. Please try again.',
        });
    } finally {
        setIsSubmitting(false);
    }
  };
  
  const handleDownloadPoster = () => {
    const link = document.createElement('a');
    link.download = `${watchedData.title.replace(/ /g, '_')}-poster.png`;
    link.href = posterDataUrl;
    link.click();
  };
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shortUrl);
    toast({
        title: "Link Copied!",
        description: "The RSVP link has been copied to your clipboard.",
    });
  };

  return (
    <FormProvider {...form}>
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Header />
        <main className="flex-1 container mx-auto p-4 md:p-8">
          <form onSubmit={form.handleSubmit(handleCreateEvent)} className="space-y-8">
            <div className="grid md:grid-cols-12 gap-8">
              <div className="md:col-span-5 lg:col-span-4">
                <h1 className="font-headline text-3xl font-bold mb-6 text-primary">
                  Create Your Event
                </h1>
                <EventForm isSubmitting={isSubmitting} />
              </div>
              <div className="md:col-span-7 lg:col-span-8">
                <div className="sticky top-24">
                  <h2 className="font-headline text-2xl font-bold mb-4">Poster Preview</h2>
                  <PosterPreview eventData={watchedData} ref={posterCanvasRef} />
                </div>
              </div>
            </div>
            <div className="flex justify-end sticky bottom-0 bg-background/80 backdrop-blur-sm py-4">
              <Button type="submit" size="lg" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Share2 className="mr-2 h-4 w-4" />
                    Create Event & Get Sharables
                  </>
                )}
              </Button>
            </div>
          </form>
        </main>
      </div>
      
      <Dialog open={isShareModalOpen} onOpenChange={setShareModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Your Event is Ready!</DialogTitle>
            <DialogDescription>
              Share your event with the world. Download the poster or copy the link.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center justify-center">
                <img src={posterDataUrl} alt="Generated event poster" className="rounded-md border max-h-64 object-contain" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="rsvp-link">RSVP Link</Label>
                <div className="flex gap-2">
                    <Input id="rsvp-link" value={shortUrl} readOnly />
                    <Button variant="outline" size="icon" onClick={handleCopyLink}>
                        <Copy className="h-4 w-4" />
                    </Button>
                </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleDownloadPoster}><Download className="mr-2 h-4 w-4"/>Download Poster</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </FormProvider>
  );
}
