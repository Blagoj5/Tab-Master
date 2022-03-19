import type { Page } from 'puppeteer';

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

  moveDown = async () => {
    await this.page.keyboard.press('ArrowDown');
    this.index += 1;
    if (this.index >= this.lastItemIndex && this.phase === 1) {
      this.phase = 2;
      this.index = 0;
    }
    if (this.index >= this.lastItemIndex2 && this.phase === 2) {
      this.phase = 1;
      this.index = 0;
    }
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
