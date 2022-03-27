import React, { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { useFrame } from 'react-frame-component';

import { CommonTab } from '@tab-master/common/build/types';

import { GlobalStyle, Input, scrollbarStyle, VStack } from '../styles';
import Tabs from './Tabs';
import { fuzzySearch, removeDuplicates } from '../utils';
import { useSettingsContext } from './SettingsProvider';
import { OPENED_TAB_SUFFIX } from '../consts';

const ModalStyle = styled.div`
  width: auto;
  height: 400px;
  background: var(--primary-color);
  border-radius: 0.625rem;
  padding: 1rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  margin: auto;
`;

const TabsContainer = styled(
  React.forwardRef<HTMLDivElement, { children: ReactNode }>((props, ref) => (
    <VStack ref={ref} {...props} spacing="8px" />
  )),
)`
  flex: 1;
  overflow-y: scroll;
  overflow-x: hidden;
  ${scrollbarStyle}
`;

type Props = {
  searchHistory: (value: string) => void;
  handleTabSelect: (selectedTabId: string) => void;
  handleTabClose: (selectedTabId: number) => void;
  closeExtension: () => void;
  openedTabs?: CommonTab[];
  recentTabs?: CommonTab[];
  showExtension: boolean;
};
// IFRAME COMPONENT
function Modal({
  searchHistory,
  handleTabSelect,
  handleTabClose,
  openedTabs = [],
  recentTabs = [],
  closeExtension,
  showExtension,
}: Props) {
  const { document: iFrameDocument } = useFrame();

  const containerRef = useRef<HTMLDivElement>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState('');
  const [scrollingState, setScrollingState] = useState<
    'arrows' | 'mouse' | undefined
  >();

  const [selectedTabId, setSelectedTabId] = useState('');
  const [expanded, setExpanded] = useState<string[]>([]);

  const { advancedSearchEnabled } = useSettingsContext();

  const [sortedCombinedSelectedTabs, combinedSelectedTabs] = useMemo(() => {
    const [urlKeyword, titleKeyword = inputValue] = advancedSearchEnabled
      ? inputValue.split(':')
      : [inputValue];
    const filteredOpenedTabs = inputValue
      ? fuzzySearch(
          openedTabs,
          {
            keys: [
              {
                name: 'title',
                weight: 0.6,
              },
              {
                name: 'url',
                weight: 0.4,
              },
            ],
            includeScore: true,
            ignoreLocation: true,
            threshold: 0.25,
          },
          {
            title: titleKeyword,
            url: urlKeyword,
          },
        )
      : openedTabs;

    const filteredRecentTabs = inputValue
      ? fuzzySearch(
          recentTabs,
          {
            keys: [
              {
                name: 'title',
                weight: 0.6,
              },
              {
                name: 'url',
                weight: 0.4,
              },
            ],
            includeScore: true,
            ignoreLocation: true,
            threshold: 0.4,
          },
          {
            title: titleKeyword,
            url: urlKeyword,
          },
          (result) =>
            result.map((res) => {
              let { score } = res;
              if (res.item.visitCount && score) {
                // TODO: discuss with DJ about this
                // this is constant addition for each visit that affects the score
                const CONSTANT_ADDITION = 0.0001;
                const { visitCount } = res.item;
                score = Math.max(score - visitCount * CONSTANT_ADDITION, 0);
              }

              return {
                ...res,
                score,
              };
            }),
        )
      : recentTabs;

    const combinedTabs = [...filteredOpenedTabs, ...filteredRecentTabs];

    return [removeDuplicates(combinedTabs), combinedTabs];
  }, [recentTabs, openedTabs, inputValue]);

  const [sortedCombinedSelectedTabIds, combinedSelectedTabIds] = useMemo(
    () => [
      sortedCombinedSelectedTabs.map(({ id }) => id),
      combinedSelectedTabs.map(({ id }) => id),
    ],
    [sortedCombinedSelectedTabs],
  );

  const resetScroll = () => {
    containerRef.current?.scroll(0, 0);
  };

  useEffect(() => {
    inputRef.current?.focus();
    resetScroll();
    setInputValue('');
  }, [showExtension]);

  // on new filter always select the firs tab first
  useEffect(() => {
    setSelectedTabId(sortedCombinedSelectedTabIds[0]);
    setExpanded([]);
  }, [showExtension]);

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    e.stopPropagation();
    const selectedTabIds = inputValue
      ? sortedCombinedSelectedTabIds
      : combinedSelectedTabIds;
    const selectedTabIndex = selectedTabIds.findIndex(
      (id) => id === selectedTabId,
    );

    // for Windows, ctrl + k has native binding
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      closeExtension();
      return;
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      closeExtension();
      setInputValue('');
      return;
    }

    // reserved keys
    const isReservedKey = e.key === 'Tab' || e.key === 'Shift';
    if (isReservedKey) {
      e.preventDefault();
    }

    // toggle expand/collapse
    if (e.key === 'Tab' && selectedTabId) {
      if (expanded.includes(selectedTabId)) {
        setExpanded(expanded.filter((id) => id !== selectedTabId));
      } else {
        setExpanded([...expanded, selectedTabId]);
      }
      return;
    }

    // expand
    if (e.shiftKey && e.key === 'ArrowRight' && selectedTabId) {
      if (expanded.includes(selectedTabId)) return;

      // disallow to move right/left on the input (only used for expanding)
      e.preventDefault();

      setExpanded([...expanded, selectedTabId]);
      return;
    }

    // collapse
    if (e.shiftKey && e.key === 'ArrowLeft' && selectedTabId) {
      if (!expanded.includes(selectedTabId)) return;

      // disallow to move right/left on the input (only used for collapsing)
      e.preventDefault();

      setExpanded(expanded.filter((id) => id !== selectedTabId));

      return;
    }

    // on enter
    if (e.code === 'Enter' && selectedTabId) {
      e.preventDefault();

      // extension is closed from parent handler
      handleTabSelect(selectedTabId);
      setInputValue('');

      return;
    }

    const arrowUp = () => {
      e.preventDefault();

      const nextSuggestionOrder = selectedTabIndex - 1;
      // if the suggestion order goes bellow zero, start over again
      const order =
        nextSuggestionOrder < 0
          ? selectedTabIds.length - 1
          : nextSuggestionOrder;

      const prevTabId = selectedTabIds[order];

      const target = iFrameDocument.getElementById(prevTabId);
      target?.scrollIntoView({
        behavior: 'auto',
        block: 'nearest',
        inline: 'start',
      });

      setScrollingState('arrows');
      setSelectedTabId(prevTabId);
    };

    const arrowDown = () => {
      const prevSuggestionOrder = selectedTabIndex + 1;
      // suggestion goes above the upper limit
      const order =
        prevSuggestionOrder > selectedTabIds.length - 1
          ? 0
          : prevSuggestionOrder;

      const nextTabId = selectedTabIds[order];

      const target = iFrameDocument.getElementById(nextTabId);
      target?.scrollIntoView({
        behavior: 'auto',
        block: 'nearest',
        inline: 'start',
      });

      setScrollingState('arrows');
      setSelectedTabId(nextTabId);
    };

    if (
      (e.ctrlKey || e.metaKey) &&
      e.key === 'x' &&
      openedTabs.map(({ id }) => id).includes(selectedTabId)
    ) {
      arrowDown();
      handleTabClose(Number(selectedTabId.replace(OPENED_TAB_SUFFIX, '')));
      return;
    }

    // arrow up/down button should select next/previous list element
    if (e.code === 'ArrowUp') {
      arrowUp();
    } else if (e.code === 'ArrowDown') {
      arrowDown();
    }
  };

  const handleOnChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    // reset expand state on search
    setExpanded([]);
    setInputValue(e.target.value);
    // git:tab-master -> git tab-master in search history
    const keyword = advancedSearchEnabled
      ? e.target.value.replace(':', ' ')
      : e.target.value;
    searchHistory(keyword);
  };

  return (
    <>
      <GlobalStyle />
      <ModalStyle data-testid={showExtension ? 'open-modal' : ''}>
        <Input
          ref={inputRef}
          placeholder="Where would you like to go?"
          value={inputValue}
          onKeyDown={handleKeyDown}
          onChange={handleOnChange}
        />
        {inputValue ? (
          <Tabs
            tabs={sortedCombinedSelectedTabs}
            clickCallbackField="id"
            selectedTabId={selectedTabId}
            onTabClicked={handleTabSelect}
            onTabHover={setSelectedTabId}
            expandedTabIds={expanded}
            scrollingState={scrollingState}
            setScrollingState={setScrollingState}
          />
        ) : (
          <TabsContainer ref={containerRef}>
            {/* OPENED TABS */}
            {openedTabs?.length ? (
              <Tabs
                headingTitle="OPENED TABS"
                tabs={openedTabs}
                clickCallbackField="id"
                selectedTabId={selectedTabId}
                onTabClicked={handleTabSelect}
                onTabHover={setSelectedTabId}
                expandedTabIds={expanded}
                scrollingState={scrollingState}
                setScrollingState={setScrollingState}
              />
            ) : undefined}
            {/* RECENTLY TABS */}
            {recentTabs?.length ? (
              <Tabs
                headingTitle="RECENT TABS"
                tabs={recentTabs}
                clickCallbackField="id"
                selectedTabId={selectedTabId}
                onTabClicked={handleTabSelect}
                onTabHover={setSelectedTabId}
                expandedTabIds={expanded}
                scrollingState={scrollingState}
                setScrollingState={setScrollingState}
              />
            ) : undefined}
          </TabsContainer>
        )}
      </ModalStyle>
    </>
  );
}

export default Modal;
