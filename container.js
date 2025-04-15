const CONTAINER_ID = "extension-container";

if (!document.getElementById(CONTAINER_ID)) {
	const container = document.createElement('div');
	container.id = CONTAINER_ID;
	container.style.position = 'fixed';
	container.style.top = '100px';
	container.style.right = '20px';
	container.style.width = '320px';
	container.style.height = '420px';
	container.style.zIndex = '999999';
	container.style.border = '1px solid #ccc';
	container.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
	container.style.backgroundColor = '#fff';

	const dragHandle = document.createElement('div');
	dragHandle.innerText = '⇕ Drag Me';
	dragHandle.style.height = '30px';
	dragHandle.style.background = '#ff0066';
	dragHandle.style.color = '#fff';
	dragHandle.style.fontWeight = 'bold';
	dragHandle.style.cursor = 'move';
	dragHandle.style.display = 'flex';
	dragHandle.style.alignItems = 'center';
	dragHandle.style.justifyContent = 'center';
	dragHandle.style.userSelect = 'none';

	// Create the close button
	const closeButton = document.createElement('button');
	closeButton.innerText = 'X';
	closeButton.style.position = 'absolute';
	closeButton.style.top = '5px';
	closeButton.style.right = '5px';
	closeButton.style.border = 'none';
	closeButton.style.backgroundColor = '#ff0066';
	closeButton.style.color = 'white';
	closeButton.style.fontWeight = 'bold';
	closeButton.style.cursor = 'pointer';
	closeButton.style.borderRadius = '50%';
	closeButton.style.width = '24px';
	closeButton.style.height = '24px';
	closeButton.style.textAlign = 'center';
	closeButton.style.lineHeight = '24px';
	closeButton.style.fontSize = '16px';

	const iframe = document.createElement('iframe');
	iframe.src = chrome.runtime.getURL('popup/content.html');
	iframe.allow = 'clipboard-read; clipboard-write';
	iframe.style.width = '100%';
	iframe.style.height = 'calc(100% - 30px)';
	iframe.style.border = 'none';
	iframe.style.backgroundColor = 'white';

	container.appendChild(dragHandle);
	container.appendChild(iframe);
	container.appendChild(closeButton);
	document.body.appendChild(container);

	// Close button functionality
	closeButton.addEventListener('click', () => {
		container.remove();
	});

	// Dragging logic
	let isDragging = false;
	let offsetX = 0, offsetY = 0;

	dragHandle.addEventListener('mousedown', (e) => {
		isDragging = true;
		offsetX = e.clientX - container.offsetLeft;
		offsetY = e.clientY - container.offsetTop;
		document.body.style.userSelect = 'none';
	});

	document.addEventListener('mousemove', (e) => {
		if (isDragging) {
			container.style.left = `${e.clientX - offsetX}px`;
			container.style.top = `${e.clientY - offsetY}px`;
			container.style.right = 'auto'; // prevent conflicting styles
		}
	});

	document.addEventListener('mouseup', () => {
		isDragging = false;
		document.body.style.userSelect = 'auto';
	});
}
