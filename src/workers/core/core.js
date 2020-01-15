import { generator } from "../../player/generator";
import { filter } from "rxjs/operators";

/**
 * Actions:
 * setTempo (number)
 * setTimeSignature (number)
 * play (boolean)
 * 
 * Messages:
 * { state: [] || null }
 */

let subscriptions = [];

/**
 * Receive message from the controller
 * data: {
 *  tempo: number,
 *  playing: boolean,
 *  // timeSignature: number (TODO)
 * }
 */
self.onmessage = function (message) {
  subscriptions.forEach(s => s.unsubscribe());
  const intervalLength = intervalFromTempo(message.data.tempo);

  const beatsInPhrase = 16; // TODO: configurable

  // init the phrase
  setPhrase(
    beatsInPhrase * intervalLength,
    beatsInPhrase, // TODO
    ["kick"], // just the kick drum for now
    message.data.playing
  );

  if (message.data.playing) {
    // generates regular beats as per the tempo
    // looping according ot the time signature
    const beats = generator(intervalLength, beatsInPhrase);

    // kick drum triggers every 1st and 4th beat
    const kick = beats
      .pipe(filter(beat => beat % 4 === 0))
      .subscribe(() => triggerBeat("kick"));

    const snare = beats
      .pipe(filter(beat => (beat + 2) % 4 === 0))
      .subscribe(() => triggerBeat("snare"));

    subscriptions.push(kick);
    subscriptions.push(snare);
  }
};

/**
 * Broadcast a new phrase
 * @param {number} tempo 
 * @param {number} beats 
 * @param {Array<string>} tracks 
 */
function setPhrase(phraseLength, beats, tracks, playing) {
  self.postMessage({
    action: "setPhrase",
    phrase: {
      phraseLength,
      beats,
      tracks,
      playing
    }
  });
}

/**
 * Trigger a new event on a track
 * @param {string} track 
 */
function triggerBeat(track) {
  self.postMessage({
    action: "trackEvent",
    trackName: track
  });
}

/**
 * Calculates the interval from a given tempo
 * e.g. 120 (bpm) = 500 (ms)
 * @param {number} tempo 
 * @returns {number} milliseconds
 */
function intervalFromTempo(tempo) {
  return 60 / tempo * 1000 / 4;
}