export interface EventItem {
  id: string;
  type: 'character' | 'value' | 'simple';
  name: string;
  count?: number;
  uniqueUserCount?: number;
  uniqueUserCountAllCharacters?: number;
  uniqueUserCountAllValues?: number;
  items?: {
    name: string;
    count: number;
    uniqueUserCount: number;
    lastInteraction?: number;
  }[];
}