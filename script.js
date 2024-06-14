async function getCameraStream() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const videoElement = document.getElementById('video');
      videoElement.srcObject = stream;
      return stream;
    } catch (error) {
      console.error('Error accessing the camera: ', error);
    }
  }
  
  async function setExposure(stream, exposureValue) {
    const track = stream.getVideoTracks()[0];
    const imageCapture = new ImageCapture(track);
  
    try {
      const capabilities = await imageCapture.getPhotoCapabilities();
  
      if ('exposureCompensation' in capabilities) {
        exposureValue = Math.max(capabilities.exposureCompensation.min, Math.min(exposureValue, capabilities.exposureCompensation.max));
  
        const constraints = {
          advanced: [{ exposureCompensation: exposureValue }]
        };
        await track.applyConstraints(constraints);
  
        console.log(`Exposure adjusted to: ${exposureValue}`);
      } else {
        console.log('Exposure adjustment not supported by this camera.');
      }
    } catch (error) {
      console.error('Error adjusting exposure: ', error);
    }
  }
  
  document.addEventListener('DOMContentLoaded', async () => {
    const stream = await getCameraStream();
  
    const exposureInput = document.getElementById('exposure');
    const exposureValueSpan = document.getElementById('exposureValue');
  
    exposureInput.addEventListener('input', async () => {
      const exposureValue = parseFloat(exposureInput.value);
      exposureValueSpan.textContent = exposureInput.value;
      await setExposure(stream, exposureValue);
    });
  });
  