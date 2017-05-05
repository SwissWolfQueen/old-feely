<!--
@Author: Nicolas Fazio <webmaster-fazio>
@Date:   01-09-2016
@Email:  contact@nicolasfazio.ch
@Last modified by:   webmaster-fazio
@Last modified time: 10-02-2017
-->

# COURS ECMA SCRIPT 6
  DEVELOPPEMENT &amp; PRODUCTION WORKFLOW

## Step 10 - 11 - FB: Auth - Google Auth | Correction

- import { UserPage } from './pages/user/user';
- add `firebase.auth().onAuthStateChanged() ` on app.js start() methode to switch on the right page with good params ready.
- add `googleAuth()` & `logOut()` methode into your FirebaseService
- add event on logout link in aside section to logout user
- import FirebaseService into Home Page.
- add `googleAuth()` methode to your HomePage.js to log user with google auth.
- $ nvm use 6
- $ npm install
- $ gulp
