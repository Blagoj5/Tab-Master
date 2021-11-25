/* eslint-disable no-undef */
import {
  Box, Center, ChakraProvider, Input, VStack,
} from '@chakra-ui/react';

import {
  useEffect, useMemo, useRef, useState,
} from 'react';
import theme from './theme';
import Panel from './components/Panel';
import CheckList from './components/CheckList';
import { Actions, OpenedTab } from './types';
import fakeTabs from './devData';
import useFuzzySearch from './data/hooks';
import { isProduction, EXTENSION_ID } from './consts';

function App() {
  const [showExtension, setShowExtension] = useState(false);
  const portRef = useRef<chrome.runtime.Port>();

  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState('');

  const [openedTabs, setOpenedTabs] = useState<OpenedTab[]>([]);
  const {
    filteredResults: filteredOpenedTabs,
    search,
    clear: clearFilteredOpenedTabs,
  } = useFuzzySearch(openedTabs, { keys: ['title', 'url'] });

  const [selectedTabId, setSelectedTabId] = useState('');

  const closeExtension = () => {
    setShowExtension(false);
    setInputValue('');
    clearFilteredOpenedTabs();
  };

  useEffect(() => {
    if (isProduction) {
      const port = chrome.runtime.connect(EXTENSION_ID, { name: 'init' });

      portRef.current = port;

      port.onMessage.addListener((message: Actions) => {
        switch (message.type) {
          case 'open-tab-master':
            setShowExtension(true);
            inputRef.current.focus();
            break;

          case 'close-tab-master':
            setShowExtension(false);
            break;

          case 'open-tabs':
            setOpenedTabs(
              message.tabs.map((tab) => ({
                ...tab,
                virtualId: `${tab.id}-opened-tab`,
              })),
            );
            break;

          default:
            break;
        }
      });
    } else {
      setOpenedTabs(fakeTabs);
    }

    document.addEventListener('keydown', ({
      repeat, key, ctrlKey, metaKey,
    }) => {
      if (repeat) return;

      // for Windows and MacOS
      if (!isProduction && (ctrlKey || metaKey) && key === 'k') {
        setShowExtension(true);
        inputRef.current.focus();
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

    // TODO: remove event listener
  }, []);

  const handleSwitchTab = (tabId: number) => {
    if (!isProduction) return;

    const payload: Actions = {
      type: 'switch-tab',
      tabId,
    };

    portRef.current.postMessage(payload);

    // close extension
    closeExtension();
  };

  const pickedTabs = useMemo(() => (
    filteredOpenedTabs ?? openedTabs
  ), [openedTabs, filteredOpenedTabs]);

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    const selectedTabIndex = pickedTabs.findIndex((tab) => tab.virtualId === selectedTabId);

    // on enter
    if (e.code === 'Enter' && selectedTabId) {
      e.preventDefault();

      const tabId = pickedTabs[selectedTabIndex].id;

      handleSwitchTab(tabId);

      return;
    }

    // arrow up/down button should select next/previous list element
    if (e.code === 'ArrowUp') {
      e.preventDefault();

      const nextSuggestionOrder = selectedTabIndex - 1;
      // if the suggestion order goes bellow zero, start over again
      const order = nextSuggestionOrder < 0
        ? pickedTabs.length - 1
        : nextSuggestionOrder;

      // eslint-disable-next-line max-len
      const prevTabId = pickedTabs[order].virtualId;

      document.getElementById(prevTabId).scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });

      setSelectedTabId(prevTabId);
    } else if (e.code === 'ArrowDown') {
      const prevSuggestionOrder = selectedTabIndex + 1;
      // suggesion goes above the upper limit
      const order = prevSuggestionOrder > pickedTabs.length - 1
        ? 0
        : prevSuggestionOrder;

      // eslint-disable-next-line max-len
      // autoCompleteItems?.[validOrderNumber]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
      const nextTabId = pickedTabs[order].virtualId;

      document.getElementById(nextTabId).scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });

      setSelectedTabId(nextTabId);
    } else {
      setSelectedTabId('');
    }
  };

  if (!showExtension) return null;

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
              search(e.target.value);
              setInputValue(e.target.value);
            }}
          />
          <VStack align="flex-start" spacing={3} flex={1} overflowY="auto">
            <Panel
              panelId="opened-tab"
              headingTitle="OPEN TABS"
              tabs={pickedTabs}
              onTabClicked={handleSwitchTab}
              selectedTabId={selectedTabId}
            />
            <Panel
              panelId="recently-opened-tab"
              headingTitle="PREVIOUSLY OPENED TABS (SOON)"
              tabs={[]}
              onTabClicked={handleSwitchTab}
              selectedTabId={selectedTabId}
            />
            <Panel
              panelId="common-opened-tab"
              headingTitle="COMMON USED TABS (SOON)"
              tabs={[]}
              onTabClicked={handleSwitchTab}
              selectedTabId={selectedTabId}
            />
            <Panel
              panelId="bookmark"
              headingTitle="BOOKMARK (SOON)"
              tabs={[]}
              onTabClicked={handleSwitchTab}
              selectedTabId={selectedTabId}
            />
            <Panel
              panelId="history"
              headingTitle="HISTORY (SOON)"
              tabs={[]}
              onTabClicked={handleSwitchTab}
              selectedTabId={selectedTabId}
            />
          </VStack>
        </Box>
      </Center>
    </ChakraProvider>
  );
}

export default App;
