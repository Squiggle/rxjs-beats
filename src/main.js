// declare web components
import "./components/components";
import { fromEvent, combineLatest } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { Player } from "./player/player";

const webWorker = new Worker('core.js')

const controls = document.getElementById("controls");
const visualiser = document.getElementById("visualiser");

/**
 * Plugging in the controls as Observables.
 * tempoChanged, play and timeSignatureChanged events are emitted as CustomEvents
 * from the control element
 */
const tempo$ = fromEvent(controls, "tempoChanged")
  .pipe(map(tempoEvt => tempoEvt.detail))
  .pipe(startWith(120));
const play$ = fromEvent(controls, "play")
  .pipe(map(playEvt => playEvt.detail))
  .pipe(startWith(false));

const player = new Player();
play$.subscribe(evt => {
  if (evt) {
    player.init();
  }
});

// whenever any event is emitted, rebuild the state
// and update the webworker
combineLatest(play$, tempo$,
  (playing, tempo) => {
    return {
      playing,
      tempo
    };
  })
  .subscribe(message => {
    webWorker.postMessage(message);
  });

/**
 * Webworker will emit the following actions:
 * - setPhrase:
 *   { action: "setPhrase", beats: number, phraseLength: number }
 *   to set a new phrase (tempo/timeSignature/tracks)
 * - trackEvent
 *   { action: "trackEvent", trackName: string }
 *   to alert us to a trigger on a specific track
 */
webWorker.onmessage = (evt) => {
  console.log("webWorker message", evt.data);
  switch (evt.data.action) {
    case "setPhrase":
      // on setPhrase, update the visualiser's parameters
      visualiser.setAttribute("beats", evt.data.phrase.beats);
      visualiser.setAttribute("phrase-length", evt.data.phrase.phraseLength);
      if (evt.data.phrase.playing) {
        visualiser.setAttribute("playing", "playing");
      }
      else {
        visualiser.removeAttribute("playing");
      }
      break;
    case "trackEvent":
      // on track event, call visualiser action
      player.trigger(evt.data.trackName);
      // and play sound
      console.log("TODO: Track event", evt.data.trackName);
      break;
  }
};