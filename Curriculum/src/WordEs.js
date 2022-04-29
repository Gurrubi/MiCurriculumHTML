var arrayPalabras = ['Bóxer','Busto','Burro','Burla','Bufón','Bufet','Bueno','Bucal','Bingo',
'Códex','Cenit','Cómic','Cáliz','Conos','Débil','Dulce','Dogma','Drama','Fósil','Fémur','Fumar',
'Fresa','Freno','Guiso','Guapo','Gusto','Grumo','Hurto','Huevo','Hotel','Justo','Jugar','Jarra',
'Kioto','Karma','Lémur','Lunar','Móvil','Multa','Masón','Morir','Novel','Natal','Pauta','Pausa',
'Patán','Rímel','Regla','Surco','Solar','Túnel','Trufa','Tiara','Tarta','Video','Voraz','Vimos',
'Valle','Zanco','Zanja','Aúllo','Añoro','Añico','Añero','Añejo','Aíslo','Aéreo','Azote','Azuza',
'Azoro','Ayuna','Ayuda','Axila','Ayaco','Añero','Avena','Audaz','Audio','Atrás','Atajo','Astro',
'Arnés','Armar','Ánima','Aleta','Afijo','Ebrio','Exudo','Extra','Espío','Exige','Evoca','Evade',
'Eubeo','Euros','Etusa','Están','Esquí','Estos','Ester','Error','Errar','Equis','Envío','Enojo',
'Enema','Encía','Envío','Ellas','Élite','Ejote','Edgar','Ixtle','Izado','Itrio','Italo','Istmo',
'Islam','Islas','Islán','Irías','Iréis','Irnos','Iraní','Iones','Intuí','Inter','Ingle','Infra',
'Indio','Índex','Iluso','Oíste','Ozono','Óxido','Ovino','Oíste','Óvalo','Otros','Ozono','Otoño',
'Ostra','Ojera','Uñero','Urnas','Usado','Urbes','Urano','Uncía','Ubico'];

var Elegida = arrayPalabras[randomizer(0,arrayPalabras.length-1)];
var teclasPulsadas = 0;
var filasUsadas = 0;
var oportunidades = 0;
var ganado = false;
var letras = document.getElementsByClassName('letras');
var introducida;
var correctas = [], incorrectas = [];
Elegida = Elegida.normalize('NFD').replace(/[\u0300-\u036f]/g,"").toUpperCase(); //Elimina los acentos y pone todo en mayúsculas;
console.log('Elegida',Elegida);

window.onload = function(){
    document.onkeydown = detectaLetra;
}

function detectaLetra(e){
    var letra = e.code;
    var subStr = letra.substring(3, letra.length);

    if(subStr.length == 1 && teclasPulsadas < 5 && (teclasPulsadas+filasUsadas) < 30){
        letras[teclasPulsadas+filasUsadas].innerHTML = subStr;
        letras[teclasPulsadas+filasUsadas].className += ' expd';
        teclasPulsadas++;
    }
    else{
        if(letra == "Enter" && teclasPulsadas == 5){
            palabrasIntroducidas();
            ganado = letrasCorrectas();
            filasUsadas= filasUsadas+5;
            teclasPulsadas = 0;
            actualizaStats();

            if(oportunidades == 6 || ganado){
                document.getElementById('estado').classList.add('blur');
                if(oportunidades == 6 && !ganado){
                    document.getElementById('juego').innerHTML = 'HAS PERDIDO :C' + '<div class="pSolucion">La palabra correcta era: ' + Elegida + '</div>';
                }
                else{
                    document.getElementById('juego').innerHTML = '¡¡HAS GANADOOO!!';
                    teclasPulsadas = 30;
                }
                document.getElementById('juego').classList.add('recolor');
            }
        }
        else if(letra == "Backspace" && teclasPulsadas > 0){
            teclasPulsadas--;
            letras[teclasPulsadas+filasUsadas].innerHTML = '';
            letras[teclasPulsadas+filasUsadas].classList.remove('expd');
        }
    }
}

function actualizaStats(){
    oportunidades++;
    document.getElementById('nIntentos').innerHTML = oportunidades + ' / 6';
    document.getElementById('falladas').innerHTML = incorrectas.join(' ');
    document.getElementById('acertadas').innerHTML = correctas.join(' ');
}

function palabrasIntroducidas(){
    var txt = '';
    for(var i = 0; i < teclasPulsadas; i++){
        txt = txt + letras[i+filasUsadas].innerHTML;
    }
    introducida = txt;
}

function stringToArray(element,copied){
    for(var i=0; i < copied.length; i++){
        element.push(copied[i]);
    }
}

function letrasCorrectas(){
    var cp = [], cp2 = [];
    var basurero;
    var correctWords = 0;

    stringToArray(cp, introducida);
    stringToArray(cp2, Elegida);

    for(var i = 0; i < teclasPulsadas; i++){
        if(cp[i] == cp2[i]){
            basurero = cp.splice(i,1,'');
            correctas.push(basurero[0][0]);
            cp2.splice(i,1,'');
            correctWords++;
            letras[i+filasUsadas].style.backgroundColor = "#44ff23";
        }
        else{
            letras[i+filasUsadas].style.backgroundColor = "#636363";
        }
        letras[i+filasUsadas].style.color = "#efefe0";
        letras[i+filasUsadas].style.boxShadow = 'inset #676767 0px 0px 3px';
    }
    console.log('Copia Elegidas, Copia Introducidas', cp, cp2);

    for(var i = 0; i < teclasPulsadas; i++){
        for (var k = 0; k < teclasPulsadas; k++){
            if(cp[i] == cp2[k] && cp[i] != ''){
                cp.splice(i,1,'');
                cp2.splice(k,1,'');
                letras[i+filasUsadas].style.backgroundColor = "#ffff23";
            }
        }
    }
    console.log('Copia Elegidas, Copia Introducidas', cp, cp2);
    
    letrasIncorrectas(cp);
    eliminaCaracteresRepetidos(correctas);
    eliminaCaracteresRepetidos(incorrectas);

    return (correctWords == 5 ? true : false); 
}

function letrasIncorrectas(ele){
    for(var i = 0; i < ele.length; i++){
        if(ele[i] != ''){
            incorrectas.push(ele[i]);
        }
    }
}

function eliminaCaracteresRepetidos(vector){
    var eliminadas = 0;
    for(var i = 0; i < vector.length; i++){
        for(var k = 0; k < vector.length; k++){
            if(k != i && vector[i] == vector[k]){
                vector.splice(k,1);
                eliminadas++;
                k = k - eliminadas;
            }
        }
    }
}

function randomizer(ini, fin){
    var rand = Math.random();
    var rand = (rand * (fin - ini + 1)) + ini;
    rand = Math.floor(rand);

    return rand;
}
