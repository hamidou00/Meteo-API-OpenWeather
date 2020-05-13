//const URL = "city.list.json";
//var URL = "http://api.openweathermap.org/data/2.5/weather?apikey=1665924cc5581d013289544c37050ac7&q=";

//1665924cc5581d013289544c37050ac7 >> notre API KEY de l'API opepnweater
const buttonRecherhcer = document.querySelector("button");
const input = document.querySelector("input");
const main = document.querySelector("main");

buttonRecherhcer.onclick = () => { // une fois que l'on clique sur le bouton rechercher
    //setURL;
    axios
    .get(setURL()) //fonction set URL executé en callback qui configure l'URL pour chaque pays entré dans le champs texte
    .then((res) => {
        display(res.data)
    })
    .catch((err) => {
        alert("cette ville n'existe pas!!")
        console.log(err)
    });
}

function axiosSetUp(URL){
    
}

function setURL(){
    var value = input.value;
    //voici l'URL modèle avec differents paramètres : 
    //units > en metric pour convertir la temperature en Celsius
    //apikey > notre clé API pour avoir accès aux données de l'API
    //lang > définir la langue des proprietées meteorologiques du pays selectionné
    //q > le pays recherché

    // ici à la fin de notre lien d'accès nous ajoutons la value du champs texte (qui est un pays) à la fin du lien juste après le
    // paramètre 'q'.
    var URL = "http://api.openweathermap.org/data/2.5/weather?apikey=1665924cc5581d013289544c37050ac7&units=metric&lang=fr&q=" + value;
    return URL; // Nous retournons ensuite l'URL configuré
}


function display(city){
    console.log(">> city - ",city)
    // ----------------------------------------------------------------------------- AFFICHAGE INFORMATIONS VILLE

    const divInformations = document.querySelector("#informations"); // La div qui contiendra toute es informations concercant la ville
    const monthElement = main.querySelector("#month"); // L'element <p> qui contiendra le Mois-20XX
    // >> divInformations.innerHTML
    // Un Math.round() pour arrondir la temperature en Celsius
    // L'icone pour l'aperçu
    divInformations.innerHTML = `
    <h2 id="cityName">${city.name}</h2>
    
    <div class="overview">
        <div class="temp_block">
            <p id="temp_feels_like">${Math.round(city.main.feels_like)}°C
            <img src="img/${city.weather[0].icon}.png" class="icon">
            </p>
            <p>${city.weather[0].description}</p>
            
        </div>
        
        <ul class="details">
            <li>Pays : ${city.sys.country}</li>
            <li>Vent : ${city.wind.speed}m/s</li>
            <li>Humidité : ${city.main.humidity}</li>
        </ul>
    </div">
    `;
    //var cityDate = new Date();


    // Nous souhaitions afficher le mois et l'année actuelle
    // Nous créeons un nouveau objet Date (qui correspond à la date d'aujourd'hui s'il n'a pas de parametres)
    // On execute la fonction months qui contient un tableau d'objets mois et le retourne -> month()
    // Chaque objet mois a comme attributs le nom du mois et un indice
    let date = new Date();
    // Nous appliquons un find au tableau month qui dès qu'il trouve le mois correspondant au mois d'aujourd'hui, il le retourne
    // Car date.getMonth() retourne un entier de 0 à 11 (donc 12 mois) et non le nom du mois
    let month = months().find((month) => date.getMonth() == month.indice)
    // Ensuite on injecte dans l'element monthElement le nom du mois et l'année actuel.
    monthElement.innerHTML = `${month.monthName} - ${date.getFullYear()}`;

    // ----------------------------------------------------------------------------- CONFIGURATION URL PREVISION
    // Ici l'URL est similaire à celle pour recuperer les données d'une ville, met on utilisie cette fois-ci le forecoast comme parametre
    const URL = "http://api.openweathermap.org/data/2.5/forecast?appid=1665924cc5581d013289544c37050ac7&lang=fr&units=metric&q=" + city.name;
    var tab;

    // Un Autre Axios pour recuperer les données prévisionnelles sur 5 jours de la ville qui nous interesse
    axios
    .get(URL)
    .then((prevision) => {
        // Ici nous executons d'abord la fontions previon5Days afin d'avoir cinq jours differents et pas toutes les heures
        // Ensuite la fonction displPresion() est executé.
        displayPrevision(prevision5Days(prevision.data))
    })
    .catch((err) => {
        console.log(err)
    });
}


function prevision5Days(listPrevision){
    // Ici nous avons la liste des prévisions du pays selectionnée sur 5 jours.
    // C'est un tableau qui contient des données meteorologiques de la ville, toutes les 3h

    //Nous avons appliqué un filtre au tableau afin qu'il nous donne les prévision des 5 jours suivents, et non toute les 3h suivantes.
    //Ce qui correspond à l'heure de minuit.
    return listPrevision.list.filter(prev => prev.dt_txt.includes("00:00:00"));
}

function displayPrevision(listPrevision){
    const sectionPrevision = main.querySelector("#prevision"); // L'element HTML qui contiendra toutes les informations concernant les previsions
    sectionPrevision.innerHTML = "";
    console.log(">> previsions - ", listPrevision)
    //console.log(">>>",listPrevision)

    //On parcours
    listPrevision.forEach((city, index) => {

        console.log(city.dt_txt)
        // Nous récuperons la date de la prevision qui est comme ceci : 20XX-XX-XX 00:00:00.
        // Pour l'affecter à la variable cityDate en lui mettant un slice pour qu'il prenne seulement les 10
        // premiers caractères de la chaîne. Ce qui donne ceci : 20XX-XX-XX (sans l'heure)
        let cityDate = city.dt_txt.slice(0,10);
        //console.log(cityDate)
        // On créer un nouvel objet Date en lui mettant en parametre la date que l'on a reformaté
        let date = new Date(cityDate);
        // Ensuite on procède de la même façon qu'avec les jours.
        let jour = days().find((day) => date.getDay() == day.indice)

        //dateTest.getDay()
        //console.log(">>>>>",jour.dayName, "   getDay() >>>> ", dateTest.getDay());      
        //console.log(cityDate);
        //console.log(dateTest.toLocaleString("fr-FR"));
        sectionPrevision.innerHTML += `
        <article id="prevJour${index}" class="joursPrevisions">
            <h3>${jour.dayName}</h3>
                <img src="http://openweathermap.org/img/wn/${city.weather[0].icon}.png">
            <span>${Math.round(city.main.feels_like)}°C</span>
            
        </article>
        `;
    });
}






// Axios par defaut avec comme parametre dans l'url du JSON > Aulnay
axios
    .get("http://api.openweathermap.org/data/2.5/weather?apikey=1665924cc5581d013289544c37050ac7&units=metric&lang=fr&q=Aulnay")
    .then((res) => {
        display(res.data)
    })
    .catch((err) => {
        alert("cette ville n'existe pas!!")
        console.log(err)
    });


function months(month){
    return [
        {monthName :"Jan", indice: 0},
        {monthName :"Fev", indice: 1},
        {monthName :"Mar", indice: 2},
        {monthName :"Avr", indice: 3},
        {monthName :"Mai", indice: 4},
        {monthName :"Jui", indice: 5},
        {monthName :"Juil", indice: 6},
        {monthName :"Aou", indice: 7},
        {monthName :"Sep", indice: 8},
        {monthName :"Oct", indice: 9},
        {monthName :"Nov", indice: 10},
        {monthName :"Dec", indice: 11}
    ];
}

function days(day){
    return [
        {dayName:"Lun", indice: 1},
        {dayName:"Mar", indice: 2},
        {dayName:"Mer", indice: 3},
        {dayName:"Jeu", indice: 4},
        {dayName:"Ven", indice: 5},
        {dayName:"Sam", indice: 6},
        {dayName:"Dim", indice: 0}
    ];
}










// function display(cities){
//     var frCities = [];
    
//     cities.forEach(city => {
//         if (city.country == "FR")
//             frCities.push(city);
//     });

//     console.log(frCities);
//     var cityVoulu;
//     frCities.forEach(city => {
//         if (city.name = "Paris")
//             cityVoulu = city;
//     })

//     console.log(cityVoulu);
// }