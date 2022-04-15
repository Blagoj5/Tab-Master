import { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import {
  CommonTab,
  Actions,
  OpenedTab,
  RecentOpenedTab,
} from '@tab-master/common/build/types';
//
import { getFaviconURL, removeDuplicates } from './utils';
import { Backdrop, Center, GlobalStyle } from './styles';
import Modal from './components/Modal';
import SettingsProvider from './components/SettingsProvider';
import { OPENED_TAB_SUFFIX } from './consts';

const ModalPane = styled.div`
  width: 650px;
  height: 432px;
  z-index: 1000;
  padding: 0;
  border: 0;
  overflow: hidden;
  border-radius: 0.625rem;
`;

const Container = styled(Center)`
  display: flex;
`;

function App() {
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
    window.close();
  };

  useEffect(() => {
    const port = browser.runtime.connect();
    portRef.current = port;

    const timeout = setTimeout(() => {
      port.postMessage({ type: 'init-extension' });
      clearTimeout(timeout);
    }, 10);

    const onMessageListener = (message: object) => {
      const isActions = (data: object): data is Actions => Boolean(data);
      if (!isActions(message)) return;

      switch (message.type) {
        case 'open-tab-master':
          setOpenedTabs(
            message.tabs.open?.map((tab) => ({
              ...tab,
              virtualId: `${tab.id}${OPENED_TAB_SUFFIX}`,
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
              virtualId: `${tab.id}${OPENED_TAB_SUFFIX}`,
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
          break;

        default:
          break;
      }
    };

    port.onMessage.addListener(onMessageListener);

    return () => {
      portRef.current?.onMessage.removeListener(onMessageListener);
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

  const handleTabClose = (tabId: number) => {
    const payload: Actions = {
      type: 'close-tab',
      tabId,
    };
    setOpenedTabs(openedTabs?.filter((tab) => tab.id !== tabId) ?? null);

    portRef.current?.postMessage(payload);
  };

  const handleOnChange = (value: string) => {
    const payload: Actions = {
      type: 'search-history',
      keyword: value,
    };

    portRef.current?.postMessage(payload);
  };
  return (
    <>
      <GlobalStyle />
      <a href={browser.runtime.getURL('/fonts/KumbhSans-Regular.ttf')}>
        click me
      </a>
      <Container>
        <Backdrop onClick={closeExtension} />

        <ModalPane id="tab-master">
          <SettingsProvider>
            <Modal
              searchHistory={handleOnChange}
              handleTabSelect={handleTabSelect}
              handleTabClose={handleTabClose}
              openedTabs={transformedOpenedTabs}
              recentTabs={transformedRecentOpenedTabs}
              closeExtension={closeExtension}
              showExtension
            />
          </SettingsProvider>
        </ModalPane>
      </Container>
    </>
  );
}

export default App;
