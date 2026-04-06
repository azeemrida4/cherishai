let musicStarted = false;
function handleButtonClick() {
const music = document.getElementById("bgMusic");
const button = document.querySelector(".main-content button");

if (!musicStarted) {
const playPromise = music.play();
if (playPromise !== undefined) {
        playPromise.then(() => {
            console.log("Music started on front page!");
              let vol = 0;
                const fadeInterval = setInterval(() => {
                    if (vol < 0.5) { // final volume
                        vol += 0.02;
                        music.volume = vol;
                    } else {
                        clearInterval(fadeInterval);
                        button.textContent = "Go to Dress Up"; // change button text
                    }
                }, 100);
        }).catch(error => {
            console.log("Autoplay prevented, click required");
        });
    }
    musicStarted = true;
}else{
document.getElementById('frontpage').style.display = 'none';
document.getElementById('dressUpPage').style.display = 'block';
}
}


// Dress-up recommendations
function getRecommendations() {
    const fileInput = document.getElementById('userImage');
    const favColors = document.getElementById('favColors').value.split(',').map(c => c.trim());
    const stylePref = document.getElementById('stylePref').value;
    const output = document.getElementById('recommendations');

    if (!fileInput.files[0]) {
        alert("Please upload an image first!");
        return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.src = event.target.result;

        img.onload = function() {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);

            const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
            let r=0, g=0, b=0, count=0;
            for (let i=0; i<data.length; i+=4) {
                r += data[i];
                g += data[i+1];
                b += data[i+2];
                count++;
            }
            r = Math.floor(r/count);
            g = Math.floor(g/count);
            b = Math.floor(b/count);

            const skinTone = 'rgb(${r}, ${g}, ${b})';

            let outfits = [];
            if (r+g+b > 400) outfits.push('Pastel shades: pinks, light blues, lilac');
            else if (r+g+b > 250) outfits.push('Warm shades: peach, coral, warm pinks');
            else outfits.push('Bright & vibrant shades: fuchsia, turquoise, gold');

            if (favColors.length > 0) outfits.push('Your favorite colors: ' + favColors.join(', '));
            outfits.push('Suggested style: ' + stylePref);

            output.innerHTML = '<h2>Outfit Recommendations:</h2><p>' + outfits.join('<br>') + '</p>';
        };
    };
    reader.readAsDataURL(fileInput.files[0]);
}


const heartsContainer = document.querySelector('.hearts');

for(let i = 0; i < 15; i++){
    let heart = document.createElement('div');
    heart.textContent = '💖';
    heart.style.position = 'absolute';
    heart.style.left = Math.random() * 100 + '%';
    heart.style.fontSize = Math.random() * 40 + 20 + 'px';
    heart.style.animation = `float ${5 + Math.random() * 5}s linear infinite`;
    heartsContainer.appendChild(heart);
}
