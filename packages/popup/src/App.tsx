import styled from 'styled-components';

import Switch from './components/CheckBox';
import DateField from './components/DateField';
import Option from './components/Option';
import RadioCheckGroup from './components/RadioCheckGroup';
import SelectField from './components/SelectField';
import ToggleableContainer from './components/ToggleableContainer';
import { SubTitle, Title } from './components/Typography';
import { GlobalStyle } from './styles';
import useSettings from './data/useSettings';

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

const ButtonLink = styled.button`
  color: #0084ff;
  background: transparent;
  outline: unset;
  border: none;
  cursor: pointer;
`;

function App() {
  const {
    settings: {
      extensionEnabled,
      openTabsEnabled,
      recentTabsEnabled,
      view,
      history,
      historyEnabled,
    },
    setHistoryOptions,
    setView,
    toggleExtensionEnabled,
    toggleHistoryOptions,
    toggleOpenTabsEnabled,
    toggleRecentTabsEnabled,
  } = useSettings();

  const handleMaxResultsChange = (maxResults: string) => {
    setHistoryOptions({
      maxResults: Number(maxResults),
    });
  };

  return (
    <div>
      <GlobalStyle />
      <Container>
        <Option
          input={<Switch isChecked={extensionEnabled} onCheck={toggleExtensionEnabled} />}
          title="Tab Master Active"
          subContent="Option for turning on and off tab-master. Also can be turned off with key: (<custom key>)</custom>"
        />
        <Option
          input={(
            <Switch
              isChecked={openTabsEnabled}
              onCheck={toggleOpenTabsEnabled}
              isDisabled={!extensionEnabled || !recentTabsEnabled}
            />
          )}
          title="Opened Tabs"
          subContent="Whenever to include opened tabs when using tab master. The main action is switch"
        />
        <Option
          input={(
            <Switch
              isChecked={recentTabsEnabled}
              onCheck={toggleRecentTabsEnabled}
              isDisabled={!extensionEnabled || !openTabsEnabled}
            />
          )}
          title="Recent Opened Tabs"
          subContent="Whenever to include recently opened tabs (history) when using tab master. The main action is opening tab"
        />
        {/* TODO: this need to be under single component */}
        <Option
          input={(
            <Switch
              onCheck={toggleHistoryOptions}
              isChecked={historyEnabled && recentTabsEnabled}
              isDisabled={!extensionEnabled}
            />
          )}
          title="History Options"
          subContent={(
            <ToggleableContainer show={historyEnabled && recentTabsEnabled}>
              <DateContainer>
                <DateField label="From" />
                <DateField label="To" />
                <SelectField
                  label="Max results"
                  options={['10', '20', '30', '40', '50', '60', '70', '80', '90', '100', '200']}
                  value={String(history.maxResults)}
                  onChange={handleMaxResultsChange}
                />
              </DateContainer>
            </ToggleableContainer>
        )}
        />
        <Option
          input={<Switch isDisabled isChecked={false} />}
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
            optionChecked={view}
            onChange={setView}
          />
        </MultiOption>
        <SubTitle>
          Options page:
          {' '}
          <ButtonLink onClick={() => chrome.runtime.openOptionsPage()}>Full Screen</ButtonLink>
        </SubTitle>
      </Container>
    </div>
  );
}

export default App;
