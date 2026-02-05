import axios from "axios";
import { xAckBulk, XReadGroup } from "redisUtility/client";
import { prisma} from "db/client";

const REGION_ID = process.env.REGION_ID!;
const WORKER_ID = process.env.WORKER_ID!;

if (!REGION_ID) {
  throw new Error("Region not provided");
}

if (!WORKER_ID) {
  throw new Error("Region not provided");
}

async function main() {
  while (1) {
    const response = await XReadGroup(REGION_ID, WORKER_ID);

    if (!response) {
      continue;
    }

    let promises = response.map(({ message }) =>
      fetchWebsite(message.url, message.id),
    );
    await Promise.all(promises);
    console.log(promises.length);

    xAckBulk(
      REGION_ID,
      response.map(({ id }) => id),
    );
  }
}

async function fetchWebsite(url: string, websiteId: string) {
  return new Promise<void>((resolve, reject) => {
    const startTime = Date.now();

    axios
      .get(url)
      .then(async () => {
        const endTime = Date.now();
        await prisma.websiteTick.create({
          data: {
            response_time_ms: endTime - startTime,
            status: "UP",
            regionId: REGION_ID,
            websiteId: websiteId,
          },
        });
        resolve();
      })
      .catch(async () => {
        const endTime = Date.now();
        await prisma.websiteTick.create({
          data: {
            response_time_ms: endTime - startTime,
            status: "Down",
            regionId: REGION_ID,
            websiteId: websiteId,
          },
        });
        resolve();
      });
  });
}

main();
