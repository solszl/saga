import { MsgTypes } from "./msgTypes";

export const METHODS = {
  setVesselTextVisibility: async function (vessels, val) {
    const call = async (messageType, b) => {
      const [route, method] = this._splitMessageType(messageType);
      const session = this.connection.getSession();
      const data = await session.call(method, [], {
        add_text: b,
      });

      return data;
    };

    if (vessels.includes("vr")) {
      await call(MsgTypes.VR_VESSEL_TEXT, val);
    }

    if (vessels.includes("vr_tree")) {
      await call(MsgTypes.VRTREE_VESSEL_TEXT, val);
    }

    if (vessels.includes("mip")) {
      await call(MsgTypes.MIP_VESSEL_TEXT, val);
    }

    this.validateNow();
    return true;
  },
};