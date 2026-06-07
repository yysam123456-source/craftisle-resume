export interface ProfessionSeoData {
	slug: string;
	name: string;
	nameZh: string;
	description: string;
	keywords: string[];
}

export const professions: ProfessionSeoData[] = [
	// === Tech ===
	{
		slug: "software-engineer",
		name: "Software Engineer",
		nameZh: "软件工程师",
		description:
			"Create a professional software engineer resume that highlights your coding skills, projects, and technical expertise. Free ATS-friendly template.",
		keywords: ["software engineer resume", "developer CV", "programmer resume"],
	},
	{
		slug: "frontend-developer",
		name: "Frontend Developer",
		nameZh: "前端开发",
		description:
			"Build a frontend developer resume showcasing React, Vue, and UI/UX skills. Free template with live preview.",
		keywords: ["frontend developer resume", "React developer CV", "web developer resume"],
	},
	{
		slug: "backend-developer",
		name: "Backend Developer",
		nameZh: "后端开发",
		description:
			"Create a backend developer resume highlighting APIs, databases, and system design experience. ATS-optimized.",
		keywords: ["backend developer resume", "API developer CV", "server-side developer"],
	},
	{
		slug: "full-stack-developer",
		name: "Full Stack Developer",
		nameZh: "全栈开发",
		description:
			"Make a full stack developer resume that demonstrates end-to-end web development expertise. Free online builder.",
		keywords: ["full stack developer resume", "MERN stack resume", "web developer CV"],
	},
	{
		slug: "data-scientist",
		name: "Data Scientist",
		nameZh: "数据科学家",
		description:
			"Craft a data scientist resume highlighting Python, ML, and data analysis projects. Free ATS-friendly format.",
		keywords: ["data scientist resume", "machine learning resume", "Python developer CV"],
	},
	{
		slug: "devops-engineer",
		name: "DevOps Engineer",
		nameZh: "运维工程师",
		description: "Create a DevOps engineer resume showcasing CI/CD, cloud, and automation skills. Free template.",
		keywords: ["DevOps resume", "SRE resume", "cloud engineer CV"],
	},
	{
		slug: "product-manager",
		name: "Product Manager",
		nameZh: "产品经理",
		description:
			"Build a product manager resume that demonstrates user-centric thinking and roadmap execution. Free ATS template.",
		keywords: ["product manager resume", "PM resume", "product owner CV"],
	},
	{
		slug: "ui-ux-designer",
		name: "UI/UX Designer",
		nameZh: "UI/UX设计师",
		description:
			"Design a UI/UX designer resume portfolio with skills in Figma, user research, and design systems. Free builder.",
		keywords: ["UI UX designer resume", "product designer CV", "Figma designer resume"],
	},
	{
		slug: "qa-engineer",
		name: "QA Engineer",
		nameZh: "测试工程师",
		description:
			"Write a QA engineer resume highlighting test automation, manual testing, and quality processes. Free ATS format.",
		keywords: ["QA engineer resume", "test automation resume", "SDET CV"],
	},
	{
		slug: "security-engineer",
		name: "Security Engineer",
		nameZh: "安全工程师",
		description:
			"Create a cybersecurity resume showcasing penetration testing, compliance, and security architecture. Free template.",
		keywords: ["security engineer resume", "cybersecurity resume", "information security CV"],
	},

	// === Business ===
	{
		slug: "project-manager",
		name: "Project Manager",
		nameZh: "项目经理",
		description:
			"Make a project manager resume with PMP certification and agile methodology highlights. Free ATS-optimized.",
		keywords: ["project manager resume", "PMP resume", "agile project manager CV"],
	},
	{
		slug: "business-analyst",
		name: "Business Analyst",
		nameZh: "业务分析师",
		description:
			"Craft a business analyst resume showing requirements gathering and process improvement. Free template.",
		keywords: ["business analyst resume", "BA resume", "requirements analyst CV"],
	},
	{
		slug: "data-analyst",
		name: "Data Analyst",
		nameZh: "数据分析师",
		description: "Build a data analyst resume with SQL, Excel, and visualization skills. Free ATS-friendly format.",
		keywords: ["data analyst resume", "SQL resume", "business intelligence CV"],
	},
	{
		slug: "marketing-manager",
		name: "Marketing Manager",
		nameZh: "市场经理",
		description:
			"Create a marketing manager resume highlighting campaigns, SEO, and brand management. Free online builder.",
		keywords: ["marketing manager resume", "digital marketing resume", "brand manager CV"],
	},
	{
		slug: "sales-manager",
		name: "Sales Manager",
		nameZh: "销售经理",
		description:
			"Write a sales manager resume with quota achievement and team leadership highlights. Free ATS template.",
		keywords: ["sales manager resume", "sales director CV", "business development resume"],
	},
	{
		slug: "accountant",
		name: "Accountant",
		nameZh: "会计",
		description: "Make an accountant resume showcasing CPA, financial reporting, and audit experience. Free template.",
		keywords: ["accountant resume", "CPA resume", "financial accountant CV"],
	},
	{
		slug: "financial-analyst",
		name: "Financial Analyst",
		nameZh: "金融分析师",
		description: "Craft a financial analyst resume with modeling, forecasting, and valuation skills. Free ATS format.",
		keywords: ["financial analyst resume", "FP&A resume", "investment analyst CV"],
	},
	{
		slug: "hr-manager",
		name: "HR Manager",
		nameZh: "人力资源经理",
		description:
			"Build an HR manager resume highlighting talent acquisition and employee relations. Free online builder.",
		keywords: ["HR manager resume", "human resources CV", "recruiter resume"],
	},
	{
		slug: "operations-manager",
		name: "Operations Manager",
		nameZh: "运营经理",
		description:
			"Create an operations manager resume showing process optimization and cost reduction. Free ATS template.",
		keywords: ["operations manager resume", "COO resume", "business operations CV"],
	},

	// === Healthcare ===
	{
		slug: "nurse",
		name: "Nurse",
		nameZh: "护士",
		description:
			"Create a professional nurse resume with clinical experience and certifications. Free ATS-friendly template.",
		keywords: ["nurse resume", "RN resume", "registered nurse CV"],
	},
	{
		slug: "doctor",
		name: "Doctor",
		nameZh: "医生",
		description: "Build a doctor resume highlighting medical education, residency, and specialties. Free template.",
		keywords: ["doctor resume", "physician CV", "medical doctor resume"],
	},
	{
		slug: "medical-assistant",
		name: "Medical Assistant",
		nameZh: "医疗助理",
		description: "Write a medical assistant resume with clinical and administrative skills. Free ATS format.",
		keywords: ["medical assistant resume", "CMA resume", "clinical assistant CV"],
	},
	{
		slug: "pharmacist",
		name: "Pharmacist",
		nameZh: "药剂师",
		description: "Craft a pharmacist resume showcasing pharmaceutical care and medication management. Free template.",
		keywords: ["pharmacist resume", "pharmacy CV", "clinical pharmacist resume"],
	},

	// === Education ===
	{
		slug: "teacher",
		name: "Teacher",
		nameZh: "教师",
		description:
			"Make a teacher resume highlighting classroom management and curriculum development. Free ATS-optimized.",
		keywords: ["teacher resume", "educator CV", "school teacher resume"],
	},
	{
		slug: "professor",
		name: "Professor",
		nameZh: "教授",
		description:
			"Create a professor resume with research publications and teaching experience. Free academic template.",
		keywords: ["professor resume", "academic CV", "university professor resume"],
	},
	{
		slug: "tutor",
		name: "Tutor",
		nameZh: "家教",
		description: "Build a tutor resume showcasing subject expertise and student success stories. Free template.",
		keywords: ["tutor resume", "private tutor CV", "academic tutor resume"],
	},

	// === Creative ===
	{
		slug: "graphic-designer",
		name: "Graphic Designer",
		nameZh: "平面设计师",
		description:
			"Design a graphic designer resume with portfolio highlights and Adobe Creative Suite skills. Free builder.",
		keywords: ["graphic designer resume", "visual designer CV", "Adobe Photoshop resume"],
	},
	{
		slug: "video-editor",
		name: "Video Editor",
		nameZh: "视频剪辑",
		description:
			"Create a video editor resume showcasing Premiere Pro, After Effects, and storytelling. Free template.",
		keywords: ["video editor resume", "motion graphics resume", "Premiere Pro CV"],
	},
	{
		slug: "content-writer",
		name: "Content Writer",
		nameZh: "内容写手",
		description: "Write a content writer resume with SEO writing and editorial experience. Free ATS-friendly format.",
		keywords: ["content writer resume", "copywriter CV", "SEO writer resume"],
	},

	// === Entry Level ===
	{
		slug: "recent-graduate",
		name: "Recent Graduate",
		nameZh: "应届毕业生",
		description:
			"Create a recent graduate resume with internship experience and academic projects. Free entry-level template.",
		keywords: ["recent graduate resume", "new graduate CV", "entry level resume"],
	},
	{
		slug: "intern",
		name: "Intern",
		nameZh: "实习生",
		description: "Build an intern resume highlighting academic achievements and relevant coursework. Free template.",
		keywords: ["intern resume", "internship resume", "college student CV"],
	},
	{
		slug: "career-changer",
		name: "Career Changer",
		nameZh: "转行者",
		description: "Make a career changer resume that transfers skills to a new industry. Free ATS template.",
		keywords: ["career change resume", "transferable skills resume", "career pivot CV"],
	},

	// === Engineering ===
	{
		slug: "mechanical-engineer",
		name: "Mechanical Engineer",
		nameZh: "机械工程师",
		description: "Craft a mechanical engineer resume with CAD, thermodynamics, and design experience. Free template.",
		keywords: ["mechanical engineer resume", "CAD engineer CV", "mechanical design resume"],
	},
	{
		slug: "civil-engineer",
		name: "Civil Engineer",
		nameZh: "土木工程师",
		description: "Create a civil engineer resume highlighting infrastructure projects and PE license. Free ATS format.",
		keywords: ["civil engineer resume", "structural engineer CV", "PE resume"],
	},
	{
		slug: "electrical-engineer",
		name: "Electrical Engineer",
		nameZh: "电气工程师",
		description: "Build an electrical engineer resume with circuit design and power systems experience. Free template.",
		keywords: ["electrical engineer resume", "electronics engineer CV", "power systems resume"],
	},
	{
		slug: "chemical-engineer",
		name: "Chemical Engineer",
		nameZh: "化学工程师",
		description: "Write a chemical engineer resume showcasing process design and safety compliance. Free ATS template.",
		keywords: ["chemical engineer resume", "process engineer CV", "chemical plant resume"],
	},

	// === Legal ===
	{
		slug: "lawyer",
		name: "Lawyer",
		nameZh: "律师",
		description: "Create a lawyer resume with practice area expertise and case wins. Free professional template.",
		keywords: ["lawyer resume", "attorney CV", "legal counsel resume"],
	},
	{
		slug: "paralegal",
		name: "Paralegal",
		nameZh: "律师助理",
		description: "Make a paralegal resume highlighting legal research and document preparation. Free ATS format.",
		keywords: ["paralegal resume", "legal assistant CV", "law firm resume"],
	},

	// === More Tech ===
	{
		slug: "mobile-developer",
		name: "Mobile Developer",
		nameZh: "移动开发",
		description: "Build a mobile developer resume with iOS/Android app portfolio. Free React Native template.",
		keywords: ["mobile developer resume", "iOS developer CV", "Android developer resume"],
	},
	{
		slug: "game-developer",
		name: "Game Developer",
		nameZh: "游戏开发",
		description: "Create a game developer resume showcasing Unity, Unreal, and shipped titles. Free template.",
		keywords: ["game developer resume", "Unity developer CV", "game programmer resume"],
	},
	{
		slug: "ai-engineer",
		name: "AI Engineer",
		nameZh: "AI工程师",
		description: "Craft an AI engineer resume with LLM, RAG, and MLOps experience. Free ATS-friendly.",
		keywords: ["AI engineer resume", "machine learning engineer", "LLM developer CV"],
	},
	{
		slug: "cloud-architect",
		name: "Cloud Architect",
		nameZh: "云架构师",
		description: "Write a cloud architect resume with AWS/Azure and infrastructure design. Free template.",
		keywords: ["cloud architect resume", "solutions architect CV", "AWS architect resume"],
	},

	// === Remote / Freelance ===
	{
		slug: "freelancer",
		name: "Freelancer",
		nameZh: "自由职业者",
		description: "Make a freelancer resume showcasing client projects and niche expertise. Free portfolio template.",
		keywords: ["freelancer resume", "independent contractor CV", "gig economy resume"],
	},
	{
		slug: "remote-worker",
		name: "Remote Worker",
		nameZh: "远程工作者",
		description: "Create a remote work resume highlighting distributed team collaboration. Free ATS template.",
		keywords: ["remote work resume", "work from home CV", "distributed team resume"],
	},

	// === Students ===
	{
		slug: "high-school-student",
		name: "High School Student",
		nameZh: "高中生",
		description: "Build a high school student resume for college applications and first jobs. Free template.",
		keywords: ["high school resume", "teenager resume", "first job resume"],
	},
	{
		slug: "college-student",
		name: "College Student",
		nameZh: "大学生",
		description: "Craft a college student resume with campus involvement and part-time work. Free ATS format.",
		keywords: ["college student resume", "undergraduate CV", "university student resume"],
	},

	// === Executive ===
	{
		slug: "ceo",
		name: "CEO",
		nameZh: "首席执行官",
		description: "Create a CEO resume with P&L ownership and strategic leadership highlights. Free executive template.",
		keywords: ["CEO resume", "executive director CV", "C-suite resume"],
	},
	{
		slug: "cto",
		name: "CTO",
		nameZh: "首席技术官",
		description: "Make a CTO resume showcasing technology strategy and team scaling. Free ATS executive format.",
		keywords: ["CTO resume", "chief technology officer CV", "tech executive resume"],
	},
	{
		slug: "director",
		name: "Director",
		nameZh: "总监",
		description: "Write a director resume with organizational leadership and budget management. Free template.",
		keywords: ["director resume", "executive director CV", "senior management resume"],
	},

	// === Hospitality ===
	{
		slug: "chef",
		name: "Chef",
		nameZh: "厨师",
		description: "Create a chef resume with culinary training and kitchen management experience. Free template.",
		keywords: ["chef resume", "sous chef CV", "culinary resume"],
	},
	{
		slug: "hotel-manager",
		name: "Hotel Manager",
		nameZh: "酒店经理",
		description: "Build a hotel manager resume highlighting guest satisfaction and revenue growth. Free ATS format.",
		keywords: ["hotel manager resume", "hospitality CV", "hotel general manager"],
	},

	// === Retail ===
	{
		slug: "retail-manager",
		name: "Retail Manager",
		nameZh: "零售经理",
		description: "Craft a retail manager resume with sales growth and team leadership. Free template.",
		keywords: ["retail manager resume", "store manager CV", "retail supervisor resume"],
	},
	{
		slug: "cashier",
		name: "Cashier",
		nameZh: "收银员",
		description:
			"Write a cashier resume with customer service and point-of-sale experience. Free entry-level template.",
		keywords: ["cashier resume", "retail associate CV", "customer service resume"],
	},

	// === More Professions ===
	{
		slug: "customer-support",
		name: "Customer Support",
		nameZh: "客户支持",
		description:
			"Create a customer support resume highlighting problem resolution and CSAT improvement. Free template.",
		keywords: ["customer support resume", "customer service CV", "support specialist resume"],
	},
	{
		slug: "warehouse-worker",
		name: "Warehouse Worker",
		nameZh: "仓库工人",
		description: "Make a warehouse worker resume with inventory management and safety compliance. Free ATS format.",
		keywords: ["warehouse resume", "warehouse associate CV", "inventory clerk resume"],
	},
	{
		slug: "driver",
		name: "Driver",
		nameZh: "司机",
		description: "Build a driver resume with clean driving record and delivery experience. Free CDL template.",
		keywords: ["driver resume", "truck driver CV", "delivery driver resume"],
	},
	{
		slug: "admin-assistant",
		name: "Admin Assistant",
		nameZh: "行政助理",
		description: "Craft an admin assistant resume with office management and scheduling skills. Free template.",
		keywords: ["admin assistant resume", "administrative CV", "office assistant resume"],
	},
	{
		slug: "receptionist",
		name: "Receptionist",
		nameZh: "前台",
		description: "Write a receptionist resume with front desk and communication skills. Free entry-level format.",
		keywords: ["receptionist resume", "front desk CV", "office reception resume"],
	},
	{
		slug: "real-estate-agent",
		name: "Real Estate Agent",
		nameZh: "房地产经纪人",
		description: "Create a real estate agent resume with sales performance and client relations. Free template.",
		keywords: ["real estate resume", "realtor CV", "property agent resume"],
	},
	{
		slug: "social-media-manager",
		name: "Social Media Manager",
		nameZh: "社交媒体经理",
		description: "Make a social media manager resume with campaign metrics and content strategy. Free ATS template.",
		keywords: ["social media manager resume", "community manager CV", "content strategist resume"],
	},
];
