// /* eslint-disable no-undef */
// /* eslint-disable max-classes-per-file */

// class DOMHelpers {
//   addScript = ({ src, id, onLoad }: {src: string, id: string, onLoad?: () => void}) => {
//     const existing = document.getElementById(id);
//     if (existing) {
//       return existing;
//     }
//     const script = document.createElement('script');
//     script.src = src;
//     script.id = id;
//     script.async = true;
//     script.defer = true;
//     if (onLoad) {
//       script.onload = () => {
//         onLoad();
//       };
//     }
//     document.body.appendChild(script);
//     return script;
//   };
// }

// const div = document.createElement('div');
// div.id = 'tab-master-extension';
// document.body.appendChild(div);

// const domHelpers = new DOMHelpers();
// domHelpers.addScript({
//   src: chrome.runtime.getURL('pages/bundle.js'),
//   id: 'tab-master-dialog-script',
// });

// const port = chrome.runtime.connect('ppngoninecbjfmdapjcohianklhpcnlc', { name: 'init' });

// port.postMessage({ loaded: true });

// port.onMessage.addListener((msg) => {
//   if (msg.tabsNumber) {
//     console.log('content-scripts*****tabs', msg.tabsNumber);
//   }
// });
