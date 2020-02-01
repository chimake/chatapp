/**
 * Copyright 2017 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// Note: You will edit this file in the follow up codelab about the Cloud Functions for Firebase.

// Import the Firebase SDK for Google Cloud Functions.
const functions = require('firebase-functions');
// Import and initialize the Firebase Admin SDK.
const admin = require('firebase-admin');
admin.initializeApp();

// Adds a message that welcomes new users into the chat.
exports.addWelcomeMessages = functions.auth.user().onCreate(async (user) => {
    console.log('A new user signed in for the first time.');
    const fullName = user.displayName || 'Anonymous';
  
    // Saves the new welcome message into the database
    // which then displays it in the FriendlyChat clients.
    await admin.database().ref('messages/streams_public').push({
      displayName: 'Plus Life',
      messageText: `${fullName} signed in for the first time! Welcome!`,
      time: admin.database.ServerValue.TIMESTAMP,
      user: 'bot-pluslife'
    });
    console.log('Welcome message written to database.');
  });
  
// TODO(DEVELOPER): Write the blurOffensiveImages Function here.

// TODO(DEVELOPER): Write the sendNotifications Function here.
exports.sendNotifications = functions.database.ref('messages/{messageId}/{nodeId}').onCreate(
    async (snapshot, context) => {
      // Notification details.
      console.log('Uppercasing', context.params.messageId);
      const text = snapshot.val().messageText;
      const payload = {
        notification: {
          title: `${snapshot.val().displayName} sent ${text ? 'a message' : 'an image'}`,
          body: text ? (text.length <= 100 ? text : text.substring(0, 97) + '...') : '',
          icon: snapshot.val().profilePicUrl || '/images/profile_placeholder.png',
          click_action: `https://${process.env.GCLOUD_PROJECT}.firebaseapp.com`,
        }
      };
      // Get the list of device tokens.
      uid = snapshot.val().username;
      var key = context.params.messageId.split("_",2)
      var found = key.includes(uid)
      const tokens = [];
      if (found) {
        key.splice( key.indexOf(uid), 1 );
        admin.database().ref('fcmTokens').orderByChild("uid").equalTo(key[0]).on('value', (dataSnapshot) => {
            var alltok = dataSnapshot.val()
            console.log(alltok)
            for (var key in alltok) {
                tokens.push(key)
              }
      });   
      }
      // else {
      //   admin.database().ref('fcmTokens').on('value', (dataSnapshot) => {
      //       var alltok = dataSnapshot.val()
      //       for (var key in alltok) {
      //           tokens.push(key)
      //         }
      //   }); 
      // }
  
      if (tokens.length > 0) {
        // Send notifications to all tokens.
        const response = await admin.messaging().sendToDevice(tokens, payload);
        await cleanupTokens(response, tokens);
        console.log('Notifications have been sent and tokens cleaned up.');
      }
    });

    // Cleans up the tokens that are no longer valid.
function cleanupTokens(response, tokens) {
    // For each notification we check if there was an error.
    const tokensDelete = [];
    response.results.forEach((result, index) => {
      const error = result.error;
      if (error) {
        console.error('Failure sending notification to', tokens[index], error);
        // Cleanup the tokens who are not registered anymore.
        if (error.code === 'messaging/invalid-registration-token' ||
            error.code === 'messaging/registration-token-not-registered') {
          const deleteTask = admin.database().ref('messages').child(tokens[index]).delete();
          tokensDelete.push(deleteTask);
        }
      }
    });
    return Promise.all(tokensDelete);
   }