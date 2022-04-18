<html>
	<head>
		<title>Desafio Progressbar</title>

		<link rel="stylesheet" href="https://code.jquery.com/ui/1.13.1/themes/dark-hive/jquery-ui.css">

		<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
		<script src="https://code.jquery.com/ui/1.13.1/jquery-ui.min.js"></script>
				
		<script>$(async () => {
			for (var i = 0; i <= 100; i++){
				$("#progressbar").progressbar({value:i});
				await new Promise(resolve => setTimeout(resolve, 100));
				}
			});
		</script>
	</head>
	
	<body>
		<h1>Adiciona 1% à barra de progresso a cada 100ms.</h1>
		<div id="progressbar"></div>
	</body>
</html>
