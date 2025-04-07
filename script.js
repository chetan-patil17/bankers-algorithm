/**
 * Generates the input tables for Total Resources, Allocation, and Maximum Allocation.
 * It dynamically creates tables based on user input for the number of processes and resources.
 */
function generateTables() {
    let processCount = document.getElementById("processes").value;  // Get the number of processes
    let resourceCount = document.getElementById("resources").value; // Get the number of resources

    // Generate tables for Total Resources, Allocation, and Maximum Allocation
    let html = "<h3>Total Instances of all resources</h3>" + createTable("totalResources", 1, resourceCount);
    html += "<h3>Instances Allocated</h3>" + createTable("allocation", processCount, resourceCount);
    html += "<h3>Maximum Allocation Required</h3>" + createTable("maxAllocation", processCount, resourceCount);

    // Display generated tables in the container
    document.getElementById("tables-container").innerHTML = html;

    // Show the button to generate available resources
    document.getElementById("generate-available").style.display = "block";
}

/**
 * Creates an HTML table with input fields for user-defined matrix values.
 * @param {string} id - Table ID (totalResources, allocation, or maxAllocation).
 * @param {number} rows - Number of rows in the table.
 * @param {number} cols - Number of columns in the table.
 * @returns {string} - HTML string for the table.
 */
function createTable(id, rows, cols) {
    let html = `<table id="${id}"><tr><th>Resource Name/Process ID</th>`;
    
    // Generate resource column headers
    for (let j = 0; j < cols; j++) html += `<th>R${j}</th>`;
    html += "</tr>";

    // Generate table rows with input fields
    for (let i = 0; i < rows; i++) {
        html += `<tr><td>${id === "totalResources" ? "Total" : `Process ${i + 1}`}</td>`;
        for (let j = 0; j < cols; j++) {
            html += `<td><input type="number" min="0" value="0"></td>`; // Input field for matrix values
        }
        html += "</tr>";
    }
    html += "</table>";
    return html;
}

/**
 * Calculates the Available Resource Matrix and the Need Matrix.
 * This function retrieves data from the input tables, computes available resources,
 * and determines the need matrix.
 */
function calculateAvailableMatrix() {
    let processCount = document.getElementById("processes").value;  // Get process count
    let resourceCount = document.getElementById("resources").value; // Get resource count

    // Retrieve matrices from input tables
    let totalResources = getMatrixData("totalResources", 1, resourceCount)[0]; // Extract total resources as an array
    let allocation = getMatrixData("allocation", processCount, resourceCount); // Allocation matrix
    let maxAllocation = getMatrixData("maxAllocation", processCount, resourceCount); // Maximum required allocation matrix

    // Calculate Available Resources (Total Resources - Allocated Resources)
    let available = totalResources.slice();
    for (let i = 0; i < processCount; i++) {
        for (let j = 0; j < resourceCount; j++) {
            available[j] -= allocation[i][j];
        }
    }

    // Calculate the Need Matrix (Max Allocation - Allocation)
    let need = maxAllocation.map((row, i) => row.map((val, j) => val - allocation[i][j]));

    // Generate and display the Available Resources and Need Matrix tables
    let output = "<h3>Available Resources</h3>" + createAvailableTable(available);
    output += "<h3>Need Matrix</h3>" + createTableFromArray("need", need);

    document.getElementById("output").innerHTML = output;
}

/**
 * Creates a table displaying the available resource matrix.
 * @param {Array} array - Array representing available resources.
 * @returns {string} - HTML string for the available resources table.
 */
function createAvailableTable(array) {
    let html = `<table><tr>`;
    
    // Column headers for resources
    for (let j = 0; j < array.length; j++) html += `<th>R${j}</th>`;
    html += "</tr><tr>";
    
    // Available resource values
    for (let j = 0; j < array.length; j++) html += `<td>${array[j]}</td>`;
    html += "</tr></table>";
    
    return html;
}

/**
 * Creates a table displaying the Need Matrix.
 * @param {string} id - Table ID.
 * @param {Array} array - 2D array representing the Need Matrix.
 * @returns {string} - HTML string for the need matrix table.
 */
function createTableFromArray(id, array) {
    let html = `<table><tr><th>Process</th>`;
    
    // Column headers for resources
    for (let j = 0; j < array[0].length; j++) html += `<th>R${j}</th>`;
    html += "</tr>";

    // Generate table rows with process names and need values
    for (let i = 0; i < array.length; i++) {
        html += `<tr><td>P${i + 1}</td>`;
        for (let j = 0; j < array[i].length; j++) {
            html += `<td>${array[i][j]}</td>`;
        }
        html += "</tr>";
    }
    html += "</table>";
    return html;
}

/**
 * Retrieves numerical data from an HTML table and converts it into a 2D array.
 * @param {string} id - Table ID.
 * @param {number} rows - Number of rows to extract.
 * @param {number} cols - Number of columns to extract.
 * @returns {Array} - 2D array containing table data.
 */
function getMatrixData(id, rows, cols) {
    let table = document.getElementById(id); // Get the table element
    let matrix = [];

    // Iterate through table rows (skipping the header row)
    for (let i = 1; i <= rows; i++) {
        let row = [];
        for (let j = 1; j <= cols; j++) {
            // Get value from input fields, parse it to an integer, and default to 0 if empty
            row.push(parseInt(table.rows[i].cells[j].children[0].value) || 0);
        }
        matrix.push(row);
    }
    return matrix;
}

/**
 * Resets all tables and clears the output section.
 * Hides the "Generate Available Resources" button after reset.
 */
function resetTables() {
    document.getElementById("tables-container").innerHTML = ""; // Clear generated tables
    document.getElementById("output").innerHTML = ""; // Clear output results
    document.getElementById("generate-available").style.display = "none"; // Hide button
}
