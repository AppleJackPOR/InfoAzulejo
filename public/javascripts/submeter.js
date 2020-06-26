$(window).on('load', function() {

    var body = {
        "sessao": {},
        "azulejos": []
    }

    if (sessionStorage.getItem("utilizador") != null) {
        var inicial = document.getElementById("form");
        var logged = document.getElementById("form1");
        inicial.style.display = "none";
        logged.style.display = "block";
        var html = "<p id='labelUsername'>" + sessionStorage.getItem("utilizador") + "</p>";
        document.getElementById("dados").innerHTML += html;
    }

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

    var theMarker;
    var imageInBase64;


    searchControl.on('results', function(data) {

        if (theMarker != undefined) {
            map.removeLayer(theMarker);
        };

        for (var i = data.results.length - 1; i >= 0; i--) {
            lat = data.results[i].latlng.lat;
            lon = data.results[i].latlng.lng;
            theMarker = L.marker([wlat, lon]).addTo(map);
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
            theMarker = L.marker(result.latlng);
            theMarker.addTo(map);
            marker = theMarker._latlng;
            console.log(theMarker._latlng);
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

    $("#submeter").click(function() {
        submeterAzulejo();
    });



    function verImagem(event) {

        var reader = new FileReader();
        reader.onload = function() {
                var imagem = document.getElementById("blah");
                imagem.src = reader.result;

            }
            //reader.result.split(',')[1];
        reader.readAsDataURL(event.target.files[0]);

    }

    function getPosition(position) {
        sessionStorage.setItem("lat", position.coords.latitude);
        sessionStorage.setItem("long", position.coords.longitude);
    }



    function submeterAzulejo() {

        var ObjectId = (m = Math, d = Date, h = 16, s = s => m.floor(s).toString(h)) =>
            s(d.now() / 1000) + ' '.repeat(h).replace(/./g, () => s(m.random() * h));

        var sessionID = ObjectId();
        var azulejoID = ObjectId();

        var sessao = {
            "id": sessionID,
            "name": document.getElementById("nomeAzulejo").value,
            "date": "",
            "state": "SUBMETIDA",
            "idAutor": sessionStorage.getItem('id'),
            "tiles": [{
                "_id": azulejoID,
                "Nome": document.getElementById("nomeAzulejo").value
            }]
        }

        var azulejo = {
            "id": azulejoID,
            "name": document.getElementById("nomeAzulejo").value,
            "info": document.getElementById("inputDesc").value,
            "year": document.getElementById("anoAzulejo").value,
            "condition": document.getElementById("condicao").value,
            "location": [
                theMarker._latlng.lng,
                theMarker._latlng.lat
            ],
            "session": sessionID,
            "nrImages": [imagem.split(',')[1]]
        }

        body.sessao = sessao;
        body.azulejos.push(azulejo)

        console.log(body);

        $.ajax({
            url: "/api/submeter/inserirAzulejo",
            method: "post",
            contentType: "application/json",
            data: JSON.stringify(
                body
            ),
            success: function(res, status) {
            }

            ,
            error: function() { alert(JSON.stringify('error')); }

        });
        alert("Azulejo Submetido");
        window.location.href = '/';
    };


    function readFile() {

        if (this.files && this.files[0]) {

            var FR = new FileReader();

            FR.addEventListener("load", function(e) {
                document.getElementById("blah").src = e.target.result;
                imagem = e.target.result;
            });

            FR.readAsDataURL(this.files[0]);
        }

    }

    document.getElementById("btnEscolherImagem").addEventListener("change", readFile);



});

var tentativas = 3;

function validate() {
    console.log("carregaste");
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    $.ajax({
        url: "/api/user/login",
        method: "post",
        contentType: "application/json",
        data: JSON.stringify({
            nome: username,
            password: password,
        }),
        success: function(res, status) {
            console.log(res)
            console.log(username);
            sessionStorage.setItem('utilizador', username);
            sessionStorage.setItem('id', res[0]._id);
            console.log(sessionStorage.getItem('utilizador'));
            var inicial = document.getElementById("form");
            var logged = document.getElementById("form1");
            inicial.style.display = "none";
            logged.style.display = "block";
            var html = "<p>" + sessionStorage.getItem("utilizador") + "</p>";
            document.getElementById("dados").innerHTML += html;
            document.getElementById("password").value = "";
            //location.reload();
        },
        error: function() {
            document.getElementById("password").value = "";
            tentativas--;
            alert("Dados errados, tem " + tentativas + " tentativas");
            if (tentativas == 0) {
                alert("Número limite de tentativas atingido")
                document.getElementById("entrar").disabled = true;
            }
        }
    });

}

//fazer logout
function logout() {
    var inicial = document.getElementById("form");
    var logged = document.getElementById("form1");
    inicial.style.display = "block";
    logged.style.display = "none";
    document.getElementById("dados").innerHTML = "";
    sessionStorage.removeItem("utilizador");
    sessionStorage.removeItem("admin");
    location.reload();


}