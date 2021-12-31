import styled from 'styled-components';
import Field from './Field';

type Props = {
	label: string;
	value?: number | string;
}

// new Date().toDateString() is the native for value
const DatePicker = styled.input`
  border-radius: 10px;
	background: var(--input-primary);
	border: 0;
	padding: 0.4rem 0.6rem;
	color: #cfcdcd;
	:focus {
		border: none;
		outline: unset;
	}
`;

function DateField({ label, value }: Props) {
  const dateValue = value ? new Date(value).toDateString() : undefined;
  return (
    <Field
      label={label}
      input={<DatePicker type="date" value={dateValue} />}
    />
  );
}

export default DateField;
