import {
  Box, ChakraProvider, Input, VStack,
} from '@chakra-ui/react';
import '@fontsource/fira-sans';

import theme from './theme';
import Panel from './components/Panel';
import CheckList from './components/CheckList';

const items = [
  { title: 'Fitness Documentation', url: 'https://fitnessdocumentation.com' },
  { title: 'Fitness Documentation | Training Programs', url: 'https://fitnessdocumentation.com/training-programs' },
];

// TODO: I somehow need to get the full chrome object here
function App() {
  return (
    <ChakraProvider theme={theme}>
      <Box bg="primary.400" p={6}>
        <CheckList />
        <Input
          bg="input.400"
          color="white"
          placeholder="Where would you like to go?"
          _placeholder={{
            color: 'input.100',
          }}
          border="none"
          fontSize="1.3rem"
          py={8}
          mb={4}
          _focus={{}}
          shadow="xl"
        />
        <VStack align="flex-start" spacing={3}>
          <Panel headingTitle="OPEN TABS" items={items} />
          <Panel headingTitle="PREVIOUSLY OPENED TABS" items={items} />
          <Panel headingTitle="COMMON USED TABS" items={items} />
          <Panel headingTitle="BOOKMARK" items={items} />
          <Panel headingTitle="HISTORY" items={items} />
        </VStack>
      </Box>
    </ChakraProvider>
  );
}

export default App;
