import template from "./visualiser.template.html";

/**
 * Renders a phrase with an animated bar
 * Attributes:
 * - beats (number)
 * - speed (number)
 */
export class Visualiser extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = template;
    this.container = this.shadowRoot.querySelector(".beats__visualiser--phrase");
  }

  setPhrase(beatState) {
    this.container.innerHTML = "";
    beatState.forEach(beat => {
      this.container.appendChild(createBeat(beat || false));
    });
  }
}

/**
 * Beat indicator
 */
function createPhrase(beats) {
  const beat = document.createElement("span");
  beat.className = "beat-indicator";
  return beat;
}