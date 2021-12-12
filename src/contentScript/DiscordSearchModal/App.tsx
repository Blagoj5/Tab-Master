/* eslint-disable no-undef */
import React, {
  useEffect, useMemo, useRef, useState,
} from 'react';
import Frame, { FrameContextConsumer } from 'react-frame-component';

import styled, { StyleSheetManager } from 'styled-components';
import { isProduction } from './consts';
import {
  RecentOpenedTab, OpenedTab, Actions, CommonTab,
} from '../../common';
import { fuzzySearch, getFavicon, removeDuplicates } from './utils';
import fakeTabs from './devData';
import recentTabs from './devData/recent-tabs.json';
import {
  Backdrop, Center,
} from '../../common/styles';
import Modal from './components/Modal';

const ModalFrame = styled(Frame)`
	width: 650px;
	height: 432px;
	z-index: 1000;
	padding: 0;
	border: 0;
	overflow: hidden;
	border-radius: 0.625rem;
`;

function App() {
  const [showExtension, setShowExtension] = useState(false);
  const portRef = useRef<chrome.runtime.Port>();

  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState('');

  const [recentOpenedTabs, setRecentOpenedTabs] = useState<RecentOpenedTab[]>([]);
  const [openedTabs, setOpenedTabs] = useState<OpenedTab[]>([]);

  // flat map is used for filtering + mapping
  const transformedOpenedTabs = useMemo(() => openedTabs.flatMap<CommonTab>((tab) => {
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
      action: 'switch',
    }];
  }), [openedTabs]);

  const transformedRecentOpenedTabs = useMemo(() => recentOpenedTabs.flatMap<CommonTab>((tab) => {
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
      action: 'open',
    }];
  }), [recentOpenedTabs]);

  const [combinedSelectedTabs] = useMemo(
    () => {
      const combinedTabs = [
        ...transformedOpenedTabs,
        ...transformedRecentOpenedTabs,
      ];

      const filteredCombinedTabs = fuzzySearch(combinedTabs, { keys: ['title', 'url'] }, inputValue);

      return [
        removeDuplicates(filteredCombinedTabs),
        {
          transformedOpenedTabs,
          transformedRecentOpenedTabs,
        },
      ];
    },
	 [transformedRecentOpenedTabs, transformedOpenedTabs, inputValue],
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
    const onConnect = (port: chrome.runtime.Port) => {
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

          case 'send-recent-tabs':
            setRecentOpenedTabs(message.tabs.map((tab) => ({
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
    };

    if (isProduction) {
      chrome.runtime.onConnect.addListener(onConnect);
    } else {
      setOpenedTabs(fakeTabs);
      setRecentOpenedTabs(recentTabs.map((tab) => ({
        ...tab,
        faviconUrl: getFavicon(tab.url),
      })));
    }

    const onKeyDown = ({
      repeat, key, ctrlKey, metaKey,
    }: KeyboardEvent) => {
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
    };

    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      chrome.runtime.onConnect.removeListener(onConnect);
    };
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

    if (e.key === 'Escape') {
      closeExtension();
      return;
    }

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

  const handleOnChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setInputValue(e.target.value);
    if (e.target.value) {
      const payload: Actions = {
        type: 'search-history',
        keyword: e.target.value,
      };
      portRef.current?.postMessage(payload);
    }
  };

  if (!showExtension) return null;

  // TODO: add font-sizes everywhere
  return (
    <Center>
      <Backdrop onClick={() => setShowExtension(false)} />
      <ModalFrame>
        <FrameContextConsumer>
          {(frameContext: any) => (
            <StyleSheetManager target={frameContext.document.head}>
              <Modal
                combinedSelectedTabs={combinedSelectedTabs}
                handleKeyDown={handleKeyDown}
                handleOnChange={handleOnChange}
                handleTabSelect={handleTabSelect}
                onTabHover={setSelectedTabId}
                inputRef={inputRef}
                inputValue={inputValue}
                selectedTabId={selectedTabId}
                transformedOpenedTabs={transformedOpenedTabs}
                transformedRecentOpenedTabs={transformedRecentOpenedTabs}
              />
            </StyleSheetManager>
          )}
        </FrameContextConsumer>
      </ModalFrame>
    </Center>
  );
}

export default App;
