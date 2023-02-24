// Get the color picker element
var colorPicker = document.getElementById("colorpicker");

// Check if the color picker value is stored in the cookies
if (getCookie("colorPickerValue")) {
  // If it exists, set the color picker value to the stored value
  colorPicker.value = getCookie("colorPickerValue");
}

// Add an event listener to the color picker to store the value in cookies when it changes
colorPicker.addEventListener("input", function() {
  setCookie("colorPickerValue", this.value, 7);
});

// Function to set a cookie
function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  var expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

// Function to get a cookie
function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}