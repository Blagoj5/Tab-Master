import { ReactNode } from 'react';

type Props = {children: ReactNode, heading: string};
function Section({ children, heading }: Props) {
  return null;
  // return (
  //   <Box w="full">
  //     <Heading as="h2" mb={4} fontSize="lg" color="gray.600">{heading}</Heading>
  //     <VStack pl={4} w="full" spacing={4} align="flex-start">
  //       {children}
  //     </VStack>
  //   </Box>

  // );
}

export default Section;
