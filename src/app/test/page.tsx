import { db } from "@/lib/db";

export default async function TestPage() {
  const modules = await db.module.findMany({
    orderBy: { order: "asc" },
    include: {
      lessons: {
        orderBy: { order: "asc" },
      },
    },
  });

  return (
    <div style={{ fontFamily: "monospace", padding: 32 }}>
      <h1>DB Connection Test</h1>
      <p>{modules.length} module(s) found</p>
      <hr />
      {modules.map((mod) => (
        <div key={mod.id} style={{ marginBottom: 24 }}>
          <h2>
            [{mod.order}] {mod.title}
          </h2>
          <p style={{ color: "#666" }}>{mod.description}</p>
          <ul>
            {mod.lessons.map((lesson) => (
              <li key={lesson.id}>
                <strong>{lesson.title}</strong> — {lesson.subtitle} (
                {lesson.readTime} min read)
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
