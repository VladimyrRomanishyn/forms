<?php 
$mysqli = new mysqli('localhost','root','','shinro');

function generateCode($length = 6) {
	
	$chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPRQSTUVWXYZ0123456789';
	$charsLength  = strlen($chars);
	$code = '';
	$clen = strlen($code);
	
	while(strlen($code) < $length) {
		$code .= $chars[mt_rand(0,$charsLength)];
	}
	return $code;
}
if(isset($_POST['user'])){
	
	$data = json_decode($_POST['user'],true);
	$decodedpass = md5(md5(trim($data['password'])));
	$pass = substr($decodedpass, 0,13);
	$query = $mysqli->query("SELECT user_login, user_password FROM users WHERE user_login = '". $mysqli->real_escape_string($data['login'])."'");
	$queryArray = $query->fetch_assoc();

	if($data['login'] === $queryArray['user_login'] && $pass === $queryArray['user_password']){
		
		$user_hash = generateCode(10);
		$mysqli->query("UPDATE users SET user_hash = '".$user_hash."' WHERE user_login='".$mysqli->real_escape_string($data['login'])."'");
		
		setcookie('user_hash', $user_hash, time() + 60*60*24*30);
		setcookie('user_name', $data['login'], time() + 60*60*24*30);
		echo "OK";
	}else{
		echo 'Wrong data';
	}
}else{
	echo 'Error';
}
?>
