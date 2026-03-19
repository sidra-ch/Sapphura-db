import { NextRequest, NextResponse } from 'next/server';

interface CartItemInput {
  id: string;
  quantity: number;
  price: number;
}

export async function GET() {
  return NextResponse.json({
    cart: [],
    subtotal: 0,
    message: 'Cart state is managed client-side for this project.',
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const items = Array.isArray(body.items) ? body.items : [];

    const validItems = items.filter((item: CartItemInput) => {
      const id = String(item?.id || '').trim();
      const quantity = Number(item?.quantity);
      const price = Number(item?.price);
      return id.length > 0 && Number.isFinite(quantity) && quantity > 0 && Number.isFinite(price) && price >= 0;
    });

    if (validItems.length === 0) {
      return NextResponse.json({ error: 'Cart items are required' }, { status: 400 });
    }

    const subtotal = validItems.reduce((sum: number, item: CartItemInput) => {
      return sum + Number(item.price) * Number(item.quantity);
    }, 0);

    return NextResponse.json({
      success: true,
      cart: validItems,
      subtotal,
      itemCount: validItems.reduce((count: number, item: CartItemInput) => count + Number(item.quantity), 0),
    });
  } catch {
    return NextResponse.json({ error: 'Invalid cart payload' }, { status: 400 });
  }
}

export async function DELETE() {
  return NextResponse.json({ success: true, cart: [], subtotal: 0 });
}
