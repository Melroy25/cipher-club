import { prisma } from "../lib/prisma.js";

async function main() {
  console.log("Seeding Cipher Club initial data...");

  // 1. Team Members
  const existingMembers = await prisma.teamMember.count();
  if (existingMembers === 0) {
    console.log("Seeding team members...");
    const members = [
      {
        name: "Nazmin Ziya",
        role: "TREASURER",
        photoUrl: "/assets/leaders/nazmin.jpg",
        github: "https://github.com",
        linkedin: "https://linkedin.com",
        displayOrder: 1,
      },
      {
        name: "Jeslin Ninora",
        role: "JOINT TREASURER",
        photoUrl: "/assets/leaders/jeslin.jpg",
        github: "https://github.com",
        linkedin: "https://linkedin.com",
        displayOrder: 2,
      },
      {
        name: "Elston Herold Pereira",
        role: "PRESIDENT",
        photoUrl: "/assets/leaders/elston.jpg",
        github: "https://github.com",
        linkedin: "https://linkedin.com",
        displayOrder: 3,
      },
      {
        name: "Raynell Lewis",
        role: "VICE PRESIDENT",
        photoUrl: "/assets/leaders/raynell.jpg",
        modalPhotoUrl: "/assets/leaders/raynell_modal.jpg",
        github: "https://github.com",
        linkedin: "https://linkedin.com",
        displayOrder: 4,
      },
      {
        name: "Chaitra R M",
        role: "SECRETARY",
        photoUrl: "/assets/leaders/chaitra.jpg",
        github: "https://github.com",
        linkedin: "https://linkedin.com",
        displayOrder: 5,
      },
    ];

    for (const m of members) {
      await prisma.teamMember.create({ data: m });
    }
  }

  // 2. Events & Slides
  const existingEvents = await prisma.event.count();
  if (existingEvents === 0) {
    console.log("Seeding events & slides...");
    await prisma.event.create({
      data: {
        title: "Lumière — The Gala",
        tag: "BRANCH GALA",
        dateTag: "29 OCT 2025",
        subTitle: "29 OCTOBER 2025 · KALAM AUDITORIUM",
        slug: "LUMIERE_GALA",
        cardSub: "CSE Branch Entry · Kalam Auditorium",
        shortDesc: "The CSE branch entry programme at Kalam Auditorium, themed “Where Glam Meets Glow.” Organised by the Cipher Association with coordinated red, gold and black décor, it welcomed students into the department and reinforced a shared sense of collective identity.",
        fullDescription: JSON.stringify([
          "The Department of Computer Science and Engineering (CSE) held its branch entry programme, “Lumière – The Gala,” on 29 October 2025 at the Kalam Auditorium. Organised by the Cipher Association, the event welcomed students into the department through a formal gathering centred on the theme “Where Glam Meets Glow.” The venue featured coordinated red, gold and black décor, floral arrangements, illuminated panels and a central Lumière backdrop.",
          "The programme gave students an opportunity to interact with peers and take part in a shared departmental event beyond academics, highlighting the role of the Cipher Association in organising student-led activities. It concluded as a formal branch entry that marked the students’ transition into the department and reinforced a sense of collective identity."
        ]),
        displayOrder: 1,
        isPublished: true,
        slides: {
          create: Array.from({ length: 8 }, (_, i) => ({
            imageUrl: `/assets/lumiere/slide_${String(i + 1).padStart(2, "0")}.jpg`,
            order: i + 1,
          })),
        },
      },
    });

    await prisma.event.create({
      data: {
        title: "PROMPT OPS-2K26",
        tag: "COMPETITION",
        dateTag: "25 MAR 2026",
        subTitle: "25 MARCH 2026 · PROMPT ENGINEERING COMPETITION",
        slug: "PROMPT_OPS",
        cardSub: "AgentBlazer Club × Cipher",
        shortDesc: "A technical competition on prompt engineering and AI tools by the AgentBlazer Club and Cipher. Track 1 covered invitation, logo and image recreation; Track 2 tested JSON conversion, Python debugging and a Gemini AI security prompt challenge.",
        fullDescription: JSON.stringify([
          "Organized by the AgentBlazer Club and Cipher under the guidance of Ms. Nisha J Roche, Ms. Jaishma K, and HOD Dr. Melwyn D’Souza, this technical competition focused on prompt engineering and AI tools.",
          "Track 1 featured invitation generation, logo recreation, and image recreation rounds.",
          "Track 2 tested students in JSON conversion, Python code debugging, and a Gemini AI security prompt extraction challenge."
        ]),
        displayOrder: 2,
        isPublished: true,
        slides: {
          create: Array.from({ length: 8 }, (_, i) => ({
            imageUrl: `/assets/promptops/slide_${String(i + 1).padStart(2, "0")}.jpg`,
            order: i + 1,
          })),
        },
      },
    });
  }

  // 3. Activities
  const existingActivities = await prisma.activity.count();
  if (existingActivities === 0) {
    console.log("Seeding activities...");
    const activities = [
      { numberId: "01", title: "Applied Machine Learning", displayOrder: 1 },
      { numberId: "02", title: "Industrial Visit", displayOrder: 2 },
      { numberId: "03", title: "LaTeX Tool", displayOrder: 3 },
      { numberId: "04", title: "Robotic Process Automation using UiPath", displayOrder: 4 },
      { numberId: "05", title: "HackTO Future 20", displayOrder: 5 },
      { numberId: "06", title: "How to Win at the Sport of Programming", displayOrder: 6 },
      { numberId: "07", title: "Introduction to Google Crowdsource", displayOrder: 7 },
      { numberId: "08", title: "Educational Session on GitHub", displayOrder: 8 },
      { numberId: "09", title: "Industrial Visit", displayOrder: 9 },
      { numberId: "10", title: "UDAAN Mock Interview", displayOrder: 10 },
      { numberId: "11", title: "Freshers Onboarding Programme", displayOrder: 11 },
      { numberId: "12", title: "Projects Funded by KSCST", displayOrder: 12 },
      { numberId: "13", title: "Generative AI Tools for Research", displayOrder: 13 },
      { numberId: "14", title: "Introduction to Blockchain: Solidity Workshop", displayOrder: 14 },
      { numberId: "15", title: "Star UML", displayOrder: 15 },
      { numberId: "16", title: "Generative AI: Custom Solutions using OpenAI", displayOrder: 16 },
      { numberId: "17", title: "React.js and Node.js Workshop", displayOrder: 17 },
    ];

    for (const a of activities) {
      await prisma.activity.create({ data: a });
    }
  }

  // 4. Domains
  const existingDomains = await prisma.domain.count();
  if (existingDomains === 0) {
    console.log("Seeding domains...");
    const domains = [
      {
        name: "Technical Skill Building",
        sessionsLabel: "5 SESSIONS",
        iconName: "Code2",
        description: "Hands-on workshops, coding sessions, and tech talks that turn theory into working software.",
        displayOrder: 1,
      },
      {
        name: "Leadership & Governance",
        sessionsLabel: "3 SESSIONS",
        iconName: "Crown",
        description: "Annual elections for President, Secretary, and office bearers — guided by the HOD and Faculty Coordinator.",
        displayOrder: 2,
      },
      {
        name: "Events & Collaboration",
        sessionsLabel: "8 SESSIONS",
        iconName: "Users",
        description: "Hackathons, seminars, and department-level competitions that bring students together.",
        displayOrder: 3,
      },
      {
        name: "Industry Readiness",
        sessionsLabel: "4 SESSIONS",
        iconName: "Rocket",
        description: "Bridging classroom learning with real-world application to prepare students for the field.",
        displayOrder: 4,
      },
    ];

    for (const d of domains) {
      await prisma.domain.create({ data: d });
    }
  }

  // 5. Website Content
  console.log("Seeding website content...");
  const contentItems = [
    { key: "hero_title", value: "Student Association of Computer Science & Engineering", section: "hero", label: "Hero Main Title", type: "text" },
    { key: "hero_subtitle", value: "Bridging academic knowledge and practical application – a community of aspiring professionals in computing.", section: "hero", label: "Hero Subtitle", type: "textarea" },
    { key: "hero_join_btn", value: "JOIN CIPHER", section: "hero", label: "Hero Join Button Text", type: "text" },
    { key: "hero_events_btn", value: "EXPLORE EVENTS", section: "hero", label: "Hero Events Button Text", type: "text" },
    { key: "about_title", value: "Who we are", section: "about", label: "About Section Heading", type: "text" },
    { key: "about_text", value: "CIPHER is the student association of the Department of Computer Science & Engineering. It serves as a platform for students to nurture their technical and interpersonal skills through innovative and collaborative activities. The association strives to bridge the gap between academic knowledge and practical application, fostering a community of aspiring professionals dedicated to excellence in computing.", section: "about", label: "About Section Description", type: "textarea" },
    { key: "activities_desc", value: "Hands-on workshops, industrial visits, and technical sessions run by the Cipher Association — spanning AI, blockchain, research tooling, and career prep.", section: "activities", label: "Activities Section Intro", type: "textarea" },
    { key: "join_heading", value: "Join the Team", section: "join", label: "Join Section Heading", type: "text" },
    { key: "join_text", value: "Whether you want to build, lead, or simply learn — CIPHER is where CSE students turn curiosity into capability. Join the community and help shape what comes next.", section: "join", label: "Join Section Description", type: "textarea" },
    { key: "contact_email", value: "cipher@sjec.ac.in", section: "footer", label: "Contact Email", type: "text" },
    { key: "linkedin_url", value: "https://linkedin.com", section: "footer", label: "LinkedIn URL", type: "url" },
    { key: "github_url", value: "https://github.com", section: "footer", label: "GitHub URL", type: "url" },
    { key: "instagram_url", value: "https://instagram.com", section: "footer", label: "Instagram URL", type: "url" },
    { key: "footer_copyright", value: "> © 2026 CIPHER SJEC.", section: "footer", label: "Footer Copyright Text", type: "text" },
  ];

  for (const item of contentItems) {
    await prisma.siteContent.upsert({
      where: { key: item.key },
      update: {},
      create: item,
    });
  }

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });