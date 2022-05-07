<html>
	<head>
		<title>Desafio Progressbar</title>

		<link rel="stylesheet" href="https://code.jquery.com/ui/1.13.1/themes/dark-hive/jquery-ui.css">
		
		<style>
			.spacer {
				height: 10px;
			}
		</style>

		<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
		<script src="https://code.jquery.com/ui/1.13.1/jquery-ui.min.js"></script>
		
		<script>
		function start_progressbar(){
			$(() => $(".progressbar").progressbar({value:0}))
		}
		async function init_progress(wait_ms){
			start_progressbar();
			for (var i = 1; i <= 100; i++){
				await new Promise(resolve => setTimeout(resolve, wait_ms));
				$(".progressbar").progressbar({value:i});
			}
		}
		
		start_progressbar();
		
		$(() => $(".spinner").spinner());
		
		$(() => {
			$(".widget input[type=submit], .widget a, .widget button").button();
			$("button").click((event) => {
				var value = $(".progressbar").progressbar("option", "value");
				var wait_ms = $(".wait-ms").spinner( "value" );console.log(wait_ms)
				if (value == 0 || value == 100){
					init_progress(wait_ms);
					}
				else if(value > 0 && value < 100){
					alert("Espere a barra chegar em 100% ou recarregue a pagina.");
					}
			});
		});
		</script>
	</head>
	
	<body>
		<h1>Digite à cada quantos milissegundos você quer que seja adicionado 1% à barra de progresso.</h1>
		<input type="number" value=0 min=0 class="wait-ms spinner"></input>
		<button class="ui-button ui-widget ui-corner-all">Iniciar</button>
		<div class="spacer"> </div>
		<div class="progressbar"></div>
	</body>
</html>
