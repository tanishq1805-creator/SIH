import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const possiblePaths = [
    path.resolve(process.cwd(), 'code.html'),
    path.resolve(process.cwd(), '..', 'code.html'),
    path.resolve(process.cwd(), 'public', 'code.html'),
    'e:\\Hackathon\\SIH 2026\\Demo 4\\code.html'
  ];

  let html = '';
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      html = fs.readFileSync(p, 'utf-8');
      break;
    }
  }

  if (!html) {
    return new NextResponse('code.html not found', { status: 404 });
  }

  const maptilerKey = process.env.NEXT_PUBLIC_MAPTILER_API_KEY || process.env.MAPTILER_API_KEY || '';
  if (maptilerKey) {
    html = html.replaceAll('YOUR_MAPTILER_API_KEY', maptilerKey);
  }

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
  });
}
