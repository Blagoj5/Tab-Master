import React, { RefObject, useEffect } from 'react';
import styled from 'styled-components';
import { useFrame } from 'react-frame-component';

import { CommonTab } from '../../../common';
import {
  GlobalStyle,
  Input, scrollbarStyle, VStack,
} from '../../../common/styles';
import Tabs from './Tabs';

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
	handleKeyDown: React.KeyboardEventHandler<HTMLInputElement>;
	handleOnChange: React.ChangeEventHandler<HTMLInputElement>;
	inputValue: string;
	inputRef: RefObject<HTMLInputElement>;
	combinedSelectedTabs: CommonTab[];
	selectedTabId: string;
	handleTabSelect: () => void;
	// eslint-disable-next-line no-unused-vars
	onTabHover: (tabId: string) => void;
	transformedOpenedTabs: CommonTab[];
	transformedRecentOpenedTabs: CommonTab[];
}
// IFRAME COMPONENT
function Modal({
  handleOnChange,
  inputRef,
  inputValue,
  combinedSelectedTabs,
  onTabHover,
  handleTabSelect,
  selectedTabId,
  transformedOpenedTabs,
  transformedRecentOpenedTabs,
  handleKeyDown,
}: Props) {
  const { document: iFrameDocument } = useFrame();
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // effect for scrolling the selected tab id into view, this will be fixed when refactor happens
  useEffect(() => {
    iFrameDocument?.getElementById(selectedTabId)?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
  }, [selectedTabId]);

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
              onTabHover={onTabHover}
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
                onTabHover={onTabHover}
              />
              {/* RECENTLY TABS */}
              <Tabs
                headingTitle="RECENT TABS"
                tabs={transformedRecentOpenedTabs}
                clickCallbackField="id"
                selectedTabId={selectedTabId}
                onTabClicked={handleTabSelect}
                onTabHover={onTabHover}
              />
            </TabsContainer>
          )}
      </ModalStyle>
    </>
  );
}

export default Modal;
