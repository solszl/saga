import LoaderManager from "./loader-manager";
import CacheManager from "./cache-manager";
import PreloadManager from "./preload";
import TaskManager from "./task-manager";

class Resource {
  constructor() {
    // 加载管理器
    this.loaderManager = new LoaderManager();
    // 预加载管理器
    this.preloadManager = new PreloadManager();
    // 缓存管理器
    this.cacheManager = new CacheManager();
    // 任务管理器
    this.taskManager = new TaskManager();
    this.loaderManager.cacheManager = this.cacheManager;
    this.loaderManager.taskManager = this.taskManager;
    this.preloadManager.taskManager = this.taskManager;

    window.__TX_RESOURCE__ = this;
  }

  /**
   *
   * @param { string} seriesId
   * @param { Array } imageUrls
   * @param { string } [plane="axis"]
   * @memberof Resource
   */
  addItemUrls(seriesId, imageUrls, plane = "axis") {
    imageUrls.forEach((url, index) => {
      this.taskManager.addTask({ seriesId, url, plane, index });
    });
  }

  /**
   *
   *
   * @param { string } seriesId
   * @param { Array<string, object>} objArray
   * @param { string } [plane="axis"]
   * @memberof Resource
   */
  cacheItems(seriesId, objArray, plane = "axis") {
    objArray.forEach((obj) => {
      this.cacheItem(seriesId, obj, plane);
    });
  }

  cacheItem(seriesId, obj, plane = "axis") {
    this.cacheManager.cache(seriesId, obj, plane);
  }

  async getImage(seriesId, index, plane = "axis") {
    return new Promise((resolve, reject) => {
      const image = this.cacheManager.getItem(seriesId, index, plane);
      if (image) {
        resolve(image);
        this.preloadManager.buildPreloadTask({ seriesId, plane, index });
        this.loaderManager.load();
        return;
      }

      const task = this.taskManager.getTask(seriesId, plane, index)[0];
      if (!task) {
        console.error(`not have task ${seriesId}, ${plane}, ${index}.`);
        return;
      }

      task.resolve = resolve;
      this.taskManager.addPendingTask(task);
      this.taskManager.sort(this.taskManager.pendingTask);

      this.preloadManager.buildPreloadTask({ seriesId, plane, index });
      this.loaderManager.load();
    });
  }

  loadSeries(seriesId, plane) {
    this.loaderManager.loadSeries(seriesId, plane);
  }

  purgeCache(seriesId, plane) {
    this.cacheManager.purge(seriesId, plane);
  }
}

export default Resource;
