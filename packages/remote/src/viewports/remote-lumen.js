// import { CombineFrenet } from "../../cpr/frenet";
// import { lps2NearestLocation } from "../../cpr/utils";
import AbstractRemoteDicomViewport from "./base/abstract-remote-dicom";
class RemoteLumenViewport extends AbstractRemoteDicomViewport {
  constructor(option = {}) {
    super(option);

    // 默认属性
    const { vesselName = "", angle = -1, direction = "portrait", angleStep = 1 } = option;
    this.vesselName = vesselName;
    this.angle = angle;
    this.direction = direction;
    this.angleStep = angleStep;
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

  setDirection(dir) {
    if (!["portrait", "landscape"].includes(dir)) {
      console.warn(`doesn't exist direction:${dir}. should in ["portrait", "landscape"]`);
      return;
    }

    if (this.direction === dir) {
      return;
    }

    this.directionChanged = true;
    this.direction = dir;

    this.renderSchedule.invalidate(this.propertyChanged, this);
  }

  setVesselName(name) {
    if (!name || this.vesselName === name) {
      return;
    }

    this.vesselNameChanged = true;
    this.vesselName = name;
    this.renderSchedule.invalidate(this.propertyChanged, this);
  }

  setAngle(angle) {
    // 保证数据在0~~360
    angle = (angle + 360) % 360 ?? 0;
    if (this.angle === angle) {
      return;
    }

    this.angle = angle;
    this.angleChanged = true;
    this.renderSchedule.invalidate(this.propertyChanged, this);
  }

  getImage(index) {
    super.getImage(index);
    const { angleStep } = this;
    this.setAngle(index * angleStep);
  }

  async propertyChanged() {
    await super.propertyChanged();
    if (this.directionChanged || this.vesselNameChanged) {
      const { vesselName, direction } = this;
      // TODO: 处理中线问题
      const lines = await this?.getLines(vesselName, direction);
    }

    if (this.directionChanged || this.angleChanged || this.vesselNameChanged) {
      const { vesselName, angle, direction } = this;
      const uri = await this?.getLumenImage(vesselName, angle, direction);
      const { httpServer } = this.option;
      this.setUrl(`${httpServer}${uri}`);
      this.angleChanged = false;
    }

    this.vesselNameChanged = false;
    this.directionChanged = false;
  }

  // setTheta(theta) {
  //   this.displayState.theta = (360 + theta) % 360;
  //   this.fetchDicom();
  // }

  // setVesselName(vesselName) {
  //   this.displayState.vesselName = vesselName;
  //   this.fetchDicom();
  //   this.fetchCenterline();
  // }

  // async fetchDicom() {
  //   const { vesselName, theta } = this.displayState;
  //   const { message, direction, httpServer } = this.config;
  //   let a = Date.now();
  //   let b = a;
  //   const uri = await message.lumenDicom(vesselName, theta, direction);
  //   let c = Date.now() - a;
  //   a = Date.now();
  //   const url = `${httpServer}${uri}`;
  //   await this.setUrl(url);
  //   let d = Date.now() - a;
  //   console.log(
  //     "LUMEN, 一次设置消耗",
  //     Date.now() - b,
  //     "请求消耗",
  //     c,
  //     "加载图像消耗",
  //     d,
  //     vesselName,
  //     theta
  //   );
  // }

  // async fetchCenterline() {
  //   const { vesselName } = this.displayState;
  //   const { message, direction } = this.config;
  //   const centerline2d = await message.lumenCenterline(vesselName, direction);
  //   this.flatCenterline = centerline2d.reduce((prev, curr) => {
  //     return prev.concat(...Object.values(curr));
  //   }, []);

  //   let obj = {};
  //   centerline2d.forEach((item, index) => {
  //     Object.entries(item).forEach(([key, value]) => {
  //       obj[`${key}_${index}`] = value;
  //     });
  //   });

  //   this.segment = obj;
  // }

  // set segment(v) {
  //   this._segment = v;
  //   if (!this.probePointIndex) {
  //     this.probePointIndex = 0;
  //     this.probePoint = this.flatCenterline[0];
  //     this.probePointNext = this.flatCenterline[1];
  //   }
  // }

  // get segment() {
  //   return this._segment;
  // }

  // setProbeIndex(i) {
  //   this.probePointIndex = i;
  //   this.refresh(true);
  // }

  // set mapline(val) {
  //   this._mapline = val;
  //   // this.combineFrenet = new CombineFrenet(val, "none");
  // }

  // get mapline() {
  //   return this._mapline;
  // }

  static create(option) {
    return new RemoteLumenViewport(option);
  }
}

export default RemoteLumenViewport;
