import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const insert = async () => {
    console.log("dbDatas1");
    try {
        const dbData = await prisma.youtube_channels.findMany({
            where: {
                subscribers: { gt: 1000 },
            },
        });
        console.log("dbData");
        console.log(dbData, "thisssis read");
    }
    catch (e) {
        console.log(e);
    }
    finally {
        await prisma.$disconnect();
    }
};
insert();
//# sourceMappingURL=db.js.map