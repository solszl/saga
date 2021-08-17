import EventEmitter from "event-emitter";
import { customAlphabet } from "nanoid";

const ALPHABET = "12345abcde";
/**
 * 组件基类
 *
 * @class Component
 */
class Component {
  constructor() {
    EventEmitter(this);
    this.id = customAlphabet(ALPHABET, 8)();
  }

  destroy() {}
}

export default Component;
