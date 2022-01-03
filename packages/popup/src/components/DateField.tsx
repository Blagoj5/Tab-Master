import styled from 'styled-components';
import Field from './Field';

type Props = {
	label: string;
	value?: number;
	onChange?: React.ChangeEventHandler<HTMLInputElement>;
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

function DateField({ label, value, onChange }: Props) {
  let dateValue = '';

  if (value) {
    const date = new Date(value);
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0'); // January is 0!
    const yyyy = date.getFullYear();
    dateValue = `${yyyy}-${mm}-${dd}`;
  }

  return (
    <Field
      label={label}
      input={<DatePicker type="date" value={dateValue} onChange={onChange} />}
    />
  );
}

export default DateField;
