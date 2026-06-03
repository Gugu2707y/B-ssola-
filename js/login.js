function togglePasswordVisibility(idInput) {
    const input = document.getElementById(idInput);
    const icon = input.nextElementSibling;
    
    if (input.type === "password") {
        input.type = "text";
        icon.textContent = "visibility_off";
    } else {
        input.type = "password";
        icon.textContent = "visibility";
    }
}