export interface SkillGroup {
  category: string;
  items: string[];
}

/** Picked by Nihesh. Order here is the order on the page. */
export const skills: SkillGroup[] = [
  {
    category: "AI Agents & Agentic Infra",
    items: ["Model Context Protocol", "RAG", "LangChain", "A2A Agents"],
  },
  {
    category: "LLM Applications",
    items: ["Claude", "OpenAI", "Gemini", "Ollama", "Vector Search"],
  },
  {
    category: "Languages",
    items: ["Python", "TypeScript", "JavaScript", "Go", "Java", "C++"],
  },
  {
    category: "Backend & APIs",
    items: ["FastAPI", "Node.js", "Express.js", "WebRTC"],
  },
  {
    category: "Data & Databases",
    items: ["PostgreSQL", "Redis", "MongoDB", "Neo4j", "MySQL"],
  },
  {
    category: "Frontend",
    items: ["Next.js", "Tailwind CSS", "Three.js"],
  },
  {
    category: "Infra & DevOps",
    items: ["Docker", "AWS", "Cloudflare"],
  },
  {
    category: "Machine Learning & Audio/CV",
    items: ["TensorFlow", "NumPy", "Pandas"],
  },
  {
    category: "Mobile & Native",
    items: ["Expo", "Flutter", "Tauri"],
  },
  {
    category: "Testing & Tooling",
    items: ["Playwright", "Git"],
  },
];
