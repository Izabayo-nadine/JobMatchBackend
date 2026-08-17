import { PrismaClient, Role, JobType, JobStatus, ApplicationStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clean existing data
  await prisma.jobApplication.deleteMany();
  await prisma.savedJob.deleteMany();
  await prisma.job.deleteMany();
  await prisma.user.deleteMany();
  const adminPass = process.env.ADMIN_PASSWORD || "admin123";
  const userPass = process.env.CANDIDATE_PASSWORD || "password123";
  const employerPass=process.env.EMPLOYER_PASSWORD ||"employer123"

  const candidatePassword = await bcrypt.hash(userPass, 10);
  const employerPassword=await bcrypt.hash(employerPass,10);

  const adminPassword = await bcrypt.hash(adminPass, 10);
  const email = process.env.ADMIN_EMAIL || "[EMAIL_ADDRESS]";

  // Inbuilt Admin User
  const adminUser = await prisma.user.create({
    data: {
      email: email,
      password: adminPassword,
      name: 'JobMatch Admin',
      role: Role.ADMIN,
      isVerified: true
    }
  });

  // Create Users
  const employer1 = await prisma.user.create({
    data: {
      email: 'employer@techcorp.com',
      password: employerPassword,
      name: 'TechCorp Solutions',
      role: Role.EMPLOYER,
      isVerified: true
    }
  });

  const employer2 = await prisma.user.create({
    data: {
      email: 'recruiter@cloudscale.io',
      password: employerPassword,
      name: 'CloudScale Tech',
      role: Role.EMPLOYER,
      isVerified: true
    }
  });

  const candidate1 = await prisma.user.create({
    data: {
      email: 'john.doe@gmail.com',
      password: candidatePassword,
      name: 'John Doe',
      role: Role.CANDIDATE,
      isVerified: true
    }
  });

  const candidate2 = await prisma.user.create({
    data: {
      email: 'jane.smith@gmail.com',
      password: candidatePassword,
      name: 'Jane Smith',
      role: Role.CANDIDATE,
      isVerified: true
    }
  });

  console.log('Created Users.');

  // Create Jobs
  const jobsData = [
    {
      title: 'Senior Full Stack Developer',
      description: 'We are seeking an experienced Senior Full Stack Developer to build modern web applications using Angular, Node.js, and PostgreSQL. You will lead system design and mentor junior team members.',
      requirements: '5+ years of software development experience; Proficiency in Angular, TypeScript, Node.js, and SQL; Experience with Docker and CI/CD pipelines.',
      responsibilities: 'Design and implement scalable APIs; Build responsive Angular frontend components; Collaborate with product managers and UI designers.',
      location: 'San Francisco, CA',
      type: JobType.FULL_TIME,
      category: 'Software Engineering',
      salary: '$120,000 - $150,000',
      experience: 'Senior Level (5+ yrs)',
      companyName: 'TechCorp Solutions',
      companyLogo: 'https://picsum.photos/id/1062/200/200',
      companyWebsite: 'https://techcorp.example.com',
      companySize: '100-500 employees',
      featured: true,
      status: JobStatus.ACTIVE,
      employerId: employer1.id
    },
    {
      title: 'Frontend Angular Specialist',
      description: 'Join our dynamic team building next-generation enterprise user interfaces. You will be responsible for creating pixel-perfect, high-performance web applications.',
      requirements: '3+ years experience with Angular 14+; Strong knowledge of RxJS, NgRx, and TypeScript; SCSS and responsive web design expertise.',
      responsibilities: 'Develop reusable UI components; Optimize web app performance; Work closely with UX researchers.',
      location: 'Remote',
      type: JobType.FULL_TIME,
      category: 'Frontend Development',
      salary: '$100,000 - $130,000',
      experience: 'Mid-Senior Level (3+ yrs)',
      companyName: 'TechCorp Solutions',
      companyLogo: 'https://picsum.photos/id/1062/200/200',
      companyWebsite: 'https://techcorp.example.com',
      companySize: '100-500 employees',
      featured: true,
      status: JobStatus.ACTIVE,
      employerId: employer1.id
    },
    {
      title: 'Backend Node.js & Cloud Engineer',
      description: 'CloudScale is hiring a Backend Engineer to architect cloud-native microservices and high-throughput databases.',
      requirements: '4+ years of backend development; Expertise in Express, PostgreSQL, Prisma, AWS, and Kubernetes.',
      responsibilities: 'Build secure RESTful and GraphQL APIs; Monitor microservice performance and uptime; Manage database migrations.',
      location: 'New York, NY',
      type: JobType.FULL_TIME,
      category: 'Backend Development',
      salary: '$110,000 - $140,000',
      experience: 'Mid-Senior Level (4+ yrs)',
      companyName: 'CloudScale Tech',
      companyLogo: 'https://picsum.photos/id/1060/200/200',
      companyWebsite: 'https://cloudscale.example.com',
      companySize: '50-200 employees',
      featured: true,
      status: JobStatus.ACTIVE,
      employerId: employer2.id
    },
    {
      title: 'UI/UX Product Designer',
      description: 'Create beautiful visual user journeys and wireframes for mobile and web apps.',
      requirements: 'Proficiency in Figma, Adobe XD, HTML/CSS basics; Strong portfolio of web applications.',
      responsibilities: 'Conduct user research and usability testing; Create design systems and prototypes.',
      location: 'Austin, TX',
      type: JobType.CONTRACT,
      category: 'Design & UX',
      salary: '$80,000 - $100,000',
      experience: 'Mid Level (2-4 yrs)',
      companyName: 'CloudScale Tech',
      companyLogo: 'https://picsum.photos/id/1060/200/200',
      companyWebsite: 'https://cloudscale.example.com',
      companySize: '50-200 employees',
      featured: false,
      status: JobStatus.ACTIVE,
      employerId: employer2.id
    },
    {
      title: 'Data Scientist & AI Specialist',
      description: 'Leverage machine learning and predictive analytics to solve complex business problems.',
      requirements: 'M.S. or Ph.D. in Computer Science or Data Science; Proficiency in Python, PyTorch, SQL.',
      responsibilities: 'Develop ML models for recommendation systems; Clean and process large datasets.',
      location: 'Remote',
      type: JobType.FULL_TIME,
      category: 'Data & AI',
      salary: '$130,000 - $165,000',
      experience: 'Senior Level (4+ yrs)',
      companyName: 'TechCorp Solutions',
      companyLogo: 'https://picsum.photos/id/1062/200/200',
      companyWebsite: 'https://techcorp.example.com',
      companySize: '100-500 employees',
      featured: true,
      status: JobStatus.ACTIVE,
      employerId: employer1.id
    }
  ];

  const createdJobs = [];
  for (const job of jobsData) {
    const created = await prisma.job.create({ data: job });
    createdJobs.push(created);
  }

  console.log(`Created ${createdJobs.length} Jobs.`);

  // Create Applications
  await prisma.jobApplication.create({
    data: {
      jobId: createdJobs[0].id,
      userId: candidate1.id,
      status: ApplicationStatus.PENDING,
      resume: 'https://example.com/resumes/john_doe_resume.pdf',
      coverLetter: 'I am thrilled to apply for the Senior Full Stack Developer role. My experience with Angular and Node fits your exact requirements.'
    }
  });

  await prisma.jobApplication.create({
    data: {
      jobId: createdJobs[1].id,
      userId: candidate2.id,
      status: ApplicationStatus.SHORTLISTED,
      resume: 'https://example.com/resumes/jane_smith_resume.pdf',
      coverLetter: 'As an Angular enthusiast with 4 years of hands-on experience, I would love to contribute to TechCorp UI applications.'
    }
  });

  // Saved Jobs
  await prisma.savedJob.create({
    data: {
      jobId: createdJobs[0].id,
      userId: candidate1.id
    }
  });

  await prisma.savedJob.create({
    data: {
      jobId: createdJobs[2].id,
      userId: candidate1.id
    }
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
