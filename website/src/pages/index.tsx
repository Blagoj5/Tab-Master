import { detect } from 'detect-browser';
import type { NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';
import { useState } from 'react';
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
  const [extensionUrl, setExtensionUrl] = useState(
    'https://chrome.google.com/webstore/detail/tab-master/homcodpbmcdfhndhlnfnhofdnmlkplaa',
  );
  useEffect(() => {
    const detectedBrowser = detect();

    const url =
      detectedBrowser?.name === 'firefox'
        ? 'https://addons.mozilla.org/en-GB/firefox/addon/tab-master-pro/'
        : 'https://chrome.google.com/webstore/detail/tab-master/homcodpbmcdfhndhlnfnhofdnmlkplaa';

    setExtensionUrl(url);
  }, []);
  return (
    <div className="relative bg-primary h-screen min-h-50 flex flex-col">
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
      <div className="flex flex-1 flex-col-reverse xl:flex-row z-10 xl:space-x-10 items-center justify-center w-full px-6 xl:px-8">
        <div className="flex flex-col max-w-2xl text-center xl:text-left space-y-8">
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
          <div className="flex flex-col space-y-6 sm:space-x-4 sm:block">
            <a
              href={extensionUrl}
              target="_blank"
              className="bg-secondary py-4 px-14 rounded-md text-xl brown"
              rel="noreferrer"
            >
              Get Started &#10140;
            </a>
            <a
              href="https://github.com/Blagoj5/Tab-Master"
              target="_blank"
              className="inline-flex items-center justify-center text-gray-300 bg-black bg-opacity-25 py-4 px-14 rounded-md text-xl hover:bg-opacity-20"
              rel="noreferrer"
            >
              <GitIcon />
              <span className="ml-2">Github</span>
            </a>
          </div>
        </div>
        <div className="aspect-video relative opacity-60 w-full sm:w-10/12 max-w-[750px] mb-12 xl:mb-0 xl:min-w-[730px] xl:max-w-[800px]">
          <Image src="/tab-master.gif" alt="No img" layout="fill" />
        </div>
      </div>
    </div>
  );
};

export default Home;
