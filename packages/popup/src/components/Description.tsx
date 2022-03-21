import { useState } from 'react';
import styled from 'styled-components';

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
  background: ${(props) => (props.isActive ? 'hsla(0, 0%, 0%, 0.10)' : 'initial')};
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
        <b>Tab Master</b>
        {' '}
        is an easy-to-use extension for increasing your
        {' '}
        <b>productivity</b>
        {' '}
        by providing an easy and intuitive way to navigate
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
          {/* // TODO: add icons, for example CMD + CTRL + K with icons */}
          {activeOsDescription === 'mac' ? (
            <>
              <li>
                Toggle modal -
                {' '}
                <code>CMD</code>
                {' '}
                +
                {' '}
                <code>K</code>
              </li>
              <li>
                Toggle modal (2) -
                {' '}
                <code>CONTROL</code>
                {' '}
                +
                {' '}
                <code>K</code>
              </li>
              <li>
                Open modal (3) -
                {' '}
                <code>COMMAND</code>
                {' '}
                +
                {' '}
                <code>SHIFT</code>
                {' '}
                +
                {' '}
                <code>K</code>
              </li>
            </>
          ) : (
            <>
              <li>
                Toggle modal (native keybinding is overridden which in some site
                it might cause a weird behavior) -
                {' '}
                <code>CTRL</code>
                {' '}
                +
                {' '}
                <code>K</code>
              </li>
              <li>
                Open modal -
                {' '}
                <code>CTRL</code>
                {' '}
                +
                {' '}
                <code>SHIFT</code>
                {' '}
                +
                {' '}
                <code>K</code>
              </li>
            </>
          )}
          <li>
            Close modal -
            {' '}
            <code>ESCAPE</code>
          </li>
          <li>
            Next Item/Tab -
            {' '}
            <code>ArrowDown</code>
            {' '}
            |
            {' '}
            <code>&#x2193;</code>
          </li>
          <li>
            Previous Item/Tab -
            {' '}
            <code>ArrowUp</code>
            {' '}
            |
            {' '}
            <code>&#x2191;</code>
          </li>
          <li>
            Expand Item -
            {' '}
            <code>SHIFT</code>
            {' '}
            +
            {' '}
            <code>ArrowRight</code>
            {' '}
            |
            {' '}
            <code>&#x2192;</code>
          </li>
          <li>
            Collapse Item
            {' '}
            <code>SHIFT</code>
            {' '}
            +
            {' '}
            <code>Arrow Left</code>
            {' '}
            |
            {' '}
            <code>&#x2190;</code>
          </li>
          <li>
            Toggle Expand/Collapse for Item/Tab -
            {' '}
            <code>TAB</code>
          </li>
          <li>
            Navigate to selected tab -
            {' '}
            <code>ENTER</code>
            {' '}
            |
            {' '}
            <code>LeftMouseClick</code>
          </li>
        </UnorderedList>
      </div>
    </Container>
  );
}

export default Description;
