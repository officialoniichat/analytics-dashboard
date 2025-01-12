interface ValueEvent {
  count: number;
  uniqueUserCount: number;
  uniqueUserCountAllValues: number;
}

interface ValueEventsByType {
  [value: string]: ValueEvent;
}

interface ValueEvents {
  [eventType: string]: {
    [value: string]: ValueEvent;
  };
}

interface CharacterEvent {
  count: number;
  lastInteractionDate: number;
  uniqueUserCount: number;
  uniqueUserCountAllCharacters: number;
}

interface CharacterEvents {
  [eventType: string]: {
    [characterName: string]: CharacterEvent;
  };
}

interface GemMetrics {
  byItem: {
    [itemName: string]: number;
  };
  total: number;
}

interface ConversionStageMetrics {
  characterEvents: CharacterEvents;
  errors: Record<string, any>;
  gemMetrics: GemMetrics;
  messagesByCharacter: {
    [characterName: string]: number;
  };
  platform: {
    [platformType: string]: number;
  };
  simpleEvents: {
    [eventName: string]: {
      count: number;
      uniqueUsers: number;
    };
  };
  timeToConvert: number;
  totalMessages: number;
  userCount: number;
  valueEvents: ValueEvents;
}

interface ConvertedMetric {
  preSignup?: ConversionStageMetrics;
  prePurchase?: ConversionStageMetrics;
}

export interface ConversionMetrics {
  anonymousToSignedUp: ConvertedMetric;
  signedUpToPurchased: ConvertedMetric;
}