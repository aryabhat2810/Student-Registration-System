STUDENT REGISTRATION SYSTEM
Web Technology - Practical No. 2

FILES
1. index.html - webpage structure and registration form
2. style.css  - webpage design and layout
3. script.js  - validation, array, JSON, DOM and localStorage logic

HOW TO RUN
1. Extract the ZIP file.
2. Open the Student_Registration_System folder in VS Code.
3. Open index.html using a browser, or use the VS Code Live Server extension.
4. Enter student details and click Register Student.
5. Check the Registered Students table.
6. Refresh the page to verify that records remain saved.

VALIDATION RULES
1. Name is required and must contain valid characters (2-50 characters).
2. PRN must contain 7-12 digits and must be unique.
3. Email must have a valid email format and must be unique.
4. Mobile number must be a 10-digit Indian mobile number beginning with 6, 7, 8 or 9.
5. Department must be selected.
6. Semester must be selected from 1 to 8.
7. Age must be a whole number between 16 and 60.

STORAGE
Student records are maintained in a JavaScript array of objects and saved in browser localStorage using JSON.stringify().
The records are loaded using JSON.parse() when the page opens.

NOTE
Data is stored in the current browser on the current device. Clearing browser site data may remove these records.
