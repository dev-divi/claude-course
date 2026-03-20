import { PrismaClient } from "../src/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import * as dotenv from "dotenv";

dotenv.config();

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const db = new PrismaClient({ adapter });

async function main() {
  // Module 1
  const module1 = await db.module.upsert({
    where: { order: 1 },
    update: {},
    create: {
      title: "Getting Started",
      description: "Learn the fundamentals and set up your environment.",
      order: 1,
    },
  });

  await db.lesson.upsert({
    where: { order: 1 },
    update: {},
    create: {
      moduleId: module1.id,
      title: "Welcome to the Course",
      subtitle: "What you'll learn and how to get the most out of this course",
      content:
        "Welcome! In this lesson we'll cover the course structure, what tools you'll need, and how to navigate the material. By the end you'll have a clear roadmap for everything ahead.",
      readTime: 3,
      order: 1,
    },
  });

  await db.lesson.upsert({
    where: { order: 2 },
    update: {},
    create: {
      moduleId: module1.id,
      title: "Setting Up Your Environment",
      subtitle: "Install and configure everything you need before we dive in",
      content:
        "In this lesson we'll walk through installing the required tools step by step. Follow along and you'll have a fully working local environment by the end.",
      readTime: 5,
      order: 2,
    },
  });

  // Module 2
  const module2 = await db.module.upsert({
    where: { order: 2 },
    update: {},
    create: {
      title: "Core Concepts",
      description: "Deep dive into the fundamental concepts you need to master.",
      order: 2,
    },
  });

  await db.lesson.upsert({
    where: { order: 3 },
    update: {},
    create: {
      moduleId: module2.id,
      title: "Understanding the Basics",
      subtitle: "The building blocks that everything else is built on",
      content:
        "Here we break down the core concepts from first principles. Don't skip this — everything in the later modules builds directly on what you learn here.",
      readTime: 7,
      order: 3,
    },
  });

  await db.lesson.upsert({
    where: { order: 4 },
    update: {},
    create: {
      moduleId: module2.id,
      title: "Putting It All Together",
      subtitle: "Apply what you've learned in a hands-on mini project",
      content:
        "Time to build something real. In this lesson you'll apply the concepts from the previous lessons in a guided project. By the end you'll have something working you can show off.",
      readTime: 10,
      order: 4,
    },
  });

  console.log("Seeded: 2 modules, 4 lessons");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
