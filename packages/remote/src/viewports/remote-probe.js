import AbstractRemoteDicomViewport from "./base/abstract-remote-dicom";
class RemoteProbeViewport extends AbstractRemoteDicomViewport {
  constructor(option = {}) {
    super(option);
  }

  async initialAsyncWorkflow() {
    const { route } = this.option;
    await this.mixinMethods(route);
  }

  async mixinMethods(route) {
    super.mixinMethods(route);

    // 动态引入函数列表 进行mixin操作
    const { METHODS } = await import(`./../msg/method-${route}`);
    Object.entries(METHODS).forEach(([key, value]) => {
      Reflect.set(this, key, value.bind(this));
    });
  }

  setVesselName(name) {
    if (!name || this.vesselName === name) {
      return;
    }

    this.vesselNameChanged = true;
    this.vesselName = name;
    this.index = -1;
    this.renderSchedule.invalidate(this.propertyChanged, this);
  }

  setIndex(index) {
    if (index < 0 || this.index === index) {
      return;
    }

    this.indexChanged = true;
    this.index = index;
    this.renderSchedule.invalidate(this.propertyChanged, this);
  }

  async propertyChanged() {
    await super.propertyChanged();
    if (this.index < 0) {
      return false;
    }
    /*
     FIXME: 问题原因， setVesselName 和 setIndex 都触发了propertyChanged.
     而第一次执行过后，将vesselNameChanged 和 indexChanged 都设置成了false
     从而第二次propertyChanged 事件无法进入。此处暂这样解开。有时间需要处理RenderSchedule的大并发调度问题
    */

    if (this.vesselNameChanged || this.indexChanged) {
      const data = await this?.getProbeImage(this.vesselName, this.index);

      if (data.length === 0) {
        this.vesselNameChanged = false;
        this.indexChanged = false;
        console.warn(`[probe] wrong, vessel:${this.vesselName}, index:${this.index}.`);
        return false;
      }
      const uri = data[0];

      const {
        tracer,
        id,
        option: { httpServer, plane },
      } = this;
      tracer.mark(tracer.key(id, plane, "probeRender"));
      this.setUrl(`${httpServer}${uri}`);

      this.vesselNameChanged = false;
      this.indexChanged = false;
    }

    return true;
  }

  async render() {
    await super.render();
    const {
      tracer,
      id,
      option: { plane },
    } = this;
    tracer.measure(tracer.key(id, plane, "probeRender"), "加载probe图像到显示");
    return true;
  }

  static create(option) {
    return new RemoteProbeViewport(option);
  }
}

export default RemoteProbeViewport;
