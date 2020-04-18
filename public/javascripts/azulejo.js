var map;
var cont = 0;
var control;
$(window).on('load', function() {
    map = L.map('map2');
    centrarMapa(sessionStorage.getItem('lat'), sessionStorage.getItem('long'));
    var listagem = document.getElementById("listAzul");

    $.ajax({

        url: "api/azulejo",
        method: "get",
        // sending in json
        contentType: "application/json",
        // receiving in json
        dataType: "json",
        success: function(res, status, jqXHR) {
            if (res.err) {
                console.log(JSON.stringify(res));
                return;
            }
            var html = '';
            for (i in res) {
                var x = res[i].Condicao.toLowerCase();
                L.marker([res[i].Localizacao.coordinates[1], res[i].Localizacao.coordinates[0]], { id: res[i]._id }).addTo(map);
                html += "<button class='botao botao'" + i + " onClick ='centrarMapa(" + res[i].Localizacao.coordinates[1] + "," + res[i].Localizacao.coordinates[0] + ")'>" + res[i].Nome + " (" + x + ") " + "</button>";

            }
            listagem.innerHTML = html;
        }
    })

    navigator.geolocation.getCurrentPosition(getPosition);


    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    L.circle([sessionStorage.getItem('lat'), sessionStorage.getItem('long'), ], {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.3,
            radius: 8
        }).addTo(map)
        .bindPopup('Está aqui');

    L.easyButton('<img src="/images/center.jpg">', function(btn, mapSubmeter) {
        map.setView([sessionStorage.getItem('lat'), sessionStorage.getItem('long'), ], 16);
    }).addTo(map);




});

function getPosition(position) {
    sessionStorage.setItem("lat", position.coords.latitude);
    sessionStorage.setItem("long", position.coords.longitude);
}



function centrarMapa(lat, lon) {

    map.setView([lat, lon, ], 20);
    cont++;
    if (cont >= 3) {
        control.spliceWaypoints(0, 2);

        $(".leaflet-bar").remove();
    }

    if (cont >= 2) {
        L.Routing.control
        control = L.Routing.control({
            waypoints: [
                L.latLng(sessionStorage.getItem('lat'), sessionStorage.getItem('long')),
                L.latLng(lat, lon)
            ],
        }).addTo(map);
        console.log(control)
        L.Routing.errorControl(control).addTo(map);

    }



}