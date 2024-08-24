const http = require("http");
const { spawn } = require("child_process");
const { PassThrough } = require("stream");
const WebSocket = require("ws");
const fetch = require("cross-fetch");
const { createClient, LiveTranscriptionEvents } = require("./dist/main/index");

const WS_PORT = 8080;
const HTTP_PORT = 4000;

// WebSocket Server
const wss = new WebSocket.Server({ port: WS_PORT });

const clients = new Map();

console.log(`WebSocket server is running on ws://localhost:${WS_PORT}`);

wss.on("connection", (ws) => {
  const clientId = generateUniqueId(); // Generate a unique ID for each client
  const audioStream = new PassThrough();
  let ffmpegStarted = false;
  let ffmpeg;
  let deepgramConnection;

  clients.set(clientId, {
    ws,
    audioStream,
    ffmpeg,
    deepgramConnection,
    ffmpegStarted,
  });

  console.log(`Client connected: ${clientId}`);

  ws.on("message", (data) => {
    const client = clients.get(clientId);

    if (!client.ffmpegStarted) {
      // Initialize FFmpeg for this client when first audio data is received
      client.ffmpeg = spawn("ffmpeg", [
        "-f",
        "s16le",
        "-ar",
        "44100",
        "-ac",
        "1",
        "-i",
        "pipe:0",
        "-f",
        "mp3",
        "pipe:1",
      ]);

      client.ffmpeg.stdout.on("data", (chunk) => {
        // Handle the chunk data (if needed)
      });

      client.ffmpeg.stderr.on("data", (data) => {
        // Handle FFmpeg error logs (if needed)
      });

      client.ffmpeg.on("close", () => {
        console.log(`FFmpeg closed for client ${clientId}`);
      });

      client.audioStream.pipe(client.ffmpeg.stdin);
      client.ffmpegStarted = true;

      // Start the Deepgram connection for this client after the first audio data is received
      startDeepgramConnection(clientId);
    }

    client.audioStream.write(data);
  });

  ws.on("close", () => {
    console.log(`Client disconnected: ${clientId}`);
    stopDeepgramConnection(clientId);
    clients.delete(clientId); // Remove the client from the map
  });
});

const server = http.createServer((req, res) => {
  const urlParts = req.url.split("/");
  const clientId = urlParts[urlParts.length - 1]; // Extract client ID from URL

  const client = clients.get(clientId);

  if (client && req.url.startsWith("/audio/")) {
    if (client.ffmpegStarted) {
      res.writeHead(200, {
        "Content-Type": "audio/mpeg",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers": "Content-Type",
      });

      client.ffmpeg.stdout.on("data", (chunk) => {
        res.write(chunk); // Stream the audio data to the client
      });

      client.ffmpeg.stdout.on("end", () => {
        res.end(); // End the response when FFmpeg finishes
      });
    } else {
      res.writeHead(503, { "Content-Type": "text/plain" });
      res.end("Audio stream not ready yet, please retry.");
    }
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(HTTP_PORT, () => {
  console.log(`HTTP server is listening on http://localhost:${HTTP_PORT}`);
});

function startDeepgramConnection(clientId) {
  const url = `http://localhost:${HTTP_PORT}/audio/${clientId}`;
  const deepgram = createClient("e9a60717f0c7f3126de4d2f3f16129d42ea350f8");

  let is_finals = [];
  const client = clients.get(clientId);

  client.deepgramConnection = deepgram.listen.live({
    model: "nova-2",
    language: "en-US",
    smart_format: true,
    interim_results: true,
    utterance_end_ms: 1000,
    vad_events: true,
    endpointing: 300,
  });

  client.deepgramConnection.on(LiveTranscriptionEvents.Open, () => {
    console.log(`Deepgram connection opened for client ${clientId}`);

    fetch(url)
      .then((r) => r.body)
      .then((res) => {
        res.on("readable", () => {
          const chunk = res.read();
          if (chunk) {
            client.deepgramConnection.send(chunk);
          }
        });
      })
      .catch((err) =>
        console.error(`Fetch error for client ${clientId}: ${err}`)
      );
  });

  client.deepgramConnection.on(LiveTranscriptionEvents.Close, () => {
    console.log(`Deepgram connection closed for client ${clientId}`);
  });

  client.deepgramConnection.on(LiveTranscriptionEvents.Metadata, (data) => {
    console.log(`Deepgram Metadata for client ${clientId}: ${data}`);
  });

  client.deepgramConnection.on(LiveTranscriptionEvents.Transcript, (data) => {
    const sentence = data.channel.alternatives[0].transcript;

    if (sentence.length === 0) {
      return;
    }
    if (data.is_final) {
      is_finals.push(sentence);

      if (data.speech_final) {
        const utterance = is_finals.join(" ");
        console.log(`Speech Final for client ${clientId}: ${utterance}`);
        is_finals = [];
        client.ws.send(JSON.stringify({ type: "final", text: utterance }));
      } else {
        console.log(`Is Final for client ${clientId}: ${sentence}`);
        client.ws.send(JSON.stringify({ type: "final", text: sentence }));
      }
    } else {
      console.log(`Interim Results for client ${clientId}: ${sentence}`);
      client.ws.send(JSON.stringify({ type: "interim", text: sentence }));
    }
  });

  client.deepgramConnection.on(LiveTranscriptionEvents.UtteranceEnd, (data) => {
    const utterance = is_finals.join(" ");
    console.log(`Deepgram UtteranceEnd for client ${clientId}: ${utterance}`);
    is_finals = [];
    client.ws.send(JSON.stringify({ type: "final", text: utterance }));
  });

  client.deepgramConnection.on(
    LiveTranscriptionEvents.SpeechStarted,
    (data) => {
      console.log(`Deepgram SpeechStarted for client ${clientId}`);
    }
  );

  client.deepgramConnection.on(LiveTranscriptionEvents.Error, (err) => {
    console.error(`Deepgram error for client ${clientId}: ${err}`);
  });
}

function stopDeepgramConnection(clientId) {
  const client = clients.get(clientId);

  if (client && client.deepgramConnection) {
    client.deepgramConnection.finish(); // Close the Deepgram connection
    client.deepgramConnection = null;
    client.ffmpegStarted = false; // Reset ffmpeg flag

    if (client.ffmpeg) {
      client.ffmpeg.kill("SIGINT"); // Gracefully stop FFmpeg
      client.ffmpeg = null;
    }
  }
}

function generateUniqueId() {
  return Math.random().toString(36).substr(2, 9);
}
