var noche = false;
var rnd = false;
var c1,c2,c3,c4,c5,c6;
var x1,x2;

function leer(i){
    var n = document.getElementById(i).innerHTML;
    
    if(i != 'AC' && i != '=' && i != 'r' && i != 'p' && i != 's' && i != "sen" && i != "cos" && i != "ln" && i != "ec"){
        document.getElementById('pantalla1').innerHTML += n;
    }
    else if(i == 'AC'){
        document.getElementById('pantalla1').innerHTML = '';
    }
    else if(i == 'r'){
        muestraPotencia(0.5);
    }
    else if(i == 'p'){
        muestraPotencia(2);
    }
    else if(i == 's'){
        var num = parseInt(document.getElementById('pantalla1').innerText);
        suma = 1;
        for(var i = 0; i < num; i++){
            suma = suma * (num-i);
        }
        document.getElementById('pantalla1').innerHTML = suma;
    }
    else if(i == 'sen'){
        document.getElementById('pantalla1').innerHTML = Math.sin(parseFloat(document.getElementById('pantalla1').innerHTML));
    }
    else if(i == 'cos'){
        document.getElementById('pantalla1').innerHTML = Math.cos(parseFloat(document.getElementById('pantalla1').innerHTML));
    }
    else if(i == 'ln'){
        document.getElementById('pantalla1').innerHTML = Math.log(parseFloat(document.getElementById('pantalla1').innerHTML));
    }
    else if(i == 'ec'){
        var ecuacion = document.getElementById('pantalla1').innerText;
        var num_ec = [];

        sacarNumeros(ecuacion, num_ec);
        
        if(num_ec.length == 3){
            if(realizarEcuacion(num_ec)){
                document.getElementById('pantalla1').innerHTML = 'x1: ' + x1 + '<br>x2: ' + x2;
            }
            else{
                document.getElementById('pantalla1').innerHTML = 'El resultado no es real, hay raíz negativa';
            }
        }
        else{
            document.getElementById('pantalla1').innerHTML = 'Inserte tres argumentos';
        }
    }
    else{
        var operacion = document.getElementById('pantalla1').innerText;
        var operacionC = [];
        var ope = [];
        var numeros = [];
        var covN = [];
        var prioridad = [];
        var parentesis = [];
        var k = 0;
        var orden;
        var resultado;

        copiarVector(operacionC,operacion);
        sacarNumeros(operacionC, numeros);
        sacarSignos(operacionC, ope);

        if(tieneParentesis(operacionC)){
            sacarParentesis(operacionC, parentesis);
            orden = traduceSignosPrioridades(prioridad, ope);
            resuelveParentesis(parentesis,numeros,ope,prioridad);
        }
        else{
            signoSobrante(numeros,ope);
            orden = traduceSignosPrioridades(prioridad, ope);
        }
        /*
        console.log('parentesis', parentesis);
        console.log('operacionC',operacionC);
        console.log('Resultado operaciones, Resultado numeros',ope,numeros);
        console.log('prioridad',prioridad);
        */
        if(orden){
            resultado = conjuntoOperacionesDeOrdenCero(numeros, ope);
        }
        else{
            resuelvePrioridades(prioridad,numeros,ope);
            resultado = conjuntoOperacionesDeOrdenCero(numeros, ope);
        }

        document.getElementById('pantalla1').innerHTML = resultado;
    }

}

function tieneParentesis(c){
    var encontrado = false;

    for(var i = 0; i < c.length && !encontrado; i++){
        if(c[i] == '('){
            encontrado = true;
        }
    }
    return encontrado;
}

function resuelveParentesis(parente,numeros,operaci,prior){
    var paren = [];
    var num = [];
    var op = [];
    var prio = []
    var ini = -1;
    var fin = -1;
    var totalP = 0;
    var parentesis = false;

    for(var i = 0; i < parente.length; i++){
        if(parente[i] == 1){
            totalP++;
        }
    }

    for(var i = parente.length-1; i >= 0; i--){
        if(parente[i] == 1 && totalP % 2 == 0){
            fin = i;
            fin++;
            totalP--;
        }
        else if(parente[i] == 1){
            ini = i;
            parentesis = true;
            totalP--;
        }
        if(ini != -1 && fin != -1 && parentesis){
            //console.log('ini, fin', ini, fin);
            parentesis = false;
            if(ini >= 1){
                prio = prior.slice(ini, fin);
                op = operaci.slice(ini,fin);
            }
            else{
                //console.log('El inicio del fin aquí vale: ', ini, fin);
                prio = prior.slice(ini,fin-1);
                op = operaci.slice(ini,fin-1);
            }
            num = numeros.slice(ini, fin);
            paren = parente.slice(ini, fin);
            var orden = traduceSignosPrioridades(prio, op);
            if(orden){
                //console.log('resultado paren', conjuntoOperacionesDeOrdenCero(num,op));
                //console.log('num, op', num, op);
                numeros.splice(ini, fin, conjuntoOperacionesDeOrdenCero(num, op));
                if(ini >= 1){
                    //console.log('El inicio del fin aquí vale: ', ini, fin);
                    prior.splice(ini, fin);
                    operaci.splice(ini,fin);
                }
                else{
                    //console.log('El inicio del fin aquí vale: ', ini, fin);
                    prior.splice(ini,fin-1);
                    operaci.splice(ini,fin-1);
                }
                parente.splice(ini,fin,0);
            }
            else{
                resuelvePrioridades(prio,num,op)
                numeros.splice(ini, fin, conjuntoOperacionesDeOrdenCero(num,op));
                if(ini >= 1){
                    prior.splice(ini, fin);
                    operaci.splice(ini,fin);
                }
                else{
                    prior.splice(ini,fin-1);
                    operaci.splice(ini,fin-1);
                }
                parente.splice(ini,fin,0);
            }

        }
    }
}

function copiarVector(copia, pega){
    for(var i = 0; i < pega.length; i++){
        copia.push(pega[i]);
    }
}

function sacarParentesis(vec, paren){
    var abierto = false;
    var eliminados = 0;
    var parente = vec[vec.length - 1];

    for(var i = 0; i < vec.length; i++){
        if(vec[i] == '(' || vec[i] == ')'){
            if(!abierto){
                paren.push(1);
                if(vec[i+1] == '-'){
                    vec.splice(i+1,1);
                }
            }
            else{
                paren.push(0);
                paren[i-1] = 1;
            }
            abierto = !abierto
            vec.splice(i,1);
        }
        else{
            paren.push(0);
        }
    }
    console.log(paren);
    if(parente == ')'){
        paren.splice(paren.length-1,1);
    }

    for(var i = 0; i < vec.length; i++){
        if(vec[i] == 'x' || vec[i] == '/' || vec[i] == '+' || vec[i] == '-' || vec[i] == '%'){
            paren.splice(i - eliminados,1);
            eliminados++;
        }
    }

}

function conjuntoOperacionesDeOrdenCero(num, op){
    var result = num[0];

    for(var i = 0; i < op.length; i++){
        result = operaciones(result, num[i+1], op[i]);
    }

    return result;
}

function traduceSignosPrioridades(prio, op){
    var orden = true;

    for (i = 0; i < op.length; i++){
        if(op[i] == "/" || op[i] == "x" || op[i] == "%"){
            prio.push(1);
        }
        else if (op[i] == "-" || op[i] == "+"){
            prio.push(0);
        }
    }

    for (i = 0; i < prio.length-1; i++){
        if(prio[i] < prio[i+1]){
            orden = false;
        }
    }

    return orden;           
}

function resuelvePrioridades(prio, num, op){
    var multi;
    var i = 0;

    while(i < prio.length -1){
        if((prio[i] == 0) && (prio[i+1] == 1)){
            multi = operaciones(num[i+1],num[i+2],op[i+1]);
            num.splice(i+1,2,multi);
            prio.splice(i+1,1);
            op.splice(i+1,1);
            i = 0;
        }
        i++
    }
}

function sacarSignos(vector, signos){

    for(var i = 0; i < vector.length; i++){
        if(vector[i] == '/' || vector[i] == '+' || vector[i] == '-' || vector[i] == "x" || vector[i] == '%'){
            if(vector[i-1] != '('){
                signos.push(vector[i]);
            }
        }
    }

}

function conversionSignos(signos){
    for (var i = 0; i < signos.length; i++){
        if(signos[i] == '-'){
            signos[i] = -1;
        }
        else{
            signos[i] = 1;
        }
    }
}

function conversionSignos(signos,copia){
    for (var i = 0; i < signos.length; i++){
        if(signos[i] == '-'){
            copia.push(-1);
        }
        else{
            copia.push(1);
        }
    }
}

function aplicarSignos(numeros, signos){
    for(var i = signos.length-1; i >= 0; i--){
        numeros[numeros.length-(signos.length - i)] = numeros[numeros.length-(signos.length - i)] * signos[i];
    }
}

function signoSobrante(num, op){
    if(num.length == op.length){
        op.shift();
    }
}

function realizarEcuacion(numeros){
    var realizado;
    var discriminante;

    discriminante = (Math.pow(numeros[1],2) - 4*numeros[0]*numeros[2]);

    if(discriminante >= 0){
        realizado = true;
        x1 = ((numeros[1] * (-1)) + Math.sqrt(discriminante)) / (numeros[0]*2);
        x2 = ((numeros[1] * (-1)) - Math.sqrt(discriminante)) / (numeros[0]*2);
    }
    else{
        realizado = false;
    }

    return realizado;
}

function sacarNumeros(vector, numero){
    var n = '';
    var e;
    
    for(var i = 0; i < vector.length; i++){
        if(vector[i] != '+' && vector[i] != '-' && vector[i] != '/' && vector[i] != 'x' && vector[i] != '%' && vector[i] != '(' && vector[i] != ')'){
            n = n + vector[i];
        }
        else if(i>0 && n != ''){
            e = negativoPositivo(vector, n, i);
            n = parseFloat(n);
            n = n * e;
            numero.push(n);
            n = '';
        }
    }
    if(n != ''){
        e = negativoPositivo(vector, n, i);
        n = parseFloat(n);
        n = n * e;
        numero.push(n);
    }
}

function negativoPositivo(v,c,i){
    var eli = 1;
    if((i-c.length-1) >= 0){
        if(v[i-c.length-1] == '-'){
            eli = -1;
        }
        else{
            eli = 1;
        }
    }
    return eli;
}

function muestraPotencia(po){
    var num = parseFloat(document.getElementById('pantalla1').innerText);
    num = Math.pow(num, po);
    document.getElementById('pantalla1').innerHTML = num;
}

function operaciones(n1, n2, s){
    var op
    switch (s){
        case 'x': op = n1 * n2; break;
        case '/': op = n1 / n2; break;
        case '-': op = n1 + n2; break;
        case '+': op = n1 + n2; break;
        case '%': op = n1 % n2; break;
        default: op = "Syntax ERROR";
    }
    return op;
}

function detectaModo(){
    if(noche){
        modoApariencia("noche","black","#4407ad","#1eff00","white","#ff9700","white");
    }
    else if(rnd){
        modoApariencia("random",c1,c2,c3,c4,c5,c6);
    }
    else{
        modoApariencia("dia","white","#baf752","#E100FF","black","#8FEEDE","black");
    }
}

function siguiente(){
    var pag = '<div class="fila1"><div id="r" class="boton" onclick="leer(\'r\');">&#8730</div><div id="p" class="boton" onclick="leer(\'p\');">x<sup>2</sup></div><div id="s" class="boton" onclick="leer(\'s\');">!</div><div id="sen" class="boton" onclick="leer(\'sen\')">sin</div></div><div class="fila2"><div id="cos" class="boton" onclick="leer(\'cos\')">cos</div><div id="ln" class="boton" onclick="leer(\'ln\')">ln</div><div id="ec" class="boton" onclick="leer(\'ec\')">ec<sup>2</sup></div></div><div class="fila3"><div id="(" class="boton" onclick="leer(\'(\')">(</div><div id=")" class="boton" onclick="leer(\')\')">)</div></div>';
    document.getElementById('pagina').innerHTML = pag;
    document.getElementById('side').innerHTML = '<div class="sideB" onclick="anterior()"><</div>'

    detectaModo();
}

function anterior(){
    var pag = '<div class="fila1"><div id="9" class="boton" onclick="leer(\'9\');">9</div><div id="8" class="boton" onclick="leer(\'8\');">8</div><div id="7" class="boton" onclick="leer(\'7\');">7</div><div id="/" class="boton" onclick="leer(\'/\');">/</div></div><div class="fila2"><div id="6" class="boton" onclick="leer(\'6\');">6</div><div id="5" class="boton" onclick="leer(\'5\');">5</div><div id="4" class="boton" onclick="leer(\'4\');">4</div><div id="x" class="boton" onclick="leer(\'x\');">x</div></div><div class="fila3"><div id="3" class="boton" onclick="leer(\'3\');">3</div><div id="2" class="boton" onclick="leer(\'2\');">2</div><div id="1" class="boton" onclick="leer(\'1\');">1</div><div id="-" class="boton" onclick="leer(\'-\');">-</div></div><div class="fila4"><div id="0" class="boton" onclick="leer(\'0\');">0</div><div id="." class="boton" onclick="leer(\'.\');">.</div><div id="%" class="boton" onclick="leer(\'%\');">%</div><div id="+" class="boton" onclick="leer(\'+\');">+</div></div><div class="fila5"><div id="AC" class="boton__AC" onclick="leer(\'AC\');">AC</div><div id="=" class="boton__igual" onclick="leer(\'=\');">=</div></div>';
    document.getElementById('pagina').innerHTML = pag;
    document.getElementById('side').innerHTML = '<div class="sideB" onclick="siguiente()">></div>';

    detectaModo();
}

function cambiaFondoYColor(objeto, col1, col2){
    for(var i = 0; i < objeto.length; i++){
        objeto[i].style.backgroundColor = col1;
        objeto[i].style.color = col2; 
    }
}

function modoApariencia(modo,z1,z2,z3,z4,z5,z6){
    if(modo == "noche"){
        noche = true;
        rnd = false;
        document.getElementById('modo').innerHTML = '<div class="angel" onclick="modoApariencia(\'dia\',\'white\',\'#baf752\',\'#E100FF\',\'black\',\'#8FEEDE\',\'black\');"></div>';
    }
    else if (modo == "dia"){
        noche = false;
        rnd = false;
        document.getElementById('modo').innerHTML = '<div class="demon" onclick="modoApariencia(\'noche\',\'black\',\'#4407ad\',\'#1eff00\',\'white\',\'#ff9700\',\'white\');"></div>';
    }
    else{
        noche = false;
        rnd = true;
    }

    var boton = document.getElementsByClassName('boton');
    var botones = document.getElementsByClassName('botones');
    var calculadora = document.getElementsByClassName('calculadora');
    var pantalla = document.getElementsByClassName('pantalla');
    var sideB = document.getElementsByClassName('sideB');
    var boton__AC = document.getElementsByClassName('boton__AC');
    var boton__igual = document.getElementsByClassName('boton__igual');

    calculadora[0].style.backgroundColor = z1;
    cambiaFondoYColor(pantalla, z2, z3);
    pantalla[0].style.borderColor = z4;
    cambiaFondoYColor(sideB, z1, z4);
    botones[0].style.backgroundColor = z5;
    cambiaFondoYColor(boton, z1, z4);
    cambiaFondoYColor(boton__AC, z1, z4);
    cambiaFondoYColor(boton__igual, z1, z4);
    
    document.getElementById('body').style.backgroundColor = z6;

}

function generaColorAleatorio(){
    c1 = colorAleatorio();
    c2 = colorAleatorio();
    c3 = colorAleatorio();
    c4 = colorAleatorio();
    c5 = colorAleatorio();
    c6 = colorAleatorio();

    modoApariencia("random",c1,c2,c3,c4,c5,c6);
}

function random(s,b){
    var ale = Math.random();
    ale = (ale * (b-s+1))+s;
    ale = Math.floor(ale);
    return ale;
}

function colorAleatorio(){
    var c;
    var sum = '#';
    for(var i = 0; i < 6; i++){
        c = random(0,15);

        switch (c){
            case 10: c = 'A'; break;
            case 11: c = 'B'; break;
            case 12: c = 'C'; break;
            case 13: c = 'D'; break;
            case 14: c = 'F'; break;
            case 15: c = 'E'; break;
        }
        sum = sum + c;
    }
    return sum;
}

function switcher(){
    noche = !noche;
}

