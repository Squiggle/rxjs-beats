import template from "./test.template.html";

export class Test extends HTMLElement {
  
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = template;
  }

  connectedCallback() {
    const port = new SharedWorker("core.js").port;
    port.start();

    port.onmessage = (message) => {
      alert(message.data);
    };
    
    this.shadowRoot.querySelector("#test").addEventListener("click", () => {
      port.postMessage("test");
    });
    
  }
  
}