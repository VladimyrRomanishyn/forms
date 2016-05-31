<?php 
	header('Content-Type: text/html; charset=UTF-8');
	
	$mysqli = new mysqli('localhost','shinro','ukflbfnjh300','shinro');
	
	if(isset($_POST['user'])){
		
		$data = json_decode($_POST['user'], true);

		$query = $mysqli->query("SELECT user_id FROM users WHERE user_login='". $mysqli->real_escape_string($data['login'])."'");
		
		if($query->num_rows == 0){
			$password = md5(md5(trim($data['password'])));
			$mysqli->query("INSERT INTO users SET user_login='".$data['login']."', user_password='".$password."',user_mail='".$data['mail']."'");
			echo 'Регистрация прошла успешно!';
		}else{
			echo 'Пользователь с таким логином уже существует!';
		}

	}else{
		echo 'Error!';
	}
?>

