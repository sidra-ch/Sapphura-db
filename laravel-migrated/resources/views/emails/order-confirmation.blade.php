<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; background: #0a0a23; color: #fff; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: #1a1a40; border-radius: 10px; padding: 30px; }
    .header { text-align: center; border-bottom: 2px solid #d4af37; padding-bottom: 20px; margin-bottom: 20px; }
    h1 { color: #d4af37; }
    .gold-text { color: #d4af37; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid rgba(212,175,55,0.3); }
    th { color: #d4af37; }
    .total { font-size: 24px; color: #d4af37; font-weight: bold; }
    .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(212,175,55,0.3); color: #888; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Order Confirmed!</h1>
      <p>Thank you for shopping with <span class="gold-text">SAPPURA</span></p>
    </div>
    <p>Hi {{ $customerName }},</p>
    <p>Your order has been confirmed. Here are the details:</p>
    <p><strong>Order ID:</strong> {{ $orderId }}</p>

    <table>
      <thead>
        <tr>
          <th>Product</th>
          <th>Qty</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>
        @foreach($items as $item)
        <tr>
          <td>{{ $item['name'] }}</td>
          <td>{{ $item['quantity'] }}</td>
          <td>Rs. {{ number_format($item['price'], 2) }}</td>
        </tr>
        @endforeach
      </tbody>
    </table>

    <p class="total">Total: Rs. {{ number_format($total, 2) }}</p>
    <p><strong>Shipping to:</strong> {{ $shippingAddress }}</p>

    <p>We'll notify you once your order is shipped. You can track your order status in your account.</p>

    <div class="footer">
      <p>&copy; 2024 SAPPURA - Luxury Shopping</p>
      <p>This email was sent to {{ $customerName }}</p>
    </div>
  </div>
</body>
</html>
