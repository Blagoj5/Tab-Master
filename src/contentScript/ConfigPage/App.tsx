/* eslint-disable no-undef */
import { useState } from 'react';

import Option from './components/Option';
import Section from './components/Section';

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

  return null;
  // TODO: rework this for styled-components
  // return (
  //     <Center
  //       bg="background.400"
  //       py={8}
  //       minH="100vh"
  //     >
  //       <VStack
  //         p={4}
  //         maxW="1000px"
  //         w="100%"
  //         align="flex-start"
  //         bg="background.300"
  //         rounded="md"
  //       >
  //         <Section heading="Opened Tabs">
  //           <Option name="Show" isChecked={options.openedTabs.show} onChecked={handleOptionChecked} />
  //         </Section>
  //         <Section heading="Recently Opened Tabs">
  //           <Option name="Show" isChecked={options.openedTabs.show} onChecked={handleOptionChecked} />
  //           <Select
  //             borderColor="gray.400"
  //             color="gray.300"
  //             placeholder="Max Results"
  //             pl={4}
  //           >
  //             <option value="5">5</option>
  //             <option value="10">10</option>
  //             <option value="15">15</option>
  //             <option value="20">20</option>
  //             <option value="25">25</option>
  //             <option value="30">30</option>
  //             <option value="35">35</option>
  //             <option value="40">40</option>
  //             <option value="45">45</option>
  //             <option value="50">50</option>
  //             <option value="100">100</option>
  //           </Select>
  //           <HStack pl={4} w="full">
  //             <Box w="full">
  //               <FormLabel color="gray.300">Start date</FormLabel>
  //               <Input
  //                 borderColor="gray.400"
  //                 color="gray.300"
  //                 type="date"
  //                 placeholder="Start Time"
  //                 css={`
  // 								&::-webkit-calendar-picker-indicator {
  // 									cursor: pointer;
  // 									border-radius: 4px;
  // 									margin-right: 2px;
  // 									opacity: 0.6;
  // 									filter: invert(0.8);
  // 								}
  // 							`}
  //               />
  //             </Box>
  //             <Box w="full">
  //               <FormLabel color="gray.300">End date</FormLabel>
  //               <Input
  //                 borderColor="gray.400"
  //                 color="gray.300"
  //                 type="date"
  //                 placeholder="Start Time"
  //                 css={`
  // 								&::-webkit-calendar-picker-indicator {
  // 									cursor: pointer;
  // 									border-radius: 4px;
  // 									margin-right: 2px;
  // 									opacity: 0.6;
  // 									filter: invert(0.8);
  // 								}
  // 							`}
  //               />
  //             </Box>
  //           </HStack>
  //         </Section>
  //       </VStack>
  //     </Center>
  // );
}

export default App;
