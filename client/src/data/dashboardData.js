export const statCardsData = [
  {
    id: 'balance',
    title: 'Available Balance',
    value: '$8,338.00',
    trend: '+38.8%',
    trendType: 'positive',
    subtext: 'for Past 30 Days',
    glowColor: 'rgba(0, 82, 255, 0.15)', // Electric blue glow
  },
  {
    id: 'income',
    title: 'Total Income',
    value: '$38,148.00',
    trend: '+25.0%',
    trendType: 'positive',
    subtext: 'for Past 30 Days',
    glowColor: 'rgba(16, 185, 129, 0.15)', // Green glow
  },
  {
    id: 'expenses',
    title: 'Total Expenses',
    value: '-$29,810.00',
    trend: '-21.6%',
    trendType: 'negative',
    subtext: 'for Past 30 Days',
    glowColor: 'rgba(239, 68, 68, 0.15)', // Red glow
  },
  {
    id: 'savings',
    title: 'Savings Rate',
    value: '21.9%',
    trend: 'High Spend',
    trendType: 'neutral',
    subtext: '78% spent of income',
    glowColor: 'rgba(139, 92, 246, 0.15)', // Purple glow
  }
];

export const recentTransactions = [
  {
    id: 't1',
    merchant: 'Figma Subscription',
    category: 'Software',
    amount: '-$45.00',
    type: 'expense',
    date: 'Jun 24, 2026',
    status: 'Completed',
  },
  {
    id: 't2',
    merchant: 'Acme Corp Monthly Retainer',
    category: 'Freelance',
    amount: '+$4,500.00',
    type: 'income',
    date: 'Jun 23, 2026',
    status: 'Completed',
  },
  {
    id: 't3',
    merchant: 'Whole Foods Market',
    category: 'Meals & Groceries',
    amount: '-$189.50',
    type: 'expense',
    date: 'Jun 22, 2026',
    status: 'Completed',
  },
  {
    id: 't4',
    merchant: 'Amazon Web Services',
    category: 'Software',
    amount: '-$1,240.00',
    type: 'expense',
    date: 'Jun 21, 2026',
    status: 'Pending',
  },
  {
    id: 't5',
    merchant: 'Stripe Transfer',
    category: 'Salary',
    amount: '+$8,200.00',
    type: 'income',
    date: 'Jun 20, 2026',
    status: 'Completed',
  },
  {
    id: 't6',
    merchant: 'Starbucks Coffee',
    category: 'Meals & Groceries',
    amount: '-$6.75',
    type: 'expense',
    date: 'Jun 19, 2026',
    status: 'Completed',
  },
  {
    id: 't7',
    merchant: 'Uber Rides',
    category: 'Transport',
    amount: '-$24.30',
    type: 'expense',
    date: 'Jun 18, 2026',
    status: 'Completed',
  }
];

export const expensesBreakdown = [
  {
    category: 'Meals & Groceries',
    amount: '$8,690.00',
    percentage: 29,
    color: '#F97316', // Orange
    textColor: 'text-orange-500',
    bgColor: 'bg-orange-500',
  },
  {
    category: 'Shopping & Retail',
    amount: '$7,555.00',
    percentage: 25,
    color: '#0052FF', // Electric blue
    textColor: 'text-blue-500',
    bgColor: 'bg-blue-500',
  },
  {
    category: 'Utilities & Rent',
    amount: '$5,370.00',
    percentage: 18,
    color: '#EAB308', // Yellow
    textColor: 'text-yellow-500',
    bgColor: 'bg-yellow-500',
  },
  {
    category: 'Software & Others',
    amount: '$8,195.00',
    percentage: 28,
    color: '#8B5CF6', // Purple
    textColor: 'text-purple-500',
    bgColor: 'bg-purple-500',
  }
];

export const transactionOverviewStats = {
  incomeCount: 29,
  expenseCount: 94,
  days: [
    { date: 'May 3', income: 4000, expenses: 2400 },
    { date: 'May 6', income: 3000, expenses: 1398 },
    { date: 'May 9', income: 2000, expenses: 9800 },
    { date: 'May 12', income: 2780, expenses: 3908 },
    { date: 'May 15', income: 1890, expenses: 4800 },
    { date: 'May 18', income: 2390, expenses: 3800 },
    { date: 'May 21', income: 3490, expenses: 4300 },
    { date: 'May 24', income: 4500, expenses: 2100 },
    { date: 'May 27', income: 5200, expenses: 3100 }
  ]
};
