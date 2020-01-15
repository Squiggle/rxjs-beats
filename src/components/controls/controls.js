import template from "./controls.template.html";

/**
 * Contains controls and basic settings for the drum machine
 */
export class Controls extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = template;

    // bind methods
    this.setNewTempo = this.setNewTempo.bind(this);
    this.setPlayState = this.setPlayState.bind(this);

    // track internal elements
    this.tempoInput = this.shadowRoot.querySelector("input[name='tempo']");
    this.playToggle = this.shadowRoot.querySelector("input[name='play']");
  }

  connectedCallback() {
    // when tempo is changed
    this.tempoInput.addEventListener("change", evt => this.setNewTempo(evt.target.value));
    // when play is toggled
    this.playToggle.addEventListener("change", evt => this.setPlayState(evt.target.checked));
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case "tempo":
        this.newValue && this.tempoInput.setAttribute("value", newValue);
        break;
      case "playing":
        typeof this.newValue === "boolean" && this.playToggle.setAttribute("checked", newValue);
        break;
    }
  }

  setNewTempo(tempoValue) {
    console.log("setNewTempo", tempoValue);
    const newTempo = parseInt(tempoValue);
    if (this.tempoInput.checkValidity()) {
      // raise event
      this.dispatchEvent(new CustomEvent("tempoChanged", { detail: newTempo }));
      // echo the new value in this component's tempo attribute
      this.setAttribute("tempo", newTempo);
    }
  }

  setPlayState(checked) {
    this.dispatchEvent(
      new CustomEvent("play", { detail: checked })
    );
  }
}