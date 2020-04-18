$(window).on('load', function() {
    navigator.geolocation.getCurrentPosition(getPosition);
    var map = L.map('map').setView([sessionStorage.getItem('lat'), sessionStorage.getItem('long'), ], 16);

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

    L.easyButton('<img src="/images/center.jpg">', function(btn, map) {
        map.setView([sessionStorage.getItem('lat'), sessionStorage.getItem('long')], 16);
    }).addTo(map);

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

            for (i in res) {
                console.log(res[i]._id);
                L.marker([res[i].Localizacao.coordinates[1], res[i].Localizacao.coordinates[0]], { id: res[i]._id }).addTo(map).on('click', markerClick);


            }
        }
    });




});

function getPosition(position) {
    sessionStorage.setItem("lat", position.coords.latitude);
    sessionStorage.setItem("long", position.coords.longitude);


}

function markerClick() {
    console.log(this.options.id);
    document.getElementById("azulejobox").style.backgroundColor = "white";


    $.ajax({
        url: "api/azulejo/" + this.options.id,
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

            document.getElementById("nome").innerHTML = res[0].Nome;
            document.getElementById("ano").innerHTML = res[0].Ano;
            document.getElementById("condicao").innerHTML = res[0].Condicao.toLowerCase();
            document.getElementById("info").innerHTML = res[0].Info;



        }

    });


}