import AngleTool from "./tools/annotation/angle-tool";
import EllipseTool from "./tools/annotation/ellipse-tool";
import LengthTool from "./tools/annotation/length-tool";
import ProbeTool from "./tools/annotation/probe-tool";
import MagnifyTool from "./tools/magnify-tool";
import PolygonTool from "./tools/polygon-tool";
import RotationTool from "./tools/rotation-tool";
import ScaleTool from "./tools/scale-tool";
import StackTool from "./tools/stack-tool";
import StackWheelTool from "./tools/stack-wheel-tool";
import TranslateTool from "./tools/translate-tool";
import WWWCTool from "./tools/wwwc-tool";

export const TOOL_CONSTANTS = {
  HIT_STROKE_WIDTH: 20,
  ANCHOR_HIT_STROKE_WIDTH: 20,
};

export const TOOL_COLORS = {
  HOVER: {
    "default-color": "#5BD1AE",
    ".node-anchor": "#5BD1AE",
    ".node-item": "#5BD1AE",
    ".node-label": "#5BD1AE",
  },
  NORMAL: {
    "default-color": "#2AC7F6",
    ".node-anchor": "#2AC7F6",
    ".node-item": "#2AC7F6",
    ".node-label": "#2AC7F6",
  },
};

export const TOOL_ITEM_SELECTOR = {
  ANCHOR: "node-anchor",
  ITEM: "node-item",
  DASHLINE: "node-dashline",
  LABEL: "node-label",
};

export const TOOL_TYPE = {
  STACK_SCROLL: "stack_scroll",
  STACK_WHEEL_SCROLL: "stack_wheel_scroll",
  MAGNIFYING: "magnifying",
  WWWC: "wwwc",
  LENGTH: "length",
  ANGLE: "angle",
  PROBE: "probe",
  ELLIPSE_ROI: "ellipse_roi",
  POLYGON: "polygon",
  ROTATION: "rotation",
  SCALE: "scale",
  TRANSLATE: "translate",
};

export const INTERNAL_EVENTS = {
  DATA_CREATED: "tx_data_created",
  DATA_UPDATED: "tx_data_updated",
  DATA_REMOVED: "tx_data_removed",
  TOOL_TRANSLATE: "tx_tool_translate",
  TOOL_ROTATION: "tx_tool_rotation",
  TOOL_SCALE: "tx_tool_scale",
  TOOL_WWWC: "tx_tool_wwwc",
  TOOL_STACK_CHANGE: "tx_stack_change",
  TOOL_FLIPH: "tx_tool_flipH",
  TOOL_FLIPV: "tx_tool_flipV",
  TOOL_INVERT: "tx_tool_invert",
};

export const TOOL_CONSTRUCTOR = {
  [TOOL_TYPE.LENGTH]: LengthTool,
  [TOOL_TYPE.ANGLE]: AngleTool,
  [TOOL_TYPE.ROTATION]: RotationTool,
  [TOOL_TYPE.SCALE]: ScaleTool,
  [TOOL_TYPE.POLYGON]: PolygonTool,
  [TOOL_TYPE.TRANSLATE]: TranslateTool,
  [TOOL_TYPE.WWWC]: WWWCTool,
  [TOOL_TYPE.MAGNIFYING]: MagnifyTool,
  [TOOL_TYPE.PROBE]: ProbeTool,
  [TOOL_TYPE.STACK_SCROLL]: StackTool,
  [TOOL_TYPE.STACK_WHEEL_SCROLL]: StackWheelTool,
  [TOOL_TYPE.ELLIPSE_ROI]: EllipseTool,
};
