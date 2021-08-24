import AngleTool from "./tools/annotation/angle-tool";
import LengthTool from "./tools/annotation/length-tool";
import RotationTool from "./tools/rotation-tool";
import ScaleTool from "./tools/scale-tool";

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
  MOVE: "move",
  MAGNIFYING: "magnifying",
  ZOOM: "zoom",
  WWWC: "wwwc",
  LENGTH: "length",
  ANGLE: "angle",
  PROBE: "probe",
  ELLIPSE_ROI: "ellipse_roi",


  ROTATION: "rotation",
  SCALE: "scale"
};

export const EVENTS = {
  MOUSE_DOWN: "tx_mouse_down",
  MOUSE_UP: "tx_mouse_up",
  MOUSE_CLICK: "tx_mouse_click",
  MOUSE_DOUBLE_CLICK: "tx_mouse_double_click",
  MOUSE_WHEEL: "tx_mouse_wheel",
};

export const INTERNAL_EVENTS = {
  DATA_CREATED: "tx_data_created",
  DATA_UPDATED: "tx_data_updated",
  DATA_REMOVED: "tx_data_removed",
  TOOL_ZOOM: "tx_tool_zoom",
  TOOL_TRANSLATE: "tx_tool_translate",
  TOOL_ROTATION: "tx_tool_rotation",
  TOOL_SCALE: "tx_tool_scale"
};

export const TOOL_CONSTRUCTOR = {
  [TOOL_TYPE.LENGTH]: LengthTool,
  [TOOL_TYPE.ANGLE]: AngleTool,
  [TOOL_TYPE.ROTATION]: RotationTool,
  [TOOL_TYPE.SCALE]: ScaleTool
};
