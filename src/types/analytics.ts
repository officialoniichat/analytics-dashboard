export interface PurchaseMetrics {
  purchasesByItem: {
    [itemId: string]: {
      count: number;
      totalSpent: number;
    };
  };
  totalSpent: number;
}

interface StagePlatformBrowserMetrics {
  platform: {
    [platform: string]: number;
  };
  browser: {
    [browser: string]: number;
  };
}

export interface AnalyticsData {
  totalUsers: number;
  currentUsers: number;
  lastUpdated: number;
  purchaseMetrics: PurchaseMetrics;
  stagePlatformBrowser: {
    anonymous: StagePlatformBrowserMetrics;
    signedUp: StagePlatformBrowserMetrics;
    purchased: StagePlatformBrowserMetrics;
  };
  stageMetrics: {
    anonymous: StageMetric;
    signedUp: StageMetric;
    purchased: StageMetric;
  };
  funnelMetrics: {
    anonymousToSignedUp: FunnelMetric;
    signedUpToPurchased: FunnelMetric;
  };
  gemMetrics: {
    anonymous: GemMetric;
    signedUp: GemMetric;
    purchased: GemMetric;
  };
  messageMetrics: {
    anonymous: MessageMetric;
    signedUp: MessageMetric;
    purchased: MessageMetric;
  };
  eventMetrics: {
    anonymous: EventMetric;
    signedUp: EventMetric;
    purchased: EventMetric;
  };
  convertedMetrics: {
    anonymousToSignedUp: ConvertedMetric;
    signedUpToPurchased: ConvertedMetric;
  };
}

interface StageMetric {
  currentUsers: number;
  totalUsers: number;
  lastEntryDate: number;
  lastExitDate: number;
}

interface FunnelMetric {
  conversionCount: number;
  lastConversionDate: number;
  totalConversionTime: number;
  conversionsTracked: number;
  averageConversionTime: number;
}

interface GemMetric {
  total: number;
  byItem: {
    [key: string]: number;
  };
}

interface MessageMetric {
  total: number;
  byCharacter: {
    [key: string]: number;
  };
}

interface CharacterEventData {
  count: number;
  totalUsers: number;
  lastInteractionDate: number;
}

interface ValueEventData {
  count: number;
  totalUsers: number;
}

interface EventMetric {
  characterEvents: {
    [eventName: string]: {
      [character: string]: CharacterEventData;
    };
  };
  valueEvents: {
    [eventName: string]: {
      [value: string]: ValueEventData;
    };
  };
}

interface ConvertedMetric {
  preSignup?: {
    totalMessages: number;
    userCount: number;
    messagesByCharacter: {
      [character: string]: number;
    };
    gemMetrics: {
      total: number;
      byItem: {
        [item: string]: number;
      };
    };
    simpleEvents: {
      [eventName: string]: number;
    };
    errors: {
      [errorType: string]: {
        count: number;
        details: {
          [errorDetail: string]: number;
        };
      };
    };
    browsers?: {
      [browser: string]: number;
    };
    platforms?: {
      [platform: string]: number;
    };
  };
  prePurchase?: {
    totalMessages: number;
    userCount: number;
    messagesByCharacter: {
      [character: string]: number;
    };
    gemMetrics: {
      total: number;
      byItem: {
        [item: string]: number;
      };
    };
    simpleEvents: {
      [eventName: string]: number;
    };
    errors: {
      [errorType: string]: {
        count: number;
        details: {
          [errorDetail: string]: number;
        };
      };
    };
    browsers?: {
      [browser: string]: number;
    };
    platforms?: {
      [platform: string]: number;
    };
  };
}