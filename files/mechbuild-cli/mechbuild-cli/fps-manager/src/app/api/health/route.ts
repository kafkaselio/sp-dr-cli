import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  return NextResponse.json(
    {
      status: 'online',
      service: 'fps-manager',
      timestamp: new Date().toISOString(),
      framework: 'Next.js App Router',
    },
    { status: 200 }
  );
}
