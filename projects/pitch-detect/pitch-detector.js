"use strict";
class RingBuffer {
  /**
   * @constructor
   * @param  {number} length Buffer length in frames.
   * @param  {number} channelCount Buffer channel count.
   */
  constructor(length, channelCount) {
    this._readIndex = 0;
    this._writeIndex = 0;
    this._framesAvailable = 0;

    this._channelCount = channelCount;
    this._length = length;
    this._channelData = [];
    for (let i = 0; i < this._channelCount; ++i) {
      this._channelData[i] = new Float32Array(length);
    }
  }

  /**
   * Getter for Available frames in buffer.
   *
   * @return {number} Available frames in buffer.
   */
  get framesAvailable() {
    return this._framesAvailable;
  }

  /**
   * Push a sequence of Float32Arrays to buffer.
   *
   * @param  {array} arraySequence A sequence of Float32Arrays.
   */
  push(arraySequence) {
    // The channel count of arraySequence and the length of each channel must
    // match with this buffer obejct.

    // Transfer data from the |arraySequence| storage to the internal buffer.
    let sourceLength = arraySequence[0].length;
    for (let i = 0; i < sourceLength; ++i) {
      let writeIndex = (this._writeIndex + i) % this._length;
      for (let channel = 0; channel < this._channelCount; ++channel) {
        this._channelData[channel][writeIndex] = arraySequence[channel][i];
      }
    }

    this._writeIndex += sourceLength;
    if (this._writeIndex >= this._length) {
      this._writeIndex = 0;
    }

    // For excessive frames, the buffer will be overwritten.
    this._framesAvailable += sourceLength;
    if (this._framesAvailable > this._length) {
      this._framesAvailable = this._length;
    }
  }

  /**
   * Pull data out of buffer and fill a given sequence of Float32Arrays.
   *
   * @param  {array} arraySequence An array of Float32Arrays.
   */
  pull(arraySequence) {
    // The channel count of arraySequence and the length of each channel must
    // match with this buffer obejct.

    // If the FIFO is completely empty, do nothing.
    if (this._framesAvailable === 0) {
      return;
    }

    let destinationLength = arraySequence[0].length;

    // Transfer data from the internal buffer to the |arraySequence| storage.
    for (let i = 0; i < destinationLength; ++i) {
      let readIndex = (this._readIndex + i) % this._length;
      for (let channel = 0; channel < this._channelCount; ++channel) {
        arraySequence[channel][i] = this._channelData[channel][readIndex];
      }
    }

    this._readIndex += destinationLength;
    if (this._readIndex >= this._length) {
      this._readIndex = 0;
    }

    this._framesAvailable -= destinationLength;
    if (this._framesAvailable < 0) {
      this._framesAvailable = 0;
    }
  }
} // class RingBuffer



var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var DEFAULT_AMDF_PARAMS = {
    sampleRate: 44100,
    minFrequency: 82,
    maxFrequency: 1000,
    ratio: 5,
    sensitivity: 0.1,
};
function AMDF(params) {
    if (params === void 0) { params = {}; }
    var config = __assign(__assign({}, DEFAULT_AMDF_PARAMS), params);
    var sampleRate = config.sampleRate;
    var minFrequency = config.minFrequency;
    var maxFrequency = config.maxFrequency;
    var sensitivity = config.sensitivity;
    var ratio = config.ratio;
    var amd = [];
    /* Round in such a way that both exact minPeriod as
     exact maxPeriod lie inside the rounded span minPeriod-maxPeriod,
     thus ensuring that minFrequency and maxFrequency can be found
     even in edge cases */
    var maxPeriod = Math.ceil(sampleRate / minFrequency);
    var minPeriod = Math.floor(sampleRate / maxFrequency);
    return function AMDFDetector(float32AudioBuffer) {
        var maxShift = float32AudioBuffer.length;
        var t = 0;
        var minval = Infinity;
        var maxval = -Infinity;
        var frames1, frames2, calcSub, i, j, u, aux1, aux2;
        // Find the average magnitude difference for each possible period offset.
        for (i = 0; i < maxShift; i++) {
            if (minPeriod <= i && i <= maxPeriod) {
                for (aux1 = 0, aux2 = i, t = 0, frames1 = [], frames2 = []; aux1 < maxShift - i; t++, aux2++, aux1++) {
                    frames1[t] = float32AudioBuffer[aux1];
                    frames2[t] = float32AudioBuffer[aux2];
                }
                // Take the difference between these frames.
                var frameLength = frames1.length;
                calcSub = [];
                for (u = 0; u < frameLength; u++) {
                    calcSub[u] = frames1[u] - frames2[u];
                }
                // Sum the differences.
                var summation = 0;
                for (u = 0; u < frameLength; u++) {
                    summation += Math.abs(calcSub[u]);
                }
                amd[i] = summation;
            }
        }
        for (j = minPeriod; j < maxPeriod; j++) {
            if (amd[j] < minval)
                minval = amd[j];
            if (amd[j] > maxval)
                maxval = amd[j];
        }
        var cutoff = Math.round(sensitivity * (maxval - minval) + minval);
        for (j = minPeriod; j <= maxPeriod && amd[j] > cutoff; j++)
            ;
        var searchLength = minPeriod / 2;
        minval = amd[j];
        var minpos = j;
        for (i = j - 1; i < j + searchLength && i <= maxPeriod; i++) {
            if (amd[i] < minval) {
                minval = amd[i];
                minpos = i;
            }
        }
        if (Math.round(amd[minpos] * ratio) < maxval) {
            return sampleRate / minpos;
        }
        else {
            return null;
        }
    };
}


class BypassProcessor extends AudioWorkletProcessor {

  constructor(options){
    super(options);
    this._sampleRate = options.processorOptions.sampleRate;
    this._pitchDetector = AMDF({
      sampleRate: this._sampleRate
    });

    this._kernelBufferSize = options.processorOptions.kernelBufferSize;
    this._inputRingBuffer =
        new RingBuffer(this._kernelBufferSize, 1);

      this._heapInputBuffer = [new Float32Array(this._kernelBufferSize)];
  }

  
    process(inputs, outputs, parameters) {
      // By default, the node has single input and output.
      const input = inputs[0][0];

      this._inputRingBuffer.push(inputs[0]);
      if (this._inputRingBuffer.framesAvailable >= this._kernelBufferSize) {
        // Get the queued data from the input ring buffer.
        this._inputRingBuffer.pull(this._heapInputBuffer);
        

        this.port.postMessage({
          pitch: this._pitchDetector(this._heapInputBuffer[0])
        });
      }

      

  
      return true;
    }
  }
  
  registerProcessor('pitch-detector', BypassProcessor);