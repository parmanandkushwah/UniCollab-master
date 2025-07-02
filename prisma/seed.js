import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const universities = [
  {
    name: 'Harvard University',
    domain: 'harvard.edu',
    website: 'https://www.harvard.edu',
    country: 'USA',
    city: 'Cambridge',
  },
  {
    name: 'Stanford University',
    domain: 'stanford.edu',
    website: 'https://www.stanford.edu',
    country: 'USA',
    city: 'Stanford',
  },
  {
    name: 'MIT',
    domain: 'mit.edu',
    website: 'https://www.mit.edu',
    country: 'USA',
    city: 'Cambridge',
  },
  {
    name: 'University of California, Berkeley',
    domain: 'berkeley.edu',
    website: 'https://www.berkeley.edu',
    country: 'USA',
    city: 'Berkeley',
  },
  {
    name: 'Oxford University',
    domain: 'ox.ac.uk',
    website: 'https://www.ox.ac.uk',
    country: 'UK',
    city: 'Oxford',
  },
  {
    name: 'Cambridge University',
    domain: 'cam.ac.uk',
    website: 'https://www.cam.ac.uk',
    country: 'UK',
    city: 'Cambridge',
  },
  {
    name: 'Other',
    domain: 'other.edu',
    website: '',
    country: 'N/A',
    city: 'N/A',
  },
];

async function main() {
  for (const uni of universities) {
    await prisma.university.upsert({
      where: { domain: uni.domain },
      update: {},
      create: {
        name: uni.name,
        domain: uni.domain,
        website: uni.website,
        country: uni.country,
        city: uni.city,
        isActive: true,
      },
    });
  }
}

main()
  .then(() => {
    console.log('✅ Universities seeded');
    prisma.$disconnect();
  })
  .catch((error) => {
    console.error('❌ Error seeding universities:', error);
    prisma.$disconnect();
    process.exit(1);
  });
