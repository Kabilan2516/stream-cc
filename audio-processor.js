class AudioProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.buffer = [];
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];
    if (input && input[0]) {
      const samples = input[0];
      const int16Samples = this.convertFloat32ToInt16(samples);
      this.buffer.push(...int16Samples);

      // Send data every 1024 samples
      if (this.buffer.length >= 1024) {
        // Post a slice of the buffer
        this.port.postMessage(this.buffer.slice(0, 1024));
        // Retain the remaining samples in the buffer
        this.buffer = this.buffer.slice(1024);
      }
    }
    return true;
  }

  convertFloat32ToInt16(float32Array) {
    const int16Array = new Int16Array(float32Array.length);
    for (let i = 0; i < float32Array.length; i++) {
      // Convert and clamp the float32 values to int16
      int16Array[i] = Math.max(-1, Math.min(1, float32Array[i])) * 0x7fff;
    }
    return int16Array;
  }
}

registerProcessor("audio-processor", AudioProcessor);
