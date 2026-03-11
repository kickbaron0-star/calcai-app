export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { naam, bedrijf, email, telefoon, projectType, location, offerte } = req.body;

  if (!email || !offerte) {
    return res.status(400).json({ error: 'Ontbrekende velden' });
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;

  const offerteNr = `${Math.floor(Math.random() * 9000) + 1000}-${new Date().getFullYear()}`;
  const datum = new Date().toLocaleDateString('nl-NL', { year: 'numeric', month: 'long', day: 'numeric' });

  // Convert markdown-ish offerte text to simple HTML
  const offerteHtml = offerte
    .replace(/^### (.+)$/gm, '<h3 style="color:#f0ece4;font-family:Arial,sans-serif;font-size:16px;margin:20px 0 8px;">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 style="color:#f97316;font-family:Arial,sans-serif;font-size:18px;margin:24px 0 10px;letter-spacing:1px;">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 style="color:#f0ece4;font-family:Arial,sans-serif;font-size:22px;margin:28px 0 12px;">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong style="color:#f0ece4;">$1</strong>')
    .replace(/^- (.+)$/gm, '<div style="padding:6px 0 6px 16px;border-bottom:1px solid #1a1a1a;color:#999;font-size:14px;">→ $1</div>')
    .replace(/\n\n/g, '<br>')
    .replace(/\n/g, '<br>');

  const html = `<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#080808;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#080808;padding:48px 20px;">
    <tr><td align="center">
      <table width="620" cellpadding="0" cellspacing="0" style="max-width:620px;width:100%;">

        <!-- Label -->
        <tr><td style="padding:0 0 16px;">
          <p style="margin:0;font-size:10px;letter-spacing:4px;text-transform:uppercase;color:#444;font-family:'Courier New',monospace;">CALCAI / OFFERTE / ${offerteNr}</p>
        </td></tr>

        <!-- Header -->
        <tr><td style="background:#0d0d0d;border:1px solid #1a1a1a;border-bottom:none;padding:32px 40px 24px;">
          <table width="100%" cellpadding="0" cellspacing="0"><tr>
            <td>
              <table cellpadding="0" cellspacing="0"><tr>
                <td style="background:#f97316;width:8px;height:30px;border-radius:2px;"></td>
                <td style="padding-left:12px;"><span style="font-size:22px;font-weight:900;letter-spacing:3px;color:#f0ece4;font-family:Arial,sans-serif;">CALC<span style="color:#f97316;">AI</span></span></td>
              </tr></table>
            </td>
            <td align="right">
              <div style="font-size:11px;color:#555;font-family:'Courier New',monospace;">#${offerteNr}</div>
              <div style="font-size:11px;color:#333;font-family:'Courier New',monospace;margin-top:4px;">${datum}</div>
            </td>
          </tr></table>
        </td></tr>

        <!-- Orange bar -->
        <tr><td style="background:linear-gradient(90deg,#f97316 0%,#ea580c 60%,#1a1a1a 100%);height:2px;"></td></tr>

        <!-- Client info -->
        <tr><td style="background:#0d0d0d;border:1px solid #1a1a1a;border-top:none;border-bottom:none;padding:28px 40px;">
          <p style="margin:0 0 6px;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#f97316;font-family:'Courier New',monospace;">// OFFERTE VOOR</p>
          <p style="margin:0;font-size:20px;font-weight:700;color:#f0ece4;font-family:Arial,sans-serif;">${naam}${bedrijf ? ` · ${bedrijf}` : ''}</p>
          <table style="margin-top:16px;" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding-right:32px;">
                <p style="margin:0;font-size:10px;color:#555;text-transform:uppercase;letter-spacing:1px;font-family:'Courier New',monospace;">Type werk</p>
                <p style="margin:4px 0 0;font-size:14px;color:#f97316;font-weight:600;">${projectType}</p>
              </td>
              ${location ? `<td>
                <p style="margin:0;font-size:10px;color:#555;text-transform:uppercase;letter-spacing:1px;font-family:'Courier New',monospace;">Locatie</p>
                <p style="margin:4px 0 0;font-size:14px;color:#ccc;">${location}</p>
              </td>` : ''}
            </tr>
          </table>
        </td></tr>

        <!-- Divider -->
        <tr><td style="background:#111;border-left:1px solid #1a1a1a;border-right:1px solid #1a1a1a;height:1px;"></td></tr>

        <!-- Offerte content -->
        <tr><td style="background:#0d0d0d;border:1px solid #1a1a1a;border-top:none;border-bottom:none;padding:32px 40px;">
          <p style="margin:0 0 20px;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#555;font-family:'Courier New',monospace;">// OFFERTE_DETAIL</p>
          <div style="font-size:14px;color:#888;line-height:1.8;">${offerteHtml}</div>
        </td></tr>

        <!-- CTA -->
        <tr><td style="background:#0f0f0f;border:1px solid #1a1a1a;border-top:none;border-bottom:none;padding:28px 40px;">
          <p style="margin:0 0 16px;font-size:13px;color:#666;">Vragen over deze offerte? Neem contact op:</p>
          <table cellpadding="0" cellspacing="0"><tr>
            <td style="background:#f97316;border-radius:3px;">
              <a href="mailto:hallo@calcai.nl" style="display:inline-block;padding:12px 28px;color:#fff;text-decoration:none;font-size:13px;font-weight:900;letter-spacing:2px;font-family:Arial,sans-serif;text-transform:uppercase;">CONTACT OPNEMEN →</a>
            </td>
          </tr></table>
        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#080808;border:1px solid #1a1a1a;border-top:2px solid #111;border-radius:0 0 4px 4px;padding:20px 40px;">
          <p style="margin:0;font-size:10px;color:#333;font-family:'Courier New',monospace;">
            © 2025 CalcAI · calcai.nl · Offerte gegenereerd met AI — indicatief, niet bindend.<br>
            <a href="https://calcai.nl/disclaimer.html" style="color:#555;text-decoration:none;">AI Disclaimer</a>
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  try {
    // Stuur naar klant
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'CalcAI <hallo@calcai.nl>',
        to: email,
        subject: `Uw offerte van CalcAI — #${offerteNr}`,
        html,
      }),
    });

    // Notificatie naar jezelf
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'CalcAI App <hallo@calcai.nl>',
        to: 'kickbaron0@gmail.com',
        subject: `📋 Offerte verzonden naar ${naam} (${email})`,
        html: `<p style="font-family:monospace;background:#080808;color:#f0ece4;padding:24px;">Offerte #${offerteNr} verzonden naar:<br><br><strong style="color:#f97316;">${naam} · ${email}</strong><br>${bedrijf || ''}<br>${projectType} · ${location || ''}</p>`,
      }),
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: 'Verzenden mislukt' });
  }
}
