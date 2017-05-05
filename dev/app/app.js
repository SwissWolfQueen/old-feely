/**
 * @Author: Nicolas Fazio <webmaster-fazio>
 * @Date:   01-09-2016
 * @Email:  contact@nicolasfazio.ch
 * @Last modified by:   webmaster-fazio
 * @Last modified time: 10-02-2017
 */

import * as firebase from "firebase";
import {
    config
} from './providers/firebase/fb-config';
import {
    HomePage
} from './pages/home/home';
import {
    UserPage
} from './pages/user/user';

class MyApp {

    constructor() {
        // Initialize Firebase
        firebase.initializeApp(config);
        this.appBody = document.getElementsByTagName("app")[0];
    }

    start() {

        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                // User is signed in.
                let userDataReady = {
                    name: user.displayName,
                    email: user.email,
                    uid: user.uid
                }
                // init UserPage
                new UserPage(this.appBody, userDataReady);
            } else {
                // No user is signed in.
                console.log('User NOT log.')
                // init HomePage
                let homePage = new HomePage(this.appBody);
            }
        });
    }

}

let myApp = new MyApp();
myApp.start();
