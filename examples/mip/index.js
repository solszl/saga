import { TOOL_TYPE, ViewportManager } from "@saga/entry";
import { Resource } from "@saga/loader";
import Mip from "../../packages/viewer/src/algo/mip/mip";
const seriesId = "1.2.840.113619.2.404.3.1074448704.467.1622952070.403";
const fs = "http://192.168.111.115:8000";
let currentIndex = 0;
let step = 20;
const API = "/api/v1/series/";

const mip = new Mip();
const vm = new ViewportManager();
const resource = new Resource();

vm.resource = resource;
const standard = vm.addViewport({
  plane: "standard",
  renderer: "canvas",
  el: document.querySelector(".root"),
  tools: [TOOL_TYPE.MOVE, TOOL_TYPE.ZOOM, TOOL_TYPE.STACK_SCROLL],
});

const fetchData = async (seriesId) => {
  const url = `${API}${seriesId}`;
  const json = await (await fetch(url)).json();
  return json;
};

fetchData(seriesId).then((json) => {
  const imageUrls = json.data.images.map((i) => {
    return `${fs}/${i.storagePath}`;
  });

  resource.addItemUrls(seriesId, imageUrls, "standard");
  resource.loadSeries(seriesId, "standard");

  setTimeout(async () => {
    const image = await resource.getImage(seriesId, currentIndex, "standard");
    standard.imageView.showImage(image);
  }, 0);

  setTimeout(async () => {
    mip.method = "max";
    mip.imageList = resource.getImages(seriesId, "standard");
    window.mip = mip;
    const img = await mip.getImage(currentIndex, step);
    standard.imageView.showImage(img);
  }, 2000);
});

document.addEventListener("wheel", async (e) => {
  const offset = Math.sign(e.deltaY);
  currentIndex += offset;
  currentIndex = Math.max(0, Math.min(currentIndex, 182));
  const img = await mip.getImage(currentIndex, step);
  resource.cacheItem(seriesId, { key: currentIndex, value: img }, "axial-mip");
  standard.imageView.showImage(img);

  console.log(currentIndex);
});

standard.useTool(TOOL_TYPE.STACK_WHEEL_SCROLL, 4);