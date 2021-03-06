class CacheManager {
  constructor() {
    this.cache = {};
  }

  cacheItem(seriesId, obj, plane = "axis") {
    const seriesCache = this.cache?.[seriesId] ?? {};
    const planeCache = seriesCache?.[plane] ?? new Map();
    const { key, value } = obj;
    planeCache.set(key, value);
    this.cache[seriesId] = seriesCache;
    this.cache[seriesId][plane] = planeCache;
  }

  /**
   *
   *
   * @param { string } seriesId
   * @param { number } key
   * @param { string } plane
   * @return {*}
   * @memberof CacheManager
   */
  getItem(seriesId, key, plane) {
    return this.cache?.[seriesId]?.[plane]?.get(key);
  }

  /**
   *
   *
   * @param { string } seriesId
   * @param { string } plane
   * @return { Array<ImageObj> }
   * @memberof CacheManager
   */
  getItems(seriesId, plane) {
    const size = this.cache?.[seriesId]?.[plane]?.size ?? 0;
    if (size === 0) {
      return [];
    }

    const map = this.cache?.[seriesId]?.[plane];
    return Array.from(map)
      .sort((a, b) => a[0] - b[0])
      .map((item) => item[1]);
  }

  /**
   * 如果seriesId 和 plane都不传，就清空所有cache
   * 如果只传了seriesId， 就清空对应seriesId的cache
   *
   * @param { string } seriesId
   * @param { string } plane
   * @return {*}
   * @memberof CacheManager
   */
  purge(seriesId, plane) {
    if (!seriesId) {
      this.cache = {};
      return;
    }

    if (!plane) {
      delete this.cache?.[seriesId];
      return;
    }

    delete this.cache[seriesId][plane];
  }
}

export default CacheManager;
