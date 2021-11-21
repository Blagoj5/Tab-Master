import {
  Avatar, Box, Heading, HStack, Text,
} from '@chakra-ui/react';

type PanelProps = {
  headingTitle: string;
  items: {
    title: string;
    url: string;
  }[];
}

function Panel({ headingTitle, items }: PanelProps) {
  return (
    <Box w="full" cursor="pointer">
      <Heading as="h3" p={2} fontSize="md" color="white">{headingTitle}</Heading>
      {items.map((item) => (
        <HStack py={1} px={2} _hover={{ bg: 'green' }} rounded="md">
          <Avatar name="Dan Abrahmov" src="https://bit.ly/dan-abramov" w="20px" h="20px" />
          <Text color="white">{item.title}</Text>
          <Text color="text.700">{item.url}</Text>
        </HStack>
      ))}
    </Box>
  );
}

export default Panel;
