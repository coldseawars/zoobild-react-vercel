// Vercel Serverless Function für alle API-Routen
const express = require('express');
const cors = require('cors');

const app = express();

// CORS für Cross-Origin-Requests
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Pricing API - Fallback für Vercel
app.get('/api/pricing', (req, res) => {
  const fallbackPricing = {
    products: [
      {
        id: 1,
        product_id: "digital-single",
        name: "Digitaler Download - Einzelbild",
        base_price: 2.99,
        tiers: [
          { min_quantity: 1, max_quantity: 4, price: 2.99 },
          { min_quantity: 5, max_quantity: 9, price: 2.49 },
          { min_quantity: 10, max_quantity: null, price: 1.99 }
        ]
      },
      {
        id: 2,
        product_id: "print-10x15-glossy",
        name: "Druck 10x15cm Glossy",
        base_price: 4.99,
        tiers: [
          { min_quantity: 1, max_quantity: 9, price: 4.99 },
          { min_quantity: 10, max_quantity: 24, price: 4.49 },
          { min_quantity: 25, max_quantity: null, price: 3.99 }
        ]
      }
    ],
    shipping_options: [
      { id: 1, name: "Standard Versand", price: 4.99, region: "DE" },
      { id: 2, name: "Express Versand", price: 9.99, region: "DE" },
      { id: 3, name: "International", price: 12.99, region: "INTL" }
    ]
  };
  
  res.json(fallbackPricing);
});

// Cart API - Session-basiert
let sessionCarts = new Map();

app.get('/api/cart', (req, res) => {
  const sessionId = req.headers['x-session-id'] || 'default-session';
  const cart = sessionCarts.get(sessionId) || [];
  res.json(cart);
});

app.post('/api/cart', (req, res) => {
  const sessionId = req.headers['x-session-id'] || 'default-session';
  const item = req.body;
  
  let cart = sessionCarts.get(sessionId) || [];
  const newItem = {
    id: Date.now(),
    session_id: sessionId,
    product_type: item.productType || 'digital-single',
    image_code: item.imageCode || '',
    quantity: item.quantity || 1,
    unit_price: item.unitPrice || 2.99,
    total_price: (item.quantity || 1) * (item.unitPrice || 2.99),
    configuration: item.configuration || {},
    created_at: new Date()
  };
  
  cart.push(newItem);
  sessionCarts.set(sessionId, cart);
  
  res.json({ success: true, item: newItem });
});

app.delete('/api/cart/:id', (req, res) => {
  const sessionId = req.headers['x-session-id'] || 'default-session';
  const itemId = parseInt(req.params.id);
  
  let cart = sessionCarts.get(sessionId) || [];
  cart = cart.filter(item => item.id !== itemId);
  sessionCarts.set(sessionId, cart);
  
  res.json({ success: true });
});

// Images API - Proxy zu ZooBild
app.get('/api/images/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const response = await fetch(`https://www.zoobild.de/api/bilder_suchen.php?code=${code}`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Image search failed' });
  }
});

// Assets API
app.get('/api/assets/frames', (req, res) => {
  const frames = [
    { id: 'none', name: 'Kein Rahmen', url: null },
    { id: 'zoo1', name: 'Zoo Rahmen 1', url: 'https://www.zoobild.de/elements/rahmen/zoo1.png' },
    { id: 'safari', name: 'Safari Rahmen', url: 'https://www.zoobild.de/elements/rahmen/safari.png' }
  ];
  res.json(frames);
});

app.get('/api/assets/motifs', (req, res) => {
  const motifs = [
    { id: 'none', name: 'Kein Motiv', url: null },
    { id: 'tiger', name: 'Tiger', url: 'https://www.zoobild.de/elements/motive/tiger.png' },
    { id: 'elephant', name: 'Elefant', url: 'https://www.zoobild.de/elements/motive/elephant.png' }
  ];
  res.json(motifs);
});

// Checkout API
app.post('/api/checkout', (req, res) => {
  const { items, customerData, paymentMethod } = req.body;
  
  const orderNumber = `ZB${Date.now()}`;
  const total = items.reduce((sum, item) => sum + (item.total_price || 0), 0);
  
  // Hier würde normalerweise die Zahlung verarbeitet werden
  res.json({
    success: true,
    orderNumber,
    total,
    message: 'Bestellung erfolgreich eingegangen'
  });
});

// Export für Vercel
module.exports = app;