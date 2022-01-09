/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-undef */
import {
  useEffect, useMemo, useRef, useState,
} from 'react';
import Frame, { FrameContextConsumer } from 'react-frame-component';
import styled, { StyleSheetManager } from 'styled-components';
import {
  CommonTab, Actions, OpenedTab, RecentOpenedTab,
} from '@tab-master/common/build/types';

import { getFavicon } from './utils';
import {
  Backdrop, Center,
} from './styles';
import Modal from './components/Modal';
import SettingsProvider from './components/SettingsProvider';

const ModalFrame = styled(Frame)<{ isVisible: boolean }>`
	width: 650px;
	height: 432px;
	z-index: 1000;
	padding: 0;
	border: 0;
	overflow: hidden;
	border-radius: 0.625rem;
`;

const Container = styled(Center)<{ isVisible: boolean }>`
	display: ${(props) => (props.isVisible ? 'flex' : 'none')};
`;

function App() {
  const [showExtension, setShowExtension] = useState(false);
  const portRef = useRef<chrome.runtime.Port>();

  const [recentOpenedTabs, setRecentOpenedTabs] = useState<RecentOpenedTab[] | null>([]);
  const [openedTabs, setOpenedTabs] = useState<OpenedTab[] | null>([]);

  // flat map is used for filtering + mapping
  const transformedOpenedTabs = useMemo(() => openedTabs?.flatMap<CommonTab>((tab) => {
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

  const transformedRecentOpenedTabs = useMemo(() => recentOpenedTabs?.flatMap<CommonTab>((tab) => {
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
      visitCount: tab.visitCount,
    }];
  }), [recentOpenedTabs]);

  const closeExtension = () => {
    setShowExtension(false);
  };

  useEffect(() => {
    const onConnect = (port: chrome.runtime.Port) => {
      portRef.current = port;

      port.onMessage.addListener((message: Actions) => {
        switch (message.type) {
          case 'open-tab-master':
            setShowExtension(true);
            setOpenedTabs(message.tabs.open?.map((tab) => ({
              ...tab,
              virtualId: `${tab.id}-opened-tab`,
            })) ?? null);
            setRecentOpenedTabs(message.tabs.recent?.map((tab) => ({
              ...tab,
              faviconUrl: getFavicon(tab.url || ''),
            })) ?? null);
            break;
          case 'current-state':
            setOpenedTabs(message.tabs.open?.map((tab) => ({
              ...tab,
              virtualId: `${tab.id}-opened-tab`,
            })) ?? null);
            setRecentOpenedTabs(message.tabs.recent?.map((tab) => ({
              ...tab,
              faviconUrl: getFavicon(tab.url || ''),
            })) ?? null);
            break;

          case 'send-recent-tabs':
            setRecentOpenedTabs(message.tabs?.map((tab) => ({
              ...tab,
              faviconUrl: getFavicon(tab.url || ''),
            })) ?? null);
            break;

          case 'close-tab-master':
            setShowExtension(false);
            break;

          default:
            break;
        }
      });
    };

    chrome.runtime.onConnect.addListener(onConnect);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) return;

      // for Windows, ctrl + k has native binding
      if ((event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        chrome.runtime.sendMessage('open-tab-master');
      }

      // TODO: this might be useless, since the focus is in the iframe
      if (event.key === 'Escape') {
        event.preventDefault();
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
    const payload: Actions = {
      type: 'switch-tab',
      tabId,
    };

    portRef.current?.postMessage(payload);

    // close extension
    closeExtension();
  };

  const handleOpenTab = (tabUrl: string) => {
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
    const openTab = openedTabs?.find(({ virtualId }) => virtualId === selectedTabId);
    if (openTab?.id) {
      handleSwitchTab(openTab.id);
    }

    // RECENT OPENED TABS
    const recentOpenTab = recentOpenedTabs?.find(({ id }) => id === selectedTabId);
    if (recentOpenTab?.url) {
      handleOpenTab(recentOpenTab.url);
    }
  };

  const handleOnChange = (value: string) => {
    const payload: Actions = {
      type: 'search-history',
      keyword: value,
    };

    portRef.current?.postMessage(payload);
  };

  // TODO: add font-sizes everywhere
  return (
    <Container isVisible={showExtension}>
      <Backdrop onClick={() => setShowExtension(false)} />

      <ModalFrame>
        <FrameContextConsumer>
          {(frameContext: any) => (
            <StyleSheetManager target={frameContext.document.head}>
              <SettingsProvider>
                <Modal
                  onChange={handleOnChange}
                  handleTabSelect={handleTabSelect}
                  transformedOpenedTabs={transformedOpenedTabs}
                  transformedRecentOpenedTabs={transformedRecentOpenedTabs}
                  closeExtension={closeExtension}
                  showExtension={showExtension}
                />
              </SettingsProvider>
            </StyleSheetManager>
          )}
        </FrameContextConsumer>
      </ModalFrame>
    </Container>
  );
}

export default App;
