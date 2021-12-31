import styled from 'styled-components';

const Container = styled.div`
  color: white;
`;

type Props = {
	label: string;
	input?: JSX.Element;
}

function Field({ label, input }: Props) {
  return (
    <Container>
      <p>{label}</p>
      {input}
    </Container>
  );
}

export default Field;
