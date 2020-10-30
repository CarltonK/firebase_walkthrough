import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin'

admin.initializeApp()
const db = admin.firestore()
// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = functions.https.onRequest((request, response) => {
  const name = request.params.name !== null ? request.params.name : 'from Firebase'
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send(`Hello ${name}`);
});

// Authentication
export const newUser = functions.auth.user().onCreate(async (user) => {
  const uid = user.uid
  try {
    // Create a document server side
    await db.collection('users').doc(uid).set({
      createDate: admin.firestore.Timestamp.now(),
      email: user.email,
      uid: uid
    })
    functions.logger.info("User profile created successfully", {structuredData: true});
  } catch (e) {
    console.error(e)
  }
});

// Delete user
export const deleteUser = functions.auth.user().onDelete(async (user) => {
  const uid = user.uid
  try {
    // delete the user document
    await db.collection('users').doc(uid).delete()
    functions.logger.info("User profile deleted successfully", {structuredData: true});
    // NOTE: Firebase provides an extension which can handle this automatically
  } catch (e) {
    console.error(e)
  }
});