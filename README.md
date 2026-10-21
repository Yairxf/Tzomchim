# צומחים · אתר (גרסה 2, "מסוף מסחר")

אתר סטטי ב-HTML, CSS ו-JavaScript בלי ספריות. Vite רק מעתיק את הקבצים לתיקיית `dist` בזמן הבנייה ב-Vercel.
האתר נבנה עם הסקיל scroll-craft. הבריף, הבחירות והחוויה המתוכננת מתועדים ב-`docs/BRIEF.md`.

## מבנה
```
index.html                 כל העמוד: SEO, תוכן, טופס
public/scrollcraft.js|css  מנוע הגלילה (לא לערוך)
public/site.js|css         העיצוב והלוגיקה של האתר: גרפים, מכונת הזמן, תרחיש המשבר, הטופס
public/legal/              תקנון, פרטיות, הצהרת נגישות
public/tzomchim-institutions.pdf   התוכנית למוסדות
```

## ההרשמה
הטופס פותח וואטסאפ אצל הנרשם, עם כל הפרטים מוכנים ליאיר (972584272333 ב-`public/site.js`). אין שרת ואין מפתחות.

## חזרה לגרסה הקודמת (React)
הגרסה הקודמת שמורה בענף `site-v1-backup`. כדי לחזור אליה: ב-Vercel ← Deployments ← לבחור deployment ישן ← Promote to Production,
או למזג את `site-v1-backup` חזרה ל-main.

## הרצה מקומית
`npm install && npm run dev`, או פשוט לפתוח שרת סטטי על התיקייה.
