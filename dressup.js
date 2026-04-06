async function analyzeUserImage() {

    const fileInput = document.getElementById("userImage");
    const stylePref = document.getElementById("stylePref").value;
    const gender = document.getElementById("gender").value;
    const favColors = document.getElementById("favColors").value;
    const output = document.getElementById("recommendations");

    if (!fileInput.files[0]) {
        alert("Please upload an image first!");
        return;
    }

    const formData = new FormData();
    formData.append("file", fileInput.files[0]);
    formData.append("style", stylePref);
    formData.append("gender", gender);
    formData.append("colors", favColors);

    try {

        const response = await fetch("http://127.0.0.1:8000/analyze-image", {
            method: "POST",
            body: formData
        });

        if (!response.ok) {
            throw new Error("Server error");
        }

        const data = await response.json();
        document.getElementById("resultContainer").style.display="flex";
        document.getElementById("tryPairBtn").style.display = "block";

        const preview = document.getElementById("previewImage");
const toneCircle = document.getElementById("skinToneCircle");

// Show uploaded image
preview.src = URL.createObjectURL(fileInput.files[0]);

// Show skin tone inside circle
toneCircle.textContent = data.skin_tone;

// Optional: Change circle color based on tone
if (data.skin_tone === "light") {
    toneCircle.style.backgroundColor = "#f1c27d";
} else if (data.skin_tone === "medium") {
    toneCircle.style.backgroundColor = "#d2a679";
} else {
    toneCircle.style.backgroundColor = "#8d5524";
}

// Show recommendations
output.innerHTML =
    "<h3>Recommendations:</h3><ul>" +
    data.recommendations.map(r => `<li>${r}</li>`).join("") +
    "</ul>";

    } catch (error) {
        console.error(error);
        output.innerHTML = "<p style='color:red;'>Backend error. Check console.</p>";
    }
}
