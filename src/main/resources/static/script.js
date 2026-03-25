const apiUrl = "http://localhost:8080/api/employees";

// DOM Elements
const form = document.getElementById("employee-form");
const message = document.getElementById("message");
const tableBody = document.querySelector("#employee-table tbody");
const formTitle = document.getElementById("form-title");
const employeeIdInput = document.getElementById("employee-id");

// Load employees on page load
window.addEventListener("DOMContentLoaded", fetchEmployees);

// Submit form (Add / Update)
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const employeeData = {
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        email: document.getElementById("email").value,
        department: document.getElementById("department").value,
        salary: parseFloat(document.getElementById("salary").value)
    };

    const id = employeeIdInput.value;

    try {
        let response;
        if (id) {
            // Update
            response = await fetch(`${apiUrl}/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(employeeData)
            });
        } else {
            // Create
            response = await fetch(apiUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(employeeData)
            });
        }

        const result = await response.json();

        if (!response.ok) throw new Error(result.message || "Error");

        message.textContent = id ? "Employee updated successfully!" : "Employee added successfully!";
        message.style.color = "green";

        form.reset();
        employeeIdInput.value = "";
        formTitle.textContent = "Add Employee";

        fetchEmployees();
    } catch (err) {
        message.textContent = err.message;
        message.style.color = "red";
    }
});

// Fetch and render employees
async function fetchEmployees() {
    tableBody.innerHTML = "";
    const response = await fetch(apiUrl);
    const employees = await response.json();

    employees.forEach(emp => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${emp.id}</td>
            <td>${emp.firstName} ${emp.lastName}</td>
            <td>${emp.email}</td>
            <td>${emp.department}</td>
            <td>${emp.salary}</td>
            <td>
                <button onclick="editEmployee(${emp.id})">Edit</button>
                <button onclick="deleteEmployee(${emp.id})">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Edit employee
async function editEmployee(id) {
    const response = await fetch(`${apiUrl}/${id}`);
    const emp = await response.json();

    employeeIdInput.value = emp.id;
    document.getElementById("firstName").value = emp.firstName;
    document.getElementById("lastName").value = emp.lastName;
    document.getElementById("email").value = emp.email;
    document.getElementById("department").value = emp.department;
    document.getElementById("salary").value = emp.salary;

    formTitle.textContent = "Update Employee";
}

// Delete employee
async function deleteEmployee(id) {
    if (!confirm("Are you sure you want to delete this employee?")) return;

    await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
    fetchEmployees();
}