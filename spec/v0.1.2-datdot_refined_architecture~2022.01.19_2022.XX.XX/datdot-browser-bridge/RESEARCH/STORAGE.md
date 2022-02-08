# STORAGE



## SESSION STORAGE
```js
SESSION STORAGE:
----------------



//////////////////////////////////////////
// SESSION STORAGE
//////////////////////////////////////////
const myStorage = window.sessionStorage;
// Save data to sessionStorage
sessionStorage.setItem('key', 'value');
// Get saved data from sessionStorage
let data = sessionStorage.getItem('key');
// Remove saved data from sessionStorage
sessionStorage.removeItem('key');
// Remove all saved data from sessionStorage
sessionStorage.clear();
sessionStorage.key(index) //– get the key on a given position.
sessionStorage.length //– the number of stored items.

// EXAMPLE:
// Get the text field that we're going to track
let field = document.getElementById("field");
// See if we have an autosave value
// (this will only happen if the page is accidentally refreshed)
if (sessionStorage.getItem("autosave")) {
  // Restore the contents of the text field
  field.value = sessionStorage.getItem("autosave");
}
// Listen for changes in the text field
field.addEventListener("change", function() {
  // And save the results into the session storage object
  sessionStorage.setItem("autosave", field.value);
});


session storage:
// The sessionStorage exists only within the current browser tab.
// But it is shared between same origin iframes in the same tab
// data survives page refresh, but not closing/opening the tab.

// STORAGE EVENT:
key – the key that was changed (null if .clear() is called).
oldValue – the old value (null if the key is newly added).
newValue – the new value (null if the key is removed).
url – the url of the document where the update happened.
storageArea – either localStorage or sessionStorage object where the update happened.
Please note that the event also contains: event.url – the url of the document where the data was updated.

Also, event.storageArea contains the storage object – the event is the same for both sessionStorage and localStorage, so event.storageArea references the one that was modified. We may even want to set something back in it, to “respond” to a change.

Use Object.keys to get all keys.
We access keys as object properties, in that case storage event isn’t triggered.

Storage event:

Triggers on setItem, removeItem, clear calls.
Contains all the data about the operation (key/oldValue/newValue), the document url and the storage object storageArea.
Triggers on all window objects that have access to the storage except the one that generated it (within a tab for sessionStorage, globally for localStorage).

// SESSION STORAGE is not sent to servers
// => server cant manipulate storage objects via HTTP headers
// => storage is bound to origin (domain+protocol+port)



Session Storage:
* scope is within a tab (per document)
* lasts as long as tab or browser is open => survives page reloads/restores
* new tab opens new session
* duplicating tab copies sessionstorage
* closing tab ends session storage
* storage object for current origin
* if you open two tabs in the same browser you have two independent session storage sets
  * one for each and they will dissappear and be gone once the tab is closed, meaning the browser page closes

* You can use it to save some temporary data such as:
  * items in shopping cart
  * temporary input or website breadcrumb
  * ...
  * to prevent the data from disappearing after the page disappears, such as form filling and user browser records.

* To improve performance, I had been storing the returned data in sessionStorage between page loads
  * can be used on every page after the first (in same tab)


 ```