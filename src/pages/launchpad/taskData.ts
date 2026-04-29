export interface DayTask {
  day: number;
  title: string;
  description: string;
  proTip: string;
  actionLabel?: string;
  actionRoute?: string;
  sampleAnswer?: string;
}

export interface Phase {
  name: string;
  days: [number, number];
  label: string;
}

export interface NicheOption {
  name: string;
  emoji: string;
  description: string;
}

export interface HookTemplate {
  template: string;
  example: string;
}

export interface ContentPillar {
  name: string;
  description: string;
  examples: string[];
}

export const phases: Phase[] = [
  { name: "Foundation", days: [1, 7], label: "Phase 1" },
  { name: "Content Engine", days: [8, 14], label: "Phase 2" },
  { name: "Monetization", days: [15, 21], label: "Phase 3" },
  { name: "Scale", days: [22, 30], label: "Phase 4" },
];

export const nicheOptions: NicheOption[] = [
  { name: "Digital Nomad Life", emoji: "🌍", description: "Remote work, travel hacks, and location-independent income." },
  { name: "Retro Tech & Analog Living", emoji: "📻", description: "Vintage tech, film photography, vinyl culture, and slow living." },
  { name: "Executive Mindset", emoji: "🧠", description: "Leadership, productivity systems, and high-performance habits." },
  { name: "Home Sustainability", emoji: "🌱", description: "Eco-friendly living, DIY green projects, and conscious consumerism." },
  { name: "AI & Side Hustles", emoji: "🤖", description: "Using AI tools to build passive income streams and automate work." },
  { name: "Fitness Over 40", emoji: "💪", description: "Health, longevity, strength training, and nutrition for Gen X." },
];

export const hookTemplates: HookTemplate[] = [
  { template: "Why I stopped doing [X] and started [Y]", example: "Why I stopped doing morning routines and started evening rituals" },
  { template: "The one [adjective] secret to [desired outcome]", example: "The one analog secret to a digital income" },
  { template: "I made $[amount] in [timeframe] by [method]", example: "I made $3,000 in 30 days by letting my AI twin post for me" },
  { template: "Nobody talks about [hidden truth] in [niche]", example: "Nobody talks about burnout in the content creator space" },
  { template: "[Number] things I wish I knew before [milestone]", example: "5 things I wish I knew before starting a faceless channel" },
];

export const contentPillars: ContentPillar[] = [
  { name: "The Educational Pillar", description: "Teach your audience something valuable. How-tos, tutorials, and breakdowns.", examples: ["How to set up a faceless channel in 1 hour", "3 free tools every creator needs"] },
  { name: "The Lifestyle Pillar", description: "Show the behind-the-scenes and the 'why' behind what you do.", examples: ["A day in my life as a digital nomad", "My morning routine that earns while I sleep"] },
  { name: "The Opinion Pillar", description: "Share hot takes and contrarian views that spark conversation.", examples: ["Why hustle culture is dead", "The truth about passive income nobody tells you"] },
  { name: "The Story Pillar", description: "Share personal journeys, case studies, and transformations.", examples: ["How I went from $0 to $5K/mo with a faceless channel", "My biggest mistake as a creator"] },
];

export const tasks: DayTask[] = [
  { day: 1, title: "Sign up & set your goal", description: "Create your account and define your content income goal.", proTip: "Write down a specific dollar amount and date — vague goals get vague results.", sampleAnswer: "My goal is to earn $2,000/month from my faceless channel by September 1st. I will post 5 videos per week." },
  { day: 2, title: "Research your audience", description: "Identify who you're creating content for and what they need.", proTip: "Spend 20 minutes in Reddit or Facebook groups where your audience hangs out. Screenshot the top pain points.", sampleAnswer: "My target audience is 35-50 year old professionals who want side income but have no time. Their biggest pain point is overwhelm — they don't know where to start." },
  { day: 3, title: "Choose your niche", description: "Pick a profitable niche that aligns with your expertise.", proTip: "The best niches sit at the intersection of your knowledge, audience demand, and monetization potential.", sampleAnswer: "I chose 'AI & Side Hustles' because I have experience with automation tools, the audience is growing fast, and there are high-ticket affiliate products." },
  { day: 4, title: "Analyze top creators", description: "Study 5 successful creators in your niche for inspiration.", proTip: "Don't just watch their content — study their titles, hooks, and posting schedule.", actionLabel: "Generate 5 Script Hooks", actionRoute: "/auto-hooks", sampleAnswer: "Creator 1: @AIGuyChannel — posts 3x/week, uses numbered lists in titles. Creator 2: @PassiveIncomePro — strong emotional hooks, always asks a question first." },
  { day: 5, title: "Validate your niche", description: "Confirm demand with keyword research and trend analysis.", proTip: "Use Google Trends to compare your niche against alternatives. Rising > stable.", sampleAnswer: "Google Trends shows 'AI side hustle' searches up 340% in the last 12 months. YouTube search suggests 'make money with AI' has low competition with high volume." },
  { day: 6, title: "Set up your channel", description: "Create and optimize your channel profile and branding.", proTip: "Your bio should answer: What do you teach? Who is it for? Why should they follow?", sampleAnswer: "Channel name: 'The AI Income Lab.' Bio: 'I teach busy professionals how to build passive income streams using AI tools. New videos every Mon/Wed/Fri.'" },
  { day: 7, title: "Plan your content pillars", description: "Define 3-5 recurring content themes for consistency.", proTip: "Content pillars prevent creative burnout. Rotate between them each week.", sampleAnswer: "My 3 pillars: (1) AI Tool Tutorials, (2) Income Reports & Case Studies, (3) Mindset & Productivity for Creators." },
  { day: 8, title: "Record 60s intro video", description: "Film a short video for your Persona Clone AI training.", proTip: "Good lighting and clear audio matter more than a fancy camera. Use natural light near a window.", actionLabel: "Upload to Persona Clone", actionRoute: "/persona-clone", sampleAnswer: "Recorded a 65-second intro in my home office. Used ring light + lapel mic. Spoke naturally about who I am and what I teach." },
  { day: 9, title: "Generate Persona Clone", description: "Upload your video and create your digital twin.", proTip: "Your digital twin learns your speech patterns — speak naturally, don't read a script.", actionLabel: "Open Persona Clone", actionRoute: "/persona-clone", sampleAnswer: "Uploaded my video and the AI clone is processing. It captured my tone and speaking cadence really well in the preview." },
  { day: 10, title: "Create first AI script", description: "Use Auto-Hooks to generate your first viral script.", proTip: "The first 3 seconds decide if someone watches. Lead with a bold statement or question.", actionLabel: "Generate Script Hooks", actionRoute: "/auto-hooks", sampleAnswer: "Generated 3 hooks for my first video. Chose: 'Why I stopped trading time for money and let AI do it for me.' Full 90-second script ready." },
  { day: 11, title: "Pick Cinematic Vibes", description: "Select your signature B-roll aesthetic from the library.", proTip: "Consistent visual style builds brand recognition. Pick 2-3 moods and stick with them.", actionLabel: "Browse Vibe Library", actionRoute: "/cinematic-vibes", sampleAnswer: "Selected 'Neon Streets' and 'Cozy Coffee' as my two signature moods. They match my brand's modern-yet-warm feel." },
  { day: 12, title: "Assemble first video", description: "Combine your script, persona, and vibes into a full video.", proTip: "Don't aim for perfect — aim for published. You can always improve on the next one.", actionLabel: "Open Persona Clone", actionRoute: "/persona-clone", sampleAnswer: "Combined my AI clone narration with Neon Streets B-roll. Total runtime: 2:15. Added captions and a CTA at the end." },
  { day: 13, title: "Create 2 more scripts", description: "Build momentum with additional hook-driven scripts.", proTip: "Batch your scripting sessions. Write 3-5 scripts in one sitting while you're in the zone.", actionLabel: "Generate More Hooks", actionRoute: "/auto-hooks", sampleAnswer: "Wrote scripts for 'The one tool that replaced my 9-5' and '3 AI side hustles that actually pay.' Both under 2 minutes." },
  { day: 14, title: "Batch produce 3 videos", description: "Assemble your first mini-batch of content.", proTip: "Production batching saves 60% of your time vs. creating one video at a time.", actionLabel: "Open Cinematic Vibes", actionRoute: "/cinematic-vibes", sampleAnswer: "Produced 3 videos in one session: paired each script with B-roll and clone narration. Total time: 45 minutes." },
  { day: 15, title: "Schedule first 5 videos", description: "Queue up your first week of automated publishing.", proTip: "Post at the same time each day. Consistency trains the algorithm and your audience.", sampleAnswer: "Scheduled videos for Mon-Fri at 7 AM EST. Using YouTube Studio's scheduler. First video goes live tomorrow." },
  { day: 16, title: "Set up affiliate accounts", description: "Register with affiliate networks in your niche.", proTip: "Start with Amazon Associates and one niche-specific network. Don't spread too thin.", actionLabel: "Find Affiliate Products", actionRoute: "/affiliate-matchmaker", sampleAnswer: "Signed up for Amazon Associates and Impact.com. Applied to 3 AI tool affiliate programs: Jasper, Descript, and Pictory." },
  { day: 17, title: "Match affiliate products", description: "Use Affiliate Matchmaker to find perfect product fits.", proTip: "Only promote products you'd genuinely recommend. Trust is your most valuable asset.", actionLabel: "Open Affiliate Matchmaker", actionRoute: "/affiliate-matchmaker", sampleAnswer: "Matched 5 products: Jasper (30% recurring), Descript (15%), a digital course ($50/sale), a hosting plan (40%), and an AI art tool (25%)." },
  { day: 18, title: "Integrate affiliate links", description: "Add monetization links to your video descriptions.", proTip: "Place your highest-converting link in the first line of every description.", sampleAnswer: "Added affiliate links to all 5 scheduled videos. Top link is Jasper (highest commission). Created a Linktree for overflow links." },
  { day: 19, title: "Create a lead magnet", description: "Build a free resource to capture your audience's email.", proTip: "The best lead magnets solve one specific problem in under 5 minutes.", sampleAnswer: "Created a free PDF: '10 AI Tools That Pay You While You Sleep.' Added a download link to my channel's About section and video descriptions." },
  { day: 20, title: "Set up email funnel", description: "Create an automated welcome sequence for new subscribers.", proTip: "A 3-email welcome sequence converts 2x better than a single welcome email.", sampleAnswer: "Set up 3-email sequence in ConvertKit: (1) Welcome + free guide, (2) My story + best video, (3) Top affiliate product recommendation." },
  { day: 21, title: "Build content calendar", description: "Map out your next 30 days of content topics.", proTip: "Plan themes weekly, not daily. It gives you flexibility while maintaining structure.", sampleAnswer: "Planned 4 weeks: Week 1 = AI tutorials, Week 2 = income case studies, Week 3 = tool reviews, Week 4 = mindset content." },
  { day: 22, title: "Publish 10th video", description: "Hit the double-digit milestone with consistent output.", proTip: "Most creators quit before video 10. You're now in the top 20% — keep going.", sampleAnswer: "Published video #10! Total views across all videos: 2,400. Best performer: 'The one tool that replaced my 9-5' with 890 views." },
  { day: 23, title: "Engage with comments", description: "Respond to viewers and build community connection.", proTip: "Reply within the first hour of posting. Early engagement signals boost algorithmic reach.", sampleAnswer: "Replied to 15 comments across my videos. Pinned the most engaging question as a conversation starter. Got 3 new subscribers from comment interactions." },
  { day: 24, title: "Optimize thumbnails", description: "A/B test thumbnail styles for higher click-through rates.", proTip: "Faces with emotion, bold text, and high contrast colors win the click every time.", sampleAnswer: "Redesigned thumbnails for my top 3 videos. Used bold yellow text, zoomed-in expressions, and dark backgrounds. CTR improved from 3.2% to 5.8%." },
  { day: 25, title: "Review analytics", description: "Analyze what's working and double down on winners.", proTip: "Focus on average view duration, not total views. Retention is the real growth metric.", sampleAnswer: "Top insight: Videos under 2 minutes have 65% retention vs. 40% for longer ones. Action: keep all future videos under 2:30." },
  { day: 26, title: "Collaborate or cross-post", description: "Reach new audiences through partnerships or repurposing.", proTip: "Repurpose your best-performing long video into 3-5 shorts for different platforms.", sampleAnswer: "Chopped my top video into 3 TikTok/Shorts clips. Posted on Instagram Reels and TikTok. Reached 1,200 new viewers in 24 hours." },
  { day: 27, title: "Create a viral short", description: "Produce a 60-second clip designed for maximum shares.", proTip: "Shorts that teach one thing in under 60 seconds get shared 3x more than entertainment clips.", actionLabel: "Generate Short Script", actionRoute: "/auto-hooks", sampleAnswer: "Created a 45-second short: 'This AI tool writes your scripts AND films your videos.' Used fast cuts, captions, and a strong CTA. Got 500 views in 6 hours." },
  { day: 28, title: "Refine your workflow", description: "Streamline your creation process for speed and quality.", proTip: "Document your process step-by-step. A repeatable system is worth more than any single video.", sampleAnswer: "My optimized workflow: (1) Generate hooks — 10 min, (2) Write script — 15 min, (3) Clone narration — 5 min, (4) Add B-roll — 10 min. Total: 40 min/video." },
  { day: 29, title: "Set monthly revenue goal", description: "Based on data, set a realistic income target.", proTip: "Use the formula: (daily views × CTR × conversion rate × avg commission) = projected monthly revenue.", sampleAnswer: "Projecting: 500 daily views × 5% CTR × 2% conversion × $15 avg commission = $225/month. Goal: hit $500/month by month 3 through increased volume." },
  { day: 30, title: "Channel fully launched! 🎉", description: "Celebrate — your automated content engine is live.", proTip: "You did it. Now the real game begins: optimize, scale, and let your digital twin work for you.", sampleAnswer: "30 days complete! 15 videos published, 4,200 total views, 180 subscribers, $47 in affiliate earnings. The engine is running — time to scale." },
];

/** Returns which extra fields a day should show */
export function getDayFields(day: number): string[] {
  if (day >= 4 && day <= 10) return ["content_pillars", "script_drafts"];
  if (day >= 11 && day <= 20) return []; // action buttons only
  if (day >= 21 && day <= 30) return ["affiliate_links", "social_handles"];
  return [];
}

export const fieldLabels: Record<string, string> = {
  content_pillars: "Content Pillar Ideas",
  script_drafts: "Script Drafts",
  affiliate_links: "Affiliate Links",
  social_handles: "Social Media Handles",
};
