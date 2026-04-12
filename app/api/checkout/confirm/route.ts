import { NextRequest } from 'next/server';
import { POST as createOrder } from '../../orders/route';

export async function POST(req: NextRequest) {
  return createOrder(req);
}
