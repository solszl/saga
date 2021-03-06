import { INTERNAL_EVENTS, TOOL_TYPE } from "../constants";
import BaseTool from "./base/base-tool";
import { randomId } from "./utils";
class WWWCTool extends BaseTool {
  constructor(config = {}) {
    super(config);
    this.isDown = false;
    this.oldOffset = null;
    this.step = null;
    this.type = TOOL_TYPE.WWWC;
    this.name = randomId();
    this._data = {
      id: this.name,
      type: this.type,
      wwwc: { ww: 0, wc: 0 },
    };
  }
  mouseDown(e) {
    super.mouseDown(e);

    const { screenX, screenY } = e.evt;
    this.isDown = true;
    this.oldOffset = [screenX, screenY];
    this.step = { ww: this.imageState.wwwc.ww, wc: this.imageState.wwwc.wc };
    // 读取配置
    const { wwStep, wcStep } = this.globalConfig["wwwc"];
    this.wwStep = wwStep;
    this.wcStep = wcStep;
  }

  documentMouseMove(e) {
    super.documentMouseMove(e);
    if (!this.isDown) {
      return;
    }
    const wwwc = {
      ww: +((e.screenX - this.oldOffset[0]) * this.wwStep + this.step.ww).toFixed(2),
      wc: +((e.screenY - this.oldOffset[1]) * this.wcStep + this.step.wc).toFixed(2),
    };
    this.data.wwwc = wwwc;
    this.$stage.fire(INTERNAL_EVENTS.TOOL_WWWC, { wwwc });
  }

  documentMouseUp(e) {
    super.documentMouseUp(e);
    this.isDown = false;
  }
}

export default WWWCTool;
