import type { FrameLocator, Page } from '@playwright/test';
import sleep from './sleep';

// Example data
// - open tabs: 0, 1, 2 (lastItemIndex = 3)
// - recent tabs: 0, 1, 2, 3, 4, 5 (lastItemIndex2 = 6)
class Navigator {
  index = 0;
  page: Page;
  lastItemIndex: number;
  lastItemIndex2: number;
  private phase: 1 | 2 = 1; // 1 for opened tabs, 2 for recent tabs

  constructor(
    currentPage: Page,
    lastItemIndex: number,
    lastItemIndex2: number,
  ) {
    this.page = currentPage;
    this.lastItemIndex = lastItemIndex;
    this.lastItemIndex2 = lastItemIndex2;
  }

  static getTabsState = async (frameLocator: FrameLocator) => {
    const tabs = await frameLocator
      .locator("*[data-testid='tab-master-tabs'] > div")
      .elementHandles();
    const tabsIds = await Promise.all(
      tabs.map(async (tab) => {
        const id = await tab.getAttribute('id');
        return id;
      }),
    );
    const openedTabs = tabsIds.filter(
      (id) => typeof id === 'string' && id.includes('opened-tab'),
    );
    const recentTabs = tabsIds.filter(
      (id) => typeof id === 'string' && !id.includes('opened-tab'),
    );

    return {
      openedTabs,
      recentTabs,
      openedTabsLength: openedTabs.length,
      recentTabsLength: recentTabs.length,
    };
  };

  static getNavigator = async (
    currentPage: Page,
    frameLocator: FrameLocator,
  ) => {
    const { openedTabsLength, recentTabsLength } = await this.getTabsState(
      frameLocator,
    );
    const navigator = new Navigator(
      currentPage,
      openedTabsLength - 1,
      recentTabsLength - 1,
    );
    return navigator;
  };

  moveUp = async () => {
    await this.page.keyboard.press('ArrowUp');
    this.index -= 1;
    // start reversing from the last position
    if (this.index < 0 && this.phase === 1) {
      this.phase = 2;
      this.index = this.lastItemIndex2;
    }
    if (this.index < 0 && this.phase === 2) {
      this.phase = 1;
      this.index = this.lastItemIndex;
    }
  };

  startFromOpenTabs = async () => {
    // start from first item
    if (this.phase === 1) {
      while (this.index !== 0) {
        await this.moveUp();
      }
    }
    while (this.phase !== 1) {
      await this.moveDown();
    }
  };

  startFromRecentTabs = async () => {
    // start from first item
    if (this.phase === 2) {
      while (this.index !== 0) {
        await this.moveUp();
      }
    }

    while (this.phase !== 2) {
      await this.moveDown();
    }
  };

  moveDown = async () => {
    await this.page.keyboard.press('ArrowDown');
    this.index += 1;
    if (this.index > this.lastItemIndex && this.phase === 1) {
      this.phase = 2;
      this.index = 0;
    }
    if (this.index > this.lastItemIndex2 && this.phase === 2) {
      this.phase = 1;
      this.index = 0;
    }
  };

  moveDownMultiple = async (times: number) => {
    for (let index = 0; index < times; index++) {
      await this.moveDown();
    }
  };

  navigate = async () => {
    await this.page.keyboard.press('Enter');

    await sleep(1000);

    // recent tab was clicked
    if (this.phase === 2) {
      this.lastItemIndex += 1; // new tab was open
      this.lastItemIndex2 -= 1; // recent tab was opened and converted to open tab
    }
    // reset
    this.phase = 1;
    this.index = 0;

    return this.page;
  };

  toggleExpandCollapse = async () => {
    await this.page.keyboard.press('Tab');
  };

  expand = async () => {
    await this.page.keyboard.down('Shift');
    await this.page.keyboard.down('ArrowRight');
    await this.page.keyboard.up('ArrowRight');
    await this.page.keyboard.up('Shift');
  };

  collapse = async () => {
    await this.page.keyboard.down('Shift');
    await this.page.keyboard.down('ArrowLeft');
    await this.page.keyboard.up('ArrowLeft');
    await this.page.keyboard.up('Shift');
  };

  moveDownAndExpand = async (useToggle = false) => {
    await this.moveDown();
    if (useToggle) await this.toggleExpandCollapse();
    else await this.expand();
  };

  moveUpAndExpand = async (useToggle = false) => {
    await this.moveUp();
    if (useToggle) await this.toggleExpandCollapse();
    else await this.expand();
  };
}

export default Navigator;
