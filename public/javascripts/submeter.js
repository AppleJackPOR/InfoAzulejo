$(window).on('load', function() {
    navigator.geolocation.getCurrentPosition(getPosition);
    var map = L.map('mapSubmeter').setView([sessionStorage.getItem('lat'), sessionStorage.getItem('long'), ], 4);
    var geocodeService = L.esri.Geocoding.geocodeService();
    var searchControl = L.esri.Geocoding.geosearch().addTo(map);

    var results = new L.LayerGroup().addTo(map);
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

    var theMarker = {};


    searchControl.on('results', function(data) {

        if (theMarker != undefined) {
            map.removeLayer(theMarker);
        };

        for (var i = data.results.length - 1; i >= 0; i--) {
            lat = data.results[i].latlng.lat;
            lon = data.results[i].latlng.lng;
            theMarker = L.marker([lat, lon]).addTo(map);
        }
        document.getElementById("moradaAzulejo").value = data.results[0].text;
    });


    /*
    ANTIGO 

    map.on('click', function(e) {
        lat = e.latlng.lat;
        lon = e.latlng.lng;

        if (theMarker != undefined) {
            map.removeLayer(theMarker);
        };
        coords = [lat, lon]
            //Add a marker to show where you clicked.
        theMarker = L.marker(coords).addTo(map);

    });

*/

    map.on('click', function(e) {
        geocodeService.reverse().latlng(e.latlng).run(function(error, result) {
            if (error) {
                return;
            }
            if (theMarker != undefined) {
                map.removeLayer(theMarker);
            };
            theMarker = L.marker(result.latlng).addTo(map);
            console.log(result.address.Match_addr);
            document.getElementById("moradaAzulejo").value = result.address.Match_addr;
        });
    });



    var opcao = document.getElementById("condicao");
    $.ajax({
        url: "/api/submeter",
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
                var x = res[i].nome.toLowerCase();
                html += "<option value=" + x + ">" + res[i].nome + "</option>";
            }
            opcao.innerHTML = html;
        }
    })

});

function verImagem(event) {

    var reader = new FileReader();
    reader.onload = function() {
        var imagem = document.getElementById("blah");
        imagem.src = reader.result;
    }

    reader.readAsDataURL(event.target.files[0]);

}

function getPosition(position) {
    sessionStorage.setItem("lat", position.coords.latitude);
    sessionStorage.setItem("long", position.coords.longitude);
}

function submeterAzulejo() {
    var nome = document.getElementById("nomeAzulejo").value;
    var moradaAzulejo = document.getElementById("moradaAzulejo").value;
    /* var condicao = document.getElementById("condicao").value;  mudar esta linha*/
    var anoAzulejo = document.getElementById("anoAzulejo").value;
    var inputDesc = document.getElementById("inputDesc").value;

    $.ajax({
        url: "/api/submeter/inserirAzulejo",
        method: "post",
        contentType: "application/json",
        data: JSON.stringify({
            nome: nome,
            moradaAzulejo: moradaAzulejo,
            anoAzulejo: anoAzulejo,
            inputDesc: inputDesc
        }),
        success: function(res, status) {
            window.location.href = '/';
        }

        ,
        error: function() { alert(JSON.stringify('error')); }

    });

};