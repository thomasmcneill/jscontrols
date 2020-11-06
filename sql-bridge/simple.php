<?php

$mysql_host = 'mysql:host=localhost;dbname=test';
$mysql_username = 'root';
$mysql_password = 'root';

$decoded = json_decode($_POST['data'],true);
$func =  $decoded['function'];
$sql = $decoded['sql'];

ob_start();
var_dump($_POST['data']);
$result=ob_get_clean();
error_log($result);
ob_end_clean();

$pdo = new PDO($mysql_host,$mysql_username, $mysql_password);

// Prepare the sql statement
$stmt = $pdo->prepare($sql);

// count the ? and then add one for each as a binded value
$count = substr_count($sql, '?'); 
for($t=1;$t<$count+1;$t++)
$stmt->bindValue($t, $decoded[$t-1]);


if($func == "select") {



	$DataSet = array();
	if($stmt->execute())
	{
		$DataSet[] = ($stmt->fetch(PDO::FETCH_ASSOC));
		while ($row = $stmt->fetch())
		{
			$DataSet[] = $row;
			
		}
		$result = array();
		$result["status"] = "success";
		$result["result"] = $DataSet;
		echo json_encode($result);
	} else {
		ob_start();
		var_dump($stmt->errorInfo());
		$result=ob_get_clean();
		error_log($result);
		echo "SERVER ERROR";
		ob_end_clean();
	}
}

if($func == "update") {

	if($stmt->execute())
	{
		$result = array();
		$result["status"] = "success";
		$result["result"] = $stmt->rowCount();
		echo json_encode($result);
	} else {
		ob_start();
		var_dump($stmt->errorInfo());
		$result=ob_get_clean();
		error_log($result);
		echo "SERVER ERROR";
		ob_end_clean();
	}

}
if($func == "insert") {

	if($stmt->execute())
	{
		$result = array();
		$result["status"] = "success";
		$result["result"] = $pdo->lastInsertId();
		echo json_encode($result);
	} else {
		ob_start();
		var_dump($stmt->errorInfo());
		$result=ob_get_clean();
		error_log($result);
		echo "SERVER ERROR";
		ob_end_clean();
	}

}


?>
