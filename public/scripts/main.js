
'use strict';

// Signs-in Friendly Chat.
function signIn() {
  var provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider).then(function(result) {
    var me = result.user;
	  var user = {
				  name: me.displayName,
				  email: me.email,
				  userImage: me.photoURL,
				  username: me.uid
			  }
    firebase.database().ref('users/'+ user.name).set(user);
      $("#authenticationModalCenter").modal('hide');
  });
}

// Signs-out of Friendly Chat.
function signOut() {
  // TODO 2: Sign out of Firebase.
  firebase.auth().signOut();
  location.reload();
}

// Initiate firebase auth.
function initFirebaseAuth() {
  // TODO 3: Initialize Firebase.
  firebase.auth().onAuthStateChanged(authStateObserver)
}

// Returns the signed-in user's profile Pic URL.
function getProfilePicUrl() {
  // TODO 4: Return the user's profile pic URL.
  return firebase.auth().currentUser.photoURL || '/images/profile_placeholder.png';
}

// Returns the signed-in user's display name.
function getUserName() {
  // TODO 5: Return the user's display name.
  return firebase.auth().currentUser.displayName;
}

// Returns true if a user is signed-in.
function isUserSignedIn() {
  // TODO 6: Return true if a user is signed-in.
  return !!firebase.auth().currentUser;
}

function getUid(){
  return firebase.auth().currentUser.uid;
}

// Saves a new message on the Firebase DB.

function loadUsers() {
  var query = firebase.database().ref('user')
  // Start listening to the query.
  query.on('value',function(snapshot) {
    snapshot.forEach(e => {
      let user = e.val();
      if (user.username != getUid()) {
        displayUsers(e.key, user.username, user.userImage, user.name) 
      }
    })
  }); 
}
function fetchChats(){
 var uid = getUid();
    firebase.database().ref('messages').on('value',function(snapshot) {

    //Clears the chat list and update again to refresh for new messages
        chatList.html("");
    snapshot.forEach(function(childSnapshot) {
    var key = childSnapshot.key.split("_",2)
     var value = childSnapshot.val()
    var found = false;
   if (key[0] == uid){
     found = true
   }

   if (found) {
    key.splice( key.indexOf(uid), 1 );
    var lastmessage = value[Object.keys(value)[Object.keys(value).length-1]];

    if (lastmessage != undefined) {
      if (key[0].length > 0) {
        var ref = firebase.database().ref("user");
        ref.orderByChild("username").equalTo(key[0]).once("value", function(snapshot) {

          var display = displayChats(snapshot.val(), lastmessage);
            chatList.append(display);

        }); 
      }
    } 
   }
  })
})
}

function displayChats(details, message) {
  var chatHtml = "";
  if (details != null ) {
    details = Object.values(details)[0];


     chatHtml = `
                    <li class="chat-list-item" onclick="loadMessages('${details.username}')">
                        <div class="conversation unread">
                            <div class="user-avatar user-avatar-rounded"><img src="${details.userImage}" alt="Profile Picture"></div>
                                <div class="conversation__details">
                                    <div class="conversation__name">
                                        <div class="conversation__name--title">${details.name}</div>
                                        <div class="conversation__time">${timeSince(message.timestp) + ' ago'}</div>
                                    </div>
                                    <div class="conversation__message">
                                        <div class="conversation__message-preview">
                                            <span class="tick"><img src="images/tick/tick-delivered.svg" alt=""></span>${message.messageText}
                                        </div>
                                    </div>
                                </div>
                        </div>                                                             
                    </li>
   
      `;

      //console.log(chatList.children);
  }
    return chatHtml;
}
function displayUsers(name, userId, userpix, userName){
DOM.usersDisplay.innerHTML += `
                                                    <li class="chat-list-item"  onclick="loadMessages('${userId}')">
                                                        <div class="contactlist">
                                                            <div class="user-avatar user-avatar-rounded online">
                                                                <img src="${userpix}" alt="Profile Photo">
                                                            </div>
                                                            <div class="contactlist__details">
                                                                <div class="contactlist__details--name name">${name}</div>                                                               
                                                            </div>
                                                        </div>
                                                    </li>
`;
}
// Loads chat messages history and listens for upcoming ones.
function loadMessages(userId) {
    console.log("Time Stp: "+timeStp());
    messageListElement.html("");
    sender.val(userId);

  var uid = getUid();
  fetchChats();


   //console.log(uid) 
    if (userId != undefined) {
      firebase.database().ref("user").orderByChild("username").equalTo(userId).on("value", function(us){
        var id = us.val()
        var obj = Object.values(id)[0]
        DOM.messageAreaPic.src = obj.userImage;
        DOM.messageAreaSidePic.src = obj.userImage;
        DOM.messageAreaName.innerHTML = obj.name;
        DOM.messageAreaSideName.innerHTML = obj.name;
        DOM.messageAreaDetails.innerHTML = 'private';
      });
      if (userId < uid) {
        var query = firebase.database().ref('messages').child(uid +'_'+ userId)      
      }else if (userId > uid) {
        var query = firebase.database().ref('messages').child(userId +'_'+ uid) 
      } 
    }else{
        DOM.messageAreaPic.src = 'images/public.jpg';
        DOM.messageAreaName.innerHTML = "STREAM";
        DOM.messageAreaDetails.innerHTML = 'public';
      var query = firebase.database().ref('messages').child('streams_public')
    }
  // // Create the query to load the last 12 messages and listen for new ones.
  // Start listening to the query.
  query.on('value',function(snapshot) {
    snapshot.forEach(change => {
      if (change.type === 'removed') {
        deleteMessage(change.key);
      } else {
       var image = 'images/pluslife.png';
        var message = change.val();
        var msgHTML = "";


        //console.log("Message: "+message.displayName);
        if (message.displayName === '+LiFE') {
          //display chat bot
            displayMessage(change.key, message.timestp, message.displayName,
              message.messageText, image, message.photoUrl, message.user);

        } else {
          var ref = firebase.database().ref('user/'+ message.displayName);
          ref.once('value').then(function (snapshot) {
             image = snapshot.child("userImage").val();
              displayMessage(change.key, message.timestp, message.displayName,
                  message.messageText, image, message.photoUrl, message.user);

          });

        }

        }
    });
    // scrollBottom();
      const cc = $('#messages').children().last().attr('id');
      $('messages').animate({
          scrollTop: $("#"+cc).offset().top
      }, 2000);
    //   //const scroll = $("#"+cc);
    //   console.log("Scroll height: "+cc);
  });
}

function saveMessage(messageText) {
    // TODO 7: Push a new message to Firebase.
    var senderId = sender.val();

    var uid = getUid();
    //Check if sender is stream else create a node between one-to-one users
    if (messageText != ''){

        if (senderId == '') {
            console.log("Check point:"+ senderId);
            messageListElement.html("");
            return firebase.database().ref('messages').child('streams_public').push({
                displayName: getUserName(),
                messageText: messageText,
                user: uid,
                time: firebase.database.ServerValue.TIMESTAMP,
                timestp:timeStp()
            }).catch(function(error) {
                console.error('Error writing new message to database', error);
            });

        } else {
            firebase.database().ref('messages').child(uid+"_"+senderId).push({
                displayName: getUserName(),
                messageText: messageText,
                user: uid,
                time: firebase.database.ServerValue.TIMESTAMP,
                timestp:timeStp()
            }).catch(function(error) {
                console.error('Error writing new message to database', error);
            });
            firebase.database().ref('messages').child(senderId +"_"+ uid).push({
                displayName: getUserName(),
                messageText: messageText,
                user: uid,
                time: firebase.database.ServerValue.TIMESTAMP,
                timestp: timeStp()
            }).catch(function(error) {
                console.error('Error writing new message to database', error);
            });
        }

        // loadMessages(senderId);
    }else {
        console.log("Empty message!");
    }

}




// Saves a new message containing an image in Firebase.
// This first saves the image in Firebase storage.
function saveImageMessage(file) {

  // 1 - We add a message with a loading icon that will get updated with the shared image.
  var senderId = sender.val();
  var uid = getUid();
    console.log("Sender: "+senderId);
  //Check if sender is stream else create a node between one-to-one users
  if (senderId == '' ) {
      console.log("Stream");
    return firebase.database().ref('messages').child('streams_public').push({
      displayName: getUserName(),
      photoUrl: LOADING_IMAGE_URL,
      user: uid,
      time: firebase.database.ServerValue.TIMESTAMP,
        timestp:timeStp()
    }).then(function(messageRef) {
      // 2 - Upload the image to Cloud Storage.
      var filePath = firebase.auth().currentUser.uid + '/' + messageRef.id + '/' + file.name;
        //console.log("File path : "+file.name);
      return firebase.storage().ref(filePath).put(file).then(function(fileSnapshot) {
        // 3 - Generate a public URL for the file.
        return fileSnapshot.ref.getDownloadURL().then((url) => {
          // 4 - Update the chat message placeholder with the image's URL.
          return messageRef.update({
            photoUrl: url,
            storageUri: fileSnapshot.metadata.fullPath
          });
        });
      });
    }).catch(function(error) {
      console.error('There was an error uploading a file to Cloud Storage:', error);
    }); 
  } else {
    if (uid > senderId) {
      return firebase.database().ref('messages').child(uid+"_"+senderId).push({
        displayName: getUserName(),
        photoUrl: LOADING_IMAGE_URL,
        user: uid,
        time: firebase.database.ServerValue.TIMESTAMP,
          timestp:timeStp()
      }).then(function(messageRef) {
        // 2 - Upload the image to Cloud Storage.
        var filePath = firebase.auth().currentUser.uid + '/' + messageRef.id + '/' + file.name;
        return firebase.storage().ref(filePath).put(file).then(function(fileSnapshot) {
          // 3 - Generate a public URL for the file.
          return fileSnapshot.ref.getDownloadURL().then((url) => {
            // 4 - Update the chat message placeholder with the image's URL.
            return messageRef.update({
              photoUrl: url,
              storageUri: fileSnapshot.metadata.fullPath
            });
          });
        });
      }).catch(function(error) {
        console.error('There was an error uploading a file to Cloud Storage:', error);
      }); 
    }else if(uid < senderId){
      return firebase.database().ref('messages').child(senderId +"_"+ uid).push({
        displayName: getUserName(),
        photoUrl: LOADING_IMAGE_URL,
        user: uid,
        time: firebase.database.ServerValue.TIMESTAMP,
          timestp:timeStp()
      }).then(function(messageRef) {
        // 2 - Upload the image to Cloud Storage.
        var filePath = firebase.auth().currentUser.uid + '/' + messageRef.id + '/' + file.name;
        return firebase.storage().ref(filePath).put(file).then(function(fileSnapshot) {
          // 3 - Generate a public URL for the file.
          return fileSnapshot.ref.getDownloadURL().then((url) => {
            // 4 - Update the chat message placeholder with the image's URL.
            return messageRef.update({
              photoUrl: url,
              storageUri: fileSnapshot.metadata.fullPath
            });
          });
        });
      }).catch(function(error) {
        console.error('There was an error uploading a file to Cloud Storage:', error);
      });
    }
  }
}

// Saves the messaging device token to the database.
function saveMessagingDeviceToken() {
  firebase.messaging().getToken().then(function(currentToken) {
    if (currentToken) {
      // Saving the Device Token to the datastore.
      firebase.database().ref('fcmTokens').child(currentToken)
          .set({uid: firebase.auth().currentUser.uid});
    } else {
      // Need to request permissions to show notifications.
      requestNotificationsPermissions();
    }
  }).catch(function(error){
    console.error('Unable to get messaging token.', error);
  });
}

// Requests permissions to show notifications.
function requestNotificationsPermissions() {
  console.log('Requesting notifications permission...');
  firebase.messaging().requestPermission().then(function() {
    // Notification permission granted.
    saveMessagingDeviceToken();
  }).catch(function(error) {
    console.error('Unable to get permission to notify.', error);
  });
}

// Triggered when a file is selected via the media picker.
function onMediaFileSelected(event) {
  event.preventDefault();
  var file = event.target.files[0];


  // Clear the selection in the file picker input.
  imageFormElement.reset();

  // Check if the file is an image.
  if (!file.type.match('image.*')) {
    var data = {
      message: 'You can only share images',
      timeout: 2000
    };
    //signInSnackbarElement.MaterialSnackbar.showSnackbar(data);
    return;
  }
  // Check if the user is signed-in
  if (checkSignedInWithMessage()) {
      //console.log("File: "+JSON.stringify(file));
    saveImageMessage(file);
  }
}

// Triggered when the send new message form is submitted.
function onMessageFormSubmit() {
    fetchChats();
  //e.preventDefault();
  // Check that the user entered a message and is signed in.
  if (messageInputElement.val() && checkSignedInWithMessage()) {
    saveMessage(messageInputElement.val());

      messageInputElement.val('');
  }
}
 var profilePictureurl = "";
var userDisplayname = "";
// Triggers when the auth state change for instance when the user signs-in or signs-out.
function authStateObserver(user) {
  if (user) { // User is signed in!
      iziToast.info({
          title: 'Attention',
          message: 'Please wait...',
          position: 'center',
          overlay: true,
          displayMode: 'once',
          timeout:7000,

      });
      $('#authenticationModalCenter').modal('hide');
    // Get the signed-in user's profile pic and name.
      profilePictureurl = getProfilePicUrl();
      userDisplayname = getUserName();

    // Set the user's profile pic and name.
    userPicElement.attr("src",profilePictureurl);
    userModalPicElement.attr("src",profilePictureurl);
    userNameElement.html(userDisplayname);

    loadUsers();

    loadMessages();


    // We save the Firebase Messaging Device token and enable notifications.
    saveMessagingDeviceToken();
      mainContainer.removeAttr("hidden");
  } else { // User is signed out!
      mainContainer.attr("hidden","hidden");
      $("#authenticationModalCenter").modal({
          backdrop: 'static',
          keyboard: false,
          show: true
      });

  }
}

// Returns true if user is signed-in. Otherwise false and displays a message.
function checkSignedInWithMessage() {
  // Return true if the user is signed in Firebase
  if (isUserSignedIn()) {
    return true;
  }

  // Display a message to the user using a Toast.
  var data = {
    message: 'You must sign-in first',
    timeout: 2000
  };
  //signInSnackbarElement.MaterialSnackbar.showSnackbar(data);
  return false;
}


// Template for messages.
var RECIEVED_MESSAGE_TEMPLATE = `<div class="ca-send msgBody">
                                                    <div class="ca-send__msg-group">
                                                        <div class="ca-send__msgwrapper">
                                                            
                                                            <div class="ca-send__msg message"></div>
                                                        </div>
                                                        <div class="metadata">
                                                            <span class="time name hideName"></span> - <span class="time msgTime"></span> <span class="time"> ago</span> 
                                                            <span class="tick">
                                                                <img src="images/tick/tick-read.svg" alt="">
                                                            </span>
                                                        </div>
                                                    </div>
                                                   
                                                    <div class="user-avatar user-avatar-sm user-avatar-rounded ">
                                                        <img src="" class="pic" alt="">
                                                    </div>
                                                </div>`;

var SENT_MESSAGE_TEMPLATE = `<div class="ca-received msgBody">
    <div class="user-avatar user-avatar-sm user-avatar-rounded hideSender">
        <img src="" class="pic" alt="">
    </div>
    <div class="ca-received__msg-group">
        <div class="ca-received__msgwrapper">
            <div class="ca-received__msg message"></div>           
        </div>
        <div class="metadata">
            <span class="time name hideName"></span> - <span class="time msgTime"></span> <span class="time"> ago</span> 
        </div>
    </div>
</div>`;

var SENT_IMAGE_MESSAGE_TEMPLATE = `<div class="ca-received__msg-media-group">
    <div class="ca-received__msg-media">
        <img class="msgPic" alt="">
    </div>
</div>`;

var RECIEVED_IMAGE_MESSAGE_TEMPLATE = `<div class="ca-send__msg-media-group">
    <div class="ca-send__msg-media">
        <img class="msgPic" alt="">
    </div>
</div>`;


// Adds a size to Google Profile pics URLs.
function addSizeToGoogleProfilePic(url) {
  if (url.indexOf('googleusercontent.com') !== -1 && url.indexOf('?') === -1) {
    return url + '?sz=150';
  }
  return url;
}

// A loading image URL.
var LOADING_IMAGE_URL = 'https://www.google.com/images/spin-32.gif?a';

// Delete a Message from the UI.
function deleteMessage(id) {
  var div = document.getElementById(id);
  // If an element for that message exists we delete it.
  if (div) {
    div.parentNode.removeChild(div);
  }
}
let areaSwapped = false;

function createAndInsertMessage(id, timestamp, sender) {
  var container = document.createElement('div');
    if (getUid() === sender){
        container.innerHTML =  RECIEVED_MESSAGE_TEMPLATE;

    }else{
        container.innerHTML = SENT_MESSAGE_TEMPLATE;
    }


  const div = container.firstChild;
  // console.log("Div First Child: "+div)
  div.setAttribute('id', id);
  //Link user name to chat area
    $(".hideName").click(function () {
        loadMessages(sender);
    });

  div.setAttribute('timestamp', timestamp);
    //messageListElement.append(div);
  // figure out where to insert new message
   const existingMessages = document.getElementById("messages").children;
  //
  if (existingMessages.length === 0) {
      document.getElementById("messages").appendChild(div);
  } else {
    let messageListNode = existingMessages[0];
  //     console.log(messageListNode)
    while (messageListNode) {
        const messageListNodeTime = messageListNode.getAttribute('timestamp');

      if (!messageListNodeTime) {
        throw new Error(
          `Child ${messageListNode.id} has no 'timestamp' attribute`
        );
      }

      if (messageListNodeTime > timestamp) {
        break;
      }

      messageListNode = messageListNode.nextSibling;
    }

      document.getElementById("messages").insertBefore(div, messageListNode);
  }

  return div;
}
var timeSince = function(date) {
  if (typeof date !== 'object') {
    date = new Date(date);
  }

    let endTime = moment();
    let startTime = moment(date);

    let duration = moment.duration(endTime.diff(startTime)).humanize();

  return duration;
};

var timeStp = function () {
    var now = moment();
    now.defaultFormat = "DD.MM.YYYY HH:mm";
    return now.toDate();
};
// Displays a Message in the UI.
function displayMessage(id, timestamp, name, text, picUrl, photoUrl, sender) {
  //console.log(id)
  var div = document.getElementById(id) || createAndInsertMessage(id, timestamp, sender);

  var eventVal = "loadMessages('"+sender+"')";
    if (getUid() != sender)
    {
        div.querySelector('.hideSender').setAttribute('onclick',eventVal);
    }
// console.log("Chat List: "+div)
  // profile picture
  if (!picUrl) {
        picUrl = "images/profile_placeholder.png";

  }
    div.querySelector('.pic').setAttribute('src',picUrl);

  div.querySelector('.name').textContent = name;
  var messageElement = div.querySelector('.message');
  var time = div.getAttribute('timestamp');

  timestamp = timeSince(time);


  div.querySelector('.msgTime').textContent = timestamp;

  if (text) { // If the message is text.
    messageElement.textContent = text;
    // Replace all line breaks by <br>.
    messageElement.innerHTML = messageElement.innerHTML.replace(/\n/g, '<br>');

  } else if (photoUrl) { // If the message is an image.

    let image = document.createElement('div');
      if (getUid() === sender){
          image.innerHTML = SENT_IMAGE_MESSAGE_TEMPLATE;

      }else{
          image.innerHTML = RECIEVED_IMAGE_MESSAGE_TEMPLATE;
      }

    let imageSrc = photoUrl + '&' + new Date().getTime();

    messageElement.appendChild(image);
      messageElement.querySelector('.msgPic').setAttribute('src',imageSrc);
  }


    //scrollBottom();
    messageElement.scrollTop = messageElement.scrollHeight;
    document.getElementById('message').focus();

}


function scrollBottom() {

    setTimeout(() => {
        const cc = $('#messages');
        const dd = cc[0].scrollHeight;
        cc.animate({
            scrollTop: dd
        }, 500);
    }, 1000);
}

let mClassList = (element) => {
	return {
		add: (className) => {
			element.classList.add(className);
			return mClassList(element);
		},
		remove: (className) => {
			element.classList.remove(className);
			return mClassList(element);
		},
		contains: (className, callback) => {
			if (element.classList.contains(className))
				callback(mClassList(element));
		}
	};
};

let showChatList = () => {
	if (areaSwapped) {

		areaSwapped = true;
	}
};
// Checks that the Firebase SDK has been correctly setup and configured.
function checkSetup() {
  if (!window.firebase || !(firebase.app instanceof Function) || !firebase.app().options) {
    window.alert('You have not configured and imported the Firebase SDK. ' +
        'Make sure you go through the codelab setup instructions and make ' +
        'sure you are running the codelab using `firebase serve`');
  }
}

// Checks that Firebase has been imported.
checkSetup();
let getById = (id, parent) => parent ? parent.getElementById(id) : getById(id, document);
let getByClass = (className, parent) => parent ? parent.getElementsByClassName(className) : getByClass(className, document);

const DOM =  {
	allUsers: getById("users-list"),
	usersDisplay: getById("children"),
	messages: getById("messages"),
	chatListItem: getByClass("chat-list-item"),
	messageAreaName: getById("name", this.messageArea),
	messageAreaPic: getById("pic", this.messageArea),
	messageAreaNavbar: getById("navbar", this.messageArea),
	messageAreaDetails: getById("details", this.messageAreaNavbar),
	messageAreaSideName: getById("sideName"),
	messageAreaSidePic: getById("sidePic"),
	messageAreaOverlay: getByClass("overlay", this.messageArea)[0],
	messageInput: getById("input"),
	UsersList: getById("users-list"),
	profileSettings: getById("profile-settings"),
	profilePic: getById("profile-pic"),
	profilePicInput: getById("profile-pic-input"),
	inputName: getById("input-name"),
	username: getById("username"),
  displayPic: getById("display-pic")

};

let showProfileSettings = () => {
	DOM.profileSettings.style.left = 0;
	DOM.profilePic.src = getProfilePicUrl();
	DOM.inputName.value = getUserName();
};

let hideProfileSettings = () => {
	DOM.profileSettings.style.left = "-110%";
	DOM.username.innerHTML = getUserName();
};
let showUsersList = () => {
	DOM.UsersList.style.left = 0;
};
let hideUsersList = () => {
	DOM.UsersList.style.left = "-110%";
};
window.addEventListener("resize", e => {
	if (window.innerWidth > 575) showChatList();
});

// Shortcuts to DOM Elements.
var messageListElement = $('#messages');
var messageElement = document.getElementById('messages');
//var messageFormElement = document.getElementById('message-form');
var messageInputElement = $('#message');
var submitButtonElement = document.getElementById('submit');
var imageButtonElement = document.getElementById('submitImage');
var imageFormElement = document.getElementById('image-form');
var mediaCaptureElement = document.getElementById('mediaCapture');
var userPicElement = $(".display_pic");
var userModalPicElement = $("#modal-profile-pic");
var userNameElement = $('.user_name');
var mainContainer = $("#main-container");
var googleSignInButtonElement = $('#google-sign-btn');
var registerBtn = $("#register-btn");
var emailPasswordBtn = $("#sign-btn");
var registerTriggerLink = $("#register-link");
var loginTriggerLink = $("#login-link");
var loginSection = $("#login-section");
var registerSection = $("#register-section");
var sender = $("#senderId");
var chatList = $("#chatList");
var inputArea = $("#input-area");
var chatListArea = $("#chat-list-area");
var msgBtn = $("#msg-btn");
var messageArea = $("#message-area");
var streamsElement = document.getElementById('streams');
var signOutButtonElement = $('#sign-out');
var viewProfileModal = $("#viewProfileModal");
var signInSnackbarElement = document.getElementById('must-signin-snackbar');

// Saves message on form submit.
//messageFormElement.addEventListener('submit', onMessageFormSubmit);


viewProfileModal.on('show.bs.modal', function () {
    $('body').addClass("viewProfile");
}).on('hide.bs.modal', function () {
    $('body').removeClass("viewProfile");
});
msgBtn.click(function () {
    onMessageFormSubmit();
});

signOutButtonElement.click(function () {
    signOut();
});

googleSignInButtonElement.click(function () {
    signIn();
});

registerTriggerLink.click(function () {
    loginSection.attr("hidden", "hidden");
    registerSection.removeAttr("hidden");
});

loginTriggerLink.click(function () {
    registerSection.attr("hidden","hidden");
    loginSection.removeAttr("hidden");
});


// Toggle for the button.
messageInputElement.keyup(function (event) {
    if (event.keyCode === 13) {
        event.preventDefault()
        onMessageFormSubmit();
    }
});

// messageInputElement.addEventListener('change', toggleButton);

// Events for image upload.
imageButtonElement.addEventListener('click', function(e) {
    e.preventDefault();
    mediaCaptureElement.click();
});
mediaCaptureElement.addEventListener('change', onMediaFileSelected);
// imageButtonElement.click(function (e) {
//     e.preventDefault();
//     mediaCaptureElement.click();
// });

// mediaCaptureElement.change(function () {
//     onMediaFileSelected();
// });


//Email and password registeration
registerBtn.click(function () {
    var userRegEmail = $("#register_email").val();
    var userPassword = $("#register_pwd").val();
    var confirmPassword = $("#register_re_pwd").val();
    if (userRegEmail.length < 4)
    {
        iziToast.error({
            title: "Error",
            message: "Please enter a valid email",
            position: 'center',
            overlay: true,
            displayMode: 'once',
        });
    }

    if (userPassword.length < 4 )
    {
        iziToast.error({
            title: "Error",
            message: "Please enter a valid passsword",
            position: 'center',
            overlay: true,
            displayMode: 'once',
        });
    }
    if (userPassword !== confirmPassword)
    {
        iziToast.error({
            title: "Error",
            message: "Passwords don't match",
            position: 'center',
            overlay: true,
            displayMode: 'once',
        });
    }
    firebase.auth().createUserWithEmailAndPassword(userRegEmail, userPassword).catch(function(error) {

        var errorCode = error.code;
        var errorMessage = error.message;

        if (errorCode == 'auth/weak-password') {
            iziToast.error({
                title: "Error",
                message: "Weak password.",
                position: 'center',
                overlay: true,
                displayMode: 'once',
            });
        } else {
            iziToast.error({
                title: "Error",
                message: errorMessage,
                position: 'center',
                overlay: true,
                displayMode: 'once',
            });
        }
        console.log(error);


    });
});


emailPasswordBtn.click(function () {
    var userEmail = $("#login-email").val();
    var userPassword = $("#login-pwd").val();

    if (userEmail.length < 4)
    {
        iziToast.error({
            title: "Error",
            message: "Please enter a valid email",
            position: 'center',
            overlay: true,
            displayMode: 'once',
        });
    }

    if (userPassword.length < 4 )
    {
        iziToast.error({
            title: "Error",
            message: "Please enter a valid password",
            position: 'center',
            overlay: true,
            displayMode: 'once',
        });
    }

    firebase.auth().signInWithEmailAndPassword(userEmail, userPassword).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // [START_EXCLUDE]
        if (errorCode === 'auth/wrong-password') {
            iziToast.error({
                title: "Error",
                message: "Wrong password",
                position: 'center',
                overlay: true,
                displayMode: 'once',
            });
        } else {
            iziToast.error({
                title: "Error",
                message: errorMessage,
                position: 'center',
                overlay: true,
                displayMode: 'once',
                timeout:100000,
            });

        }
        console.log(error);

        // [END_EXCLUDE]
    });
});
// initialize Firebase
initFirebaseAuth();

// Remove the warning about timstamps change. 
var database = firebase.database();

// TODO: Enable Firebase Performance Monitoring.

// We load currently existing chat messages and listen to new ones.

