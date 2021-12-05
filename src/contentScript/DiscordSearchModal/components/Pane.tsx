import { Box, Heading } from '@chakra-ui/react';
import { ReactNode } from 'react';

type PanelProps = {
  headingTitle: string;
	children: ReactNode
}

function Pane({
  headingTitle,
  children,
}: PanelProps) {
  return (
    <Box w="full" cursor="pointer">
      <Heading as="h3" p={2} fontSize="md" color="white">{headingTitle}</Heading>
      {children}
    </Box>
  );
}

export default Pane;
