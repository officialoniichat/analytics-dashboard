# Analytics Dashboard

A React-based analytics dashboard for tracking user conversion metrics, engagement, and platform analytics.

## Features

- **Conversion Tracking**
  - Anonymous to Signed Up users
  - Signed Up to Purchased users
  - Conversion rates and average time to convert
  - User counts and engagement metrics

- **Engagement Metrics**
  - Messages per user
  - Total messages
  - Gems per user
  - Gem usage breakdown by item

- **Platform Analytics**
  - Browser distribution
  - Platform distribution (web, mobile, etc.)
  - Percentage breakdown of users by platform

- **Message Analytics**
  - Message distribution by character
  - Total message counts
  - Percentage breakdown

- **Error Analysis**
  - Error tracking by type
  - Detailed error breakdowns
  - Error frequency and impact

## Project Structure

```
analytics-dashboard/
├── src/
│   ├── components/
│   │   ├── ConversionMetrics.tsx
│   │   ├── ConversionMetricsTab.tsx
│   │   ├── DashboardCard.tsx
│   │   ├── DropoffMetricsTab.tsx
│   │   ├── EventMetrics.tsx
│   │   ├── GemMetrics.tsx
│   │   ├── MessageMetrics.tsx
│   │   ├── SortableEvent.tsx
│   │   ├── StatsOverview.tsx
│   │   ├── UserFunnel.tsx
│   │   └── types.ts
│   ├── types/
│   │   └── analytics.ts
│   ├── utils/
│   │   ├── firebase.ts
│   │   └── uniqueUsers.ts
│   ├── App.tsx
│   └── main.tsx
```

## Component Overview

### ConversionMetricsTab
The main component for displaying conversion metrics between different user stages:
- Anonymous to Signed Up
- Signed Up to Purchased

Features:
- Conversion rate tracking
- Average time to convert
- User engagement metrics
- Browser and platform analytics
- Error analysis

### DashboardCard
A reusable component for displaying metric cards with consistent styling.

### EventMetrics
Tracks and displays various user events and interactions.

### GemMetrics
Monitors gem usage and distribution across different items.

## Data Structure

The analytics data follows a structured format defined in `types/analytics.ts`:

```typescript
interface AnalyticsData {
  totalUsers: number;
  currentUsers: number;
  stageMetrics: {
    anonymous: StageMetric;
    signedUp: StageMetric;
    purchased: StageMetric;
  };
  convertedMetrics: {
    anonymousToSignedUp: ConvertedMetric;
    signedUpToPurchased: ConvertedMetric;
  };
  // ... other metrics
}
```

### Platform Analytics
The dashboard includes detailed browser and platform distribution metrics in the conversion stages:

```typescript
interface ConvertedMetric {
  browsers?: {
    [browser: string]: number;  // Browser distribution
  };
  platforms?: {
    [platform: string]: number;  // Platform distribution
  };
  // ... other metrics
}
```

#### Supported Platforms
The `platforms` field tracks the user's device/environment:
- `web`: Desktop browsers or mobile web browsers
- `ios`: iPhone/iPad native apps
- `android`: Android native apps

#### Supported Browsers
The `browsers` field identifies the user's browser environment:
- `Chrome`: Google Chrome
- `Safari`: Apple Safari
- `Firefox`: Mozilla Firefox
- `Edge`: Microsoft Edge
- `Opera`: Opera Browser
- `Samsung`: Samsung Internet Browser
- `IE`: Internet Explorer (legacy)
- `unknown`: Browser couldn't be identified

Notes:
- Browser identification is available for both desktop and mobile web users
- For native apps (iOS/Android), the browser field may reflect the WebView component's browser identifier
- The platform field helps distinguish between web browsers and native app environments

## Styling

The project uses Tailwind CSS for styling with a consistent color scheme:
- Blue: Conversion metrics
- Green: Engagement metrics
- Purple: Gem usage
- Indigo: Message metrics
- Red: Error indicators

## Development

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```