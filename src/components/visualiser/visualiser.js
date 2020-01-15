import template from "./visualiser.template.html";

/**
 * Renders a visualisation for a given beat state
 * Attributes:
 * - beats (number)
 * - phrase-length (number, ms)
 * - playing ("playing")
 */
export class Visualiser extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = template;

    this.setPhraseLength = this.setPhraseLength.bind(this);
    this.setBeats = this.setBeats.bind(this);
    this.setPlaying = this.setPlaying.bind(this);

    this.phrases = this.shadowRoot.querySelector(".phrases");
    this.scan = this.shadowRoot.querySelector(".scan");
  }
  
  static get observedAttributes() { return ["beats", "phrase-length", "playing"]; }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log("attribute changed", name, newValue);
    switch (name) {
      case "beats":
        this.setBeats(newValue);
        break;
      case "playing":
        this.setPlaying(newValue);
        break;
      case "phrase-length":
        this.setPhraseLength(newValue);
        break;
    }
  }

  /**
   * Updates the number of beats displayed
   * @param {string} beatCount 
   */
  setBeats(beatCount) {
    // redraw the beats
    const beats = parseInt(beatCount);
    if (isNaN(beats)) {
      throw `${beatCount} is not a valid beat value`;
    }

    // clear phrases
    this.phrases.innerHTML = "";
    // populate the phrase numbers/marks
    for (var i = 0; i < beats; i++) {
      const beatElement = document.createElement("span");
      beatElement.className = "phrase-beat";
      beatElement.innerText = i + 1;
      this.phrases.appendChild(beatElement);
    }
  }

  /**
   * Toggle the "playing" state.
   * Whenever modified, resets the playing animation.
   * @param {string} playing values should be either "playing" or undefined
   */
  setPlaying(playing) {
    // set the scan animation
    const phraseLength = parseInt(this.getAttribute("phrase-length"));
    if (!isNaN(phraseLength)) {
      this.setScan(playing === "playing", phraseLength);
    }
  }

  /**
   * Sets the length (duration) of the entire phrase
   * @param {string} phraseLength 
   */
  setPhraseLength(phraseLength) {
    const duration = parseInt(phraseLength);
    if (isNaN(duration)) {
      throw `${phraseLength} is not a valid duration value`;
    }

    this.setScan(this.getAttribute("playing") === "playing", duration);
  }

  setScan(playing, phraseLength) {
    if (playing) {
      resetAnimationOnElement(this.scan);
      this.scan.setAttribute("style", `animation: ${phraseLength}ms linear infinite scan;`);
    }
    else {
      this.scan.setAttribute("style", "");
    }
  }
}

function resetAnimationOnElement(element) {
  element.style.animation = 'none';
  element.offsetHeight; /* trigger reflow */
  element.style.animation = null; 
}