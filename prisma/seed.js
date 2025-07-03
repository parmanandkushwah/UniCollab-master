import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const universities = [
  // International Universities
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

  // Indian Institutes of Technology (IITs)
  {
    name: 'IIT Bombay',
    domain: 'iitb.ac.in',
    website: 'https://www.iitb.ac.in',
    country: 'India',
    city: 'Mumbai',
  },
  {
    name: 'IIT Delhi',
    domain: 'iitd.ac.in',
    website: 'https://home.iitd.ac.in',
    country: 'India',
    city: 'Delhi',
  },
  {
    name: 'IIT Kanpur',
    domain: 'iitk.ac.in',
    website: 'https://www.iitk.ac.in',
    country: 'India',
    city: 'Kanpur',
  },
  {
    name: 'IIT Kharagpur',
    domain: 'iitkgp.ac.in',
    website: 'https://www.iitkgp.ac.in',
    country: 'India',
    city: 'Kharagpur',
  },
  {
    name: 'IIT Madras',
    domain: 'iitm.ac.in',
    website: 'https://www.iitm.ac.in',
    country: 'India',
    city: 'Chennai',
  },
  {
    name: 'IIT Roorkee',
    domain: 'iitr.ac.in',
    website: 'https://www.iitr.ac.in',
    country: 'India',
    city: 'Roorkee',
  },
  {
    name: 'IIT Hyderabad',
    domain: 'iith.ac.in',
    website: 'https://www.iith.ac.in',
    country: 'India',
    city: 'Hyderabad',
  },
  {
    name: 'IIT Guwahati',
    domain: 'iitg.ac.in',
    website: 'https://www.iitg.ac.in',
    country: 'India',
    city: 'Guwahati',
  },
  {
    name: 'IIT BHU',
    domain: 'iitbhu.ac.in',
    website: 'https://www.iitbhu.ac.in',
    country: 'India',
    city: 'Varanasi',
  },
  {
    name: 'IIT Dhanbad (ISM)',
    domain: 'iitism.ac.in',
    website: 'https://www.iitism.ac.in',
    country: 'India',
    city: 'Dhanbad',
  },

  // Indian Institutes of Management (IIMs)
  {
    name: 'IIM Ahmedabad',
    domain: 'iima.ac.in',
    website: 'https://www.iima.ac.in',
    country: 'India',
    city: 'Ahmedabad',
  },
  {
    name: 'IIM Bangalore',
    domain: 'iimb.ac.in',
    website: 'https://www.iimb.ac.in',
    country: 'India',
    city: 'Bangalore',
  },
  {
    name: 'IIM Calcutta',
    domain: 'iimcal.ac.in',
    website: 'https://www.iimcal.ac.in',
    country: 'India',
    city: 'Kolkata',
  },
  {
    name: 'IIM Lucknow',
    domain: 'iiml.ac.in',
    website: 'https://www.iiml.ac.in',
    country: 'India',
    city: 'Lucknow',
  },
  {
    name: 'IIM Indore',
    domain: 'iimidr.ac.in',
    website: 'https://www.iimidr.ac.in',
    country: 'India',
    city: 'Indore',
  },
  {
    name: 'IIM Kozhikode',
    domain: 'iimk.ac.in',
    website: 'https://www.iimk.ac.in',
    country: 'India',
    city: 'Kozhikode',
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
