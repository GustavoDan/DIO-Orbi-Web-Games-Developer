<html>
	<head>
		<title>Desafio Accordion</title>

		<link rel="stylesheet" href="https://code.jquery.com/ui/1.13.1/themes/dark-hive/jquery-ui.css">

		<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
		<script src="https://code.jquery.com/ui/1.13.1/jquery-ui.min.js"></script>
		
		<script>$(() => $("#accordion").accordion());</script>
	</head>
	
	<body>
		<div id="accordion">
			<h3>Seção 1</h3>
				<div>
					<p>Conteúdo 1</p>
				</div>
			<h3>Seção 2</h3>
				<div>
					<p>Conteúdo 2</p>
				</div>
			<h3>Seção 3</h3>
				<div>
					<p>Conteúdo 3</p>
					<ul>
						<li>Primeiro item da lista</li>
						<li>Segundo item da lista</li>
						<li>Terceiro item da lista</li>
					</ul>
				</div>
			<h3>Seção 4</h3>
				<div>
					<p>Conteúdo 4</p>
					<p>Conteúdo 5</p>
				</div>
		</div>
	</body>
</html>