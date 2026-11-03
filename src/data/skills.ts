export interface SkillGroup {
  category: string;
  items: string[];
}

/** Grouped as on the old site. Order here is the order on the page. */
export const skills: SkillGroup[] = [
  {
    category: "AI Agents & Agentic Infra",
    items: ["Model Context Protocol", "A2A Agents", "Google ADK", "LangChain", "Agent Evals", "RAG"],
  },
  {
    category: "LLM Applications",
    items: ["OpenAI", "Gemini", "DeepSeek", "Ollama", "Hugging Face", "AWS Bedrock", "Vector Search"],
  },
  {
    category: "Machine Learning & Audio/CV",
    items: ["TensorFlow", "PyTorch", "Reinforcement Learning", "NumPy", "Pandas"],
  },
  {
    category: "Languages",
    items: ["Python", "TypeScript", "JavaScript", "Go", "Swift", "Dart", "Rust", "Kotlin", "Java", "C++"],
  },
  {
    category: "Backend & APIs",
    items: ["FastAPI", "Node.js", "Express.js", "WebRTC", "Socket.IO"],
  },
  {
    category: "Frontend",
    items: ["React.js", "Next.js", "Tailwind CSS", "Framer Motion", "Three.js", "HTML5", "CSS3"],
  },
  {
    category: "Mobile & Native",
    items: ["Flutter", "React Native", "Expo", "SwiftUI", "Tauri"],
  },
  {
    category: "Data & Databases",
    items: ["PostgreSQL", "Neo4j", "MongoDB", "Redis", "Prisma", "MySQL", "SQLite", "Firebase"],
  },
  {
    category: "Infra & DevOps",
    items: ["Docker", "AWS", "Cloudflare", "Nginx", "Prometheus", "Grafana", "GitHub Actions"],
  },
  {
    category: "Security & Real-time",
    items: ["AES-256 Encryption", "JWT / OAuth"],
  },
  {
    category: "Testing & Tooling",
    items: ["Vitest", "Pytest", "Playwright", "Git", "Vercel"],
  },
];
