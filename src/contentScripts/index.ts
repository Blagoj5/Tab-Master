/* eslint-disable no-undef */
/* eslint-disable max-classes-per-file */

class DOMHelpers {
  addScript = ({ src, id, onLoad }: {src: string, id: string, onLoad?: () => void}) => {
    const existing = document.getElementById(id);
    if (existing) {
      return existing;
    }
    const script = document.createElement('script');
    script.src = src;
    script.id = id;
    script.async = true;
    script.defer = true;
    if (onLoad) {
      script.onload = () => {
        onLoad();
      };
    }
    document.body.appendChild(script);
    return script;
  };
}

class TabMaster {
private tabMasterDialog: HTMLDialogElement;

private domHelpers: DOMHelpers;

constructor() {
  this.tabMasterDialog = document.createElement('dialog');
  this.domHelpers = new DOMHelpers();
}

init() {
  const existingDialog = document.querySelector('dialog');

  if (existingDialog) {
    this.tabMasterDialog = existingDialog;
    this.tabMasterDialog.showModal();
  } else {
    this.tabMasterDialog.classList.add('tab-master-dialog');

    document.body.appendChild(this.tabMasterDialog);

    // add react script
    this.domHelpers.addScript({
      src: chrome.runtime.getURL('pages/bundle.js'),
      id: 'tab-master-dialog-script',
    });

    this.tabMasterDialog.id = 'tab-master-extension';
    this.tabMasterDialog.showModal();
  }

  // TODO: many event listener will be mounted like this fix it;
  // CLOSE when escape clicked, // TODO: OR BACKDROP, that needs to be coded
  document.addEventListener('keypress', (e) => {
    if (e.key === 'Escape') this.tabMasterDialog.close();
  });
}
}

const tabMaster = new TabMaster();
tabMaster.init();
