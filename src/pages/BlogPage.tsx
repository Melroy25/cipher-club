import React, { useState } from "react";
import { BookOpen, Clock, Tag, User, Search, ArrowRight, X, Terminal } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  readTime: string;
  date: string;
  author: string;
  authorRole: string;
  summary: string;
  content: string[];
}

const SAMPLE_POSTS: BlogPost[] = [
  {
    id: "prompt-ops-retrospective",
    title: "Inside PROMPT OPS-2K26: How We Built an Adversarial Gemini AI Prompt Challenge",
    slug: "inside-prompt-ops-2k26",
    category: "AI & PROMPTS",
    readTime: "4 MIN READ",
    date: "26 MAR 2026",
    author: "Technical Committee",
    authorRole: "Cipher Core",
    summary:
      "A deep dive into how Cipher and AgentBlazer created real-world prompt extraction testbeds, JSON transformation challenges, and Python debugging rounds for CSE students.",
    content: [
      "On March 25, 2026, Kalam Auditorium saw over 120 students compete in PROMPT OPS-2K26. Rather than conventional coding rounds, this competition treated language models as runtime environments requiring adversarial testing, structured output extraction, and guardrail navigation.",
      "Track 1 tested foundational image and visual generation prompting. Participants were provided intricate technical diagrams and had to reconstruct high-fidelity vectors and banners through iterative prompt refinement.",
      "Track 2 introduced system-prompt extraction and JSON normalization under constraint. Contestants were presented with hardened LLM endpoints and had to extract secret keys while verifying schema compliance through automated Python unit tests.",
      "The competition demonstrated that prompt engineering in 2026 is no longer about guessing adjectives—it is about deterministic structured input/output design, API schema adherence, and security awareness."
    ],
  },
  {
    id: "getting-started-with-blockchain",
    title: "From Zero to Solidity: What We Covered in the Smart Contract Workshop",
    slug: "from-zero-to-solidity-workshop",
    category: "BLOCKCHAIN",
    readTime: "5 MIN READ",
    date: "14 FEB 2026",
    author: "Domain Leads",
    authorRole: "Technical Domain",
    summary:
      "Key takeaways from our hands-on Solidity workshop: EVM architecture, gas optimization, smart contract state variables, and deploying on Sepolia testnets.",
    content: [
      "Decentralized systems remain one of the most intellectually rewarding paradigms for software engineers. In Session 14 of Cipher's Technical Domain track, we hosted an intensive Solidity and Web3 developer crash course.",
      "We started with the Ethereum Virtual Machine (EVM) stack model, memory vs storage vs calldata, and why gas optimization matters when deploying production code.",
      "Students created their own ERC-20 token contract, wrote automated test suites with Hardhat, and successfully broadcasted deployment transactions to the Sepolia testnet.",
      "Code repositories and deployment guides are available on the Cipher GitHub organization for all club members."
    ],
  },
  {
    id: "navigating-tech-placements",
    title: "Cracking Technical Interviews: Lessons from the UDAAN Mock Drives",
    slug: "cracking-technical-interviews-udaan",
    category: "CAREERS",
    readTime: "6 MIN READ",
    date: "05 JAN 2026",
    author: "Senior Council",
    authorRole: "Cipher Alumni",
    summary:
      "Insights from senior CSE students and alumni on data structures, system design fundamentals, resume curation, and navigating high-pressure technical interviews.",
    content: [
      "The UDAAN Mock Interview initiative was established to simulate real-world campus recruitment and off-campus tech evaluations.",
      "Through three rigorous rounds—DSA problem solving, system architecture discussions, and HR behavioral screenings—candidates received real-time constructive feedback from seniors placed in top product companies.",
      "Key takeaway 1: Communicate thought processes before writing code. Interviewers prioritize how you formulate constraints and edge cases.",
      "Key takeaway 2: Deep fundamentals in operating systems, DBMS indexing, and networking protocols matter far more than buzzwords on resumes."
    ],
  },
  {
    id: "generative-ai-research-tools",
    title: "Modern Research Tooling: Accelerating Academic Paper Reviews with AI",
    slug: "modern-research-tooling-ai",
    category: "RESEARCH",
    readTime: "3 MIN READ",
    date: "18 DEC 2025",
    author: "Faculty Advisory",
    authorRole: "CSE Department",
    summary:
      "How CSE undergraduate researchers can leverage LaTeX, citation graphing, and semantic search tools to organize literature reviews without sacrificing academic integrity.",
    content: [
      "Academic publishing demands rigorous synthesis of related work. During Session 13, the department reviewed modern literature review tools and reproducible experimentation pipelines.",
      "We highlighted the proper usage of LaTeX for IEEE format typesetting, reference indexing with BibTeX, and semantic paper clustering.",
      "Advisory reminder: AI assistants are aids for summarizing and formatting, but empirical validation and peer review standards remain paramount."
    ],
  },
];

export const BlogPage: React.FC = () => {
  const [posts] = useState<BlogPost[]>(SAMPLE_POSTS);
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  const categories = ["ALL", "AI & PROMPTS", "BLOCKCHAIN", "CAREERS", "RESEARCH"];

  const filteredPosts = posts.filter((post) => {
    const matchesCategory =
      activeCategory === "ALL" || post.category === activeCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
      {/* Header */}
      <div className="mb-12 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00ff66]/10 border border-[#00ff66]/30 text-[#00ff66] font-mono text-xs tracking-wider uppercase mb-4">
          <Terminal className="w-3.5 h-3.5" />
          <span>Cipher Club Articles &amp; Insights</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-mono font-bold text-white mb-4 tracking-tight">
          Tech <span className="text-[#00ff66] text-glow">Blog</span>
        </h1>
        <p className="font-mono text-xs md:text-sm text-[#88aa90] leading-relaxed">
          Technical deep dives, hackathon postmortems, workshop recaps, and career advice written by Cipher members and faculty mentors.
        </p>
      </div>

      {/* Category Tabs & Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-[#00ff66]/15">
        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-mono text-xs tracking-wider transition-all whitespace-nowrap ${
                activeCategory === cat
                  ? "bg-[#00ff66] text-black font-bold shadow-[0_0_15px_rgba(0,255,102,0.4)]"
                  : "bg-[#041006] text-[#88aa90] hover:text-[#00ff66] border border-[#00ff66]/20"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-[#88aa90] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles..."
            className="w-full pl-9 pr-4 py-2 bg-[#041006] border border-[#00ff66]/25 rounded-xl font-mono text-xs text-white placeholder-[#88aa90]/60 focus:outline-none focus:border-[#00ff66] transition-colors"
          />
        </div>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPosts.map((post) => (
          <article
            key={post.id}
            onClick={() => setSelectedPost(post)}
            className="group relative rounded-2xl bg-[#040e06] border border-[#00ff66]/20 hover:border-[#00ff66] transition-all duration-300 p-6 md:p-8 cursor-pointer hover:shadow-[0_0_30px_rgba(0,255,102,0.2)] hover:-translate-y-1 flex flex-col justify-between"
          >
            <div>
              {/* Category, Date & Read Time Meta */}
              <div className="flex items-center justify-between gap-2 text-xs font-mono mb-4">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#00ff66]/10 text-[#00ff66] border border-[#00ff66]/30 font-semibold tracking-wider">
                  <Tag className="w-3 h-3" /> {post.category}
                </span>
                <span className="text-[#88aa90] flex items-center gap-1 text-[11px]">
                  <Clock className="w-3 h-3 text-[#00ff66]" /> {post.readTime}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-xl md:text-2xl font-mono font-bold text-white group-hover:text-[#00ff66] transition-colors leading-snug">
                {post.title}
              </h2>

              {/* Summary */}
              <p className="font-mono text-xs md:text-sm text-[#88aa90] mt-3 leading-relaxed line-clamp-3">
                {post.summary}
              </p>
            </div>

            {/* Author & Read More Footer */}
            <div className="pt-6 mt-6 border-t border-[#00ff66]/15 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono text-[#88aa90]">
                <div className="w-6 h-6 rounded-full bg-[#00ff66]/15 border border-[#00ff66]/30 flex items-center justify-center text-[#00ff66]">
                  <User className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="font-bold text-white text-[11px]">{post.author}</p>
                  <p className="text-[10px] text-[#88aa90]/70">{post.date}</p>
                </div>
              </div>

              <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#00ff66] group-hover:translate-x-1 transition-transform">
                <span>Read Story</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Full Article Reader Modal */}
      {selectedPost && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setSelectedPost(null)}
        >
          <div
            className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-2xl bg-[#030905] border border-[#00ff66]/40 p-6 md:p-10 shadow-[0_0_50px_rgba(0,255,102,0.3)] scrollbar-none"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedPost(null)}
              className="absolute top-5 right-5 p-2 rounded-lg bg-[#041006] text-[#88aa90] hover:text-[#00ff66] border border-[#00ff66]/20 transition-colors"
              aria-label="Close article"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Article Meta */}
            <div className="flex items-center gap-3 text-xs font-mono text-[#00ff66] mb-4">
              <span className="px-2.5 py-0.5 rounded bg-[#00ff66]/10 border border-[#00ff66]/30 font-semibold">
                {selectedPost.category}
              </span>
              <span className="text-[#88aa90]">•</span>
              <span className="text-[#88aa90]">{selectedPost.date}</span>
              <span className="text-[#88aa90]">•</span>
              <span className="text-[#88aa90]">{selectedPost.readTime}</span>
            </div>

            {/* Modal Title */}
            <h1 className="text-2xl md:text-3xl font-mono font-bold text-white mb-6 leading-snug">
              {selectedPost.title}
            </h1>

            {/* Author Badge */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#051408] border border-[#00ff66]/20 mb-8">
              <div className="w-9 h-9 rounded-full bg-[#00ff66]/20 border border-[#00ff66]/40 flex items-center justify-center text-[#00ff66]">
                <User className="w-4 h-4" />
              </div>
              <div>
                <p className="font-mono text-xs font-bold text-white">{selectedPost.author}</p>
                <p className="font-mono text-[11px] text-[#88aa90]">{selectedPost.authorRole} · Department of CSE</p>
              </div>
            </div>

            {/* Article Body Paragraphs */}
            <div className="space-y-4 font-mono text-xs md:text-sm text-[#a0c0a8] leading-relaxed">
              {selectedPost.content.map((paragraph, idx) => (
                <p key={idx} className="bg-[#040e06]/50 p-3 rounded-lg border border-[#00ff66]/10">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="mt-8 pt-6 border-t border-[#00ff66]/20 flex justify-end">
              <button
                onClick={() => setSelectedPost(null)}
                className="font-mono text-xs px-5 py-2 rounded-lg bg-[#00ff66] text-black font-bold hover:bg-[#00ff66]/90 transition-colors shadow-[0_0_15px_rgba(0,255,102,0.4)]"
              >
                Done Reading
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
