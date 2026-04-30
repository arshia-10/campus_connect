const mongoose = require('mongoose');
require('dotenv').config();
const Company = require('../src/models/Company');
const Job = require('../src/models/Job');

const MONGO = process.env.MONGO_URI;
    
const STATIC_JOBS = [
  {
    title: 'Software Engineer', company: 'Google', sector: 'Technology',
    salary: '₹18–25 LPA', salaryMin: 18, location: 'Bangalore', type: 'Full-time',
    posted: '2 days ago', applicants: 142, exp: '0–2 years',
    skills: ['React', 'Node.js', 'Python'], status: 'open',
    description: "Join Google's engineering team to build scalable web applications that serve billions of users.",
    color: '#1a3a5c', initial: 'G', postedBy: 'admin',
  },
  {
    title: 'Data Analyst Intern', company: 'Microsoft', sector: 'Technology',
    salary: '₹40K/month', salaryMin: 5, location: 'Hyderabad', type: 'Internship',
    posted: '1 day ago', applicants: 89, exp: 'Fresher',
    skills: ['Python', 'SQL', 'Power BI'], status: 'open',
    description: 'Work with massive datasets and build dashboards that drive strategic business decisions.',
    color: '#2ea87e', initial: 'M', postedBy: 'admin',
  },
  {
    title: 'Product Manager', company: 'Amazon', sector: 'E-Commerce',
    salary: '₹22–30 LPA', salaryMin: 22, location: 'Mumbai', type: 'Full-time',
    posted: '3 days ago', applicants: 210, exp: '0–1 years',
    skills: ['Product Thinking', 'SQL', 'Agile'], status: 'open',
    description: "Drive product vision and roadmap for Amazon's logistics and supply chain division.",
    color: '#f59e0b', initial: 'A', postedBy: 'admin',
  },
  {
    title: 'Financial Analyst', company: 'Goldman Sachs', sector: 'Finance',
    salary: '₹14–18 LPA', salaryMin: 14, location: 'Mumbai', type: 'Full-time',
    posted: '5 days ago', applicants: 173, exp: '0–2 years',
    skills: ['Excel', 'Financial Modeling', 'Python'], status: 'interviewing',
    description: "Analyze financial data and build models for strategic decision making at one of the world's top banks.",
    color: '#1a3a5c', initial: 'GS', postedBy: 'admin',
  },
  {
    title: 'Business Analyst', company: 'Deloitte', sector: 'Consulting',
    salary: '₹10–14 LPA', salaryMin: 10, location: 'Pune', type: 'Full-time',
    posted: '4 days ago', applicants: 95, exp: 'Fresher',
    skills: ['PowerPoint', 'Excel', 'SQL'], status: 'open',
    description: 'Solve complex business problems for Fortune 500 clients across diverse industries.',
    color: '#2ea87e', initial: 'D', postedBy: 'admin',
  },
  {
    title: 'UX Designer', company: 'Adobe', sector: 'Technology',
    salary: '₹12–16 LPA', salaryMin: 12, location: 'Noida', type: 'Full-time',
    posted: '1 week ago', applicants: 67, exp: '0–2 years',
    skills: ['Figma', 'User Research', 'Prototyping'], status: 'closed',
    description: "Design beautiful, intuitive experiences for Adobe's Creative Cloud suite used by millions.",
    color: '#ef4444', initial: 'Ad', postedBy: 'admin',
  },
  {
    title: 'Backend Developer', company: 'Flipkart', sector: 'E-Commerce',
    salary: '₹15–20 LPA', salaryMin: 15, location: 'Bangalore', type: 'Full-time',
    posted: '2 days ago', applicants: 118, exp: '0–1 years',
    skills: ['Java', 'Spring Boot', 'Kafka'], status: 'open',
    description: "Build and scale backend microservices powering India's largest e-commerce platform.",
    color: '#f59e0b', initial: 'F', postedBy: 'admin',
  },
  {
    title: 'ML Engineer Intern', company: 'Zomato', sector: 'Food Tech',
    salary: '₹35K/month', salaryMin: 4, location: 'Gurugram', type: 'Internship',
    posted: 'Today', applicants: 44, exp: 'Fresher',
    skills: ['Python', 'TensorFlow', 'SQL'], status: 'open',
    description: "Work on recommendation systems and demand forecasting models at India's food-tech leader.",
    color: '#ef4444', initial: 'Z', postedBy: 'admin',
  },
];

async function seed() {
  if (!MONGO) {
    throw new Error('MONGO_URI is missing. Set it to your Atlas connection string before running the seeder.');
  }

  await mongoose.connect(MONGO);
  console.log('Connected to MongoDB');

  for (const jobData of STATIC_JOBS) {
    const companyEmail = `${jobData.company.replace(/\s+/g, '').toLowerCase()}@seed.test`;
    let company = await Company.findOne({ company_name: jobData.company });

    if (!company) {
      company = await Company.create({
        company_name: jobData.company,
        email: companyEmail,
        password: 'password123',
      });
      console.log('Created company:', jobData.company);
    }

    const exists = await Job.findOne({ title: jobData.title, company: jobData.company });
    if (exists) {
      console.log('Job exists:', jobData.title);
      continue;
    }

    const deadline = new Date();
    deadline.setDate(deadline.getDate() + 30);

    const job = await Job.create({
      company_id: company._id,
      ...jobData,
      role: jobData.title,
      package: jobData.salary,
      skills_required: jobData.skills,
      deadline,
    });

    console.log('Created job:', job.title, job._id.toString());
  }

  await mongoose.disconnect();
  console.log('Seed complete');
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
