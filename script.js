// Student records are stored as an array of JSON objects.
const STORAGE_KEY = "studentRecords";

// Load previously saved records from localStorage.
let students = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

// Get references to HTML elements.
const studentForm = document.getElementById("studentForm");
const studentTableBody = document.getElementById("studentTableBody");
const studentCount = document.getElementById("studentCount");
const emptyMessage = document.getElementById("emptyMessage");
const formMessage = document.getElementById("formMessage");

// Return the current value of an input field.
function getValue(id) {
    return document.getElementById(id).value.trim();
}

// Display or clear an error message for a field.
function showError(fieldId, message) {
    document.getElementById(fieldId + "Error").textContent = message;
    document.getElementById(fieldId).classList.toggle("invalid", message !== "");
}

// Clear all validation errors and the form status message.
function clearErrors() {
    const fields = ["studentName", "prn", "email", "mobile",
                    "department", "semester", "age"];

    fields.forEach(function (field) {
        showError(field, "");
    });

    formMessage.textContent = "";
    formMessage.className = "form-message";
}

// Validate all fields before a student record is saved.
function validateForm() {
    clearErrors();

    const name = getValue("studentName");
    const prn = getValue("prn");
    const email = getValue("email");
    const mobile = getValue("mobile");
    const department = getValue("department");
    const semester = getValue("semester");
    const ageText = getValue("age");
    const age = Number(ageText);

    let isValid = true;

    // Rule 1: Name is required and should contain valid characters.
    if (name === "") {
        showError("studentName", "Full name is required.");
        isValid = false;
    } else if (!/^[A-Za-z][A-Za-z .'-]{1,49}$/.test(name)) {
        showError("studentName", "Enter a valid name (2–50 characters).");
        isValid = false;
    }

    // Rule 2: PRN must contain 7 to 12 digits.
    if (!/^\d{7,12}$/.test(prn)) {
        showError("prn", "PRN must contain 7 to 12 digits.");
        isValid = false;
    } else if (students.some(student => student.prn === prn)) {
        showError("prn", "This PRN is already registered.");
        isValid = false;
    }

    // Rule 3: Email must follow a valid email format.
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
        showError("email", "Enter a valid email address.");
        isValid = false;
    } else if (students.some(student => student.email.toLowerCase() === email.toLowerCase())) {
        showError("email", "This email is already registered.");
        isValid = false;
    }

    // Rule 4: Mobile number must be a valid 10-digit Indian number.
    if (!/^[6-9]\d{9}$/.test(mobile)) {
        showError("mobile", "Enter a valid 10-digit mobile number.");
        isValid = false;
    }

    // Rule 5: Department must be selected.
    if (department === "") {
        showError("department", "Please select a department.");
        isValid = false;
    }

    // Rule 6: Semester must be selected.
    if (!/^[1-8]$/.test(semester)) {
        showError("semester", "Please select a semester from 1 to 8.");
        isValid = false;
    }

    // Rule 7: Age must be between 16 and 60.
    if (ageText === "" || !Number.isInteger(age) || age < 16 || age > 60) {
        showError("age", "Age must be a whole number between 16 and 60.");
        isValid = false;
    }

    return isValid;
}

// Save the current students array in browser localStorage.
function saveToLocalStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
}

// Add a new student object to the array.
function addStudent(student) {
    students.push(student);
    saveToLocalStorage();
    displayStudents();
}

// Create and display the student table dynamically.
function displayStudents() {
    studentTableBody.innerHTML = "";

    students.forEach(function (student, index) {
        const row = document.createElement("tr");

        // Escape user-entered values before inserting them into table HTML.
        function escapeHTML(value) {
            return String(value).replace(/[&<>"']/g, function (character) {
                return {
                    "&": "&amp;",
                    "<": "&lt;",
                    ">": "&gt;",
                    '"': "&quot;",
                    "'": "&#39;"
                }[character];
            });
        }

        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${escapeHTML(student.name)}</td>
            <td>${escapeHTML(student.prn)}</td>
            <td>${escapeHTML(student.email)}</td>
            <td>${escapeHTML(student.mobile)}</td>
            <td>${escapeHTML(student.department)}</td>
            <td>${escapeHTML(student.semester)}</td>
            <td>${escapeHTML(student.age)}</td>
            <td><button class="delete-btn" data-prn="${escapeHTML(student.prn)}">Delete</button></td>
        `;

        studentTableBody.appendChild(row);
    });

    studentCount.textContent = students.length;
    emptyMessage.style.display = students.length === 0 ? "block" : "none";
}

// Handle form submission.
studentForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!validateForm()) {
        formMessage.textContent = "Please correct the errors before registering.";
        formMessage.className = "form-message failure";
        return;
    }

    // Create a JSON object using the entered student details.
    const student = {
        name: getValue("studentName"),
        prn: getValue("prn"),
        email: getValue("email"),
        mobile: getValue("mobile"),
        department: getValue("department"),
        semester: getValue("semester"),
        age: Number(getValue("age"))
    };

    addStudent(student);

    formMessage.textContent = "Student registered successfully!";
    formMessage.className = "form-message success";

    studentForm.reset();
    clearErrors();
    formMessage.textContent = "Student registered successfully!";
    formMessage.className = "form-message success";
});

// Handle delete button clicks using event delegation.
studentTableBody.addEventListener("click", function (event) {
    if (event.target.classList.contains("delete-btn")) {
        const prnToDelete = event.target.dataset.prn;

        const shouldDelete = confirm("Are you sure you want to delete this student?");
        if (!shouldDelete) {
            return;
        }

        students = students.filter(student => student.prn !== prnToDelete);
        saveToLocalStorage();
        displayStudents();

        formMessage.textContent = "Student record deleted successfully.";
        formMessage.className = "form-message success";
    }
});

// Clear validation messages when the form is reset.
studentForm.addEventListener("reset", function () {
    setTimeout(clearErrors, 0);
});

// Display saved records when the page loads.
displayStudents();
