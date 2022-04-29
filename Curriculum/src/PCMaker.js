function pedir(){
    var total = parseFloat(document.getElementById('costo').innerHTML);
    var txt= '<h1>Producto comprado!!!</h1><br><br><h2 style="color:white;">Total gastado: ' + total + ' €</h2>';
    document.getElementById('pagina').innerHTML = txt;
}

function comprar(i){
    var componente = document.getElementById('nombre' + i).innerHTML;
    var precio = parseFloat(document.getElementById('precio' + i).innerHTML);

    var total = parseFloat(document.getElementById('costo').innerHTML);
    total = total + precio;
    total = Math.floor(total * 100) / 100;

    document.getElementById('cuerpo').innerHTML += componente + '<br><br>';
    document.getElementById('costo').innerHTML = total;
}

function borrar(){
    document.getElementById('cuerpo').innerHTML = '';
    document.getElementById('costo').innerHTML = 0;
}

