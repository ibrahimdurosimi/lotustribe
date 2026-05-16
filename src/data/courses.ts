export interface Lesson {
  id: string;
  title: string;
  readTime: string;
  content: string;
}

export interface QuizQuestion {
  question: string;
  options: { text: string; isCorrect: boolean }[];
}

export interface Course {
  id: string;
  module: string;
  title: string;
  badgeIcon: string;
  badgeName: string;
  xp: number;
  level: string;
  color: string;
  accent: string;
  lessons: Lesson[];
  quiz: QuizQuestion[];
}

export const coursesData: Course[] = [
  {
    id: "your-money-glow-up",
    module: "MODULE 0: THE WAKE UP (Mindset & Ethics)",
    title: "Your Money Glow Up",
    badgeIcon: "🌱",
    badgeName: "Seedling",
    xp: 100,
    level: "Beginner",
    color: "bg-green-100",
    accent: "bg-green-500",
    lessons: [
      {
        id: "lesson-1-1",
        title: "Why 'Rich' is boring. 'Wealthy' is freedom.",
        readTime: "2 minutes",
        content: `
          <p>Let’s get real.</p>
          <p>When you hear “rich,” what comes to mind? A dude in a rented Lamborghini, a massive mortgage he can’t really afford, designer clothes bought on credit, and $47 in his checking account. That’s rich. It looks cool on Instagram for 15 seconds. Then the repo man shows up.</p>
          <h3 class="font-display font-bold text-xl mt-6 mb-2">Wealthy is different.</h3>
          <p>Wealthy means you wake up on a Tuesday at 10 AM because you choose to – not because your boss will fire you if you’re late. Wealthy means your car is reliable (not flashy), your rent is covered for 6 months even if you quit your job, and you can help a friend in need without checking your balance first.</p>
          <p class="font-bold mt-4">For Gen Z: Wealthy = the ability to say “no.”</p>
          <ul class="list-disc pl-5 mt-2 space-y-1">
            <li>No to a job you hate.</li>
            <li>No to a toxic relationship.</li>
            <li>No to buying junk you don’t need.</li>
            <li>No to a social event you don’t want to attend.</li>
          </ul>
          <div class="bg-gray-100 p-4 rounded-xl mt-6 neo-border border-gray-300">
            <p class="font-bold text-center">Rich buys stuff. Wealthy buys time.</p>
          </div>
          <p class="mt-6">Think about it. The richest person in the world could buy 100 yachts. But they still have only 24 hours in a day. Wealth buys you the freedom to choose how to spend those hours.</p>
        `
      },
      {
        id: "lesson-1-2",
        title: "The 3-Bucket Principle",
        readTime: "3 minutes",
        content: `
          <p>Most people only have one bucket: Spend. Money comes in from your paycheck, side hustle, or parents. Then it goes right back out to Uber Eats, Spotify, Netflix, Shein, and late-night Amazon impulse buys. Poof. Gone.</p>
          <p class="mt-2 text-lg font-bold">The 3-Bucket Principle is your new operating system. It’s simple. It’s boring. It works.</p>

          <h3 class="font-display font-bold text-xl mt-6 mb-2">Bucket 1 – Spend (50% of your income)</h3>
          <p>This is for living. Rent, groceries, phone bill, gas or transit, your daily latte, a movie ticket, a new hoodie. No guilt. You need to live. This bucket keeps you sane and happy.</p>

          <h3 class="font-display font-bold text-xl mt-6 mb-2">Bucket 2 – Save (20% of your income)</h3>
          <p>This money does not move. It sits in a high-yield savings account (not your regular checking account – go open one today if you don’t have it). This is for emergencies only: your laptop breaks, you get sick and can’t work, your car needs a sudden repair, you need a last-minute flight home.</p>
          <p class="font-bold mt-2 text-red-500">Never invest this money. Never spend this on a sale or a trip. This is your safety net.</p>

          <h3 class="font-display font-bold text-xl mt-6 mb-2">Bucket 3 – Invest (30% of your income)</h3>
          <p>This is your future freedom fund. This money buys assets: stocks, ETFs, crypto (just a small slice), REITs. This money works while you sleep. It grows. It compounds. It gets you to the “wake up at 10 AM on a Tuesday” life.</p>

          <div class="bg-blue-50 border-l-4 border-blue-500 p-4 mt-6 font-medium text-blue-900 rounded-r-xl">
            <strong>Gen Z reality check:</strong> If you’re living with parents or have very low rent, you can flip the script. Try 40% invest, 30% save, 30% spend. That’s a superpower. Use it while you have low expenses.
          </div>
        `
      },
      {
         id: "lesson-1-3",
         title: "Inflation is a silent thief",
         readTime: "2 minutes",
         content: `
           <p>Remember when a slice of pizza was $2? Now it’s $4. A pack of gum was $0.50? Now it’s $1.25. A video game was $50? Now new releases are $70.</p>
           <p class="mt-2">That’s not the pizza getting fancy or the game having better graphics (well, maybe a little). That’s inflation.</p>
           
           <h3 class="font-display font-bold text-xl mt-6 mb-2">What is inflation?</h3>
           <p>Inflation means your money buys less stuff over time. On average, prices go up about 2–3% per year. Sometimes much more – like in 2022 when inflation hit 9%. Your rent, food, gas, everything got more expensive.</p>

           <h3 class="font-display font-bold text-xl mt-6 mb-2">Why it’s a thief:</h3>
           <p>If you leave $1,000 under your mattress for 10 years, you still have $1,000. But a $1,000 pizza in 2014 would cost about $1,340 in 2024. You lost $340 of pizza-buying power without spending a cent. That’s theft without a mask.</p>

           <div class="bg-gray-100 p-4 rounded-xl mt-6 neo-border border-gray-300">
             <p class="font-bold text-center">The only way to beat inflation: Make your money grow faster than inflation.</p>
           </div>
         `
      },
      {
         id: "lesson-1-4",
         title: "The Lotus Manifesto (ESG 101)",
         readTime: "3 minutes",
         content: `
            <p class="text-xl font-bold">You don’t have to be a villain to make money.</p>
            <p class="mt-2">For decades, the lie was: “To get rich, you have to invest in oil companies, tobacco, weapons manufacturers, and sweatshops. That’s just how the world works.”</p>
            <p class="font-bold mt-2 text-red-500">That’s dead. Buried. Gone.</p>

            <h3 class="font-display font-bold text-xl mt-6 mb-2">ESG stands for Environmental, Social, Governance.</h3>
            <p>It’s a rating system for companies. Think of it as a “human decency score.”</p>
            
            <ul class="list-disc pl-5 mt-4 space-y-2">
              <li><strong>E = Environmental:</strong> Does the company pollute? Do they use renewable energy?</li>
              <li><strong>S = Social:</strong> Do they treat workers fairly? Pay a living wage? Have diversity?</li>
              <li><strong>G = Governance:</strong> Is leadership honest? No scandals? Transparent accounting?</li>
            </ul>

            <h3 class="font-display font-bold text-xl mt-6 mb-2">The Lotus Promise:</h3>
            <p>On Lotus Tribe, you will never be forced to invest in something you hate. Every stock, every ETF has a “Vibe Check” badge:</p>
            <ul class="mt-4 space-y-2 font-bold">
              <li>🌿 Green = High ESG score. Generally good actors.</li>
              <li>⚖️ Yellow = Mixed. Some good, some bad. You decide.</li>
              <li>⛔ Red = Controversial industries (oil, tobacco, weapons).</li>
            </ul>
            <p class="mt-4 italic">"But does ethical investing make less money?"</p>
            <p>Actually, no. Many studies show that high-ESG companies perform better over 10+ years. They take fewer legal risks, have happier employees, and adapt faster to new regulations.</p>
         `
      }
    ],
    quiz: [
      {
        question: "What’s the difference between “rich” and “wealthy” according to Lesson 1.1?",
        options: [
          { text: "Rich has more money", isCorrect: false },
          { text: "Wealthy buys time and freedom", isCorrect: true },
          { text: "They are the same thing", isCorrect: false }
        ]
      },
      {
        question: "What are the three buckets?",
        options: [
          { text: "Spend, Save, Gamble", isCorrect: false },
          { text: "Spend, Save, Invest", isCorrect: true },
          { text: "Rent, Food, Fun", isCorrect: false }
        ]
      },
      {
        question: "What is inflation?",
        options: [
          { text: "Prices going down over time", isCorrect: false },
          { text: "Your money buying less over time", isCorrect: true },
          { text: "A type of investment", isCorrect: false }
        ]
      },
      {
        question: "What does ESG stand for?",
        options: [
          { text: "Easy Stock Gains", isCorrect: false },
          { text: "Environmental, Social, Governance", isCorrect: true },
          { text: "Earn Save Grow", isCorrect: false }
        ]
      }
    ]
  },
  {
    id: "know-your-vibe",
    module: "MODULE 0: THE WAKE UP",
    title: "Know Your Vibe",
    badgeIcon: "🧠",
    badgeName: "Self-Aware",
    xp: 150,
    level: "Beginner",
    color: "bg-purple-100",
    accent: "bg-purple-500",
    lessons: [
       {
          id: "lesson-2-1",
          title: "The 4 Investor Animals",
          readTime: "3 minutes",
          content: `
            <p>You wouldn’t wear hiking boots to a beach party. Same with investing. Your personality decides your best strategy.</p>
            <div class="mt-6 space-y-6">
              <div>
                <h4 class="font-bold text-lg">🐺 The Hustler</h4>
                <p><strong>Risk appetite:</strong> High</p>
                <p><strong>Mood:</strong> “YOLO. I want 10x or nothing.”</p>
              </div>
              <div>
                <h4 class="font-bold text-lg">🦥 The Guardian</h4>
                <p><strong>Risk appetite:</strong> Low</p>
                <p><strong>Mood:</strong> “I just don’t want to lose money. Ever.”</p>
              </div>
              <div>
                <h4 class="font-bold text-lg">🌙 The Dreamer</h4>
                <p><strong>Risk appetite:</strong> Medium</p>
                <p><strong>Mood:</strong> “I want to save the planet AND make money.”</p>
              </div>
              <div>
                <h4 class="font-bold text-lg">🔬 The Scientist</h4>
                <p><strong>Risk appetite:</strong> Calculated</p>
                <p><strong>Mood:</strong> “Show me the data, spreadsheet, and 10-year chart.”</p>
              </div>
            </div>
          `
       },
       {
          id: "lesson-2-2",
          title: "Risk vs. Volatility",
          readTime: "2 minutes",
          content: `
            <p class="font-bold text-lg">This is the single most misunderstood idea in investing.</p>
            <p class="mt-4"><strong>Risk = permanent loss of money.</strong></p>
            <p>Example: You buy a meme coin. The founders disappear with all the money. Your investment is gone forever. That’s risk.</p>
            <p class="mt-4"><strong>Volatility = temporary ups and downs.</strong></p>
            <p>Example: You buy Apple stock at $180. Next month it drops to $150 because the market is down. Six months later it goes to $200. You didn’t lose anything if you didn’t sell.</p>
            <div class="bg-red-50 border-l-4 border-red-500 p-4 mt-6 font-medium text-red-900 rounded-r-xl">
              Volatility is a rollercoaster. Risk is the rollercoaster falling off the tracks.
            </div>
          `
       }
    ],
    quiz: [
       {
          question: "What is the difference between risk and volatility?",
          options: [
             { text: "They are the same thing", isCorrect: false },
             { text: "Risk is permanent loss, volatility is temporary ups and downs", isCorrect: true },
             { text: "Volatility is permanent, risk is temporary", isCorrect: false }
          ]
       }
    ]
  },
  {
    id: "stocks-are-not-scary",
    module: "MODULE 1: THE ARSENAL",
    title: "Stocks Are Not Scary",
    badgeIcon: "📈",
    badgeName: "Tiny Owner",
    xp: 200,
    level: "Intermediate",
    color: "bg-blue-100",
    accent: "bg-blue-500",
    lessons: [
       {
          id: "lesson-3-1",
          title: "What is a stock?",
          readTime: "2.5 minutes",
          content: `
             <p>Imagine your favorite coffee shop needs money to open a second location. They say: “Give us $1,000, and we’ll give you 1% of the company.”</p>
             <p class="mt-4 font-bold text-xl">That’s a stock. You are now a part-owner.</p>
             <p>When you buy one share of Apple, you own a microscopic slice of the iPhone factory, the App Store, the brand, and the copyrights. You are an actual owner.</p>
          `
       },
       {
          id: "lesson-3-2",
          title: "Dividends – Getting paid to do nothing",
          readTime: "2 minutes",
          content: `
             <p>Some companies don’t reinvest all their profit back into the business. They send a chunk of it directly to you, the owner. That’s a dividend.</p>
             <p class="mt-4">If you reinvest dividends, you buy more shares. Those new shares also pay dividends. Over decades, this snowballs into significant passive income.</p>
          `
       }
    ],
    quiz: [
       {
          question: "What is a stock?",
          options: [
             { text: "A loan to a company", isCorrect: false },
             { text: "Ownership in a company", isCorrect: true },
             { text: "A type of savings account", isCorrect: false }
          ]
       },
       {
          question: "What is a fractional share?",
          options: [
             { text: "A damaged share", isCorrect: false },
             { text: "A slice of a share", isCorrect: true },
             { text: "A share in a fractional company", isCorrect: false }
          ]
       }
    ]
  }
];
