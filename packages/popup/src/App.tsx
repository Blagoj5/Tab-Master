import { useState } from 'react';
import styled from 'styled-components';

import Switch from './components/CheckBox';
import DateField from './components/DateField';
import Option from './components/Option';
import RadioCheckGroup from './components/RadioCheckGroup';
import SelectField from './components/SelectField';
import ToggleableContainer from './components/ToggleableContainer';
import { SubTitle, Title } from './components/Typography';
import { GlobalStyle } from './styles';

const DateContainer = styled.div`
	max-width: 400;
  display: flex;
	> div {
		margin-right: 1rem;
	}
`;

const Container = styled.div`
	max-width: 1280px;
	margin: auto;
	padding: 0 2rem;
`;

const MultiOption = styled.div`
	color: white;
`;

// MOVE THIS TO COMMON
const defaultStorageConfig: StorageConfig = {
  extensionEnabled: true,
  openTabsEnabled: true,
  recentTabsEnabled: true,
  history: {
    from: -1,
    to: -1,
    maxResults: 20,
  },
  windowSwitchEnabled: false,
  view: 'standard',
};

// MOVE THIS TO COMMON
type StorageConfig = {
	extensionEnabled: boolean;
	openTabsEnabled: boolean;
	recentTabsEnabled: boolean;
	history?: {
		from: number;
		to: number;
		maxResults: number;
	};
	windowSwitchEnabled: boolean;
	view: 'minimal' | 'standard';
};

function App() {
  const [extensionEnabled, setExtensionEnabled] = useState(defaultStorageConfig.extensionEnabled);
  const [openTabsEnabled, setOpenTabsEnabled] = useState(defaultStorageConfig.openTabsEnabled);
  const [
    recentTabsEnabled,
    setRecentTabsEnabled,
  ] = useState(defaultStorageConfig.recentTabsEnabled);
  const [historyOptions, setHistoryOptions] = useState(defaultStorageConfig.history);
  const [view, setView] = useState(defaultStorageConfig.view);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const setChromeStorage = (items: {[key: string]: any}) => {
    if (!chrome?.storage?.sync) {
      // eslint-disable-next-line no-console
      console.warn('Chrome storage is not available');
      return;
    }
    chrome.storage.sync.set(items);
  };

  const handleExtensionEnabledToggle = (checked: boolean) => {
    setExtensionEnabled(checked);
    setChromeStorage({ extensionEnabled: checked });
  };

  const handleOpenTabsEnabledToggle = (checked: boolean) => {
    setOpenTabsEnabled(checked);
    setChromeStorage({ openTabsEnabled: checked });
  };

  const handleRecentTabsEnabledToggle = (checked: boolean) => {
    setRecentTabsEnabled(checked);
    setChromeStorage({ recentTabsEnabled: checked });
  };

  const handleHistoryOptionsToggle = (checked: boolean) => {
    const historySettings = historyOptions ?? defaultStorageConfig.history;
    if (checked) {
      setHistoryOptions(historySettings);
    } else {
      setHistoryOptions(undefined);
    }
    setChromeStorage({ historyOptions: historySettings });
  };

  const handleMaxResultsChange = (maxResults: string) => {
    if (!historyOptions) return;

    const newHistoryOptions = {
      ...historyOptions,
      maxResults: Number(maxResults),
    };
    setHistoryOptions(newHistoryOptions);
    setChromeStorage({ historyOptions: newHistoryOptions });
  };

  const handleViewChange = (newView: StorageConfig['view']) => {
    if (!historyOptions) return;

    setView(newView);
    setChromeStorage({ view: newView });
  };

  return (
    <div>
      <GlobalStyle />
      <Container>
        <Option
          input={<Switch defaultCheck={extensionEnabled} onCheck={handleExtensionEnabledToggle} />}
          title="Tab Master Active"
          subContent="Option for turning on and off tab-master. Also can be turned off with key: (<custom key>)</custom>"
        />
        <Option
          input={<Switch defaultCheck={openTabsEnabled} onCheck={handleOpenTabsEnabledToggle} />}
          title="Opened Tabs"
          subContent="Whenever to include opened tabs when using tab master. The main action is switch"
        />
        <Option
          input={(
            <Switch
              defaultCheck={recentTabsEnabled}
              onCheck={handleRecentTabsEnabledToggle}
            />
					)}
          title="Recent Opened Tabs"
          subContent="Whenever to include recently opened tabs (history) when using tab master. The main action is opening tab"
        />
        {/* TODO: this need to be under single component */}
        <Option
          input={(
            <Switch
              onCheck={handleHistoryOptionsToggle}
              defaultCheck={Boolean(historyOptions)}
            />
          )}
          title="History Options"
          subContent={(
            <ToggleableContainer show={Boolean(historyOptions)}>
              <DateContainer>
                <DateField label="From" />
                <DateField label="To" />
                <SelectField
                  label="Max results"
                  options={['10', '20', '30', '40', '50', '60', '70', '80', '90', '100', '200']}
                  value={String(historyOptions?.maxResults)}
                  onChange={handleMaxResultsChange}
                />
              </DateContainer>
            </ToggleableContainer>
				)}
        />
        <Option
          input={<Switch isDisabled defaultCheck={false} />}
          title="Enable navigation trough windows (SOON)"
          subContent="If opened tab is in different window it should show and when you click on it it will navigate you to that window"
        />
        <Title>View Configuration</Title>
        <MultiOption>
          <RadioCheckGroup
            options={[
						  {
						    id: 'minimal' as const,
						    label: 'Minimal View',
						    description: 'With this option the tab will be inline, on the left the title and on the right the url. If the title and url are too big they will be truncated',
						  },
						  {
						    id: 'standard' as const,
						    label: 'Standard View',
						    description: 'With this option enabled the tab will be block, which means on top the title will exist and beneath the title the url will be present',
						  },
            ]}
            defaultOptionChecked={view}
            onChange={handleViewChange}
          />
        </MultiOption>
        <SubTitle>
          Options page:
          {' '}
          <a href="/">chrome://extensions/tab-master</a>
        </SubTitle>
      </Container>
    </div>
  );
}

export default App;
