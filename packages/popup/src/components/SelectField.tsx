import styled from 'styled-components';
import Field from './Field';

type Props = {
	label: string;
	value?: string;
	options: string[];
	onChange?: (newValue: string) => void;
}

// new Date().toDateString() is the native for value
const SelectFieldStyle = styled.select`
  border-radius: 10px;
	background: var(--input-primary);
	border: 0;
	padding: 0.5rem 0.4rem;
	min-width: 150px;
	color: #cfcdcd;
	:focus {
		border: none;
		outline: unset;
	}
`;

function SelectField({
  label, value, options, onChange,
}: Props) {
  return (
    <Field
      label={label}
      input={(
        <SelectFieldStyle value={value} onChange={(e) => onChange?.(e.target.value)}>
          {options.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </SelectFieldStyle>
			)}
    />
  );
}

export default SelectField;
