import redis, { RedisClientType } from "redis";

let redisClient: RedisClientType | null;

(async () => {
  redisClient = redis.createClient();

  redisClient.on("error", (error) => console.error(`Error : ${error}`));

  await redisClient.connect();
})();

export const setCacheData = async (key: string, data: string) => {
  try {
    const resData = await redisClient?.set(key, data);
    return resData;
  } catch (error) {
    console.error("Error caching data", error);
    throw new Error("Error caching data");
  }
};

export const getCacheData = async (key: string) => {
  try {
    const resData = await redisClient?.get(key);
    return resData;
  } catch (error) {
    console.error("Error fetching cached data", error);
  }
};
