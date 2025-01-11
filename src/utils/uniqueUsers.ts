import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

/**
 * Track unique users for events
 */
export async function trackUniqueUser(
  stage: 'anonymous' | 'signedUp' | 'purchased',
  eventType: 'character' | 'value' | 'simple',
  key: string,
  userId: string,
  timestamp: number
): Promise<void> {
  if (!userId) return;

  try {
    const userEventRef = doc(db, 'unique_event_users', `${stage}_${eventType}_${key}`);
    
    await setDoc(userEventRef, {
      [userId]: timestamp
    }, { merge: true });

  } catch (error) {
    console.error('Error tracking unique user:', error);
  }
}

/**
 * Get unique user count for an event
 */
export async function getUniqueUserCount(
  stage: 'anonymous' | 'signedUp' | 'purchased',
  eventType: 'character' | 'value' | 'simple',
  key: string
): Promise<number> {
  try {
    const userEventRef = doc(db, 'unique_event_users', `${stage}_${eventType}_${key}`);
    const docSnap = await getDoc(userEventRef);
    
    if (!docSnap.exists()) return 0;
    
    return Object.keys(docSnap.data()).length;

  } catch (error) {
    console.error('Error getting unique user count:', error);
    return 0;
  }
}

/**
 * Get unique users for an event
 */
export async function getUniqueUsers(
  stage: 'anonymous' | 'signedUp' | 'purchased',
  eventType: 'character' | 'value' | 'simple',
  key: string
): Promise<{ userId: string; timestamp: number }[]> {
  try {
    const userEventRef = doc(db, 'unique_event_users', `${stage}_${eventType}_${key}`);
    const docSnap = await getDoc(userEventRef);
    
    if (!docSnap.exists()) return [];
    
    const data = docSnap.data();
    return Object.entries(data).map(([userId, timestamp]) => ({
      userId,
      timestamp: timestamp as number
    }));

  } catch (error) {
    console.error('Error getting unique users:', error);
    return [];
  }
}

/**
 * Get unique user metrics for a stage
 */
export async function getStageUniqueUserMetrics(
  stage: 'anonymous' | 'signedUp' | 'purchased'
): Promise<{
  characterEvents: Record<string, number>;
  valueEvents: Record<string, number>;
  simpleEvents: Record<string, number>;
}> {
  const metrics = {
    characterEvents: {},
    valueEvents: {},
    simpleEvents: {}
  };

  try {
    // Get all documents that start with the stage prefix
    const snapshot = await getDoc(doc(db, 'unique_event_users', stage));
    
    if (!snapshot.exists()) return metrics;

    // Process each document
    const data = snapshot.data();
    for (const [key, users] of Object.entries(data)) {
      const [, eventType, eventKey] = key.split('_');
      
      if (eventType === 'character') {
        metrics.characterEvents[eventKey] = Object.keys(users).length;
      } else if (eventType === 'value') {
        metrics.valueEvents[eventKey] = Object.keys(users).length;
      } else if (eventType === 'simple') {
        metrics.simpleEvents[eventKey] = Object.keys(users).length;
      }
    }

    return metrics;

  } catch (error) {
    console.error('Error getting stage unique user metrics:', error);
    return metrics;
  }
}

/**
 * Track multiple unique users for an event
 */
export async function trackMultipleUniqueUsers(
  stage: 'anonymous' | 'signedUp' | 'purchased',
  eventType: 'character' | 'value' | 'simple',
  key: string,
  users: { userId: string; timestamp: number }[]
): Promise<void> {
  if (!users.length) return;

  try {
    const userEventRef = doc(db, 'unique_event_users', `${stage}_${eventType}_${key}`);
    
    const userData = users.reduce((acc, { userId, timestamp }) => ({
      ...acc,
      [userId]: timestamp
    }), {});

    await setDoc(userEventRef, userData, { merge: true });

  } catch (error) {
    console.error('Error tracking multiple unique users:', error);
  }
}