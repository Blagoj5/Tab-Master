import styled from 'styled-components';

type Props = {
	id: string;
	label: string;
	isChecked: boolean;
	description?: string;
	// eslint-disable-next-line no-unused-vars
	setIsChecked: (optionId: string) => void;
}

const Container = styled.div<{isChecked: boolean}>`
	border-radius: 7px;
	background: ${(props) => (props.isChecked ? 'hsla(0, 0%, 0%, 0.24)' : 'hsla(0, 0%, 0%, 0.06)')};
	display: block;
  position: relative;
  margin-bottom: 12px;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
	padding: 1rem 3.5rem;
	color: ${(props) => (props.isChecked ? 'white' : 'var(--text-color)')};
	input {
		position: absolute;
		opacity: 0;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 100%;
		margin: 0;
		cursor: pointer;
	}
	input ~ span {
		border: 2px solid #b3acac;
		background: transparent;
	}
	input:checked  {
		~ span {
			border: 2px solid white;
		}
		~ span:after {
			display: block;
		}
	}
	span:after {
		top: 3px;
		left: 3px;
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background: #2196F3;
	}
	:hover {
		background: ${(props) => (props.isChecked ? 'hsla(0, 0%, 0%, 0.24)' : 'hsla(0, 0%, 0%, 0.035)')};
	}
`;

const TextContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
`;

const Label = styled.label`
	margin: 0;
  font-size: medium;
	margin-bottom: 10px;
`;

const HelperText = styled.p`
  font-size: small;
	margin: 0;
`;

const Checkmark = styled.span`
  position: absolute;
  top: 0;
	bottom: 0;
  left: 1rem;
	margin: auto;
  height: 16px;
  width: 16px;
  background-color: #eee;
  border-radius: 50%;
	:after {
		content: "";
		position: absolute;
		display: none;
	}
`;

function RadioCheck({
  id,
  label,
  description,
  isChecked,
  setIsChecked,
}: Props) {
  return (
    <Container isChecked={isChecked}>
      <TextContainer>
        <Label htmlFor="ma-sha">{label}</Label>
        {description && (
        <HelperText>{description}</HelperText>
        )}
      </TextContainer>
      <input type="radio" id="ma-sha" name="radio" checked={isChecked} onChange={() => setIsChecked(id)} />
      <Checkmark />
    </Container>
  );
}

export default RadioCheck;
