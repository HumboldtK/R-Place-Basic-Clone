<?php
include 'creds.php';

// Create connection
$conn = mysqli_connect($servername, $username, $password, $dbname);

// Check connection
if (!$conn) {
  die("Connection failed: " . mysqli_connect_error());
}

// Get the JSON data from the request body
$requestData = json_decode(file_get_contents('php://input'), true);

// Update each pixel in the database
$successCount = 0;

foreach ($requestData as $pixel) {
    $x = $pixel['x'];
    $y = $pixel['y'];
    $color = $pixel['color'];
    $date = date('Y-m-d H:i:s'); // get current date and time

    // Check if the pixel exists in the database
    $check_query = "SELECT id FROM pixels WHERE x=$x AND y=$y";
    $check_result = mysqli_query($conn, $check_query);
    $check_row = mysqli_fetch_assoc($check_result);

    if ($check_row) {
        // If the pixel exists, update the color and date
        $update_query = "UPDATE pixels SET color='$color', date='$date' WHERE x='$x' AND y='$y'";
        if (!mysqli_query($conn, $update_query)) {
            die("Update query failed: " . mysqli_error($conn));
        }
    } else {
        // If the pixel does not exist, insert a new one with the date
        $insert_query = "INSERT INTO pixels (x, y, color, date) VALUES ($x, $y, '$color', '$date')";
        if (!mysqli_query($conn, $insert_query)) {
            die("Insert query failed: " . mysqli_error($conn));
        }
    }
}

// Return success message
echo json_encode(array("message" => "Pixels updated successfully"));

// Close the database connection
mysqli_close($conn);

?>
