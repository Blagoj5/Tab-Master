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
import { useSettingsContext } from './SettingsProvider';

export const Text = styled(EllipsisText)<{textAlign?: string, isUrl?: boolean}>`
	flex: 1;
	text-align: ${(props) => props.textAlign || 'left'};
	color: ${(props) => (props.isUrl ? 'var(--text-color)' : 'white')};
	margin: 0;
`;

export const IconContainer = styled.div<{isAtTop?: boolean}>`
	display: flex;
  padding-right: 1rem;
	color: var(--text-color);
	margin-left: 10px;
	align-self: ${(props) => (props.isAtTop && 'flex-start')};
	padding-top: ${(props) => (props.isAtTop && '10px')};
`;

export const Favicon = styled(Avatar)<{isAtTop?: boolean}>`
	margin-right: 1.5rem;
	color: white;
	width: 20px;
	height: 20px;
	align-self: ${(props) => (props.isAtTop && 'flex-start')};
	padding-top: ${(props) => (props.isAtTop && '10px')};
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
	overflow-y: ${(props) => (props.isScrollable ? 'scroll' : 'initial')};
	overflow-x: ${(props) => (props.isScrollable ? 'hidden' : 'initial')};
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
	expandedTabIds: string[]
	scrollingState: 'arrows' | 'mouse' | undefined;
	setScrollingState: React.Dispatch<React.SetStateAction<'arrows' | 'mouse' | undefined>>;
}

const InlineView = ({ title, url }: {title: string, url: string}) => (
  <CustomFlex>
    <Text>
      {title}
    </Text>
    <Text textAlign="right" isUrl>
      {url}
    </Text>
  </CustomFlex>
);

type BlockedViewProps = {title: string, url: string, isExpanded: boolean};
const BlockView = styled(({
  title,
  url,
  ...rest
}: BlockedViewProps) => (
  <div {...rest}>
    <Text>
      {title}
    </Text>
    <Text textAlign="right" isUrl>
      {url}
    </Text>
  </div>
))`
	padding: 11px 0;
	flex: 1;
	overflow: hidden;

  > p:first-child {
		margin-bottom: 10px;
	}

  > p:nth-child(2) {
		text-align: left;
	}

	> p {
		span {
			white-space: ${(props) => (props.isExpanded ? 'initial' : 'nowrap')};
			word-break: ${(props) => (props.isExpanded && 'break-all')};
		}
	}
`;

function Tabs<T extends CommonTab>({
  tabs,
  onTabClicked,
  selectedTabId,
  clickCallbackField,
  headingTitle,
  onTabHover,
  expandedTabIds,
  scrollingState,
  setScrollingState,
}: PanelProps<T>) {
  const { view } = useSettingsContext();

  const isMinimal = view === 'minimal';
  return (
    <Container isScrollable={!headingTitle}>
      {headingTitle && (<Title>{headingTitle}</Title>)}
      {tabs.map((tab) => (
        <SearchedTab
          id={tab.id}
          key={tab.id}
          isSelected={selectedTabId === (tab[clickCallbackField] as unknown as string)}
          onClick={() => onTabClicked(tab[clickCallbackField as unknown as string])}
          onMouseEnter={() => {
            if (scrollingState === 'mouse') {
              onTabHover(tab[clickCallbackField as unknown as string]);
              return;
            }
            setScrollingState('mouse');
          }}
          isMinimalView={isMinimal && !expandedTabIds.includes(tab.id)}
        >
          <Favicon
            src={tab.faviconUrl}
            name={tab.title}
            isAtTop={!isMinimal || expandedTabIds.includes(tab.id)}
          />
          {expandedTabIds.includes(tab.id) || !isMinimal
            ? (
              <BlockView
                isExpanded={expandedTabIds.includes(tab.id)}
                title={tab.title}
                url={tab.url}
              />
            )
            : (
              <InlineView title={tab.title} url={tab.url} />
            )}
          {/* // TODO: implement this, show full link and info about the tab */}
          {/* <Icon as={ChevronDownIcon} color="gray.200" /> */}
          <IconContainer isAtTop={!isMinimal || expandedTabIds.includes(tab.id)}>
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
