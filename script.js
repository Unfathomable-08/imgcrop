let uploadedImage = null; // Store uploaded image

document.getElementById("img").addEventListener("change", function (event) {
  let file = event.target.files[0]; // Get the selected file

  if (file) {
    let imgURL = URL.createObjectURL(file); // Create a URL for the file
    let image = new Image(); // Create an image object

    image.onload = function () {
      uploadedImage = image; // Store image for later use
      window.scrollBy(0, window.innerHeight); // Scroll down after image upload
    };

    image.src = imgURL; // Set the image source
  }
});

document.querySelector(".submit").addEventListener("click", function (event) {
  event.preventDefault(); // Prevent form submission

  if (!uploadedImage) {
    alert("Please upload an image before submitting.");
    return;
  }

  let preferredWidth = document.querySelector(".form-cont input:nth-of-type(1)").value;
  let preferredHeight = document.querySelector(".form-cont input:nth-of-type(2)").value;
  let newWidth = document.querySelector(".form-cont input:nth-of-type(3)").value;
  let newHeight = document.querySelector(".form-cont input:nth-of-type(4)").value;

  // Convert to numbers
  preferredWidth = preferredWidth ? parseFloat(preferredWidth) : null;
  preferredHeight = preferredHeight ? parseFloat(preferredHeight) : null;
  newWidth = newWidth ? parseFloat(newWidth) : null;
  newHeight = newHeight ? parseFloat(newHeight) : null;

  // Ensure at least one width and one height value are provided
  if ((!preferredWidth && !preferredHeight) || (!newWidth && !newHeight)) {
    alert("Please enter at least one width and one height in either section.");
    return;
  }

  let pixelPerInch;
  
  if (preferredWidth && preferredHeight) {
    let pixelPerInchWidth = uploadedImage.width / preferredWidth;
    let pixelPerInchHeight = uploadedImage.height / preferredHeight;
    pixelPerInch = (pixelPerInchWidth + pixelPerInchHeight) / 2; // Average PPI
  } else if (preferredWidth) {
    pixelPerInch = uploadedImage.width / preferredWidth;
  } else {
    pixelPerInch = uploadedImage.height / preferredHeight;
  }

  let cropWidth = newWidth ? newWidth * pixelPerInch : (uploadedImage.width / pixelPerInch);
  let cropHeight = newHeight ? newHeight * pixelPerInch : (uploadedImage.height / pixelPerInch);

  let cols = Math.ceil(uploadedImage.width / cropWidth);
  let rows = Math.ceil(uploadedImage.height / cropHeight);

  displayCroppedImages(uploadedImage, cropWidth, cropHeight, cols, rows);
});

function displayCroppedImages(image, cropWidth, cropHeight, cols, rows) {
  let canvasContainer = document.querySelector(".canvas-container");
  if (!canvasContainer) {
    canvasContainer = document.createElement("div");
    canvasContainer.classList.add("canvas-container");
    document.body.appendChild(canvasContainer);
  }
  canvasContainer.innerHTML = ""; // Clear previous images

  // Set CSS grid columns dynamically
  canvasContainer.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

  let croppedCanvases = []; // Store cropped images for downloading

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let canvas = document.createElement("canvas");
      let ctx = canvas.getContext("2d");

      canvas.width = cropWidth;
      canvas.height = cropHeight;

      ctx.drawImage(
        image,
        x * cropWidth,
        y * cropHeight,
        cropWidth,
        cropHeight,
        0,
        0,
        cropWidth,
        cropHeight
      );

      croppedCanvases.push(canvas);
      canvasContainer.appendChild(canvas);
    }
  }

  addDownloadButton(croppedCanvases); // Add download button
  window.scrollBy(0, window.innerHeight); // Scroll down after images are cropped
}

// ✅ Function to Add "Download All" Button
function addDownloadButton(croppedCanvases) {
  let existingBtn = document.querySelector(".download");
  if (existingBtn) existingBtn.remove(); // Remove existing button

  let downloadBtn = document.createElement("button");
  downloadBtn.classList.add("download");
  downloadBtn.textContent = "Download All";

  downloadBtn.addEventListener("click", async function () {
  for (let i = 0; i < croppedCanvases.length; i++) {
    let link = document.createElement("a");
    link.href = croppedCanvases[i].toDataURL("image/png");
    link.download = `cropped-image-${i + 1}.png`;

    // Wait a bit before downloading the next one
    await new Promise((resolve) => setTimeout(resolve, 500));

    link.click();
  }
});

  document.body.appendChild(downloadBtn);
                                                   }
