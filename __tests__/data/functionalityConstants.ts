// TODO: add more
export const recentTabs = [
  {
    url: 'https://fitnessdocumentation.com',
    keywords: ['fitnessdocumentation', 'fitness', 'fitness:Fitness'],
  },
  {
    url: 'https://google.com',
    keywords: [],
  },
  {
    url: 'https://codechem.com',
    keywords: [],
  },
  {
    url: 'https://facebook.com',
    keywords: [],
  },
  {
    url: 'https://linkedin.com',
    keywords: [],
  },
  {
    url: 'https://youtube.com',
    keywords: [],
  },
  {
    url: 'https://codepen.io/',
    keywords: [],
  },
  {
    url: 'https://github.com/Blagoj5/Tab-Master',
    keywords: [],
  },
  {
    url: 'https://github.com/nikolovlazar/taskie',
    keywords: [],
  },
  {
    url: 'https://github.com/aacevski/unwrapit.me',
    keywords: [],
  },
  {
    url: 'https://github.com/iboshkov/chakra-ui',
    keywords: [],
  },
];

export const openTabs = [
  {
    url: 'https://fitnessdocumentation.com',
    keywords: [],
  },
  {
    url: 'https://www.writingful.com/',
    keywords: [],
  },
  {
    url: 'https://www.twitch.tv/dikkyman',
    keywords: [],
  },
  {
    url: 'https://youtube.com',
    keywords: [],
  },
  {
    url: 'https://github.com/Blagoj5/Tab-Master',
    keywords: [],
  },
  {
    url: 'https://google.com',
    keywords: [],
  },
];

export const intersectionRecentTabsComplement = recentTabs.filter(
  (tab) => !openTabs.includes(tab),
);
