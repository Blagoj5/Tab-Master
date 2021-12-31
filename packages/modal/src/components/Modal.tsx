import React, {
  useEffect,
  useMemo, useRef, useState,
} from 'react';
import styled from 'styled-components';
import { useFrame } from 'react-frame-component';
import { CommonTab } from '@tab-master/common/build/types';

import {
  GlobalStyle,
  Input, scrollbarStyle, VStack,
} from '../styles';
import Tabs from './Tabs';
import { fuzzySearch, removeDuplicates } from '../utils';

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

const TabsContainer = styled((props) => <VStack {...props} spacing="8px" />)`
	flex: 1;
	overflow-y: auto;
	${scrollbarStyle}
`;

type Props = {
	// eslint-disable-next-line no-unused-vars
	onChange: (value: string) => void;
	// eslint-disable-next-line no-unused-vars
	handleTabSelect: (selectedTabId: string) => void;
	closeExtension: () => void;
	transformedOpenedTabs: CommonTab[];
	transformedRecentOpenedTabs: CommonTab[];
	showExtension: boolean;
}
// IFRAME COMPONENT
function Modal({
  onChange,
  handleTabSelect,
  transformedOpenedTabs,
  transformedRecentOpenedTabs,
  closeExtension,
  showExtension,
}: Props) {
  const { document: iFrameDocument } = useFrame();

  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState('');

  const [selectedTabId, setSelectedTabId] = useState('');

  const [combinedSelectedTabs] = useMemo(
    () => {
      const combinedTabs = [
        ...transformedOpenedTabs,
        ...transformedRecentOpenedTabs,
      ];

      // TODO: INTO THE SEARCH THE WEIGHT SHOULD BE AFFECTED BY 2 PARAMS, THE TYPE AND VISIT COUNT
      const filteredCombinedTabs = fuzzySearch(
        combinedTabs,
        {
          keys: [
            {
              name: 'title',
              weight: 0.6,
            },
            {
              name: 'url',
              weight: 0.4,
            }],
          includeScore: true,
        },
        inputValue,
        (result) => result.map((res) => ({
          ...res,
          score: res.item.action === 'switch' && res.score ? Math.max(res.score - 0.01, 0) : res.score,
        })),
      );

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

  useEffect(() => {
    inputRef.current?.focus();
  }, [showExtension]);

  // on new filter always select the firs tab first
  useEffect(() => {
    setSelectedTabId(combinedSelectedTabIds[0]);
  }, [combinedSelectedTabIds]);

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    const selectedTabIndex = combinedSelectedTabIds.findIndex((id) => id === selectedTabId);

    if (e.key === 'Escape') {
      closeExtension();
      setInputValue('');
      return;
    }

    // on enter
    if (e.code === 'Enter' && selectedTabId) {
      e.preventDefault();
      handleTabSelect(selectedTabId);
      setInputValue('');
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

      iFrameDocument.getElementById(prevTabId)?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });

      setSelectedTabId(prevTabId);
    } else if (e.code === 'ArrowDown') {
      const prevSuggestionOrder = selectedTabIndex + 1;
      // suggestion goes above the upper limit
      const order = prevSuggestionOrder > combinedSelectedTabIds.length - 1
        ? 0
        : prevSuggestionOrder;

      const nextTabId = combinedSelectedTabIds[order];

      iFrameDocument.getElementById(nextTabId)?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });

      setSelectedTabId(nextTabId);
    } else {
      setSelectedTabId('');
    }
  };

  const handleOnChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setInputValue(e.target.value);
    onChange(e.target.value);
  };

  return (
    <>
      <GlobalStyle />
      <ModalStyle>
        <Input
          ref={inputRef}
          placeholder="Where would you like to go?"
          value={inputValue}
          onKeyDown={handleKeyDown}
          onChange={handleOnChange}
        />
        {inputValue
          ? (
            <Tabs
              tabs={combinedSelectedTabs}
              clickCallbackField="id"
              selectedTabId={selectedTabId}
              onTabClicked={handleTabSelect}
              onTabHover={setSelectedTabId}
            />
          )
          : (
            <TabsContainer>
              {/* OPENED TABS */}
              <Tabs
                headingTitle="OPENED TABS"
                tabs={transformedOpenedTabs}
                clickCallbackField="id"
                selectedTabId={selectedTabId}
                onTabClicked={handleTabSelect}
                onTabHover={setSelectedTabId}
              />
              {/* RECENTLY TABS */}
              <Tabs
                headingTitle="RECENT TABS"
                tabs={transformedRecentOpenedTabs}
                clickCallbackField="id"
                selectedTabId={selectedTabId}
                onTabClicked={handleTabSelect}
                onTabHover={setSelectedTabId}
              />
            </TabsContainer>
          )}
      </ModalStyle>
    </>
  );
}

export default Modal;
