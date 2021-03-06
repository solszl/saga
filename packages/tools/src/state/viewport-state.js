const initialState = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  rotate: 0,
  scale: 1,
  rootWidth: 0,
  rootHeight: 0,
  centerX: 0,
  centerY: 0,
  positionX: 0,
  positionY: 0,
};

let stateInitialDictionary = {};
let stateDictionary = {};
export const useViewportState = (stageId) => {
  const setViewportState = (newState) => {
    const {
      // rootSize,
      rootWidth,
      rootHeight,
      scale,
      rotate,
      width,
      height,
      position = [0, 0],
      offset,
      flip,
      id,
      stageId,
    } = newState;
    const state = stateDictionary?.[stageId] ?? { ...initialState };
    // 设置视窗
    Object.assign(state, { rootWidth, rootHeight } ?? {});
    Object.assign(state, { x: offset.x, y: offset.y } ?? {});
    Object.assign(state, { scale } ?? {});
    Object.assign(state, { rotate } ?? {});
    Object.assign(state, { width } ?? {});
    Object.assign(state, { height } ?? {});
    Object.assign(state, { centerX: width / 2, centerY: height / 2 } ?? {});
    Object.assign(state, { position: position } ?? {});
    Object.assign(state, { positionX: position[0] } ?? {});
    Object.assign(state, { positionY: position[1] } ?? {});
    Object.assign(state, { flip } ?? {});
    // Object.assign(state, { id } ?? {});
    Object.assign(state, { stageId });
    stateDictionary[stageId] = state;

    const [, setInitialViewportState] = useViewportInitialState(stageId);
    setInitialViewportState(newState);
  };

  const getViewportState = () => {
    return stateDictionary?.[stageId] ?? initialState;
  };

  return [getViewportState, setViewportState];
};

export const useViewportInitialState = (stageId) => {
  let state = stateInitialDictionary?.[stageId];
  const setInitialViewportState = (newState) => {
    if (!stateInitialDictionary[stageId]) {
      stateInitialDictionary[stageId] = newState;
    }
  };

  return [state, setInitialViewportState];
};

export const manualOverwriteInitialState = (stageId, properties) => {
  const [state] = useViewportInitialState(stageId);
  Object.keys(properties).forEach((prop) => {
    state[prop] = properties[prop];
  });

  stateInitialDictionary[stageId] = state;
};

export const removeViewportState = (stageId) => {
  delete stateInitialDictionary[stageId];
  delete stateDictionary[stageId];
};
