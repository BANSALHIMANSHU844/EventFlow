'use client';

import * as React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { EventData } from '@/lib/types';
import { format } from 'date-fns';
import QRCode from 'qrcode';

interface PosterPreviewProps {
  eventData: EventData;
}

function getContrastingColor(hex?: string) {
    if (!hex) return '#FFFFFF';
    const cleanHex = hex.startsWith('#') ? hex.slice(1) : hex;
    if (cleanHex.length !== 6) return '#FFFFFF';
    const r = parseInt(cleanHex.slice(0, 2), 16);
    const g = parseInt(cleanHex.slice(2, 4), 16);
    const b = parseInt(cleanHex.slice(4, 6), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? '#000000' : '#FFFFFF';
}

const PosterPreview = React.forwardRef<HTMLCanvasElement, PosterPreviewProps>(({ eventData }, ref) => {
  const localCanvasRef = React.useRef<HTMLCanvasElement>(null);
  const canvasRef = (ref || localCanvasRef) as React.RefObject<HTMLCanvasElement>;
  const [activeTab, setActiveTab] = React.useState('portrait');

  const drawPoster = React.useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const isPortrait = activeTab === 'portrait';
    const dpr = window.devicePixelRatio || 1;
    canvas.width = (isPortrait ? 1080 : 1080) * dpr;
    canvas.height = (isPortrait ? 1350 : 1080) * dpr;
    ctx.scale(dpr, dpr);
    const width = isPortrait ? 1080 : 1080;
    const height = isPortrait ? 1350 : 1080;

    const textColor = getContrastingColor(eventData.themeColor);

    // Background
    ctx.fillStyle = eventData.themeColor || '#9F5BBA';
    ctx.fillRect(0, 0, width, height);

    // Draw pattern (optional)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    for(let i=0; i<100; i++) {
        ctx.beginPath();
        ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 50, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // QR Code
    if (eventData.rsvpUrl) {
      try {
        const qrCodeDataUrl = await QRCode.toDataURL(eventData.rsvpUrl, {
            errorCorrectionLevel: 'H',
            margin: 2,
            width: 256,
            color: {
              dark: '#000000',
              light: '#FFFFFF'
            }
        });
        const qrImg = new Image();
        qrImg.src = qrCodeDataUrl;
        await new Promise((resolve, reject) => {
          qrImg.onload = resolve;
          qrImg.onerror = reject;
        });
        const qrBoxSize = 170;
        const qrPadding = 10;
        const qrCodeSize = qrBoxSize - (qrPadding * 2);
        const qrX = width - qrBoxSize - 50 + qrPadding;
        const qrY = height - qrBoxSize - 50 + qrPadding;

        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.roundRect(width - qrBoxSize - 50, height - qrBoxSize - 50, qrBoxSize, qrBoxSize, 16);
        ctx.fill();
        ctx.drawImage(qrImg, qrX, qrY, qrCodeSize, qrCodeSize);

      } catch (err) {
        console.error('Failed to generate QR code', err);
      }
    }


    // Host Logo
    if (eventData.hostLogo) {
      try {
        const logoImg = new Image();
        logoImg.src = eventData.hostLogo;
        await new Promise((resolve, reject) => {
          logoImg.onload = resolve;
          logoImg.onerror = reject;
        });
        ctx.save();
        ctx.beginPath();
        ctx.arc(140, 140, 80, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        
        const logoSize = 160;
        const aspect = logoImg.width / logoImg.height;
        let drawWidth = logoSize, drawHeight = logoSize;
        if(aspect > 1) { // landscape
            drawHeight = logoSize / aspect;
        } else { // portrait
            drawWidth = logoSize * aspect;
        }

        ctx.drawImage(logoImg, 140 - drawWidth / 2, 140 - drawHeight / 2, drawWidth, drawHeight);
        ctx.restore();
      } catch (e) {
        console.error("Error loading logo", e)
      }
    }

    // --- Text ---
    ctx.fillStyle = textColor;
    
    // Title
    ctx.font = 'bold 120px "Poppins", sans-serif';
    ctx.textAlign = 'left';
    wrapText(ctx, eventData.title, 80, 300, 920, 130);
    
    // Date & Time
    ctx.font = '60px "Poppins", sans-serif';
    if(eventData.dateTime) {
        const dateString = format(eventData.dateTime, 'eeee, MMMM do');
        const timeString = format(eventData.dateTime, 'h:mm a');
        ctx.fillText(dateString, 80, height - 280);
        ctx.fillText(timeString, 80, height - 200);
    }
    
    // Venue
    ctx.font = '40px "PT Sans", sans-serif';
    ctx.fillText(`@ ${eventData.venue}`, 80, height - 120);

  }, [eventData, activeTab, canvasRef]);

  React.useEffect(() => {
    // We need to ensure fonts are loaded before drawing to canvas.
    // A simple delay can often work for web fonts, but document.fonts.ready is more robust.
    document.fonts.ready.then(() => {
        drawPoster();
    });
  }, [eventData, activeTab, drawPoster]);
  
  function wrapText(context: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
    const words = text.split(' ');
    let line = '';
    
    for(let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = context.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            context.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;
        } else {
            line = testLine;
        }
    }
    context.fillText(line, x, y);
  }


  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="portrait">Portrait</TabsTrigger>
          <TabsTrigger value="square">Square</TabsTrigger>
        </TabsList>
        <TabsContent value="portrait">
          <canvas
            ref={activeTab === 'portrait' ? canvasRef : null}
            className="w-full rounded-lg shadow-lg aspect-[1080/1350] bg-muted"
          />
        </TabsContent>
        <TabsContent value="square">
          <canvas
            ref={activeTab === 'square' ? canvasRef : null}
            className="w-full rounded-lg shadow-lg aspect-square bg-muted"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
});

PosterPreview.displayName = 'PosterPreview';
export default PosterPreview;
