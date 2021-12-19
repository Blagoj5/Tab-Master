/* eslint-disable no-undef */
import {
  useEffect, useMemo, useRef, useState,
} from 'react';
import Frame, { FrameContextConsumer } from 'react-frame-component';
import styled, { StyleSheetManager } from 'styled-components';
import { CommonTab, Actions, OpenedTab, RecentOpenedTab } from '@tab-master/common';

import { isProduction } from './consts';
import { getFavicon } from './utils';
import fakeTabs from './devData';
import recentTabs from './devData/recent-tabs.json';
import {
  Backdrop, Center,
} from './styles';
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

  const closeExtension = () => {
    setShowExtension(false);
  };

  // TODO: move all event keydown listener to the background script
  useEffect(() => {
    const onConnect = (port: chrome.runtime.Port) => {
      portRef.current = port;

      port.onMessage.addListener((message: Actions) => {
        switch (message.type) {
          case 'open-tab-master':
            setShowExtension(true);
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
      }

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

  const handleTabSelect = (selectedTabId: string) => {
    // OPENED TABS
    const openTab = openedTabs.find(({ virtualId }) => virtualId === selectedTabId);
    if (openTab?.id) {
      handleSwitchTab(openTab.id);
    }

    // RECENT OPENED TABS
    const recentOpenTab = recentOpenedTabs.find(({ id }) => id === selectedTabId);
    if (recentOpenTab?.url) {
      handleOpenTab(recentOpenTab.url);
    }
  };

  const handleOnChange = (value: string) => {
    if (!value) return;

    const payload: Actions = {
      type: 'search-history',
      keyword: value,
    };

    portRef.current?.postMessage(payload);
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
                onChange={handleOnChange}
                handleTabSelect={handleTabSelect}
                transformedOpenedTabs={transformedOpenedTabs}
                transformedRecentOpenedTabs={transformedRecentOpenedTabs}
                closeExtension={closeExtension}
              />
            </StyleSheetManager>
          )}
        </FrameContextConsumer>
      </ModalFrame>
    </Center>
  );
}

export default App;