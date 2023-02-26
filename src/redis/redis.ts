import { createClient } from 'redis';
import { IntRange } from '../shared/type.helpers';
/**
 * Host: In format `contosoCache.redis.cache.windows.net`
 * Password: Azure access key
 * Port: 6380
 * Database: 16 databases, 0-15
 */
type IRedisCacheParams = {
  host: string;
  database: IntRange<0, 15>;
  password: string;
  port: string;
};
/**
 * Redis allows you to have different databases,
 * identified by a number. By default you have
 * 16 databases (remember, this is 0-15, not 1-16!).
 */
class RedisCache {
  //port: 6380
  params: IRedisCacheParams;
  // @ts-ignore
  redisClient: ReturnType<typeof createClient>;

  /**
   *
   * @param}
   * @param credential - Any @azure/identity credential
   */
  constructor(redisParams: IRedisCacheParams) {
    this.params = redisParams;
  }
  async connect() {
    if (!this.params?.host) throw Error('host is missing');
    if (!this.params?.password) throw Error('password is missing');
    if (!this.params?.port) throw Error('port is missing');
    if (!this.params?.database) this.params.database = 0;

    // Connection works for Azure
    // Not sure about other clouds
    this.redisClient = createClient({
      // rediss for TLS
      url: `rediss://${this.params?.host}:${this.params?.port}`,
      password: this.params?.password,
      database: this.params?.database
    });
    await this.redisClient.connect();
    if (!this.redisClient.isReady || !this.redisClient.isOpen)
      throw Error("Didn't connect");
  }
  getCurrentClient() {
    return this.redisClient &&
      this.redisClient.isOpen &&
      this.redisClient.isReady
      ? this.redisClient
      : undefined;
  }
  async status(): Promise<{
    isOpen: boolean;
    isReady: boolean;
    serverTime: Date;
  }> {
    return {
      isOpen: this.redisClient.isOpen,
      isReady: this.redisClient.isReady,
      serverTime: await this.redisClient.time()
    };
  }
  async disconnectNow() {
    await this.redisClient.disconnect();
  }
  async disconnectWhenFinished() {
    await this.redisClient.quit();
  }
  async ping() {
    return await this.redisClient.ping();
  }
  async get(name: string) {
    return await this.redisClient.get(name);
  }
  async set(name: string, value: string, seconds: number) {
    if (seconds) {
      return await this.redisClient.setEx(name, seconds, value);
    }
    return await this.redisClient.set(name, value);
  }
  async delete(name: string) {
    return await this.redisClient.del(name);
  }
  async type(name: string) {
    return await this.redisClient.type(name);
  }
  async sendCommand(commands: string[]) {
    return await this.redisClient.sendCommand(commands);
  }
}

export { IRedisCacheParams, RedisCache };
