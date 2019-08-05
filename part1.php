<?php

	$getTop10='';

	if(isset($_POST['getTop10'])){
		$getTop10=$_POST['getTop10'];
	}

	if($getTop10=='getTop10') {
		include("./connection.php");
		$query = "SELECT Url FROM Bookmarks GROUP BY Url ORDER BY COUNT(*) DESC LIMIT 10";
		$result = mysqli_query($conn, $query);
		$urls = array();
		while($url = mysqli_fetch_array($result))
			$urls[] = $url;
		echo json_encode($urls);
		exit();
	}

?>