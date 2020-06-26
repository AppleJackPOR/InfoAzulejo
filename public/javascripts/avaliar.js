$(window).on('load', function() {
	if (sessionStorage.getItem("utilizador") != null) {
        var inicial = document.getElementById("form");
        var logged = document.getElementById("form1");
        inicial.style.display = "none";
        logged.style.display = "block";
        var html = "<p id='labelUsername'>" + sessionStorage.getItem("utilizador") + "</p>";
        document.getElementById("dados").innerHTML += html;
    }
	
    var geocodeService = L.esri.Geocoding.geocodeService();
    $.ajax({
        url: "api/azulejo/" + sessionStorage.getItem("AzulejoEscolhido"),
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
            console.log(res);
            document.getElementById("nomeAzulejo").value=res.Nome;
            document.getElementById("condicao").value=res.Condicao.toLowerCase();
            var loc=[];
            loc.push(res.Localizacao.coordinates[1]);
            loc.push(res.Localizacao.coordinates[0]);
            geocodeService.reverse().latlng(loc).run(function(error, result) {
                document.getElementById("moradaAzulejo").value = result.address.Match_addr;
                
            })
            document.getElementById("anoAzulejo").value=res.Ano;
            document.getElementById("inputDesc").value=res.Info;
             for (var i = 0; i < res.nrImages; i++) {
                 var html = '<img class="mySlides" src="https://azulejos.b-cdn.net/' + res._id + '/' + i + '.jpg" style="width:100%">'
                 document.getElementById("slideshow").innerHTML += html;
             }
             document.getElementById("slideshow").innerHTML += '<button class="w3-button w3-black w3-display-left" onclick="plusDivs(-1)">&#10094;</button>'
             document.getElementById("slideshow").innerHTML += '<button class="w3-button w3-black w3-display-right" onclick="plusDivs(1)">&#10095;</button>'
             showDivs(slideIndex);

            
        }
    })

})

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
	x[slideIndex - 1].style.objectFit = "cover";

}


function inserir()
{
    $.ajax({
        url: "/api/azulejo/avaliar",
        method: "post",
        contentType: "application/json",
        data: JSON.stringify({
            id:sessionStorage.getItem("AzulejoEscolhido"),
            nome: document.getElementById("nomeAzulejo").value,
            condicao:document.getElementById("condicao").value,
            descricao:document.getElementById("inputDesc").value,
            ano:document.getElementById("anoAzulejo").value,
            estado:"Aceite"
        }),
        success: function(res, status) {

          
        },
        error: function() {
           
        }
    });
}


function apagar()
{
    $.ajax({
        url: "/api/azulejo/avaliar",
        method: "post",
        contentType: "application/json",
        data: JSON.stringify({
            id:sessionStorage.getItem("AzulejoEscolhido"),
            nome: document.getElementById("nomeAzulejo").value,
            condicao:document.getElementById("condicao").value,
            descricao:document.getElementById("inputDesc").value,
            ano:document.getElementById("anoAzulejo").value,
            estado:"Recusado"
        }),
        success: function(res, status) {

          
        },
        error: function() {
           
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