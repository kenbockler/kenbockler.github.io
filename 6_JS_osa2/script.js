(function() {
    "use strict";

    //clock

    document.addEventListener("DOMContentLoaded", function() {

        let c = document.getElementById("clock");

        //setTimeout(updateClock, 2000);
        setInterval(updateClock, 1000);

        function updateClock() {
            let date = new Date();
            let h = date.getHours();
            let m = date.getMinutes();
            let s = date.getSeconds();

            // Teisendame 24-tunni formaadi 12-tunni formaadiks ja määrame AM või PM
            let ampm = h >= 12 ? 'PM' : 'AM';
            h = h % 12;
            h = h ? h : 12; // 12-tunni formaadis on 0 muudetud 12-ks

            // Kui tunnid, minutid või sekundid on ühekohalised, lisame ette nulli
            h = h < 10 ? '0' + h : h;
            m = m < 10 ? '0' + m : m;
            s = s < 10 ? '0' + s : s;

            let timeString = h + ':' + m + ':' + s + ' ' + ampm;
            c.innerHTML = timeString;
        };

    });

    // forms

    document.getElementById("form").addEventListener("submit", estimateDelivery);

    let e = document.getElementById("delivery");
    e.innerHTML = "0,00 &euro;";

    function estimateDelivery(event) {
        event.preventDefault();

        let isValid = true;
        let price = 0;
        let linn = document.getElementById("linn");
        let e = document.getElementById("delivery");

        let fname = document.getElementById("fname").value;
        let lname = document.getElementById("lname").value;

        let radios = document.getElementsByName('deliveryMethod');
        let radioSelected = false;

        // Kontrollime, kas eesnimi ja perekonnanimi sisaldavad numbreid
        let regex = /\d/;
        if (regex.test(fname) || regex.test(lname)) {
            alert("Nimed ei tohi sisaldada numbreid");
            isValid = false;
        }

        // Kontrollime, kas linn on valitud
        if (linn.value === "") {
            alert("Palun valige linn nimekirjast");
            linn.focus();
            isValid = false;
        }

        // Kontrollime raadionuppude valikuid
        for (let i = 0; i < radios.length; i++) {
            if (radios[i].checked) {
                radioSelected = true;
                break;
            }
        }

        if (!radioSelected) {
            alert("Palun valige üks tarneviis.");
            isValid = false;
        }

        // Lõpetame siin, kui vorm ei ole korrektne (hoiame arvutuste pealt aega kokku)
        if (!isValid) {
            return;
        }

        // Kontrollime checkbox valikuid
        if (document.getElementById("v1").checked) {
            price += 5; // kingitus
        }
        if (document.getElementById("v2").checked) {
            price += 1; // kontaktivaba tarne
        }

        // Lisame linna hinna
        if (linn.value === "tln") {
            price += 0;
        } else if (linn.value === "trt" || linn.value === "nrv") {
            price += 2.5;
        } else if (linn.value === "prn") {
            price += 3;
        }

        e.innerHTML = `${price.toFixed(2)} &euro;`;
        console.log("Tarne hind on arvutatud");
    }



})();

// map
let mapAPIKey = "AtNMrKaCVuc8-TBqYJJcFqMJ0Xmt4TTZsqoYuopgx-x3PDIpA3fTZMOso2tWePW2";

let map;

function GetMap() {
    "use strict";

    let tartuPoint = new Microsoft.Maps.Location(58.37104, 26.71992);
    let elvaPoint = new Microsoft.Maps.Location(58.225107, 26.412697);

    map = new Microsoft.Maps.Map("#map", {
        credentials: mapAPIKey,
        zoom: 8,
        mapTypeId: Microsoft.Maps.MapTypeId.road,
        disablePanning: false,
        showMapTypeSelector: false,
        showScalebar: false
    });

    let tartuInfobox = new Microsoft.Maps.Infobox(tartuPoint, {
        title: 'Tartu',
        description: 'Siin on mõned põnevad faktid Tartu kohta.',
        visible: false
    });

    let elvaInfobox = new Microsoft.Maps.Infobox(elvaPoint, {
        title: 'Elva',
        description: 'Suvitus- ja Männilinn',
        visible: false
    });

    tartuInfobox.setMap(map);
    elvaInfobox.setMap(map);

    let tartuMarker = new Microsoft.Maps.Pushpin(tartuPoint, {});
    let elvaMarker = new Microsoft.Maps.Pushpin(elvaPoint, {});

    // hover style Tartu
    Microsoft.Maps.Events.addHandler(tartuMarker, 'mouseover', function () {
        tartuMarker.setOptions({ color: 'red' });
    });

    Microsoft.Maps.Events.addHandler(tartuMarker, 'mouseout', function () {
        tartuMarker.setOptions({ color: 'purple' });
    });

    // hover style Elva
    Microsoft.Maps.Events.addHandler(elvaMarker, 'mouseover', function () {
        elvaMarker.setOptions({ color: 'green' });
    });

    Microsoft.Maps.Events.addHandler(elvaMarker, 'mouseout', function () {
        elvaMarker.setOptions({ color: 'purple' });
    });

    // click event Infobox
    Microsoft.Maps.Events.addHandler(tartuMarker, 'click', function () {
        tartuInfobox.setOptions({ visible: true });
        elvaInfobox.setOptions({ visible: false });
    });

    Microsoft.Maps.Events.addHandler(elvaMarker, 'click', function () {
        elvaInfobox.setOptions({ visible: true });
        tartuInfobox.setOptions({ visible: false });
    });

    // Sulgme infoboxi kui vajutada mujale
    Microsoft.Maps.Events.addHandler(map, 'click', function (e) {
        if (e.targetType === 'map') {
            tartuInfobox.setOptions({ visible: false });
            elvaInfobox.setOptions({ visible: false });
        }
    });

    map.entities.push(tartuMarker);
    map.entities.push(elvaMarker);

    let locations = [tartuPoint, elvaPoint];
    let bounds = Microsoft.Maps.LocationRect.fromLocations(locations);
    map.setView({ bounds: bounds });
}