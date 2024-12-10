
// Initializes Bootstrap dropdowns for all elements assigned the 'dropdown-toggle' class in pop-up.html.
// This code iterates over the 'dropdown-toggle' elements using .forEach().

document.querySelectorAll('.dropdown-toggle').forEach(dropdownToggleEl => new bootstrap.Dropdown(dropdownToggleEl));

// Changes the typeface via dropdown.

// The following is an eventListener that waits for 'click's on the font dropdown menu items (.dropdown-item).
// I used .preventDefault(), because my dropdown items are formatted as links in my HTML (using <a href="#" [...]>) so clicking on them can cause a default
// behavior that influences my custom behavior. Then, using .forEach(), it iterates through all the dropdown items and removes the active class from each one, making sure
// only the clicked item has the 'active' class. It then adds the active class to the clicked item. It then gets the 'data-font' attribute from the clicked item using .getAttribute().
// This attribute has been connected to the buttons in my popup.html file. It then uses chrome.tabs.query() to get the active tab in the current window and sends a message to the content script.

// I used UM-GPT to help me come up with the preventDefault() solution. UM-GPT Prompt: "My dropdown items aren't working, given the following code, what might be the reason?"
// And here's a source I used to better understand .preventDefault(): https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault.
// Additionally, I used this source to learn about message passing in Chrome extensions: https://developer.chrome.com/docs/extensions/develop/concepts/messaging.

// @listens {Event} - The click event on each dropdown item.

document.querySelectorAll('.dropdown-item').forEach(item => {
  item.addEventListener('click', event => {
    event.preventDefault();
    document.querySelectorAll('.dropdown-item').forEach(e => e.classList.remove('active'));
    item.classList.add('active');
    const selectedFont = item.getAttribute('data-font');
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      tabs.length && chrome.tabs.sendMessage(tabs[0].id, { action: 'setFont', font: selectedFont });
    });
  });
});

// Adds and removes italics via button.

// The following uses document.querySelector() to get the element with the id 'replace-button', assigning it to the constant replaceButton.

const replaceButton = document.querySelector('#replace-button');

// The following is a variable that keeps track of whether italics have been removed or not. It is initially set to false.

// @type {boolean}

let italicsRemoved = false;

// The following is an eventListener that waits for a 'click' on the replaceButton. When the button is clicked, italicsRemoved is toggled (set to the opposite of its current value).
// Then, using chrome.tabs.query(), it gets the active tab in the current window and sends a message to the content script with the action 'toggleItalics' and the value of italicsRemoved.
// If a response is received and the response.status is 'Italics toggled', the text content of the replaceButton is changed to 'Add Italics' if italicsRemoved is true, and 'Remove Italics' if italicsRemoved is false.

// @listens {Event} click - Listens for click events on the replaceButton.

replaceButton.addEventListener('click', () => {
  italicsRemoved = !italicsRemoved;
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    tabs.length && chrome.tabs.sendMessage(tabs[0].id, {
      action: 'toggleItalics',
      checked: italicsRemoved
    }, (response) => {
      if (response && response.status === 'Italics toggled') {
        replaceButton.textContent = italicsRemoved ? 'Add Italics' : 'Remove Italics';
      }
    });
  });
});

// Adds and removes underlines from content via button.

// The following uses document.querySelector() to get the element with the id 'toggle-underline-button', assigning it to the constant underlineButton.

const underlineButton = document.querySelector('#toggle-underline-button');

// The following is a variable that keeps track of whether underlines have been removed or not. It is initially set to false.

// @type {boolean}

let underlinesRemoved = false;

// The following is an eventListener that waits for a 'click' on the underlineButton. When the button is clicked, underlinesRemoved is toggled (set to the opposite of its current value).
// Then, using chrome.tabs.query(), it gets the active tab in the current window and sends a message to the content script with the action 'toggleUnderlines' and the value of underlinesRemoved.
// If a response is received and the response.status is 'Underlines toggled'. The text content of the underlineButton is changed to 'Add Underlines' if underlinesRemoved is true, and 'Remove Underlines' if underlinesRemoved is false.

// @param {HTMLElement} underlineButton - The button element that has the .eventListener() attached.
// @param {boolean} underlinesRemoved - Indicates whether or not underlines have been removed.
// @listens {Event} click - Listens for click events on the underlineButton.

underlineButton.addEventListener('click', () => {
  underlinesRemoved = !underlinesRemoved;
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    tabs.length && chrome.tabs.sendMessage(tabs[0].id, {
      action: 'toggleUnderlines',
      checked: underlinesRemoved
    }, (response) => {
      if (response && response.status === 'Underlines toggled') {
        underlineButton.textContent = underlinesRemoved ? 'Add Underlines' : 'Remove Underlines';
      }
    });
  });
});

// Changes background to white and back via switch.

// The following uses document.querySelector() to get the element with the id 'white-bg-switch', assigning it to the constant bgSwitch.
// The following is an eventListener that waits for a 'change' on the bgSwitch. When the switch is changed, it uses chrome.tabs.query() to get the active tab in the current window.
// It then sends a message to the content script with the action 'setBgColor' and the value of bgSwitch.checked.
// The content script then changes the background color of the page to white if bgSwitch.checked is true, and back to the original color if bgSwitch.checked is false.

// @param {HTMLElement} bgSwitch - The switch element that has the .eventListener() attached.
// @listens {Event} change - Listens for change events on the bgSwitch element.

const bgSwitch = document.querySelector('#white-bg-switch');

bgSwitch.addEventListener('change', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    tabs.length && chrome.tabs.sendMessage(tabs[0].id, { action: 'setBgColor', checked: bgSwitch.checked });
  });
});

// Changes text color to black and back via switch.

// The following uses document.querySelector() to get the element with the id 'black-text-switch', assigning it to the constant textSwitch.
// An eventListener attached to textSwitch waits for a 'change' on the textSwitch. When the switch is changed, chrome.tabs.query() is used to get the active tab in the current window.
// A message is then sent to the content script with the action 'setTextColor' and the value of textSwitch.checked.
// The content script then changes the text color of the page to black if textSwitch.checked is true, and back to the original color if textSwitch.checked is false.

// @param {HTMLElement} textSwitch - The switch element that has the .eventListener() attached.
// @listens {Event} change - Listens for change events on the textSwitch element.

const textSwitch = document.querySelector('#black-text-switch');

textSwitch.addEventListener('change', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    tabs.length && chrome.tabs.sendMessage(tabs[0].id, { action: 'setTextColor', checked: textSwitch.checked });
  });
});

// Adjusts font size via range input.

// The following uses document.querySelector() to get the element with the id 'customRange3', assigning it to the constant rangeInput.
// chrome.tabs.query() is then used to get the active tab in the current window. It then sends a message to the content script with the action 'getFontSize'.
// If a response is received and response.fontSize exists, the value of rangeInput is set to parseFloat(response.fontSize), which converts the string to a floating point number to be used in the range input.

// I used UM-GPT to help me with converting the response to a value usable by the range input. UM-GPT Prompt: "I'm trying to set the value of a range input to a value I get from a message from my content script, how might I do this?"
// Here's a source I used to investigate .parseFloat(): https://www.w3schools.com/jsref/jsref_parsefloat.asp

// @constant {HTMLElement} rangeInput - The range input element.

const rangeInput = document.querySelector('#customRange3');
if (rangeInput) {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    tabs.length && chrome.tabs.sendMessage(tabs[0].id, { action: 'getFontSize' }, response => {
      if (response && response.fontSize) {
        rangeInput.value = parseFloat(response.fontSize);
      }
    });
  });

  // The following adds an event listener to the range input element that atcivates when the input value changes.
  // It then creates a font size string with the changed input value and sends a message to the active tab's content script using chrome.tabs.query() and chrome.tabs.sendMessage()
  // to update the font size.

  // @param {Event} event - The input event on the range input element.
  // @listens {Event} input - Listens for input events on the rangeInput element.

  rangeInput.addEventListener('input', event => {
    const fontSize = `${event.target.value}pt`;
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      tabs.length && chrome.tabs.sendMessage(tabs[0].id, { action: 'setFontSize', fontSize });
    });
  });
}

// Toggles image visability via button.

// The following uses document.querySelector() to get the element with the id 'toggle-image-visibility', assigning it to the constant imageButton.

const imageButton = document.querySelector('#toggle-image-visibility');

// The following is a variable that keeps track of whether images are visible or not. It is initially set to true.

// @type {boolean}

let imagesVisible = true;

// The following adds an eventListener to the imageButton element that waits for a 'click' event. When the button is clicked, imagesVisible is toggled (set to the opposite of its current value).
// Then, using chrome.tabs.query(), it gets the active tab in the current window and sends a message to the content script with the action 'toggleImages' and the value of imagesVisible.
// If a response is received and the response.status is 'Images toggled', the text content of the imageButton is changed to 'Hide Images' if imagesVisible is true, and 'Show Images' if imagesVisible is false.

// @constant {HTMLElement} imageButton - The button element that toggles image visibility.
// @listens {Event} click - Listens for click events on the imageButton element.

imageButton.addEventListener('click', () => {
  imagesVisible = !imagesVisible;
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    tabs.length && chrome.tabs.sendMessage(tabs[0].id, {
      action: 'toggleImages',
      checked: imagesVisible
    }, response => {
      if (response && response.status === 'Images toggled') {
        imageButton.textContent = imagesVisible ? 'Hide Images' : 'Show Images';
      }
    });
  });
});
