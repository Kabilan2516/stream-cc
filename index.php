<?php
define('API_TOKEN', '581e6ba478b50d6c0e6428e7bc8d1fa15cf0008050438fdf58de7debc8afedd8');
$streamName = ($_GET["id"]);
$label = ($_GET["l"]);
error_reporting(E_ALL);

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'https://api.millicast.com/api/subscribe_token/');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt(
    $ch,
    CURLOPT_POSTFIELDS,
    '{"streams": [{"isRegex": false,"streamName": "' . $streamName . '"}],"label": "' . $label . '","allowedOrigins": ["viewer.millicast.com"],"expires": 15}'
);
$headers = array();
$headers[] = 'Authorization: Bearer ' . API_TOKEN;
$headers[] = 'Content-Type: application/json';
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

$result = curl_exec($ch);
if (curl_errno($ch)) {
    echo 'Error:' . curl_error($ch);
}
curl_close($ch);
$response = json_decode($result, true);
// print_r($response);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Millicast Audio Capture</title>
    <style>
        #transcriptionText {
            font-size: 20px;
            color: white;
            background-color: black;
            padding: 10px;
            border-radius: 5px;
            position: fixed;
            bottom: 50px;
            width: 100%;
            text-align: center;
        }
        video {
            width: 50%;
            height: 50%;
        }
    </style>
</head>
<body>
    <h1>Millicast Audio Capture with WebSocket</h1>
    <video id="videoElement" controls autoplay></video>
    <button id="ccButton">CC</button>
    <div id="transcriptionText"></div>

    <script src="https://cdn.jsdelivr.net/npm/@millicast/sdk@latest/dist/millicast.umd.js"></script>
    <script>
        const PROXY_WS_URL = 'ws://localhost:8080'; // Replace with your WebSocket URL
        const streamName = <?php echo json_encode($streamName); ?>;
        const streamAccountId = <?php echo json_encode($label); ?>;

        let ccEnabled = false;
        let audioContext, audioWorkletNode, proxyWs, mediaStreamSource;

        async function startMillicast() {
            const millicastClient = new millicast.View(streamName, () => millicast.Director.getSubscriber({
                streamName,
                streamAccountId
            }));

            const videoElement = document.getElementById('videoElement');
            const ccButton = document.getElementById('ccButton');

            millicastClient.on("track", (event) => {
                const stream = event.streams[0];
                videoElement.srcObject = stream; // Set the video element's source to the received stream
            });

            try {
                await millicastClient.connect();
                console.log('Connected to Millicast stream');

                // Connect to WebSocket automatically when the page loads
                connectWebSocket();

                ccButton.addEventListener('click', () => {
                    ccEnabled = !ccEnabled;
                    ccButton.textContent = ccEnabled ? 'Stop CC' : 'CC';

                    if (ccEnabled) {
                        startAudioProcessing(videoElement);
                    } else {
                        stopAudioProcessing();
                    }
                });

            } catch (e) {
                console.error('Connection failed:', e);
            }
        }

        function connectWebSocket() {
            proxyWs = new WebSocket(PROXY_WS_URL);

            proxyWs.onopen = () => {
                console.log('Connected to WebSocket proxy');
            };

            proxyWs.onmessage = (event) => {
                const transcriptionText = document.getElementById('transcriptionText');
                const data = JSON.parse(event.data);

                // Update the subtitle text with interim or final results
                transcriptionText.textContent = data.text;
            };

            proxyWs.onerror = (error) => {
                console.error('WebSocket error:', error);
            };

            proxyWs.onclose = (event) => {
                console.log('WebSocket closed:', event.code, event.reason);
            };
        }

        async function startAudioProcessing(videoElement) {
            const mediaStream = videoElement.srcObject; // Capture the video stream's media stream

            if (!mediaStream || mediaStream.getAudioTracks().length === 0) {
                console.error('No audio tracks found in the media stream');
                return;
            }

            const audioTrack = mediaStream.getAudioTracks()[0];
            audioContext = new AudioContext();
            mediaStreamSource = audioContext.createMediaStreamSource(new MediaStream([audioTrack]));

            await audioContext.audioWorklet.addModule('audio-processor.js');
            audioWorkletNode = new AudioWorkletNode(audioContext, 'audio-processor');

            audioWorkletNode.port.onmessage = (event) => {
                if (proxyWs && proxyWs.readyState === WebSocket.OPEN && ccEnabled) {
                    const int16Array = new Int16Array(event.data);
                    proxyWs.send(int16Array.buffer);
                }
            };

            mediaStreamSource.connect(audioWorkletNode);
            audioWorkletNode.connect(audioContext.destination);
        }

        function stopAudioProcessing() {
            if (audioWorkletNode) {
                audioWorkletNode.port.onmessage = null; // Remove the message event listener
                audioWorkletNode.disconnect(); // Disconnect the audio worklet node
                audioWorkletNode = null; // Nullify the worklet node to ensure it's not reused
            }

            if (audioContext) {
                audioContext.close(); // Close the audio context
                audioContext = null; // Nullify the context
            }
        }

        startMillicast();
    </script>

</body>
</html>
