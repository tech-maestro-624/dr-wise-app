// Filter options for the home screen
export const filters = [
  { id: 'all', label: 'All', icon: 'checkmark-circle', active: true },
  { id: 'ins', label: 'Insurances', icon: 'shield-checkmark', active: false },
  { id: 'inv', label: 'Investments', icon: 'trending-up', active: false },
  { id: 'loans', label: 'Loans', icon: 'card', active: false },
  { id: 'tax', label: 'Tax', icon: 'receipt', active: false },
  { id: 'travel', label: 'Travel', icon: 'airplane', active: false },
];

// Insurance items data
export const insuranceItems = [
  { title: 'Life' },
  { title: 'Health' },
  { title: 'Motor' },
  { title: 'General' },
  { title: 'Travel' },
];

// Investment items data
export const investmentItems = [
  { title: 'Trading' },
  { title: 'NPS' },
  { title: 'LAS' },
  { title: 'Gold' },
  { title: 'BOND' },
  { title: 'Fixed' },
  { title: 'Mutual Fund' },
];

// Loan items data
export const loanItems = [
  { title: 'Business Loan' },
  { title: 'Mortgage Loan' },
  { title: 'Personal Loans' },
  { title: 'Home Loan' },
];

// Slider cards data
export const sliderCards = [
  {
    id: 1,
    backgroundColor: ['#4CAF50', '#66BB6A'],
    title: 'Earn While You Refer',
    subtitle: 'Share services you trust and\nget paid for every referral',
    buttonText: 'Start Now',
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/5ee1f76dd94b467d35cd958b74224a628b637374?width=284',
    badge: 'Popular'
  },
  {
    id: 2,
    backgroundColor: ['#9D4BFA', '#AF6CFA'],
    title: 'Earn While You Refer',
    subtitle: 'Share services you trust and\nget paid for every referral',
    buttonText: 'Start Now',
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/5ee1f76dd94b467d35cd958b74224a628b637374?width=284',
    badge: 'Popular'
  },
  {
    id: 3,
    backgroundColor: ['#F6AC11', '#FFB84D'],
    title: 'Earn While You Refer',
    subtitle: 'Share services you trust and\nget paid for every referral',
    buttonText: 'Start Now',
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/5ee1f76dd94b467d35cd958b74224a628b637374?width=284',
    badge: 'Popular'
  }
];
