var canvas = document.getElementById("game-sapo");
var ctx = canvas.getContext("2d");
//Creando al Sapo-Rolio
var rolio = {
	x:310,
	y:canvas.height-118,
	width:144,
	height:144
};
var juego = {
	estado: "iniciando"
};
var teclado = {};
var laser = []; // laser es el disparo
var enemigos = [];
//Variables para las imagenes
var fondo, sapoRolio, dbjLengua, mosca;
var soundLaser;
//Definicion de funciones
function loadMedia(){
	fondo = new Image();
	fondo.src = "http://2.bp.blogspot.com/-OajUXNWtqpY/TflkPgG0V3I/AAAAAAAAJ9U/76rTyoyBWZc/s1600/fairyfon_22.jpg";
	sapoRolio = new Image();
	sapoRolio.src = "54.png";
	dbjLengua = new Image();
	dbjLengua.src = "laser-42.png";
	mosca = new Image();
	mosca.src = "mosca.png";
	soundLaser = document.createElement('audio');
	document.body.appendChild(soundLaser);
	soundLaser.setAttribute('src','laser22.ogg');
	fondo.onload = function(){
		var intervalo = window.setInterval(frameloop,2000/182);
	}
}

function dibujarEnemigos(){
	for(var i in enemigos){
		var enemigo = enemigos[i];
		if(enemigo.estado == 'vivo') ;
		if(enemigo.estado == 'muerto') ;
		ctx.drawImage(mosca,enemigo.x,enemigo.y,enemigo.width,enemigo.height);
	}
}

function dibujarFondo(){
	ctx.drawImage(fondo,0,0,950,550);
}

function dibujarSapo(){
	ctx.save();
	ctx.drawImage(sapoRolio,rolio.x,rolio.y,rolio.width,rolio.height); // posicion en el canvas, ancho y alto
	ctx.restore();
}

function agregarEventosTeclado(){
	agregarEvento(document,"keydown",function(e){
		//Ponemos en TRUE la tecla presionada
		teclado[e.keyCode] = true;
	});
	agregarEvento(document,"keyup",function(e){
		//Ponemos en FALSE la tecla que dejo de ser presionada
		teclado[e.keyCode] = false;
	});
	function agregarEvento(elemento,nombreEvento,funcion){
		if(elemento.addEventListener){
			//Navegadores de verdad
			elemento.addEventListener(nombreEvento,funcion,false);
		}
		else if(elemento.attachEvent){
			//Internet Explorer
			elemento.attachEvent(nombreEvento,funcion);
		}
	}
}

function moverSapo(){
	if(teclado[37]){//velocidad hacia la izquierda
		rolio.x -= 4;
		if(rolio.x < 0) rolio.x = 0;

	}
	if(teclado[39]){//velocidad hacia la derecha
		var limite = canvas.width - rolio.width;
		rolio.x += 4;
		if(rolio.x > limite) rolio.x = limite+10;
	}
	if(teclado[32]){
		if(!teclado.fire){
			fire();
			teclado.fire = true;
		}
	}
	else teclado.fire = false;
}

function actualizaEnemigo(){
	if(juego.estado == 'iniciando'){
		for(var i =0; i<15;i++){
			enemigos.push({
				x: (~~((Math.random()*100)+1) + (i * 20))*3,
				y:25,
				height: 40,
				width: 40,
				estado: 'vivo',
				contador: 0
			});
		}
		juego.estado = 'jugando';
	}
	for(var i in enemigos){
			var enemigo = enemigos[i];
			if(!enemigo) continue;
			if(enemigo && enemigo.estado == 'vivo'){
				enemigo.contador++;
				enemigo.y += Math.sin(enemigo.contador * Math.PI /15)*1 ;
				enemigo.y += Math.sin(enemigo.contador * Math.PI /20)*~~((Math.random()*9)-2);
				enemigo.x -= Math.sin(enemigo.contador * Math.PI /~~((Math.random()*100)+4))*3;
				//enemigo.y += Math.sin(enemigo.contador * Math.PI / 90) * 5;

			}
			if(enemigo && enemigo.estado == 'hit'){
				enemigo.contador++;
				if(enemigo.contador >= 15){
					enemigo.estado = 'muerto';
					enemigo.contador = 0;
				}
			}
		}
	enemigos = enemigos.filter(function(enemigo){
		if(enemigo && enemigo.estado != 'muerto')return true;
		return false;
	});
}

function sacarLengua(){
	for(var i in laser){
		var lengua = laser[i];
		lengua.y -= 5; // velocidad del disparo

	}
	laser = laser.filter(function(lengua){
		return lengua.y > 0;
	});
}
function fire(){
	soundLaser.pause();
	soundLaser.play();
	laser.push({
		x: rolio.x + 34,
		y: rolio.y - 5,
		width: 7,
		height: 66
	});

}
function dibujarLengua(){
	ctx.save();
	ctx.fillStyle = "red";
	for(var i in laser){
		var lengua = laser[i];
		ctx.drawImage(dbjLengua,lengua.x,lengua.y, lengua.width,lengua.height);
	}
	ctx.restore();
}

function hit(a,b){
	var hit = false;
	if(b.x + b.width >= a.x && b.x < a.x + a.width){
		if(b.y + b.height >= a.y && b.y < a.y + b.height){
			hit=true;
		}
	}
	if(b.x <= a.x && b.x + b.width >= a.x + a.width){
		if(b.y <= a.y && b.y + b.height >= a.y + a.height){
			hit=true;
		}

	}
	if(a.x <= b.x && a.x + a.width >= b.x + b.width){
		if(a.y <= b.y && a.y + a.height >= b.y + b.height){
			hit=true;
		}

	}
	return hit;
}

function verificarContacto(){
	for(var i in laser){
		var lengua = laser[i];
		for(j in enemigos){
			var enemigo = enemigos[j];
			if(hit(lengua, enemigo)){
				enemigo.estado = 'hit';
				enemigo.contador = 0;
			}
		}
	}
}

function frameloop(){
	moverSapo();
	sacarLengua();
	dibujarFondo();
	dibujarEnemigos();
	actualizaEnemigo();
	verificarContacto();
	dibujarLengua();
	dibujarSapo();
}
//Ejecucion de funciones
loadMedia();
agregarEventosTeclado();