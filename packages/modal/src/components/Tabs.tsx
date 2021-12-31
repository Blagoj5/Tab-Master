/* eslint-disable react/require-default-props */
import styled from 'styled-components';
import { CommonTab } from '@tab-master/common/build/types';

import {
  SearchedTab,
  EllipsisText,
  HStack,
  scrollbarStyle,
} from '../styles';
import Avatar from './Avatar';
import RandomIcon from '../assets/RandomIcon';
import ExternalIcon from '../assets/ExternalIcon';

export const Text = styled(EllipsisText)<{textAlign?: string, isUrl?: boolean}>`
	flex: 1;
	text-align: ${(props) => props.textAlign || 'left'};
	color: ${(props) => (props.isUrl ? 'var(--text-color)' : 'white')};
`;

export const IconContainer = styled.div`
  padding-right: 1rem;
	color: var(--text-color);
`;

export const Favicon = styled(Avatar)`
	margin-right: 1.5rem;
	color: white;
	width: 20px;
	height: 20px;
`;

export const CustomFlex = styled(HStack)`
	flex: 1;
	width: 0;
	justify-content: space-between;
	align-items: center;
`;

export const Container = styled.div<{isScrollable: boolean}>`
	width: 100%;
	align-items: flex-start;
	flex: 1;
	overflow-y: ${(props) => (props.isScrollable ? 'auto' : 'initial')};
	${scrollbarStyle}
`;

export const Title = styled.h3`
 color: white;
 font-size: 0.8rem;
 padding: 0.2rem;
`;

type ExtractKeys<T, Z> = {
  [K in keyof T]: T[K] extends Z ? K : never;
}[keyof T];

type PanelProps<T> = {
  tabs: T[];
	clickCallbackField: ExtractKeys<T, string>;
  // eslint-disable-next-line no-unused-vars
  onTabClicked: (tabId: string) => void;
  // eslint-disable-next-line no-unused-vars
  onTabHover: (tabId: string) => void;
  selectedTabId: string;
	headingTitle?: string;
}

function Tabs<T extends CommonTab>({
  tabs,
  onTabClicked,
  selectedTabId,
  clickCallbackField,
  headingTitle,
  onTabHover,
}: PanelProps<T>) {
  return (
    <Container isScrollable={!headingTitle}>
      {headingTitle && (<Title>{headingTitle}</Title>)}
      {tabs.map((tab) => (
        <SearchedTab
          id={tab.id}
          key={tab.id}
          isSelected={selectedTabId === (tab[clickCallbackField] as unknown as string)}
          onClick={() => onTabClicked(tab[clickCallbackField as unknown as string])}
          onMouseEnter={() => onTabHover(tab[clickCallbackField as unknown as string])}
        >
          <Favicon src={tab.faviconUrl} name={tab.title} />
          <CustomFlex>
            <Text>
              {tab.title}
            </Text>
            <Text textAlign="right" isUrl>
              {tab.url}
            </Text>
          </CustomFlex>

          {/* // TODO: implement this, show full link and info about the tab */}
          {/* <Icon as={ChevronDownIcon} color="gray.200" /> */}
          <IconContainer>
            {tab.action === 'open' ? (
              <ExternalIcon />
            ) : (
              <RandomIcon />
            )}
          </IconContainer>
        </SearchedTab>
      ))}
    </Container>
  );
}

export default Tabs;
