import NodeCache from 'node-cache';


let instance = null;
export default class CacheUtil {

  constructor() {
    if(!instance){
      this.cache = new NodeCache({ stdTTL: 60 * 60 * 2, checkperiod: (60 * 60 * 2) * 0.2, useClones: false });
      instance = this;
    }
    return instance;
  }

  get(key) {
    const value = this.cache.get(key);
    if (value) {
      // console.log('value', value);
      return value;
    }      
  }
  set = (key, thing) => this.cache.set(key, thing);

  del(keys) {
    this.cache.del(keys);
  }

  delStartWith(startStr = '') {
    if (!startStr) {
      return;
    }

    const keys = this.cache.keys();
    for (const key of keys) {
      if (key.indexOf(startStr) === 0) {
        this.del(key);
      }
    }
  }

  flush() {
    this.cache.flushAll();
  }
}


const Cache = new CacheUtil();
export {Cache};