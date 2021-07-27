import Transform from "./transform";
export const applyTransform = (displayState, canvas, renderCanvas) => {
  const transform = new Transform();
  const { offset, scale, rotate, flip } = displayState;
  if (offset) {
    transform.translate(offset.x, offset.y);
  }

  const { width, height } = canvas;
  transform.translate(width / 2, height / 2);
  if (!!scale) {
    transform.scale(scale, scale);
  }

  if (!!rotate) {
    transform.rotate(rotate);
  }

  if (flip) {
    const { h = false, v = false } = flip;
    const fv = v ? -1 : 1;
    const fh = h ? -1 : 1;
    transform.scale(fh, fv);
  }

  const { width: rw, height: rh } = renderCanvas;
  transform.translate(-rw / 2, -rh / 2);
  return transform.m;
};