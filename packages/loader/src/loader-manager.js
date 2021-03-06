import PromiseWorker from "promise-worker";
import { postprocessor } from "./utils";
import LoaderWorker from "./workers/loader.worker";

/** @type { Boolean } 简单的通过判断是否是Chrome49版本来确定是否是xp系统 */
const isXP = /Windows NT 5\.1.+Chrome\/49/.test(navigator.userAgent);

class LoaderManager {
  constructor() {
    this.workers = [];
    this.taskManager = null;
    this.cacheManager = null;

    this.initLoader();
  }

  initLoader() {
    // 非xp留出一个加载线程供其他请求
    const workerCount = isXP ? 2 : Math.min(navigator.hardwareConcurrency - 1, 5);

    this.workers = Array.from(new Array(workerCount), (_, i) => i + 1).map((i) => {
      const worker = new LoaderWorker();
      const promiseWorker = new PromiseWorker(worker);
      promiseWorker.id = i;
      promiseWorker.working = false;
      return promiseWorker;
    });

    console.log(this.workers);
  }

  async load() {
    // 如果有挂载任务，返回
    if (!this.taskManager.hasPendingTask()) {
      return;
    }

    // 如果没有可用的worker返回，并且启动worker检查，看什么时候有空闲worker再继续下载
    if (this.workers.length === 0) {
      this._startCheck();
      return;
    }

    const task = this.taskManager.pendingTask.shift();
    // 加载的任务，如果已经缓存了。就过
    const { seriesId: ts, index: ti, plane: tp, resolve: tr } = task;
    const cacheItem = this.cacheManager.getItem(ts, ti, tp);
    if (cacheItem) {
      tr?.(cacheItem);
      this._startCheck();
      return;
    }

    this.taskManager.addLoadingTask(task);
    const worker = this.workers.shift();
    worker.working = true;
    const { resolve } = task;
    delete task.resolve;
    const { seriesId, plane, index, image } = await worker.postMessage(task);
    let img = await postprocessor(image, task);
    this.cacheManager.cacheItem(seriesId, { key: index, value: img }, plane);
    worker.working = false;
    this.workers.push(worker);
    this.taskManager.removeLoadingTask(task, img);

    // resolve?.(img);
    await this.delay(5); // 减压、涓流
    this._startCheck(); // 可能有更好的办法？？？
  }

  loadSeries(seriesId, plane) {
    const tasks = this.taskManager.getTask(seriesId, plane);
    while (tasks.length) {
      this.taskManager.addPendingTask(tasks.shift());
    }
    this.taskManager.sort(this.taskManager.pendingTask);
    this.workers.forEach(() => {
      this.load();
    });
  }

  _startCheck() {
    // 只有还有剩余worker，就干活
    if (this.workers.length > 0) {
      this.load();
      return;
    }

    if (!this.taskManager.hasPendingTask()) {
      cancelAnimationFrame(this._rafInterval);
      return;
    }
    this._rafInterval = requestAnimationFrame(this._startCheck.bind(this));
  }

  async delay(ms, value) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms, value);
    });
  }

  clear() {
    this.workers = [];
  }
}

export default LoaderManager;
