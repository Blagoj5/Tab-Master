/* eslint-disable react/require-default-props */
import { CommonTab } from '../../../../common';
import { SearchedTab } from '../../../../common/styles';
import {
  Container, CustomFlex, Favicon, Text, Title,
} from './styles';

type ExtractKeys<T, Z> = {
  [K in keyof T]: T[K] extends Z ? K : never;
}[keyof T];

type PanelProps<T> = {
  tabs: T[];
	clickCallbackField: ExtractKeys<T, string>;
  // eslint-disable-next-line no-unused-vars
  onTabClicked: (tabId: string) => void;
  selectedTabId: string;
	headingTitle?: string;
}

function SearchedTabs<T extends CommonTab>({
  tabs,
  onTabClicked,
  selectedTabId,
  clickCallbackField,
  headingTitle,
}: PanelProps<T>) {
  return (
    <Container isScrollable={!headingTitle}>
      {headingTitle && (<Title>{headingTitle}</Title>)}
      {tabs.map((tab) => (
        <SearchedTab
          id={`${tab.id}`}
          key={tab.id}
          isSelected={selectedTabId === (tab[clickCallbackField] as unknown as string)}
          onClick={() => onTabClicked(clickCallbackField as unknown as string)}
        >
          <Favicon src={tab.faviconUrl} alt="" />
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
        </SearchedTab>
      ))}
    </Container>
  );
}

export default SearchedTabs;
