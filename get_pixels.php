<?php
include 'creds.php';
// Create connection
$conn = mysqli_connect($servername, $username, $password, $dbname);

// Check connection
if (!$conn) {
  die("Connection failed: " . mysqli_connect_error());
}

$sql = "SELECT x, y, color FROM pixels";
$result = mysqli_query($conn, $sql);

if (mysqli_num_rows($result) > 0) {
  $pixels = array();
  while($row = mysqli_fetch_assoc($result)) {
    $pixels[] = $row;
  }
  echo json_encode($pixels, JSON_PRETTY_PRINT);
} else {
  echo "0 results";
}

mysqli_close($conn);
?>
