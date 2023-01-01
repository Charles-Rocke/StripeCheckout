'use strict';

/* change left side color
document.querySelector(".col1").style.backgroundColor = "#00FF00";

// get status of switch
const switchBtn = document.getElementById("flexSwitchCheckDefault");
// get index view
const indexView = document.querySelector(".index");

const templateView = document.querySelector(".temp");



switchBtn.addEventListener("click", function() {
	// display current status of switch button
	console.log(switchBtn.checked);
	// console.log(switchBtn.checked);
	if (switchBtn.checked) {
		document.querySelector(".col1").style.backgroundColor = "#DE73FF";
		document.querySelector(".col2").style.backgroundColor = "#00FF00";
		
	}
	else {
		document.querySelector(".col1").style.backgroundColor = "#00FF00";
		document.querySelector(".col2").style.backgroundColor = "#DE73FF";
	}
})
*/

// 1. Allow user to set a field (bootstrap)


// 2. Allow user to set brand colors (bootstrap)
// const primaryColor = document.getElementById("primary-color").value;
// const secondaryColor = document.getElementById("secondary-color").value;


// 3. Allow user to set logo (bootstrap)

// 4. Change content when submitted
document.querySelector(".btn-submit").addEventListener("click", function() {
	// 1
	const fieldName = document.querySelector(".field-name-value").value;
	console.log(fieldName);
	document.querySelector(".field-name").textContent = fieldName;
	document.querySelector(".input100").placeholder = `Enter ${fieldName}`;

	// 2
	const primaryColor = document.querySelector(".primary-color").value;
	console.log(primaryColor);
	document.querySelector(".login100-form-bgbtn").style.background = `${primaryColor}`;
});