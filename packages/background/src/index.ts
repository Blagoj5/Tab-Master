import DomHelper from './DomHelper';
import TabMaster from './TabMaster';

const domHelper = new DomHelper();

const tabMaster = new TabMaster(domHelper);
domHelper.listenTabStatus(() => tabMaster.openTabMaster());

tabMaster.init();
