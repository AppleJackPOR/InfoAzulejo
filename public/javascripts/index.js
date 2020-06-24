$(window).on('load', function() {

    if (sessionStorage.getItem("utilizador") != null) {
        var inicial = document.getElementById("form");
        var logged = document.getElementById("form1");
        inicial.style.display = "none";
        logged.style.display = "block";
        var html = "<p>" + sessionStorage.getItem("utilizador") + "</p>";
        document.getElementById("dados").innerHTML += html;
    }

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

var slideIndex = 1;

function plusDivs(n) {
    showDivs(slideIndex += n);
}

function showDivs(n) {
    var i;
    var x = document.getElementsByClassName("mySlides");
    if (n > x.length) { slideIndex = 1 }
    if (n < 1) { slideIndex = x.length }
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    x[slideIndex - 1].style.display = "block";
    x[slideIndex - 1].style.height = "220px";
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
            if(res.nrImages==0)
            {
                document.getElementById("slideshow").innerHTML ="";
            }
           if(res.nrImages!=0)
           {
			document.getElementById("slideshow").innerHTML ="";
            for (var i = 0; i < res.nrImages; i++) {
                var html = '<img class="mySlides" src="https://azulejos.b-cdn.net/' + res._id + '/' + i + '.jpg" style="width:100%">'
                document.getElementById("slideshow").innerHTML += html;
            }
        
            document.getElementById("slideshow").innerHTML += '<button class="w3-button w3-black w3-display-left" onclick="plusDivs(-1)">&#10094;</button>'
            document.getElementById("slideshow").innerHTML += '<button class="w3-button w3-black w3-display-right" onclick="plusDivs(1)">&#10095;</button>'
            showDivs(slideIndex);
        }
            document.getElementById("nome").innerHTML = res.Nome;
            document.getElementById("ano").innerHTML = res.Ano;
            document.getElementById("condicao").innerHTML = res.Condicao.toLowerCase();
            document.getElementById("info").innerHTML = res.Info;

        }

    });


}

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
            console.log(res);
            sessionStorage.setItem("admin",res[0].userType);
            sessionStorage.setItem('utilizador', username);
            console.log(sessionStorage.getItem('utilizador'));
            var inicial = document.getElementById("form");
            var logged = document.getElementById("form1");
            inicial.style.display = "none";
            logged.style.display = "block";
            var html = "<p>" + sessionStorage.getItem("utilizador") + "</p>";
            document.getElementById("dados").innerHTML += html;
            document.getElementById("password").value = "";
            location.reload();
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