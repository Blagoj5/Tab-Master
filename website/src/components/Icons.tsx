import React from 'react';

import GitIcon from '../assets/GitIcon';
import YoutubeIcon from '../assets/YoutubeIcon';

const links = [
  {
    link: 'https://github.com/Blagoj5/Tab-Master',
    asset: <GitIcon />,
  },
  {
    link: 'https://www.youtube.com/watch?v=v-OYzhYR0s8',
    asset: <YoutubeIcon />,
  },
  {
    link: 'https://www.buymeacoffee.com/blagoj5',
    asset: (
      <button className="bg-gray-50 py-1 px-3 rounded-md">Sponsor Us ♥</button>
    ),
  },
];

export function Icons() {
  return (
    <div className="flex flex-1 items-center justify-end space-x-4 pr-6">
      {links.map(({ link, asset }) => (
        <a
          key={link}
          href={link}
          className="h-fit"
          target="_blank"
          rel="noreferrer"
        >
          {asset}
        </a>
      ))}
    </div>
  );
}
