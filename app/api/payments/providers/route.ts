import { NextResponse } from 'next/server';

import { getPaymentProviderConfig } from '../../../../lib/payments';

export async function GET() {
  const jazzcash = getPaymentProviderConfig('jazzcash');
  const easypaisa = getPaymentProviderConfig('easypaisa');

  return NextResponse.json({
    providers: {
      jazzcash: { available: jazzcash.available },
      easypaisa: { available: easypaisa.available },
    },
  });
}