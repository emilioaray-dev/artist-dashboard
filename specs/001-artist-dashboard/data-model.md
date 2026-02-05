# Data Model: EVEN Backstage Dashboard

**Feature**: 001-artist-dashboard
**Date**: 2026-02-04

## Entities

### Channel

Represents a sales channel in the EVEN direct-to-fan platform.

```typescript
/**
 * Sales channel types available in EVEN Backstage.
 * These represent the different ways artists can monetize their content directly with fans.
 */
type Channel =
  | "direct_to_fan"   // Direct purchases from fans (primary revenue)
  | "digital"         // Digital downloads and streaming
  | "physical"        // Physical merchandise and vinyl
  | "bundles";        // Bundle packages combining multiple products

/**
 * Channel display information for UI rendering.
 */
interface ChannelInfo {
  /** Unique channel identifier */
  id: Channel;
  /** Display name for UI: "Direct to Fan", "Digital", etc. */
  name: string;
  /** Brand color for charts and visualizations */
  color: string;
  /** Optional Lucide icon identifier */
  icon?: string;
}
```

---

### Release

Represents an exclusive music release or drop on EVEN.

```typescript
/**
 * Types of releases available on EVEN Backstage.
 */
type ReleaseType = "single" | "ep" | "album" | "drop" | "bundle";

/**
 * Release status indicating the current state of the release.
 */
type ReleaseStatus = "draft" | "scheduled" | "live" | "archived";

/**
 * Represents a music release with sales data broken down by channel.
 */
interface Release {
  /** Unique identifier */
  id: string;
  /** Release title */
  title: string;
  /** Type of release */
  type: ReleaseType;
  /** Current status */
  status: ReleaseStatus;
  /** ISO date string "2026-01-15" */
  releaseDate: string;
  /** URL to cover image (or empty for placeholder) */
  coverArtUrl: string;
  /** Total units sold across all channels */
  totalSales: number;
  /** Total revenue in cents */
  totalRevenue: number;
  /** Sales breakdown by channel */
  salesByChannel: Record<Channel, number>;
  /** Revenue breakdown by channel in cents */
  revenueByChannel: Record<Channel, number>;
}
```

**Validation Rules**:
- `id`: Non-empty string
- `title`: Non-empty string, max 200 characters
- `releaseDate`: Valid ISO date
- `coverArtUrl`: Valid URL or empty string (triggers placeholder)
- `totalSales`: Non-negative integer
- `totalRevenue`: Non-negative integer (cents)
- `salesByChannel`: All values non-negative integers
- `revenueByChannel`: All values non-negative integers (cents)

**Example**:
```typescript
const release: Release = {
  id: "rel_001",
  title: "Midnight Dreams - Exclusive Drop",
  type: "drop",
  status: "live",
  releaseDate: "2026-01-15",
  coverArtUrl: "/covers/midnight-dreams.jpg",
  totalSales: 2500,
  totalRevenue: 4999500, // $49,995.00
  salesByChannel: {
    direct_to_fan: 1500,
    digital: 600,
    physical: 250,
    bundles: 150
  },
  revenueByChannel: {
    direct_to_fan: 2999700,  // $29,997.00
    digital: 1199880,        // $11,998.80
    physical: 499950,        // $4,999.50
    bundles: 299970          // $2,999.70
  }
};
```

---

### SalesData

Daily revenue record for analytics.

```typescript
/**
 * Daily sales record for a specific date.
 */
interface DailySales {
  /** ISO date string "2026-01-15" */
  date: string;
  /** Total revenue in cents (integer) */
  revenue: number;
  /** Total units sold */
  sales: number;
  /** Revenue breakdown by channel in cents */
  revenueByChannel: Record<Channel, number>;
  /** Sales breakdown by channel */
  salesByChannel: Record<Channel, number>;
}

/**
 * Summary of sales data for a period with daily breakdown.
 */
interface SalesSummary {
  /** Total revenue in cents */
  totalRevenue: number;
  /** Total units sold */
  totalSales: number;
  /** Gross revenue before fees (cents) */
  grossRevenue: number;
  /** Net revenue after fees (cents) */
  netRevenue: number;
  /** Period start date ISO string */
  periodStart: string;
  /** Period end date ISO string */
  periodEnd: string;
  /** Array of daily records */
  dailyData: DailySales[];
  /** Total revenue per channel in cents */
  byChannel: Record<Channel, number>;
  /** Revenue change percentage from previous period */
  revenueChange: {
    percentage: number;
    trend: "up" | "down" | "stable";
  };
}
```

**Validation Rules**:
- `date`: Valid ISO date within the reporting period
- `revenue`: Non-negative integer (cents)
- `sales`: Non-negative integer
- `revenueByChannel`: All values non-negative integers (cents)
- `salesByChannel`: All values non-negative integers

**Display Formatting**:
- Convert cents to dollars for display: `revenue / 100`
- Format as currency: `$1,234.56`
- Large amounts abbreviated: `$45.2K`, `$1.2M`

**Example**:
```typescript
const salesSummary: SalesSummary = {
  totalRevenue: 4523456,  // $45,234.56
  totalSales: 1850,
  grossRevenue: 5028284,  // $50,282.84
  netRevenue: 4523456,    // $45,234.56 (after 10% platform fee)
  periodStart: "2026-01-05",
  periodEnd: "2026-02-04",
  dailyData: [
    {
      date: "2026-01-05",
      revenue: 150234,
      sales: 62,
      revenueByChannel: {
        direct_to_fan: 90140,
        digital: 37558,
        physical: 15023,
        bundles: 7513
      },
      salesByChannel: {
        direct_to_fan: 37,
        digital: 15,
        physical: 6,
        bundles: 4
      }
    },
    // ... 29 more days
  ],
  byChannel: {
    direct_to_fan: 2714073,
    digital: 1131864,
    physical: 452345,
    bundles: 225174
  },
  revenueChange: {
    percentage: 12.5,
    trend: "up"
  }
};
```

---

### EngagementMetrics

Fan engagement and community data.

```typescript
/**
 * Daily fan count record for historical tracking.
 */
interface FanData {
  /** ISO date string */
  date: string;
  /** Total fans on that date */
  count: number;
  /** Active fans (engaged in last 30 days) */
  activeFans: number;
}

/**
 * Comprehensive fan engagement metrics.
 */
interface EngagementMetrics {
  /** Current total fan count */
  totalFans: number;
  /** Fans who have made a purchase */
  totalBuyers: number;
  /** Fans active in last 30 days */
  activeFans: number;
  /** Fan growth metrics */
  fanGrowth: {
    /** Net new fans in period */
    absolute: number;
    /** Growth rate percentage (e.g., 12.5 for 12.5%) */
    percentage: number;
    /** Trend direction */
    trend: "up" | "down" | "stable";
  };
  /** Engagement rate metrics */
  engagementRate: {
    /** Percentage of fans who engaged (e.g., 4.2 for 4.2%) */
    value: number;
    /** Trend direction */
    trend: "up" | "down" | "stable";
    /** Change from previous period */
    change: number;
  };
  /** Purchase rate metrics */
  purchaseRate: {
    /** Percentage of fans who purchased (e.g., 8.5 for 8.5%) */
    value: number;
    /** Trend direction */
    trend: "up" | "down" | "stable";
    /** Change from previous period */
    change: number;
  };
  /** Daily fan counts for chart */
  fanHistory: FanData[];
  /** Top fans by purchase value (optional, for future) */
  topFans?: Array<{
    id: string;
    displayName: string;
    totalSpent: number;
    purchaseCount: number;
  }>;
}
```

**Validation Rules**:
- `totalFans`: Non-negative integer
- `fanGrowth.percentage`: Number with max 1 decimal place
- `engagementRate.value`: Number between 0 and 100
- `purchaseRate.value`: Number between 0 and 100
- `trend`: One of "up", "down", "stable"

**Business Logic**:
- `trend = "up"` when growth > 0
- `trend = "down"` when growth < 0
- `trend = "stable"` when growth is 0 or within ±0.5%
- `purchaseRate = (totalBuyers / totalFans) * 100`

**Example**:
```typescript
const engagement: EngagementMetrics = {
  totalFans: 125000,
  totalBuyers: 10625,
  activeFans: 45000,
  fanGrowth: {
    absolute: 12500,
    percentage: 11.1,
    trend: "up"
  },
  engagementRate: {
    value: 36.0,  // 45000 active / 125000 total
    trend: "up",
    change: 2.3
  },
  purchaseRate: {
    value: 8.5,   // 10625 buyers / 125000 total
    trend: "up",
    change: 0.8
  },
  fanHistory: [
    { date: "2026-01-05", count: 112500, activeFans: 40500 },
    { date: "2026-01-06", count: 113200, activeFans: 40752 },
    // ... more days
    { date: "2026-02-04", count: 125000, activeFans: 45000 }
  ]
};
```

---

## API Response Types

```typescript
/**
 * Standard API response wrapper for consistent error handling.
 */
interface ApiResponse<T> {
  /** Response data on success */
  data?: T;
  /** Error information on failure */
  error?: {
    code: string;
    message: string;
  };
  /** HTTP status code */
  status: number;
}

/**
 * API endpoint response types.
 */
type ReleasesResponse = ApiResponse<Release[]>;
type SalesResponse = ApiResponse<SalesSummary>;
type EngagementResponse = ApiResponse<EngagementMetrics>;
```

---

## Relationships

```
┌─────────────┐
│   Artist    │ (implicit - single artist context)
└──────┬──────┘
       │ has many
       ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Releases   │     │ SalesData   │     │ Engagement  │
└──────┬──────┘     └──────┬──────┘     └──────┬──────┘
       │                   │                   │
       │ sales by          │ revenue by        │ fans/buyers
       ▼                   ▼                   ▼
┌─────────────┐
│   Channel   │
└─────────────┘
```

---

## State Transitions

### Loading States

```
IDLE → LOADING → SUCCESS | ERROR

States per section:
- releases: { status: "idle" | "loading" | "success" | "error", data?: Release[], error?: string }
- sales: { status: "idle" | "loading" | "success" | "error", data?: SalesSummary, error?: string }
- engagement: { status: "idle" | "loading" | "success" | "error", data?: EngagementMetrics, error?: string }
```

### Empty States

```
SUCCESS with empty data → EMPTY

Conditions:
- releases.data.length === 0 → Show "No releases yet" empty state
- sales.data.dailyData.length === 0 → Show "No sales data" message
- engagement.totalFans === 0 → Show "Start building your fan community" message
```
