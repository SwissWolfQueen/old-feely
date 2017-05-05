

import * as firebase from "firebase";

export class FirebaseService {

    constructor() {
        this.database = firebase.database();
        this.auth = firebase.auth();
    }

    create(collection, datasObject) {
        // define firebase collection with correct style
        collection = `${collection}/`;

        return new Promise((resolve, reject) => {
            let created = this.database.ref(collection).push(datasObject);
            if (created) {
                resolve(created);
            } else {
                reject("The write operation failed");
            }
        });
    }

    read(collection) {
        return this.database.ref(collection);
    }

    ref(collection) {
        return this.database.ref(collection);
    }

    readOnce(collection) {
        return this.database.ref(collection).once('value');
    }

    set(collection, data) {
        return this.database.ref(collection).set(data)
    }

    readLastFiveBehaviour(collection) {
        let ref = this.database.ref(collection);
        return ref.orderByChild("date").limitToLast(5).once("value")
    }

    update(collection, key, datasObject) {
        collection = `${collection}/`;
        return this.database.ref(collection).child(key).update(datasObject);
    }

    delete(collection, key) {
        collection = `${collection}/`;
        return this.database.ref(collection).child(key).remove();
    }

    googleAuth() {
        let googleProvider = new firebase.auth.GoogleAuthProvider();
        return this.auth.signInWithPopup(googleProvider)
    }

    logOut() {
        let confirmBox = window.confirm("Realy want to logout??");
        if (confirmBox != true) {
            return;
        }
        this.auth.signOut().then(() => {
            // Sign-out successful.
            console.log('Sign-out successful')
        }, (error) => {
            // An error happened.
            console.log('Sign-out error happened')
        });
    }
}
