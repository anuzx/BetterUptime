import { prisma } from "db/client";
import { xAddBulk } from "redisUtility/client";


async function main() {
  const website = await prisma.website.findMany({
    select: {
      id: true,
      url: true,
    },
  });
  await xAddBulk(
    website.map((w) => ({
      url: w.url,
      id: w.id,
    })),
  );
}

setInterval(
  () => {
    main();
  },
  3 * 1000 * 60,
);
