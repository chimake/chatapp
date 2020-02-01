# Firebase Web
#Run the steps
#Authorize the Firebase CLI by running the following command
   
    firebase login

Hint: Make sure that your command line is accessing your app's local pluslife directory.
Associate your app with your Firebase project by running the following command:

    firebase use --add

Hint: When prompted, select your Project ID, then give your Firebase project an alias.

# To Run the app locally
run the following Firebase CLI command:

    firebase serve --only hosting

# Deploy functions

    firebase deploy --only functions

#To Deploy and run the web app on firebase 

    firebase deploy --except functions

#Deploying to other servers
    run this command: firebase use --add 

    It will prompt you to add the project-ID from firebase 
    
    After that, you can delete node_modules folder inside "functions" folder first before deploying
    
    copy the folder to the server, using git or ftp,
    
    point the domain name to "public" folder,
    
    cd into 'functions' folder and run "npm install" to enable cloud functions and install firebase-admin-sdk
    
#Updated Changes

    In main.js file
    replace the following functions

   line 20...
    function signOut(){
        ...
    }

    line 103...

    function fetchChats(){
    ...
    }

    line 128
    function displayChats(details, message) {
        ....
    }

   line 338
    function onMessageFormSubmit() {
    ...
    }