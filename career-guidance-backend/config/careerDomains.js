/**
 * Centralized Multi-Domain Career Configuration
 * Supports 17 career domains & 44 specific roles across technical, business, creative, financial, and management disciplines.
 * EVERY role contains a dedicated skill definition and a dedicated 7-step career roadmap.
 */

const CAREER_DOMAINS = {
  "Software Development / IT": {
    name: "Software Development / IT",
    roles: ["Software Developer", "Full Stack Developer", "Backend Developer", "Frontend Developer"],
    interests: ["Programming", "Web Development", "Software Engineering", "Problem Solving", "System Architecture"],
    aptitude: ["logical reasoning", "analytical thinking", "problem solving"],
    workStyles: ["Analytical", "Creative", "Independent", "Collaborative"],
    skills: {
      "Software Developer": {
        coreSkills: ["JavaScript", "Data Structures", "Algorithms", "Git", "Problem Solving"],
        technicalSkills: ["Node.js", "React", "REST APIs", "Databases", "SQL", "MongoDB"],
        recommendedSkills: ["System Design", "Testing", "Docker", "Cloud"],
      },
      "Full Stack Developer": {
        coreSkills: ["JavaScript", "HTML", "CSS", "React", "Node.js"],
        technicalSkills: ["Express.js", "MongoDB", "SQL", "REST APIs", "Git", "Authentication"],
        recommendedSkills: ["Docker", "Deployment", "Testing", "Cloud"],
      },
      "Backend Developer": {
        coreSkills: ["Node.js", "Express.js", "Python", "Java", "SQL"],
        technicalSkills: ["MongoDB", "REST APIs", "Database Design", "Authentication", "Git"],
        recommendedSkills: ["Microservices", "Docker", "Redis", "System Design"],
      },
      "Frontend Developer": {
        coreSkills: ["HTML", "CSS", "JavaScript", "React"],
        technicalSkills: ["Tailwind CSS", "Redux", "REST APIs", "Web Performance", "Git"],
        recommendedSkills: ["TypeScript", "Next.js", "UI Testing", "Figma"],
      },
    },
    roadmaps: {
      "Software Developer": [
        { step: 1, title: "Programming Fundamentals & Logic", description: "Master core programming concepts, control structures, and basic algorithms." },
        { step: 2, title: "Data Structures & Algorithmic Complexity", description: "Master arrays, linked lists, trees, graphs, sorting, and Big-O analysis." },
        { step: 3, title: "Version Control & Git Collaboration", description: "Learn Git branching workflows, GitHub repositories, and code reviews." },
        { step: 4, title: "Full Stack Web & API Integration", description: "Build scalable web components and integrate REST APIs." },
        { step: 5, title: "Database Systems & SQL Optimization", description: "Practice relational database design, indexing, and complex queries." },
        { step: 6, title: "Production Capstone Application", description: "Construct an end-to-end full stack application with authentication." },
        { step: 7, title: "Technical Interview & Coding Preparation", description: "Practice LeetCode problem solving, System Design, and mock technical rounds." },
      ],
      "Full Stack Developer": [
        { step: 1, title: "HTML5, CSS3 & Responsive Design", description: "Master semantic markup, Flexbox, CSS Grid, and mobile-first layouts." },
        { step: 2, title: "Modern JavaScript (ES6+)", description: "Understand async/await, promises, closure, DOM, and event loop." },
        { step: 3, title: "Frontend Framework (React)", description: "Master components, hooks, state management, and client routing." },
        { step: 4, title: "Backend API Development (Node.js & Express)", description: "Build RESTful services, middleware, and JWT authentication." },
        { step: 5, title: "NoSQL & SQL Database Management", description: "Design MongoDB Mongoose schemas and SQL relational queries." },
        { step: 6, title: "MERN Stack Production Capstone", description: "Deploy a full stack application with CI/CD on cloud hosting." },
        { step: 7, title: "Full Stack Interview & Portfolio Readiness", description: "Assemble GitHub portfolio, write technical docs, and practice live coding." },
      ],
      "Backend Developer": [
        { step: 1, title: "Server-Side Language Core", description: "Master Node.js, Python, or Java backend programming constructs." },
        { step: 2, title: "RESTful API Architecture & Protocol", description: "Design HTTP methods, status codes, headers, and request validation." },
        { step: 3, title: "Relational & NoSQL Database Engineering", description: "Master PostgreSQL/MySQL joins, indexing, and MongoDB aggregation." },
        { step: 4, title: "Authentication, Authorization & Security", description: "Implement JWT tokens, OAuth2, password hashing, and CORS." },
        { step: 5, title: "Caching & Message Queue Architecture", description: "Utilize Redis caching and asynchronous job queues." },
        { step: 6, title: "Microservices & Cloud Backend Capstone", description: "Build scalable backend microservices connected to cloud databases." },
        { step: 7, title: "Backend System Design & Interview Prep", description: "Prepare load balancing, rate limiting, and system design interviews." },
      ],
      "Frontend Developer": [
        { step: 1, title: "Web Standards & Semantic HTML/CSS", description: "Master responsive design, accessibility (a11y), and CSS utilities." },
        { step: 2, title: "Core JavaScript Architecture", description: "Understand execution context, closures, fetch API, and ES modules." },
        { step: 3, title: "React Component & State Engineering", description: "Build modular UI components with state management (Redux/Zustand)." },
        { step: 4, title: "UI Components & Styling Frameworks", description: "Implement Tailwind CSS, Styled Components, and Component Libraries." },
        { step: 5, title: "Web Performance & Optimization", description: "Optimize bundle size, code splitting, lazy loading, and Core Web Vitals." },
        { step: 6, title: "Interactive Web Application Project", description: "Build a rich single-page application consuming external REST APIs." },
        { step: 7, title: "Frontend Portfolio & Coding Interview", description: "Create portfolio website and solve frontend coding challenges." },
      ],
    },
  },

  "Data Analytics & Data Science": {
    name: "Data Analytics & Data Science",
    roles: ["Data Analyst", "Data Scientist", "Business Analyst", "BI Analyst"],
    interests: ["Data", "Analytics", "Business", "Statistics", "Data Visualization", "Numbers"],
    aptitude: ["numerical reasoning", "analytical thinking", "logical reasoning"],
    workStyles: ["Analytical", "Collaborative", "Structured"],
    skills: {
      "Data Analyst": {
        coreSkills: ["Excel", "SQL", "Statistics", "Python", "Data Analysis"],
        technicalSkills: ["Pandas", "NumPy", "Power BI", "Tableau", "Data Visualization"],
        recommendedSkills: ["Business Intelligence", "Data Storytelling", "ETL", "Data Cleaning"],
      },
      "Data Scientist": {
        coreSkills: ["Python", "SQL", "Statistics", "Pandas", "NumPy"],
        technicalSkills: ["Machine Learning", "Data Visualization", "Scikit-learn", "Data Cleaning", "EDA"],
        recommendedSkills: ["Deep Learning", "TensorFlow", "Power BI", "A/B Testing"],
      },
      "Business Analyst": {
        coreSkills: ["Excel", "SQL", "Business Analysis", "Requirements Gathering", "Data Visualization"],
        technicalSkills: ["Power BI", "Tableau", "Process Mapping", "Agile/Scrum", "Documentation"],
        recommendedSkills: ["Financial Modeling", "Python", "Jira", "Stakeholder Management"],
      },
      "BI Analyst": {
        coreSkills: ["SQL", "Power BI", "Tableau", "Data Modeling", "ETL"],
        technicalSkills: ["Excel", "Data Warehousing", "DAX", "Dashboard Development", "Reporting"],
        recommendedSkills: ["Python", "SSIS", "Data Governance", "Business Analytics"],
      },
    },
    roadmaps: {
      "Data Analyst": [
        { step: 1, title: "Master Excel & Spreadsheet Analytics", description: "Learn formulas, pivot tables, VLOOKUP, INDEX-MATCH, and data cleansing." },
        { step: 2, title: "Master SQL Queries & Database Extraction", description: "Practice SELECT, JOINs, GROUP BY, CTEs, and window functions." },
        { step: 3, title: "Learn Python for Data Manipulation", description: "Use Pandas and NumPy for data manipulation, filtering, and aggregation." },
        { step: 4, title: "Data Visualization & Dashboarding", description: "Create interactive dashboards using Power BI and Matplotlib." },
        { step: 5, title: "Applied Statistics for Business Intelligence", description: "Learn probability, distributions, correlation, and hypothesis testing." },
        { step: 6, title: "Real-World Business Analytics Project", description: "Solve a business problem end-to-end using real customer dataset." },
        { step: 7, title: "Data Interview Preparation & Portfolio", description: "Prepare SQL case studies, portfolio presentation, and interview prep." },
      ],
      "Data Scientist": [
        { step: 1, title: "Python & Numerical Computing", description: "Master Python programming, NumPy matrix algebra, and Pandas DataFrames." },
        { step: 2, title: "SQL & Feature Extraction", description: "Extract complex dataset features using SQL queries and relational models." },
        { step: 3, title: "Mathematical Foundations & Probability", description: "Study linear algebra, calculus, probability theory, and regression models." },
        { step: 4, title: "Exploratory Data Analysis & Feature Engineering", description: "Clean raw data, handle outliers, and create high-predictive features." },
        { step: 5, title: "Machine Learning Model Training", description: "Train classification, clustering, decision trees, and ensemble algorithms." },
        { step: 6, title: "End-to-End Data Science Project", description: "Deploy a predictive machine learning pipeline with interactive dashboard." },
        { step: 7, title: "Data Science Technical Interview Prep", description: "Practice coding algorithms, ML theory, statistics, and case study rounds." },
      ],
      "Business Analyst": [
        { step: 1, title: "Business Analysis Principles & Requirements", description: "Understand BRD, FRD, use cases, and stakeholder elicitation." },
        { step: 2, title: "Process Flow & System Modeling (BPMN)", description: "Create flowcharts, wireframes, and business process diagrams." },
        { step: 3, title: "SQL & Data Extraction for Business Insights", description: "Query databases to validate metrics and user behaviors." },
        { step: 4, title: "Business Intelligence & Dashboarding (Power BI)", description: "Build executive summary dashboards for business KPIs." },
        { step: 5, title: "Agile, Scrum & Product Backlog Management", description: "Manage epics, user stories, and sprints in Jira." },
        { step: 6, title: "Business Requirement Case Study", description: "Draft complete PRD and gap analysis for an enterprise solution." },
        { step: 7, title: "BA Interview & Case Study Preparation", description: "Practice guesstimates, business case studies, and interview rounds." },
      ],
      "BI Analyst": [
        { step: 1, title: "Relational Database & SQL Mastery", description: "Master complex SQL aggregations, views, and CTEs." },
        { step: 2, title: "Data Warehousing Concepts (Star/Snowflake Schema)", description: "Understand dimension tables, fact tables, and ETL principles." },
        { step: 3, title: "Advanced Power BI & DAX Calculations", description: "Create calculated measures, columns, and data models." },
        { step: 4, title: "Tableau Visual Analytics & Storytelling", description: "Build interactive Tableau workbooks and executive stories." },
        { step: 5, title: "Data Governance & Reporting Automation", description: "Automate scheduled dataset refreshes and access controls." },
        { step: 6, title: "Enterprise BI Dashboard Capstone", description: "Construct end-to-end executive BI dashboard connected to live data." },
        { step: 7, title: "BI Technical Interview & Portfolio Prep", description: "Prepare SQL queries, data model design, and dashboard portfolio." },
      ],
    },
  },

  "Artificial Intelligence & Machine Learning": {
    name: "Artificial Intelligence & Machine Learning",
    roles: ["AI Engineer", "Machine Learning Engineer"],
    interests: ["AI", "Machine Learning", "Neural Networks", "Deep Learning", "Automation"],
    aptitude: ["analytical thinking", "logical reasoning", "problem solving"],
    workStyles: ["Analytical", "Creative", "Independent"],
    skills: {
      "AI Engineer": {
        coreSkills: ["Python", "Machine Learning", "Artificial Intelligence", "Statistics"],
        technicalSkills: ["Deep Learning", "TensorFlow", "PyTorch", "NLP", "Generative AI"],
        recommendedSkills: ["LLMs", "Computer Vision", "Model Deployment", "Docker"],
      },
      "Machine Learning Engineer": {
        coreSkills: ["Python", "Statistics", "Machine Learning", "Linear Algebra", "SQL"],
        technicalSkills: ["Scikit-learn", "TensorFlow", "Model Evaluation", "Feature Engineering", "Pandas"],
        recommendedSkills: ["MLOps", "Docker", "Cloud ML", "Deep Learning"],
      },
    },
    roadmaps: {
      "AI Engineer": [
        { step: 1, title: "Master Python & Scientific Libraries", description: "Master Python, NumPy, Pandas, and object-oriented architecture." },
        { step: 2, title: "Mathematical Foundations for AI", description: "Study linear algebra, calculus, probability, and optimization techniques." },
        { step: 3, title: "Core Machine Learning Algorithms", description: "Implement regression, classification, decision trees, and clustering." },
        { step: 4, title: "Deep Learning & Neural Networks", description: "Build PyTorch / TensorFlow models for image recognition and NLP." },
        { step: 5, title: "Generative AI & LLM Fine-Tuning", description: "Explore prompt engineering, RAG, Hugging Face transformers, and fine-tuning." },
        { step: 6, title: "AI Application Capstone", description: "Build and deploy an AI microservice application with model endpoint." },
        { step: 7, title: "AI Engineering Placement Preparation", description: "Prepare ML algorithms, system design for AI, and coding interviews." },
      ],
      "Machine Learning Engineer": [
        { step: 1, title: "Python & Data Science Stack", description: "Master Python, NumPy, Pandas, and data processing routines." },
        { step: 2, title: "Mathematics & Statistical Learning", description: "Master linear algebra, vector calculus, probability, and hypothesis testing." },
        { step: 3, title: "Supervised & Unsupervised Learning", description: "Implement Scikit-learn classification, regression, and clustering." },
        { step: 4, title: "Feature Engineering & Model Tuning", description: "Perform hyperparameter tuning, cross-validation, and metrics evaluation." },
        { step: 5, title: "Deep Learning Architectures", description: "Build CNNs, RNNs, and Transformers using PyTorch." },
        { step: 6, title: "MLOps & Model Deployment", description: "Containerize ML models using Docker and deploy API endpoints on cloud." },
        { step: 7, title: "ML Technical Interview & Portfolio Prep", description: "Solve algorithmic ML coding, model architecture, and system design." },
      ],
    },
  },

  "Cybersecurity": {
    name: "Cybersecurity",
    roles: ["SOC Analyst", "Cybersecurity Engineer", "Information Security Analyst"],
    interests: ["CyberSecurity", "Networking", "Ethical Hacking", "Security", "Risk Assessment"],
    aptitude: ["analytical thinking", "problem solving", "logical reasoning"],
    workStyles: ["Analytical", "Structured", "Independent"],
    skills: {
      "SOC Analyst": {
        coreSkills: ["Networking", "Cybersecurity", "SIEM", "Incident Response", "Linux"],
        technicalSkills: ["Log Analysis", "Wireshark", "Threat Detection", "Firewalls", "Python"],
        recommendedSkills: ["CEH", "CompTIA Security+", "Vulnerability Scanning", "Scripting"],
      },
      "Cybersecurity Engineer": {
        coreSkills: ["Network Security", "Cryptography", "Firewalls", "Linux", "Python"],
        technicalSkills: ["Vulnerability Assessment", "Penetration Testing", "Security Architecture", "Cloud Security"],
        recommendedSkills: ["CISSP", "Docker", "DevSecOps", "Incident Management"],
      },
      "Information Security Analyst": {
        coreSkills: ["Information Security", "Risk Assessment", "Compliance", "Security Auditing"],
        technicalSkills: ["SIEM", "Policy Enforcement", "Data Protection", "Access Control"],
        recommendedSkills: ["ISO 27001", "NIST Framework", "Cloud Compliance", "Security Training"],
      },
    },
    roadmaps: {
      "SOC Analyst": [
        { step: 1, title: "Computer Networking & Protocols", description: "Master TCP/IP, OSI model, DNS, DHCP, and packet analysis." },
        { step: 2, title: "Linux Administration & Bash Scripting", description: "Learn Linux terminal commands, file permissions, and process management." },
        { step: 3, title: "Cybersecurity Fundamentals & Threat Landscape", description: "Understand malware types, attack vectors, vulnerabilities, and defenses." },
        { step: 4, title: "SIEM & Log Monitoring (Splunk / Elastic)", description: "Practice analyzing security logs, correlation rules, and alerts." },
        { step: 5, title: "Incident Response & Network Forensics", description: "Investigate security incidents using Wireshark and memory analysis tools." },
        { step: 6, title: "SOC Lab Capstone Project", description: "Simulate threat detection, incident containment, and report generation." },
        { step: 7, title: "Security Certification & Interview Prep", description: "Prepare CompTIA Security+ concepts, scenario questions, and technical rounds." },
      ],
      "Cybersecurity Engineer": [
        { step: 1, title: "Network Architecture & Operating Systems", description: "Master Linux, Windows Server, network topology, and protocols." },
        { step: 2, title: "System Hardening & Firewall Management", description: "Configure firewalls, IDS/IPS, VPNs, and secure network perimeters." },
        { step: 3, title: "Vulnerability Assessment & Penetration Testing", description: "Use Nmap, Nessus, Metasploit, and Burp Suite for audit." },
        { step: 4, title: "Cryptography & PKI Infrastructure", description: "Understand symmetric/asymmetric encryption, SSL/TLS, and certificates." },
        { step: 5, title: "Cloud Security & DevSecOps", description: "Integrate security checks into AWS infrastructure and CI/CD pipelines." },
        { step: 6, title: "Security Architecture Capstone", description: "Design a secure enterprise network with threat mitigation layer." },
        { step: 7, title: "Cybersecurity Interview & Certification", description: "Prepare technical scenario rounds, CEH/CISSP concepts, and interviews." },
      ],
      "Information Security Analyst": [
        { step: 1, title: "Information Security Governance Principles", description: "Understand CIA triad, security policies, and risk management frameworks." },
        { step: 2, title: "Regulatory Compliance Frameworks (NIST, ISO 27001)", description: "Study ISO 27001 controls, NIST Cybersecurity Framework, and GDPR." },
        { step: 3, title: "Risk Assessment & Security Auditing", description: "Perform asset identification, threat modeling, and audit reporting." },
        { step: 4, title: "Data Loss Prevention (DLP) & Identity Management", description: "Implement IAM policies, multi-factor auth, and DLP controls." },
        { step: 5, title: "Incident Management & Business Continuity", description: "Draft disaster recovery plans and incident handling procedures." },
        { step: 6, title: "Security Audit & Compliance Capstone", description: "Conduct mock security compliance audit and risk remediation report." },
        { step: 7, title: "InfoSec Analyst Placement Interview Prep", description: "Prepare GRC scenarios, audit questions, and placement rounds." },
      ],
    },
  },

  "Cloud & DevOps": {
    name: "Cloud & DevOps",
    roles: ["Cloud Support Engineer", "DevOps Specialist", "System Administrator"],
    interests: ["Cloud Computing", "Infrastructure", "Automation", "DevOps", "Linux"],
    aptitude: ["problem solving", "analytical thinking", "logical reasoning"],
    workStyles: ["Structured", "Analytical", "Independent"],
    skills: {
      "Cloud Support Engineer": {
        coreSkills: ["Cloud Computing", "AWS", "Linux", "Networking", "Troubleshooting"],
        technicalSkills: ["Docker", "Shell Scripting", "IAM", "VPC", "EC2"],
        recommendedSkills: ["Terraform", "Python", "Kubernetes", "Monitoring"],
      },
      "DevOps Specialist": {
        coreSkills: ["Linux", "Git", "Docker", "CI/CD", "Cloud Computing"],
        technicalSkills: ["Kubernetes", "Terraform", "Jenkins", "Ansible", "Shell Scripting"],
        recommendedSkills: ["Prometheus", "Grafana", "AWS/Azure", "Python"],
      },
      "System Administrator": {
        coreSkills: ["Linux", "Windows Server", "Networking", "Active Directory", "Scripting"],
        technicalSkills: ["System Backups", "Virtualization", "Firewall Admin", "Patch Management"],
        recommendedSkills: ["Cloud Migration", "PowerShell", "Bash", "Security Compliance"],
      },
    },
    roadmaps: {
      "Cloud Support Engineer": [
        { step: 1, title: "Linux Systems & Server Administration", description: "Master Linux CLI, user permissions, systemd services, and networking." },
        { step: 2, title: "Networking & Cloud Infrastructure", description: "Learn IP routing, DNS, load balancing, and cloud architecture." },
        { step: 3, title: "AWS Cloud Fundamentals (EC2, S3, VPC, IAM)", description: "Configure virtual servers, bucket storage, networks, and access security." },
        { step: 4, title: "Containerization with Docker", description: "Build container images, manage multi-container apps with Docker Compose." },
        { step: 5, title: "Infrastructure as Code & CI/CD Pipelines", description: "Automate infrastructure deployment using Terraform and GitHub Actions." },
        { step: 6, title: "Cloud Deployment Project", description: "Deploy a highly available web application on AWS with automated CI/CD." },
        { step: 7, title: "Cloud Architecture Interview Prep", description: "Practice troubleshooting scenarios, AWS certification prep, and mock rounds." },
      ],
      "DevOps Specialist": [
        { step: 1, title: "Linux Systems & Shell Scripting", description: "Master Linux administration, process management, and Bash automation." },
        { step: 2, title: "Version Control & Git Branching Workflows", description: "Manage Git repositories, submodules, and release branching strategies." },
        { step: 3, title: "Containerization (Docker & Microservices)", description: "Write Dockerfiles, manage images, networks, volumes, and multi-stage builds." },
        { step: 4, title: "CI/CD Pipeline Automation (Jenkins / GitHub Actions)", description: "Build automated test, build, and deployment pipelines." },
        { step: 5, title: "Infrastructure as Code & Configuration (Terraform / Ansible)", description: "Provision cloud resources declaratively with Terraform." },
        { step: 6, title: "Container Orchestration with Kubernetes", description: "Deploy pods, services, ingress controllers, and Helm charts." },
        { step: 7, title: "DevOps Placement Preparation & Scenarios", description: "Practice infrastructure troubleshooting, site reliability, and interviews." },
      ],
      "System Administrator": [
        { step: 1, title: "Operating System Administration (Linux & Windows)", description: "Install, configure, and maintain Linux distributions and Windows Server." },
        { step: 2, title: "User Management & Active Directory / LDAP", description: "Configure domain controllers, Group Policies, users, and permissions." },
        { step: 3, title: "Networking Infrastructure & Security", description: "Configure routers, switches, VLANs, firewalls, and VPN connections." },
        { step: 4, title: "Virtualization & Storage Management", description: "Manage VMware/Hyper-V virtual machines, SAN/NAS storage, and snapshots." },
        { step: 5, title: "System Backups & Disaster Recovery", description: "Implement backup routines, disaster recovery plans, and monitoring." },
        { step: 6, title: "SysAdmin Automation Capstone", description: "Automate server health checks and patch management via PowerShell/Bash." },
        { step: 7, title: "SysAdmin Interview & Technical Viva", description: "Prepare hardware, OS, and network troubleshooting scenario rounds." },
      ],
    },
  },

  "Finance & Banking": {
    name: "Finance & Banking",
    roles: ["Financial Analyst", "Investment Banking Associate", "Credit Analyst"],
    interests: ["Finance", "Banking", "Financial Modeling", "Stock Market", "Investment", "Numbers"],
    aptitude: ["numerical reasoning", "analytical thinking", "problem solving"],
    workStyles: ["Analytical", "Structured", "Independent"],
    skills: {
      "Financial Analyst": {
        coreSkills: ["Excel", "Financial Modeling", "Financial Analysis", "Accounting", "Valuation"],
        technicalSkills: ["Financial Statements", "Corporate Finance", "Data Analysis", "Power BI", "SQL"],
        recommendedSkills: ["Python", "DCF Valuation", "Bloomberg Terminal", "CFA Fundamentals"],
      },
      "Investment Banking Associate": {
        coreSkills: ["Financial Modeling", "Valuation", "M&A Analysis", "Pitch Decks", "Corporate Finance"],
        technicalSkills: ["Excel", "LBO Modeling", "Due Diligence", "Financial Reporting"],
        recommendedSkills: ["CFA", "Capital Markets", "PitchBook", "Negotiation"],
      },
      "Credit Analyst": {
        coreSkills: ["Credit Risk Analysis", "Financial Statement Analysis", "Risk Assessment", "Accounting"],
        technicalSkills: ["Excel", "Ratio Analysis", "Credit Rating", "Cash Flow Analysis"],
        recommendedSkills: ["Banking Regulations", "Loans", "Commercial Lending", "Power BI"],
      },
    },
    roadmaps: {
      "Financial Analyst": [
        { step: 1, title: "Accounting & Financial Statement Analysis", description: "Understand Income Statements, Balance Sheets, and Cash Flow Statements." },
        { step: 2, title: "Advanced Financial Excel & Shortcut Mastery", description: "Learn financial formulas, scenario analysis, pivot tables, and dynamic modeling." },
        { step: 3, title: "Corporate Finance & Capital Budgeting", description: "Master NPV, IRR, WACC, working capital management, and cost of capital." },
        { step: 4, title: "Financial Modeling & DCF Valuation", description: "Build 3-statement financial models and Discounted Cash Flow valuations." },
        { step: 5, title: "Financial Data Visualization with Power BI", description: "Build executive financial dashboards and key metric reports." },
        { step: 6, title: "Equity Research / Financial Analysis Project", description: "Perform complete financial evaluation and valuation report of a public company." },
        { step: 7, title: "Finance Placement Interview Prep", description: "Practice financial ratios, valuation case studies, and corporate finance rounds." },
      ],
      "Investment Banking Associate": [
        { step: 1, title: "Accounting & Financial Statement Deconstruction", description: "Master complex financial statements, foot-notes, and GAAP/IFRS rules." },
        { step: 2, title: "Corporate Valuation Methodologies", description: "Learn Comparable Companies Analysis, Precedent Transactions, and DCF." },
        { step: 3, title: "Advanced Financial Modeling (3-Statement & LBO)", description: "Build integrated 3-statement financial models and Leveraged Buyout models." },
        { step: 4, title: "Mergers & Acquisitions (M&A) Structuring", description: "Understand accretion/dilution analysis, synergies, and deal structures." },
        { step: 5, title: "Pitch Book Preparation & Due Diligence", description: "Draft investment pitch decks, confidential information memorandums (CIM)." },
        { step: 6, title: "M&A Transaction Valuation Project", description: "Execute full M&A valuation case study for a target acquisition." },
        { step: 7, title: "Investment Banking Placement Prep", description: "Master accounting technicals, valuation questions, and IB case rounds." },
      ],
      "Credit Analyst": [
        { step: 1, title: "Credit Fundamentals & Financial Statement Ratios", description: "Calculate liquidity, solvency, leverage, and profitability ratios." },
        { step: 2, title: "Cash Flow Analysis & Debt Service Coverage", description: "Evaluate DSCR, interest coverage ratios, and free cash flows." },
        { step: 3, title: "Credit Risk Assessment & Rating Models", description: "Understand credit scoring, probability of default (PD), and loss given default." },
        { step: 4, title: "Commercial Lending & Loan Structuring", description: "Study collateral valuation, covenants, working capital loans, and term loans." },
        { step: 5, title: "Banking Regulations & Compliance (RBI/Basel)", description: "Understand Basel III framework, NPA classification, and provisioning." },
        { step: 6, title: "Corporate Credit Appraisal Project", description: "Prepare complete Credit Appraisal Memo (CAM) for corporate borrower." },
        { step: 7, title: "Credit Analyst Placement Interview Prep", description: "Practice ratio analysis tests, loan appraisal cases, and banking viva." },
      ],
    },
  },

  "Accounting": {
    name: "Accounting",
    roles: ["Jr Accountant", "Chartered Accountant Trainee", "Audit Associate"],
    interests: ["Accounting", "Taxation", "Bookkeeping", "Audit", "Financial Compliance", "Numbers"],
    aptitude: ["numerical reasoning", "analytical thinking", "organization/planning"],
    workStyles: ["Structured", "Analytical", "Independent"],
    skills: {
      "Jr Accountant": {
        coreSkills: ["Accounting", "Excel", "Tally", "GST", "Bookkeeping"],
        technicalSkills: ["Accounts Payable", "Accounts Receivable", "Financial Statements", "Taxation", "Bank Reconciliation"],
        recommendedSkills: ["MIS Reporting", "ERP Systems", "Payroll Processing", "Audit Prep"],
      },
      "Chartered Accountant Trainee": {
        coreSkills: ["Accounting Standards", "Taxation (Direct & Indirect)", "Auditing", "Financial Reporting", "Tally"],
        technicalSkills: ["GST Filing", "Income Tax Filing", "Company Law", "Excel", "Cost Accounting"],
        recommendedSkills: ["SAP / ERP", "Internal Audit", "IFRS", "Transfer Pricing"],
      },
      "Audit Associate": {
        coreSkills: ["Internal Audit", "Financial Statements", "Internal Controls", "Compliance", "Excel"],
        technicalSkills: ["Sampling Techniques", "Audit Documentation", "Risk Assessment", "Statutory Audit"],
        recommendedSkills: ["CA Inter", "Tally", "SAP", "Tax Laws"],
      },
    },
    roadmaps: {
      "Jr Accountant": [
        { step: 1, title: "Accounting Principles & Journal Entries", description: "Master double-entry bookkeeping, debit/credit rules, and trial balance." },
        { step: 2, title: "Tally Prime & Accounting Software Mastery", description: "Practice voucher entry, inventory management, and GST invoicing in Tally." },
        { step: 3, title: "GST & Indirect Taxation Compliance", description: "Learn GST calculation, GSTR filing procedures, and input tax credit rules." },
        { step: 4, title: "Direct Tax & TDS Processing", description: "Understand Income Tax provisions, TDS deduction rules, and e-filing." },
        { step: 5, title: "Financial Statement Preparation & Bank Reconciliation", description: "Prepare Profit & Loss accounts, balance sheets, and bank reconciliations." },
        { step: 6, title: "Accounting Simulation Project", description: "Manage full monthly accounting cycle for a simulated business enterprise." },
        { step: 7, title: "Accounting & Tax Interview Prep", description: "Practice practical accounting questions, tax scenarios, and interview rounds." },
      ],
      "Chartered Accountant Trainee": [
        { step: 1, title: "Advanced Accounting Standards (Ind AS / AS)", description: "Master revenue recognition, leases, financial instruments, and inventory standards." },
        { step: 2, title: "Direct Tax Computation & E-filing", description: "Compute corporate tax, MAT, capital gains, and file ITR returns." },
        { step: 3, title: "GST Audit, E-way Bills & Returns", description: "Prepare GSTR-1, GSTR-3B, GSTR-9 annual returns, and reconciliation." },
        { step: 4, title: "Statutory & Internal Audit Procedures", description: "Design audit programs, test internal financial controls (IFC), and sampling." },
        { step: 5, title: "Corporate Law & Secretarial Standards", description: "Understand Companies Act 2013 provisions, board meetings, and ROC returns." },
        { step: 6, title: "Articleship Audit Simulation Project", description: "Execute statutory audit file for a private limited manufacturing firm." },
        { step: 7, title: "CA Trainee Technical Interview Prep", description: "Prepare tax case laws, accounting standards, audit procedures, and viva." },
      ],
      "Audit Associate": [
        { step: 1, title: "Auditing Standards & Code of Ethics", description: "Understand Standards on Auditing (SAs), independence, and documentation." },
        { step: 2, title: "Internal Financial Controls (IFC) Testing", description: "Map process workflows, evaluate control design, and perform walkthroughs." },
        { step: 3, title: "Substantive Audit Testing & Analytics", description: "Perform analytical procedures, bank confirmation, and inventory verification." },
        { step: 4, title: "Financial Statement Vouching & Verification", description: "Audit revenue, expenses, fixed assets, and trade payables/receivables." },
        { step: 5, title: "Audit Report Drafting & CARO Compliance", description: "Draft audit observations, CARO reporting points, and management letters." },
        { step: 6, title: "Comprehensive Audit Case Study Project", description: "Complete end-to-end statutory audit working papers for a client." },
        { step: 7, title: "Audit Associate Interview Preparation", description: "Practice audit scenario tests, SA standards, and firm interview rounds." },
      ],
    },
  },

  "Marketing & Digital Marketing": {
    name: "Marketing & Digital Marketing",
    roles: ["Digital Marketing Executive", "SEO Specialist", "Social Media Manager", "Marketing Analyst"],
    interests: ["Marketing", "Digital Marketing", "Social Media", "Branding", "Content Strategy", "Advertising"],
    aptitude: ["creativity", "verbal reasoning", "analytical thinking"],
    workStyles: ["Creative", "Collaborative", "People-oriented"],
    skills: {
      "Digital Marketing Executive": {
        coreSkills: ["Digital Marketing", "SEO", "Social Media Marketing", "Content Marketing", "Google Analytics"],
        technicalSkills: ["Google Ads", "Meta Ads", "Email Marketing", "Canva", "Copywriting"],
        recommendedSkills: ["Marketing Automation", "WordPress", "A/B Testing", "Conversion Optimization"],
      },
      "SEO Specialist": {
        coreSkills: ["SEO", "Keyword Research", "On-Page SEO", "Off-Page SEO", "Google Analytics"],
        technicalSkills: ["Technical SEO", "SEMrush / Ahrefs", "Google Search Console", "Link Building", "Content Strategy"],
        recommendedSkills: ["HTML/CSS Basics", "Site Audit", "Local SEO", "Copywriting"],
      },
      "Social Media Manager": {
        coreSkills: ["Social Media Marketing", "Content Strategy", "Copywriting", "Community Management", "Branding"],
        technicalSkills: ["Canva", "Meta Business Suite", "Analytics", "Video Editing", "Campaign Strategy"],
        recommendedSkills: ["Influencer Marketing", "Paid Ads", "TikTok/Reels Strategy", "PR"],
      },
      "Marketing Analyst": {
        coreSkills: ["Marketing Analytics", "Google Analytics", "Excel", "Data Analysis", "ROI Tracking"],
        technicalSkills: ["Power BI", "SQL", "Conversion Rates", "Customer Segmentation", "A/B Testing"],
        recommendedSkills: ["Python", "Campaign Performance", "Market Research", "Reporting"],
      },
    },
    roadmaps: {
      "Digital Marketing Executive": [
        { step: 1, title: "Marketing Fundamentals & Buyer Personas", description: "Understand target audience segmentation, positioning, and marketing funnels." },
        { step: 2, title: "Search Engine Optimization (SEO)", description: "Master keyword research, on-page optimization, backlink building, and technical SEO." },
        { step: 3, title: "Social Media Marketing & Brand Building", description: "Develop organic content strategies for LinkedIn, Instagram, Facebook, and YouTube." },
        { step: 4, title: "Paid Advertising (Google Ads & Meta Ads)", description: "Create PPC search campaigns, display ads, retargeting, and budget management." },
        { step: 5, title: "Web Analytics & Data Interpretation", description: "Use Google Analytics 4 to track conversions, bounce rates, and traffic sources." },
        { step: 6, title: "Live Digital Marketing Campaign Project", description: "Plan, execute, and analyze an end-to-end multi-channel marketing campaign." },
        { step: 7, title: "Digital Marketing Portfolio & Interview Prep", description: "Compile campaign metrics portfolio, case studies, and interview answers." },
      ],
      "SEO Specialist": [
        { step: 1, title: "Search Engine Mechanics & Keyword Research", description: "Understand Google crawlers, indexing, and keyword intent using SEMrush/Ahrefs." },
        { step: 2, title: "On-Page SEO Optimization", description: "Optimize title tags, meta descriptions, header structures, and internal linking." },
        { step: 3, title: "Technical SEO Auditing", description: "Fix site speed, Core Web Vitals, XML sitemaps, robots.txt, and schema markup." },
        { step: 4, title: "Off-Page SEO & Authority Link Building", description: "Execute guest posting, broken link building, and digital PR strategies." },
        { step: 5, title: "Google Analytics 4 & Search Console Analytics", description: "Monitor organic impressions, click-through rates (CTR), and keyword rankings." },
        { step: 6, title: "Live Website SEO Audit Project", description: "Perform complete technical and content SEO audit for a live domain." },
        { step: 7, title: "SEO Specialist Placement Interview Prep", description: "Prepare technical SEO questions, algorithm update knowledge, and portfolio." },
      ],
      "Social Media Manager": [
        { step: 1, title: "Social Media Platform Algorithms", description: "Understand algorithm triggers for Instagram, LinkedIn, YouTube, and X." },
        { step: 2, title: "Content Pillars & Calendar Strategy", description: "Design monthly content calendars, post schedules, and creative briefs." },
        { step: 3, title: "Visual Content & Short-Form Video Production", description: "Create Reels/Shorts and graphics using Canva, CapCut, and Premiere Pro." },
        { step: 4, title: "Copywriting & Community Engagement", description: "Draft compelling captions, hooks, calls to action, and manage comments." },
        { step: 5, title: "Meta Business Suite & Social Analytics", description: "Analyze engagement rates, reach, demographic insights, and follower growth." },
        { step: 6, title: "Brand Social Growth Project", description: "Execute 30-day social media campaign and measure engagement metrics." },
        { step: 7, title: "Social Media Portfolio & Interview Prep", description: "Compile visual portfolio, campaign case studies, and agency interview rounds." },
      ],
      "Marketing Analyst": [
        { step: 1, title: "Marketing Data Sources & Key Metrics", description: "Understand CAC, LTV, ROAS, conversion rate, bounce rate, and churn." },
        { step: 2, title: "Advanced Excel & Marketing Math", description: "Build cohort analysis models, attribution models, and ROI templates." },
        { step: 3, title: "Google Analytics 4 & Tag Manager", description: "Configure custom event tracking, conversion funnels, and UTM parameters." },
        { step: 4, title: "SQL for Customer & Campaign Segmentation", description: "Query database tables to segment users by purchase frequency and channel." },
        { step: 5, title: "Data Visualization & Marketing Dashboards", description: "Build live marketing performance dashboards in Power BI or Looker Studio." },
        { step: 6, title: "Campaign ROI Analysis Project", description: "Analyze multi-channel ad spend dataset and recommend budget optimization." },
        { step: 7, title: "Marketing Analyst Interview Prep", description: "Practice marketing math tests, SQL case studies, and interview rounds." },
      ],
    },
  },

  "Human Resources": {
    name: "Human Resources",
    roles: ["HR Executive", "Talent Acquisition Specialist", "HR Analyst", "Recruiter"],
    interests: ["Human Resources", "Recruitment", "People Management", "Communication", "Employee Engagement"],
    aptitude: ["verbal reasoning", "people/social interaction", "organization/planning"],
    workStyles: ["People-oriented", "Collaborative", "Structured"],
    skills: {
      "HR Executive": {
        coreSkills: ["Human Resources", "Recruitment", "Employee Relations", "Communication", "HR Operations"],
        technicalSkills: ["MS Office", "Payroll Basics", "Onboarding", "HR Policies", "Labor Laws"],
        recommendedSkills: ["HRIS", "Performance Management", "Talent Management", "Conflict Resolution"],
      },
      "Talent Acquisition Specialist": {
        coreSkills: ["Talent Acquisition", "Recruitment", "Sourcing", "Interviewing", "Candidate Screening"],
        technicalSkills: ["LinkedIn Recruiter", "ATS Systems", "Job Portals", "Negotiation", "Headhunting"],
        recommendedSkills: ["Employer Branding", "Campus Recruitment", "Salary Benchmarking"],
      },
      "HR Analyst": {
        coreSkills: ["HR Analytics", "Excel", "Data Analysis", "HR Metrics", "Reporting"],
        technicalSkills: ["Power BI", "SQL", "Attrition Analysis", "Employee Surveys", "HRIS Data"],
        recommendedSkills: ["Workforce Planning", "Python", "Dashboard Design", "Predictive Analytics"],
      },
      "Recruiter": {
        coreSkills: ["Recruitment", "Candidate Sourcing", "Screening", "Communication", "Job Posting"],
        technicalSkills: ["ATS Platforms", "LinkedIn Sourcing", "Interview Scheduling", "Offer Negotiation"],
        recommendedSkills: ["Campus Hiring", "Talent Pipeline", "Employer Branding", "Talent Mapping"],
      },
    },
    roadmaps: {
      "HR Executive": [
        { step: 1, title: "HR Management Principles & Organizational Culture", description: "Learn the core functions of HR, organization structure, and ethics." },
        { step: 2, title: "End-to-End Recruitment & Talent Sourcing", description: "Practice job description writing, resume screening, and interview scheduling." },
        { step: 3, title: "Employee Onboarding & Lifecycle Management", description: "Master induction programs, documentation, probation reviews, and exit interviews." },
        { step: 4, title: "Indian Labor Laws & HR Compliance", description: "Study Factories Act, PF/ESIC provisions, Shops & Establishments, and POSH guidelines." },
        { step: 5, title: "HR Operations, Payroll & Performance Appraisal", description: "Understand attendance tracking, salary structures, leave management, and KPI reviews." },
        { step: 6, title: "HR Policy & Process Design Project", description: "Draft comprehensive HR policy manual and recruitment workflow." },
        { step: 7, title: "HR Placement Preparation & Behavioral Rounds", description: "Practice situational HR questions, behavioral scenarios, and interview rounds." },
      ],
      "Talent Acquisition Specialist": [
        { step: 1, title: "Talent Acquisition Strategy & Workforce Planning", description: "Understand hiring requisitions, talent mapping, and recruitment SLAs." },
        { step: 2, title: "Advanced Candidate Sourcing (LinkedIn Recruiter & Boolean)", description: "Master Boolean search queries, headhunting, and passive candidate outreach." },
        { step: 3, title: "Applicant Tracking Systems (ATS) Management", description: "Manage candidate pipelines, screening rubrics, and candidate status." },
        { step: 4, title: "Behavioral & Competency-Based Interviewing", description: "Conduct STAR method interviews and evaluate technical/culture fit." },
        { step: 5, title: "Salary Negotiation & Offer Management", description: "Benchmark compensation, pitch offers, and manage candidate notice periods." },
        { step: 6, title: "Campus Recruitment Drive Project", description: "Plan and simulate end-to-end campus hiring drive for 50 open positions." },
        { step: 7, title: "Talent Acquisition Placement Prep", description: "Practice sourcing case studies, offer negotiation roleplay, and interview rounds." },
      ],
      "HR Analyst": [
        { step: 1, title: "HR Metrics & Data Fundamentals", description: "Understand attrition rate, cost per hire, time to fill, and turnover metrics." },
        { step: 2, title: "Advanced Excel for HR Analytics", description: "Build employee turnover models, headcount trackers, and salary bands." },
        { step: 3, title: "HRIS Data Extraction & SQL", description: "Query employee databases to analyze tenure, performance, and department trends." },
        { step: 4, title: "Employee Engagement & Survey Analytics", description: "Analyze eNPS scores, sentiment analysis, and pulse survey results." },
        { step: 5, title: "HR Dashboard Development (Power BI)", description: "Construct interactive workforce analytics dashboards for executive HR teams." },
        { step: 6, title: "Attrition Risk Prediction Project", description: "Perform statistical analysis to identify key drivers of employee turnover." },
        { step: 7, title: "HR Analyst Interview & Case Study Prep", description: "Practice HR math tests, SQL queries, and HR dashboard presentation." },
      ],
      "Recruiter": [
        { step: 1, title: "Recruitment Lifecycle & Job Descriptions", description: "Translate hiring manager requirements into clear job notifications." },
        { step: 2, title: "Multi-Channel Candidate Sourcing", description: "Source candidates via job portals, referrals, social media, and campus." },
        { step: 3, title: "Resume Screening & Initial Telephonic Vetting", description: "Filter applications against mandatory skill matrix and communication skills." },
        { step: 4, title: "Interview Coordination & Logistics", description: "Schedule panel interview rounds, technical tests, and feedback collection." },
        { step: 5, title: "Offer Rollout & Candidate Engagement", description: "Issue offer letters, collect pre-onboarding documents, and reduce dropouts." },
        { step: 6, title: "End-to-End Recruitment Project", description: "Manage full recruiting funnel for 5 technical and non-technical roles." },
        { step: 7, title: "Recruiter Placement Interview Prep", description: "Prepare sourcing scenarios, screening roleplays, and corporate HR rounds." },
      ],
    },
  },

  "Business / Management": {
    name: "Business / Management",
    roles: ["Business Analyst", "Management Trainee", "Operations Associate"],
    interests: ["Business", "Management", "Strategy", "Process Optimization", "Leadership"],
    aptitude: ["analytical thinking", "logical reasoning", "problem solving"],
    workStyles: ["Leadership", "Collaborative", "Structured"],
    skills: {
      "Business Analyst": {
        coreSkills: ["Business Analysis", "Requirements Gathering", "Process Mapping", "Excel", "Communication"],
        technicalSkills: ["SQL", "Power BI", "Agile/Scrum", "Jira", "UML Diagrams"],
        recommendedSkills: ["Tableau", "Data Analytics", "Product Management", "Documentation"],
      },
      "Management Trainee": {
        coreSkills: ["Business Operations", "Problem Solving", "Project Management", "Leadership", "Excel"],
        technicalSkills: ["Data Analysis", "Presentation", "Process Optimization", "Market Research"],
        recommendedSkills: ["Agile", "Financial Basics", "Cross-functional Coordination"],
      },
      "Operations Associate": {
        coreSkills: ["Process Optimization", "Operations Management", "Excel", "Workflow Design", "Problem Solving"],
        technicalSkills: ["SLA Tracking", "MIS Reporting", "ERP Systems", "Resource Allocation", "Quality Assurance"],
        recommendedSkills: ["Data Analytics", "Lean Principles", "Vendor Coordination"],
      },
    },
    roadmaps: {
      "Business Analyst": [
        { step: 1, title: "Business Analysis Fundamentals & Requirements Elicitation", description: "Learn BRD/FRD documentation, stakeholder interviews, and scoping." },
        { step: 2, title: "Process Modeling & Diagramming (BPMN, UML)", description: "Create flowcharts, wireframes, use case diagrams, and user stories." },
        { step: 3, title: "Agile & Scrum Framework Mastery", description: "Understand sprint planning, backlog grooming, Jira management, and daily standups." },
        { step: 4, title: "Data Analysis with Excel & SQL", description: "Extract database insights using SQL queries and build analytical Excel models." },
        { step: 5, title: "Business Intelligence & Visualization", description: "Design business decision dashboards using Power BI or Tableau." },
        { step: 6, title: "End-to-End Business Analysis Case Study", description: "Perform complete product requirement document (PRD) and process gap analysis." },
        { step: 7, title: "BA Interview Preparation & Case Rounds", description: "Practice case study interviews, guesstimates, and requirement scenarios." },
      ],
      "Management Trainee": [
        { step: 1, title: "Corporate Strategy & Business Model Canvas", description: "Understand corporate structures, revenue models, and strategic planning." },
        { step: 2, title: "Cross-Functional Operations & Supply Chain", description: "Study business operations, procurement, sales funnels, and customer success." },
        { step: 3, title: "Financial Literacy for Managers", description: "Understand P&L statements, budgeting, ROI calculations, and cost control." },
        { step: 4, title: "Data-Driven Decision Making & Excel Analytics", description: "Build executive summary dashboards and business case models." },
        { step: 5, title: "Project Management Fundamentals (Agile/PMP)", description: "Master project charter creation, risk management, and stakeholder comms." },
        { step: 6, title: "Rotational Management Problem Project", description: "Solve cross-departmental operational bottleneck for a retail enterprise." },
        { step: 7, title: "Management Trainee Placement Interview Prep", description: "Practice group discussions (GD), case study presentations, and leadership Q&A." },
      ],
      "Operations Associate": [
        { step: 1, title: "Operational Workflows & SLA Management", description: "Understand service level agreements, turnaround time (TAT), and KPIs." },
        { step: 2, title: "Process Mapping & Standard Operating Procedures (SOP)", description: "Draft clear step-by-step SOP documents for daily business operations." },
        { step: 3, title: "Excel Operations Reporting & Tracking", description: "Build daily log sheets, automated tracker templates, and pivot reports." },
        { step: 4, title: "Root Cause Analysis & Quality Control", description: "Use 5 Whys, Fishbone diagrams, and Pareto analysis to fix operational errors." },
        { step: 5, title: "ERP & Management Software Systems", description: "Manage tickets, inventory records, and tasks in ERP software." },
        { step: 6, title: "Operational Efficiency Improvement Project", description: "Redesign business processing workflow to reduce execution time by 20%." },
        { step: 7, title: "Operations Placement Interview Prep", description: "Prepare operational scenario questions, efficiency math, and viva." },
      ],
    },
  },

  "UI/UX & Graphic Design": {
    name: "UI/UX & Graphic Design",
    roles: ["UI/UX Designer", "Graphic Designer", "Product Designer"],
    interests: ["UI/UX", "Design", "Creativity", "Visual Arts", "User Experience", "Prototyping"],
    aptitude: ["creativity", "visual reasoning", "problem solving"],
    workStyles: ["Creative", "User-focused", "Independent"],
    skills: {
      "UI/UX Designer": {
        coreSkills: ["Figma", "UI/UX", "Wireframing", "Prototyping", "User Research"],
        technicalSkills: ["Design Systems", "User Testing", "Visual Design", "Information Architecture", "Interaction Design"],
        recommendedSkills: ["Adobe XD", "HTML/CSS Basics", "Micro-interactions", "Usability Audit"],
      },
      "Graphic Designer": {
        coreSkills: ["Photoshop", "Illustrator", "Canva", "Graphic Design", "Typography"],
        technicalSkills: ["Branding", "Layout Design", "InDesign", "Color Theory", "Vector Art"],
        recommendedSkills: ["Figma", "Motion Graphics", "Video Editing", "Social Media Graphics"],
      },
      "Product Designer": {
        coreSkills: ["Figma", "Product Design", "Design Systems", "User Research", "Prototyping"],
        technicalSkills: ["User Journey Mapping", "Information Architecture", "Usability Testing", "UI Design", "Agile Design"],
        recommendedSkills: ["Front-end Basics", "Micro-interactions", "Design Analytics", "Product Strategy"],
      },
    },
    roadmaps: {
      "UI/UX Designer": [
        { step: 1, title: "UX Fundamentals & Design Thinking", description: "Learn double diamond process, user empathy, personas, and problem definition." },
        { step: 2, title: "User Research & Information Architecture", description: "Conduct user interviews, journey mapping, card sorting, and sitemaps." },
        { step: 3, title: "Wireframing & Low-Fidelity Layouts", description: "Sketch low-fi wireframes and structure screen layouts in Figma." },
        { step: 4, title: "Figma Mastery & Design Systems", description: "Master auto-layout, components, variants, typography, and color tokens." },
        { step: 5, title: "High-Fidelity Prototyping & Micro-interactions", description: "Build interactive prototypes, transition animations, and user testing flows." },
        { step: 6, title: "Complete Mobile / Web UX Case Study", description: "Solve a practical UX problem end-to-end and document in Behance / Portfolio." },
        { step: 7, title: "Portfolio Presentation & Design Interview", description: "Refine online portfolio, prepare design critique responses, and take-home challenges." },
      ],
      "Graphic Designer": [
        { step: 1, title: "Design Principles, Color Theory & Typography", description: "Understand visual hierarchy, grid systems, typography, and color harmony." },
        { step: 2, title: "Vector Graphic Design (Adobe Illustrator)", description: "Create logo marks, vector illustrations, icons, and brand assets." },
        { step: 3, title: "Image Editing & Composition (Adobe Photoshop)", description: "Master photo manipulation, background removal, retouching, and banners." },
        { step: 4, title: "Brand Identity Design & Style Guides", description: "Develop brand guidelines, business stationery, and marketing collateral." },
        { step: 5, title: "Layout & Print / Digital Publishing (InDesign/Canva)", description: "Design multi-page brochures, social media graphics, and pitch decks." },
        { step: 6, title: "Comprehensive Brand Identity Project", description: "Create complete rebrand identity package for a commercial business." },
        { step: 7, title: "Graphic Design Portfolio & Agency Interview", description: "Assemble Behance/PDF portfolio and prepare design presentation rounds." },
      ],
      "Product Designer": [
        { step: 1, title: "Product Thinking & Problem Definition", description: "Align design decisions with business goals, metrics, and user needs." },
        { step: 2, title: "User Research & Quantitative Data Insights", description: "Combine qualitative user feedback with analytics data to spot friction." },
        { step: 3, title: "Scalable Design Systems & Component Libraries", description: "Build design tokens, responsive layouts, and accessible UI patterns." },
        { step: 4, title: "Cross-Functional Collaboration with Developers", description: "Handoff Figma designs with specs, asset export, and design QA." },
        { step: 5, title: "Rapid Prototyping & Usability Testing", description: "Test interactive prototypes with real users and iterate based on results." },
        { step: 6, title: "End-to-End Digital Product Design Case Study", description: "Design a complex SaaS or Fintech product feature from concept to handoff." },
        { step: 7, title: "Product Designer Placement Portfolio & Interview", description: "Present product case study story, design decisions, and trade-offs." },
      ],
    },
  },

  "Healthcare": {
    name: "Healthcare",
    roles: ["Healthcare Administrator", "Medical Operations Specialist"],
    interests: ["Healthcare", "Hospital Management", "Patient Care", "Medical Administration"],
    aptitude: ["organization/planning", "people/social interaction", "problem solving"],
    workStyles: ["People-oriented", "Structured", "Collaborative"],
    skills: {
      "Healthcare Administrator": {
        coreSkills: ["Healthcare Management", "Hospital Operations", "Patient Services", "Compliance", "Communication"],
        technicalSkills: ["Medical Records", "Health Information Systems", "Billing & Insurance", "Quality Assurance"],
        recommendedSkills: ["NABH Standards", "Public Health", "Excel", "Resource Allocation"],
      },
      "Medical Operations Specialist": {
        coreSkills: ["Medical Operations", "Clinical Workflow", "Hospital Logistics", "Patient Flow", "NABH Standards"],
        technicalSkills: ["EHR Software", "Inventory Management", "Medical Compliance", "Staff Scheduling"],
        recommendedSkills: ["Public Health", "Emergency Management", "Quality Auditing", "Healthcare IT"],
      },
    },
    roadmaps: {
      "Healthcare Administrator": [
        { step: 1, title: "Healthcare Systems & Hospital Architecture", description: "Understand hospital organization, clinical vs non-clinical operations." },
        { step: 2, title: "Patient Flow & Front-Office Management", description: "Learn OPD/IPD procedures, admission workflows, and patient experience." },
        { step: 3, title: "Healthcare Information Systems & Medical Records", description: "Manage Electronic Health Records (EHR) and hospital software." },
        { step: 4, title: "NABH Compliance & Quality Standards", description: "Study hospital accreditation guidelines, patient safety, and infection control." },
        { step: 5, title: "Hospital Billing & Insurance TPA Management", description: "Learn medical coding basics, insurance claim processing, and billing audit." },
        { step: 6, title: "Hospital Operations Improvement Project", description: "Analyze and reduce wait time in hospital outpatient department." },
        { step: 7, title: "Healthcare Management Interview Prep", description: "Practice hospital case scenarios, operational ethics, and interview rounds." },
      ],
      "Medical Operations Specialist": [
        { step: 1, title: "Clinical Workflow & Department Coordination", description: "Map operations between ICU, OT, Radiology, Pathology, and Pharmacy." },
        { step: 2, title: "Medical Supply Chain & Equipment Maintenance", description: "Manage medical inventory, surgical supplies, and biomedical equipment SLAs." },
        { step: 3, title: "Electronic Health Records (EHR) & Data Governance", description: "Ensure accuracy and security of medical records and patient data." },
        { step: 4, title: "NABH Quality Protocols & Infection Control", description: "Implement infection control protocols, bio-medical waste management." },
        { step: 5, title: "Emergency & Disaster Response Operations", description: "Organize triage protocols and hospital emergency response workflows." },
        { step: 6, title: "Hospital Emergency Workflow Capstone", description: "Redesign emergency room admission workflow to reduce critical delays." },
        { step: 7, title: "Medical Operations Interview Preparation", description: "Prepare clinical scenario viva, hospital accreditation Q&A, and interview." },
      ],
    },
  },

  "Education / Teaching": {
    name: "Education / Teaching",
    roles: ["Academic Associate", "Corporate Trainer", "Education Content Specialist"],
    interests: ["Education", "Teaching", "Mentorship", "Curriculum Design", "Public Speaking"],
    aptitude: ["verbal reasoning", "teaching/learning", "communication"],
    workStyles: ["People-oriented", "Collaborative", "Structured"],
    skills: {
      "Academic Associate": {
        coreSkills: ["Teaching", "Communication", "Subject Matter Expertise", "Curriculum Design", "Presentation"],
        technicalSkills: ["LMS Platforms", "MS PowerPoint", "Content Writing", "Student Assessment", "E-learning"],
        recommendedSkills: ["Educational Psychology", "Video Recording", "EdTech Tools"],
      },
      "Corporate Trainer": {
        coreSkills: ["Training & Development", "Public Speaking", "Instructional Design", "Communication", "Workshop Facilitation"],
        technicalSkills: ["Presentation Software", "Training Needs Analysis", "Employee Assessment", "LMS"],
        recommendedSkills: ["Leadership Coaching", "Soft Skills Training", "Gamification"],
      },
      "Education Content Specialist": {
        coreSkills: ["Curriculum Design", "Educational Writing", "Pedagogy", "Subject Matter Expertise", "Editing"],
        technicalSkills: ["LMS Platforms", "Instructional Authoring Tools", "Assessment Creation", "Canva"],
        recommendedSkills: ["EdTech Analytics", "Video Scriptwriting", "UX for Learning"],
      },
    },
    roadmaps: {
      "Academic Associate": [
        { step: 1, title: "Pedagogy & Instructional Design Basics", description: "Learn Bloom's taxonomy, learning objectives, and lesson planning." },
        { step: 2, title: "Digital EdTech Tools & LMS Administration", description: "Master Canvas/Moodle, Google Classroom, and interactive quiz tools." },
        { step: 3, title: "Content Creation & Presentation Mastery", description: "Design engaging slide decks, infographics, and lecture materials." },
        { step: 4, title: "Student Engagement & Classroom Management", description: "Practice active learning techniques, facilitation, and Q&A handling." },
        { step: 5, title: "Assessment Design & Grading Metrics", description: "Create rubrics, formative/summative tests, and constructive feedback." },
        { step: 6, title: "Sample Teaching Demonstration & Course Module", description: "Record a 20-minute micro-teaching lesson and complete course outline." },
        { step: 7, title: "Academic Interview & Teaching Demo Prep", description: "Prepare demo lecture, subject viva, and educational philosophy." },
      ],
      "Corporate Trainer": [
        { step: 1, title: "Training Needs Analysis (TNA) & Adult Learning", description: "Understand ANDRAGOGY principles, skill gaps, and training metrics." },
        { step: 2, title: "Workshop Design & Interactive Modules", description: "Structure icebreakers, roleplay activities, and case study modules." },
        { step: 3, title: "Public Speaking & Facilitation Mastery", description: "Master voice modulation, body language, audience management, and Q&A." },
        { step: 4, title: "Digital Learning & LMS Platform Integration", description: "Deliver virtual instructor-led training (VILT) via Zoom/Teams." },
        { step: 5, title: "Training Effectiveness Evaluation (Kirkpatrick Model)", description: "Measure reaction, learning, behavior change, and ROI." },
        { step: 6, title: "Corporate Soft Skills Workshop Project", description: "Deliver 1-hour live mock corporate training workshop to evaluators." },
        { step: 7, title: "Corporate Trainer Placement Interview Prep", description: "Prepare live demo facilitation, training portfolio, and interview rounds." },
      ],
      "Education Content Specialist": [
        { step: 1, title: "Instructional Design Models (ADDIE / SAM)", description: "Learn ADDIE phases: Analysis, Design, Development, Implementation, Evaluation." },
        { step: 2, title: "Curriculum Mapping & Learning Outcomes", description: "Break complex subjects into micro-learning modules and clear outcomes." },
        { step: 3, title: "Educational Scriptwriting & Content Authoring", description: "Write video scripts, reading modules, and interactive workbooks." },
        { step: 4, title: "Assessment & Quiz Item Engineering", description: "Draft multiple-choice, scenario, and project-based rubrics." },
        { step: 5, title: "EdTech Authoring Tools & Visual Storytelling", description: "Use Articulate 360, Canva, and LMS formatting standards." },
        { step: 6, title: "Complete EdTech Course Module Project", description: "Publish 4-week digital course curriculum package with videos & quizzes." },
        { step: 7, title: "EdTech Content Specialist Interview Prep", description: "Prepare portfolio pitch, writing sample test, and agency rounds." },
      ],
    },
  },

  "Operations": {
    name: "Operations",
    roles: ["Operations Executive", "Supply Chain Analyst", "Logistics Specialist"],
    interests: ["Operations", "Supply Chain", "Logistics", "Process Improvement", "Vendor Management"],
    aptitude: ["organization/planning", "analytical thinking", "problem solving"],
    workStyles: ["Structured", "Analytical", "Collaborative"],
    skills: {
      "Operations Executive": {
        coreSkills: ["Operations Management", "Process Optimization", "Excel", "Vendor Management", "Problem Solving"],
        technicalSkills: ["Supply Chain Basics", "ERP Systems", "Inventory Management", "MIS Reporting"],
        recommendedSkills: ["Six Sigma", "Logistics", "Procurement", "Data Analysis"],
      },
      "Supply Chain Analyst": {
        coreSkills: ["Supply Chain Management", "Excel", "SQL", "Demand Forecasting", "Inventory Control"],
        technicalSkills: ["ERP (SAP/Oracle)", "Data Analytics", "Logistics Optimization", "Vendor SLAs"],
        recommendedSkills: ["Power BI", "Python", "Procurement", "Six Sigma"],
      },
      "Logistics Specialist": {
        coreSkills: ["Logistics Management", "Freight & Transport", "Warehouse Operations", "Inventory Tracking"],
        technicalSkills: ["WMS Software", "Dispatch Planning", "Customs Compliance", "Excel"],
        recommendedSkills: ["Supply Chain Basics", "Route Optimization", "Vendor Negotiation"],
      },
    },
    roadmaps: {
      "Operations Executive": [
        { step: 1, title: "Operations Fundamentals & Process Mapping", description: "Understand workflow design, bottleneck identification, and operational metrics." },
        { step: 2, title: "Inventory & Warehouse Management", description: "Learn FIFO/LIFO, ABC analysis, stock auditing, and reorder levels." },
        { step: 3, title: "Supply Chain & Vendor Procurement", description: "Master vendor selection, SLA tracking, purchase order flows, and negotiation." },
        { step: 4, title: "Excel Analytics for Operations", description: "Build automated tracking dashboards, pivot models, and forecasting sheets." },
        { step: 5, title: "Lean Principles & Quality Management", description: "Understand 5S, Kanban, Kaizen, and waste reduction methodology." },
        { step: 6, title: "Operations Bottleneck Case Study", description: "Analyze real delivery delay issue and propose optimized operational model." },
        { step: 7, title: "Operations Placement Interview Prep", description: "Practice operational problem-solving scenarios and interview questions." },
      ],
      "Supply Chain Analyst": [
        { step: 1, title: "Supply Chain End-to-End Architecture", description: "Understand plan, source, make, deliver, and return cycles (SCOR model)." },
        { step: 2, title: "Demand Forecasting & Mathematical Inventory Models", description: "Calculate safety stock, economic order quantity (EOQ), and moving averages." },
        { step: 3, title: "Data Analytics with Excel & SQL", description: "Extract supplier performance data and calculate order fulfillment rates." },
        { step: 4, title: "ERP Systems (SAP S/4HANA / Oracle SCM)", description: "Manage material master records, purchase orders, and stock movements." },
        { step: 5, title: "Supply Chain Visualization (Power BI)", description: "Build real-time supply chain dashboards tracking lead time and stockouts." },
        { step: 6, title: "Supply Chain Network Optimization Project", description: "Optimize multi-warehouse distribution network to minimize freight costs." },
        { step: 7, title: "Supply Chain Analyst Placement Interview Prep", description: "Practice supply chain case studies, forecasting math, and interviews." },
      ],
      "Logistics Specialist": [
        { step: 1, title: "Freight Transportation & Logistics Modes", description: "Study road, rail, air, and ocean freight logistics structures." },
        { step: 2, title: "Warehouse Management Systems (WMS)", description: "Manage bin locations, picking/packing strategies, and barcode scanning." },
        { step: 3, title: "Route Optimization & Fleet Management", description: "Optimize vehicle loading, transit schedules, and fuel efficiency." },
        { step: 4, title: "Customs Documentation & International Trade", description: "Learn Incoterms 2020, bill of lading, export/import clearance documentation." },
        { step: 5, title: "Logistics Cost Analysis & Carrier SLAs", description: "Negotiate freight rates, track carrier performance, and audit invoices." },
        { step: 6, title: "Last-Mile Delivery Optimization Project", description: "Redesign last-mile delivery route model for e-commerce logistics firm." },
        { step: 7, title: "Logistics Specialist Placement Interview Prep", description: "Prepare transport scenarios, Incoterms questions, and interview rounds." },
      ],
    },
  },

  "Sales": {
    name: "Sales",
    roles: ["Sales Executive", "Business Development Associate", "Account Executive"],
    interests: ["Sales", "Business Development", "Client Relationship", "Negotiation", "Communication"],
    aptitude: ["verbal reasoning", "people/social interaction", "persuasion"],
    workStyles: ["People-oriented", "Target-driven", "Collaborative"],
    skills: {
      "Sales Executive": {
        coreSkills: ["Sales", "Communication", "Negotiation", "Lead Generation", "Client Acquisition"],
        technicalSkills: ["CRM (HubSpot/Salesforce)", "Cold Calling", "Pitching", "Relationship Management"],
        recommendedSkills: ["B2B Sales", "Deal Closing", "Market Outreach", "Presentation"],
      },
      "Business Development Associate": {
        coreSkills: ["Business Development", "Prospecting", "Lead Generation", "B2B Sales", "Communication"],
        technicalSkills: ["CRM Software", "LinkedIn Outreach", "Market Research", "Cold Emailing", "Sales Pitches"],
        recommendedSkills: ["Contract Negotiation", "Strategic Partnerships", "Account Management"],
      },
      "Account Executive": {
        coreSkills: ["Account Management", "B2B Sales", "Deal Closing", "Relationship Building", "Contract Negotiation"],
        technicalSkills: ["Salesforce", "Pipeline Forecasting", "Product Demos", "Value Selling"],
        recommendedSkills: ["Enterprise Sales", "Upselling", "Key Account Strategy"],
      },
    },
    roadmaps: {
      "Sales Executive": [
        { step: 1, title: "Sales Psychology & Value Proposition", description: "Understand consultative selling, pain point discovery, and feature-benefit translation." },
        { step: 2, title: "Prospecting & Lead Generation Techniques", description: "Master LinkedIn outreach, cold emailing, and qualifying prospects (BANT)." },
        { step: 3, title: "Sales Pitch & Product Demonstration", description: "Structure effective sales presentations, live demos, and storytelling." },
        { step: 4, title: "Objection Handling & Closing Strategies", description: "Practice resolving price, timing, and competitive objections confidence." },
        { step: 5, title: "CRM Tools & Pipeline Management", description: "Manage deals, deal stages, follow-up tasks, and forecasting in HubSpot." },
        { step: 6, title: "Live Roleplay & Pitch Project", description: "Deliver end-to-end sales pitch simulation to senior mock evaluator." },
        { step: 7, title: "Sales Placement Interview Prep", description: "Practice sell-me-this-pen tests, pitch rounds, and target-driven Q&A." },
      ],
      "Business Development Associate": [
        { step: 1, title: "B2B Market Research & Target Profiling", description: "Identify ideal customer profiles (ICP) and decision-makers." },
        { step: 2, title: "Outbound Lead Generation & Cold Outreach", description: "Master personalized email sequences, cold calling scripts, and InMail." },
        { step: 3, title: "Discovery Calls & BANT Qualification", description: "Conduct discovery calls to assess Budget, Authority, Need, and Timeline." },
        { step: 4, title: "Partnership Pitching & Proposal Writing", description: "Create customized business proposals and commercial pitch decks." },
        { step: 5, title: "CRM Pipeline Management (Salesforce)", description: "Track opportunity stages, log interactions, and project monthly quotas." },
        { step: 6, title: "B2B Outreach Campaign Project", description: "Generate 15 qualified sales meetings through structured 14-day cadence." },
        { step: 7, title: "BDA Placement Interview Preparation", description: "Prepare pitch roleplay, cold call simulation, and target handling Q&A." },
      ],
      "Account Executive": [
        { step: 1, title: "Enterprise Consultative Selling (SPIN Selling)", description: "Master Situation, Problem, Implication, and Need-payoff questioning." },
        { step: 2, title: "Complex Solution Demonstration", description: "Customize software/product demos to solve specific C-suite challenges." },
        { step: 3, title: "Commercial Proposal & ROI Calculation", description: "Build business ROI models justifying software/service investment." },
        { step: 4, title: "Contract Negotiation & Procurement Clearance", description: "Navigate legal reviews, MSA terms, pricing discounts, and closing." },
        { step: 5, title: "Account Growth & Customer Handoff", description: "Transition closed-won clients smoothly to Customer Success team." },
        { step: 6, title: "Enterprise Closing Case Study Project", description: "Execute mock multi-stage enterprise deal closing strategy." },
        { step: 7, title: "Account Executive Interview Prep", description: "Practice mock deal closing, objection handling, and executive pitch." },
      ],
    },
  },

  "Media & Content": {
    name: "Media & Content",
    roles: ["Content Writer", "Copywriter", "Media Coordinator"],
    interests: ["Writing", "Content Creation", "Storytelling", "Journalism", "Editing", "Creative Writing"],
    aptitude: ["verbal reasoning", "creativity", "communication"],
    workStyles: ["Creative", "Independent", "Collaborative"],
    skills: {
      "Content Writer": {
        coreSkills: ["Content Writing", "Copywriting", "Editing", "Proofreading", "Research"],
        technicalSkills: ["SEO Writing", "WordPress", "Headline Creation", "Blog Formatting", "Canva"],
        recommendedSkills: ["Content Strategy", "Social Media Writing", "Email Copywriting"],
      },
      "Copywriter": {
        coreSkills: ["Copywriting", "Ad Copy", "Creative Writing", "Persuasive Writing", "Brand Voice"],
        technicalSkills: ["Headline Writing", "Landing Page Copy", "Email Copywriting", "A/B Testing", "SEO"],
        recommendedSkills: ["Marketing Psychology", "Social Ad Copy", "Scriptwriting"],
      },
      "Media Coordinator": {
        coreSkills: ["Media Planning", "Public Relations", "Communication", "Content Scheduling", "Event Coordination"],
        technicalSkills: ["Press Release Writing", "Media Relations", "Social Media", "Excel", "Canva"],
        recommendedSkills: ["Crisis Communication", "Brand Promotion", "Media Analytics"],
      },
    },
    roadmaps: {
      "Content Writer": [
        { step: 1, title: "Grammar, Tone & Writing Fundamentals", description: "Master clear, active-voice writing across different brand voices." },
        { step: 2, title: "SEO Writing & Keyword Placement", description: "Learn search intent, meta descriptions, subheadings, and organic ranking." },
        { step: 3, title: "Blog Writing & Long-Form Articles", description: "Structure engaging 1500-word guides, case studies, and tutorials." },
        { step: 4, title: "Ad Copywriting & Social Micro-Content", description: "Craft high-converting ad hooks, social posts, and email subject lines." },
        { step: 5, title: "Content Management Systems (WordPress)", description: "Publish, format, and add media in WordPress and Medium." },
        { step: 6, title: "Published Content Portfolio Project", description: "Publish 3 high-quality articles across different topics on live platform." },
        { step: 7, title: "Content Writing Interview & Test Assignment", description: "Practice timed writing tests, portfolio pitch, and agency interview." },
      ],
      "Copywriter": [
        { step: 1, title: "Copywriting Psychology & Advertising Formulas", description: "Master AIDA (Attention, Interest, Desire, Action) and PAS frameworks." },
        { step: 2, title: "Headline Writing & Hook Formulation", description: "Draft irresistible headlines, email subject lines, and ad hooks." },
        { step: 3, title: "High-Converting Landing Page Copywriting", description: "Write value propositions, social proof, call to actions, and feature bullets." },
        { step: 4, title: "Paid Social & Search Ad Copy", description: "Craft high-CTR text copy for Google Ads, Facebook Ads, and LinkedIn." },
        { step: 5, title: "Email Marketing Campaigns & Sales Sequences", description: "Write welcome email sequences, promotional blasts, and newsletter copy." },
        { step: 6, title: "Commercial Copywriting Portfolio Project", description: "Write complete ad campaign copy package (Landing page + 3 ads + 3 emails)." },
        { step: 7, title: "Copywriter Placement Interview Prep", description: "Prepare portfolio deck, live copy tests, and creative agency rounds." },
      ],
      "Media Coordinator": [
        { step: 1, title: "Media Relations & Press Operations", description: "Understand media landscapes, press release distribution, and PR strategy." },
        { step: 2, title: "Press Release Writing & Pitching", description: "Write compelling press releases and pitch stories to journalists/outlets." },
        { step: 3, title: "Media Scheduling & Content Distribution", description: "Coordinate publication schedules across print, digital, and broadcasting." },
        { step: 4, title: "Event Management & Media Briefings", description: "Organize press conferences, product launch events, and media kits." },
        { step: 5, title: "Media Analytics & PR Coverage Tracking", description: "Track media impressions, share of voice, and brand coverage." },
        { step: 6, title: "Product Launch PR Campaign Project", description: "Plan complete media roll-out package for a new product launch." },
        { step: 7, title: "Media Coordinator Interview Prep", description: "Prepare PR crisis management scenarios, media kit presentation, and interview." },
      ],
    },
  },

  "Other / Emerging Careers": {
    name: "Other / Emerging Careers",
    roles: ["Emerging Specialist"],
    interests: ["Innovation", "Emerging Tech", "Interdisciplinary"],
    aptitude: ["problem solving", "analytical thinking", "creativity"],
    workStyles: ["Creative", "Independent", "Analytical"],
    skills: {
      "Emerging Specialist": {
        coreSkills: ["Problem Solving", "Communication", "Research", "Adaptability"],
        technicalSkills: ["Data Analysis", "Project Management", "Digital Tools"],
        recommendedSkills: ["Domain Knowledge", "Continuous Learning"],
      },
    },
    roadmaps: {
      "Emerging Specialist": [
        { step: 1, title: "Foundational Knowledge & Skill Assessment", description: "Identify target emerging field and map core competency gaps." },
        { step: 2, title: "Domain Mastery & Practical Certification", description: "Complete specialized certification or hands-on workshop." },
        { step: 3, title: "Tool & Technology Integration", description: "Master specialized software and emerging workflow tools." },
        { step: 4, title: "Interdisciplinary Problem Solving", description: "Apply domain methodologies to modern enterprise challenges." },
        { step: 5, title: "Portfolio Development & Real-world Practice", description: "Build 2 practical projects demonstrating expertise." },
        { step: 6, title: "Emerging Domain Capstone", description: "Execute end-to-end case study in your chosen specialized field." },
        { step: 7, title: "Industry Placement & Interview Preparation", description: "Prepare specialized resume, portfolio, and interview responses." },
      ],
    },
  },
};

/**
 * Returns array of all domain names
 */
const getAllDomainNames = () => Object.keys(CAREER_DOMAINS);

/**
 * Returns all roles flattened across all domains
 */
const getAllRoles = () => {
  const rolesSet = new Set();
  Object.values(CAREER_DOMAINS).forEach((d) => {
    d.roles.forEach((r) => rolesSet.add(r));
  });
  return Array.from(rolesSet);
};

/**
 * Returns roles grouped by domain
 */
const getRolesByDomain = () => {
  const map = {};
  for (const [domainName, domainObj] of Object.entries(CAREER_DOMAINS)) {
    map[domainName] = domainObj.roles || [];
  }
  return map;
};

/**
 * Finds domain for a given role name
 */
const getDomainForRole = (roleName) => {
  if (!roleName) return "General Career Domain";
  const norm = String(roleName).toLowerCase().trim();
  for (const [domainName, domainObj] of Object.entries(CAREER_DOMAINS)) {
    if (domainObj.roles.some((r) => r.toLowerCase().trim() === norm || norm.includes(r.toLowerCase().trim()) || r.toLowerCase().trim().includes(norm))) {
      return domainName;
    }
  }
  return "General Career Domain";
};

/**
 * Gets skill breakdown for a role across all domains
 */
const getRoleSkillRequirements = (roleName) => {
  if (!roleName) {
    return {
      coreSkills: ["Communication", "Problem Solving", "Domain Fundamentals"],
      technicalSkills: ["Excel", "Data Analysis", "Reporting"],
      recommendedSkills: ["Project Management", "Team Collaboration"],
    };
  }

  const targetNorm = String(roleName).toLowerCase().trim();

  for (const domainObj of Object.values(CAREER_DOMAINS)) {
    for (const [rName, skillsObj] of Object.entries(domainObj.skills)) {
      if (rName.toLowerCase().trim() === targetNorm || targetNorm.includes(rName.toLowerCase().trim()) || rName.toLowerCase().trim().includes(targetNorm)) {
        return skillsObj;
      }
    }
  }

  return {
    coreSkills: ["Communication", "Problem Solving", "Domain Knowledge"],
    technicalSkills: ["Excel", "Data Analysis", "Reporting"],
    recommendedSkills: ["Project Management", "Team Collaboration"],
  };
};

/**
 * Gets step-by-step roadmap for a role
 */
const getRoadmapForRole = (roleName) => {
  const displayRole = roleName || "Career Target";
  if (roleName) {
    const targetNorm = String(roleName).toLowerCase().trim();

    for (const domainObj of Object.values(CAREER_DOMAINS)) {
      if (domainObj.roadmaps) {
        for (const [rName, roadmapSteps] of Object.entries(domainObj.roadmaps)) {
          if (rName.toLowerCase().trim() === targetNorm || targetNorm.includes(rName.toLowerCase().trim()) || rName.toLowerCase().trim().includes(targetNorm)) {
            return roadmapSteps;
          }
        }
      }
    }
  }

  return [
    { step: 1, title: "Domain Foundations", description: `Learn essential principles and concepts for ${displayRole}.` },
    { step: 2, title: "Technical & Core Skill Development", description: `Master key software, tools, and technical competencies for ${displayRole}.` },
    { step: 3, title: "Practical Application & Case Studies", description: `Build real-world case studies and projects showcasing ${displayRole} expertise.` },
    { step: 4, title: "Portfolio & Placement Preparation", description: `Prepare professional portfolio, mock interview practice, and campus drives.` },
  ];
};

module.exports = {
  CAREER_DOMAINS,
  getAllDomainNames,
  getAllRoles,
  getRolesByDomain,
  getDomainForRole,
  getRoleSkillRequirements,
  getRoadmapForRole,
};
