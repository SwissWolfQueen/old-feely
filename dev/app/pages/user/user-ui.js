export function moodSkeleton() {
    return `
      <button id="happy" class="waves-effect waves-light btn light-green darken-3">Content</button>
      <button id="unhappy" class="waves-effect waves-light btn light-green darken-3">Pas Content</button>
      `;
}

export function reasonSkeleton() {
    return `
      <button id="place" class="waves-effect waves-light btn light-green darken-3">Lieu</button>
      <button id="loveLife" class="waves-effect waves-light btn light-green darken-3">Amour</button>
      <button id="socialLife" class="waves-effect waves-light btn light-green darken-3">Vie Sociale</button>
      <button id="weather" class="waves-effect waves-light btn light-green darken-3">Météo</button>
      <button id="health" class="waves-effect waves-light btn light-green darken-3">Santé</button>
      <button id="hobbies" class="waves-effect waves-light btn light-green darken-3">Loisirs</button>
      `;
}

export function placeNameSkeleton() {
    return `
  <input type="text" id="placeName" placeholder="Information complémentaire: nom de la personne, nom du lieu, etc."/>
  `;
}

export function pageSkeleton(pageTitle, userName, email) {
    return `
      <section>
      <main>
      <div class="row">

         <div class="col s9">

           <div class="col s12" id="ButtonBar">

             <div id="moodButtons"></div>
             <div id="reasonButtons"></div>
             <div id="placeNameInput"></div>

             </div>

             <div class="col s12" id="ButtonBar">

             <div id="displayFeely"></div>

           </div>
         </div>

         <div class="col s3">
           <ul class="collection with-header" id="listFiveLastBehaviour"></ul>
           </br>
           <ul class="collection with-header" id="xtremBehaviour"></ul>
         </div>
       </div>

       </main>


        <ul id="slide-out" class="side-nav">
          <li>
            <aside class="container left-align">
              <div>

                <div>
                  <p class="flow-text">
                    <b>${email}</b> est connecté. Voulez-vous vous <button class="waves-effect waves-light btn light-green darken-3" id="logout">déconnecter?</button>
                  </p>
                  <img width="600px" src="./img/unhappy.png">
                </div>
              </div>
            </aside>
          </li>
        </ul>

        <footer>
          <div class="row">

            <div class="col s12 left-align">
              <a href="#" data-activates="slide-out" class="button-collapse"><i class="material-icons">menu</i></a>
            </div>

          </div>

        </footer>

      </section>
    `;
}

export function findMoodNumber(mood) {
    if (mood == 'happy') {
        return 1
    }
    if (mood == 'unhappy') {
        return -1
    }
}

export function findImgIdForMoodAndReason(mood, reason) {
    if (mood == 'happy' && reason == 'loveLife') {
        return 'inLove'
    }
    if (mood == 'unhappy' && reason == 'loveLife') {
        return 'sad'
    }
    if (mood == 'happy' && reason == 'socialLife') {
        return 'excited'
    }
    if (mood == 'unhappy' && reason == 'socialLife') {
        return 'depressed'
    }
    if (mood == 'happy' && reason == 'health') {
        return 'happy'
    }
    if (mood == 'unhappy' && reason == 'health') {
        return 'sick'
    }
    if (mood == 'happy' && reason == 'weather') {
        return 'joyfull'
    }
    if (mood == 'unhappy' && reason == 'weather') {
        return 'pissed'
    }
    if (mood == 'happy' && reason == 'hobbies') {
        return 'excited'
    }
    if (mood == 'unhappy' && reason == 'hobbies') {
        return 'annoyed'
    }
    if (mood == 'happy' && reason == 'place') {
        return 'happy'
    }
    if (mood == 'unhappy' && reason == 'place') {
        return 'unhappy'
    }
}

export function frenchTraduction(reason) {
    if (reason == 'loveLife') {
        return "Amour"
    }
    if (reason == 'socialLife') {
        return "Vie Sociale"
    }
    if (reason == 'health') {
        return "Santé"
    }
    if (reason == 'weather') {
        return "Météo"
    }
    if (reason == 'hobbies') {
        return "Loisirs"
    }
    if (reason == 'place') {
        return "Lieu"
    }
}
