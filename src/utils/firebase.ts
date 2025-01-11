import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  doc, 
  getDoc,
  collection,
  query,
  where,
  getDocs,
  Timestamp,
  DocumentData
} from 'firebase/firestore';
import { getAuth, User } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDKEPX-pF8X1hjSBtxvtLZJsvQ6MWsEufM",
  authDomain: "oniichat-2c310.firebaseapp.com",
  databaseURL: "https://oniichat-2c310-default-rtdb.firebaseio.com",
  projectId: "oniichat-2c310",
  storageBucket: "oniichat-2c310.appspot.com",
  messagingSenderId: "252794324018",
  appId: "1:252794324018:web:76c2860beeedc37aec282b",
  measurementId: "G-1Q4YG41GS2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Debug logging function
const logDebug = (message: string, data?: any) => {
  console.log(`[Firebase Debug] ${message}`, data ? data : '');
};

// Error logging function
const logError = (message: string, error: any) => {
  console.error(`[Firebase Error] ${message}`, error);
};

// Types
export interface AnalyticsData extends DocumentData {
  lastUpdated: Timestamp | Date | string | number;
  totalUsers?: number;
  activeUsers?: number;
  messagesSent?: number;
  // Add other specific fields as needed
}

// Timestamp handling
export const normalizeTimestamp = (timestamp: any): Date => {
  logDebug('Normalizing timestamp:', timestamp);
  try {
    if (timestamp instanceof Timestamp) {
      return timestamp.toDate();
    }
    if (timestamp instanceof Date) {
      return timestamp;
    }
    if (typeof timestamp === 'string' || typeof timestamp === 'number') {
      return new Date(timestamp);
    }
    return new Date();
  } catch (error) {
    logError('Error normalizing timestamp:', error);
    return new Date();
  }
};

export const formatTimestamp = (timestamp: Timestamp | Date | string | number): string => {
  try {
    return normalizeTimestamp(timestamp).toLocaleString();
  } catch (error) {
    logError('Error formatting timestamp:', error);
    return 'Invalid date';
  }
};

// Data fetching functions
export const getAnalyticsSummary = async (): Promise<AnalyticsData | null> => {
  logDebug('Fetching analytics summary...');
  try {
    const docRef = doc(db, 'analytics_summary', 'overview');
    logDebug('Fetching document from:', docRef.path);
    
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      logDebug('Retrieved analytics data:', data);
      
      // Log specific data sections
      logDebug('Message Metrics:', data.messageMetrics);
      logDebug('Event Metrics:', data.eventMetrics);
      logDebug('Stage Metrics:', data.stageMetrics);
      logDebug('Gem Metrics:', data.gemMetrics);
      
      // Validate critical data structures
      if (!data.messageMetrics) {
        logDebug('Warning: messageMetrics is missing');
      }
      if (!data.eventMetrics) {
        logDebug('Warning: eventMetrics is missing');
      }
      if (!data.stageMetrics) {
        logDebug('Warning: stageMetrics is missing');
      }

      const processedData = {
        ...data,
        lastUpdated: normalizeTimestamp(data.lastUpdated)
      } as AnalyticsData;

      logDebug('Processed analytics data:', processedData);
      return processedData;
    }

    logDebug('No analytics data found');
    return null;
  } catch (error) {
    logError('Error fetching analytics summary:', error);
    return null;
  }
};

export const getAnalyticsByDateRange = async (startDate: Date, endDate: Date) => {
  logDebug('Fetching analytics by date range:', { startDate, endDate });
  try {
    const analyticsRef = collection(db, 'analytics_summary');
    const q = query(
      analyticsRef,
      where('timestamp', '>=', startDate),
      where('timestamp', '<=', endDate)
    );
    
    logDebug('Executing query:', q);
    const querySnapshot = await getDocs(q);
    
    const results = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      lastUpdated: normalizeTimestamp(doc.data().lastUpdated)
    }));

    logDebug('Retrieved analytics by date range:', results);
    return results;
  } catch (error) {
    logError('Error fetching analytics by date range:', error);
    return [];
  }
};

// Auth helper functions
export const getCurrentUser = (): User | null => {
  const user = auth.currentUser;
  logDebug('Current user:', user ? { uid: user.uid, email: user.email } : 'No user');
  return user;
};

// Utility Functions
export const isDataStale = (timestamp: Timestamp | Date | string | number): boolean => {
  try {
    const date = normalizeTimestamp(timestamp);
    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1);
    const isStale = date < oneHourAgo;
    logDebug('Checking data staleness:', { timestamp, isStale });
    return isStale;
  } catch (error) {
    logError('Error checking data staleness:', error);
    return true;
  }
};

// Error handling wrapper
export const withErrorHandling = async <T,>(
  operation: () => Promise<T>,
  fallback: T,
  errorMessage = 'Operation failed'
): Promise<T> => {
  try {
    const result = await operation();
    logDebug('Operation completed successfully:', { result });
    return result;
  } catch (error) {
    logError(errorMessage, error);
    return fallback;
  }
};

// Number formatting
export const formatNumber = (num: number): string => {
  try {
    const formatted = num >= 1000000 
      ? `${(num / 1000000).toFixed(1)}M` 
      : num >= 1000 
      ? `${(num / 1000).toFixed(1)}K` 
      : num.toString();
    logDebug('Formatted number:', { original: num, formatted });
    return formatted;
  } catch (error) {
    logError('Error formatting number:', error);
    return '0';
  }
};

// Percentage calculations
export const calculatePercentageChange = (current: number, previous: number): number => {
  try {
    if (previous === 0) return 0;
    const change = ((current - previous) / previous) * 100;
    logDebug('Calculated percentage change:', { current, previous, change });
    return change;
  } catch (error) {
    logError('Error calculating percentage change:', error);
    return 0;
  }
};

// Data validation
export const isValidAnalyticsData = (data: any): data is AnalyticsData => {
  const isValid = data && 
    typeof data === 'object' && 
    'lastUpdated' in data;
  
  logDebug('Validating analytics data:', { 
    data, 
    isValid,
    hasLastUpdated: 'lastUpdated' in data,
    dataType: typeof data
  });
  
  return isValid;
};

// Export instances
export { app, db, auth };