import { ViewportManager, TOOL_TYPE } from "@saga/entry";
import { Resource } from "@saga/loader";
const seriesId = "1.2.840.113619.2.404.3.1074448704.467.1622952070.403.5";
const fs = "http://192.168.111.115:8000";
let currentIndex = 10;

const vm = new ViewportManager();
const standard = vm.addViewport({
  plane: "standard",
  renderer: "canvas",
  el: document.querySelector(".root"),
  tools: [TOOL_TYPE.MOVE, TOOL_TYPE.ZOOM, TOOL_TYPE.STACK_SCROLL],
});

const resource = new Resource();
const fetchData = async (seriesId) => {
  const url = `/api/v1/series/${seriesId}`;
  const json = await (await fetch(url)).json();
  return json;
};

fetchData(seriesId).then((json) => {
  const imageUrls = json.data.images.map((i) => {
    return `${fs}/${i.storagePath}`;
  });

  resource.addItemUrls(seriesId, imageUrls, "standard");

  setTimeout(async () => {
    const image = await resource.getImage(seriesId, currentIndex, "standard");
    standard.imageView.showImage(image);
  }, 0);
});
console.log("fuse start.", vm);
