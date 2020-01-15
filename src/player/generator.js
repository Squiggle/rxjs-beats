import { timer } from "rxjs";
import { take, repeat } from "rxjs/operators";

/**
 * Generates a repeating phrase of ticks
 * e.g. at an interval of 500ms and a phrase length of 4
 * will emit [0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, ...] at (n)ms intervals
 * @param {number} beatInterval in milliseconds
 * @param {number} beatsPerPhrase e.g. 8 beats
 */
export function generator(beatInterval, beatsPerPhrase) {
  // beats based on tempo
  console.log("beatsPerPhrase", beatsPerPhrase);
  return timer(0, beatInterval)
    .pipe(take(beatsPerPhrase + 1)) // fence post - includes zero
    .pipe(repeat());
}