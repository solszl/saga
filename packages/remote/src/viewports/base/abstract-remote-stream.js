import { AbstractViewport } from "@pkg/viewer/src";
import ParaViewWebClient from "paraviewweb/src/IO/WebSocket/ParaViewWebClient";
import RemoteRenderer from "paraviewweb/src/NativeUI/Canvas/RemoteRenderer";

/**
 * 服务端渲染-流式文件渲染基类
 *
 * @class RemoteStreamViewport
 * @extends {AbstractRemoteViewport}
 */
class AbstractRemoteStreamViewport extends AbstractViewport {
  constructor(option = {}) {
    super(option);

    // 根据transferMode 和 route找到对应的连接
    const { route, resource, transferMode = "socket" } = option;
    const transfer = resource.getTransfer(transferMode);
    const conn = transfer.getConnection(route);
    this.connection = conn;

    const protocols = ["MouseHandler", "ViewPort", "ViewPortImageDelivery"];
    const client = ParaViewWebClient.createClient(conn, protocols);
    const renderer = new RemoteRenderer(client);
    renderer.setContainer(option.el);
    this.remoteRenderer = renderer;

    this.init();
  }

  async initialAsyncWorkflow() {}

  async mixinMethods(route) {}

  _splitMessageType(messageType) {
    return messageType.split("|>");
  }

  validateNow() {
    this.remoteRenderer.render();
  }

  resize(width, height) {
    super.resize(width, height);
    this.remoteRenderer.resize();
  }

  destroy() {
    super.destroy();
    this.remoteRenderer.destroy();
    this.remoteRenderer = null;
  }
}

export default AbstractRemoteStreamViewport;