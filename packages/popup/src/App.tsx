import styled from 'styled-components';

import Switch from './components/Switch';
import DateField from './components/DateField';
import Option, { OptionSubTitle } from './components/Option';
import RadioCheckGroup from './components/RadioCheckGroup';
import SelectField from './components/SelectField';
import ToggleableContainer from './components/ToggleableContainer';
import { SubTitle, Title } from './components/Typography';
import { GlobalStyle } from './styles';
import useSettings from './data/useSettings';
import Description from './components/Description';
import Checkbox from './components/BlacklistCheckbox';

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
      showDescription,
      extensionEnabled,
      openTabsEnabled,
      recentTabsEnabled,
      view,
      history,
      historyEnabled,
      advancedSearchEnabled,
      blackListedWebsites,
    },
    setHistoryOptions,
    setView,
    toggleDescription,
    toggleExtensionEnabled,
    toggleHistoryOptions,
    toggleAdvancedSearchEnabled,
    toggleOpenTabsEnabled,
    toggleRecentTabsEnabled,
    addPageToBlackList,
    removePageFromBlackList,
  } = useSettings();

  const handleMaxResultsChange = (maxResults: string) => {
    setHistoryOptions({
      maxResults: Number(maxResults),
    });
  };

  const handleFromDateChange: React.ChangeEventHandler<HTMLInputElement> = (
    e,
  ) => {
    // start at 00:00 always
    const parsedVal = new Date(e.target.value).toDateString();

    // 00:00:00 of the selected value
    let newDateVal = new Date(parsedVal).getTime();
    if (newDateVal > Date.now()) {
      // console.warn("You can't select date bigger that the current date");
      // get the 00:00 hour of today
      newDateVal = new Date(new Date().toDateString()).getTime();
    }

    setHistoryOptions({ ...history, from: newDateVal });
  };

  const handleToDate: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    // 23 hours
    const hours = 23 * 60 * 60 * 1000;
    // 59 mins
    const mins = 59 * 60 * 1000;
    // 59 secs
    const secs = 59 * 1000;
    // start at 00:00 always
    const parsedVal = new Date(e.target.value).toDateString();

    // 11:59:59 of the selected value
    let newDateVal = new Date(parsedVal).getTime() + hours + mins + secs;
    if (newDateVal > Date.now()) {
      // console.warn("You can't select date bigger that the current date");
      // get the 11:59:59 PM of today
      newDateVal = new Date(new Date().toDateString()).getTime() + hours + mins + secs;
    }

    setHistoryOptions({ ...history, to: newDateVal });
  };

  return (
    <div>
      <GlobalStyle />
      <Container>
        <Option
          input={(
            <Checkbox
              isChecked={(domain) => blackListedWebsites.includes(domain)}
              onCheck={(checked, domain) => (checked
                ? addPageToBlackList(domain)
                : removePageFromBlackList(domain))}
            />
          )}
          title="Blacklist Page"
        />
        <Option
          input={
            <Switch isChecked={showDescription} onCheck={toggleDescription} />
          }
          title="Commands And Description"
          subContent={(
            <ToggleableContainer show={showDescription}>
              <Description />
            </ToggleableContainer>
          )}
        />
        <Option
          input={(
            <Switch
              isChecked={extensionEnabled}
              onCheck={toggleExtensionEnabled}
            />
          )}
          title="Tab Master Active"
          // TODO: add custom key turn off, ex. cmd + shift + k, turns off this
          subContent="Option for turning on and off Tab Master."
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
          subContent="Whenever to include opened tabs. When this tabs/items are clicked you'll switch to that tab."
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
          subContent="Whenever to include recently opened tabs (history). When this tabs/items are clicked new tab will open to which you'll be directed to."
        />
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
                <DateField
                  label="From"
                  onChange={handleFromDateChange}
                  value={history.from}
                />
                <DateField
                  label="To"
                  onChange={handleToDate}
                  value={history.to}
                />
                <SelectField
                  label="Max results"
                  options={[
                    '10',
                    '20',
                    '30',
                    '40',
                    '50',
                    '60',
                    '70',
                    '80',
                    '90',
                    '100',
                    '200',
                  ]}
                  value={String(history.maxResults)}
                  onChange={handleMaxResultsChange}
                />
              </DateContainer>
            </ToggleableContainer>
          )}
        />
        <Option
          input={(
            <Switch
              onCheck={toggleAdvancedSearchEnabled}
              isChecked={advancedSearchEnabled}
            />
          )}
          title="Enable Advanced search"
          subContent={(
            <OptionSubTitle>
              You can use the search with following pattern:
              {' '}
              <b>Url:Title</b>
            </OptionSubTitle>
          )}
        />
        <Option
          input={<Switch isDisabled isChecked={false} />}
          title="Enable navigation trough windows (SOON)"
          subContent="If opened tab is in different window it should show and when you click on it it will navigate you to that window."
        />
        <Title>View Configuration</Title>
        <MultiOption>
          <RadioCheckGroup
            options={[
              {
                id: 'minimal' as const,
                label: 'Minimal View',
                description:
                  'With this option the tab will be inline, on the left the title and on the right the url. If the title and url are too big they will be truncated.',
              },
              {
                id: 'standard' as const,
                label: 'Standard View',
                description:
                  'With this option enabled the tab will be block, which means on top the title will exist and beneath the title the url will be present.',
              },
            ]}
            optionChecked={view}
            onChange={setView}
          />
        </MultiOption>
        <SubTitle>
          Options page:
          {' '}
          <ButtonLink onClick={() => browser.runtime.openOptionsPage()}>
            Full Screen
          </ButtonLink>
        </SubTitle>
      </Container>
    </div>
  );
}

export default App;
