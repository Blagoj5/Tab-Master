/* eslint-disable no-undef */
import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Avatar, Flex, HStack, Icon, Text,
} from '@chakra-ui/react';
import { RecentOpenedTab } from '../../../../common';

import Pane from '../Pane';

type PanelProps = {
  headingTitle: string;
  tabs: RecentOpenedTab[];
  // eslint-disable-next-line no-unused-vars
  onTabClicked: (tabUrl: string) => void;
  selectedTabId: string;
}

function RecentOpenedTabs({
  headingTitle,
  tabs,
  onTabClicked,
  selectedTabId,
}: PanelProps) {
  return (
    <Pane headingTitle={headingTitle}>
      {tabs.map((tab) => (
        <HStack
          id={tab.id}
          key={tab.id}
          py={2}
          px={2}
          bg={selectedTabId === tab.id ? 'input.300' : 'auto'}
          _hover={{ bg: 'input.300' }}
          rounded="md"
          userSelect="none"
          onClick={() => tab.url && onTabClicked(tab.url)}
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
    </Pane>
  );
}

export default RecentOpenedTabs;
