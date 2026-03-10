export const JOBS = [
  {
    id: 1, title: "Software Engineer", company: "Google", sector: "Technology",
    salary: "₹18–25 LPA", salaryMin: 18, location: "Bangalore", type: "Full-time",
    posted: "2 days ago", applicants: 142, exp: "0–2 years",
    skills: ["React", "Node.js", "Python"], status: "open",
    description: "Join Google's engineering team to build scalable web applications that serve billions of users.",
    color: "#1a3a5c", initial: "G", postedBy: "admin",
  },
  {
    id: 2, title: "Data Analyst Intern", company: "Microsoft", sector: "Technology",
    salary: "₹40K/month", salaryMin: 5, location: "Hyderabad", type: "Internship",
    posted: "1 day ago", applicants: 89, exp: "Fresher",
    skills: ["Python", "SQL", "Power BI"], status: "open",
    description: "Work with massive datasets and build dashboards that drive strategic business decisions.",
    color: "#2ea87e", initial: "M", postedBy: "admin",
  },
  {
    id: 3, title: "Product Manager", company: "Amazon", sector: "E-Commerce",
    salary: "₹22–30 LPA", salaryMin: 22, location: "Mumbai", type: "Full-time",
    posted: "3 days ago", applicants: 210, exp: "0–1 years",
    skills: ["Product Thinking", "SQL", "Agile"], status: "open",
    description: "Drive product vision and roadmap for Amazon's logistics and supply chain division.",
    color: "#f59e0b", initial: "A", postedBy: "admin",
  },
  {
    id: 4, title: "Financial Analyst", company: "Goldman Sachs", sector: "Finance",
    salary: "₹14–18 LPA", salaryMin: 14, location: "Mumbai", type: "Full-time",
    posted: "5 days ago", applicants: 173, exp: "0–2 years",
    skills: ["Excel", "Financial Modeling", "Python"], status: "interviewing",
    description: "Analyze financial data and build models for strategic decision making at one of the world's top banks.",
    color: "#1a3a5c", initial: "GS", postedBy: "admin",
  },
  {
    id: 5, title: "Business Analyst", company: "Deloitte", sector: "Consulting",
    salary: "₹10–14 LPA", salaryMin: 10, location: "Pune", type: "Full-time",
    posted: "4 days ago", applicants: 95, exp: "Fresher",
    skills: ["PowerPoint", "Excel", "SQL"], status: "open",
    description: "Solve complex business problems for Fortune 500 clients across diverse industries.",
    color: "#2ea87e", initial: "D", postedBy: "admin",
  },
  {
    id: 6, title: "UX Designer", company: "Adobe", sector: "Technology",
    salary: "₹12–16 LPA", salaryMin: 12, location: "Noida", type: "Full-time",
    posted: "1 week ago", applicants: 67, exp: "0–2 years",
    skills: ["Figma", "User Research", "Prototyping"], status: "closed",
    description: "Design beautiful, intuitive experiences for Adobe's Creative Cloud suite used by millions.",
    color: "#ef4444", initial: "Ad", postedBy: "admin",
  },
  {
    id: 7, title: "Backend Developer", company: "Flipkart", sector: "E-Commerce",
    salary: "₹15–20 LPA", salaryMin: 15, location: "Bangalore", type: "Full-time",
    posted: "2 days ago", applicants: 118, exp: "0–1 years",
    skills: ["Java", "Spring Boot", "Kafka"], status: "open",
    description: "Build and scale backend microservices powering India's largest e-commerce platform.",
    color: "#f59e0b", initial: "F", postedBy: "admin",
  },
  {
    id: 8, title: "ML Engineer Intern", company: "Zomato", sector: "Food Tech",
    salary: "₹35K/month", salaryMin: 4, location: "Gurugram", type: "Internship",
    posted: "Today", applicants: 44, exp: "Fresher",
    skills: ["Python", "TensorFlow", "SQL"], status: "open",
    description: "Work on recommendation systems and demand forecasting models at India's food-tech leader.",
    color: "#ef4444", initial: "Z", postedBy: "admin",
  },
];

export const COMPANIES = [
  { name: "Google",       sector: "Technology",  roles: 5,  color: "#1a3a5c", initial: "G"  },
  { name: "Microsoft",    sector: "Technology",  roles: 8,  color: "#2ea87e", initial: "M"  },
  { name: "Amazon",       sector: "E-Commerce",  roles: 12, color: "#f59e0b", initial: "A"  },
  { name: "Goldman Sachs",sector: "Finance",     roles: 3,  color: "#1a3a5c", initial: "GS" },
  { name: "Deloitte",     sector: "Consulting",  roles: 7,  color: "#2ea87e", initial: "D"  },
  { name: "Adobe",        sector: "Technology",  roles: 4,  color: "#ef4444", initial: "Ad" },
  { name: "Flipkart",     sector: "E-Commerce",  roles: 6,  color: "#f59e0b", initial: "F"  },
  { name: "Infosys",      sector: "IT Services", roles: 15, color: "#4f46e5", initial: "In" },
  { name: "Zomato",       sector: "Food Tech",   roles: 4,  color: "#ef4444", initial: "Z"  },
];

export const STATS = [
  { label: "Students Placed",   value: "847",      icon: "👥", color: "#2ea87e" },
  { label: "Highest Package",   value: "₹52 LPA",  icon: "📈", color: "#2ea87e" },
  { label: "Average Package",   value: "₹12.5 LPA",icon: "💼", color: "#2ea87e" },
  { label: "Companies Visited", value: "120",      icon: "🏢", color: "#2ea87e" },
];

export const ANALYTICS_BRANCHES = [
  { label: "CS",  placed: 87, total: 92,  color: "#2ea87e" },
  { label: "IT",  placed: 74, total: 88,  color: "#3b6fd4" },
  { label: "ECE", placed: 65, total: 80,  color: "#f59e0b" },
  { label: "ME",  placed: 58, total: 76,  color: "#ef4444" },
  { label: "CE",  placed: 49, total: 68,  color: "#8b5cf6" },
];

export const ANALYTICS_PACKAGES = [
  { range: "5–10 LPA",  count: 38, color: "#3b6fd4" },
  { range: "10–15 LPA", count: 52, color: "#2ea87e" },
  { range: "15–25 LPA", count: 31, color: "#f59e0b" },
  { range: "25–40 LPA", count: 14, color: "#ef4444" },
  { range: "40+ LPA",   count: 7,  color: "#8b5cf6" },
];

export const TICKER_ITEMS = [
  "🎓 847 Students Placed",
  "💼 ₹52 LPA Highest Package",
  "🏢 120 Companies Visited",
  "📊 ₹12.5 LPA Average Package",
  "🚀 12 Active Drives",
  "⭐ 98.4% Satisfaction",
  "🎯 2,400+ Applications This Week",
  "🌟 New: Goldman Sachs Drive Open",
];
