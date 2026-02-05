import { createClient, type RedisClientType } from "redis";

const redis: RedisClientType = await createClient();

redis.on("error", (err) => console.log("REDIS CLIENT ERROR", err));
await redis.connect();

type WebsiteEvent = {
  url: string;
  id: string;
};

type MessageType = {
  id: string;
  message: WebsiteEvent;
};

const STREAM_KEY = "betteruptime:website";

/**
 * Push events in bulk using redis.multi()
 */

//for producer
export async function xAddBulk(events: WebsiteEvent[]): Promise<void> {
  if (events.length === 0) return;

  const multi = redis.multi();

  for (const { url, id } of events) {
    multi.xAdd(STREAM_KEY, "*", {
      url,
      id,
    });
  }

  await multi.exec();
}

//for consumer
export async function XReadGroup(
  consumerGroup: string,
  workerId: string,
): Promise<MessageType[] | undefined> {
  const res = await redis.xReadGroup(
    consumerGroup,
    workerId,
    {
      key: STREAM_KEY,
      id: ">",
    },
    {
      COUNT: 5,
    },
  );

  if (!res || res.length === 0) return [];

  //@ts-ignore
  const messages: MessageType[] | undefined = res?.[0]?.messages;

  return messages;
}
//ack
export async function xAck(
  eventId: string,
  consumerGroup: string,
): Promise<boolean> {
  const res = await redis.xAck(STREAM_KEY, consumerGroup, eventId);

  return res === 1;
}

export async function xAckBulk(consumerGroup: string, eventIds: string[]) {
  eventIds.map((eventId) => xAck(consumerGroup, eventId));
}