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
	li {
		margin-bottom: 10px;
		code {
			background: hsl(216deg 10% 34%);
			padding: 3px 6px;
			border-radius: 4px;
			letter-spacing: 1px;
		}
	}
`;

function Description() {
  return (
    <Container>
      <p>
        <b>Tab Mater</b>
        {' '}
        is an easy-to-use extension for increasing your
        {' '}
        <b>productivity</b>
        {' '}
        by providing an easy and intuitive way to navigate trough tabs and history.
      </p>
      <div>
        <h4>Commands</h4>
        <UnorderedList>
          {/* TODO: add icons, for example CMD + CTRL + K with icons */}
          <li>
            Open modal -
            {' '}
            <code>CMD</code>
            {' '}
            |
            {' '}
            <code>CTRL</code>
            {' '}
            +
            {' '}
            <code>K</code>
          </li>
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
            {' '}
            <code>Arrow Left</code>
            {' '}
            |
            {' '}
            <code>&#x2190;</code>
          </li>
          <li>
            Toggle Item/Tab -
            {' '}
            <code>TAB</code>
          </li>
        </UnorderedList>
      </div>
    </Container>
  );
}

export default Description;
