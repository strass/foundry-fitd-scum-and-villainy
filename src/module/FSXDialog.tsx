import type { VNode } from "snabbdom/vnode";
import toVNode from "snabbdom/tovnode";
import patch from "../fitd-scum-and-villainy";

interface FSXDialogData extends Omit<ConfirmDialog, "content"> {
  content: (dialog: FSXDialog, data, options) => VNode;
  buttons: any[];
}

// TODO: move to either FitD or its own module
export default class FSXDialog extends Dialog {
  _vnode: VNode;
  data: FSXDialogData;
  constructor(dialogData: FSXDialogData, options = {}) {
    super(options);
    this.data = dialogData;
  }

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      template: undefined,
    });
  }
  
  activateListeners() {}

  _renderFSXTemplate(data, options) {
    return this.data.content(this, data, options);
  }

  async _renderInner(data, options) {
    if (
      // Check whether we've already created our vnode and reconciled it into the DOM
      this._vnode &&
      // If the Application has been closed, the element exists but its length is 0
      // and it is no longer a valid target to patch the vnode into
      (this.element as JQuery<HTMLElement>).length
    ) {
      this._vnode = patch(this._vnode, this._renderFSXTemplate(data, options));
    } else {
      this._vnode = patch(
        toVNode(document.createElement("div")),
        this._renderFSXTemplate(data, options)
      );
    }
    // Not sure if it's better to always return the element or only when it's created?
    // @ts-ignore TODO: for some reason I need this for _render to not return early
    // when I use this.entity.update
    this._state = 2;
    return (this._vnode.elm as unknown) as HTMLElement;
  }
}
