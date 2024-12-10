// The following function, assigned the constant createStyleElement, creates a style element, assigns it a provided id,
// appends it to the head of the document, and returns the style element. The style elements are returned so that they
// can be used in a subsequent array. This is a helper function created for simplicity.

// Although it is against the syntax guidelines for this class, I used createElement in this function,
// as the interactions I created for this project require adding and removing content to/from the HTML <style>.
// A similar result could be acheived using .innerHTML() to add the style element to the document head,
// but since I'm creating a Chrome extension, this strategy is not applicable. Here's the source I used to
// come to this conclusion: https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML.
// According to mdn, using .innerHTML() in an extension "most likely will result in your code being rejected" as security measures
// prevent inline scripts from being executed.

// @param {string} id - The id to assign to the new style element.
// @returns {HTMLStyleElement} - The new style element.

const createStyleElement = (id) => {
    const styleElement = document.createElement('style');
    styleElement.id = id;
    document.head.appendChild(styleElement);
    return styleElement;
};

// This function creates an array of style elements by defining an array of strings (ids) and using .map()
// to call the function createStyleElement for each, destructuring them to the provided variables.

// @constant {HTMLStyleElement} fontStyleElement - The style element with the id 'custom-font-style'.
// @constant {HTMLStyleElement} textStyleElement - The style element with the id 'text-color-style'.
// @constant {HTMLStyleElement} bgStyleElement - The style element with the id 'background-style'.
// @constant {HTMLStyleElement} italicStyleElement - The style element with the id 'italic-style'.
// @constant {HTMLStyleElement} underlineStyleElement - The style element with the id 'underline-style'.
// @constant {HTMLStyleElement} imageStyleElement - The style element with the id 'image-style'.
// @constant {HTMLStyleElement} fontSizeStyleElement - The style element with the id 'font-size-style'.

const [fontStyleElement, textStyleElement, bgStyleElement, italicStyleElement, underlineStyleElement, imageStyleElement, fontSizeStyleElement] = [
    'custom-font-style', 'text-color-style', 'background-style', 'italic-style', 'underline-style', 'image-style', 'font-size-style'
].map(createStyleElement);

// The following function originalFontStyles creates a new Map object to store the original font styles on the web page.
// The Map object is used to record these font styles so that they can be restored when the Original option is selected
// in the Change Typeface dropdown.

// I used a Map object here istead of an Array, as an Array would not support the key-value pairs that I needed to store,
// given that the DOM element keys are not numeric. Here is the source for the information I used on js Maps:
// https://www.w3schools.com/js/js_maps.asp.

// @constant {Map} originalFontStyles - A Map object to store original font styles. The keys are the DOM elements and the values are their original font styles.

const originalFontStyles = new Map();

// A variable that keeps track of whether italics are removed. It is set to false by default.

// @type {boolean} italicsRemoved - A boolean to track if italics are removed or not.

let italicsRemoved = false;

// A variable that keeps track of whether underlines are removed. It is set to false by default.

// @type {boolean} underlinesRemoved - A boolean to track if underlines are removed or not.

let underlinesRemoved = false;

// The following function listens for input from the chrome.runtime API, using the .onMessage()
// method to communicate with different parts of the extension (in this case, popup.js) and retrieve action details.
// It then handle them accordingly using if blocks.

// Here's the source I used to explore message passing: https://developer.chrome.com/docs/extensions/develop/concepts/messaging.
// Additionally, I used UM-GPT to help convert my original code into a correctly formatted Chrome extension.
// UM-GPT Prompts: "What is the function of chrome.tabs.query when implementing message passing?", "My extension was working and now all of
// the sudden I'm getting an error that says: Uncaught (in promise) Error: Could not establish connection. Receiving end does not exist. What
// could be going wrong?", "Are there any changes I need to make to my manifest.json to ensure message passing works correctly?"

// @function
// @param {Object} request - The request object, which contains action details.
// @param {string} request.action - The action type, specified in popup.js. Action values include 'setFont', 'setTextColor', 'setBgColor', 'toggleItalics', 'toggleUnderlines', 'toggleImages', 'getFontSize', and 'setFontSize'.
// @param {string} [request.font] - The font to set when action is 'setFont'.
// @param {boolean} [request.checked] - Indicates whether the switch's state is checked for actions such as setTextColor and setBgColor.
// @param {string} [request.fontSize] - The font size to set when action is 'setFontSize'.
// @param {function} sendResponse - A callback function provided by the chrome.runtime API, it sends a response back to the message sender (popup.js).

chrome.runtime.onMessage.addListener((request, sendResponse) => {
    const { action, font, checked, fontSize } = request;

    // This if block is activated when the request action value recieved in the chrome.runtime.onMessage listener is equal to "setFont",
    // and sets the font for all elements on the page (html *) based on the provided font parameter in the request object.

    // @see chrome.runtime.onMessage for details on the request.action parameter.
    // @see chrome.runtime.onMessage for details on the [request.font] parameter.

    if (action === 'setFont') {

        // If the font is original, it restores the original font styles stored in the data-originalFont attribute of each element.
        // Otherwise, it sets the font to the specified font value, which is based on whatever option was clicked in the Change Typeface dropdown.
        // To ensure the original font styles are correctly stored, the block checks if the originalFontStyles Map object is empty using .size, and if it is,
        // uses .forEach() to iterate over all the html elements on the page, storing their original font styles in the Map object.
        // To ensure that the origial fonts are only set once, it checks that the element does not already have a data-originalFont attribute and (using an && operator)
        // if it does not, it creates a data-originalFont attribute and sets it to the original font using getComputedStyle(element).fontFamily.

        // Here's a source I used to better understand getComputedStyle: https://www.w3schools.com/jsref/jsref_getcomputedstyle.asp
        // In this case, getComputedStyle was necessary as it allows CSS, inline styles, and inherited styles to be considered when determining the font family of an element.
        // Other methods like element.style.fontFamily would not have done this.

        // @see originalFontStyles for details on the originalFontStyles Map parameter.

        if (originalFontStyles.size === 0) {
            document.querySelectorAll('html *').forEach(element =>
                !element.dataset.originalFont && (element.dataset.originalFont = getComputedStyle(element).fontFamily)
            );
        }

        // The following ternary assesses whether the font parameter is set to 'original' or not. If it is, it does not add content
        // to the fontStlyeElement (and therefore the HTML of the web page is unaffected). If it is not, it adds to the FontStyleElement, setting the font-family style to the
        // font recieved from the request.font parameter. !important is used to ensure that the font style applies to everything.

        // @param {HTMLElement} fontStyleElement - The style element with the id 'custom-font-style'
        // @param {string} font - The font value to apply. When set to 'original', no new styles are applied.

        fontStyleElement.textContent = font === 'original' ? '' : `html * { font-family: ${font} !important; }`;

        // If the font is set to original, the following block uses .forEach() to iterate over the html elements on the page and restore their original font styles.

        // @param {string} font - The font value to apply. When set to 'original', no new styles are applied.

        if (font === 'original') {
            document.querySelectorAll('html *').forEach(element => {
                const originalFont = element.dataset.originalFont;
                if (originalFont) {
                    element.style.fontFamily = originalFont;
                }
            });
        }
    }

    // The following if block, which is activated when the action equals 'setTextColor', employs a ternary that assesses whether the
    // checked parameter is true or false. If it's true, it sets the text color to black by adding text content to the textStyleElement
    // and thereby to the web page's HTML <style>. If it's false, it removes the text color style by setting the text content to ''.

    // @param {string} action - The action type to handle. It is set to 'setTextColor' which was defined in my popup.js.
    // @param {HTMLElement} textStyleElement - The <style> element used to apply text color styles.
    // @param {boolean} checked - Indicates whether or not the switch attached to the evenListener is already checked.
    // @see chrome.runtime.onMessage for details on the sendResponse parameter.

    if (action === 'setTextColor') {
        textStyleElement.textContent = checked ? 'html * { color: black !important; }' : '';
        sendResponse && sendResponse({ status: 'Text color updated' });
    }

    // The following if block, which is activated when the action equals 'setBgColor', employs a ternary that assesses whether the
    // checked parameter is true or false. If it's true, it sets the background color to white by adding text content to the bgStyleElement
    // and thereby to the web page's HTML <style>. If it's false, it removes the background color style by setting the text content to ''.

    // @param {string} action - The action to be handled, in this case, 'setBgColor'.
    // @param {HTMLElement} bgStyleElement - The <style> element used to apply background color styles.
    // @param {boolean} checked - Indicates whether the background color should be set to white (true) or cleared (false).
    // @see chrome.runtime.onMessage for details on the sendResponse parameter.

    if (action === 'setBgColor') {
        bgStyleElement.textContent = checked ? 'html * { background: white !important; }' : '';
        sendResponse && sendResponse({ status: 'Background color updated' });
    }

    // This if block is activated when the action value is equal to "toggleItalics". It updates the italicsRemoved state based on the value
    // of the checked parameter. It then employs a ternary which assesses whether or not the italics have been removed. In popup.js, italicsRemoved
    // is set to false by default, this ensures that on the first click the italics are removed, as event changes the boolean value to true,
    // which then adds font-style: normal to the text content of italisStyleElement according to the ternary.

    // @param {string} action - The action to be handled, in this case,'toggleItalics'.
    // Indicates whether the italics should be removed (true) or added (false).
    // @param {HTMLElement} italicsStyleElement - The style element with the id 'italic-style'.
    // @see chrome.runtime.onMessage for details on the sendResponse parameter.

    if (action === 'toggleItalics') {
        italicsRemoved = checked;
        italicStyleElement.textContent = italicsRemoved ? 'html * { font-style: normal !important; }' : '';
        sendResponse && sendResponse({ status: 'Italics toggled' });
    }

    // This if block is activated when the action value is equal to "toggleUnderlines". It updates the underlinesRemoved state based on the value
    // of the passed checked parameter. It then employs a ternary which assesses whether or not underlines have been removed. Like italicsRemoved, in popup.js, underlinesRemoved
    // is set to false by default, which ensures that the first click removes underlines, as the click event changes the boolean value to true,
    // which then adds text-decoration: none to the text content of underlineStyleElement according to the ternary.

    // @param {string} action - The action to be handled. This function processes if the action is 'toggleUnderlines'.
    // @param {boolean} checked - Indicates whether underlines should be removed (true) or added (false).
    // @param {HTMLElement} underlineStyleElement - The style element with the id 'underline-style'.
    // @see chrome.runtime.onMessage for details on the sendResponse parameter.

    if (action === 'toggleUnderlines') {
        underlinesRemoved = checked;
        underlineStyleElement.textContent = underlinesRemoved ? 'html * { text-decoration: none !important; }' : '';
        sendResponse && sendResponse({ status: 'Underlines toggled' });
    }

    // This if block is activated when the action value is equal to "toggleImages". It employs a ternary which assesses whether or not images have been hidden.
    // Unlike toggleUnderlines and toggleItalics, imagesVisible is set to true by default in popup.js, which changes to false when the button is clicked.
    // This means that the first click is guaranteed to hide images as the ternary adds display: none to the text content of imageStyleElement when the passed checked value
    // equals false. If the checked value is true, the text content is set to an empty string, which reveals the images.

    // @param {string} action - The action to be handled. This function processes if the action is 'toggleImages'.
    // @param {boolean} checked - Indicates whether images are be visible (true) or hidden (false).
    // @param {HTMLElement} imageStyleElement - The style element with the id 'image-style'.
    // @see chrome.runtime.onMessage for details on the sendResponse parameter.

    if (action === 'toggleImages') {
        imageStyleElement.textContent = checked ? '' : 'img { display: none !important; }';
        sendResponse && sendResponse({ status: 'Images toggled' });
    }

    // This if block is activated when the action value is equal to "getFontSize". It sends a response back to the message sender (popup.js) with the current font size,
    // The && operator checks that sendResponse is not null or undefined before sending. Additionally, window.getComputedStyle() is used to get the font size of the document element.

    // I used UM-GPT to help me figure out the logic for this interaction.
    // UM-GPT Prompts: "How can I retrieve a webpage's font size and adjust it using my range element?", "How can I send the font size back to my popup.js file so that the
    // range is set to the original size by default?"

    // @param {string} action - The action to be handled. This function processes if the action is 'getFontSize'.
    // @see chrome.runtime.onMessage for details on the sendResponse parameter.

    if (action === 'getFontSize') {
        sendResponse && sendResponse({ fontSize: window.getComputedStyle(document.documentElement).fontSize });
    }

    // This if block is activated when the action value is equal to "setFontSize". It sets the font size of the document element to the value passed in the fontSize parameter.
    // The fontSizeStyleElement is then updated with the new font size. The !important rule is used to ensure that the font size is applied to all elements on the page.

    // @param {string} action - The action to be handled. This function processes if the action is 'setFontSize'.
    // @param {string} fontSize - The new font size to be applied, including units (such as '12px' and '2em').
    // @param {HTMLElement} fontSizeStyleElement - The style element with the id 'font-size-style'.
    // @see chrome.runtime.onMessage for details on the sendResponse parameter.

    if (action === 'setFontSize') {
        fontSizeStyleElement.textContent = `html, html * { font-size: ${fontSize} !important; }`;
        sendResponse && sendResponse({ status: 'Font size updated' });
    }
});