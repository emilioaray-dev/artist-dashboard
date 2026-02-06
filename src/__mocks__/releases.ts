import { Release, ReleaseStatus, ReleaseType, Channel } from "@/types"; // eslint-disable-line @typescript-eslint/no-unused-vars

export const mockReleases: Release[] = [
  {
    id: "rel_001",
    title: "Midnight Dreams - Exclusive Drop",
    type: "drop",
    status: "live",
    releaseDate: "2026-01-15",
    coverArtUrl: "/covers/midnight-dreams.jpg",
    audioUrl: "https://pub-d285a77a938b46bf93539cdd85ba963b.r2.dev/Nul%20Tiel%20Records%20-%20Jeopardy.mp3",
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
  },
  {
    id: "rel_002",
    title: "Neon Nights EP",
    type: "ep",
    status: "live",
    releaseDate: "2026-01-22",
    coverArtUrl: "/covers/neon-nights.jpg",
    audioUrl: "https://pub-d285a77a938b46bf93539cdd85ba963b.r2.dev/Neon%20Nights%20-%20Synthwave%20Dreams.mp3",
    totalSales: 1800,
    totalRevenue: 3599640, // $35,996.40
    salesByChannel: {
      direct_to_fan: 1100,
      digital: 450,
      physical: 150,
      bundles: 100
    },
    revenueByChannel: {
      direct_to_fan: 2199780,  // $21,997.80
      digital: 899910,         // $8,999.10
      physical: 299970,        // $2,999.70
      bundles: 199980          // $1,999.80
    }
  },
  {
    id: "rel_003",
    title: "Electric Pulse Album",
    type: "album",
    status: "live",
    releaseDate: "2026-02-01",
    coverArtUrl: "/covers/electric-pulse.jpg",
    audioUrl: "https://pub-d285a77a938b46bf93539cdd85ba963b.r2.dev/Electric%20Pulse%20-%20Full%20Album.mp3",
    totalSales: 3200,
    totalRevenue: 6399360, // $63,993.60
    salesByChannel: {
      direct_to_fan: 1900,
      digital: 800,
      physical: 350,
      bundles: 150
    },
    revenueByChannel: {
      direct_to_fan: 3799620,  // $37,996.20
      digital: 1599840,        // $15,998.40
      physical: 699930,        // $6,999.30
      bundles: 299970          // $2,999.70
    }
  },
  {
    id: "rel_004",
    title: "Silent Echo Single",
    type: "single",
    status: "scheduled",
    releaseDate: "2026-02-15",
    coverArtUrl: "/covers/silent-echo.jpg",
    audioUrl: "https://pub-d285a77a938b46bf93539cdd85ba963b.r2.dev/Silent%20Echo%20-%20Single.mp3",
    totalSales: 0,
    totalRevenue: 0,
    salesByChannel: {
      direct_to_fan: 0,
      digital: 0,
      physical: 0,
      bundles: 0
    },
    revenueByChannel: {
      direct_to_fan: 0,
      digital: 0,
      physical: 0,
      bundles: 0
    }
  },
  {
    id: "rel_005",
    title: "Summer Vibes Collection",
    type: "bundle",
    status: "scheduled",
    releaseDate: "2026-03-01",
    coverArtUrl: "/covers/summer-vibes.jpg",
    audioUrl: "https://pub-d285a77a938b46bf93539cdd85ba963b.r2.dev/Summer%20Vibes%20-%20Compilation.mp3",
    totalSales: 0,
    totalRevenue: 0,
    salesByChannel: {
      direct_to_fan: 0,
      digital: 0,
      physical: 0,
      bundles: 0
    },
    revenueByChannel: {
      direct_to_fan: 0,
      digital: 0,
      physical: 0,
      bundles: 0
    }
  },
  {
    id: "rel_006",
    title: "Winter Chill Mixtape",
    type: "ep",
    status: "archived",
    releaseDate: "2025-12-01",
    coverArtUrl: "/covers/winter-chill.jpg",
    audioUrl: "https://pub-d285a77a938b46bf93539cdd85ba963b.r2.dev/Winter%20Chill%20-%20Mixtape.mp3",
    totalSales: 1200,
    totalRevenue: 2399760, // $23,997.60
    salesByChannel: {
      direct_to_fan: 700,
      digital: 300,
      physical: 150,
      bundles: 50
    },
    revenueByChannel: {
      direct_to_fan: 1399860,  // $13,998.60
      digital: 599940,         // $5,999.40
      physical: 299970,        // $2,999.70
      bundles: 99990           // $999.90
    }
  }
];