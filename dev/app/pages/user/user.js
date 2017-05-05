

import {
    FirebaseService
} from '../../providers/firebase/firebase-service';
import {
    moodSkeleton,
    reasonSkeleton,
    placeNameSkeleton,
    pageSkeleton,
    findMoodNumber,
    findImgIdForMoodAndReason,
    frenchTraduction
} from './user-ui';

export class UserPage {

    constructor(appBody, formInput) {
        this.appBody = appBody
        this.formData = formInput
        this.time = new Date()
        this.pageTitle = "Helleew";
        this.userName = this.getUserName();
        this.database = new FirebaseService();
        //Objet "donnes d'etat de l'utilisateur"; prend mood, reason et step
        this.userStateData = {
            mood: "",
            reason: "",
            placeName: "",
            step: 0
        };
        this.humeurBase = 0;
        this.dataCount = 0;
        this.bestOrWorstReason = {
            place: 0,
            loveLife: 0,
            socialLife: 0,
            weather: 0,
            health: 0,
            hobbies: 0
        };
        this.xtremReason = {
            minReason: "",
            minReasonValue: 0,
            maxReason: "",
            maxReasonValue: 0
        }
        this.moodSkeleton = moodSkeleton();
        this.reasonSkeleton = reasonSkeleton();
        this.placeNameSkeleton = placeNameSkeleton();
        this.initUI();
        this.watchDB(); // need DOM ready to add elements
    }

    initUI() {
        // remove all section before display UI
        if (document.getElementsByTagName("section")[0]) {
            document.getElementsByTagName("section")[0].parentNode.removeChild(document.getElementsByTagName("section")[0])
        }

        // create page skeleton
        //let pageTest = toto(this.formData.email )
        let skeleton = pageSkeleton(this.pageTitle, this.userName, this.formData.email)
        // add page skeleton in body
        this.appBody.insertAdjacentHTML('afterbegin', skeleton)

        $(".button-collapse").sideNav();

        this.loadEventUI();



        //Ajoute/affiche les boutons pour l'humeur
        this.addMoodButtons();
        this.moodButtonsEvent();

        this.reasonButtonsEvent();

        this.displayLastFiveBehaviour()
        this.displayBestAndWorstReasonPerWeek();

        this.readCalcAndDisplayBaseMood();

    }


    //Etape 1 - l'objet userStateData -> recupere l'id de l'event target de mood
    stepOneMoodClicked(event) {
        this.userStateData.mood = event.target.id;
        this.userStateData.step = 1
        this.clearMoodButtons();
        this.addReasonButtons();
    }

    //Etape 2 - l'objet userStatedata recupere l'id de l'event target de reason cette fois
    stepTwoReasonClicked(event) {
        this.userStateData.reason = event.target.id;
        this.userStateData.step = 2
        this.userStateData.placeName = document.getElementById("placeName").value
        this.clearReasonButtons();

        this.storeDataAndDisplayFeely();
    }

    storeDataAndDisplayFeely() {

        let imgId = findImgIdForMoodAndReason(this.userStateData.mood, this.userStateData.reason);

        this.storeUserStateData(this.userStateData);

        this.displayFeely(imgId);

        this.addMoodButtons();


        this.displayLastFiveBehaviour()
        this.displayBestAndWorstReasonPerWeek();
    }

    moodButtonsEvent() {
        let btnMood = document.getElementById("moodButtons")
        btnMood.addEventListener("click", (event) => this.stepOneMoodClicked(event))
    }

    addMoodButtons() {
        document.getElementById("moodButtons").innerHTML = this.moodSkeleton
    }

    clearMoodButtons() {
        document.getElementById("moodButtons").innerHTML = ''
    }

    reasonButtonsEvent() {
        let btnReason = document.getElementById("reasonButtons")
        btnReason.addEventListener("click", (event) => this.stepTwoReasonClicked(event))
    }

    addReasonButtons() {
        document.getElementById("reasonButtons").innerHTML = this.reasonSkeleton
        document.getElementById("placeNameInput").innerHTML = this.placeNameSkeleton
    }

    clearReasonButtons() {
        document.getElementById("reasonButtons").innerHTML = ''
        document.getElementById("placeNameInput").innerHTML = ''
    }



    //Methode pour afficher le Feely par rapport a l'id de l'image
    displayFeely(id) {
        document.getElementById('displayFeely').innerHTML = `<img class="feely" src='./img/${id}.png'>`
    }

    //Stocker les donnes dans la database
    storeUserStateData(userStateData) {
        let objetBase = {
            "mood": userStateData.mood,
            "reason": userStateData.reason,
            date: Date.now()
        }
        if (userStateData.placeName.length > 0) {
            objetBase.placeName = userStateData.placeName
        }

        this.database.create(`comportement/${this.formData.uid}`, objetBase)
    }

    readLastTwentyMood() {
        let ref = this.database.ref(`comportement/${this.formData.uid}`);
        return ref.orderByChild("date").limitToLast(20).once("value")
    }

    readCalcAndDisplayBaseMood() {
        this.readLastTwentyMood().then(reponse => {
            let tab = reponse.val()
            this.humeurBase = 0
            for (let key in tab) {
                if (tab.hasOwnProperty(key)) {
                    let entry = tab[key]

                    this.humeurBase += findMoodNumber(entry.mood)
                }
            }
            if (this.humeurBase === 0) {
                this.displayFeely('neutral');
            }
            if (this.humeurBase >= 1) {
                this.displayFeely('happy');
            }
            if (this.humeurBase <= -1) {
                this.displayFeely('unhappy');
            }
        })
    }

    readLastFiveBehaviour() {
        let ref = this.database.ref(`comportement/${this.formData.uid}`);
        return ref.orderByChild("date").limitToLast(5).once("value")
    }

    displayLastFiveBehaviour() {
        this.readLastFiveBehaviour().then(reponse => {
            let data = reponse.val()
            let lis = "<li class='collection-header'><h5>Dernières Humeurs</h5></li>"
            for (let key in data) {
                if (data.hasOwnProperty(key)) {
                    let comportement = data[key]
                    if (comportement.placeName) {
                        lis += "<li class='collection-item'>" + this.findIconForMood(comportement.mood) + frenchTraduction(comportement.reason) + ": " + comportement.placeName + "</li>"
                    } else {
                        lis += "<li class='collection-item'>" + this.findIconForMood(comportement.mood) + frenchTraduction(comportement.reason) + "</li>"
                    }
                }
            }

            document.getElementById("listFiveLastBehaviour").innerHTML = lis;
        });
    }

    findIconForMood(mood) {
        if (mood === "happy") {
            return '<span class="secondary-content light-green-text text-darken-3"><i class="material-icons">thumb_up</i></span>'
        }
        if (mood === "unhappy") {
            return '<span class="secondary-content indigo-text text-darken-4"><i class="material-icons">thumb_down</i></span>'
        }
    }

    removeLastFiveBehaviour() {
        document.getElementById("listFiveLastBehaviour").innerHTML = "";
    }

    readUserStateData() {
        return this.database.readOnce(`comportement/${this.formData.uid}`);
    }

    readLastMoodData() {
        return this.database.readOnce(`state/${this.formData.uid}/totalMood/value`);
    }

    displayBestAndWorstReasonPerWeek() {
        let oneWeekMilliSec = (7 * 24 * 3600 * 1000)
        //oneWeekMilliSec = 10*60*1000
        let oneWeekAgo = (Date.now() - oneWeekMilliSec)
        this.bestOrWorstReason = {
            place: 0,
            loveLife: 0,
            socialLife: 0,
            weather: 0,
            health: 0,
            hobbies: 0
        };
        this.readUserStateData().then(reponse => {
            let data = reponse.val()
            this.dataCount = 0;
            for (let key in data) {
                if (data.hasOwnProperty(key)) {
                    this.dataCount += 1;
                    let comportement = data[key]
                    if (comportement.date > oneWeekAgo) {
                        let change = findMoodNumber(comportement.mood);
                        this.bestOrWorstReason[comportement.reason] += change;
                    } else {
                        return;
                    }
                }
            }
            console.log(this.dataCount);

            console.log(this.bestOrWorstReason, "On récupère bestOrWorst");
            this.xtremReason = {
                minReason: "",
                minReasonValue: 0,
                maxReason: "",
                maxReasonValue: 0
            }
            for (let key in this.bestOrWorstReason) {
                if (this.bestOrWorstReason.hasOwnProperty(key)) {
                    let stat = this.bestOrWorstReason[key]

                    if (!stat) {
                        continue
                    }
                    //console.log("ITERATION:", stat, key, this.xtremReason);
                    if (stat < this.xtremReason.minReasonValue) {
                        this.xtremReason.minReason = key
                        this.xtremReason.minReasonValue = stat
                    }

                    if (stat > this.xtremReason.maxReasonValue) {
                        this.xtremReason.maxReason = key
                        this.xtremReason.maxReasonValue = stat
                    }
                }

                this.displayXtremeBehaviour();

            }
        });
    }

    displayXtremeBehaviour() {
        let lis = "<li class='collection-header'><h5>Humeurs Prédominantes</h5></li>"
        if (this.xtremReason.maxReason) {
            lis += "<li class='collection-item'><span class='secondary-content light-green-text text-darken-3'><i class='material-icons'>trending_up</i></span>" + frenchTraduction(this.xtremReason.maxReason) + "</li>"
        }
        if (this.xtremReason.minReason) {
            lis += "<li class='collection-item'><span class='secondary-content indigo-text text-darken-4'><i class='material-icons'>trending_down</i></span>" + frenchTraduction(this.xtremReason.minReason) + "</li>"
        }

        document.getElementById("xtremBehaviour").innerHTML = lis;
    }

    removeXtremeBehaviour() {
        document.getElementById("xtremBehaviour").innerHTML = "";
    }

    onGoToLink(event, url) {
        event.preventDefault();
        let win = window.open(url, '_blank');
        win.focus();
    }

    getUserName() {
        // return usernal with first letter Cappitalized
        return this.formData.email.split("@")[0].split(' ').map(c => c.slice(0, 1).toUpperCase() + c.slice(1)).join(' ')
    }

    loadEventUI() {
        let linkSettingForm = document.getElementById('linkSettingForm')
        if (linkSettingForm) {
            linkSettingForm.addEventListener('submit', (event) => this.saveLinkData(event))
        }
        let linkList = document.getElementById('linkList')
        if (linkList) {
            linkList.addEventListener('click', (event) => this.detectClick(event))
        }

        let logout = document.getElementById('logout')
        if (logout) {
            logout.addEventListener('click', _ => this.database.logOut())
        }
    }


    saveLinkData(event) {
        event.preventDefault()
        let dataReady = {}
        let elementsForm = document.getElementById('linkSettingForm').elements
        for (var i = 0; i < elementsForm.length; i++) {
            if (elementsForm[i].value) {
                //console.log(elementsForm[i].name, elementsForm[i].value);
                dataReady[elementsForm[i].name] = elementsForm[i].value
            }
        }
        console.log('dataReady-> ', dataReady);
        // is a update
        if (dataReady.key) {
            // capture item.key
            let updateItemID = dataReady.key;
            // then remove key from dataReady
            delete dataReady.key;
            console.log(updateItemID, dataReady)
            let updatedItem = this.database.update('linksList/' + this.formData.uid, updateItemID, dataReady)
            updatedItem.then((error) => {
                if (error) {
                    console.log('Error update result-> ', error)
                }
            })
        }
        // else if is a new item
        else {
            this.database.create('linksList/' + this.formData.uid, dataReady)
                .then(
                    result => {
                        console.log('success on added-> ', result.key);
                    },
                    error => {
                        console.log('error on added');
                    }
                )
        }

    }

    watchDB() {
        // defin DB ref()
        let linksListDB = this.database.read('linksList/' + this.formData.uid)

        // watch all child_added
        linksListDB.on('child_added',
            (response) => {
                console.log('onChild_added: item-> ', response.val());
                this.displayLinkinAside(response)
            },
            (error) => {
                console.log('error read-> ', error);
            }
        )

        // watch all child_changed
        linksListDB.on('child_changed',
            (response) => {
                console.log('onChild_changed: item-> ', response.val());
                this.displayLinkinAside(response)
            },
            (error) => {
                console.log('error read-> ', error);
            }
        )
    }

    displayLinkinAside(item) {
        let linkList = document.getElementById('linkList')
        if (linkList) {
            // remove default text on empty linkList
            if (document.getElementById("noLinks")) {
                document.getElementById("noLinks").parentNode.removeChild(document.getElementById("noLinks"))
            }
            // test if item already exist
            if (document.getElementById(item.key)) {
                document.getElementById(item.key).innerHTML = `
          <p>
            ${item.val().title}: ${item.val().url}
            <button>edit</button>
            <button class="dell">dell</button>
          </p>
        `;
            }
            // else is a new item element
            else {
                let itemSkeleton = `
          <div id="${item.key}">
            <p>
              ${item.val().title}: ${item.val().url}
              <button>edit</button>
              <button class="dell">dell</button>
            </p>
          </div>
        `
                linkList.insertAdjacentHTML('afterbegin', itemSkeleton)
            }

        }
    }

    detectClick(event) {
        event.preventDefault();
        // if click is not on a btn
        if (event.target.nodeName != 'BUTTON') {
            return;
        }
        // if is click on dell btn (check if element have class name)
        if (event.target.className.indexOf('dell') > -1) {
            this.dellItem(event)
            return;
        }
        // else is click on edit btn
        this.loadDataInForm(event)
    }

    loadDataInForm(event) {

        let itemID = event.target.parentElement.parentElement.id;
        let itemData = this.database.read('linksList/' + this.formData.uid + '/' + itemID)
        itemData.once('value').then((item) => {
            if (item.val() === null) {
                return;
            }
            console.log('item finded-> ', item.val())
            // petit cadeau: document.querySelector()
            // à la jQuery style ;-)
            // doc => https://developer.mozilla.org/fr/docs/Web/API/Document/querySelector
            document.querySelector("input[name='key']").value = item.key
            document.querySelector("input[name='title']").value = item.val().title
            document.querySelector("input[name='url']").value = item.val().url
        })
    }

    dellItem(event) {
        console.log('delete item')
        let itemID = event.target.parentElement.parentElement.id;
        let deleteItem = this.database.delete('linksList/' + this.formData.uid, itemID)
        deleteItem.then((error) => {
            if (error) {
                console.log('Error update result-> ', error)
            } else {
                // remove item from list with JS
                if (document.getElementById(itemID)) {
                    document.getElementById(itemID).parentNode.removeChild(document.getElementById(itemID))
                }
            }
        })
    }
}
