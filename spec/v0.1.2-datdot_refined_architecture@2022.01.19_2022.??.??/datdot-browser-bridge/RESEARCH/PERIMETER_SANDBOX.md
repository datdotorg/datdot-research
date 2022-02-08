# PERIMETER (for access)


------------------
ACCESS PERIMETER:
------------------
window.location.origin for a regular page
window.location.origin + /datdot/$cid if a page was loaded from datdot path (gateway)

URLs:
  ipfs://{cidv1b32} → http://127.0.0.1:8080/ipfs/{cidv1b32}
  ipns://{hash} → http://127.0.0.1:8080/ipns/{hash}

URI:
  dweb:/ip[f|n]s/{hash} → http://127.0.0.1:8080/ip[f|n]s/{hash}

ipfs://ANYHASH point to http://127.0.0.1:PORT/ipfs/ANYHASH

ISSUE: comment: https://github.com/ipfs/ipfs-companion/issues/164#issuecomment-764167668





# SANDBOX

```js
SANDBOX
-------



////////////////////////////////////////////////////////////
Given an iframe with an empty sandbox attribute (<iframe sandbox src="..."> </iframe>), the framed document will be fully sandboxed, subjecting it to the following restrictions:

JavaScript will not execute in the framed document. This not only includes JavaScript explicitly loaded via script tags, but also inline event handlers and javascript: URLs. This also means that content contained in noscript tags will be displayed, exactly as though the user had disabled script herself.
The framed document is loaded into a unique origin, which means that all same-origin checks will fail; unique origins match no other origins ever, not even themselves. Among other impacts, this means that the document has no access to data stored in any origin’s cookies or any other storage mechanisms (DOM storage, Indexed DB, etc.).
The framed document cannot create new windows or dialogs (via window.open or target="_blank", for instance).
Forms cannot be submitted.
Plugins will not load.
The framed document can only navigate itself, not its top-level parent. Setting window.top.location will throw an exception, and clicking on link with target="_top" will have no effect.
Features that trigger automatically (autofocused form elements, autoplaying videos, etc.) are blocked.
Pointer lock cannot be obtained.
The seamless attribute is ignored on iframes the framed document contains.

=> // With the exception of plugins, each of these restrictions can be lifted by adding a flag to the sandbox attribute’s value


allow-forms allows form submission.
allow-popups allows popups (window.open(), showModalDialog(), target=”_blank”, etc.).
allow-pointer-lock allows (surprise!) pointer lock.
allow-same-origin allows the document to maintain its origin; pages loaded from https://example.com/ will retain access to that origin’s data.
allow-scripts allows JavaScript execution, and also allows features to trigger automatically (as they’d be trivial to implement via JavaScript).
allow-top-navigation allows the document to break out of the frame by navigating the top-level window.

// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/sandbox

// detect if iframe is sandboxed:
// https://stackoverflow.com/questions/29435076/detect-if-javascript-is-executing-in-a-sandboxed-iframe

// --------------
<!-- frame.html -->
// <!DOCTYPE html>
// <html>
//  <head>
//    <title>Evalbox's Frame</title>
//    <script>
//      window.addEventListener('message', function (e) {
//        var mainWindow = e.source;
//        var result = '';
//        try {
//          result = eval(e.data);
//        } catch (e) {
//          result = 'eval() threw an exception.';
//        }
//        mainWindow.postMessage(result, event.origin);
//      });
//    </script>
//  </head>
// </html>
// -------------
// <textarea id='code'></textarea>
// <button id='safe'>eval() in a sandboxed frame.</button>
// <iframe sandbox='allow-scripts'
//         id='sandboxed'
//         src='frame.html'></iframe>
// --------------
// window.addEventListener('message',
//     function (e) {
//       // Sandboxed iframes which lack the 'allow-same-origin'
//       // header have "null" rather than a valid origin. This means you still
//       // have to be careful about accepting data via the messaging API you
//       // create. Check that source, and validate those inputs!
//       var frame = document.getElementById('sandboxed');
//       if (e.origin === "null" && e.source === frame.contentWindow)
//         alert('Result: ' + e.data);
//     });
// -----------------
// function evaluate() {
//   var frame = document.getElementById('sandboxed');
//   var code = document.getElementById('code').value;
//   // Note that we're sending the message to "*", rather than some specific
//   // origin. Sandboxed iframes which lack the 'allow-same-origin' header
//   // don't have an origin which you can target: you'll have to send to any
//   // origin, which might alow some esoteric attacks. Validate your output!
//   frame.contentWindow.postMessage(code, '*');
// }
// document.getElementById('safe').addEventListener('click', evaluate);
// --------------
// : srcdoc, and seamless. The former allows you to populate a frame with content without the overhead of an HTTP request, and the latter allows style to flow into the framed content. Both have fairly miserable browser support at the moment (Chrome and WebKit nightlies). but will be an interesting combination in the future. You could, for example, sandbox comments on an article via the following code:

// <iframe sandbox seamless
//         srcdoc="<p>This is a user's comment!
//                    It can't execute script!
//                    Hooray for safety!</p>"></iframe>

IMPORTANT:
// execute yourself inside a sandboxed iframe to prevent PLUGINS from having access!
// => allow popups to escape sandbox to communicate to a frame where metamask can exist!

////////////////////////////////////////////////////////////


```
