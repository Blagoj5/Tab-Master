import styled from 'styled-components';

const CheckBoxWrapper = styled.div`
  position: relative;
  --background-checked: hsl(142.7,46.05%,52.745%);
  --background-checked-disabled: hsl(142.7,46.05%,30.745%);
`;

const CheckBoxLabel = styled.label<Props>`
  position: absolute;
  top: 0;
  left: 0;
  width: 42px;
  height: 26px;
  border-radius: 15px;
  background: ${(props) => (props.isDisabled ? 'hsl(0, 0%, 30%)' : 'hsl(0, 0%, 74.5%)')};
  cursor: ${(props) => (props.isDisabled ? 'not-allowed' : 'pointer')};
  &::after {
    content: "";
    display: block;
    border-radius: 50%;
    width: 18px;
    height: 18px;
    margin: 3px;
    background: #ffffff;
    box-shadow: 1px 3px 3px 1px rgba(0, 0, 0, 0.2);
    transition: 0.2s;
  }
`;
const CheckBoxInput = styled.input`
  opacity: 0;
  z-index: 1;
  border-radius: 15px;
  width: 42px;
  height: 26px;
	margin: 0;
  &:checked + ${CheckBoxLabel} {
		background: ${(props) => (props.disabled ? 'var(--background-checked-disabled)' : 'var(--background-checked)')};
    &::after {
      content: "";
      display: block;
      border-radius: 50%;
      width: 18px;
      height: 18px;
      margin-left: 21px;
      transition: 0.2s;
    }
  }
`;

type Props = {
	isDisabled?: boolean;
	isChecked?: boolean;
	onCheck?: (isChecked: boolean) => void;
}

function Switch({ isDisabled, onCheck, isChecked = true }: Props) {
  const handleCheck = () => {
    if (isDisabled) return;

    onCheck?.(!isChecked);
  };

  return (
    <CheckBoxWrapper>
      <CheckBoxInput onChange={handleCheck} type="checkbox" checked={isChecked} disabled={isDisabled} />
      <CheckBoxLabel onClick={handleCheck} isDisabled={isDisabled} htmlFor="checkbox" />
    </CheckBoxWrapper>
  );
}

export default Switch;
