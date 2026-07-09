import { NextResponse } from 'next/server';

import { getAllTerms } from '@/lib/terms';

export async function GET() {
  const terms = getAllTerms();
  return NextResponse.json(terms);
}
