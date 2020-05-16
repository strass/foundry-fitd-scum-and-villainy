import * as snabbdom from "./snabbdom/snabbdom";
import classMod from "./snabbdom/modules/class";
import propsMod from "./snabbdom/modules/props";
import styleMod from "./snabbdom/modules/style";
import eventlistenersMod from "./snabbdom/modules/eventlisteners";

const patch = snabbdom.init([
  // Init patch function with chosen modules
  classMod, // makes it easy to toggle classes
  propsMod, // for setting properties on DOM elements
  styleMod, // handles styling on elements with support for animations
  eventlistenersMod, // attaches event listeners
]);

export default patch;

import "./module/actor-sheet";
