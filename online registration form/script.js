document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const phoneInput = document.querySelector("#phone");

  // Initialize intl-tel-input
  const iti = window.intlTelInput(phoneInput, {
      initialCountry: "cm",
      separateDialCode: true,
      utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@19.2.20/build/js/utils.js"
  });


  // Helper functions for showing/clearing errors
  const showError = (input, message) => {
      const errorDiv = input.parentElement.querySelector(".error-message");
      if (errorDiv) {
          errorDiv.textContent = message;
      }
      input.classList.add("error");
  };

  const clearError = (input) => {
      const errorDiv = input.parentElement.querySelector(".error-message");
      if (errorDiv) {
          errorDiv.textContent = "";
      }
      input.classList.remove("error");
  };

  form.addEventListener("submit", (e) => {
      e.preventDefault();
      let valid = true;

      // Full Name
      const nameInput = document.querySelector("#name");
      const name = nameInput.value.trim();
      clearError(nameInput);
      if(!name.match(/^[a-zA-Z\s]+$/) || name === "") {
          showError(nameInput, "Please enter a valid full name.");
          valid = false;
      }

      // Email
      const emailInput = document.querySelector("#email");
      const email = emailInput.value.trim();
      clearError(emailInput);
      if(!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
          showError(emailInput, "Please enter a valid email address.");
          valid = false;
      }

      // Phone
      clearError(phoneInput);
      if(!iti.isValidNumber()) {
          showError(phoneInput, "Please enter a valid phone number.");
          valid = false;
      }

      // Birthdate
      const birthInput = document.querySelector("#birthdate");
      const birthdate = birthInput.value;
      clearError(birthInput);
      if(!birthdate) {
          showError(birthInput, "Please enter your birth date.");
          valid = false;
      } else {
          const age = new Date().getFullYear() - new Date(birthdate).getFullYear();
          if(age < 18) {
              showError(birthInput, "You must be at least 18 years old.");
              valid = false;
          }
      }

      // Gender
      const genderBox = document.querySelector(".gender-box");
      const genderChecked = document.querySelector('input[name="gender"]:checked');
      const genderErrorDiv = genderBox.querySelector(".error-message");
      genderErrorDiv.textContent = "";
      if(!genderChecked) {
          genderErrorDiv.textContent = "Please select your gender.";
          valid = false;
      }

      // Country
      const countrySelect = document.querySelector(".select-box select");
      const countryErrorDiv = countrySelect.parentElement.querySelector(".error-message");
      countryErrorDiv.textContent = "";
      if(countrySelect.value === "Country") {
          countryErrorDiv.textContent = "Please select your country.";
          valid = false;
      }

      // Address, City, Region, Postal Code
      const addressInputs = document.querySelectorAll('.address input');
      addressInputs.forEach(input => {
          clearError(input);
          if(input.value.trim() === "") {
              showError(input, `Please fill out: ${input.placeholder}.`);
              valid = false;
          }
      });

      if(valid) {
          // Form is valid
          alert("Form submitted successfully!");
          form.reset();
          iti.setCountry("cm"); // reset phone input
      }
  });
});
