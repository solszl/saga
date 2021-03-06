import { TOOL_ITEM_SELECTOR, TOOL_TYPE } from "../../constants";
import TextField from "../../shape/parts/textfield";
import BaseAnnotationTool from "../base/base-annotation-tool";
import { randomId, toCT } from "../utils";
class ProbeTool extends BaseAnnotationTool {
  constructor(config = {}) {
    super(Object.assign({}, config, { useDefaultMouseEffect: false }));
    this.type = TOOL_TYPE.PROBE;
    const name = randomId();
    this.name(name);
    this._data = {
      id: name,
      type: this.type,
      position: { x: 0, y: 0 },
    };
  }

  mouseDown(e) {
    super.mouseDown(e);

    this.initialUI();
    this.data.position = this.$stage.getPointerPosition();
    this.renderData();
  }

  mouseMove(e) {
    super.mouseMove(e);
    this.data.position = this.$stage.getPointerPosition();
    this.renderData();
  }

  mouseUp(e) {
    super.mouseUp(e);
    this.remove();
  }

  initialUI() {
    super.initialUI();
    const textfield = new TextField();
    textfield.setPosition({ x: 20, y: 10 });
    textfield.draggable(false);
    textfield.show();
    this.add(textfield);
    const toolLayer = this.$stage.findOne("#toolsLayer");
    toolLayer.add(this);

    this.UIInitialed = true;
  }

  renderData() {
    super.renderData();
    const { position } = this.data;
    const { width, height } = this.viewportState;
    const textfield = this.findOne(`.${TOOL_ITEM_SELECTOR.LABEL}`);
    this.setPosition(position);
    if (!this.verify(position.x, position.y, width, height)) {
      textfield.hide();
      return;
    }

    const { $transform: transform } = this;
    const point = transform.invertPoint(position.x, position.y);
    textfield.show();
    const ctValue = this._getCT(Math.round(point[0]), Math.round(point[1]));
    const { ctText } = this.globalConfig["ct"];
    textfield.text(`${ctText}: ${+ctValue.toFixed(2)}`);
  }

  _getCT(x, y) {
    const index = y * this.imageState.columns + x;

    return toCT(
      [this.imageState.pixelData[index]],
      this.imageState.slope,
      this.imageState.intercept
    )[0];
  }
}

export default ProbeTool;
