import * as snabbdom from "./snabbdom/snabbdom.js";
import classMod from "./snabbdom/modules/class.js";
import propsMod from "./snabbdom/modules/props.js";
import styleMod from "./snabbdom/modules/style.js";
import eventlistenersMod from "./snabbdom/modules/eventlisteners.js";

const patch = snabbdom.init([
  // Init patch function with chosen modules
  classMod, // makes it easy to toggle classes
  propsMod, // for setting properties on DOM elements
  styleMod, // handles styling on elements with support for animations
  eventlistenersMod, // attaches event listeners
]);

export default patch;

import "./module/actor-sheet.js";
