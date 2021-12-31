import { ReactNode } from 'react';
import styled from 'styled-components';
import { SubTitle, Title } from './Typography';

const ActionContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
`;

const Container = styled.div`
	border-bottom: 1px solid var(--input-primary-light);
	padding: 0.5rem 0;
`;

const OptionSubTitle = styled(SubTitle)`
  margin-top: 0;
`;

type Props = {
	title: string;
	subContent?: ReactNode;
	input: JSX.Element;
};

function Option({ title, subContent, input }: Props) {
  let content: ReactNode | null = null;

  if (typeof subContent === 'string') {
    content = (
      <OptionSubTitle>
        {subContent}
      </OptionSubTitle>
    );
  } else if (subContent) {
    content = subContent;
  }

  return (
    <Container>
      <ActionContainer>
        <Title>{title}</Title>
        {input}
      </ActionContainer>
      {content}
    </Container>
  );
}

export default Option;
