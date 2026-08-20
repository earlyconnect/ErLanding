/* ==========================================================================
   PAGE APPLICATION SCRIPT (onboarding.app.js)
   Specific ONLY to onboarding.html.
   ========================================================================== */

let slaViewed = false;

/* --- 1. SLA UNLOCK HANDLER --- */
function unlockSignature() {
    slaViewed = true;

    let signerName = document.getElementById('SlaSignerName');
    let signerTitle = document.getElementById('SlaSignerTitle');
    let overlay = document.getElementById('sigLockOverlay');

    if (signerName) {
        signerName.disabled = false;
        signerName.placeholder = "Full Name";
    }
    if (signerTitle) {
        signerTitle.disabled = false;
        signerTitle.placeholder = "e.g. Owner / General Manager";
    }
    if (overlay) {
        overlay.style.display = 'none';
    }
}

/* --- 2. DYNAMIC ROW ADDERS FOR ONBOARDING TABLES --- */
function addLocationRow() {
    let tbody = document.querySelector('#TableLocations tbody');
    let newRow = `
        <tr>
            <td><input type="text" class="form-control-custom" required placeholder="Location Name"></td>
            <td><input type="text" class="form-control-custom" placeholder="Sales Account"></td>
            <td><input type="text" class="form-control-custom" required placeholder="Address"></td>
            <td><button type="button" class="btn-row-del" onclick="deleteRow(this)"><i class="fa fa-trash"></i></button></td>
        </tr>`;
    tbody.insertAdjacentHTML('beforeend', newRow);
}

function addCoverageRow() {
    let tbody = document.querySelector('#TableCoverage tbody');
    let newRow = `
        <tr>
            <td><input type="text" class="form-control-custom" required placeholder="Zip Code"></td>
            <td><input type="text" class="form-control-custom" required placeholder="Location Name"></td>
            <td><button type="button" class="btn-row-del" onclick="deleteRow(this)"><i class="fa fa-trash"></i></button></td>
        </tr>`;
    tbody.insertAdjacentHTML('beforeend', newRow);
}

function addUserRow() {
    let tbody = document.querySelector('#TableUsers tbody');
    let newRow = `
        <tr>
            <td><input type="text" class="form-control-custom" required placeholder="First Name"></td>
            <td><input type="text" class="form-control-custom" required placeholder="Last Name"></td>
            <td><input type="text" class="form-control-custom" placeholder="Tech ID"></td>
            <td><input type="text" class="form-control-custom" required placeholder="Location Name"></td>
            <td>
                <select class="form-control-custom" required>
                    <option value="Technician" selected>Technician</option>
                    <option value="Admin">Admin</option>
                    <option value="CSR">CSR</option>
                    <option value="Part Mgr">Part Mgr</option>
                    <option value="Tech Manager">Tech Manager</option>
                </select>
            </td>
            <td><button type="button" class="btn-row-del" onclick="deleteRow(this)"><i class="fa fa-trash"></i></button></td>
        </tr>`;
    tbody.insertAdjacentHTML('beforeend', newRow);
}

/* --- 3. ONBOARDING CSV FILE PARSERS --- */
function parseCoverageCSV(file) {
    if (!file) return;
    let reader = new FileReader();
    reader.onload = function(e) {
        let lines = e.target.result.split(/\r\n|\n/);
        let tbody = document.querySelector('#TableCoverage tbody');
        
        if (tbody.rows.length === 1 && !tbody.rows[0].cells[0].querySelector('input').value) {
            tbody.innerHTML = '';
        }

        lines.forEach((line, idx) => {
            if (!line.trim()) return;
            let cols = line.split(',').map(c => c.trim().replace(/^["']|["']$/g, ''));
            if (idx === 0 && cols[0].toLowerCase().includes('zip')) return;

            tbody.insertAdjacentHTML('beforeend', `
                <tr>
                    <td><input type="text" class="form-control-custom" required value="${cols[0] || ''}" placeholder="Zip Code"></td>
                    <td><input type="text" class="form-control-custom" required value="${cols[1] || 'Main Warehouse'}" placeholder="Location Name"></td>
                    <td><button type="button" class="btn-row-del" onclick="deleteRow(this)"><i class="fa fa-trash"></i></button></td>
                </tr>`);
        });
    };
    reader.readAsText(file);
}

function parseUsersCSV(file) {
    if (!file) return;
    let reader = new FileReader();
    reader.onload = function(e) {
        let lines = e.target.result.split(/\r\n|\n/);
        let tbody = document.querySelector('#TableUsers tbody');
        
        if (tbody.rows.length === 1 && !tbody.rows[0].cells[0].querySelector('input').value) {
            tbody.innerHTML = '';
        }

        lines.forEach((line, idx) => {
            if (!line.trim()) return;
            let cols = line.split(',').map(c => c.trim().replace(/^["']|["']$/g, ''));
            if (idx === 0 && (cols[0].toLowerCase().includes('first') || cols[0].toLowerCase().includes('name'))) return;

            let type = cols[4] || 'Technician';
            tbody.insertAdjacentHTML('beforeend', `
                <tr>
                    <td><input type="text" class="form-control-custom" required value="${cols[0] || ''}" placeholder="First Name"></td>
                    <td><input type="text" class="form-control-custom" required value="${cols[1] || ''}" placeholder="Last Name"></td>
                    <td><input type="text" class="form-control-custom" value="${cols[2] || ''}" placeholder="Tech ID"></td>
                    <td><input type="text" class="form-control-custom" required value="${cols[3] || 'Main Warehouse'}" placeholder="Location Name"></td>
                    <td>
                        <select class="form-control-custom" required>
                            <option value="Technician" ${type.toLowerCase().includes('tech') ? 'selected' : ''}>Technician</option>
                            <option value="Admin" ${type.toLowerCase().includes('admin') ? 'selected' : ''}>Admin</option>
                            <option value="CSR" ${type.toLowerCase().includes('csr') ? 'selected' : ''}>CSR</option>
                            <option value="Part Mgr" ${type.toLowerCase().includes('part') ? 'selected' : ''}>Part Mgr</option>
                            <option value="Tech Manager" ${type.toLowerCase().includes('manager') ? 'selected' : ''}>Tech Manager</option>
                        </select>
                    </td>
                    <td><button type="button" class="btn-row-del" onclick="deleteRow(this)"><i class="fa fa-trash"></i></button></td>
                </tr>`);
        });
    };
    reader.readAsText(file);
}

/* --- 4. CSV GENERATOR --- */
function generateCSVString() {
    let csvRows = [];

    // Section 1: Company Information
    csvRows.push("--- COMPANY INFORMATION ---");
    csvRows.push("Company Name,Short Name,Time Zone,Address,Address 2,City,State,Zip,Email,Phone");
    let compRow = [
        `"${document.getElementById('CompanyName').value}"`,
        `"${document.getElementById('ShortName').value}"`,
        `"${document.getElementById('TimeZone').value}"`,
        `"${document.getElementById('Address').value}"`,
        `"${document.getElementById('Address2').value}"`,
        `"${document.getElementById('City').value}"`,
        `"${document.getElementById('State').value}"`,
        `"${document.getElementById('ZipCode').value}"`,
        `"${document.getElementById('CompanyEmail').value}"`,
        `"${document.getElementById('CompanyPhone').value}"`
    ];
    csvRows.push(compRow.join(","));
    csvRows.push("");

    function getCreds(label) {
        let labels = Array.from(document.querySelectorAll('label'));
        let targetLabel = labels.find(el => el.textContent.trim().toLowerCase() === label.toLowerCase());
        if (targetLabel && targetLabel.nextElementSibling) {
            let inputs = targetLabel.nextElementSibling.querySelectorAll('input');
            let user = inputs[0] ? inputs[0].value.trim() : '';
            let pass = inputs[1] ? inputs[1].value.trim() : '';
            if (user || pass) {
                return `"${label}","${user}","${pass}"`;
            }
        }
        return null;
    }

    // Section 2: Account Information (Dispatchers)
    csvRows.push("--- ACCOUNT INFORMATION (DISPATCHERS) ---");
    csvRows.push("Platform,User ID,Password");
    let dispatchers = [
        "American Home Shield",
        "LG (GSFS+)",
        "Midea",
        "National Service Alliance",
        "Samsung (GSPN)",
        "ServiceBench",
        "ServicePower"
    ];
    dispatchers.forEach(disp => {
        let row = getCreds(disp);
        if (row) csvRows.push(row);
    });
    csvRows.push("");

    // Section 3: Account Information (Part Distributors)
    csvRows.push("--- ACCOUNT INFORMATION (PART DISTRIBUTORS) ---");
    csvRows.push("Distributor,User ID,Password");
    let distributors = [
        "Encompass",
        "Marcone",
        "ReliableParts"
    ];
    distributors.forEach(dist => {
        let row = getCreds(dist);
        if (row) csvRows.push(row);
    });
    csvRows.push("");

    // Section 4: Office Locations
    csvRows.push("--- OFFICE LOCATIONS ---");
    csvRows.push("Location Name,Sales Account,Address");
    document.querySelectorAll('#TableLocations tbody tr').forEach(tr => {
        let inputs = tr.querySelectorAll('input');
        if (inputs[0] && inputs[0].value) {
            csvRows.push(`"${inputs[0].value}","${inputs[1].value}","${inputs[2].value}"`);
        }
    });
    csvRows.push("");

    // Section 5: Service Coverage
    csvRows.push("--- SERVICE COVERAGE ---");
    csvRows.push("Zip Code,Location Name");
    document.querySelectorAll('#TableCoverage tbody tr').forEach(tr => {
        let inputs = tr.querySelectorAll('input');
        if (inputs[0] && inputs[0].value) {
            csvRows.push(`"${inputs[0].value}","${inputs[1].value}"`);
        }
    });
    csvRows.push("");

    // Section 6: Users & Technicians
    csvRows.push("--- USERS & TECHNICIANS ---");
    csvRows.push("First Name,Last Name,Tech ID,Location Name,User Type");
    document.querySelectorAll('#TableUsers tbody tr').forEach(tr => {
        let inputs = tr.querySelectorAll('input');
        let select = tr.querySelector('select');
        if (inputs[0] && inputs[0].value) {
            csvRows.push(`"${inputs[0].value}","${inputs[1].value}","${inputs[2].value}","${inputs[3].value}","${select.value}"`);
        }
    });
    csvRows.push("");

    // Section 7: SLA Authorization Signature
    csvRows.push("--- SLA AUTHORIZATION ---");
    csvRows.push("Signer Name,Title,Date Signed,Signature Vector Code");
    let signerName = document.getElementById('SlaSignerName') ? document.getElementById('SlaSignerName').value : '';
    let signerTitle = document.getElementById('SlaSignerTitle') ? document.getElementById('SlaSignerTitle').value : '';
    let dateSigned = new Date().toISOString();
    let svgSignature = signaturePad ? signaturePad.toDataURL("image/svg+xml") : "";
    
    csvRows.push(`"${signerName}","${signerTitle}","${dateSigned}","${svgSignature}"`);

    return csvRows.join("\n");
}

/* --- 5. FORM SUBMISSION (EMAILJS HANDLER) --- */
function handleOnboardingSubmit(e) {
    e.preventDefault();

    if (!slaViewed) {
        alert("You must click 'View Full SLA' to review the agreement before signing.");
        return;
    }

    if (!signaturePad || signaturePad.isEmpty()) {
        alert("Please draw your SLA signature on the canvas before submitting.");
        return;
    }

    let csvContent = generateCSVString();
    let companyName = document.getElementById('CompanyName').value;
    let userEmail = document.getElementById('CompanyEmail').value;
    let signatureBase64 = signaturePad.toDataURL("image/png");

    let templateParams = {
        company_name: companyName,
        reply_email: userEmail,
        csv_data: csvContent,
        signature_img: signatureBase64
    };

    emailjs.send('service_eronboarding', 'template_j0b8n0r', templateParams)
    .then(function() {
        alert('Thank you! Your onboarding information and SLA signature have been submitted.');
        document.getElementById('onboardingForm').reset();
        clearSignature();
    }, function(error) {
        alert('Failed to send onboarding submission: ' + (error.text || JSON.stringify(error)));
        console.error('EmailJS Error:', error);
    });
}