<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; background: #0a0a23; color: #fff; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: #1a1a40; border-radius: 10px; padding: 30px; text-align: center; }
    .otp { font-size: 40px; letter-spacing: 10px; color: #d4af37; font-weight: bold; margin: 30px 0; }
    .footer { color: #888; font-size: 12px; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="container">
    <h1 style="color: #d4af37;">Verify Your Email</h1>
    <p>Hi {{ $customerName }},</p>
    <p>Your verification code is:</p>
    <div class="otp">{{ $otp }}</div>
    <p>This code will expire in 10 minutes.</p>
    <p>If you didn't request this, please ignore this email.</p>
    <div class="footer">&copy; 2024 SAPPURA</div>
  </div>
</body>
</html>
