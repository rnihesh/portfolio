export interface SkillGroup {
  category: string;
  items: string[];
}

/** Picked by Nihesh. Order here is the order on the page. */
export const skills: SkillGroup[] = [
  {
    category: "AI Agents & Agentic Infra",
    items: ["Model Context Protocol", "A2A Agents", "LangChain", "RAG"],
  },
  {
    category: "LLM Applications",
    items: ["OpenAI", "Gemini", "Ollama", "Vector Search", "Claude"],
  },
  {
    category: "Machine Learning & Audio/CV",
    items: ["TensorFlow", "NumPy", "Pandas"],
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
    category: "Frontend",
    items: ["Next.js", "Tailwind CSS", "Three.js"],
  },
  {
    category: "Mobile & Native",
    items: ["Flutter", "Expo", "Tauri"],
  },
  {
    category: "Data & Databases",
    items: ["PostgreSQL", "Neo4j", "MongoDB", "Redis", "MySQL"],
  },
  {
    category: "Infra & DevOps",
    items: ["Docker", "AWS", "Cloudflare"],
  },
  {
    category: "Testing & Tooling",
    items: ["Playwright", "Git"],
  },
];
