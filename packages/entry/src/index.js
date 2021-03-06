import { Resource } from "@pkg/loader/src";
import Centerline3DBizz from "@pkg/remote/src/bizz/centerline/centerline-3d";
import { Misc as ToolsMisc, MOUSE_BUTTON, TOOL_CONFIG, TOOL_TYPE } from "@pkg/tools/src";
import { VIEWPORT_CONFIG } from "@pkg/viewer/src";
import { EVENTS as ViewportEvents } from "./constants";
// import { GLOBAL_CONFIG } from "./global-config";
import { LINK_DATA_PROPERTY, LINK_PROPERTY } from "./linkage-manager";
import ViewportManager from "./viewport-manager";

const GLOBAL_CONFIG = {
  viewport: { ...VIEWPORT_CONFIG },
  tools: { ...TOOL_CONFIG },
};

export { ViewportManager, TOOL_TYPE, ViewportEvents, Resource, MOUSE_BUTTON, ToolsMisc };
export { LINK_PROPERTY, LINK_DATA_PROPERTY };
export { GLOBAL_CONFIG };
export { Centerline3DBizz };

export default {
  ViewportManager,
  ViewportEvents,
  TOOL_TYPE,
  Resource,
  LINK_PROPERTY,
  LINK_DATA_PROPERTY,
  MOUSE_BUTTON,
  ToolsMisc,
  GLOBAL_CONFIG,
  Centerline3DBizz,
};
