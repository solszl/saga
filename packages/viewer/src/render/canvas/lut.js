let lutCache = {};
let nshaders = 255;
export const getLut = (image, displayState) => {
  const { wwwc, invert = false } = displayState;
  let { windowWidth, windowCenter } = image;
  if (wwwc?.ww && wwwc?.wc) {
    const { ww, wc } = wwwc;
    windowCenter = wc;
    windowWidth = ww;
  }

  // 做一个缓存清理机制
  if (Reflect.ownKeys(lutCache).length > 50) {
    lutCache = {};
  }

  const { minPixelValue, maxPixelValue } = image;
  const cacheKey = `${windowWidth}-${windowCenter}-${+invert}-${minPixelValue}-${maxPixelValue}`;
  if (!lutCache[cacheKey]) {
    lutCache[cacheKey] = generateLut(image, windowWidth, windowCenter, invert);
  }

  return lutCache[cacheKey];
};

export const getColorLut = (image, displayState, colormap) => {};

const generateLut = (image, windowWidth, windowCenter, invert) => {
  const { minPixelValue, maxPixelValue } = image;

  let offset = 0;
  if (minPixelValue < 0) {
    offset = minPixelValue;
  } else {
    offset = Math.max(0, minPixelValue);
  }

  const length = maxPixelValue - offset + 1;
  let lut = new Uint8ClampedArray(length);

  const { slope, intercept } = image;
  const mLutFn = linearModalityLut(slope, intercept);
  const wwwcLutFn = wwwcLut(windowWidth, windowCenter);

  if (!invert) {
    for (let i = minPixelValue; i <= maxPixelValue; i += 1) {
      const hu = wwwcLutFn(mLutFn(i));
      lut[i - offset] = hu;
    }
  } else {
    for (let i = minPixelValue; i <= maxPixelValue; i += 1) {
      lut[i - offset] = 255 - wwwcLutFn(mLutFn(i));
    }
  }

  return lut;
};

const linearModalityLut = (slope, intercept) => {
  return (pixelValue) => {
    return pixelValue * slope + intercept;
  };
};

const wwwcLut = (ww, wc) => {
  return (mlutValue) => {
    return ((mlutValue - wc) / ww + 0.5) * 255;
  };
};
