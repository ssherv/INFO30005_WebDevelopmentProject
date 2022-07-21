// Drop-down menu bar

function dropContent() {
    document.getElementById("drop-down").classList.toggle("show");
}

function checkPassword() {
    console.log("here");
    const new_password = document.getElementById("password").value;
    const confirm_new_password = document.getElementById('cnfrm-password').value;
    console.log(new_password, confirm_new_password);

    const message = document.getElementById("warning_message");

    if (new_password.length != 0) {
        if (new_password != confirm_new_password) {
            message.textContent = "Passwords don't match."
        }
    } else {
        alert("Password can't be empty!")
        message.textContent = ""
    }

}

window.onclick = function(event) {
    if (!event.target.matches('.hamburger') && !event.target.matches('.bar')) {
        var dropdowns = document.getElementsByClassName("mobi-menu-btn-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
            openDropdown.classList.remove('show');
            }
        }
    }
}

// Get the modal
var modal = document.getElementById('id01');

// When the user clicks anywhere outside of the modal, close it
//window.onclick = function(event) {
//  if (event.target == modal) {
//    modal.style.display = "none";
//  }
//}



// toggles checkbox
function toggleMetricInput(metric_id) {
    
    var checkbox = document.getElementById(metric_id);
    var low_id = metric_id + "-low";
    var high_id = metric_id + "-high";

    var lowInput = document.getElementById(low_id);
    var highInput = document.getElementById(high_id);
    
    if (checkbox.checked == true) {
        lowInput.disabled = false;
        highInput.disabled = false;
    } else {
        lowInput.disabled = true;
        highInput.disabled = true;
    }
}


function validateNewPatientForm() {
    var firstName = document.forms["register-patient-form"]["first_name"].value.trim();
    if (firstName == "" || firstName == null) {
        alert("First name cannot be blank");
        return false;
    }

    var lastName = document.forms["register-patient-form"]["last_name"].value.trim();
    if (lastName == "" || lastName == null) {
        alert("Last name cannot be blank");
        return false;
    }
    
    var email = document.forms["register-patient-form"]["patient_email"].value.trim();
    if (email == "" || email == null || email.length < 5) {
        alert("Email cannot be blank or less than 5 characters");
        return false;
    }

    var screenName = document.forms["register-patient-form"]["screen_name"].value.trim();
    if (screenName == "" || screenName == null) {
        alert("Email cannot be blank");
        return false;
    }

    var DOB = document.forms["register-patient-form"]["birth_year"].value.trim();
    if (DOB == "" || DOB == null) {
        alert("Year of birth cannot be blank");
        return false;
    }
}

function validateMessage() {
    var message = document.forms["support-message"]["message"].value.trim();
    if (message == "" || message == null) {
        alert("Support message cannot be blank");
        return false;
    }
}

function validateClinicalNote() {
    var clinicalNote = document.forms["clinical-note"]["note"].value.trim();
    if (clinicalNote == "" || clinicalNote == null) {
        alert("Clinical note cannot be blank");
        return false;
    }
}