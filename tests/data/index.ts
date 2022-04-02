// TODO: add more
export const recentTabs = [
  'https://fitnessdocumentation.com',
  'https://google.com',
  'https://codechem.com',
  'https://facebook.com',
  'https://linkedin.com',
  'https://youtube.com',
  // 'https://codepen.io/',
  'https://github.com/Blagoj5/Tab-Master',
  'https://github.com/nikolovlazar/taskie',
  'https://github.com/aacevski/unwrapit.me',
  'https://github.com/iboshkov/chakra-ui',
];

export const openTabs = [
  'https://fitnessdocumentation.com',
  'https://www.writingful.com/',
  'https://www.twitch.tv/dikkyman',
  'https://youtube.com',
  'https://github.com/Blagoj5/Tab-Master',
  'https://google.com',
];

export const intersectionRecentTabsComplement = recentTabs.filter(
  (tab) => !openTabs.includes(tab),
);
