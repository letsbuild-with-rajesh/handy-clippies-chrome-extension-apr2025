document.addEventListener("DOMContentLoaded", () => {
	initPopup();
});

const initPopup = () => {
	const containerDiv = document.createElement('div');
	containerDiv.id = 'container';
	containerDiv.style.display = 'flex';
	containerDiv.style.flexDirection = 'column';
	containerDiv.style.gap = '4px';

	const textarea = document.createElement('textarea');
	textarea.id = 'textInput';
	textarea.rows = 4;
	textarea.placeholder = 'Enter your text here...';
	textarea.style.resize = "vertical";

	const name = document.createElement('input');
	name.id = 'nameInput';
	name.type = "text";
	name.placeholder = 'Give a name to save the text';

	const saveButton = document.createElement('button');
	saveButton.id = 'saveText';
	saveButton.innerText = 'Save Text';

	const savedTextsDiv = document.createElement('div');
	savedTextsDiv.id = 'savedTexts';

	containerDiv.appendChild(textarea);
	containerDiv.appendChild(name);
	containerDiv.appendChild(saveButton);
	containerDiv.appendChild(savedTextsDiv);
	document.body.appendChild(containerDiv);

	loadTexts(); // Load texts on popup initialization

	document.getElementById('saveText').addEventListener('click', () => {
		const textInput = document.getElementById('textInput').value;
		const nameInput = document.getElementById('nameInput').value;
		if (textInput && nameInput) {
			// Get existing texts from Chrome Storage
			chrome.storage.local.get("data", (result) => {
				let savedTexts = result.data || [];
				// Add new text to the array
				savedTexts.push({ name: nameInput, text: textInput });
				// Save updated array back to Chrome Storage
				chrome.storage.local.set({ data: savedTexts }, () => {
					// Clear the textarea
					document.getElementById('textInput').value = '';
					document.getElementById('nameInput').value = '';
					// Display saved texts
					loadTexts();
					document.getElementById('textInput').focus();
				});
			});
		} else {
			alert('Please enter both text and name to save the text.');
		}
	});
}

function loadTexts() {
	chrome.storage.local.get("data", (result) => {
		const savedTexts = result.data || [];
		const savedTextsDiv = document.getElementById('savedTexts');
		savedTextsDiv.innerHTML = ''; // Clear previous texts
		savedTextsDiv.style.display = 'flex';
		savedTextsDiv.style.flexDirection = 'column';
		savedTextsDiv.style.gap = '6px';
		savedTextsDiv.style.marginTop = "8px";
		savedTextsDiv.style.marginBottom = "8px";

		savedTexts.forEach(({ text, name }, index) => {
			const textRow = document.createElement('div');
			textRow.style.display = 'flex';
			textRow.style.justifyContent = 'space-between';

			const textEl = document.createElement('div');
			textEl.textContent = `${index + 1}. ${name}`;

			const btnsContainer = document.createElement('div');
			btnsContainer.style.display = 'flex';
			btnsContainer.style.gap = '8px';

			const copyButton = document.createElement('button');
			copyButton.textContent = 'Copy';
			copyButton.addEventListener('click', () => {
				navigator.clipboard.writeText(text);
			});

			const deleteButton = document.createElement('button');
			deleteButton.textContent = 'Delete';
			deleteButton.addEventListener('click', () => {
				savedTexts.splice(index, 1);
				// Update Chrome Storage
				chrome.storage.local.set({ data: savedTexts }, () => {
					loadTexts(); // Reload texts after deletion
				});
			});

			btnsContainer.appendChild(copyButton);
			btnsContainer.appendChild(deleteButton);

			textRow.appendChild(textEl);
			textRow.appendChild(btnsContainer);
			savedTextsDiv.appendChild(textRow);
		});
	});
}
