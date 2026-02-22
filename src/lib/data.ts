export interface Project {
  id: string;
  title: string;
  slug: string;
  shortDesc: string;
  tech: string[];
  image: string;
  demoUrl?: string;
  repoUrl?: string;
  featured?: boolean;
}

export interface Skill {
  name: string;
  level: number;
  category: "languages" | "frameworks" | "tools" | "ai-ml";
}

export interface Education {
  year: string;
  institution: string;
  degree: string;
  summary: string;
}

export const projects: Project[] = [
  {
    id: "1",
    title: "NeuralVision — Real-Time Object Detection",
    slug: "neuralvision",
    shortDesc: "End-to-end deep learning pipeline for real-time multi-class object detection with 94% mAP, deployed as a scalable REST API.",
    tech: ["Python", "PyTorch", "FastAPI", "Docker", "AWS"],
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&q=80",
    demoUrl: "#",
    repoUrl: "#",
    featured: true,
  },
  {
    id: "2",
    title: "DataFlow — Analytics Dashboard",
    slug: "dataflow",
    shortDesc: "Interactive analytics dashboard processing 10M+ rows in real time with custom D3 visualizations and WebSocket streaming.",
    tech: ["React", "TypeScript", "D3.js", "Node.js", "PostgreSQL"],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    demoUrl: "#",
    repoUrl: "#",
    featured: true,
  },
  {
    id: "3",
    title: "SentimentScope — NLP Analysis Platform",
    slug: "sentimentscope",
    shortDesc: "Transformer-based sentiment analysis engine processing 50K+ reviews/hour with multi-language support and explainability.",
    tech: ["Python", "Transformers", "Hugging Face", "React", "Redis"],
    image: "https://images.unsplash.com/photo-1516110833967-0b5716ca1387?w=800&q=80",
    demoUrl: "#",
    repoUrl: "#",
  },
  {
    id: "4",
    title: "PredictHealth — ML Risk Scoring",
    slug: "predicthealth",
    shortDesc: "HIPAA-compliant machine learning platform for patient risk stratification using gradient boosted trees and SHAP explanations.",
    tech: ["Python", "scikit-learn", "XGBoost", "Flask", "Docker"],
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80",
    demoUrl: "#",
    repoUrl: "#",
  },
  {
    id: "5",
    title: "GenArt — AI Image Generator",
    slug: "genart",
    shortDesc: "Web app leveraging Stable Diffusion for artistic image generation with style transfer, prompt engineering UI, and gallery sharing.",
    tech: ["Next.js", "Python", "Stable Diffusion", "Tailwind", "Supabase"],
    image: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&q=80",
    demoUrl: "#",
    repoUrl: "#",
    featured: true,
  },
  {
    id: "6",
    title: "AutoPipeline — MLOps Framework",
    slug: "autopipeline",
    shortDesc: "Open-source MLOps toolkit automating model training, evaluation, versioning, and deployment with CI/CD integration.",
    tech: ["Python", "MLflow", "Kubernetes", "GitHub Actions", "Terraform"],
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80",
    demoUrl: "#",
    repoUrl: "#",
  },
];

export const skills: Skill[] = [
  { name: "Python", level: 95, category: "languages" },
  { name: "TypeScript", level: 90, category: "languages" },
  { name: "JavaScript", level: 88, category: "languages" },
  { name: "SQL", level: 85, category: "languages" },
  { name: "R", level: 70, category: "languages" },
  { name: "React", level: 90, category: "frameworks" },
  { name: "Next.js", level: 85, category: "frameworks" },
  { name: "FastAPI", level: 88, category: "frameworks" },
  { name: "PyTorch", level: 85, category: "ai-ml" },
  { name: "TensorFlow", level: 80, category: "ai-ml" },
  { name: "scikit-learn", level: 92, category: "ai-ml" },
  { name: "Hugging Face", level: 82, category: "ai-ml" },
  { name: "LangChain", level: 78, category: "ai-ml" },
  { name: "Docker", level: 85, category: "tools" },
  { name: "AWS", level: 80, category: "tools" },
  { name: "PostgreSQL", level: 85, category: "tools" },
  { name: "Git", level: 90, category: "tools" },
];

export const education: Education[] = [
  {
    year: "2022 — 2024",
    institution: "Stanford University",
    degree: "M.S. Computer Science — AI Specialization",
    summary: "Research focus on transformer architectures and efficient fine-tuning methods. Published 2 papers at NeurIPS. Teaching assistant for CS229 Machine Learning.",
  },
  {
    year: "2018 — 2022",
    institution: "UC Berkeley",
    degree: "B.S. Data Science & Computer Science",
    summary: "Dean's Honor List. Capstone project on real-time anomaly detection using streaming data. Vice President of the Data Science Society.",
  },
  {
    year: "2021",
    institution: "Google Summer of Code",
    degree: "Open Source Contributor — TensorFlow",
    summary: "Contributed optimizations to TF data pipeline, reducing training data loading overhead by 23% for large-scale distributed training setups.",
  },
];

export const about = {
  name: "Tarapara Yash",
  title: "AI & Data Science Developer",
  tagline: "Building intelligent applications using Machine Learning and Web Technologies.",
  bio: "I am an aspiring AI and Data Science developer focused on building real-world intelligent applications using machine learning and modern web technologies. I enjoy working on projects that combine data, automation, and interactive interfaces to create meaningful solutions. My experience includes developing predictive models, automation tools, and data-driven dashboards. I am particularly interested in end-to-end development—from data processing and model training to deployment and visualization. I am actively improving my skills in artificial intelligence and full-stack development while seeking opportunities to contribute to innovative technology projects.",
  email: "alex@example.dev",
  github: "https://github.com",
  linkedin: "https://linkedin.com",
  twitter: "https://twitter.com",
  resumeUrl: "#",
};
