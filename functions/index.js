// functions/index.ts

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();

// Cloud Function to process a new trade offer
export const processTradeOffer = functions.https.onCall(async (data, context) => {
  // Check if user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
  }

  const { offererId, receiverId, offer, request, message } = data;

  try {
    // Validate offerer and receiver IDs
    if (offererId !== context.auth.uid) {
      throw new functions.https.HttpsError('permission-denied', 'You can only create trades for yourself.');
    }

    // Create a new trade document in the 'trades' collection
    const tradeRef = await db.collection('trades').add({
      offererId,
      receiverId,
      offer,
      request,
      message,
      status: 'pending',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      negotiationHistory: [],
    });

    // Send a notification to the receiver (placeholder for a real notification system)
    const notificationRef = await db.collection('notifications').add({
      userId: receiverId,
      message: `You have a new trade offer from ${offererId}`,
      tradeId: tradeRef.id,
      read: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log(`New trade offer created with ID: ${tradeRef.id}`);
    console.log(`Notification sent to receiver with ID: ${notificationRef.id}`);

    return { tradeId: tradeRef.id, status: 'success' };
  } catch (error) {
    console.error('Error processing trade offer:', error);
    throw new functions.https.HttpsError('internal', 'Unable to create trade offer.', error);
  }
});