// console.log('***contentScripts');

// console.log('style: ', document.body.style);
// const modal = document.createElement('div');
// modal.innerHTML = '<p>Bazeeee</p>';

// modal.classList.add('tab-master-modal');

// document.body.appendChild(modal);

// TODO: if iframe does not work method try this. Create a element with id="root", and append the bundle.js 
// TODO: script to the document
const modal = document.createElement('dialog');

modal.classList.add('tab-master-modal');

modal.innerHTML = `
	<iframe id="popup-content"; style="height:100%"></iframe>
	<div style="position:absolute; top:0px; left:5px;">
		<button style="padding: 8px 12px; font-size: 16px; border: none; border-radius: 20px;">x</button>
	</div>
`;

document.body.appendChild(modal);

const dialog = document.querySelector('dialog');

if (dialog) {
	dialog?.showModal();

	const iframe = document.getElementById('popup-content') as HTMLIFrameElement | null;

	if (iframe) {
		iframe.src = chrome.runtime.getURL('pages/index.html');
		iframe.frameBorder = '0';
		dialog.querySelector('button')?.addEventListener('click', () => {
			dialog.close();
		});
	}
}