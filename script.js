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

  if ((!preferredWidth && !preferredHeight) || (!newWidth && !newHeight)) {
    alert("Please enter at least one dimension in both sections.");
    return;
  }

  let pixelPerInch;
  if (preferredWidth) {
    pixelPerInch = uploadedImage.width / preferredWidth;
  } else {
    pixelPerInch = uploadedImage.height / preferredHeight;
  }

  let cropWidth = newWidth * pixelPerInch;
  let cropHeight = newHeight * pixelPerInch;

  let cols = Math.floor(uploadedImage.width / cropWidth);
  let rows = Math.floor(uploadedImage.height / cropHeight);
  
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

      canvasContainer.appendChild(canvas);
    }
  }
  window.scrollBy(0, window.innerHeight); // Scroll down after image cropped
}
