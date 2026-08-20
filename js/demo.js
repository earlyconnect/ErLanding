// Function to show/hide platform-specific dynamic form fields
function togglePlatformFields() {
    const selectedService = document.getElementById('serviceSelect').value;
    const dynamicSections = document.querySelectorAll('.dynamic-fields');
    
    // Hide all dynamic field sections
    dynamicSections.forEach(section => {
        section.style.display = 'none';
    });

    // Show selected platform section
    if (selectedService) {
        const targetSection = document.getElementById(`fields-${selectedService}`);
        if (targetSection) {
            targetSection.style.display = 'block';
        }
    }
}

// Function to handle backend API submission to C# .NET 4.8
async function handleFormSubmit(event) {
    event.preventDefault();

    const submitBtn = event.target.querySelector('.btn-submit');
    submitBtn.disabled = true;
    submitBtn.innerText = 'Submitting...';

    const payload = {
        fullName: document.getElementById('fullName').value,
        workEmail: document.getElementById('workEmail').value,
        phone: document.getElementById('phone').value,
        companyName: document.getElementById('companyName').value,
        serviceSelect: document.getElementById('serviceSelect').value,
        techsCount: document.getElementById('techsCount')?.value || null,
        fsmSoftware: document.getElementById('fsmSoftware')?.value || null,
        smsVolume: document.getElementById('smsVolume')?.value || null,
        primarySmsGoal: document.getElementById('primarySmsGoal')?.value || null,
        agentCount: document.getElementById('agentCount')?.value || null,
        crmIntegration: document.getElementById('crmIntegration')?.value || null,
        notes: document.getElementById('notes').value
    };

    try {
        const response = await fetch('/api/demo/book', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            alert('Thank you! Your demo request has been sent to our team.');
            document.getElementById('demoForm').reset();
            togglePlatformFields(); 
        } else {
            alert('There was an issue submitting your request. Please try again.');
        }
    } catch (error) {
        console.error('Error submitting form:', error);
        alert('Network error. Please check your connection and try again.');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = 'Confirm & Book Demo';
    }
}
