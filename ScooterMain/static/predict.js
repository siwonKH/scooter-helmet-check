let model;
async function loadModel() {
  model = await tf.loadGraphModel('/static/s200-best_web_model/model.json');
}

async function startWebcam() {
  const videoElement = document.getElementById('webcam');

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoElement.srcObject = stream;
  } catch (error) {
    console.log('Error accessing webcam:', error);
  }
}

async function predict() {
  const videoElement = document.getElementById('webcam');
  const canvas = document.getElementById('canvas');
  const context = canvas.getContext('2d');

  // Draw the video frame on the canvas
  context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

  // Preprocess the input image (resize to match the expected input size)
  const image = tf.browser.fromPixels(canvas);
  const resizedImage = tf.image.resizeBilinear(image, [640, 640]);
  const expandedImage = resizedImage.expandDims();
  const preprocessedImage = expandedImage.toFloat().div(255);

  const input = {};
  input[model.inputs[0].name] = preprocessedImage;
  const output = await model.executeAsync(input);

  // Get the prediction results
  const predictions = output[0].dataSync();

  // Dispose of tensors
  image.dispose();
  resizedImage.dispose();
  expandedImage.dispose();
  preprocessedImage.dispose();
  tf.dispose(output);

  // Clear previous drawings
  context.clearRect(0, 0, canvas.width, canvas.height);

  console.log("len: ", predictions.length)
  // Draw bounding boxes for predictions with score > 0.3
  for (let i = 0; i < predictions.length; i++) {
    const score = predictions[i];
    console.log(score)
    if (score > 0.001) {
      const x = predictions[i + 1] * canvas.width;
      const y = predictions[i + 2] * canvas.height;
      const width = (predictions[i + 3] - predictions[i + 1]) * canvas.width;
      const height = (predictions[i + 4] - predictions[i + 2]) * canvas.height;

      // Draw bounding box
      context.beginPath();
      context.rect(x, y, width, height);
      context.lineWidth = 2;
      context.strokeStyle = 'red';
      context.fillStyle = 'red';
      context.stroke();
      context.fillText(
          `${predictions[i + 5]} (${Math.round(score * 100)}%)`,
          x,
          y > 10 ? y - 5 : 10
      );
      console.log("drawing box")
    }
  }

  // Display prediction count
  // console.log('Helmet person cnt:', predictionCount);

  // Display predictions
  console.log(predictions);

  // Call predict() again on the next frame
  requestAnimationFrame(predict);
}

async function run() {
  await loadModel();
  startWebcam();
  predict();
}

// Run the main function
run();


