// CareerCompass — Career Data
// Static Career Outlook map: 3-5 representative U.S. career roles per program
// Roles are aligned with each program's core competencies and reflect real U.S. labor market data.

(function () {
  const CAREER_OUTLOOK = {
    "PROG-001": [ // B.S. Computer Science
      {
        title: "Software Engineer",
        description: "Designs, develops, and maintains software applications using modern languages and frameworks within agile teams.",
        marketInfo: "Median salary ~$124K/year. BLS projects 25% growth through 2032, much faster than average.",
        companies: ["Google", "Microsoft", "Amazon", "Apple", "Meta"]
      },
      {
        title: "Full-Stack Developer",
        description: "Builds both front-end interfaces and back-end services for web applications, handling the complete technology stack.",
        marketInfo: "Strong demand across industries. Median salary ~$105K/year with remote-friendly opportunities.",
        companies: ["Shopify", "Stripe", "Netflix", "Airbnb"]
      },
      {
        title: "DevOps Engineer",
        description: "Automates CI/CD pipelines, manages cloud infrastructure, and ensures reliable software delivery and operations.",
        marketInfo: "One of the fastest-growing tech roles. Median salary ~$130K/year in the U.S.",
        companies: ["AWS", "HashiCorp", "Datadog", "GitLab"]
      },
      {
        title: "Systems Architect",
        description: "Designs large-scale distributed system architectures, making high-level decisions on technology stacks and integration patterns.",
        marketInfo: "Senior role in high demand at Fortune 500 companies. Median salary ~$150K/year.",
        companies: ["Oracle", "IBM", "Salesforce", "Cisco"]
      }
    ],

    "PROG-002": [ // B.S. Data Analytics
      {
        title: "Data Analyst",
        description: "Collects, processes, and analyzes datasets to identify trends and provide actionable business insights through reports and dashboards.",
        marketInfo: "Median salary ~$82K/year. BLS projects 36% growth for data-related roles through 2033.",
        companies: ["Deloitte", "McKinsey", "Capital One", "Spotify"]
      },
      {
        title: "Business Intelligence Analyst",
        description: "Designs BI dashboards and ETL pipelines to transform raw organizational data into strategic decision-making tools.",
        marketInfo: "High demand in finance, healthcare, and retail. Median salary ~$95K/year.",
        companies: ["Tableau", "Microsoft", "Walmart", "JPMorgan"]
      },
      {
        title: "Data Visualization Specialist",
        description: "Creates interactive charts, graphs, and dashboards using tools like Tableau and Power BI to communicate complex data clearly.",
        marketInfo: "Growing niche role. Median salary ~$85K/year with strong freelance opportunities.",
        companies: ["The New York Times", "Bloomberg", "Accenture"]
      },
      {
        title: "Machine Learning Engineer",
        description: "Builds and deploys predictive models using supervised and unsupervised learning techniques on real-world datasets.",
        marketInfo: "Rapidly expanding field. Median salary ~$140K/year in the U.S.",
        companies: ["OpenAI", "Google DeepMind", "NVIDIA", "Tesla"]
      }
    ],

    "PROG-003": [ // B.S. Cybersecurity
      {
        title: "Information Security Analyst",
        description: "Monitors networks for security breaches, investigates incidents, and implements protective measures to safeguard organizational data.",
        marketInfo: "Median salary ~$112K/year. BLS projects 32% growth through 2032.",
        companies: ["CrowdStrike", "Palo Alto Networks", "Mandiant", "NSA"]
      },
      {
        title: "Penetration Tester",
        description: "Conducts authorized simulated attacks on systems and networks to identify vulnerabilities before malicious actors exploit them.",
        marketInfo: "High demand with a talent shortage. Median salary ~$105K/year.",
        companies: ["Rapid7", "HackerOne", "Deloitte", "NCC Group"]
      },
      {
        title: "Security Operations Center (SOC) Analyst",
        description: "Monitors security alerts in real time, triages threats, and coordinates incident response within a security operations center.",
        marketInfo: "Entry-level cybersecurity role with strong career progression. Median salary ~$85K/year.",
        companies: ["Splunk", "IBM Security", "Secureworks", "AT&T"]
      },
      {
        title: "Digital Forensics Examiner",
        description: "Recovers and analyzes digital evidence from computers and networks to support cybercrime investigations and legal proceedings.",
        marketInfo: "Specialized role in law enforcement and consulting. Median salary ~$95K/year.",
        companies: ["FBI", "KPMG", "Stroz Friedberg", "Kroll"]
      },
      {
        title: "Security Architect",
        description: "Designs and implements enterprise security frameworks, policies, and infrastructure to protect against evolving cyber threats.",
        marketInfo: "Senior role with strong demand. Median salary ~$135K/year.",
        companies: ["Fortinet", "Zscaler", "Microsoft", "Booz Allen Hamilton"]
      }
    ],

    "PROG-004": [ // B.S. Cloud Computing
      {
        title: "Cloud Engineer",
        description: "Deploys, manages, and optimizes cloud infrastructure on platforms like AWS, Azure, and GCP, ensuring scalability and reliability.",
        marketInfo: "Median salary ~$120K/year. Cloud roles are among the most in-demand in tech.",
        companies: ["AWS", "Microsoft Azure", "Google Cloud", "Rackspace"]
      },
      {
        title: "Cloud Solutions Architect",
        description: "Designs cloud-native architectures, selects appropriate services, and creates migration strategies for enterprise workloads.",
        marketInfo: "Senior role with median salary ~$145K/year. High demand across all industries.",
        companies: ["AWS", "Accenture", "Deloitte", "VMware"]
      },
      {
        title: "Site Reliability Engineer (SRE)",
        description: "Ensures system uptime and performance by automating operations, managing incidents, and implementing observability practices.",
        marketInfo: "Rapidly growing role. Median salary ~$135K/year in the U.S.",
        companies: ["Google", "LinkedIn", "Uber", "Datadog"]
      },
      {
        title: "Infrastructure Engineer",
        description: "Builds and maintains the underlying compute, storage, and networking infrastructure using infrastructure-as-code tools.",
        marketInfo: "Steady demand in enterprises modernizing their IT. Median salary ~$115K/year.",
        companies: ["Terraform/HashiCorp", "Red Hat", "DigitalOcean", "Cloudflare"]
      }
    ],

    "PROG-005": [ // B.S. Software Engineering
      {
        title: "Software Developer",
        description: "Writes, tests, and maintains application code following software engineering best practices and design patterns.",
        marketInfo: "Median salary ~$120K/year. Over 1.8 million jobs in the U.S. with steady growth.",
        companies: ["Microsoft", "Amazon", "Adobe", "Intuit"]
      },
      {
        title: "QA/Test Engineer",
        description: "Designs and executes test plans, writes automated tests, and ensures software quality throughout the development lifecycle.",
        marketInfo: "Essential role in every software team. Median salary ~$95K/year.",
        companies: ["Apple", "Atlassian", "Sauce Labs", "BrowserStack"]
      },
      {
        title: "Scrum Master / Agile Coach",
        description: "Facilitates agile ceremonies, removes team impediments, and coaches development teams on Scrum and Kanban practices.",
        marketInfo: "Growing demand for agile expertise. Median salary ~$105K/year.",
        companies: ["Spotify", "ING", "Capital One", "ThoughtWorks"]
      },
      {
        title: "Mobile Application Developer",
        description: "Builds native and cross-platform mobile apps, handling UI frameworks, device APIs, and app store deployment processes.",
        marketInfo: "Strong demand driven by mobile-first strategies. Median salary ~$115K/year.",
        companies: ["Apple", "Google", "Uber", "DoorDash"]
      },
      {
        title: "Technical Lead",
        description: "Guides a development team on architecture decisions, code reviews, and technical strategy while contributing hands-on code.",
        marketInfo: "Senior role bridging engineering and management. Median salary ~$140K/year.",
        companies: ["Netflix", "Stripe", "Palantir", "Snowflake"]
      }
    ],

    "PROG-006": [ // M.S. Data Analytics
      {
        title: "Senior Data Scientist",
        description: "Develops advanced predictive models, designs experiments, and translates complex analytical findings into business strategy.",
        marketInfo: "Median salary ~$135K/year. One of the top-rated careers in the U.S.",
        companies: ["Meta", "Netflix", "Airbnb", "Spotify"]
      },
      {
        title: "AI/ML Engineer",
        description: "Builds production-grade machine learning pipelines, trains models at scale, and integrates AI capabilities into products.",
        marketInfo: "Explosive growth. Median salary ~$150K/year with strong demand across sectors.",
        companies: ["OpenAI", "Google DeepMind", "Anthropic", "NVIDIA"]
      },
      {
        title: "Analytics Manager",
        description: "Leads data analytics teams, defines KPIs, and drives data-informed decision-making across the organization.",
        marketInfo: "Leadership role with median salary ~$130K/year. High demand in tech and finance.",
        companies: ["Amazon", "Goldman Sachs", "Uber", "Walmart"]
      },
      {
        title: "Big Data Engineer",
        description: "Designs and maintains large-scale data processing systems using technologies like Spark, Hadoop, and cloud data warehouses.",
        marketInfo: "Critical role in data-driven organizations. Median salary ~$140K/year.",
        companies: ["Databricks", "Snowflake", "Palantir", "Confluent"]
      }
    ],

    "PROG-007": [ // M.S. Cybersecurity
      {
        title: "Chief Information Security Officer (CISO)",
        description: "Leads an organization's information security strategy, manages security teams, and reports to executive leadership on risk posture.",
        marketInfo: "Executive role with median salary ~$180K/year. Increasing demand due to rising cyber threats.",
        companies: ["JPMorgan Chase", "Bank of America", "Lockheed Martin", "Northrop Grumman"]
      },
      {
        title: "Threat Intelligence Analyst",
        description: "Researches emerging cyber threats, analyzes attack patterns, and produces intelligence reports to inform defensive strategies.",
        marketInfo: "Specialized role with growing demand. Median salary ~$110K/year.",
        companies: ["Mandiant", "Recorded Future", "CrowdStrike", "FireEye"]
      },
      {
        title: "Security Consultant",
        description: "Advises organizations on security posture, conducts risk assessments, and recommends compliance frameworks and remediation strategies.",
        marketInfo: "Consulting firms and enterprises actively hiring. Median salary ~$120K/year.",
        companies: ["Deloitte", "PwC", "EY", "Accenture"]
      },
      {
        title: "Incident Response Manager",
        description: "Coordinates the response to security breaches, leads forensic investigations, and develops incident response playbooks.",
        marketInfo: "Critical role in enterprise security. Median salary ~$125K/year.",
        companies: ["Microsoft", "Cisco Talos", "Palo Alto Networks", "Unit 42"]
      },
      {
        title: "Security Policy Analyst",
        description: "Develops and maintains security policies, ensures regulatory compliance, and conducts security awareness training programs.",
        marketInfo: "Steady demand in government and regulated industries. Median salary ~$100K/year.",
        companies: ["CISA", "NIST", "Raytheon", "MITRE"]
      }
    ],

    "PROG-008": [ // B.S. Business Administration
      {
        title: "Business Analyst",
        description: "Bridges business needs and technology solutions by gathering requirements, analyzing processes, and recommending improvements.",
        marketInfo: "Median salary ~$85K/year. BLS projects 11% growth through 2032.",
        companies: ["McKinsey", "Deloitte", "Amazon", "Accenture"]
      },
      {
        title: "Operations Manager",
        description: "Oversees daily business operations, optimizes workflows, manages budgets, and ensures organizational efficiency.",
        marketInfo: "Broad demand across industries. Median salary ~$98K/year.",
        companies: ["FedEx", "Target", "UnitedHealth Group", "Johnson & Johnson"]
      },
      {
        title: "Marketing Coordinator",
        description: "Plans and executes marketing campaigns, analyzes customer data, and coordinates brand messaging across channels.",
        marketInfo: "Entry to mid-level role. Median salary ~$65K/year with growth into management.",
        companies: ["HubSpot", "Procter & Gamble", "Nike", "Coca-Cola"]
      },
      {
        title: "Financial Analyst",
        description: "Evaluates financial data, prepares forecasts, and provides investment recommendations to support business decisions.",
        marketInfo: "Median salary ~$90K/year. Strong demand in banking, insurance, and corporate finance.",
        companies: ["Goldman Sachs", "Morgan Stanley", "BlackRock", "Fidelity"]
      },
      {
        title: "Human Resources Specialist",
        description: "Manages recruitment, employee relations, benefits administration, and workforce planning within organizations.",
        marketInfo: "Median salary ~$67K/year. Steady demand across all sectors.",
        companies: ["Workday", "ADP", "PwC", "Mercer"]
      }
    ],

    "PROG-009": [ // MBA Information Technology
      {
        title: "IT Director",
        description: "Manages IT departments, aligns technology strategy with business goals, and oversees infrastructure and application portfolios.",
        marketInfo: "Senior leadership role. Median salary ~$160K/year.",
        companies: ["Gartner", "Cisco", "Dell Technologies", "Accenture"]
      },
      {
        title: "Technology Consultant",
        description: "Advises organizations on technology adoption, digital transformation, and IT strategy to drive competitive advantage.",
        marketInfo: "High demand at consulting firms. Median salary ~$130K/year.",
        companies: ["McKinsey Digital", "BCG", "Bain", "Capgemini"]
      },
      {
        title: "Product Manager",
        description: "Defines product vision, prioritizes features, and coordinates cross-functional teams to deliver technology products to market.",
        marketInfo: "One of the most sought-after roles in tech. Median salary ~$140K/year.",
        companies: ["Google", "Meta", "Salesforce", "Atlassian"]
      },
      {
        title: "IT Program Manager",
        description: "Oversees multiple IT projects, manages budgets and timelines, and ensures alignment with organizational strategic objectives.",
        marketInfo: "Median salary ~$135K/year. Strong demand in enterprises undergoing digital transformation.",
        companies: ["Microsoft", "Oracle", "SAP", "ServiceNow"]
      }
    ],

    "PROG-010": [ // B.S. Health Informatics
      {
        title: "Health Informatics Specialist",
        description: "Manages electronic health record systems, ensures data quality, and supports clinical workflows with technology solutions.",
        marketInfo: "Median salary ~$62K/year. Growing demand as healthcare digitizes. BLS projects 16% growth.",
        companies: ["Epic Systems", "Cerner", "Mayo Clinic", "Kaiser Permanente"]
      },
      {
        title: "Clinical Data Analyst",
        description: "Analyzes patient data and clinical outcomes to support quality improvement initiatives and population health management.",
        marketInfo: "Median salary ~$75K/year. Increasing demand in hospitals and health systems.",
        companies: ["UnitedHealth Group", "HCA Healthcare", "Cleveland Clinic", "Optum"]
      },
      {
        title: "Health IT Project Manager",
        description: "Leads implementation of health information systems, coordinates with clinical staff, and ensures regulatory compliance.",
        marketInfo: "Median salary ~$95K/year. High demand during EHR modernization efforts.",
        companies: ["Epic Systems", "Meditech", "Allscripts", "Philips"]
      },
      {
        title: "Public Health Data Analyst",
        description: "Collects and analyzes epidemiological data, supports disease surveillance systems, and informs public health policy decisions.",
        marketInfo: "Growing role post-pandemic. Median salary ~$70K/year in government and nonprofit sectors.",
        companies: ["CDC", "WHO", "Johns Hopkins", "NIH"]
      }
    ],

    "PROG-011": [ // B.A. English
      {
        title: "Content Strategist",
        description: "Plans, creates, and manages content across digital platforms, aligning messaging with brand voice and audience needs.",
        marketInfo: "Median salary ~$72K/year. Growing demand in tech companies and digital agencies.",
        companies: ["HubSpot", "Shopify", "Mailchimp", "WordPress/Automattic"]
      },
      {
        title: "Technical Writer",
        description: "Produces clear documentation, user guides, and API references for software products and technical systems.",
        marketInfo: "Median salary ~$79K/year. BLS projects 7% growth through 2032.",
        companies: ["Google", "Microsoft", "Stripe", "Twilio"]
      },
      {
        title: "UX Writer",
        description: "Crafts microcopy, interface text, and user-facing content that guides users through digital product experiences.",
        marketInfo: "Emerging role in tech. Median salary ~$85K/year at major tech companies.",
        companies: ["Google", "Apple", "Dropbox", "Figma"]
      },
      {
        title: "Editor / Copy Editor",
        description: "Reviews and refines written content for clarity, grammar, style consistency, and factual accuracy across publications.",
        marketInfo: "Median salary ~$65K/year. Opportunities in publishing, media, and corporate communications.",
        companies: ["The New York Times", "Condé Nast", "Penguin Random House", "Reuters"]
      },
      {
        title: "Communications Specialist",
        description: "Develops internal and external communications, press releases, and stakeholder messaging for organizations.",
        marketInfo: "Median salary ~$68K/year. Steady demand across industries.",
        companies: ["Edelman", "Weber Shandwick", "FleishmanHillard", "Ogilvy"]
      }
    ],

    "PROG-012": [ // M.Ed. Instructional Design
      {
        title: "Instructional Designer",
        description: "Designs effective learning experiences using evidence-based models like ADDIE and SAM for corporate training and higher education.",
        marketInfo: "Median salary ~$75K/year. BLS projects 8% growth. High demand in e-learning.",
        companies: ["University", "Coursera", "LinkedIn Learning", "Amazon"]
      },
      {
        title: "E-Learning Developer",
        description: "Builds interactive online courses using authoring tools, multimedia, and learning management systems.",
        marketInfo: "Median salary ~$72K/year. Remote-friendly role with growing demand post-pandemic.",
        companies: ["Articulate", "Udemy", "Khan Academy", "edX"]
      },
      {
        title: "Learning Experience (LX) Designer",
        description: "Applies UX principles to education, creating learner-centered curricula and digital learning environments.",
        marketInfo: "Emerging role in EdTech. Median salary ~$80K/year.",
        companies: ["Duolingo", "Pluralsight", "2U", "Chegg"]
      },
      {
        title: "Corporate Training Manager",
        description: "Leads training programs, assesses organizational learning needs, and measures the effectiveness of development initiatives.",
        marketInfo: "Median salary ~$95K/year. Strong demand in large enterprises.",
        companies: ["Deloitte", "Google", "Microsoft", "PwC"]
      },
      {
        title: "Curriculum Developer",
        description: "Designs and updates academic curricula, aligns content with learning standards, and integrates assessment strategies.",
        marketInfo: "Median salary ~$70K/year. Opportunities in K-12, higher education, and EdTech companies.",
        companies: ["Pearson", "McGraw-Hill", "College Board", "University"]
      }
    ]
  };

  /**
   * Returns the array of career roles for a given program.
   * @param {string} programId - The program identifier (e.g., "PROG-001")
   * @returns {Array<{title: string, description: string, marketInfo: string}>}
   */
  function getOutlook(programId) {
    return CAREER_OUTLOOK[programId] || [];
  }

  // Expose on global namespace
  window.CareerCompass.CareerData = { getOutlook };
})();
