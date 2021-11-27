/* eslint-disable no-undef */
import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Avatar, Box, Flex, Heading, HStack, Icon, Text,
} from '@chakra-ui/react';
import { OpenedTab } from '../types';

type PanelProps = {
  panelId: string;
  headingTitle: string;
  tabs: OpenedTab[];
  // eslint-disable-next-line no-unused-vars
  onTabClicked: (tabId: number) => void;
  selectedTabId: string;
}

function Panel({
  headingTitle,
  tabs,
  onTabClicked,
  selectedTabId,
  panelId,
}: PanelProps) {
  console.log('**selected', selectedTabId);
  return (
    <Box w="full" cursor="pointer">
      <Heading as="h3" p={2} fontSize="md" color="white">{headingTitle}</Heading>
      {tabs.map((tab) => (
        <HStack
          id={`${tab.id}-${panelId}`}
          key={tab.id}
          py={2}
          px={2}
          bg={selectedTabId === tab.virtualId ? 'input.300' : 'auto'}
          _hover={{ bg: 'input.300' }}
          rounded="md"
          userSelect="none"
          onClick={() => onTabClicked(tab.id)}
        >
          <Avatar name="Dan Abrahmov" bg="transparent" src={tab.favIconUrl} w="20px" h="20px" />
          <Flex alignItems="center" justify="space-between" flex={1} w="0">
            <Text
              flex={1}
              color="white"
              overflow="hidden"
              whiteSpace="nowrap"
              textOverflow="ellipsis"
              mr={10}
              fontWeight="500"
							// TODO: add font-sizes everywhere
            >
              <Text
                as="span"
                w="full"
              >
                {tab.title}
              </Text>
            </Text>
            <Text
              flex={1}
              color="text.700"
              overflow="hidden"
              whiteSpace="nowrap"
              textOverflow="ellipsis"
              textAlign="right"
            >
              <Text
                as="span"
                w="full"
              >
                {tab.url}
              </Text>
            </Text>
          </Flex>

          {/* // TODO: implement this, show full link and info about the tab */}
          <Icon as={ChevronDownIcon} color="gray.200" />

        </HStack>
      ))}
    </Box>
  );
}

export default Panel;
