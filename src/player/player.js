export class Player {

  constructor() {
    this.audioContext = new AudioContext();

    this.sounds = {
      kick: () => createKick(this.audioContext),
      snare: () => createSnare(this.audioContext)
    };

    this.trigger = this.trigger.bind(this);
  }

  trigger(instrument) {
    const sound = this.sounds[instrument]();
    sound.connect(this.audioContext.destination);
    setTimeout(() => {
      sound.disconnect(this.audioContext.destination);
    }, 50);
  }

  init() {
    this.audioContext.resume();
  }
}

function createKick(context) {
  var oscillator = context.createOscillator();
  oscillator.frequency.value = 150;
  oscillator.type = "square";
  oscillator.start();
  return oscillator;
}

function createSnare(context, whiteNoiseBuffer) {
  var oscillator = context.createOscillator();
  oscillator.frequency.value = 440;
  oscillator.type = "square";
  oscillator.start();
  return oscillator;
}