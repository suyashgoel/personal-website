import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedAboutPage() {
  try {
    await prisma.about.deleteMany({});
    console.log('Cleared existing about content');

    const about = await prisma.about.create({
      data: {
        content: {
          hero: {
            name: 'Suyash Goel',
            introduction:
              "I'm 21, fresh out of UC Davis, and I've spent the last year falling in love with startups, building, and the craft of bringing ideas to life.\n\nThis website is my attempt at staying human on an internet that makes it harder every day. It's a living archive of who I am: my thoughts, the things I care about, the places I've been, the songs that stopped me in my tracks.",
          },
          journey: [
            {
              company: 'True Ventures',
              role: 'Fellow',
              period: 'Summer 2025',
              description:
                'Last summer, I was a Fellow at True Ventures. I learned about VC, founding, and what it takes to build something from nothing. I sat in rooms with legendary investors and founders. I listened. I absorbed. I fell in love with the startup world.',
              sortOrder: 1,
            },
            {
              company: 'Digg',
              role: 'Software Developer',
              period: 'Summer 2025',
              description:
                'At the same time, I was at Digg as a software developer, and I fell even harder. This time, it was for building with an early team and shipping a real product.\n\nI pushed backend code to production regularly: the invite system that launched in August 2025 and helped scale our user base by multiple factors, migrations protecting user privacy on UGC, org-wide feature flags for operational safety, CRON jobs deployed with Pulumi IAM, caching external attachments on Imgix CDN. I also got to touch the frontend, working with Next.js, React Query, and Jotai.\n\nBut more than the code, it was the feeling of building something meaningful with a small, scrappy team that hooked me.',
              sortOrder: 2,
            },
            {
              company: 'CodeLab',
              role: 'VP of Technology',
              period: '2024 - Present',
              description:
                "During my undergrad, I found my people at CodeLab, UC Davis's largest software and design agency.\n\nI joined my sophomore year and instantly knew I found something special. Some of my best friends are from CodeLab. After this past summer, I came back feeling empowered to help our talented devs, designers, and PMs learn about venture and startups, and to prepare our engineers to ship production code in AI-native workflows, currently serving as VP of Technology of the organization.",
              sortOrder: 3,
            },
          ],
          identity: {
            statements: [
              'I am a builder',
              'I am an Enneagram Type 4',
              'I am a creative',
            ],
            revelation:
              "Over the summer, I learned I was a Type 4, the introspective, creative type. At Digg's onsite during an enneagram session, some were shocked I identified that way as an engineer.\n\nThat's when it clicked: building is my creative outlet. Code isn't just logic and syntax to me: it's how I bring what I've always dreamt of to life. This is my art.",
          },
          loves: ['music', 'travel', 'food', 'exploration', 'connection'],
          purpose: {
            why: "Since working on social at Digg, I've been thinking about how we stay connected as humans on an internet where it's increasingly hard to discern what's human and what's not.\n\nThis website is my attempt at an answer to that question. It's a living statement about who I am: messy, curious, always building.",
            invitation:
              'Enter a query. Dive into my knowledge graph. Wander through my thoughts. See where the connections take you.',
          },
          contact: {
            closing:
              "Want to talk about startups, building, AI, solo travel, or that one song you can't stop listening to?",
            email: 'suyashgoel10@gmail.com',
            linkedin: 'https://linkedin.com/in/suyash-goel',
            x: '@suyashgoe1',
          },
        },
      },
    });

    console.log('About page content seeded successfully!');
    console.log('About ID:', about.id);

    return about;
  } catch (error) {
    console.error('Error seeding about page:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedAboutPage()
  .then(() => {
    console.log('Seed completed');
    process.exit(0);
  })
  .catch(error => {
    console.error('Seed failed:', error);
    process.exit(1);
  });
