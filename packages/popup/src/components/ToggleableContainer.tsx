import { ReactNode } from 'react';
import styled from 'styled-components';

const AnimationContainer = styled.div<{ show?: boolean }>`
	max-height: ${(props) => (props.show ? '600px' : '0px')};
	overflow-y: hidden;
	transition: all 0.4s ease-in-out;
`;

type Props = {
	children: ReactNode,
	show?: boolean
}

function ToggleableContainer({ children, show }: Props) {
  return (
    <AnimationContainer show={show}>
      {children}
    </AnimationContainer>
  );
}

export default ToggleableContainer;
