// Vercel Serverless Function: POST /api/register
// כל הרשמה שולחת: (1) מייל אליכם דרך Resend, (2) הודעת וואטסאפ אליכם דרך CallMeBot.
// הגדרות (Vercel → Settings → Environment Variables):
//   RESEND_API_KEY     – מפתח מ-resend.com
//   NOTIFY_EMAIL       – לאן לשלוח את ההתראה (המייל שלכם)
//   FROM_EMAIL         – כתובת שולח מאומתת ב-Resend, למשל "צומחים <noreply@tzomchim.co.il>"
//   WA_PHONES          – מספרי וואטסאפ לקבלת התראה, מופרדים בפסיק, בפורמט בינלאומי: 972584272333,972553184575
//   WA_APIKEYS         – מפתחות CallMeBot לפי אותו סדר, מופרדים בפסיק
// אם חסר משתנה – הערוץ הזה פשוט מדולג, והשני עדיין עובד.

const clean = (v, max = 300) => String(v ?? '').replace(/[<>]/g, '').trim().slice(0, max);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
  body = body || {};

  // honeypot – bots fill hidden fields
  if (body.company) return res.status(200).json({ ok: true });

  const d = {
    parentName: clean(body.parentName, 80),
    phone: clean(body.phone, 30),
    email: clean(body.email, 120),
    childName: clean(body.childName, 80),
    grade: clean(body.grade, 10),
    place: clean(body.place, 120),
    source: clean(body.source, 60),
    notes: clean(body.notes, 800),
    photos: !!body.photos,
    marketing: !!body.marketing,
    terms: !!body.terms,
    contact: !!body.contact,
  };

  const missing = ['parentName', 'phone', 'childName', 'grade', 'place'].filter((k) => !d[k]);
  if (missing.length || !d.terms || !d.contact) {
    return res.status(400).json({ ok: false, error: 'Missing required fields', missing });
  }

  const lines = [
    '🌱 הרשמה חדשה לשיעור ניסיון – צומחים',
    `הורה: ${d.parentName}`,
    `טלפון: ${d.phone}`,
    d.email && `מייל: ${d.email}`,
    `משתתף/ת: ${d.childName} · ${d.grade}`,
    `יישוב / בית ספר: ${d.place}`,
    d.source && `איך שמעו: ${d.source}`,
    d.notes && `הערות: ${d.notes}`,
    `אישור צילום: ${d.photos ? 'כן' : 'לא'} · עדכונים: ${d.marketing ? 'כן' : 'לא'}`,
  ].filter(Boolean);
  const text = lines.join('\n');

  const jobs = [];

  // 1) Email
  const { RESEND_API_KEY, NOTIFY_EMAIL, FROM_EMAIL } = process.env;
  if (RESEND_API_KEY && NOTIFY_EMAIL) {
    const html = `<div dir="rtl" style="font-family:Arial,sans-serif;font-size:15px;line-height:1.7;color:#1F2937">
      <h2 style="color:#0F5132;margin:0 0 12px">הרשמה חדשה לשיעור ניסיון</h2>
      ${lines.slice(1).map((l) => `<div>${l}</div>`).join('')}
      <p style="margin-top:16px"><a href="https://wa.me/${d.phone.replace(/\D/g, '').replace(/^0/, '972')}">לפתוח צ׳אט וואטסאפ עם ההורה</a></p>
    </div>`;
    jobs.push(fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: FROM_EMAIL || 'Tzomchim <onboarding@resend.dev>',
        to: NOTIFY_EMAIL.split(',').map((s) => s.trim()),
        reply_to: d.email || undefined,
        subject: `🌱 הרשמה חדשה: ${d.childName} (${d.place})`,
        html,
        text,
      }),
    }).then((r) => ({ channel: 'email', ok: r.ok, status: r.status })));
  }

  // 2) WhatsApp (CallMeBot)
  const phones = (process.env.WA_PHONES || '').split(',').map((s) => s.trim()).filter(Boolean);
  const keys = (process.env.WA_APIKEYS || '').split(',').map((s) => s.trim());
  phones.forEach((p, i) => {
    if (!keys[i]) return;
    const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(p)}&text=${encodeURIComponent(text)}&apikey=${encodeURIComponent(keys[i])}`;
    jobs.push(fetch(url).then((r) => ({ channel: `whatsapp:${p}`, ok: r.ok, status: r.status })));
  });

  if (!jobs.length) {
    console.error('register: no notification channel configured');
    return res.status(500).json({ ok: false, error: 'No notification channel configured' });
  }

  const results = await Promise.allSettled(jobs);
  const delivered = results.some((r) => r.status === 'fulfilled' && r.value.ok);
  console.log('register', JSON.stringify(results.map((r) => (r.status === 'fulfilled' ? r.value : { ok: false, error: String(r.reason) }))));

  if (!delivered) return res.status(502).json({ ok: false, error: 'Notification failed' });
  return res.status(200).json({ ok: true });
}
