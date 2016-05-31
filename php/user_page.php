<!DOCTYPE html>
<html>
<head>
	<title>user_page</title>
	<meta charset = 'utf-8'>
	<link rel="stylesheet" type="text/css" href="../styles/styles.css">
</head>
<body>
	<div class = 'wrapp'>
		<p class='user_page'>Добро пожаловать на сайт,
		 <?php echo $_COOKIE['user_name'].'!';
		 ?> </p>
	</div>
</body>
</html>

