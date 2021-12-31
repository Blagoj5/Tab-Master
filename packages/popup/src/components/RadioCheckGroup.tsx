import { useMemo, useState } from 'react';

import RadioCheck from './RadioCheck';

type Option = {
	id: string
	label: string
	description?: string
};

type Props<T extends Option> = {
	options: T[];
	defaultOptionChecked: string;
	// eslint-disable-next-line no-unused-vars
	onChange?: (optionId: T['id']) => void;
}

function RadioCheckGroup<T extends Option>({ options, defaultOptionChecked, onChange }: Props<T>) {
  const initialOptionsMap = useMemo(() => options.reduce((mappedOptions, option) => ({
    ...mappedOptions,
    [option.id]: false,
  }), {} as Record<T['id'], boolean>), []);
  const [checkedState, setCheckedState] = useState({
    ...initialOptionsMap,
    [defaultOptionChecked]: true,
  });

  const handleCheck = (optionId: T['id']) => {
    setCheckedState({
      ...initialOptionsMap,
      [optionId]: true,
    });
    onChange?.(optionId);
  };

  return (
    <>
      {options.map((option) => (
        <RadioCheck
          key={option.id}
          {...option}
          isChecked={checkedState[option.id]}
          setIsChecked={handleCheck}
        />
      ))}
    </>
  );
}

export default RadioCheckGroup;
