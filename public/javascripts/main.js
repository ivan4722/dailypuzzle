
function validUsername(username) 
{
    for (let i = 0; i < username.length; i++) {
        let charCode = username.charCodeAt(i);
        if ((charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122) || (charCode >= 48 && charCode <= 57)) 
        {

        } 
        else 
        {
            return false;
        }
    }
    return true;
}
function containsUppercase(password) 
{
    for (let i = 0; i < password.length; i++) 
    {
        let charCode = password.charCodeAt(i);
        if (charCode >= 65 && charCode <= 90) 
        {
            return true;
        }
    }
    return false;
}
function containsLowercase(password) 
{
    for (let i = 0; i < password.length; i++) 
    {
        let charCode = password.charCodeAt(i);
        if (charCode >= 97 && charCode <= 122) 
        {
            return true;
        }
    }
    return false;
}
document.addEventListener('DOMContentLoaded', function () 
{
    document.getElementById('registrationForm').addEventListener('submit', function (event) {
        event.preventDefault();
        let isValid = validateForm();

        if (isValid) {
            this.submit();
        }
    });

    function validateForm() {
        let username = document.getElementById('username').value;
        let password = document.getElementById('password').value;
        let isValid = true; 
        document.getElementById('usernameError').innerHTML = '';
        document.getElementById('passwordError').innerHTML = '';
        if (!validUsername(username)) 
        {
            displayErrorMessage('Username can only consist of letters, and numbers.');
            isValid = false; 
        }

        if (password.trim().length < 10 || !containsLowercase(password) || !containsUppercase(password)) 
        {
            displayErrorMessage('Password must be at least 10 characters, and consist of uppercase and lowercase letters.');
            isValid = false; 
        }
        return isValid;
    }

    function displayErrorMessage(message) {
        let errorElement = document.createElement('div');
        errorElement.className = 'ui negative message';
        errorElement.innerHTML = '<div class="header">Error</div><p>' + message + '</p>';

        let form = document.getElementById('registrationForm');
        form.insertBefore(errorElement, form.firstChild);
    }
});
