type Props = {
	name: string;
	isChecked: boolean;
	// eslint-disable-next-line no-unused-vars
	onChecked: (isChecked: boolean) => void;
};

function Option({ isChecked, name, onChecked }: Props) {
  return null;
  // return (
  //   <Flex
  //     w="full"
  //     justify="space-between"
  //     px={4}
  //     py={2}
  //     cursor="pointer"
  //     _hover={{ bg: 'background.200' }}
  //     rounded="sm"
  //     onClick={() => onChecked(!isChecked)}
  //   >
  //     <Text color="white" textTransform="capitalize">{name}</Text>
  //     <Checkbox isChecked={isChecked} />
  //   </Flex>
  // );
}

export default Option;
