import { CheckboxGroup, HStack, Checkbox } from '@chakra-ui/react';

const options = ['tabs', 'bookmarks (soon)', 'history (soon)'];

function CheckList() {
  return (
    <CheckboxGroup
      colorScheme="blue"
      defaultValue={['tabs']}
      isDisabled
    >
      <HStack color="white" spacing={10} pb={4}>
        {options.map((option) => (
          <Checkbox value={option} textTransform="capitalize" isDisabled={option !== 'tabs'}>{option}</Checkbox>
        ))}
      </HStack>
    </CheckboxGroup>
  );
}

export default CheckList;
