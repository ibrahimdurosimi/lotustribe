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
  },
  {
    id: "etfs-lazy-genius",
    module: "MODULE 1: THE ARSENAL",
    title: "ETFs – The Lazy Genius Move",
    badgeIcon: "⚡",
    badgeName: "Lazy Genius",
    xp: 200,
    level: "Intermediate",
    color: "bg-yellow-100",
    accent: "bg-yellow-500",
    lessons: [
       {
          id: "lesson-4-1",
          title: "ETF vs. Mutual Fund (The coffee shop analogy)",
          readTime: "2 minutes",
          content: `
            <p>ETF (Exchange Traded Fund) and Mutual Fund both hold baskets of stocks. But they work differently.</p>
            <h3 class="font-display font-bold text-xl mt-6 mb-2">The coffee shop analogy:</h3>
            <ul class="list-disc pl-5 mt-2 space-y-2">
              <li><strong>Mutual Fund</strong> = You give the barista $100 and say “make me a coffee.” At the end of the day, the barista tells you what blend you got. You can only buy or sell once per day.</li>
              <li><strong>ETF</strong> = You walk in, see the price on a screen, and buy a cup instantly. You can trade it anytime during market hours.</li>
            </ul>
            <p class="mt-4"><strong>Key differences:</strong> ETFs trade during the day, have lower fees (0.03–0.10%), and lower minimum investments compared to Mutual Funds.</p>
          `
       },
       {
          id: "lesson-4-2",
          title: "Thematic ETFs – Invest in your interests",
          readTime: "2 minutes",
          content: `
            <p>Don’t just invest in “the market.” Invest in things you actually care about.</p>
            <p class="mt-2">Thematic ETFs focus on specific trends or industries. Examples:</p>
            <ul class="list-disc pl-5 mt-2 space-y-1">
              <li>Clean energy: ICLN, QCLN</li>
              <li>Robotics & AI: ARKQ, ROBT</li>
              <li>Video games & esports: ESPO, NERD</li>
            </ul>
            <div class="bg-yellow-50 border-l-4 border-yellow-500 p-4 mt-6 font-medium text-yellow-900 rounded-r-xl">
              <strong>The Lotus rule for thematic ETFs:</strong> Keep them to no more than 20% of your total portfolio. The other 80% should be broad index funds.
            </div>
          `
       },
       {
          id: "lesson-4-3",
          title: "The 3-Fund Portfolio (Set & forget)",
          readTime: "2.5 minutes",
          content: `
            <p>This is the only portfolio most people will ever need. It was popularized by Jack Bogle and r/Bogleheads.</p>
            <h3 class="font-display font-bold text-xl mt-6 mb-2">The 3 funds:</h3>
            <ul class="list-decimal pl-5 mt-2 space-y-2">
              <li><strong>Total US stock market (e.g., VTI)</strong> – owns every US company.</li>
              <li><strong>Total international stock market (e.g., VXUS)</strong> – owns every non-US company.</li>
              <li><strong>Total US bond market (e.g., BND)</strong> – owns government and corporate bonds.</li>
            </ul>
            <p class="mt-4 font-bold">Why this works:</p>
            <p>You own the entire world’s economy. You never need to pick stocks. Historically 7–9% average returns with less volatility.</p>
          `
       }
    ],
    quiz: []
  },
  {
    id: "crypto-web3-reality",
    module: "MODULE 1: THE ARSENAL",
    title: "Crypto & Web3 (The Reality Check)",
    badgeIcon: "🔗",
    badgeName: "Chain Scholar",
    xp: 250,
    level: "Advanced",
    color: "bg-gray-100",
    accent: "bg-gray-500",
    lessons: [
       {
          id: "lesson-5-1",
          title: "Bitcoin vs. Ethereum",
          readTime: "2.5 minutes",
          content: `
            <p>Crypto is confusing. Let’s simplify.</p>
            <h3 class="font-display font-bold text-xl mt-6 mb-2">Bitcoin (BTC) – Digital gold.</h3>
            <p>Only 21 million will ever exist. Purpose: Store of value, hedge against inflation. Slow, but very secure.</p>
            <h3 class="font-display font-bold text-xl mt-6 mb-2">Ethereum (ETH) – Digital computer.</h3>
            <p>Purpose: Run decentralized apps (DeFi, NFTs, games). Faster than Bitcoin, but has fees (gas).</p>
            <div class="bg-gray-100 p-4 rounded-xl mt-6 neo-border border-gray-300">
              <p class="font-bold text-center">Gen Z analogy: Bitcoin is a savings account no government can touch. Ethereum is a smartphone where the value is in the apps.</p>
            </div>
          `
       },
       {
          id: "lesson-5-2",
          title: "Staking, gas fees, and wallets",
          readTime: "2 minutes",
          content: `
            <p><strong>Crypto wallet</strong> – Your digital address. You have a public address (for receiving) and a private key (for sending). Never share your private key.</p>
            <p class="mt-4"><strong>Gas fees</strong> – Transaction fees paid to miners/validators. On Ethereum, they can be high when busy.</p>
            <p class="mt-4"><strong>Staking</strong> – “Locking up” your crypto to help secure the network. In return, you earn rewards (like interest).</p>
          `
       },
       {
          id: "lesson-5-3",
          title: "The “Degen” trap – Meme coins and rug pulls",
          readTime: "2.5 minutes",
          content: `
            <p><strong>Meme coins</strong> – Coins with no purpose other than hype and community. They can go up 1000% or down 99%.</p>
            <p class="mt-4"><strong>Rug pull</strong> – A scam where the creators sell all their holdings, crashing the price to zero, and disappear.</p>
            <div class="bg-red-50 border-l-4 border-red-500 p-4 mt-6 font-medium text-red-900 rounded-r-xl">
              <strong>The Lotus rule for crypto:</strong> Maximum 5–10% of your total portfolio in crypto. Never invest money you need next year.
            </div>
          `
       },
       {
          id: "lesson-5-4",
          title: "Regulation is coming",
          readTime: "1.5 minutes",
          content: `
            <p>For years, crypto was the Wild West. Now regulators are stepping in.</p>
            <p class="mt-2">Why this is good for you: Fewer scams, more trustworthy exchanges, and potential for ETFs. The era of “get rich overnight with any random coin” is ending. Treat crypto as a small, speculative part of your portfolio.</p>
          `
       }
    ],
    quiz: []
  },
  {
    id: "boring-secret",
    module: "MODULE 2: THE STRATEGY",
    title: "The Boring Secret (Compound Interest)",
    badgeIcon: "🧮",
    badgeName: "Math Wizard",
    xp: 200,
    level: "Intermediate",
    color: "bg-blue-200",
    accent: "bg-blue-600",
    lessons: [
       {
          id: "lesson-6-1",
          title: "The Rule of 72",
          readTime: "1.5 minutes",
          content: `
            <p>Want to know how many years it takes to double your money? Use the Rule of 72.</p>
            <p class="mt-4 font-bold text-xl">Formula: 72 ÷ Annual Return = Years to double</p>
            <ul class="list-disc pl-5 mt-4 space-y-2">
              <li>10% return (S&P 500 historical) → 72 ÷ 10 = 7.2 years to double.</li>
              <li>7% return (conservative stocks) → 72 ÷ 7 = about 10 years to double.</li>
            </ul>
            <p class="mt-4">If you invest $10,000 at 10%, in 7.2 years you have $20,000. In 14 years, $40,000. That’s the power of doubling.</p>
          `
       },
       {
          id: "lesson-6-2",
          title: "Time travel – Age 20 vs. Age 30",
          readTime: "2 minutes",
          content: `
            <p class="font-bold">This is the most important graph in investing. Visualize it in your head.</p>
            <p class="mt-4">Alex starts at 20: Invests $100/month until age 65. Total invested: $54,000.</p>
            <p>Jordan starts at 30: Invests $200/month until age 65. Total invested: $84,000.</p>
            <p class="mt-4 font-bold text-xl">Who ends with more? Alex. By a lot.</p>
            <p class="mt-2">Alex ends up with ~$380,000, while Jordan ends up with ~$330,000 (at 7% return). Alex invested less money but started earlier. Time did the work.</p>
          `
       },
       {
          id: "lesson-6-3",
          title: "Dollar Cost Averaging",
          readTime: "2 minutes",
          content: `
            <p><strong>Dollar Cost Averaging (DCA)</strong> = Investing the same amount of money at regular intervals, regardless of price.</p>
            <p class="mt-4">You automatically buy more when prices are low and less when prices are high. No stress. You don’t have to guess the bottom.</p>
            <p class="mt-4">Set up an automatic weekly transfer from your bank. Start with $10 or $20. The amount doesn’t matter. The consistency does.</p>
          `
       }
    ],
    quiz: []
  },
  {
    id: "risk-management",
    module: "MODULE 2: THE STRATEGY",
    title: "Risk Management (Don't Lose Your Lunch Money)",
    badgeIcon: "🛡️",
    badgeName: "Shield Bearer",
    xp: 200,
    level: "Intermediate",
    color: "bg-red-100",
    accent: "bg-red-500",
    lessons: [
       {
          id: "lesson-7-1",
          title: "Diversification – Not all eggs in one basket",
          readTime: "2 minutes",
          content: `
            <p>You’ve heard “don’t put all your eggs in one basket.” That’s diversification.</p>
            <h3 class="font-display font-bold text-xl mt-6 mb-2">Levels of diversification:</h3>
            <ul class="list-decimal pl-5 mt-2 space-y-2">
              <li><strong>Across companies:</strong> Don’t own just Tesla. Own 500 companies (index fund).</li>
              <li><strong>Across sectors:</strong> Don’t own only tech. Own healthcare, consumer goods, energy, finance.</li>
              <li><strong>Across countries:</strong> The US does well, but sometimes international outperforms. Own VXUS.</li>
              <li><strong>Across asset classes:</strong> Stocks + bonds + real estate (REITs) + maybe a little crypto.</li>
            </ul>
            <p class="mt-4 font-bold">Why it works:</p>
            <p>When one part of your portfolio goes down, another might go up. Or at least not go down as much.</p>
          `
       },
       {
          id: "lesson-7-2",
          title: "Emergency funds first (Boring but sexy for survival)",
          readTime: "2 minutes",
          content: `
            <p>Before you invest aggressively, build an emergency fund.</p>
            <h3 class="font-display font-bold text-xl mt-6 mb-2">What is it?</h3>
            <p>Cash in a high-yield savings account (not invested) that covers 3–6 months of your basic living expenses.</p>
            <p class="mt-4 font-bold">Why before investing?</p>
            <p>If you lose your job or have a medical emergency and all your money is in stocks, you might be forced to sell when the market is down. That turns a temporary dip into a permanent loss.</p>
            <div class="bg-red-50 border-l-4 border-red-500 p-4 mt-6 font-medium text-red-900 rounded-r-xl">
              <strong>Not in:</strong> Stocks, crypto, ETFs, collectibles. Only in High-yield savings, Money market funds, or Short-term Treasury bills.
            </div>
          `
       },
       {
          id: "lesson-7-3",
          title: "Hedging – Protecting your downside",
          readTime: "2 minutes",
          content: `
            <p>Hedging is like buying insurance for your portfolio. You pay a little to protect against a big loss.</p>
            <h3 class="font-display font-bold text-xl mt-6 mb-2">Simple hedges for beginners:</h3>
            <ul class="list-disc pl-5 mt-2 space-y-2">
              <li><strong>Bonds:</strong> When stocks crash, bonds often stay steady or go up.</li>
              <li><strong>Gold:</strong> Historically holds value during crises.</li>
              <li><strong>Cash:</strong> Keeping 5–10% in cash lets you buy the dip without selling anything.</li>
            </ul>
            <p class="mt-4"><strong>The Lotus way:</strong> Hold some bonds (age-based). Keep an emergency fund in cash. Don’t use inverse ETFs until you’ve invested for 2+ years.</p>
          `
       }
    ],
    quiz: []
  },
  {
    id: "ethical-impact-investing",
    module: "MODULE 2: THE STRATEGY",
    title: "Ethical & Impact Investing (Lotus Core)",
    badgeIcon: "🌍",
    badgeName: "Earth Keeper",
    xp: 300,
    level: "Advanced",
    color: "bg-teal-100",
    accent: "bg-teal-500",
    lessons: [
       {
          id: "lesson-8-1",
          title: "ESG Scores – Rating a company's soul",
          readTime: "2 minutes",
          content: `
            <p>ESG scores are like credit scores for ethics. They range from 0 to 100, or AAA to D.</p>
            <ul class="list-disc pl-5 mt-4 space-y-2">
              <li><strong>Environmental (E):</strong> Carbon emissions, water usage, waste management, renewable energy.</li>
              <li><strong>Social (S):</strong> Employee treatment, diversity & inclusion, human rights, community relations.</li>
              <li><strong>Governance (G):</strong> Executive pay, board independence, shareholder rights, anti-corruption.</li>
            </ul>
            <p class="mt-4"><strong>How to read a score:</strong> AAA (or 80+) – Leader. D – High risk, controversies.</p>
          `
       },
       {
          id: "lesson-8-2",
          title: "Greenwashing – How to spot fake eco-brands",
          readTime: "2.5 minutes",
          content: `
            <p>Greenwashing = marketing that makes a company look environmentally friendly when it’s not.</p>
            <h3 class="font-display font-bold text-xl mt-6 mb-2">How to spot greenwashing:</h3>
            <ul class="list-decimal pl-5 mt-2 space-y-2">
              <li><strong>Look for specifics:</strong> “We reduced emissions by 30%” is good. “We care about the planet” is empty.</li>
              <li><strong>Check for third-party certifications:</strong> B Corp, Fair Trade, Energy Star. These are verified.</li>
              <li><strong>See if they mention ESG score:</strong> Companies proud of their ESG will show it.</li>
              <li><strong>Ask:</strong> Is this their core business or a side project?</li>
            </ul>
          `
       },
       {
          id: "lesson-8-3",
          title: "Shareholder activism",
          readTime: "2 minutes",
          content: `
            <p>When you own a stock, you are a part-owner. Owners get to vote on important issues.</p>
            <h3 class="font-display font-bold text-xl mt-6 mb-2">What you can vote on:</h3>
            <ul class="list-disc pl-5 mt-2 space-y-2">
              <li>Board of directors (who runs the company)</li>
              <li>Executive pay packages</li>
              <li>Environmental and Social proposals</li>
            </ul>
            <p class="mt-4">When thousands of small shareholders vote together, companies listen. Each share = one vote.</p>
          `
       },
       {
          id: "lesson-8-4",
          title: "Community spotlight – A real Green portfolio",
          readTime: "2 minutes",
          content: `
            <p>Here’s a sample Green Lotus Portfolio built by a real Gen Z user:</p>
            <ul class="list-disc pl-5 mt-4 space-y-2">
              <li><strong>30%:</strong> iShares Global Clean Energy ETF (ICLN)</li>
              <li><strong>30%:</strong> Vanguard ESG US Stock ETF (ESGV)</li>
              <li><strong>20%:</strong> Vanguard ESG International Stock ETF (VSGX)</li>
              <li><strong>10%:</strong> Calvert Green Bond Fund (CGAFX)</li>
              <li><strong>10%:</strong> iShares Global Water ETF (CGW)</li>
            </ul>
            <p class="mt-4"><strong>Your choice:</strong> You can pursue maximum returns, or you can accept slightly lower returns for impact. Lotus Tribe shows you the trade-off.</p>
          `
       }
    ],
    quiz: []
  },
  {
    id: "bear-market-survival",
    module: "MODULE 2: THE STRATEGY",
    title: "Recession & Bear Market Survival",
    badgeIcon: "🐻",
    badgeName: "Bear Tamer",
    xp: 250,
    level: "Advanced",
    color: "bg-orange-100",
    accent: "bg-orange-500",
    lessons: [
       {
          id: "lesson-9-1",
          title: "What is a bear market?",
          readTime: "2 minutes",
          content: `
            <p><strong>Bear market</strong> = When stock prices drop 20% or more from recent highs, usually over months.</p>
            <p class="mt-2"><strong>Bull market</strong> = When prices rise.</p>
            <p class="mt-4"><strong>The secret:</strong> Bear markets are the best time to buy – if you have cash and courage. Everything is on sale.</p>
            <p class="mt-2">Since 1926, the S&P 500 has had 26 bear markets. After every single one, it eventually reached new highs. Average recovery time: about 2 years.</p>
          `
       },
       {
          id: "lesson-9-2",
          title: "Historical crashes",
          readTime: "2 minutes",
          content: `
            <p>Let’s travel through panic history:</p>
            <ul class="list-disc pl-5 mt-4 space-y-2">
              <li><strong>Dot-com bubble (2000):</strong> -49%, took 7 years to recover.</li>
              <li><strong>Financial crisis (2008):</strong> -57%, took 5.5 years to recover.</li>
              <li><strong>COVID crash (2020):</strong> -34%, took 6 months to recover.</li>
              <li><strong>2022 bear market:</strong> -25%, took 1.5 years to recover.</li>
            </ul>
            <p class="mt-4 font-bold">The key insight:</p>
            <p>If you sold at the bottom of any crash, you locked in losses. If you held or bought more, you made money on the other side. A crash at age 22 is a sale. A crash at age 62 is a problem.</p>
          `
       },
       {
          id: "lesson-9-3",
          title: "The psychology of panic selling",
          readTime: "2 minutes",
          content: `
            <p>Panic selling is the most predictable NPC (Non-Player Character) move.</p>
            <h3 class="font-display font-bold text-xl mt-6 mb-2">Why we panic sell:</h3>
            <ul class="list-disc pl-5 mt-2 space-y-2">
              <li><strong>Loss aversion:</strong> Losing $100 hurts twice as much as gaining $100 feels good.</li>
              <li><strong>Herd mentality:</strong> “Everyone is selling, so should I.”</li>
              <li><strong>News overload:</strong> Headlines designed to scare you.</li>
            </ul>
            <div class="bg-orange-50 border-l-4 border-orange-500 p-4 mt-6 font-medium text-orange-900 rounded-r-xl">
              <strong>The mantra:</strong> “Bear markets are not losses unless I sell. I am not an NPC.”
            </div>
            <p class="mt-4">Stop looking. Check your portfolio once a month, not once an hour. Keep cash to buy the dip.</p>
          `
       }
    ],
    quiz: []
  },
  {
    id: "real-estate-renters",
    module: "MODULE 3: ADVANCED MOVES",
    title: "Real Estate for Renters",
    badgeIcon: "🏢",
    badgeName: "Virtual Landlord",
    xp: 200,
    level: "Intermediate",
    color: "bg-blue-100",
    accent: "bg-blue-500",
    lessons: [
       {
          id: "lesson-10-1",
          title: "REITs – Buying a mall for $50",
          readTime: "2 minutes",
          content: `
            <p><strong>REIT</strong> = Real Estate Investment Trust. A company that owns income-producing real estate.</p>
            <p class="mt-4"><strong>How they work:</strong> REITs are required by law to pay at least 90% of their taxable income as dividends. That means high dividend yields (typically 3–8%).</p>
            <ul class="list-disc pl-5 mt-4 space-y-2">
              <li>Residential (Apartment buildings)</li>
              <li>Industrial (Warehouses)</li>
              <li>Retail (Shopping malls)</li>
              <li>Data centers (Server farms)</li>
            </ul>
            <p class="mt-4 font-bold">Why REITs for Gen Z: You don’t need $50,000 for a down payment. You get monthly or quarterly dividends. You can start with $10.</p>
          `
       },
       {
          id: "lesson-10-2",
          title: "Crowdfunding real estate",
          readTime: "2 minutes",
          content: `
            <p><strong>Real estate crowdfunding</strong> = Many people pool small amounts of money to buy a specific property.</p>
            <p class="mt-4"><strong>Pros:</strong> Direct ownership, potential for higher returns. <strong>Cons:</strong> Illiquid (money locked for years), higher fees.</p>
            <div class="bg-blue-50 border-l-4 border-blue-500 p-4 mt-6 font-medium text-blue-900 rounded-r-xl">
              <strong>The Lotus recommendation:</strong> Start with REIT ETFs before trying crowdfunding.
            </div>
          `
       },
       {
          id: "lesson-10-3",
          title: "Digital land (Metaverse risks)",
          readTime: "1.5 minutes",
          content: `
            <p><strong>Digital land</strong> = Virtual plots in metaverse platforms like Decentraland.</p>
            <p class="mt-4"><strong>Why it’s risky:</strong> No intrinsic value. No rent, no utility beyond speculation. Platforms may die. Extremely illiquid.</p>
            <p class="mt-4 font-bold text-red-600">The Lotus verdict: Digital land is not investing. It’s gambling.</p>
          `
       }
    ],
    quiz: []
  },
  {
    id: "alternative-assets",
    module: "MODULE 3: ADVANCED MOVES",
    title: "Alternative Assets (Collectibles)",
    badgeIcon: "🖼️",
    badgeName: "Culture Investor",
    xp: 200,
    level: "Advanced",
    color: "bg-purple-100",
    accent: "bg-purple-500",
    lessons: [
       {
          id: "lesson-11-1",
          title: "Art & Trading cards (Fractional ownership)",
          readTime: "2 minutes",
          content: `
            <p><strong>Fractional ownership platforms</strong> allow you to buy shares of rare assets like art or trading cards.</p>
            <p class="mt-4"><strong>Pros:</strong> Access to assets you could never afford. Fun to own. <strong>Cons:</strong> High fees, illiquid, no dividends.</p>
            <p class="mt-4"><strong>The Lotus take:</strong> Put no more than 5% of your portfolio here. Treat as a hobby, not a core strategy.</p>
          `
       },
       {
          id: "lesson-11-2",
          title: "Watches, sneakers, luxury bags",
          readTime: "2 minutes",
          content: `
            <p>The "hype market" involves buying limited editions and reselling for profit.</p>
            <p class="mt-4"><strong>The reality:</strong> Hype fades. Storage and authentication costs add up. Very hard to sell at peak.</p>
            <div class="bg-purple-50 border-l-4 border-purple-500 p-4 mt-6 font-medium text-purple-900 rounded-r-xl">
              <strong>The Lotus verdict:</strong> If you love sneakers or watches, buy them to wear and enjoy. Don’t treat them as a reliable investment.
            </div>
          `
       },
       {
          id: "lesson-11-3",
          title: "Royalties (Music, NFTs, intellectual property)",
          readTime: "1.5 minutes",
          content: `
            <p><strong>Royalties</strong> = Payments you receive when someone uses your creation (e.g., song plays on Spotify).</p>
            <p class="mt-4">You can buy royalty streams from other creators. It provides passive income, but it depends on the popularity of the song/art.</p>
            <p class="mt-4"><strong>The Lotus recommendation:</strong> For fun only. Not for building wealth.</p>
          `
       }
    ],
    quiz: []
  },
  {
    id: "taxes-and-law",
    module: "MODULE 3: ADVANCED MOVES",
    title: "Taxes & The Law (Adulting 101)",
    badgeIcon: "🧾",
    badgeName: "Tax Nerd",
    xp: 250,
    level: "Advanced",
    color: "bg-green-200",
    accent: "bg-green-600",
    lessons: [
       {
          id: "lesson-12-1",
          title: "Capital gains tax",
          readTime: "2 minutes",
          content: `
            <p>When you sell an investment for a profit, you pay <strong>capital gains tax</strong>.</p>
            <ul class="list-disc pl-5 mt-4 space-y-2">
              <li><strong>Short-term (held < 1 year):</strong> Taxed same as your income tax rate (10–37%).</li>
              <li><strong>Long-term (held > 1 year):</strong> 0%, 15%, or 20% (usually 15% for most Gen Z).</li>
            </ul>
            <p class="mt-4 font-bold text-green-700">Gen Z hack: If you’re a student or low earner, your long-term capital gains tax rate could be 0%.</p>
          `
       },
       {
          id: "lesson-12-2",
          title: "Tax-loss harvesting",
          readTime: "2 minutes",
          content: `
            <p><strong>Tax-loss harvesting</strong> = Selling an investment at a loss to offset gains you made elsewhere, reducing your tax bill.</p>
            <p class="mt-4">Example: You have a $1,000 gain on one stock and a $500 loss on another. You sell the losing stock to reduce your taxable gain to $500.</p>
            <p class="mt-4 font-bold text-red-600">Reminder: Never sell a good investment just to harvest a loss.</p>
          `
       },
       {
          id: "lesson-12-3",
          title: "Roth IRA vs. regular account",
          readTime: "2 minutes",
          content: `
            <p>A <strong>Roth IRA</strong> is a tax-advantaged account.</p>
            <ul class="list-disc pl-5 mt-4 space-y-2">
              <li>You contribute after-tax money.</li>
              <li>It grows tax-free.</li>
              <li>When you withdraw in retirement, you pay $0 tax – including on all gains.</li>
            </ul>
            <div class="bg-green-50 border-l-4 border-green-500 p-4 mt-6 font-medium text-green-900 rounded-r-xl">
              <strong>Lotus recommendation:</strong> Max out your Roth IRA before investing in a regular account. It’s free money from the government.
            </div>
          `
       }
    ],
    quiz: []
  },
  {
    id: "reading-the-room",
    module: "MODULE 3: ADVANCED MOVES",
    title: "Reading the Room (Market Analysis)",
    badgeIcon: "📊",
    badgeName: "Chart Whisperer",
    xp: 250,
    level: "Advanced",
    color: "bg-pink-100",
    accent: "bg-pink-500",
    lessons: [
       {
          id: "lesson-13-1",
          title: "The News is noise",
          readTime: "2 minutes",
          content: `
            <p>Financial media makes money from your attention, not your success.</p>
            <p class="mt-4">Ignore daily price movements, TV pundits, and clickbait alerts. By the time you read the news, thousands of professional traders have already acted on it.</p>
            <p class="mt-4 font-bold">What to pay attention to: Quarterly earnings reports, long-term trends, and your own plan.</p>
          `
       },
       {
          id: "lesson-13-2",
          title: "Support & resistance levels",
          readTime: "2 minutes",
          content: `
            <p><strong>Support</strong> = A price level where a stock tends to stop falling and bounce up (a floor).</p>
            <p class="mt-2"><strong>Resistance</strong> = A price level where a stock tends to stop rising and fall back (a ceiling).</p>
            <p class="mt-4">If you want to buy, consider buying near support. If you want to sell, consider selling near resistance.</p>
            <p class="mt-4 italic text-gray-500">Warning: Support and resistance are not guarantees. They break all the time.</p>
          `
       },
       {
          id: "lesson-13-3",
          title: "How to read an Earnings Report",
          readTime: "2 minutes",
          content: `
            <p>Every public company releases an earnings report 4 times a year. Focus on three things:</p>
            <ul class="list-decimal pl-5 mt-4 space-y-2">
              <li><strong>Revenue:</strong> Total money the company brought in.</li>
              <li><strong>Earnings per share (EPS):</strong> Profit divided by number of shares.</li>
              <li><strong>Guidance:</strong> What the company predicts for next quarter/year.</li>
            </ul>
          `
       }
    ],
    quiz: []
  },
  {
    id: "the-investor-identity",
    module: "MODULE 4: THE LOTUS TRIBE SPECIAL",
    title: "The Investor Identity",
    badgeIcon: "👑",
    badgeName: "Elder of the Tribe",
    xp: 500,
    level: "Expert",
    color: "bg-yellow-200",
    accent: "bg-yellow-600",
    lessons: [
       {
          id: "lesson-14-1",
          title: "Setting up your Lotus Tribe Profile",
          readTime: "2 minutes",
          content: `
            <p>You’ve completed 13 courses. Now you claim your identity.</p>
            <p class="mt-4">Make sure to add your <strong>Investor Animal</strong>, your <strong>Lotus Goal</strong>, and show off your earned badges on your profile.</p>
          `
       },
       {
          id: "lesson-14-2",
          title: "How to ask a “stupid” question",
          readTime: "1.5 minutes",
          content: `
            <p>There are no stupid questions in Lotus Tribe. But there are better ways to ask.</p>
            <div class="bg-gray-100 p-4 rounded-xl mt-4 neo-border border-gray-300">
              <p class="font-bold">Template for asking:</p>
              <p class="mt-2 text-sm">“I’m a [Investor Animal]. My goal is [amount] by [year]. Here’s what I don’t understand: [specific question]. I’ve tried [what you already did]. Can anyone explain like I’m 5?”</p>
            </div>
          `
       },
       {
          id: "lesson-14-3",
          title: "How to host a virtual investing circle",
          readTime: "2 minutes",
          content: `
            <p><strong>Investing Circle</strong> = A voice/video chat where members discuss markets, share lessons, and hold each other accountable.</p>
            <ul class="list-disc pl-5 mt-4 space-y-2">
              <li>Pick a schedule and a theme.</li>
              <li>Follow an agenda (Check-in, Deep Dive, Q&A, Goal review).</li>
            </ul>
            <p class="mt-4 font-bold text-red-600">Rule: No financial advice. Be respectful.</p>
          `
       },
       {
          id: "lesson-14-4",
          title: "Your 5‑year investment roadmap",
          readTime: "2 minutes",
          content: `
            <p>You’ve learned the tools. Now build your personal roadmap. Set a monthly investment amount, a milestone, and track your progress over 5 years.</p>
            <h3 class="font-display font-bold text-xl mt-6 mb-2">What to do each year:</h3>
            <ul class="list-disc pl-5 mt-2 space-y-2">
              <li><strong>January:</strong> Review your animal type.</li>
              <li><strong>April:</strong> Check taxes (tax-loss harvesting).</li>
              <li><strong>July:</strong> Rebalance portfolio.</li>
              <li><strong>October:</strong> Update your Lotus Goal.</li>
            </ul>
            <p class="mt-4 font-bold">Welcome to the Full Lotus rank! This is a lifelong journey.</p>
          `
       }
    ],
    quiz: []
  },
  {
    id: "halal-finance-deep-dive",
    module: "MODULE 4: THE LOTUS TRIBE SPECIAL",
    title: "Halal Finance: The Deep Dive",
    badgeIcon: "⚖️",
    badgeName: "Ethical Scholar",
    xp: 400,
    level: "Advanced",
    color: "bg-emerald-100",
    accent: "bg-emerald-500",
    lessons: [
       {
          id: "lesson-h-1",
          title: "The Pillars of Shari'ah Finance",
          readTime: "4 minutes",
          content: `
            <p>Halal finance isn't just about avoiding pork or alcohol. It's a complete economic philosophy built on justice and risk-sharing.</p>
            <h3 class="font-display font-bold text-xl mt-6 mb-2">The Four No-Nos:</h3>
            <ul class="list-decimal pl-5 mt-4 space-y-3">
              <li><strong>Riba (Interest):</strong> Money should not breed money without productive work. Charging interest is viewed as exploitative.</li>
              <li><strong>Gharar (Uncertainty):</strong> Contracts must be clear. No gambling on "hidden" outcomes or overly complex derivatives.</li>
              <li><strong>Maysir (Gambling):</strong> Pure speculation where one's gain is andother's loss without creating value is prohibited.</li>
              <li><strong>Haram Industries:</strong> No investment in tobacco, alcohol, conventional banking (interest-based), gambling, or weaponry.</li>
            </ul>
            <div class="bg-emerald-50 p-6 rounded-2xl mt-8 border border-emerald-100">
               <p class="font-bold mb-2">The Golden Rule:</p>
               <p class="text-sm italic">"The buyer and seller should share the risk and the reward."</p>
            </div>
          `
       }
    ],
    quiz: []
  },
  {
    id: "young-couples-wealth",
    module: "MODULE 2: THE STRATEGY",
    title: "Wealth for Young Couples",
    badgeIcon: "💍",
    badgeName: "Tribe Builder",
    xp: 300,
    level: "Intermediate",
    color: "bg-pink-100",
    accent: "bg-pink-500",
    lessons: [
       {
          id: "lesson-yc-1",
          title: "The 'Join or Separate' Debate",
          readTime: "3 minutes",
          content: `
            <p>Money is the #1 cause of stress in young marriages. Getting aligned early is a superpower.</p>
            <h3 class="font-display font-bold text-xl mt-6 mb-2">The 3-Account Strategy:</h3>
            <ul class="list-disc pl-5 mt-4 space-y-2">
              <li><strong>Yours:</strong> Personal spending, no questions asked.</li>
              <li><strong>Mine:</strong> My personal spending, no questions asked.</li>
              <li><strong>Ours:</strong> Rent, groceries, utility, and JOINT investments.</li>
            </ul>
            <p class="mt-6">In Halal finance, a woman's wealth is hers alone, while a husband is responsible for the family's maintenance. However, building <strong>joint wealth</strong> for a house or children's education is highly encouraged.</p>
          `
       }
    ],
    quiz: []
  },
  {
    id: "undergrad-side-hustle",
    module: "MODULE 0: THE WAKE UP",
    title: "The Undergrad Guide",
    badgeIcon: "🎓",
    badgeName: "Early Bird",
    xp: 150,
    level: "Beginner",
    color: "bg-sky-100",
    accent: "bg-sky-500",
    lessons: [
       {
          id: "lesson-ug-1",
          title: "Starting with ₦5,000",
          readTime: "2 minutes",
          content: `
            <p>Being a student is the best time to start. Why? Because you have <strong>Time</strong>.</p>
            <p class="mt-4">If you start with just ₦5,000 a month in the Lotus FIF, by the time you graduate, you'll have a habit that is worth more than the money itself.</p>
            <div class="bg-gray-100 p-4 rounded-xl mt-6 border-dashed border-2 border-gray-300">
               <p class="text-center font-bold">"Compound interest is the 8th wonder of the world. He who understands it, earns it... he who doesn't, pays it."</p>
            </div>
          `
       }
    ],
    quiz: []
  },
  {
    id: "mid-level-pivot",
    module: "MODULE 3: ADVANCED MOVES",
    title: "The Mid-Level Pivot",
    badgeIcon: "🚀",
    badgeName: "Growth Ace",
    xp: 350,
    level: "Advanced",
    color: "bg-indigo-100",
    accent: "bg-indigo-500",
    lessons: [
       {
          id: "lesson-ml-1",
          title: "Escaping the Salary Trap",
          readTime: "4 minutes",
          content: `
            <p>You've been working for 5-8 years. Your salary is good, but your expenses have grown too. This is lifestyle creep.</p>
            <h3 class="font-display font-bold text-xl mt-6 mb-2">Priority: Passive Income</h3>
            <p>At this stage, your goal should be building asset streams that could eventually replace your salary. Think about Halal Equities and Sukuk (Islamic Bonds) that pay regular profit shares.</p>
          `
       }
    ],
    quiz: []
  }
];
