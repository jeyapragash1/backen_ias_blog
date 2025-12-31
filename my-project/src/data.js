// src/data.js
import kasunThilakarathnaImg from './assets/images/kasun-thilakarathna.png';
import fathimaRisnaImg from './assets/images/fathima-risna.png';
import kishoJeyapragashImg from './assets/images/kisho-jeyapragash.png';

// The team organizing the blog
export const blogTeamData = [
  { 
    name: 'Kasun Thilakarathna', 
    role: 'Project Lead & Editor-in-Chief', 
    img: kasunThilakarathnaImg,
    bio: 'Overseeing the strategic direction and content quality of the IAS UWU Blog, ensuring it aligns with our chapter\'s mission of innovation and excellence.'
  },
  { 
    name: 'Fathima Risna', 
    role: 'Content & Community Manager', 
    img: fathimaRisnaImg,
    bio: 'Managing article submissions, coordinating with student authors, and fostering a vibrant community of writers and readers.'
  },
  { 
    name: 'Kisho Jeyapragash', 
    role: 'Lead Developer & Webmaster', 
    img: kishoJeyapragashImg,
    bio: 'Responsible for the design, development, and maintenance of the blog platform, ensuring a seamless and high-performance user experience.'
  },
];

// Rich, expanded, and unique article data with 15 entries
export const articlesData = [
  // Featured Articles
  {
    slug: 'the-future-of-renewable-energy',
    title: 'Sri Lanka\'s Untapped Potential in Renewable Energy Grids',
    author: 'Dr. Aruni Silva',
    authorImage: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=300',
    date: 'November 10, 2023',
    category: 'Power Systems',
    tags: ['Renewable Energy', 'Smart Grids', 'Policy'],
    readingTime: '9 min read',
    isFeatured: true,
    featuredImage: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?q=80&w=1470',
    shortDescription: 'A deep dive into the technical and policy challenges Sri Lanka faces in transitioning to a fully renewable energy grid.',
    content: `<h2>The Green Energy Imperative</h2><p>As an island nation, Sri Lanka is uniquely positioned to harness renewable energy sources like solar and wind. However, integrating these intermittent sources into the national grid presents significant engineering challenges...</p>`
  },
  {
    slug: 'practical-iot-for-agriculture',
    title: 'Practical IoT: Building a Smart Irrigation System',
    author: 'Sanjay Kumar',
    authorImage: 'https://images.unsplash.com/photo-1581092921442-5a23c3a2c262?q=80&w=300',
    date: 'November 5, 2023',
    category: 'IoT',
    tags: ['Arduino', 'Sensors', 'Agriculture'],
    readingTime: '12 min read',
    isFeatured: true,
    featuredImage: 'https://images.unsplash.com/photo-1624555130581-2d99211341b6?q=80&w=1470',
    shortDescription: 'A step-by-step tutorial on creating a low-cost, automated irrigation system using soil moisture sensors and an Arduino.',
    content: `<h2>Revolutionizing Agriculture</h2><p>Smart agriculture is key to ensuring food security. This project demonstrates how simple IoT principles can be applied to conserve water and optimize crop growth.</p>`
  },
  {
    slug: 'getting-started-with-ai',
    title: 'A Student\'s Guide to Artificial Intelligence in 2024',
    author: 'Priya Sharma',
    authorImage: 'https://images.unsplash.com/photo-1546525848-37412b23a5b3?q=80&w=300',
    date: 'October 26, 2023',
    category: 'AI & ML',
    tags: ['Machine Learning', 'Python'],
    readingTime: '8 min read',
    isFeatured: true,
    featuredImage: 'https://images.unsplash.com/photo-1677756119517-756a188d2d94?q=80&w=1470',
    shortDescription: 'Demystifying the world of AI, this guide breaks down core concepts and provides a clear roadmap for students to begin their journey.',
    content: `<h2>The Dawn of a New Era</h2><p>Artificial Intelligence (AI) is a transformative force reshaping industries. For students at Uva Wellassa University, understanding AI is a critical step towards becoming an innovator.</p>`
  },

  // Regular Articles
  {
    slug: 'modern-web-development-explained',
    title: 'Navigating the Landscape of Modern Web Development',
    author: 'David Chen',
    authorImage: 'https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?q=80&w=300',
    date: 'October 20, 2023',
    category: 'Web Dev',
    tags: ['React', 'JavaScript'],
    readingTime: '7 min read',
    isFeatured: false,
    featuredImage: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1470',
    shortDescription: 'The web is evolving faster than ever. This article provides a high-level overview of the essential tools and frameworks driving modern web experiences.',
    content: `<h2>From Static Pages to Dynamic Applications</h2><p>Modern web development has moved far beyond simple HTML and CSS. Today, it's about building fast, interactive, and resilient applications that work flawlessly on any device.</p>`
  },
  {
    slug: 'cybersecurity-first-principles',
    title: 'The Modern Cybersecurity Landscape for Students',
    author: 'Aisha Khan',
    authorImage: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=300',
    date: 'October 15, 2023',
    category: 'Cybersecurity',
    tags: ['Security', 'Networking', 'Ethics'],
    readingTime: '10 min read',
    isFeatured: false,
    featuredImage: 'https://images.unsplash.com/photo-1550645612-82f5897e8f63?q=80&w=1470',
    shortDescription: 'A primer on the essential cybersecurity concepts every tech student needs to know, from threat modeling to defensive coding practices.',
    content: `<h2>The Digital Fortress</h2><p>In our connected world, cybersecurity is not just for specialists; it is a core competency for all engineers and developers. Understanding the threat landscape is the first step to building secure, resilient systems.</p>`
  },
  {
    slug: 'robot-arm-project',
    title: 'From Concept to Code: Building an Object-Tracking Robot Arm',
    author: 'Rajiv Gupta',
    authorImage: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=300',
    date: 'October 10, 2023',
    category: 'Research',
    tags: ['OpenCV', 'Arduino', '3D Printing'],
    readingTime: '15 min read',
    isFeatured: false,
    featuredImage: 'https://images.unsplash.com/photo-1635862310336-39a737a9d05a?q=80&w=1470',
    shortDescription: 'A detailed project showcase on constructing a 4-axis robotic arm that uses computer vision to detect, track, and interact with objects.',
    content: `<h2>Making Machines See</h2><p>This project merges mechanical design, electronics, and software to create an intelligent system. We utilized 3D printing for the arm structure, an Arduino for motor control, and Python with OpenCV for the computer vision logic.</p>`
  },
  {
    slug: '5g-technology-sri-lanka',
    title: 'The 5G Revolution: What It Means for Sri Lanka',
    author: 'Dr. Naleen Mendis',
    authorImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300',
    date: 'September 28, 2023',
    category: 'IoT',
    tags: ['5G', 'Telecommunication', 'Innovation'],
    readingTime: '9 min read',
    isFeatured: false,
    featuredImage: 'https://images.unsplash.com/photo-1611002220489-44370549c8a4?q=80&w=1470',
    shortDescription: 'Analyzing the potential impact of 5G technology on Sri Lanka\'s economy, from enhanced mobile broadband to mission-critical industrial applications.',
    content: `<h2>A Leap in Connectivity</h2><p>5G is not just a faster 4G. It's a new paradigm in wireless technology, promising ultra-low latency, massive device connectivity, and speeds that will unlock new services and industries.</p>`
  },
  {
    slug: 'data-visualization-essentials',
    title: 'Essentials of Data Visualization with Python',
    author: 'Fatima Al-Jamil',
    authorImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300',
    date: 'September 25, 2023',
    category: 'AI & ML',
    tags: ['Data Science', 'Matplotlib', 'Python'],
    readingTime: '11 min read',
    isFeatured: false,
    featuredImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1470',
    shortDescription: 'Learn how to turn complex datasets into compelling stories using Python\'s powerful visualization libraries like Matplotlib and Seaborn.',
    content: `<h2>Telling Stories with Data</h2><p>In the age of big data, the ability to effectively visualize information is a critical skill. A well-designed chart can reveal insights and trends that are impossible to see in a raw spreadsheet.</p>`
  },
  {
    slug: 'microgrid-management',
    title: 'Challenges in Microgrid Management and Control',
    author: 'Prof. Ishara Dias',
    authorImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300',
    date: 'September 19, 2023',
    category: 'Power Systems',
    tags: ['Microgrids', 'Control Systems', 'Research'],
    readingTime: '14 min read',
    isFeatured: false,
    featuredImage: 'https://images.unsplash.com/photo-1633596683417-a53a2f3657b9?q=80&w=1470',
    shortDescription: 'An academic overview of the key challenges in operating autonomous microgrids, including stability, load balancing, and integration of diverse energy sources.',
    content: `<h2>The Decentralized Grid</h2><p>Microgrids represent a paradigm shift in how we generate and distribute electrical power. These localized grids can operate autonomously or connect to the main grid, offering enhanced resilience and efficiency.</p>`
  },
  {
    slug: 'building-a-portfolio-website',
    title: 'Why Every Engineering Student Needs a Portfolio Website',
    author: 'Chen Wei',
    authorImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300',
    date: 'September 12, 2023',
    category: 'Web Dev',
    tags: ['Career', 'Web Development', 'React'],
    readingTime: '7 min read',
    isFeatured: false,
    featuredImage: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=1470',
    shortDescription: 'Your resume lists your skills; your portfolio proves them. Learn why building a personal website is one of the best investments you can make for your career.',
    content: `<h2>More Than a Resume</h2><p>In a competitive job market, a simple CV is not enough. A personal portfolio website is your digital showcase, a place to demonstrate your projects, document your learning journey, and define your personal brand as an engineer.</p>`
  },
  {
    slug: 'ethical-hacking-101',
    title: 'Thinking Like a Hacker: An Introduction to Ethical Hacking',
    author: 'Samira Hassan',
    authorImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300',
    date: 'September 05, 2023',
    category: 'Cybersecurity',
    tags: ['Ethical Hacking', 'Security', 'Beginner'],
    readingTime: '9 min read',
    isFeatured: false,
    featuredImage: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1470',
    shortDescription: 'To build secure systems, you must first understand how they can be broken. This article explores the mindset and basic methodologies of ethical hacking.',
    content: `<h2>Defense Through Offense</h2><p>Ethical hacking, or penetration testing, is the practice of legally and ethically attempting to breach an organization's digital defenses. By identifying vulnerabilities before malicious actors do, we can build stronger, more secure systems.</p>`
  },
  {
    slug: 'drone-technology-applications',
    title: 'Beyond the Sky: Real-World Applications of Drone Technology',
    author: 'Kenji Tanaka',
    authorImage: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=300',
    date: 'August 29, 2023',
    category: 'IoT',
    tags: ['Drones', 'Robotics', 'Surveying'],
    readingTime: '8 min read',
    isFeatured: false,
    featuredImage: 'https://images.unsplash.com/photo-1527977966376-94a86a49516a?q=80&w=1470',
    shortDescription: 'Drones are more than just flying cameras. Discover how UAVs are being used in agriculture, construction, disaster management, and logistics.',
    content: `<h2>The Autonomous Eye in the Sky</h2><p>Unmanned Aerial Vehicles (UAVs), commonly known as drones, have evolved from niche military hardware to versatile tools transforming numerous industries. Their ability to gather high-resolution data from the air quickly and cheaply is unlocking unprecedented efficiencies.</p>`
  },
  {
    slug: 'introduction-to-react-hooks',
    title: 'Simplifying State in React: An Introduction to Hooks',
    author: 'Maria Garcia',
    authorImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=300',
    date: 'August 21, 2023',
    category: 'Web Dev',
    tags: ['React', 'JavaScript', 'Frontend'],
    readingTime: '10 min read',
    isFeatured: false,
    featuredImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1470',
    shortDescription: 'Move beyond class components and discover how React Hooks like useState and useEffect can make your code cleaner, simpler, and more powerful.',
    content: `<h2>A New Way to React</h2><p>Introduced in React 16.8, Hooks are functions that let you "hook into" React state and lifecycle features from function components. They are a fundamental shift in how we write React applications, enabling more reusable and composable logic.</p>`
  },
  {
    slug: 'electric-vehicle-charging',
    title: 'The Engineering Behind Electric Vehicle Charging Infrastructure',
    author: 'Dr. Evelyn Reed',
    authorImage: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=300',
    date: 'August 15, 2023',
    category: 'Power Systems',
    tags: ['EV', 'Power Electronics', 'Infrastructure'],
    readingTime: '11 min read',
    isFeatured: false,
    featuredImage: 'https://images.unsplash.com/photo-1617886322207-6f504e7472c5?q=80&w=1470',
    shortDescription: 'As electric vehicles become more common, the demand for robust charging infrastructure grows. This article examines the power electronics and grid challenges involved.',
    content: `<h2>Powering the EV Revolution</h2><p>The transition to electric vehicles is not just about the cars themselves; it's about building a vast and intelligent network to power them. This involves complex power conversion, grid management, and smart charging technologies.</p>`
  },
  {
    slug: 'writing-a-research-paper',
    title: 'From Lab to Library: A Guide to Writing Your First Research Paper',
    author: 'Prof. Benjamin Carter',
    authorImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300',
    date: 'August 08, 2023',
    category: 'Research',
    tags: ['Academic Writing', 'Research', 'Publication'],
    readingTime: '13 min read',
    isFeatured: false,
    featuredImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1470',
    shortDescription: 'A structured guide for undergraduate students on how to approach writing a technical research paper, from formulating a hypothesis to structuring your manuscript.',
    content: `<h2>Communicating Your Discovery</h2><p>Innovation is incomplete until it is communicated. A well-written research paper is the primary medium through which new knowledge is shared, scrutinized, and built upon by the global scientific community. This guide demystifies the process.</p>`
  },
];


export const categoriesData = [
  'All', 'AI & ML', 'IoT', 'Web Dev', 'Cybersecurity', 'Power Systems', 'Research'
];