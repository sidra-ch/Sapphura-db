<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; background: #0a0a23; color: #fff; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: #1a1a40; border-radius: 10px; padding: 30px; }
    .header { text-align: center; border-bottom: 2px solid #d4af37; padding-bottom: 20px; margin-bottom: 20px; }
    h1 { color: #d4af37; margin: 0; }
    .btn { display: inline-block; margin-top: 20px; background: #d4af37; color: #111; text-decoration: none; font-weight: bold; padding: 12px 20px; border-radius: 8px; }
    .muted { color: #b8b8c7; font-size: 13px; line-height: 1.6; }
    .footer { text-align: center; margin-top: 28px; padding-top: 18px; border-top: 1px solid rgba(212,175,55,0.3); color: #888; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Password Reset</h1>
    </div>

    <p>Hi {{ $customerName }},</p>
    <p>We received a request to reset your Sapphura account password.</p>

    <p>
      <a class="btn" href="{{ $resetUrl }}">Reset Password</a>
    </p>

    <p class="muted">This link will expire in 60 minutes. If you did not request this, you can ignore this email.</p>
    <p class="muted">If the button does not work, copy this URL into your browser:</p>
    <p class="muted">{{ $resetUrl }}</p>

    <div class="footer">
      <p>&copy; {{ date('Y') }} SAPPHURA</p>
    </div>
  </div>
</body>
</html>
