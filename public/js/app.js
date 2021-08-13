'use strict';

// window.isSecureContext could be used for Chrome
var isSecureOrigin = location.protocol === 'https:' ||
  location.host.includes('localhost');
if (!isSecureOrigin) {
  alert('getUserMedia() must be run from a secure origin: HTTPS or localhost.' +
    '\n\nChanging protocol to HTTPS');
  location.protocol = 'HTTPS';
}

var mediaRecorder;
var recordedBlob;
var sourceBuffer;
var lastVideo;
var log = '';

var originVideo = document.querySelector('#recorder');
var recordedVideo = document.querySelector('#recordedVideo');

var recordButton = document.querySelector('#record');
var stopRecordButton = document.querySelector('#stop');
var sendButton = document.querySelector('#upload');


/* Recording function */
async function startRecording(stream) {
  let recorder = new MediaRecorder(stream);
  let data = [];

  recorder.ondataavailable = event => data.push(event.data);
  recorder.start();

  let stopped = new Promise((resolve, reject) => {
    recorder.onstop = resolve;
    recorder.onerror = event => reject(event.name);
  });

  await Promise.all([
    stopped
  ]);
  return data;
}

/* Record button event registration and handler */
function recordButtonListener(event) {
  originVideo.style.display = 'block';
  recordedVideo.style.display = 'none';
  navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
  }).then(stream => {
    originVideo.srcObject = stream;
    originVideo.captureStream = originVideo.captureStream || originVideo.mozCaptureStream;
    return new Promise(resolve => originVideo.onplaying = resolve);
  })
  .then(() => startRecording(originVideo.captureStream()))
  .then (recordedChunks => {
    recordedBlob = new Blob(recordedChunks, { type: "video/webm" });
    recordedVideo.src = URL.createObjectURL(recordedBlob);
    log = "Successfully recorded " + recordedBlob.size + " bytes of " + recordedBlob.type + " media.";
  })
  .catch(log);
  originVideo.removeAttribute('controls');
  recordButton.style.display = 'none';
  stopRecordButton.style.display = 'inline-block';
  sendButton.style.display = 'none';
}


/* Stop stream function */
function stopStream(stream) {
  stream.getTracks().forEach(track => track.stop());
  originVideo.setAttribute('controls', true);
  recordButton.style.display = 'inline-block';
  stopRecordButton.style.display = 'none';
}

/* Stop record button event registration and handler */
function stopButtonListener() {
  originVideo.style.display = 'none';
  recordedVideo.style.display = 'block';
  sendButton.style.display = 'inline-block';
  stopStream(originVideo.srcObject);
}

async function syncSend(e) {
  // show loading
  recordButton.setAttribute('disabled', true);
  try {
    let isSent  = await send();
    this.disabled = false;
    recordButton.removeAttribute('disabled');
    console.log('Video uploaded');
  } catch(err) {
    recordButton.removeAttribute('disabled');
    console.log('Video failed to upload', err);
  }
  sendButton.style.display = 'none';
}

function send(e) {
  if (recordedBlob.length < 6) {
    return false;
  }
  var url = '/api/uploadvideo';
  
  var data = new FormData();
  data.append('videorecording', recordedBlob, 'video.webm');
  recordedBlob = null;

  return $.ajax({
      url: url,
      type: "post",
      data: data,
      enctype: 'multipart/form-data',
      processData: false,
      contentType: false,
      success: function(data) {
        // do nothing
      },
      error: function(e) {
        console.log('Result: Error occurred on uploading video because of ', e);
      }
  });
}

function registerEventListener() {
  originVideo = document.querySelector('#recorder');
  recordedVideo = document.querySelector('#recordedVideo');
  recordButton = document.querySelector('#record');
  sendButton = document.querySelector('#upload');
  stopRecordButton = document.querySelector('#stop');

  if (recordButton) {
    recordButton.addEventListener('click', recordButtonListener, false);
  }
  if (stopRecordButton) {
    stopRecordButton.addEventListener('click', stopButtonListener, false);
  }
  if (sendButton) {
    sendButton.addEventListener('click', syncSend);
  }
}

registerEventListener();
