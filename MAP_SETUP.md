# Map Configuration Guide

## Current Status
Your app currently uses an **Interactive Demo Map** that provides full map functionality without requiring any API keys or external dependencies.

## Demo Map Features
- ✅ Interactive location selection
- ✅ Route visualization with animations
- ✅ Zoom controls and map styles
- ✅ Search interface
- ✅ Marker placement for pickup/dropoff
- ✅ Driver tracking simulation
- ✅ Multiple map styles (Standard, Satellite, Terrain, Hybrid)

## Upgrading to Real Google Maps

### Why Upgrade?
- Real satellite imagery and street view
- Live traffic data and routing
- Actual address geocoding
- Places search with real locations
- Turn-by-turn navigation

### Setup Steps

1. **Get Google Maps API Key**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable the **Maps JavaScript API**
   - Create credentials (API Key)

2. **Configure API Key**
   - Copy `.env.example` to `.env`
   - Add your API key:
     ```
     VITE_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
     ```

3. **Restart Development Server**
   ```bash
   pnpm dev
   ```

### API Key Restrictions (Recommended)
For security, restrict your API key:
- **HTTP referrers**: `localhost:*`, `your-domain.com/*`
- **API restrictions**: Maps JavaScript API only

### Cost Considerations
- Google Maps offers $200 free credit monthly
- Most development/testing usage stays within free tier
- Monitor usage in Google Cloud Console

## Demo vs Real Maps Comparison

| Feature | Demo Map | Real Google Maps |
|---------|----------|------------------|
| Location Selection | ✅ | ✅ |
| Route Display | ✅ Animated | ✅ Real roads |
| Search | ✅ Mock results | ✅ Real places |
| Satellite View | ✅ Styled | ✅ Real imagery |
| Traffic Data | ❌ | ✅ |
| Turn-by-turn | ❌ | ✅ |
| Real Addresses | ❌ | ✅ |
| Cost | Free | Pay per use |

## Troubleshooting

### Map not loading?
1. Check browser console for errors
2. Verify API key is correct
3. Ensure Maps JavaScript API is enabled
4. Check API key restrictions

### Want to go back to demo?
Set in `.env`:
```
VITE_GOOGLE_MAPS_API_KEY=demo-key
```

## Support
The app automatically detects your configuration and shows helpful information in the Map Configuration panel on the rider page.
