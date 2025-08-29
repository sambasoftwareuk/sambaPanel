export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';

export async function GET(request) {
  const { userId, sessionId } = getAuth(request);
  return NextResponse.json(
    { authenticated: !!userId, userId: userId ?? null, sessionId: sessionId ?? null },
    { headers: { 'Cache-Control': 'no-store' } }
  );
}
