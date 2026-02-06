import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const subjects = [
    // Primary Languages
    { name: 'Slovenščina', category: 'language' },
    { name: 'Angleščina', category: 'language' },
    { name: 'Nemščina', category: 'language' },
    { name: 'Italijanščina', category: 'language' },
    { name: 'Francoščina', category: 'language' },
    { name: 'Španščina', category: 'language' },

    // Natural Sciences
    { name: 'Matematika', category: 'science' },
    { name: 'Fizika', category: 'science' },
    { name: 'Kemija', category: 'science' },
    { name: 'Biologija', category: 'science' },
    { name: 'Naravoslovje', category: 'science' },

    // Social Sciences
    { name: 'Zgodovina', category: 'social' },
    { name: 'Geografija', category: 'social' },
    { name: 'Državljanska vzgoja in etika', category: 'social' },
    { name: 'Sociologija', category: 'social' },
    { name: 'Psihologija', category: 'social' },
    { name: 'Filozofija', category: 'social' },

    // Arts & Music
    { name: 'Glasbena umetnost', category: 'art' },
    { name: 'Likovna umetnost', category: 'art' },

    // Tech & Others
    { name: 'Informatika', category: 'tech' },
    { name: 'Tehnika in tehnologija', category: 'tech' },
    { name: 'Gospodinjstvo', category: 'other' },
    { name: 'Športna vzgoja', category: 'sport' },
];

async function main() {
    console.log('Start seeding subjects...');

    for (const subject of subjects) {
        // Check if exists to avoid duplicates
        const exists = await prisma.subject.findFirst({
            where: { name: subject.name }
        });

        if (!exists) {
            await prisma.subject.create({
                data: {
                    name: subject.name,
                    category: subject.category
                }
            });
            console.log(`Created subject: ${subject.name}`);
        } else {
            console.log(`Subject already exists: ${subject.name}`);
        }
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
