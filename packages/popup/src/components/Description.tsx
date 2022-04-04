/* eslint-disable react/jsx-one-expression-per-line */
import { useState } from 'react';
import styled from 'styled-components';
import DescriptionItem from './DescriptionItem';

const Container = styled.div`
  color: #ffffffd6;
  h4 {
    margin-top: 0;
    margin-bottom: 16px;
  }
`;

const UnorderedList = styled.ul`
  padding-left: 30px;
  margin: 0;
  font-size: 14px;
  li {
    margin-bottom: 10px;
    line-height: 24px;
    code {
      background: hsl(216deg 10% 34%);
      padding: 3px 6px;
      border-radius: 4px;
      letter-spacing: 1px;
    }
  }
`;

const OsBox = styled.div`
  display: flex;
  width: 100%;
  border-bottom: 1px solid var(--input-primary-light);
  margin-bottom: 24px;
  align-items: stretch;
  h5 {
    margin-right: 4px;
  }
  h5:last-child {
    margin-right: 0;
  }
`;

const OsHeading = styled.h5<{ isActive: boolean }>`
  background: ${(props) =>
    props.isActive ? 'hsla(0, 0%, 0%, 0.10)' : 'initial'};
  flex: 1;
  height: 100%;
  text-align: center;
  cursor: pointer;
  margin: 0;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px 8px 0 0;
  transition: background 0.2s;
  :hover {
    background: hsla(0, 0%, 0%, 0.1);
  }
`;

type Os = 'windows' | 'mac' | 'linux';
const availableOs = ['Windows', 'Linux', 'Mac'];
function Description() {
  const [activeOsDescription, setActiveOsDescription] = useState<Os>('windows');

  return (
    <Container>
      <p>
        <b>Tab Master</b> is an easy-to-use extension for increasing your{' '}
        <b>productivity</b> by providing an easy and intuitive way to navigate
        trough tabs and history.
      </p>
      <div>
        <h4>Commands</h4>
        <OsBox>
          {availableOs.map((os) => (
            <OsHeading
              key={os}
              isActive={os.toLowerCase() === activeOsDescription}
              onClick={() => setActiveOsDescription(os.toLowerCase() as Os)}
            >
              {os}
            </OsHeading>
          ))}
        </OsBox>
        <UnorderedList>
          {activeOsDescription === 'mac' ? (
            <>
              <DescriptionItem
                title="Toggle modal (native keybinding)"
                commands={['CMD', 'SHIFT', 'K']}
              />
              <DescriptionItem title="Toggle modal" commands={['CMD', 'K']} />
              <DescriptionItem title="Toggle modal" commands={['CTRL', 'K']} />
            </>
          ) : (
            <>
              <DescriptionItem
                title="Toggle modal (native keybinding is overridden which in some site
                it might cause a weird behavior)"
                commands={['Control', 'K']}
              />
              <DescriptionItem
                title="Toggle modal (native keybinding)"
                commands={['CTRL', 'SHIFT', 'K']}
              />
            </>
          )}
          <DescriptionItem title="Close modal" commands={['ESCAPE']} />
          <DescriptionItem title="Next Item/Tab">
            <>
              <code>ArrowDown</code> | <code>&#x2193;</code>
            </>
          </DescriptionItem>
          <DescriptionItem title="Previous Item/Tab">
            <>
              <code>ArrowUp</code> | <code>&#x2191;</code>
            </>
          </DescriptionItem>
          <DescriptionItem title="Expand Item/Tab">
            <>
              <code>SHIFT</code> + <code>ArrowRight</code> |{' '}
              <code>&#x2192;</code>
            </>
          </DescriptionItem>
          <DescriptionItem title="Collapse Item/Tab">
            <>
              <code>SHIFT</code> + <code>Arrow Left</code> |{' '}
              <code>&#x2190;</code>
            </>
          </DescriptionItem>
          <DescriptionItem
            title="Toggle Expand/Collapse for Item/Tab"
            commands={['TAB']}
          />
          <DescriptionItem title="Navigate to selected tab">
            <>
              <code>ENTER</code> | <code>LeftMouseClick</code>
            </>
          </DescriptionItem>
        </UnorderedList>
      </div>
    </Container>
  );
}

export default Description;
