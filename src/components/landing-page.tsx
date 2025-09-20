'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Palette, QrCode, Users, PenSquare, Share, Heart } from 'lucide-react';
import Header from '@/components/header';
import Logo from '@/components/icons/logo';
import { useAuth } from '@/context/auth-context';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { AuthForm } from './auth-form';

const features = [
  {
    icon: Sparkles,
    title: 'AI-Powered Descriptions',
    description: 'Automatically generate engaging event descriptions with a single click, saving you time and effort.',
    bgColor: 'bg-primary/10',
    iconColor: 'text-primary'
  },
  {
    icon: Palette,
    title: 'Instant Poster Design',
    description: 'Choose from beautiful templates and customize them with your event details. No design skills needed.',
    bgColor: 'bg-accent/10',
    iconColor: 'text-accent'
  },
  {
    icon: QrCode,
    title: 'Easy RSVP & Sharing',
    description: 'Generate a unique RSVP link and QR code. Share your event instantly on any platform.',
    bgColor: 'bg-chart-2/20',
    iconColor: 'text-chart-2'
  },
  {
    icon: Users,
    title: 'Attendee Management',
    description: 'Track your RSVPs and manage attendees directly in a Google Sheet, integrated with your dashboard.',
    bgColor: 'bg-chart-4/20',
    iconColor: 'text-chart-4'
  },
];

const howItWorksSteps = [
    {
        icon: PenSquare,
        title: '1. Enter Details',
        description: 'Fill in your event information like title, date, and venue.',
    },
    {
        icon: Sparkles,
        title: '2. Generate & Customize',
        description: 'Let our AI craft a description and then customize your beautiful event poster.',
    },
    {
        icon: Share,
        title: '3. Share Everywhere',
        description: 'Get your unique RSVP link and QR code to spread the word.',
    },
]

const AuthButton = ({ children, ...props }: React.ComponentProps<typeof Button>) => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button {...props}>{children}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Welcome to EventFlow</DialogTitle>
          <DialogDescription>
            Sign in to create and manage your events.
          </DialogDescription>
        </DialogHeader>
        <AuthForm onSignIn={() => setIsOpen(false)}/>
      </DialogContent>
    </Dialog>
  );
};

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1">
        <section className="container mx-auto px-4 pt-24 pb-20 text-center">
            <div className="max-w-4xl mx-auto">
                <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tight text-primary">
                    Create & Share Stunning Event Posters in Minutes
                </h1>
                <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                    EventFlow is your all-in-one toolkit to design beautiful posters, generate AI-powered descriptions, and manage RSVPs with ease. All for free.
                </p>
                <div className="mt-8 flex justify-center gap-4">
                    <AuthButton size="lg" className="font-headline">
                        Get Started for Free
                    </AuthButton>
                </div>
            </div>
            <div className="mt-16 relative">
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary/20 w-1/2 h-1/2 rounded-full blur-3xl -z-10"></div>
                <Image
                    src="https://picsum.photos/seed/event-management/1200/675"
                    alt="A person organizing an event."
                    width={1200}
                    height={675}
                    className="rounded-lg shadow-2xl mx-auto border"
                    data-ai-hint="event management"
                    priority
                />
            </div>
        </section>
        
        <section id="features" className="py-20 bg-secondary/30">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-2xl mx-auto">
                    <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary">Everything You Need to Promote Your Event</h2>
                    <p className="mt-4 text-muted-foreground">From design to distribution, we've got you covered.</p>
                </div>
                <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {features.map((feature, index) => (
                        <Card key={index} className="text-center shadow-lg hover:shadow-primary/10 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                            <CardHeader>
                                <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${feature.bgColor}`}>
                                    <feature.icon className={`w-8 h-8 ${feature.iconColor}`} />
                                </div>
                                <CardTitle className="font-headline mt-4">{feature.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{feature.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>

        <section className="py-20">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-2xl mx-auto">
                    <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary">Get Started in 3 Simple Steps</h2>
                    <p className="mt-4 text-muted-foreground">Go from idea to shareable event in minutes.</p>
                </div>
                <div className="mt-20 relative max-w-4xl mx-auto">
                    <div className="absolute top-8 left-0 w-full h-0.5 bg-border hidden md:block" aria-hidden="true"></div>
                    <div className="absolute top-8 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent hidden md:block animate-pulse" aria-hidden="true"></div>
                    <div className="grid gap-12 md:grid-cols-3 relative">
                        {howItWorksSteps.map((step, index) => (
                            <div key={index} className="text-center flex flex-col items-center">
                                <div className="w-16 h-16 rounded-full flex items-center justify-center bg-background border-2 border-primary text-primary mb-4 z-10">
                                    <step.icon className="w-8 h-8" />
                                </div>
                                <h3 className="font-headline text-xl font-semibold">{step.title}</h3>
                                <p className="mt-2 text-muted-foreground">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>

        <section className="py-20 bg-primary/90 text-primary-foreground">
            <div className="container mx-auto px-4 text-center">
                <h2 className="font-headline text-3xl md:text-4xl font-bold">Ready to Make Your Next Event a Success?</h2>
                <p className="mt-4 text-lg text-primary-foreground/80 max-w-2xl mx-auto">
                    Join hundreds of creators promoting their events with EventFlow. It's free to start!
                </p>
                <div className="mt-8">
                    <AuthButton size="lg" variant="secondary" className="font-headline text-lg">
                        Create Your First Event Now
                    </AuthButton>
                </div>
            </div>
        </section>
      </main>

      <footer className="bg-background border-t">
          <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex items-center space-x-2">
                  <Logo className="h-6 w-6" />
                  <span className="font-bold font-headline">EventFlow</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Made with <Heart className="inline h-4 w-4 text-red-500" /> for local communities.
              </p>
              <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} EventFlow. All rights reserved.</p>
          </div>
      </footer>
    </div>
  );
}
