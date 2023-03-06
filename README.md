# R-Place-Basic-Clone
A basic r/place clone using plain javascript, php and MySQL for the backend. 
Supports real-time updates for collaboration with other users on the site. 

My Live Website running this code: https://pixelplayground.io/

#Available Features
- Real-time pixel changing with other users on the site
- Toggleable sound effects 
- scriptswithcooldown.js Optional alternative script file for adding a 10 second cooldown. Cooldown variable can be changed at line 145. Value is in miliseconds. 
- colorcookie.js creates a cookie for remembering a users color selection when they revisit or refresh the site.
- optional export_db.sh script to add to CronJob for taking snapshots of the canvas state your prefered set interval. Make sure to edit the script file to set paths and database information.


This uses panzoom.js from https://github.com/anvaka/panzoom for zoom/pan function.

Heavily modified version of https://github.com/tinybirdco/r-place

# How-To Use

To clone the repository:
`git clone https://github.com/HumboldtK/R-Place-Basic-Clone.git`

To start working with this project you must have a MySQL server either locally or on a webhost.

Create a database in your MySQL server. Can be named anything you'd like.


Run this query in the database you just created to create a table named pixels that will store the x, y, color and date values.

`CREATE TABLE pixels (
  id INT AUTO_INCREMENT PRIMARY KEY,
  x INT NOT NULL,
  y INT NOT NULL,
  color VARCHAR(7) NOT NULL,
  date DATETIME NOT NULL
);
`

Edit the "creds.php" and enter your MySQL accordlingly. 
(For "$dbname" make sure you to enter the database's nameyou created and not the table name "pixels")

There is no more setup required. Everything should be working now if you visit the index page. 


If it's not working you can check the console for errors. 


Edit the index and CSS to style. If you do change the canvas width or height make sure to also update the first two lines in scripts.js as we declare the width and height there also.
