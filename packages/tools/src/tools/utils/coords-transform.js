const length = (data, transform) => {
  const obj = JSON.parse(JSON.stringify(data));
  const position = transform.transformPoint(data.position.x, data.position.y);
  const start = transform.transformPoint(
    data.position.x + data.start.x,
    data.position.y + data.start.y
  );
  const end = transform.transformPoint(data.position.x + data.end.x, data.position.y + data.end.y);

  const textPoint = transform.transformPoint(
    data.position.x + data.textBox.x,
    data.position.y + data.textBox.y
  );

  obj.position.x = position[0];
  obj.position.y = position[1];
  obj.end.x = end[0] - position[0];
  obj.end.y = end[1] - position[1];
  obj.start.x = start[0] - position[0];
  obj.start.y = start[1] - position[1];
  obj.textBox.x = textPoint[0] - position[0];
  obj.textBox.y = textPoint[1] - position[1];
  return obj;
};

const angle = (data, transform) => {
  const obj = JSON.parse(JSON.stringify(data));
  const position = transform.transformPoint(data.position.x, data.position.y);
  const start = transform.transformPoint(
    data.position.x + data.start.x,
    data.position.y + data.start.y
  );
  const middle = transform.transformPoint(
    data.position.x + data.middle.x,
    data.position.y + data.middle.y
  );
  const end = transform.transformPoint(data.position.x + data.end.x, data.position.y + data.end.y);
  const text = transform.transformPoint(
    data.position.x + data.textBox.x,
    data.position.y + data.textBox.y
  );

  obj.position.x = position[0];
  obj.position.y = position[1];
  obj.start.x = start[0] - position[0];
  obj.start.y = start[1] - position[1];
  obj.middle.x = middle[0] - position[0];
  obj.middle.y = middle[1] - position[1];
  obj.end.x = end[0] - position[0];
  obj.end.y = end[1] - position[1];
  obj.textBox.x = text[0] - position[0];
  obj.textBox.y = text[1] - position[1];
  return obj;
};

const ellipse_roi = (data, transform) => {
  const obj = JSON.parse(JSON.stringify(data));

  const position = transform.transformPoint(data.position.x, data.position.y);
  const start = transform.transformPoint(
    data.position.x + data.start.x,
    data.position.y + data.start.y
  );
  const end = transform.transformPoint(data.position.x + data.end.x, data.position.y + data.end.y);
  const text = transform.transformPoint(
    data.position.x + data.textBox.x,
    data.position.y + data.textBox.y
  );

  obj.position.x = position[0];
  obj.position.y = position[1];
  obj.end.x = end[0] - position[0];
  obj.end.y = end[1] - position[1];
  obj.start.x = start[0] - position[0];
  obj.start.y = start[1] - position[1];
  obj.textBox.x = text[0] - position[0];
  obj.textBox.y = text[1] - position[1];
  return obj;
};

const roi = (data, transform) => {
  const obj = JSON.parse(JSON.stringify(data));

  const position = transform.transformPoint(data.position.x, data.position.y);
  const start = transform.transformPoint(
    data.position.x + data.start.x,
    data.position.y + data.start.y
  );
  const end = transform.transformPoint(data.position.x + data.end.x, data.position.y + data.end.y);

  obj.position.x = position[0];
  obj.position.y = position[1];
  obj.end.x = end[0] - position[0];
  obj.end.y = end[1] - position[1];
  obj.start.x = start[0] - position[0];
  obj.start.y = start[1] - position[1];
  return obj;
};

const polygon = (data, transform) => {
  const obj = JSON.parse(JSON.stringify(data));
  const position = transform.transformPoint(data.position.x, data.position.y);
  const points = data.points.map((points) => {
    return points.map((point) => {
      const p = transform.transformPoint(data.position.x + point[0], data.position.y + point[1]);
      // return { x: p[0] - position[0], y: p[1] - position[1] };
      return [p[0] - position[0], p[1] - position[1]];
    });
  });

  obj.position.x = position[0];
  obj.position.y = position[1];
  obj.points = points;
  return obj;
};

const fnList = { length, angle, ellipse_roi, polygon, roi };
export const transform = (data, transform) => {
  const { type } = data;
  return fnList?.[type](data, transform);
};

export const localToWorld = (x, y) => {
  return transform.transformPoint(x, y);
};

/**
 * ???x,y?????????????????????512?????????
 * @param {*} x ?????????????????????????????????
 * @param {*} y ?????????????????????????????????
 * @returns
 */
export const worldToLocal = (x, y) => {
  return transform.invertPoint(x, y);
};
