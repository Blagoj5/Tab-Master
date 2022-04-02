import { Page } from '@playwright/test';

class Commands {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  closeTab = async () => {
    await this.page.keyboard.down('Control');
    await this.page.keyboard.press('x');
    await this.page.keyboard.up('Control');
  };
}

export default Commands;
