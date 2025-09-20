'use client';

import * as React from 'react';
import { useFormContext } from 'react-hook-form';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Sparkles, Image as ImageIcon, Upload } from 'lucide-react';

import { cn } from '@/lib/utils';
import type { EventData } from '@/lib/types';
import { generateDescriptionAction } from '@/app/actions';

import { Button, buttonVariants } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

interface EventFormProps {
  isSubmitting: boolean;
}

export default function EventForm({ isSubmitting }: EventFormProps) {
  const form = useFormContext<EventData>();
  const { toast } = useToast();
  const [isAiGenerating, startAiTransition] = React.useTransition();
  const [logoPreview, setLogoPreview] = React.useState<string | null>(null);

  const handleGenerateDescription = () => {
    startAiTransition(async () => {
      const { title, dateTime, venue, hostLogo, themeColor } = form.getValues();
      if (!title || !dateTime || !venue) {
        toast({
          variant: 'destructive',
          title: 'Missing Information',
          description: 'Please fill in Title, Date, and Venue before generating a description.',
        });
        return;
      }
      const result = await generateDescriptionAction({
        title,
        dateTime: dateTime.toString(),
        venue,
        hostLogo: hostLogo,
        themeColor,
      });
      if (result.success && result.description) {
        form.setValue('description', result.description);
        toast({
          title: 'Description Generated!',
          description: 'The AI has crafted a new event description for you.',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Generation Failed',
          description: result.error,
        });
      }
    });
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) { // 1MB limit
        toast({
          variant: 'destructive',
          title: 'Image Too Large',
          description: 'Please upload an image smaller than 1MB.',
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        form.setValue('hostLogo', base64String);
        setLogoPreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Event Title</FormLabel>
            <FormControl>
              <Input placeholder="e.g. Summer Music Festival" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <div className="flex justify-between items-center">
              <FormLabel>Description</FormLabel>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleGenerateDescription}
                disabled={isAiGenerating}
              >
                {isAiGenerating ? (
                  <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                Generate with AI
              </Button>
            </div>
            <FormControl>
              <Textarea
                placeholder="A brief and engaging description of your event."
                className="resize-none"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="dateTime"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date & Time</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-full pl-3 text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP 'at' h:mm a")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date() || date < new Date('1900-01-01')}
                    initialFocus
                  />
                  <div className="p-3 border-t border-border">
                    <input
                        type="time"
                        className="w-full border-input bg-background p-2 rounded-md text-sm"
                        value={field.value ? format(field.value, 'HH:mm') : ''}
                        onChange={(e) => {
                            const [hours, minutes] = e.target.value.split(':').map(Number);
                            const newDate = new Date(field.value || new Date());
                            newDate.setHours(hours, minutes);
                            field.onChange(newDate);
                        }}
                    />
                   </div>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="venue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Venue</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Central Park" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="rsvpUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>RSVP Link</FormLabel>
            <FormControl>
              <Input placeholder="https://your-rsvp-form.com" {...field} />
            </FormControl>
            <FormDescription>
              Link to your Google Form or other registration page.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        <FormItem>
          <FormLabel>Host Logo</FormLabel>
          <FormControl>
            <Input type="file" accept="image/png, image/jpeg, image/gif" className="hidden" id="logo-upload" onChange={handleLogoChange}/>
          </FormControl>
          <label htmlFor="logo-upload" className={cn(buttonVariants({variant: 'outline'}), "w-full cursor-pointer flex items-center justify-center")}>
            <Upload className="mr-2 h-4 w-4" />
            Upload Logo
          </label>
        </FormItem>

        <div className="flex items-center justify-center">
            {logoPreview ? (
                <Image src={logoPreview} alt="Host logo preview" width={80} height={80} className="rounded-full object-cover aspect-square bg-muted" />
            ) : (
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-muted-foreground" />
                </div>
            )}
        </div>
      </div>
      
      <FormField
        control={form.control}
        name="themeColor"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Theme Color</FormLabel>
            <FormControl>
              <div className="relative">
                <Input type="text" {...field} />
                <input type="color" className="absolute top-0 right-0 h-full w-10 opacity-0 cursor-pointer" value={field.value} onChange={field.onChange} />
                 <div className="absolute top-1/2 right-2 -translate-y-1/2 w-6 h-6 rounded-md border" style={{ backgroundColor: field.value }}></div>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

    </div>
  );
}
