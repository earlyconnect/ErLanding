/* ==========================================================================
   COMMON FORM UTILITIES (er-commonform01.js)
   Shared JS helpers for all forms using dynamic tables and signature pads.
   ========================================================================== */

let signaturePad;

/* --- 1. SIGNATURE PAD INITIALIZATION --- */
function initSignaturePad() {
    let canvas = document.getElementById("signatureCanvas");
    if (!canvas) return;

    let parentWidth = canvas.parentElement.offsetWidth || 500;
    canvas.width = parentWidth;
    canvas.height = 180;

    signaturePad = new SignaturePad(canvas, {
        backgroundColor: 'rgb(255, 255, 255)',
        penColor: '#0d3c47',
        minWidth: 1.5,
        maxWidth: 3.5
    });
}

// Auto-initialize canvas on load
document.addEventListener("DOMContentLoaded", initSignaturePad);
window.addEventListener("load", initSignaturePad);

function clearSignature() {
    if (signaturePad) {
        signaturePad.clear();
    }
}

/* --- 2. DYNAMIC TABLE ROW DELETION --- */
function deleteRow(btn) {
    let row = btn.closest('tr');
    let tbody = row.parentNode;
    if (tbody.rows.length > 1) {
        row.remove();
    } else {
        alert("At least one entry row is required.");
    }
}

/* --- 3. FILE UPLOAD TRIGGER HELPER --- */
function triggerUpload(id) {
    let input = document.getElementById(id);
    if (input) input.click();
}