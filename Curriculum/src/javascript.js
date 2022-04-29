var id;
var icono;
var mov;
function realizarMov(n){  
    switch(n){
        case 1: id = 'perfil'; break;
        case 2: id = 'formacion'; break;
        case 3: id = 'software'; break;
        case 4: id = 'idiomas'; break;
    }
    icono = document.getElementById(id);
    icono.classList.add('movPerfil');
    document.getElementById(id+'C').classList.add('anchura');
    document.getElementById(id+'C').classList.add('opacity');
    document.getElementById(id+'C').classList.add('padd');
    setTimeout(aumentaAltura,750,id+'C');
    setTimeout(ponPadding,2000,id+'C');
    setTimeout(ponOpacity,3000,n-1);

}

function aumentaAltura(ide){
    document.getElementById(ide).classList.add('altura');
}

function ponPadding(ide){
    document.getElementById(ide).style.paddingLeft = "20px";
}

function ponOpacity(ide){
    document.getElementsByClassName('texto__caja')[ide].classList.add('opacity');
}

function expandirBoton(){
    
    if(!document.getElementById('suma').classList.contains('rotate')){
        document.getElementById('suma').classList.add('rotate');
        expandir();
    }
    else{
        document.getElementById('suma').classList.remove('rotate');
        retraer();
    }
}

function expandir(){
    document.getElementById('profileButton').classList.add('profileMove');
    document.getElementById('educationButton').classList.add('educationMove');
    document.getElementById('softwareButton').classList.add('softwareMove');
    document.getElementById('languageButton').classList.add('languageMove');
    document.getElementById('contactButton').classList.add('contactMove');
}

function retraer(){
    document.getElementById('profileButton').classList.remove('profileMove');
    document.getElementById('educationButton').classList.remove('educationMove');
    document.getElementById('softwareButton').classList.remove('softwareMove');
    document.getElementById('languageButton').classList.remove('languageMove');
    document.getElementById('contactButton').classList.remove   ('contactMove');
}