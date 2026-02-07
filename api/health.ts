import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ status: 'ok' });
}

export const config = {
  runtime: 'nodejs',
};
