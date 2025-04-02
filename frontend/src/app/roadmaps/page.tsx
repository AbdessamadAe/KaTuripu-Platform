import Link from "next/link";

const roadmaps = [
  { id: "math-sm", title: "BAC Math Sciences Mathématiques" },
  { id: "cs-fundamentals", title: "Computer Science Fundamentals" },
];

export default function RoadmapsList() {
  return (
    <div>
      <h1>Available Roadmaps</h1>
      <ul>
        {roadmaps.map((roadmap) => (
          <li key={roadmap.id}>
            <Link href={`/roadmaps/${roadmap.id}`}>{roadmap.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}