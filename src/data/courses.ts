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
    id: "course-1-glow-up",
    module: "MODULE 0: THE WAKE UP",
    title: "Your Money Glow Up",
    badgeIcon: "🌱",
    badgeName: "Seedling",
    xp: 100,
    level: "Beginner",
    color: "bg-genz-lime/20",
    accent: "bg-genz-lime",
    quiz: [
      {
        question: "What's the difference between 'rich' and 'wealthy' according to Lesson 1.1?",
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
    ],
    lessons: [
      {
        id: "lesson-1.1",
        title: "Why “Rich” is boring. “Wealthy” is freedom.",
        readTime: "2 minutes",
        content: `
          <p>Let’s get real.</p>
          <p>When you hear “rich,” what comes to mind? A dude in a rented Lamborghini, a massive mortgage he can’t really afford, designer clothes bought on credit, and $47 in his checking account. That’s rich. It looks cool on Instagram for 15 seconds. Then the repo man shows up.</p>
          <h3 class="font-display font-bold text-xl mt-6 mb-2">Wealthy is different.</h3>
          <p>Wealthy means you wake up on a Tuesday at 10 AM because you choose to – not because your boss will fire you if you’re late. Wealthy means your car is reliable (not flashy), your rent is covered for 6 months even if you quit your job, and you can help a friend in need without checking your balance first.</p>
          <div class="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl mt-6 neo-border border-gray-300">
            <p class="font-bold">For Gen Z: Wealthy = the ability to say “no.”</p>
            <ul class="list-disc pl-5 mt-2 space-y-1">
              <li>No to a job you hate.</li>
              <li>No to a toxic relationship.</li>
              <li>No to buying junk you don’t need.</li>
              <li>No to a social event you don’t want to attend.</li>
            </ul>
          </div>
          <p class="font-bold mt-6 text-xl">Rich buys stuff. Wealthy buys time.</p>
          <p class="mt-4">Think about it. The richest person in the world could buy 100 yachts. But they still have only 24 hours in a day. Wealth buys you the freedom to choose how to spend those hours.</p>
          <h3 class="font-display font-bold text-xl mt-6 mb-2">Your first action:</h3>
          <p>Open your Notes app. Write down one thing you would do tomorrow if you didn’t have to worry about money. That’s your “why.” We’ll come back to it in Course 2.</p>
          <h3 class="font-display font-bold text-xl mt-6 mb-2">Tribe check:</h3>
          <p>After reading, tap the checkmark below. Then share your “one thing” anonymously in the Community feed with the hashtag #MyWhy.</p>
        `
      },
      {
        id: "lesson-1.2",
        title: "The 3-Bucket Principle",
        readTime: "3 minutes",
        content: `
          <p>Most people only have one bucket: Spend. Money comes in from your paycheck, side hustle, or parents. Then it goes right back out to Uber Eats, Spotify, Netflix, Shein, and late-night Amazon impulse buys. Poof. Gone.</p>
          <p class="font-bold mt-4">The 3-Bucket Principle is your new operating system. It’s simple. It’s boring. It works.</p>
          
          <h3 class="font-display font-bold text-xl mt-6 mb-2">Bucket 1 – Spend (50% of your income)</h3>
          <p>This is for living. Rent, groceries, phone bill, gas or transit, your daily latte, a movie ticket, a new hoodie. No guilt. You need to live. This bucket keeps you sane and happy.</p>
          
          <h3 class="font-display font-bold text-xl mt-6 mb-2">Bucket 2 – Save (20% of your income)</h3>
          <p>This money does not move. It sits in a high-yield savings account (not your regular checking account – go open one today if you don’t have it). This is for emergencies only: your laptop breaks, you get sick and can’t work, your car needs a sudden repair, you need a last-minute flight home.</p>
          <p class="font-bold text-lotus-red mt-2">Never invest this money. Never spend this on a sale or a trip. This is your safety net.</p>

          <h3 class="font-display font-bold text-xl mt-6 mb-2">Bucket 3 – Invest (30% of your income)</h3>
          <p>This is your future freedom fund. This money buys assets: stocks, ETFs, crypto (just a small slice), REITs. This money works while you sleep. It grows. It compounds. It gets you to the “wake up at 10 AM on a Tuesday” life.</p>
          
          <div class="bg-blue-50 border-l-4 border-blue-500 p-4 mt-6">
            <p><strong>Gen Z reality check:</strong> If you’re living with parents or have very low rent, you can flip the script. Try 40% invest, 30% save, 30% spend. That’s a superpower. Use it while you have low expenses.</p>
          </div>
          
          <h3 class="font-display font-bold text-xl mt-6 mb-2">Real example:</h3>
          <p>Alex earns $2,000 a month after tax.</p>
          <ul class="list-disc pl-5 mt-2 space-y-1">
            <li>Spend: $1,000 (rent $600, food $200, phone $50, fun $150)</li>
            <li>Save: $400 (automatic transfer to high-yield savings)</li>
            <li>Invest: $600 (automatic transfer to Lotus Tribe investment account)</li>
          </ul>
          <p class="mt-4">In one year: $4,800 saved (emergency fund) + $7,200 invested (working for him). In five years, that $7,200 per year could become $50,000+ with compound growth.</p>
        `
      },
      {
        id: "lesson-1.3",
        title: "Inflation is a silent thief",
        readTime: "2 minutes",
        content: `
          <p>Remember when a slice of pizza was $2? Now it’s $4. A pack of gum was $0.50? Now it’s $1.25. A video game was $50? Now new releases are $70.</p>
          <p class="mt-2">That’s not the pizza getting fancy or the game having better graphics (well, maybe a little). That’s inflation.</p>
          
          <h3 class="font-display font-bold text-xl mt-6 mb-2">What is inflation?</h3>
          <p>Inflation means your money buys less stuff over time. On average, prices go up about 2–3% per year. Sometimes much more – like in 2022 when inflation hit 9%. Your rent, food, gas, everything got more expensive.</p>

          <h3 class="font-display font-bold text-xl mt-6 mb-2">Why it’s a thief:</h3>
          <p>If you leave $1,000 under your mattress for 10 years, you still have $1,000. But a $1,000 pizza in 2014 would cost about $1,340 in 2024. You lost $340 of pizza-buying power without spending a cent. That’s theft without a mask.</p>

          <div class="bg-lotus-dark text-white p-4 rounded-xl mt-6">
            <p class="font-bold text-center">The only way to beat inflation: Make your money grow faster than inflation.</p>
          </div>

          <h3 class="font-display font-bold text-xl mt-6 mb-2">Real example:</h3>
          <p>$1,000 invested in the S&P 500 in 2014 became roughly $3,000 by 2024. Inflation ate about $300 of that, but you still came out $1,700 ahead. The person who left cash under their mattress? They lost $340 in buying power.</p>

          <div class="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl mt-6 neo-border border-gray-300">
            <p class="font-bold">Meme summary (for your internal team):</p>
            <p>Cash under mattress = slow death by inflation.<br/>
            Investing = anti-inflation shield.</p>
          </div>
        `
      },
      {
         id: "lesson-1.4",
         title: "The Lotus Manifesto (ESG 101)",
         readTime: "3 minutes",
         content: `
           <h3 class="font-display font-bold text-2xl mt-2 mb-4">You don’t have to be a villain to make money.</h3>
           <p>For decades, the lie was: “To get rich, you have to invest in oil companies, tobacco, weapons manufacturers, and sweatshops. That’s just how the world works.”</p>
           <p class="font-bold my-4 uppercase tracking-widest text-lotus-red">That’s dead. Buried. Gone.</p>
           
           <p>ESG stands for Environmental, Social, Governance. It’s a rating system for companies. Think of it as a “human decency score.”</p>
           
           <ul class="list-disc pl-5 mt-4 space-y-4">
             <li><strong>E = Environmental:</strong> Does the company pollute the air and water? Do they use renewable energy? Are they trying to reduce their carbon footprint? Or do they dump chemicals into rivers?</li>
             <li><strong>S = Social:</strong> Do they treat workers fairly? Pay a living wage? Have diversity in leadership? No child labor? No forced overtime? Do they give back to communities?</li>
             <li><strong>G = Governance:</strong> Is leadership honest? No scandals? No executives secretly selling their shares before bad news? Fair pay difference between the CEO and regular workers? Transparent accounting?</li>
           </ul>
           
           <h3 class="font-display font-bold text-xl mt-8 mb-2">The Lotus Promise:</h3>
           <p>On Lotus Tribe, you will never be forced to invest in something you hate. Every stock, every ETF has a “Vibe Check” badge:</p>
           <ul class="space-y-2 mt-4 ml-4">
             <li>🌿 <strong>Green</strong> = High ESG score. Generally good actors.</li>
             <li>⚖️ <strong>Yellow</strong> = Mixed. Some good, some bad. You decide.</li>
             <li>⛔ <strong>Red</strong> = Controversial industries (oil, tobacco, weapons, private prisons, etc.)</li>
           </ul>
           
           <h3 class="font-display font-bold text-xl mt-8 mb-2">“But does ethical investing make less money?”</h3>
           <p>Actually, no. Many studies show that high-ESG companies perform better over 10+ years. The Vanguard FTSE Social Index Fund (VFTAX) – which excludes tobacco, weapons, fossil fuels – has performed almost identically to the regular S&P 500 over the last 10 years. Same returns. Less guilt.</p>
         `
      }
    ]
  },
  {
    id: "course-2-vibe",
    module: "MODULE 0: THE WAKE UP",
    title: "Know Your Vibe (Profile Test Deep Dive)",
    badgeIcon: "🧠",
    badgeName: "Self-Aware",
    xp: 150,
    level: "Beginner",
    color: "bg-genz-pink/20",
    accent: "bg-genz-pink",
    quiz: [],
    lessons: [
      {
        id: "lesson-2.1",
        title: "The 4 Investor Animals",
        readTime: "3 minutes",
        content: `
          <p>You wouldn’t wear hiking boots to a beach party. Same with investing. Your personality decides your best strategy.</p>
          
          <h3 class="font-display font-bold text-xl mt-6 mb-2">🐺 The Hustler</h3>
          <ul class="list-disc pl-5 mt-2 space-y-1">
             <li><strong>Risk appetite:</strong> High</li>
             <li><strong>Mood:</strong> “YOLO. I want 10x or nothing.”</li>
             <li><strong>Loves:</strong> Crypto, meme stocks, leverage, options.</li>
             <li><strong>Danger:</strong> Can lose everything chasing hype.</li>
             <li><strong>Best move:</strong> Put 80% in boring index funds, 20% in high-risk (crypto, small stocks, collectibles).</li>
          </ul>

          <h3 class="font-display font-bold text-xl mt-6 mb-2">🦥 The Guardian</h3>
          <ul class="list-disc pl-5 mt-2 space-y-1">
             <li><strong>Risk appetite:</strong> Low</li>
             <li><strong>Mood:</strong> “I just don’t want to lose money. Ever.”</li>
             <li><strong>Loves:</strong> Savings accounts, CDs, bonds, dividend stocks.</li>
             <li><strong>Danger:</strong> Keeping all cash and losing to inflation (slow death).</li>
             <li><strong>Best move:</strong> Mostly bonds, high-dividend ETFs, some REITs. Sleep well.</li>
          </ul>

          <h3 class="font-display font-bold text-xl mt-6 mb-2">🌙 The Dreamer</h3>
          <ul class="list-disc pl-5 mt-2 space-y-1">
             <li><strong>Risk appetite:</strong> Medium, but only for impact</li>
             <li><strong>Mood:</strong> “I want to save the planet AND make money.”</li>
             <li><strong>Loves:</strong> ESG funds, clean energy, B Corps, green bonds.</li>
             <li><strong>Danger:</strong> Getting scammed by greenwashing (fake eco-labels).</li>
             <li><strong>Best move:</strong> ESG ETFs, community investing, shareholder activism.</li>
          </ul>

          <h3 class="font-display font-bold text-xl mt-6 mb-2">🔬 The Scientist</h3>
          <ul class="list-disc pl-5 mt-2 space-y-1">
             <li><strong>Risk appetite:</strong> Calculated</li>
             <li><strong>Mood:</strong> “Show me the data, spreadsheet, and 10-year chart.”</li>
             <li><strong>Loves:</strong> Index funds, factor investing, rebalancing, backtesting.</li>
             <li><strong>Danger:</strong> Analysis paralysis. Never pulling the trigger.</li>
             <li><strong>Best move:</strong> Low-cost total market ETFs, automated investing.</li>
          </ul>
        `
      },
      {
        id: "lesson-2.2",
        title: "Risk vs. Volatility",
        readTime: "2 minutes",
        content: `
          <p>This is the single most misunderstood idea in investing. Master it, and you’re ahead of 90% of beginners.</p>
          
          <div class="bg-gray-100 dark:bg-gray-800 p-6 rounded-xl mt-4 mb-6">
            <h4 class="font-bold text-lg mb-2 text-lotus-red">Risk = permanent loss of money.</h4>
            <p>Example: You buy a meme coin called “MoonDog.” The founders disappear with all the money. Your investment is gone forever. That’s risk.</p>
          </div>

          <div class="bg-gray-100 dark:bg-gray-800 p-6 rounded-xl mb-6">
            <h4 class="font-bold text-lg mb-2 text-lotus-dark dark:text-white">Volatility = temporary ups and downs.</h4>
            <p>Example: You buy Apple stock at $180. Next month it drops to $150 because the whole market is down. Six months later it goes to $200. You didn’t lose anything if you didn’t sell. You actually gained $20 per share.</p>
          </div>

          <p class="font-bold text-xl mb-4">Volatility is a rollercoaster. Risk is the rollercoaster falling off the tracks.</p>

          <h3 class="font-display font-bold text-xl mt-6 mb-2">Why this matters for your mental health:</h3>
          <p>When the market drops 20%, most people panic and sell. That turns volatility into real loss. Smart investors do nothing – or buy more.</p>
        `
      },
      {
        id: "lesson-2.3",
        title: "Your personal 'Why'",
        readTime: "2 minutes",
        content: `
          <p>Remember Lesson 1.1 where you wrote down one thing you would do tomorrow if you didn’t have to worry about money?</p>
          <p class="font-bold mt-2">That’s your Why.</p>
          <p class="mt-4">Investing without a Why is like playing a video game with no goal. You just wander and quit.</p>
          
          <h3 class="font-display font-bold text-xl mt-6 mb-2">Examples of real Gen Z Whys:</h3>
          <ul class="list-disc pl-5 mt-2 space-y-1">
             <li>“I want to take 6 months off to travel South America by age 25.”</li>
             <li>“I want to buy a modest home near my parents by age 30.”</li>
             <li>“I want to start a nonprofit and not worry about my own rent.”</li>
             <li>“I just want to never ask my parents for money again.”</li>
          </ul>

          <h3 class="font-display font-bold text-xl mt-6 mb-2">Now attach a number to it.</h3>
          <ul class="list-disc pl-5 mt-2 space-y-1 mb-6">
             <li>6 months travel: ~$15,000 (flights, accommodation, food, emergency buffer).</li>
             <li>Never ask parents: $20,000 emergency fund.</li>
             <li>Start a nonprofit: $50,000 to cover 2 years of your living expenses.</li>
          </ul>
          
          <p>That number becomes your Lotus Goal. The app will show you how much to invest per month to reach it by your target date.</p>
        `
      }
    ]
  },
  {
    id: "course-3-stocks",
    module: "MODULE 1: THE ARSENAL",
    title: "Stocks Are Not Scary",
    badgeIcon: "📈",
    badgeName: "Tiny Owner",
    xp: 200,
    level: "Beginner",
    color: "bg-genz-purple/20",
    accent: "bg-genz-purple",
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
          question: "What is a dividend?",
          options: [
             { text: "A fee you pay to trade", isCorrect: false },
             { text: "Cash paid to shareholders", isCorrect: true },
             { text: "A type of bond", isCorrect: false }
          ]
       },
       {
          question: "What is the main advantage of an index fund?",
          options: [
             { text: "Higher risk", isCorrect: false },
             { text: "Instant diversification", isCorrect: true },
             { text: "Guaranteed returns", isCorrect: false }
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
    ],
    lessons: [
       {
          id: "lesson-3.1",
          title: "What is a stock? (You own a tiny piece)",
          readTime: "2.5 minutes",
          content: `
            <p>Imagine your favorite coffee shop needs money to open a second location. They say: “Give us $1,000, and we’ll give you 1% of the company. If we make profit, you get 1% of it. If we sell the company, you get 1% of the sale price.”</p>
            <p class="font-bold my-4">That’s a stock. You are now a part-owner.</p>
            <p>When you buy one share of Apple, you own a microscopic slice of the iPhone factory, the App Store, the brand, the copyrights, and even a tiny piece of the debt they owe. You are an actual owner.</p>
            
            <h3 class="font-display font-bold text-xl mt-6 mb-2">Why do stock prices move?</h3>
            <p>Supply and demand. More people want to buy than sell → price goes up. More people want to sell than buy → price goes down.</p>
            
            <div class="bg-gray-100 dark:bg-gray-800 p-6 rounded-xl mt-4 border border-gray-200 dark:border-gray-700">
               <p class="font-bold uppercase tracking-widest text-xs text-lotus-red mb-2">The Golden Rule:</p>
               <p>Only buy an individual stock if you would be happy owning it for 5 years without checking the price every day. If you can’t handle that, stick to index funds.</p>
            </div>
          `
       },
       {
          id: "lesson-3.2",
          title: "Dividends – Getting paid to do nothing",
          readTime: "2 minutes",
          content: `
             <p>Some companies don’t reinvest all their profit back into the business. They send a chunk of it directly to you, the owner. That’s a dividend.</p>
             <h3 class="font-display font-bold text-xl mt-6 mb-2">Example:</h3>
             <p>You own $10,000 worth of Coca-Cola stock. Coca-Cola pays a 3% annual dividend. Every year, you receive $300 in cash deposited into your account – whether the stock price goes up or down. You can spend that cash or reinvest it to buy more shares.</p>
             
             <div class="bg-white dark:bg-gray-900 p-4 neo-border rounded-xl mt-4 shadow-sm">
                <p><strong>Dividend yield</strong> = annual dividend divided by stock price.</p>
                <p>A stock at $100 paying $3 per share per year has a 3% yield.</p>
             </div>
             
             <h3 class="font-display font-bold text-xl mt-6 mb-2">The dividend snowball:</h3>
             <p>If you reinvest dividends, you buy more shares. Those new shares also pay dividends. Over decades, this snowballs into significant passive income.</p>
          `
       },
       {
          id: "lesson-3.3",
          title: "The Index Fund Hack",
          readTime: "2 minutes",
          content: `
             <p>Picking individual stocks is hard. Even professional fund managers fail to beat the market most years.</p>
             <p class="font-bold text-lg my-4">The Index Fund Hack is simple: Instead of trying to pick winners, buy everything.</p>
             <p>An index fund (or ETF) holds hundreds or thousands of stocks. When you buy one share of an S&P 500 index fund, you own a tiny slice of 500 of the biggest US companies: Apple, Microsoft, Amazon, Nvidia, Coca-Cola, Visa, and 494 others.</p>
             
             <h3 class="font-display font-bold text-xl mt-6 mb-2">Why this is a hack:</h3>
             <ul class="list-disc pl-5 mt-2 space-y-1">
               <li>If one company fails, you barely notice (it’s 0.2% of your portfolio).</li>
               <li>You get the average return of the entire market – historically 7–10% per year.</li>
               <li>You don’t need to research anything.</li>
               <li>Low fees (often 0.03% per year vs. 1%+ for active funds).</li>
             </ul>
          `
       },
       {
          id: "lesson-3.4",
          title: "Fractional shares – Start with $5",
          readTime: "1.5 minutes",
          content: `
             <p>A single share of Amazon costs over $100. A single share of Berkshire Hathaway costs over $600,000. That’s impossible for most Gen Z investors.</p>
             <p class="font-bold my-4">Fractional shares solve this. Instead of buying a whole share, you buy a slice. You can invest $5 in Amazon and own 0.004 of a share.</p>
             
             <h3 class="font-display font-bold text-xl mt-6 mb-2">How it works:</h3>
             <p>If Amazon is $100 per share and you invest $5, you own 5% of one share. When Amazon goes to $110, your $5 becomes $5.50. Same percentage gain as someone who bought a whole share.</p>
             
             <div class="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl mt-6">
               <p class="font-bold">Gen Z superpower:</p>
               <p>Fractional shares mean you can build a diversified portfolio with very little money. You can own 20 different companies for $100 total.</p>
             </div>
          `
       }
    ]
  },
  {
    id: "course-4-etfs",
    module: "MODULE 1: THE ARSENAL",
    title: "ETFs – The Lazy Genius Move",
    badgeIcon: "⚡",
    badgeName: "Lazy Genius",
    xp: 200,
    level: "Beginner",
    color: "bg-orange-100",
    accent: "bg-orange-500",
    quiz: [],
    lessons: [
       {
          id: "lesson-4.1",
          title: "ETF vs. Mutual Fund (The coffee shop analogy)",
          readTime: "2 minutes",
          content: `
            <p>ETF (Exchange Traded Fund) and Mutual Fund both hold baskets of stocks. But they work differently.</p>
            <h3 class="font-display font-bold text-xl mt-6 mb-2">The coffee shop analogy:</h3>
            <ul class="list-disc pl-5 mt-2 space-y-4">
               <li><strong>Mutual Fund</strong> = You give the barista $100 and say “make me a coffee.” At the end of the day, the barista tells you what blend you got and the exact price. You can only buy or sell once per day.</li>
               <li><strong>ETF</strong> = You walk in, see the price on a screen, and buy a cup instantly. You can trade it anytime during market hours, just like a stock.</li>
            </ul>
            <p class="mt-6 font-bold">For Lotus Tribe: We focus on ETFs because they are cheaper, more flexible, and beginner-friendly.</p>
          `
       },
       {
          id: "lesson-4.2",
          title: "Thematic ETFs – Invest in your interests",
          readTime: "2 minutes",
          content: `
             <p>Don’t just invest in “the market.” Invest in things you actually care about.</p>
             <p>Thematic ETFs focus on specific trends or industries. Examples:</p>
             <ul class="list-disc pl-5 mt-2 space-y-1 mb-6">
                <li>Clean energy: ICLN, QCLN</li>
                <li>Robotics & AI: ARKQ, ROBT</li>
                <li>Video games & esports: ESPO, NERD</li>
                <li>Cybersecurity: HACK, CIBR</li>
             </ul>
             
             <h3 class="font-display font-bold text-xl mt-6 mb-2">The Lotus rule for thematic ETFs:</h3>
             <p>Keep them to no more than 20% of your total portfolio. The other 80% should be broad index funds.</p>
          `
       },
       {
          id: "lesson-4.3",
          title: "The 3-Fund Portfolio (Set & forget)",
          readTime: "2.5 minutes",
          content: `
             <p>This is the only portfolio most people will ever need. It was popularized by Jack Bogle (founder of Vanguard) and r/Bogleheads.</p>
             <h3 class="font-display font-bold text-xl mt-6 mb-2">The 3 funds:</h3>
             <ol class="list-decimal pl-5 mt-2 space-y-2 mb-6 font-medium">
               <li>Total US stock market (e.g., VTI) – owns every US company.</li>
               <li>Total international stock market (e.g., VXUS) – owns every non-US company.</li>
               <li>Total US bond market (e.g., BND) – owns government and corporate bonds.</li>
             </ol>
             
             <h3 class="font-display font-bold text-xl mt-6 mb-2">Why this works:</h3>
             <ul class="list-disc pl-5 mt-2 space-y-1">
               <li>You own the entire world’s economy.</li>
               <li>You never need to pick stocks.</li>
               <li>You rebalance once a year (sell what did well, buy what didn’t).</li>
               <li>Historically 7–9% average returns with less volatility than individual stocks.</li>
             </ul>
          `
       }
    ]
  },
  {
    id: "course-5-crypto",
    module: "MODULE 1: THE ARSENAL",
    title: "Crypto & Web3 (The Reality Check)",
    badgeIcon: "🔗",
    badgeName: "Chain Scholar",
    xp: 250,
    level: "Intermediate",
    color: "bg-blue-100",
    accent: "bg-blue-500",
    quiz: [
       {
          question: "What is the main difference between Bitcoin and Ethereum?",
          options: [
             { text: "Bitcoin is faster", isCorrect: false },
             { text: "Bitcoin is digital gold, Ethereum is a digital computer", isCorrect: true },
             { text: "Ethereum has a fixed supply", isCorrect: false }
          ]
       },
       {
          question: "What is a gas fee?",
          options: [
             { text: "A fee to fill up your car", isCorrect: false },
             { text: "A transaction fee on Ethereum", isCorrect: true },
             { text: "A tax on crypto profits", isCorrect: false }
          ]
       },
       {
          question: "What is a rug pull?",
          options: [
             { text: "A type of crypto wallet", isCorrect: false },
             { text: "A scam where creators steal money", isCorrect: true },
             { text: "A staking reward", isCorrect: false }
          ]
       },
       {
          question: "What is the Lotus maximum recommended crypto allocation?",
          options: [
             { text: "50%", isCorrect: false },
             { text: "5–10%", isCorrect: true },
             { text: "100%", isCorrect: false }
          ]
       }
    ],
    lessons: [
       {
          id: "lesson-5.1",
          title: "Bitcoin vs. Ethereum (Digital gold vs. digital computer)",
          readTime: "2.5 minutes",
          content: `
             <p>Crypto is confusing. Let’s simplify.</p>
             <h3 class="font-display font-bold text-xl mt-6 mb-2">Bitcoin (BTC) – Digital gold.</h3>
             <ul class="list-disc pl-5 mt-2 space-y-1 mb-4">
               <li>Created in 2009 by Satoshi Nakamoto.</li>
               <li>Only 21 million will ever exist (scarce like gold).</li>
               <li>Purpose: Store of value, hedge against inflation.</li>
               <li>Does one thing: transfer value from person A to person B without a bank.</li>
             </ul>
             
             <h3 class="font-display font-bold text-xl mt-6 mb-2">Ethereum (ETH) – Digital computer.</h3>
             <ul class="list-disc pl-5 mt-2 space-y-1 mb-4">
               <li>Created in 2015 by Vitalik Buterin.</li>
               <li>Purpose: Run decentralized apps (DeFi, NFTs, games, DAOs).</li>
               <li>Think of Ethereum as an app store without a central company.</li>
             </ul>
             
             <div class="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl mt-6">
               <p><strong>Gen Z analogy:</strong> Bitcoin is like a savings account that no government can touch. Ethereum is like a smartphone – the value is in the apps you can build on it.</p>
             </div>
          `
       },
       {
          id: "lesson-5.2",
          title: "The 'Degen' trap – Meme coins and rug pulls",
          readTime: "2.5 minutes",
          content: `
             <p><strong>Degen = degenerate.</strong> In crypto, it means someone who takes insane risks chasing quick profits.</p>
             <p class="mt-4"><strong>Meme coins</strong> – Coins with no purpose other than hype and community. Examples: Dogecoin, Shiba Inu, Pepe.</p>
             <ul class="list-disc pl-5 mt-2 space-y-1">
                <li>They can go up 1000% in a week.</li>
                <li>They can go down 99% in a day.</li>
                <li>Most have no development team, no roadmap, no use case.</li>
             </ul>
             
             <h3 class="font-display font-bold text-xl mt-6 mb-2 text-red-500">Rug pull</h3>
             <p>A scam where the creators of a coin suddenly sell all their holdings, crashing the price to zero, and disappear with everyone’s money.</p>
             
             <h3 class="font-display font-bold text-xl mt-6 mb-2">The Lotus rule for crypto:</h3>
             <ul class="list-disc pl-5 mt-2 space-y-1">
                <li>Maximum 5–10% of your total portfolio in crypto.</li>
                <li>Of that, no more than 20% in meme coins (if any).</li>
                <li>Never invest money you need next year.</li>
                <li>Only buy coins in the top 20 by market cap until you learn more.</li>
             </ul>
          `
       }
    ]
  },
  {
    id: "course-6-compound",
    module: "MODULE 2: THE STRATEGY",
    title: "The Boring Secret (Compound Interest)",
    badgeIcon: "🧮",
    badgeName: "Math Wizard",
    xp: 200,
    level: "Intermediate",
    color: "bg-teal-100",
    accent: "bg-teal-500",
    quiz: [],
    lessons: [
       {
          id: "lesson-6.1",
          title: "The Rule of 72 (Double your money math)",
          readTime: "1.5 minutes",
          content: `
             <p>Want to know how many years it takes to double your money? Use the Rule of 72.</p>
             <div class="bg-gray-100 dark:bg-gray-800 p-6 rounded-xl text-center my-6 text-2xl font-black font-display text-lotus-dark dark:text-white">
                72 ÷ Annual Return = Years to double
             </div>
             
             <h3 class="font-display font-bold text-xl mt-6 mb-2">Examples:</h3>
             <ul class="list-disc pl-5 mt-2 space-y-2">
                <li><strong>3% return</strong> (high-yield savings) → 72 ÷ 3 = 24 years to double.</li>
                <li><strong>7% return</strong> (conservative stocks) → 72 ÷ 7 = about 10 years to double.</li>
                <li><strong>10% return</strong> (S&P 500 historical) → 72 ÷ 10 = 7.2 years to double.</li>
             </ul>
             <p class="mt-6 font-bold">Why this matters:</p>
             <p>If you invest $10,000 at 10% return, in 7.2 years it is $20,000. In 14 years, $40,000. In 21 years, $80,000. That’s the power of doubling.</p>
          `
       },
       {
          id: "lesson-6.2",
          title: "Time travel – Age 20 vs. Age 30",
          readTime: "2 minutes",
          content: `
             <p>This is the most important math in investing. Visualize it.</p>
             <ul class="list-disc pl-5 mt-4 space-y-4">
                <li><strong>Alex starts at 20:</strong> Invests $100/month until age 65. Total invested: $54,000.</li>
                <li><strong>Jordan starts at 30:</strong> Invests $200/month until age 65. Total invested: $84,000 (more money).</li>
             </ul>
             <h3 class="font-display font-bold text-2xl mt-6 mb-4 text-lotus-red">Who ends with more? Alex. By a lot.</h3>
             <p>At an assumed 7% return:</p>
             <ul class="list-disc pl-5 mt-2 space-y-2 font-medium">
                <li>Alex (20 to 65, $100/mo): ~$380,000</li>
                <li>Jordan (30 to 65, $200/mo): ~$330,000</li>
             </ul>
             <p class="mt-6">Alex invested less money but started earlier. Time did the work. Every 5 years you delay costs you roughly half your final balance.</p>
          `
       },
       {
          id: "lesson-6.3",
          title: "Dollar Cost Averaging (Buying the dip without stress)",
          readTime: "2 minutes",
          content: `
             <p><strong>Dollar Cost Averaging (DCA)</strong> = Investing the same amount of money at regular intervals, regardless of price.</p>
             <h3 class="font-display font-bold text-xl mt-6 mb-2">Example:</h3>
             <p>You invest $100 every Monday into an S&P 500 ETF.</p>
             <ul class="list-disc pl-5 mt-2 space-y-1">
                <li>Week 1: Price $100 → you buy 1 share.</li>
                <li>Week 2: Price $80 (market dropped) → you buy 1.25 shares.</li>
                <li>Week 3: Price $120 (market up) → you buy 0.83 shares.</li>
             </ul>
             <p class="mt-6">Your average price is less than the average of the prices. You automatically buy more when prices are low and less when prices are high.</p>
          `
       }
    ]
  },
  {
    id: "course-7-risk",
    module: "MODULE 2: THE STRATEGY",
    title: "Risk Management (Don't Lose Your Lunch Money)",
    badgeIcon: "🛡️",
    badgeName: "Shield Bearer",
    xp: 200,
    level: "Intermediate",
    color: "bg-red-100",
    accent: "bg-red-500",
    quiz: [
       {
          question: "What is diversification?",
          options: [
             { text: "Buying only tech stocks", isCorrect: false },
             { text: "Spreading money across different assets", isCorrect: true },
             { text: "Timing the market", isCorrect: false }
          ]
       },
       {
          question: "How many months of expenses should an emergency fund cover?",
          options: [
             { text: "1", isCorrect: false },
             { text: "3–6", isCorrect: true },
             { text: "12–24", isCorrect: false }
          ]
       },
       {
          question: "What is a simple way to hedge against stock crashes?",
          options: [
             { text: "Buy more stocks", isCorrect: false },
             { text: "Hold bonds or cash", isCorrect: true },
             { text: "Use credit cards", isCorrect: false }
          ]
       },
       {
          question: "True or false: An emergency fund should be invested in crypto.",
          options: [
             { text: "True", isCorrect: false },
             { text: "False", isCorrect: true }
          ]
       }
    ],
    lessons: [
       {
          id: "lesson-7.1",
          title: "Diversification – Not all eggs in one basket",
          readTime: "2 minutes",
          content: `
            <p>You’ve heard “don’t put all your eggs in one basket.” That’s diversification.</p>
            <h3 class="font-display font-bold text-xl mt-6 mb-2">Levels of diversification:</h3>
            <ol class="list-decimal pl-5 mt-2 space-y-2">
               <li><strong>Across companies:</strong> Don’t own just Tesla. Own 500 companies (index fund).</li>
               <li><strong>Across sectors:</strong> Don’t own only tech. Own healthcare, consumer goods, energy, finance.</li>
               <li><strong>Across countries:</strong> The US does well, but sometimes international outperforms (VXUS).</li>
               <li><strong>Across asset classes:</strong> Stocks + bonds + real estate + maybe a little crypto.</li>
            </ol>
          `
       },
       {
          id: "lesson-7.2",
          title: "Emergency funds first (Boring but sexy for survival)",
          readTime: "2 minutes",
          content: `
            <p>Before you invest aggressively, build an emergency fund.</p>
            <p class="mt-4 font-bold">What is it?</p>
            <p>Cash in a high-yield savings account (not invested) that covers 3–6 months of your basic living expenses.</p>
            
            <h3 class="font-display font-bold text-xl mt-6 mb-2">Why before investing?</h3>
            <p>If you lose your job or have a medical emergency and all your money is in stocks, you might be forced to sell when the market is down. That turns a temporary dip into a permanent loss.</p>
          `
       }
    ]
  },
  {
    id: "course-8-esg",
    module: "MODULE 2: THE STRATEGY",
    title: "Ethical & Impact Investing (Lotus Core)",
    badgeIcon: "🌍",
    badgeName: "Earth Keeper",
    xp: 300,
    level: "Intermediate",
    color: "bg-genz-lime/30",
    accent: "bg-genz-lime",
    quiz: [
       {
          question: "What does ESG stand for?",
          options: [
             { text: "Easy Stock Gains", isCorrect: false },
             { text: "Environmental, Social, Governance", isCorrect: true },
             { text: "Earn Save Grow", isCorrect: false }
          ]
       },
       {
          question: "What is greenwashing?",
          options: [
             { text: "Painting things green", isCorrect: false },
             { text: "Fake environmental marketing", isCorrect: true },
             { text: "A type of ESG fund", isCorrect: false }
          ]
       }
    ],
    lessons: [
       {
          id: "lesson-8.2",
          title: "Greenwashing – How to spot fake eco-brands",
          readTime: "2.5 minutes",
          content: `
            <p><strong>Greenwashing</strong> = marketing that makes a company look environmentally friendly when it’s not.</p>
            
            <h3 class="font-display font-bold text-xl mt-6 mb-2">How to spot greenwashing:</h3>
            <ul class="list-disc pl-5 mt-2 space-y-2">
               <li><strong>Look for specifics</strong> – “We reduced emissions by 30%” is good. “We care about the planet” is empty.</li>
               <li><strong>Check for third-party certifications</strong> – B Corp, Fair Trade, Energy Star. These are verified.</li>
               <li><strong>See if they mention ESG score</strong> – Companies proud of their ESG will show it.</li>
            </ul>
          `
       },
       {
          id: "lesson-8.3",
          title: "Shareholder activism – How your votes change corporate policy",
          readTime: "2 minutes",
          content: `
            <p>When you own a stock, you are a part-owner. Owners get to vote on important issues.</p>
            <p class="mt-4"><strong>What you can vote on (if you own shares):</strong></p>
            <ul class="list-disc pl-5 mt-2 space-y-1">
               <li>Board of directors (who runs the company)</li>
               <li>Executive pay packages</li>
               <li>Environmental proposals (e.g., “adopt net-zero target”)</li>
               <li>Social proposals (e.g., “publish diversity data”)</li>
            </ul>
            <p class="mt-6 font-bold">You don’t need millions of shares. When thousands of small shareholders vote together, companies listen.</p>
          `
       }
    ]
  },
  {
    id: "course-9-bear",
    module: "MODULE 2: THE STRATEGY",
    title: "Recession & Bear Market Survival",
    badgeIcon: "🐻",
    badgeName: "Bear Tamer",
    xp: 250,
    level: "Advanced",
    color: "bg-orange-100",
    accent: "bg-orange-500",
    quiz: [],
    lessons: [
       {
          id: "lesson-9.1",
          title: "What is a bear market? (Everything is on sale)",
          readTime: "2 minutes",
          content: `
             <p><strong>Bear market</strong> = When stock prices drop 20% or more from recent highs, usually over months.</p>
             <p><strong>Bull market</strong> = When prices rise.</p>
             
             <h3 class="font-display font-bold text-xl mt-6 mb-2">The secret:</h3>
             <p>Bear markets are the best time to buy – if you have cash and courage.</p>
             <p class="mt-2">Everything is on sale. That $100 stock you wanted is now $70. The company didn’t change. The market got scared.</p>
             
             <div class="bg-gray-100 dark:bg-gray-800 p-6 rounded-xl mt-6">
                <p class="font-bold underline mb-2">Historical fact:</p>
                <p>Since 1926, the S&P 500 has had 26 bear markets. After every single one, it eventually reached new highs. Average recovery time: about 2 years.</p>
             </div>
          `
       }
    ]
  },
  {
    id: "course-12-taxes",
    module: "MODULE 3: ADVANCED MOVES",
    title: "Taxes & The Law (Adulting 101)",
    badgeIcon: "🧾",
    badgeName: "Tax Nerd",
    xp: 250,
    level: "Advanced",
    color: "bg-sky-100",
    accent: "bg-sky-500",
    quiz: [],
    lessons: [
       {
          id: "lesson-12.1",
          title: "Capital gains tax (Short term vs. long term)",
          readTime: "2 minutes",
          content: `
             <p>When you sell an investment for a profit, you pay capital gains tax. The rate depends on how long you held it.</p>
             <ul class="list-disc pl-5 mt-4 space-y-4">
               <li><strong>Less than 1 year (short-term):</strong> Same as your income tax rate (higher).</li>
               <li><strong>More than 1 year (long-term):</strong> Much lower rate (0%, 15%, or 20% in the US).</li>
             </ul>
             <div class="bg-blue-50 border-l-4 border-blue-500 p-4 mt-6 text-blue-900 rounded-r-xl">
               <p><strong>Gen Z hack:</strong> If you’re a student or low earner, your long-term capital gains tax rate could be 0%. That means you can sell profitable investments tax-free, up to a limit.</p>
             </div>
          `
       }
    ]
  },
  {
    id: "course-14-identity",
    module: "MODULE 4: THE LOTUS TRIBE SPECIAL",
    title: "The Investor Identity",
    badgeIcon: "👑",
    badgeName: "Elder of the Tribe",
    xp: 500,
    level: "Advanced",
    color: "bg-lotus-dark",
    accent: "bg-white dark:bg-gray-900 text-lotus-dark dark:text-white",
    quiz: [],
    lessons: [
       {
          id: "lesson-14.2",
          title: "How to ask a 'stupid' question (No judgment zone)",
          readTime: "1.5 minutes",
          content: `
             <p>There are no stupid questions in Lotus Tribe. But there are better ways to ask.</p>
             
             <div class="bg-gray-100 dark:bg-gray-800 p-6 rounded-xl mt-6">
                <p class="font-bold mb-2">Template for asking anything:</p>
                <p class="italic text-gray-600 dark:text-gray-300">“I’m a [Investor Animal]. My goal is [amount] by [year]. Here’s what I don’t understand: [specific question]. I’ve tried [what you already did]. Can anyone explain like I’m 5?”</p>
             </div>
             
             <h3 class="font-display font-bold text-xl mt-6 mb-2">Community rules:</h3>
             <ul class="list-disc pl-5 mt-2 space-y-1">
               <li>No shaming. If someone mocks a question, they get a warning.</li>
               <li>The best answer gets an “Explainer” badge and XP.</li>
               <li>Upvote helpful answers.</li>
             </ul>
          `
       },
       {
          id: "lesson-14.4",
          title: "Your 5‑year investment roadmap (Visualize it)",
          readTime: "2 minutes",
          content: `
             <p>You’ve learned the tools. Now build your personal roadmap. Adjust based on your income.</p>
             
             <h3 class="font-display font-bold text-xl mt-6 mb-2">What to do each year:</h3>
             <ul class="list-disc pl-5 mt-2 space-y-2">
               <li><strong>January:</strong> Review your animal type (retake test if life changed).</li>
               <li><strong>April:</strong> Check taxes – did you use tax-loss harvesting?</li>
               <li><strong>July:</strong> Rebalance portfolio back to target percentages.</li>
               <li><strong>October:</strong> Update your Lotus Goal (income change? new dreams?).</li>
             </ul>
          `
       }
    ]
  }
];
