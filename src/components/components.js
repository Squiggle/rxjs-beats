// declare web components
import { Test } from "./test/test";
import { Controls } from "./controls/controls";
import { Visualiser } from "./visualiser/visualiser";

// register components
const components = [
  { tag: "beats-test", element: Test },
  { tag: "beats-controls", element: Controls },
  { tag: "beats-visualiser", element: Visualiser }
];

// register
(() => { components.forEach(component => customElements.define(component.tag, component.element)); })();