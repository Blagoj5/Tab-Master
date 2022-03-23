import type { NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
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
const Home: NextPage = () => {
  return (
    <div className="bg-primary h-screen flex flex-col">
      <header className="h-14 flex items-center justify-between">
        {/* logo */}
        <Link href="/" passHref>
          <a className="flex items-center pl-2">
            <Image src="/icon128.png" alt="No Image" width="60" height="60" />
            <h3 className="text-2xl text-gray-300">tab master</h3>
          </a>
        </Link>
        {/* icons */}
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
      </header>
      <div className="flex flex-1 items-center justify-center">
        <div className="flex flex-col max-w-2xl text-center space-y-8">
          <h1 className="text-gray-300 text-5xl mb-2 leading-tight">
            Easy and intuitive way to{' '}
            <span className="text-secondary">navigate</span> trough tabs and
            history
          </h1>
          <p className="text-gray-400 text-xl">
            <span className="text-secondary opacity-70">Tab Master</span> is an
            easy-to-use chrome extension for increasing your productivity by
            providing an easy and intuitive way to navigate through tabs and
            history.
          </p>
          <div className="space-x-4">
            <a
              href="https://chrome.google.com/webstore/detail/tab-master/homcodpbmcdfhndhlnfnhofdnmlkplaa"
              target="_blank"
              className="bg-secondary py-4 px-14 rounded-md text-xl brown"
              rel="noreferrer"
            >
              Get Started &#10140;
            </a>
            <a
              href="https://github.com/Blagoj5/Tab-Master"
              target="_blank"
              className="inline-flex items-center text-gray-300 bg-black bg-opacity-25 py-4 px-14 rounded-md text-xl hover:bg-opacity-20"
              rel="noreferrer"
            >
              <GitIcon />
              <span className="ml-2">Github</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
