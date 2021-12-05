/* eslint-disable no-undef */
import {
  Box, Center, CSSReset, Heading, ThemeProvider, VStack,
} from '@chakra-ui/react';
import { useState } from 'react';

import Option from './components/Option';
import theme from './theme';

function App() {
  const [options, setOptions] = useState({
    openedTabs: {
      show: true,
      name: 'Show',
    },
  });

  const handleOptionChecked = (isChecked: boolean) => {
    setOptions({
      openedTabs: {
        ...options.openedTabs,
        show: isChecked,
      },
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <CSSReset />
      <Center
        bg="background.400"
        py={8}
        minH="100vh"
      >
        <VStack
          p={4}
          maxW="1000px"
          w="100%"
          align="flex-start"
          bg="background.300"
          rounded="md"
        >
          <Box w="full">
            <Heading mb={4} as="h2" fontSize="lg" color="gray.600">Opened Tabs</Heading>
            <Option name="Show" isChecked={options.openedTabs.show} onChecked={handleOptionChecked} />
          </Box>
        </VStack>
      </Center>
    </ThemeProvider>
  );
}

export default App;
