# ZooBild React App - Vercel Deployment Guide

## 1. GitHub Repository Setup
✅ Repository: https://github.com/coldseawars/zoobild-react-vercel
✅ 1:1 Kopie der funktionierenden React App von Replit

## 2. Vercel Deployment Steps

### Mit Vercel CLI:
```bash
npm install -g vercel
vercel --cwd ./vercel-react-app
```

### Mit Vercel Dashboard:
1. Login zu https://vercel.com
2. "New Project" → "Import Git Repository"
3. Repository auswählen: `coldseawars/zoobild-react-vercel`
4. Framework: "Vite" (automatisch erkannt)
5. Build Command: `npm run build`
6. Output Directory: `dist`

## 3. Environment Variables in Vercel

**Unbedingt erforderlich:**
```
DATABASE_URL=mysql://username:password@host:port/database
WEBGO_DB_HOST=your-mysql-host
WEBGO_DB_USER=your-mysql-user
WEBGO_DB_PASSWORD=your-mysql-password
WEBGO_DB_NAME=your-mysql-database
WEBGO_DB_PORT=3306
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
PAYPAL_CLIENT_ID=your-paypal-client-id
PAYPAL_CLIENT_SECRET=your-paypal-client-secret
NODE_ENV=production
```

## 4. Deployment Configuration

- **vercel.json**: Optimiert für React + Express.js
- **Framework**: Vite wird automatisch erkannt
- **API Routes**: Express.js Backend als Serverless Functions
- **Build**: Vollständiger TypeScript/React Build

## 5. Nach dem Deployment

1. **Testen**: Live-URL öffnen und alle Funktionen testen
2. **Environment Check**: Alle API-Endpunkte prüfen
3. **Database**: MySQL-Verbindung zu WebGo verifizieren
4. **Payment**: Stripe & PayPal Test-Transaktionen

## 6. Integration in Website

Nach erfolgreichem Deployment kann die Live-URL direkt verwendet werden:
- **Link**: Direkt zur Vercel-URL verlinken
- **Iframe**: `<iframe src="https://your-app.vercel.app" width="100%" height="800px">`

## 7. Key Features

✅ **Echte Datenbank**: Nur WebGo MySQL (keine Fallback-Daten)
✅ **ZooBild API**: Dynamische Bildsuche über zoobild.de
✅ **Payment**: Stripe & PayPal Integration
✅ **Responsive**: Für alle Geräte optimiert
✅ **Production-Ready**: Vollständige Error-Handling

## 8. Support & Updates

- **GitHub**: Automatische Updates über Repository
- **Vercel**: Auto-Deploy bei Git-Push
- **Monitoring**: Vercel Dashboard für Performance-Tracking