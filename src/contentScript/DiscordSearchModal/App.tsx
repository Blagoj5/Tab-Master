/* eslint-disable no-undef */
import {
  Box, Center, ChakraProvider, Input, VStack,
} from '@chakra-ui/react';
import React, {
  useEffect, useMemo, useRef, useState,
} from 'react';

import theme from './theme';
import { isProduction } from './consts';
import {
  RecentOpenedTab, OpenedTab, Actions, CommonTab,
} from '../../common';
import OpenedTabs from './components/Panels/OpenedTabs';
import RecentOpenedTabs from './components/Panels/RecentOpenedTabs';
import CheckList from './components/CheckList';
import SearchedTabs from './components/Panels/SearchedTabs';
import { fuzzySearch, getFavicon, removeDuplicates } from './utils';
// TODO: make this lazy imports only for dev
import fakeTabs from './devData';
import recentTabs from './devData/recent-tabs.json';

function App() {
  const [showExtension, setShowExtension] = useState(false);
  const portRef = useRef<chrome.runtime.Port>();

  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState('');

  const [recentOpenedTabs, setRecentOpenedTabs] = useState<RecentOpenedTab[]>([]);
  const [openedTabs, setOpenedTabs] = useState<OpenedTab[]>([]);

  const combinedSelectedTabs = useMemo(
    () => {
      const combinedTabs = [
      // flat map is used for filtering + mapping
        ...openedTabs.flatMap<CommonTab>((tab) => {
          if (
            !tab.url
					|| !tab.title
					|| !tab.favIconUrl
          ) return [];

          return [{
            faviconUrl: tab.favIconUrl,
            id: tab.virtualId,
            title: tab.title,
            url: tab.url,
          }];
        }),
        ...recentOpenedTabs.flatMap<CommonTab>((tab) => {
          if (
            !tab.url
					|| !tab.title
					|| !tab.url
          ) return [];

          return [{
            faviconUrl: getFavicon(tab.url),
            id: tab.id,
            title: tab.title,
            url: tab.url,
          }];
        }),
      ];

      const filteredCombinedTabs = fuzzySearch(combinedTabs, { keys: ['title', 'url'] }, inputValue);

      return removeDuplicates(filteredCombinedTabs);
    },
	 [openedTabs, recentOpenedTabs, inputValue],
  );
  const combinedSelectedTabIds = useMemo(
    () => combinedSelectedTabs.map(({ id }) => id),
	 [combinedSelectedTabs],
  );

  const [selectedTabId, setSelectedTabId] = useState('');

  const closeExtension = () => {
    setShowExtension(false);
    setInputValue('');
  };

  useEffect(() => {
    if (isProduction) {
      chrome.runtime.onConnect.addListener((port) => {
        portRef.current = port;

        port.onMessage.addListener((message: Actions) => {
          switch (message.type) {
            case 'open-tab-master':
              setShowExtension(true);
              inputRef.current?.focus();
              setOpenedTabs(message.tabs.open.map((tab) => ({
                ...tab,
                virtualId: `${tab.id}-opened-tab`,
              })));
              setRecentOpenedTabs(message.tabs.recent.map((tab) => ({
                ...tab,
                faviconUrl: getFavicon(tab.url || ''),
              })));
              break;

            case 'close-tab-master':
              setShowExtension(false);
              break;

            default:
              break;
          }
        });
      });
    } else {
      setOpenedTabs(fakeTabs);
      setRecentOpenedTabs(recentTabs.map((tab) => ({
        ...tab,
        faviconUrl: getFavicon(tab.url),
      })));
    }

    document.addEventListener('keydown', ({
      repeat, key, ctrlKey, metaKey,
    }) => {
      if (repeat) return;

      // for Windows and MacOS
      if (!isProduction && (ctrlKey || metaKey) && key === 'k') {
        setShowExtension(true);
        inputRef.current?.focus();
      }

      // (function () {
      //   let useVimLikeEscape = true;
      //   Utils.monitorChromeStorage('useVimLikeEscape', (value) => useVimLikeEscape = value);

      //   return function (event) {
      // <c-[> is mapped to Escape in Vim by default.
      // Escape with a keyCode 229 means that this event comes from IME,
      // and should not be treated as a
      // direct/normal Escape event.  IME will handle the event, not vimium.
      // See https://lists.w3.org/Archives/Public/www-dom/2010JulSep/att-0182/keyCode-spec.html
      //     return ((event.key === 'Escape') && (event.keyCode !== 229))
      // || (useVimLikeEscape && (this.getKeyCharString(event) === '<c-[>'));
      //   };
      // }());
      if (key === 'Escape') {
        closeExtension();
      }
    });

    // TODO: remove event listeners
  }, []);

  useEffect(() => {
    if (showExtension && combinedSelectedTabs.length) {
      setSelectedTabId(combinedSelectedTabs[0].id);
    }
  }, [showExtension, combinedSelectedTabs]);

  const handleSwitchTab = (tabId: number) => {
    if (!isProduction) return;

    const payload: Actions = {
      type: 'switch-tab',
      tabId,
    };

    portRef.current?.postMessage(payload);

    // close extension
    closeExtension();
  };

  const handleOpenTab = (tabUrl: string) => {
    if (!isProduction) return;

    const payload: Actions = {
      type: 'open-tab',
      newTabUrl: tabUrl,
    };

    portRef.current?.postMessage(payload);

    // close extension
    closeExtension();
  };

  const handleTabSelect = () => {
    const selectedTabIndex = combinedSelectedTabIds.findIndex((id) => id === selectedTabId);

    const pickedId = combinedSelectedTabIds[selectedTabIndex];

    // OPENED TABS
    const openTab = openedTabs.find(({ virtualId }) => virtualId === pickedId);
    if (openTab?.id) {
      handleSwitchTab(openTab.id);
    }

    // RECENT OPENED TABS
    const recentOpenTab = recentOpenedTabs.find(({ id }) => id === pickedId);
    if (recentOpenTab?.url) {
      handleOpenTab(recentOpenTab.url);
    }
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    const selectedTabIndex = combinedSelectedTabIds.findIndex((id) => id === selectedTabId);

    // on enter
    if (e.code === 'Enter' && selectedTabId) {
      e.preventDefault();
      handleTabSelect();
      return;
    }

    // arrow up/down button should select next/previous list element
    if (e.code === 'ArrowUp') {
      e.preventDefault();

      const nextSuggestionOrder = selectedTabIndex - 1;
      // if the suggestion order goes bellow zero, start over again
      const order = nextSuggestionOrder < 0
        ? combinedSelectedTabIds.length - 1
        : nextSuggestionOrder;

      const prevTabId = combinedSelectedTabIds[order];

      // TODO: THIS IS NOT WORKING FOR combinedTABs, add better handling of ids
      document.getElementById(prevTabId)?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });

      setSelectedTabId(prevTabId);
    } else if (e.code === 'ArrowDown') {
      const prevSuggestionOrder = selectedTabIndex + 1;
      // suggestion goes above the upper limit
      const order = prevSuggestionOrder > combinedSelectedTabIds.length - 1
        ? 0
        : prevSuggestionOrder;

      const nextTabId = combinedSelectedTabIds[order];

      document.getElementById(nextTabId)?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });

      setSelectedTabId(nextTabId);
    } else {
      setSelectedTabId('');
    }
  };

  if (!showExtension) return null;

  // TODO: add font-sizes everywhere
  // TODO: add icons for different tabs:
  // TODO:  - Recent Tabs EXTERNAL LINK ICON
  // TODO:  - OPEN Tabs SWITCH ICON
  return (
    <ChakraProvider theme={theme}>
      <Center
        h="100vh"
        position="fixed"
        top={0}
        left={0}
        right={0}
        bottom={0}
        // fontFamily="Fira Sans"
      >
        {/* Backdrop */}
        <Box
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          zIndex={1}
          onClick={() => setShowExtension(false)}
          bg="hsl(0deg 0% 0% / 28%)"
        />

        <Box
          bg="primary.400"
          p={6}
          w="650px"
          zIndex={1000}
          h="400px"
          overflow="hidden"
          rounded="lg"
          d="flex"
          flexDirection="column"
        >
          <CheckList />
          <Input
            ref={inputRef}
            bg="input.400"
            color="white"
            placeholder="Where would you like to go?"
            _placeholder={{
              color: 'input.100',
            }}
            border="none"
            fontSize="1.3rem"
            py={8}
            mb={4}
            _focus={{}}
            shadow="xl"
            value={inputValue}
            onKeyDown={handleKeyDown}
            onChange={(e) => {
              setInputValue(e.target.value);
            }}
          />
          {inputValue
            ? (
              <SearchedTabs
                tabs={combinedSelectedTabs}
                clickCallbackField="id"
                selectedTabId={selectedTabId}
                onTabClicked={handleTabSelect}
              />
            )
            : (
              <VStack align="flex-start" spacing={3} flex={1} overflowY="auto">
                <OpenedTabs
                  headingTitle="OPEN TABS"
                  tabs={openedTabs}
                  onTabClicked={handleSwitchTab}
                  selectedTabId={selectedTabId}
                />
                <RecentOpenedTabs
                  headingTitle="PREVIOUSLY OPENED TABS"
                  tabs={recentOpenedTabs}
                  onTabClicked={handleOpenTab}
                  selectedTabId={selectedTabId}
                />
                {/* <OpenedTabs
              panelId="common-opened-tab"
              headingTitle="COMMON USED TABS (SOON)"
              tabs={[]}
              onTabClicked={handleSwitchTab}
              selectedTabId={selectedTabId}
            />
            <OpenedTabs
              panelId="bookmark"
              headingTitle="BOOKMARK (SOON)"
              tabs={[]}
              onTabClicked={handleSwitchTab}
              selectedTabId={selectedTabId}
            />
            <OpenedTabs
              panelId="history"
              headingTitle="HISTORY (SOON)"
              tabs={[]}
              onTabClicked={handleSwitchTab}
              selectedTabId={selectedTabId}
            /> */}
              </VStack>
            )}
        </Box>
      </Center>
    </ChakraProvider>
  );
}

export default App;
