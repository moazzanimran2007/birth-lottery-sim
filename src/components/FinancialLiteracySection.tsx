const RESOURCES = [
  {
    category: 'Learn',
    items: [
      {
        title: 'Khan Academy — Finance & Capital Markets',
        description: 'Free courses on interest, debt, investing, and macroeconomics. Start here.',
        url: 'https://www.khanacademy.org/economics-finance-domain',
      },
      {
        title: 'Investopedia Financial Terms Dictionary',
        description: 'Plain-language explanations of every financial concept you\'ll encounter.',
        url: 'https://www.investopedia.com/financial-term-dictionary-4769738',
      },
      {
        title: 'FDIC Money Smart Program',
        description: 'Free financial education curriculum from the federal government.',
        url: 'https://www.fdic.gov/resources/consumers/money-smart/index.html',
      },
    ],
  },
  {
    category: 'Tools',
    items: [
      {
        title: 'Compound Interest Calculator',
        description: 'See how $100/month grows over 10, 20, 30 years at different rates.',
        url: 'https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator',
      },
      {
        title: 'Student Loan Repayment Estimator',
        description: 'Federal tool to estimate monthly payments under different repayment plans.',
        url: 'https://studentaid.gov/loan-simulator/',
      },
      {
        title: 'CFPB "Owning a Home" Tool',
        description: 'Explore mortgage rates, closing costs, and what you can actually afford.',
        url: 'https://www.consumerfinance.gov/owning-a-home/',
      },
    ],
  },
  {
    category: 'Take Action',
    items: [
      {
        title: 'Find Free Tax Prep (VITA)',
        description: 'IRS Volunteer Income Tax Assistance — free tax filing for incomes under $64,000.',
        url: 'https://www.irs.gov/individuals/free-tax-return-preparation-for-qualifying-taxpayers',
      },
      {
        title: 'Benefits.gov',
        description: 'Check which government benefits you qualify for — many go unclaimed.',
        url: 'https://www.benefits.gov/',
      },
      {
        title: 'National Foundation for Credit Counseling',
        description: 'Free or low-cost counseling for debt, budgeting, and financial planning.',
        url: 'https://www.nfcc.org/',
      },
    ],
  },
];

const KEY_STATS = [
  { stat: '56%', context: 'of Americans can\'t cover a $1,000 emergency with savings' },
  { stat: '$121K', context: 'median inheritance for white families vs. $52K for Black families' },
  { stat: '11.5%', context: 'of children born in the bottom 20% reach the top 20% in the US' },
  { stat: '1,260%', context: 'increase in student loan debt since 1980 (inflation-adjusted)' },
];

export default function FinancialLiteracySection() {
  return (
    <section className="px-4 md:px-8 py-20 max-w-3xl mx-auto">
      <h2 className="font-heading text-2xl md:text-3xl mb-3 text-center"
          style={{ color: 'hsl(0, 0%, 70%)' }}>
        What you can do about it
      </h2>
      <p className="font-body text-sm text-center mb-16"
         style={{ color: 'hsl(0, 0%, 45%)' }}>
        Structural problems need structural solutions. But knowledge is the first step.
      </p>

      {/* Key statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
        {KEY_STATS.map(item => (
          <div key={item.stat} className="text-center">
            <p className="font-heading text-2xl md:text-3xl mb-1"
               style={{ color: 'hsl(43, 56%, 54%)' }}>
              {item.stat}
            </p>
            <p className="font-body text-xs leading-relaxed"
               style={{ color: 'hsl(0, 0%, 45%)' }}>
              {item.context}
            </p>
          </div>
        ))}
      </div>

      {/* Resources by category */}
      <div className="space-y-14">
        {RESOURCES.map(category => (
          <div key={category.category}>
            <p className="font-body text-[10px] uppercase tracking-[0.3em] mb-5"
               style={{ color: 'hsl(43, 56%, 54%)' }}>
              {category.category}
            </p>
            <div className="space-y-4">
              {category.items.map(item => (
                <a
                  key={item.title}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 border rounded-sm transition-all duration-300 group"
                  style={{
                    borderColor: 'hsl(0, 0%, 18%)',
                    backgroundColor: 'transparent',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'hsl(43, 56%, 54%, 0.5)';
                    (e.currentTarget as HTMLElement).style.backgroundColor = 'hsl(0, 0%, 8%)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'hsl(0, 0%, 18%)';
                    (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                  }}
                >
                  <p className="font-heading text-sm mb-1" style={{ color: 'hsl(0, 0%, 72%)' }}>
                    {item.title} <span style={{ color: 'hsl(43, 56%, 54%)' }}>↗</span>
                  </p>
                  <p className="font-body text-xs" style={{ color: 'hsl(0, 0%, 42%)' }}>
                    {item.description}
                  </p>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
