import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { pageId, document } = await req.json();

    // TODO: Convert Yoopta document to Notion blocks and update the page
    console.log('Received update for page:', pageId);
    console.log('Yoopta document:', document);

    return NextResponse.json({ message: 'Update received (not yet implemented)' });
  } catch (error) {
    console.error('Error updating Notion page:', error);
    return NextResponse.json({ error: 'Failed to update Notion page' }, { status: 500 });
  }
}