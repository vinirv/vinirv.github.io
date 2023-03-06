var maxX, maxY, divEsfW, divEsfH, pesoTempo, pesoComplex;
var tamXY;

$( function() {
	
	ajustarComTela();
	
	$( "#slider-tempo" ).slider({
		range: "min",
		min: 0,
		max: 10,
		value: 0,
		slide: function( event, ui ) {				
			evtSliderT(ui.value);					
		}
	});
	$( "#slider-complex" ).slider({
		orientation: "vertical",
		range: "min",
		min: 0,
		max: 5,
		value: 0,
		slide: function( event, ui ) {
			evtSliderC(ui.value);					
		}
	});
	
	iniciarVariaveis();
	
	$("#valor-max-esf, #peso-tempo, #peso-complex").change(function(){
		zerar();
		iniciarVariaveis();
	});
	
	$("#dias-sprint").change(function(){
		$( "#slider-tempo" ).slider( "option", "max", $("#dias-sprint").val() );
		zerar();
		iniciarVariaveis();		
	});
	
	$("#complex-max").change(function(){
		$( "#slider-complex" ).slider( "option", "max", $("#complex-max").val() );
		zerar();
		iniciarVariaveis();		
	});	

	$("#valor-complexidade").change(function(){
		evtSliderC(this.value);
	});
	
	$("#valor-tamanho").change(function(){
		evtSliderT(this.value);
	});
}); 

function ajustarComTela(){
	if (screen.height < 700){
		$("#slider-complex").css("height", "150px");
		$("#div-esforco").css("height", "150px");
	}
}

function evtSliderT(valor){
	$( "#valor-tamanho" ).val( valor );
	$("#slider-tempo").slider('value',valor);
	
	var esforco = calculaEsforco();
	$( "#valor-esforco" ).val( Math.round(esforco) + " (" + esforco.toFixed(1) + ")" );
	
	ajustarLinha();
}

function evtSliderC(valor){
	$( "#valor-complexidade" ).val( valor );
	$("#slider-complex").slider('value',valor);	
			
	var esforco = calculaEsforco();
	$( "#valor-esforco" ).val( Math.round(esforco) + " (" + esforco.toFixed(1) + ")" );

	ajustarLinha();
}

function zerar(){
	$("#slider-tempo").slider('value',0);
	$("#slider-complex").slider('value',0);	
	
	evtSliderT(0);
	evtSliderC(0);
}

function iniciarVariaveis(){
	
	maxX = $( "#slider-tempo" ).slider( "option", "max" );
	maxY = $( "#slider-complex" ).slider( "option", "max" );
	divEsfW = $('#div-esforco').width();
	divEsfH = $('#div-esforco').height();
	
	pesoTempo = $("#peso-tempo").val();
	pesoComplex = $("#peso-complex").val();
	
	var esfMax = $("#valor-max-esf").val();
	tamXY = Math.sqrt(Math.pow(esfMax,2)/2)
	
	tamXY = Math.sqrt( Math.pow(esfMax,2) / ( Math.pow(pesoTempo,2) + Math.pow(pesoComplex,2) ) );
}

function calculaEsforco(){
	var tam = $( "#valor-tamanho" ).val() * (tamXY/maxX) * pesoTempo;
	var com = $( "#valor-complexidade" ).val() * (tamXY/maxY) * pesoComplex;

	return Math.sqrt(Math.pow(tam, 2) + Math.pow(com, 2));
}

function ajustarLinha()	{

	var tam = $( "#valor-tamanho" ).val()*(tamXY/maxX);
	var com = $( "#valor-complexidade" ).val()*(tamXY/maxY);

	$('.line').remove();

	var x1 = $('#div-esforco').offset().left;
	var y1 = $('#div-esforco').offset().top + divEsfH;		
	var x2 = $('#div-esforco').offset().left + (tam * divEsfW/tamXY);
	var y2 = $('#div-esforco').offset().top + divEsfH - (com * divEsfH/tamXY);
	
	criarLinha(x1,y1, x2,y2);
}

function criarLinha(x1,y1, x2,y2){

	var tam = $( "#valor-tamanho" ).val();

	var length = Math.sqrt((x1-x2)*(x1-x2) + (y2-y1)*(y2-y1));
	var angle  = 360 - (Math.atan2(y1 - y2, x2 - x1) * 180 / Math.PI);
	var transform = 'rotate('+angle+'deg)';

	$('#x1').val(x1);
	$('#y1').val(y1);
	$('#x2').val(x2);
	$('#y2').val(y2);
	
	var line = $('<div>')
		.appendTo('#div-esforco')
		.addClass('line')
		.css({
			'position': 'absolute',
			'transform': transform,
			'top': y1 + 'px',
			'left': x1 + 'px'
	})
	.width(length);
		
	return line;
}