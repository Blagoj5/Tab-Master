/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-undef */
import { useEffect, useMemo, useRef, useState } from 'react';
import Frame, { FrameContextConsumer } from 'react-frame-component';
import styled, { StyleSheetManager } from 'styled-components';
import {
  CommonTab,
  Actions,
  OpenedTab,
  RecentOpenedTab,
} from '@tab-master/common/build/types';

import { getFaviconURL, removeDuplicates } from './utils';
import { Backdrop, Center } from './styles';
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
  const portRef = useRef<browser.runtime.Port>();

  const [recentOpenedTabs, setRecentOpenedTabs] = useState<
    RecentOpenedTab[] | null
  >([]);
  const [openedTabs, setOpenedTabs] = useState<OpenedTab[] | null>([]);

  // flat map is used for filtering + mapping
  const transformedOpenedTabs = useMemo(
    () =>
      openedTabs
        ? removeDuplicates(
            openedTabs.flatMap<CommonTab>((tab) => {
              if (!tab.url || !tab.title) return [];

              return [
                {
                  faviconUrl: tab.favIconUrl ?? getFaviconURL(tab.url),
                  id: tab.virtualId,
                  title: tab.title,
                  url: tab.url,
                  action: 'switch',
                },
              ];
            }),
          )
        : [],
    [openedTabs],
  );

  const transformedRecentOpenedTabs = useMemo(
    () =>
      recentOpenedTabs
        ? removeDuplicates(
            recentOpenedTabs.flatMap<CommonTab>((tab) => {
              if (!tab.url || !tab.title) return [];

              return [
                {
                  faviconUrl: getFaviconURL(tab.url),
                  id: tab.id,
                  title: tab.title,
                  url: tab.url,
                  action: 'open',
                  visitCount: tab.visitCount,
                },
              ];
            }),
          )
        : [],
    [recentOpenedTabs],
  );

  const closeExtension = () => {
    // changing the focus from the iframe to the body, since the main
    // event listener is there
    window.focus();
    setShowExtension(false);
  };

  useEffect(() => {
    const onConnect = (port: browser.runtime.Port) => {
      portRef.current = port;

      port.onMessage.addListener((message: object) => {
        const isActions = (data: object): data is Actions => Boolean(data);
        if (!isActions(message)) return;

        switch (message.type) {
          case 'open-tab-master':
            setShowExtension(true);
            setOpenedTabs(
              message.tabs.open?.map((tab) => ({
                ...tab,
                virtualId: `${tab.id}-opened-tab`,
              })) ?? null,
            );
            setRecentOpenedTabs(
              message.tabs.recent?.map((tab) => ({
                ...tab,
                faviconUrl: getFaviconURL(tab.url || ''),
              })) ?? null,
            );
            break;
          case 'current-state':
            setOpenedTabs(
              message.tabs.open?.map((tab) => ({
                ...tab,
                virtualId: `${tab.id}-opened-tab`,
              })) ?? null,
            );
            setRecentOpenedTabs(
              message.tabs.recent?.map((tab) => ({
                ...tab,
                faviconUrl: getFaviconURL(tab.url || ''),
              })) ?? null,
            );
            break;

          case 'send-recent-tabs':
            setRecentOpenedTabs(
              message.tabs?.map((tab) => ({
                ...tab,
                faviconUrl: getFaviconURL(tab.url || ''),
              })) ?? null,
            );
            break;

          case 'close-tab-master':
            setShowExtension(false);
            break;

          default:
            break;
        }
      });
    };

    browser.runtime.onConnect.addListener(onConnect);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) return;

      // for Windows, ctrl + k has native binding
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        if (!showExtension) browser.runtime.sendMessage('open-tab-master');
      }
    };

    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      browser.runtime.onConnect.removeListener(onConnect);
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
    const openTab = openedTabs?.find(
      ({ virtualId }) => virtualId === selectedTabId,
    );
    if (openTab?.id) {
      handleSwitchTab(openTab.id);
    }

    // RECENT OPENED TABS
    const recentOpenTab = recentOpenedTabs?.find(
      ({ id }) => id === selectedTabId,
    );
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
                  searchHistory={handleOnChange}
                  handleTabSelect={handleTabSelect}
                  openedTabs={transformedOpenedTabs}
                  recentTabs={transformedRecentOpenedTabs}
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
