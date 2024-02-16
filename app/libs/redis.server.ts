import redis from "redis";

const client = redis.createClient({
  url: process.env.REDIS_URL,
  password: process.env.REDIS_PASSWORD,
});

export const setCacheData = async (key: string, data: string) => {
  try {
    const resData = await client.set("mystring", "Hello, Redis!");
    return resData;
  } catch (error) {
    console.error("Error caching data", error);
    throw new Error("Error caching data");
  }
};

export const getCacheData = async (key: string) => {
  try {
    const resData = await client.get(key);
    return resData;
  } catch (error) {
    console.error("Error fetching cached data", error);
    throw new Error("Error fetching cached data");
  }
};
