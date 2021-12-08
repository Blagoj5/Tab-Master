/* eslint-disable no-undef */
import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Avatar, Box, Flex, HStack, Icon, Text,
} from '@chakra-ui/react';
import { CommonTab } from '../../../../common';

type ExtractKeys<T, Z> = {
  [K in keyof T]: T[K] extends Z ? K : never;
}[keyof T];

type PanelProps<T> = {
  tabs: T[];
	clickCallbackField: ExtractKeys<T, string>;
  // eslint-disable-next-line no-unused-vars
  onTabClicked: (tabId: string) => void;
  selectedTabId: string;
}

function SearchedTabs<T extends CommonTab>({
  tabs,
  onTabClicked,
  selectedTabId,
  clickCallbackField,
}: PanelProps<T>) {
  return (
    <Box
      w="full"
      align="flex-start"
      spacing={3}
      flex={1}
      overflowY="auto"
    >

      {tabs.map((tab) => (
        <HStack
          id={`${tab.id}`}
          key={tab.id}
          py={2}
          px={2}
          bg={selectedTabId === (tab[clickCallbackField] as unknown as string) ? 'input.300' : 'auto'}
          _hover={{ bg: 'input.300' }}
          rounded="md"
          userSelect="none"
          onClick={() => onTabClicked(clickCallbackField as unknown as string)}
        >
          <Avatar name={tab.title} bg="transparent" src={tab.faviconUrl} w="20px" h="20px" />
          <Flex alignItems="center" justify="space-between" flex={1} w="0">
            <Text
              flex={1}
              color="white"
              overflow="hidden"
              whiteSpace="nowrap"
              textOverflow="ellipsis"
              mr={10}
              fontWeight="500"
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

export default SearchedTabs;
