var map;
var cont = 0;
var control;
if(sessionStorage.getItem("admin")==null)
{
$(window).on('load', function() {

    if (sessionStorage.getItem("utilizador") != null) {
        var inicial = document.getElementById("form");
        var logged = document.getElementById("form1");
        inicial.style.display = "none";
        logged.style.display = "block";
        var html = "<p id='labelUsername'>" + sessionStorage.getItem("utilizador") + "</p>";
        document.getElementById("dados").innerHTML += html;
    }

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
               if(res[i].Estado=="Aceite")
               {
                var x = res[i].Condicao.toLowerCase();
                L.marker([res[i].Localizacao.coordinates[1], res[i].Localizacao.coordinates[0]], { id: res[i]._id }).addTo(map);
                html += "<button class='botao1 botao' onClick ='centrarMapa(" + res[i].Localizacao.coordinates[1] + "," + res[i].Localizacao.coordinates[0] + ")'>" + res[i].Nome + " (" + x + ") " + "</button>";
            }
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

    $('#search').on('keyup', function (e) {
        {
            if(document.getElementById("search").value=="")
            {
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
                        if(res[i].Estado=="Aceite")
               {
                        var x = res[i].Condicao.toLowerCase();
                        L.marker([res[i].Localizacao.coordinates[1], res[i].Localizacao.coordinates[0]], { id: res[i]._id }).addTo(map);
                        html += "<button class='botao botao' onClick ='centrarMapa(" + res[i].Localizacao.coordinates[1] + "," + res[i].Localizacao.coordinates[0] + ")'>" + res[i].Nome + " (" + x + ") " + "</button>";
                    }
                }
                    listagem.innerHTML = html;
                }
            })
            }
            else
            {
            var listagem = document.getElementById("listAzul");
            $.ajax({
                url: "api/azulejo/like/"+document.getElementById("search").value,
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
                        if(res[i].Estado=="Aceite")
               {
                        var x = res[i].Condicao.toLowerCase();
                        L.marker([res[i].Localizacao.coordinates[1], res[i].Localizacao.coordinates[0]], { id: res[i]._id }).addTo(map);
                        html += "<button class='botao botao' onClick ='centrarMapa(" + res[i].Localizacao.coordinates[1] + "," + res[i].Localizacao.coordinates[0] + ")'>" + res[i].Nome + " (" + x + ") " + "</button>";
                    }}
                    listagem.innerHTML = html;
                }
            })
        }
    }
})
})
   




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
    if(sessionStorage.getItem("admin")!="Admin")
    {
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
            sessionStorage.setItem('utilizador', username);
            console.log(sessionStorage.getItem('utilizador'));
            var inicial = document.getElementById("form");
            var logged = document.getElementById("form1");
            inicial.style.display = "none";
            logged.style.display = "block";
            var html = "<p>" + sessionStorage.getItem("utilizador") + "</p>";
            document.getElementById("dados").innerHTML += html;
            document.getElementById("password").value = "";
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
}


function abrir(id)
{
    sessionStorage.setItem("AzulejoEscolhido",id);
    window.location.href="avaliar";
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

}
else
{
    $(window).on('load', function() {

        if (sessionStorage.getItem("utilizador") != null) {
            var inicial = document.getElementById("form");
            var logged = document.getElementById("form1");
            inicial.style.display = "none";
            logged.style.display = "block";
            var html = "<p id='labelUsername'>" + sessionStorage.getItem("utilizador") + "</p>";
            document.getElementById("dados").innerHTML += html;
        }
    
        if(sessionStorage.getItem("admin")=="Admin")
        document.getElementById("search_box").style.display="none";
    
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
                    if(res[i].Estado=="Submetido")
                    {
                    var x = res[i].Condicao.toLowerCase();
                    L.marker([res[i].Localizacao.coordinates[1], res[i].Localizacao.coordinates[0]], { id: res[i]._id }).addTo(map);
                    html += "<button class='botao botao' onClick ='centrarMapa(" + res[i].Localizacao.coordinates[1] + "," + res[i].Localizacao.coordinates[0] + ")'>" + res[i].Nome + " (" + x + ") " + "</button><button class='botao botao' id='Abrir' onClick=abrir('"+ res[i]._id+"') >Abrir</button>";
                }}
    
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
    
        $('#search').on('keyup', function (e) {
            {
                if(document.getElementById("search").value=="")
                {
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
                            if(res[i].Estado=="Submetido")
                            {
                            var x = res[i].Condicao.toLowerCase();
                            L.marker([res[i].Localizacao.coordinates[1], res[i].Localizacao.coordinates[0]], { id: res[i]._id }).addTo(map);
                            html += "<button class='botao botao' onClick ='centrarMapa(" + res[i].Localizacao.coordinates[1] + "," + res[i].Localizacao.coordinates[0] + ")'>" + res[i].Nome + " (" + x + ") " + "</button><button class='botao botao' id='Abrir' onClick=abrir('"+ res[i]._id+"') >Abrir</button>";
                        }}
                        listagem.innerHTML = html;
                    }
                })
                }
                else
                {
                var listagem = document.getElementById("listAzul");
                $.ajax({
                    url: "api/azulejo/like/"+document.getElementById("search").value,
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
                            if(res[i].Estado=="Submetido")
                            {
                            var x = res[i].Condicao.toLowerCase();
                            L.marker([res[i].Localizacao.coordinates[1], res[i].Localizacao.coordinates[0]], { id: res[i]._id }).addTo(map);
                            html += "<button class='botao botao' onClick ='centrarMapa(" + res[i].Localizacao.coordinates[1] + "," + res[i].Localizacao.coordinates[0] + ")'>" + res[i].Nome + " (" + x + ") " + "</button><button class='botao botao' id='Abrir' onClick=abrir('"+ res[i]._id+"') >Abrir</button>";
                        }}
                        listagem.innerHTML = html;
                    }
                })
            }
        }
    })
    })
       
    
    
    
    
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
        if(sessionStorage.getItem("admin")!="Admin")
        {
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
                sessionStorage.setItem('utilizador', username);
                console.log(sessionStorage.getItem('utilizador'));
                var inicial = document.getElementById("form");
                var logged = document.getElementById("form1");
                inicial.style.display = "none";
                logged.style.display = "block";
                var html = "<p id='labelUsername>" + sessionStorage.getItem("utilizador") + "</p>";
                document.getElementById("dados").innerHTML += html;
                document.getElementById("password").value = "";
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
    }
    
    
    function abrir(id)
    {
        sessionStorage.setItem("AzulejoEscolhido",id);
        window.location.href="avaliar";
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
}


