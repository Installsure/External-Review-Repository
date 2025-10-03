import React, { useEffect, useRef, useState } from 'react';
// @ts-ignore
import * as pdfjsLib from 'pdfjs-dist/build/pdf';

// Use CDN worker for compatibility
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export default function PdfCanvas({ src }: { src: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [err, setErr] = useState<string>('');

  useEffect(() => {
    (async () => {
      try {
        const doc = await pdfjsLib.getDocument(src).promise;
        const page = await doc.getPage(1);
        const viewport = page.getViewport({ scale: 1.2 });
        const canvas = ref.current!;
        const ctx = canvas.getContext('2d')!;
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        await page.render({ canvasContext: ctx, viewport }).promise;
      } catch (e: any) {
        setErr(String(e));
      }
    })();
  }, [src]);

  if (err) return <div className="p-2 text-xs text-red-600">PDF render error: {err}</div>;
  return <canvas ref={ref} style={{ maxWidth: '100%', height: 'auto' }} />;
}
