export const verifyEmailTemplate = (link: string): string => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #f4f4f7; margin: 0; padding: 0; }
    .container { max-width: 500px; margin: 40px auto; background: #ffffff; border-radius: 8px; padding: 40px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
    .logo { text-align: center; font-size: 28px; font-weight: bold; color: #0d9488; margin-bottom: 24px; }
    .content { text-align: center; color: #333; }
    .content h1 { font-size: 22px; margin-bottom: 12px; }
    .content p { font-size: 16px; color: #555; margin-bottom: 16px; }
    .btn { display: inline-block; background: #0d9488; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-size: 16px; font-weight: bold; }
    .divider { border-top: 1px solid #eee; margin: 24px 0; }
    .footer { text-align: center; margin-top: 32px; font-size: 12px; color: #999; }
    .secondary { font-size: 14px; color: #888; }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">Pachito</div>
    <div class="content">
      <h1>Verify your email / Verifica tu correo</h1>
      <p>Thanks for signing up for Pachito! Click the button below to verify your account.</p>
      <p class="secondary">¡Gracias por registrarte en Pachito! Haz clic en el botón para verificar tu cuenta.</p>
      <a href="${link}" class="btn">Verify email / Verificar correo</a>
      <div class="divider"></div>
      <p style="font-size: 13px; color: #888;">If you didn't create this account, you can ignore this message.<br>Si no creaste esta cuenta, puedes ignorar este mensaje.</p>
    </div>
    <div class="footer">&copy; Pachito - Mood Tracker</div>
  </div>
</body>
</html>
`;
