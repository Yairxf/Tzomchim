# צומחים – אתר

אתר React + Tailwind CSS 4, בנוי עם Vite. כולל:
תיק השקעות דמה חי בראש העמוד שגדל עם הגלילה, סימולטור ריבית דריבית, מסלול 10 המפגשים, מחיר, עלינו, שאלות נפוצות,
טופס הרשמה ששולח לכם מייל + וואטסאפ, תפריט נגישות, ודפי תקנון, פרטיות והצהרת נגישות.

## הרצה מקומית

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # תיקיית dist מוכנה להעלאה
```

## העלאה לאוויר (מומלץ: Vercel, חינם)

1. מעלים את התיקייה ל-GitHub.
2. ב-vercel.com → Add New Project → בוחרים את הריפו. Vercel מזהה Vite לבד.
3. התיקייה `api/` הופכת אוטומטית לפונקציה בכתובת `/api/register`.
4. Settings → Domains: מחברים דומיין (למשל tzomchim.co.il).
5. אם הדומיין שונה מ-`www.tzomchim.co.il`, מעדכנים אותו ב-`index.html`, `public/robots.txt`, `public/sitemap.xml` ו-`src/data.js`.

## התראות על כל הרשמה

משתנים ב-Vercel → Settings → Environment Variables (דוגמה ב-`.env.example`):

| משתנה | מה זה |
| --- | --- |
| `RESEND_API_KEY` | נרשמים ב-resend.com ויוצרים API Key |
| `NOTIFY_EMAIL` | המייל שאליו תגיע ההתראה (אפשר כמה, מופרדים בפסיק) |
| `FROM_EMAIL` | כתובת שולח מדומיין שאומת ב-Resend. בלי דומיין אפשר להתחיל עם `onboarding@resend.dev` (שולח רק למייל של החשבון) |
| `WA_PHONES` | מספרים לקבלת הודעת וואטסאפ, בפורמט 972584272333, מופרדים בפסיק |
| `WA_APIKEYS` | מפתח CallMeBot לכל מספר, באותו סדר |

**הפעלת CallMeBot (פעם אחת לכל טלפון):** שומרים באנשי הקשר את המספר שמופיע באתר callmebot.com (WhatsApp API),
שולחים לו בוואטסאפ את ההודעה `I allow callmebot to send me messages`, ומקבלים מפתח. זה שירות חינמי של צד שלישי;
לנפח גבוה או לאמינות עסקית אפשר לעבור ל-WhatsApp Business API (Twilio / Meta) ולהחליף רק את החלק הזה ב-`api/register.js`.

אם שליחה אוטומטית נכשלת, הטופס מציג להורה כפתור ששולח לכם את הפרטים בוואטסאפ, כך שאף הרשמה לא הולכת לאיבוד.

## לפני שעולים לאוויר

- אחרי פתיחת תיק עוסק: למלא את `businessId` (וכתובת, אם רוצים) ב-`src/data.js`. כל עוד השדות ריקים הם פשוט לא מוצגים.
- גיל היעד מוגדר במקום אחד: `BRAND.ages` ב-`src/data.js` (וגם בתיאור ב-`index.html`).
- המסמכים המשפטיים נכתבו לפי הדין בישראל, אבל הם לא תחליף לבדיקה של עורך דין.

## מבנה

```
index.html            SEO: תגיות meta, Open Graph, JSON-LD (ארגון, קורס, שאלות), תוכן סטטי למנועי חיפוש
api/register.js       פונקציית ההרשמה (מייל + וואטסאפ)
public/               favicon, תמונת שיתוף, robots.txt, sitemap.xml, תוכנית הקורס PDF
src/data.js           כל הטקסטים, המחירים והפרטים העסקיים
src/components/       Hero + Portfolio (תיק דמה חי), Twins, Simulator, Path, Pricing, About, Register, Footer, A11y, Legal
```
