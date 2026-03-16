import { NextRequest, NextResponse } from 'next/server';
import { createCloudinaryUploadSignature } from '../../../../../lib/cloudinary-server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const folder = typeof body.folder === 'string' && body.folder.trim() ? body.folder.trim() : 'products';

    const result = createCloudinaryUploadSignature(folder);
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create upload signature' },
      { status: 500 }
    );
  }
}
