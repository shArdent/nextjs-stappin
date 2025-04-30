import { PrismaClient, Role, LoanStatus } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
    console.log("🔄 Resetting database...");
    await prisma.loanItem.deleteMany();
    await prisma.loan.deleteMany();
    await prisma.cart.deleteMany();
    await prisma.item.deleteMany();
    await prisma.user.deleteMany();

    console.log("🌱 Seeding users...");
    const users = await Promise.all(
        Array.from({ length: 10 }).map(() =>
            prisma.user.create({
                data: {
                    name: faker.person.fullName(),
                    email: faker.internet.email(),
                    password: faker.internet.password(),
                    phone: faker.phone.number({ style: "national" }),
                    role: Role.USER,
                },
            }),
        ),
    );

    const admin = await prisma.user.create({
        data: {
            name: "Admin Utama",
            email: "admin@labiot.com",
            password: "admin123",
            role: Role.ADMIN,
        },
    });

    console.log("🌱 Seeding items...");
    const itemNames = [
        "Arduino Uno",
        "ESP32",
        "Raspberry Pi 4",
        "Breadboard",
        "Sensor Suhu DHT11",
        "Relay Module",
        "LCD 16x2",
        "Power Supply",
        "Motor Servo",
        "Jumper Wire",
    ];

    const items = await Promise.all(
        itemNames.map((name) =>
            prisma.item.create({
                data: {
                    name,
                    description: faker.lorem.sentence(),
                    quantity: faker.number.int({ min: 5, max: 30 }),
                    available: faker.number.int({ min: 2, max: 20 }),
                    imageUrl: faker.image.urlPicsumPhotos(),
                },
            }),
        ),
    );

    console.log("🌱 Seeding carts...");
    for (const user of users) {
        const cartItems = faker.helpers.arrayElements(items, 2);
        for (const item of cartItems) {
            await prisma.cart.create({
                data: {
                    userId: user.id,
                    itemId: item.id,
                    quantity: faker.number.int({ min: 1, max: 3 }),
                },
            });
        }
    }

    console.log("🌱 Seeding loans and loan items...");
    const loanStatuses = Object.values(LoanStatus);
    const currentYear = 2025;

    for (const user of users) {
        const loanCount = faker.number.int({ min: 1, max: 3 });

        for (let i = 0; i < loanCount; i++) {
            const status = faker.helpers.arrayElement(loanStatuses);
            const startMonth = faker.number.int({ min: 0, max: 5 }); // Jan-Jun
            const startDate = new Date(
                currentYear,
                startMonth,
                faker.number.int({ min: 1, max: 28 }),
            );

            const loan = await prisma.loan.create({
                data: {
                    userId: user.id,
                    reason: faker.lorem.sentence(),
                    status,
                    startAt: startDate,
                    returnedAt: new Date(
                        startDate.getTime() + 1000 * 60 * 60 * 24 * 7,
                    ), // +7 hari
                    verifiedBy: admin.id,
                },
            });

            const loanItems = faker.helpers.arrayElements(
                items,
                faker.number.int({ min: 1, max: 3 }),
            );
            for (const item of loanItems) {
                await prisma.loanItem.create({
                    data: {
                        loanId: loan.id,
                        itemId: item.id,
                        quantity: faker.number.int({ min: 1, max: 2 }),
                    },
                });
            }
        }
    }

    console.log("✅ Seeding complete!");
}

main()
    .catch((e) => {
        console.error("❌ Error during seeding:", e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
