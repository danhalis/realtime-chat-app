export function getRedisApiSecrets() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || url.length === 0) {
    throw new Error("Missing UPSTASH_REDIS_REST_URL");
  }
  if (!token || token.length === 0) {
    throw new Error("Missing UPSTASH_REDIS_REST_TOKEN");
  }

  return {
    url,
    token,
  };
}

type Command = "get" | "zrange" | "smembers" | "sismember";

const { url: upstashRedisRestUrl, token: upstashRedisRestToken } =
  getRedisApiSecrets();

export async function redisFetch(command: Command, ...args: (string | number)[]) {
  const commandUrl = `${upstashRedisRestUrl}/${command}/${args.join("/")}`;

  const response = await fetch(
    commandUrl,
    {
      headers: {
        Authorization: `Bearer ${upstashRedisRestToken}`,
        cache: "no-store",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Error executing Upstash Redis command: ${response.statusText}`);
  }

  const data = await response.json() as { result: string | string[] | null };
  return data.result;
}
