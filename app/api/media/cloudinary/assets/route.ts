import { NextRequest, NextResponse } from 'next/server';
import { listCloudinaryAssets } from '../../../../../lib/cloudinary-server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const prefix = searchParams.get('prefix') || 'products';
    const assets = await listCloudinaryAssets(prefix);

    return NextResponse.json({
      success: true,
      images: assets.images.map((item: { public_id: string; secure_url: string; format?: string; bytes?: number }) => ({
        publicId: item.public_id,
        url: item.secure_url,
        format: item.format || null,
        size: item.bytes || 0,
      })),
      videos: assets.videos.map((item: { public_id: string; secure_url: string; format?: string; bytes?: number }) => ({
        publicId: item.public_id,
        url: item.secure_url,
        format: item.format || null,
        size: item.bytes || 0,
      })),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch Cloudinary assets' },
      { status: 500 }
    );
  }
}
