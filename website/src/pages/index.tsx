import { Changes } from './../components/Changes';
import { Icons } from './../components/Icons';
import { detect } from 'detect-browser';
import type { NextPage } from 'next';
import Image from 'next/image';
import { useEffect, useState } from 'react';

import GitIcon from '../assets/GitIcon';
import { Logo } from '../components/Logo';

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
    <div className="bg-primary">
      <div className="relative min-h-screen flex flex-col">
        <header className="h-14 flex items-center justify-between">
          <Logo />
          <Icons />
        </header>
        <div className="flex flex-1 flex-col-reverse xl:flex-row z-10 xl:space-x-10 items-center justify-center w-full px-6 xl:px-8">
          <div className="flex flex-col max-w-2xl text-center xl:text-left space-y-8">
            <h1 className="text-gray-300 text-5xl mb-2 leading-tight">
              Easy and intuitive way to{' '}
              <span className="text-secondary">navigate</span> through tabs and
              history
            </h1>
            <p className="text-gray-400 text-xl">
              <span className="text-secondary opacity-70">Tab Master</span> is
              an easy-to-use chrome extension for increasing your productivity
              by providing an easy and intuitive way to navigate through tabs
              and history.
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
          <div className="aspect-video relative opacity-60 w-full sm:w-10/12 max-w-[750px] mb-12 xl:mb-0 xl:min-w-[724px] xl:max-w-[800px]">
            <Image src="/tab-master.gif" alt="No img" layout="fill" />
          </div>
        </div>
      </div>
      <Changes />
    </div>
  );
};

export default Home;
