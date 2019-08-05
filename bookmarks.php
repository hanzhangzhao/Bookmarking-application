<?php
	$cookie = 'username';

	include("connection.php");

	if(isset($_GET['getUserUrls'])) {
		$user = $_GET['getUserUrls'];
		$query = "SELECT Url FROM Bookmarks WHERE User = '$user'";
		$result = mysqli_query($conn, $query);
		$urls = array();
		while($url = mysqli_fetch_array($result))
			$urls[] = $url;
		echo json_encode($urls);
		exit();
	}

	if(isset($_POST['addUrl'])) 
	{
		$url = $_POST['addUrl'];
		$user = $_POST['user'];

		$url = url_sanitize($url);
		if(!url_valid($url)) { echo 0; return; }	
		if(url_already_exists($url, $user, $conn)) { echo -1; return; }	

		$query = "INSERT INTO Bookmarks (Url, User) VALUES ('$url','$user')";
		$result = mysqli_query($conn, $query);
		echo mysqli_num_rows($result);
	}

	if (isset($_POST['updateUrl'])) 
	{
		$url = $_POST['updateUrl'];
		$oldUrl = $_POST['oldUrl'];
		$user = $_POST['user'];

		$url = url_sanitize($url);
		if(!url_valid($url)) { echo 0; return; }	
		if(url_already_exists($url, $user, $conn)) { echo -1; return; }
			
		$query = "UPDATE Bookmarks SET Url = '$url' WHERE Url = '$oldUrl' and User = '$user'";
		$result = mysqli_query($conn, $query);
		echo mysqli_num_rows($result);
	}

	if(isset($_POST['deleteUrl'])) 
	{
		$url = $_POST['deleteUrl'];
		$query = "DELETE FROM Bookmarks WHERE Url = '$url'";
		$result = mysqli_query($conn, $query);
		echo mysqli_num_rows($result);
	}

	function url_valid($url) 
	{ 
		$handle = @fopen($url, "r"); 
		if ($handle === false) 
			return false; 
		
		fclose($handle); 
		return true; 
	}

	function url_sanitize($url) 
	{
		if(strlen($url) < 4 || substr( $url, 0, 4) !== "http")
			$url = "https://www.$url";

		return $url;
	}

	function url_already_exists($url, $user, $conn)
	{
		$query = "SELECT * FROM Bookmarks WHERE Url = '$url' and User = '$user'";
		$result = mysqli_query($conn, $query);
		return mysqli_num_rows($result) == 1;
	}
?>