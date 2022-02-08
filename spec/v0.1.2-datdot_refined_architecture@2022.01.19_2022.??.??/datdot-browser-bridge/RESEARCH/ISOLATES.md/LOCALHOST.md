# LOCALHOST

Localhost
IIUC there is a golden path for localhost:

Support <cid>.<ns>.localhost out of the box
(localhost as a permanent, implicit entry on Gateway.SubdomainHosts)
requests to localhost hostname (without subdomain) need to be redirected to 127.0.0.1 (same path, but on raw IP). This will ensure the Origin(s) of Path and Subdomain gateways on a local machine are separate (and users can have both!)







LOCALHOST for BROWSERS:
https://bugs.webkit.org/show_bug.cgi?id=160504
https://developer.mozilla.org/en-US/docs/Web/Security/Mixed_content#loading_locally_delivered_mixed-resources
https://bugzilla.mozilla.org/show_bug.cgi?id=1220810#c95
https://bugzilla.mozilla.org/show_bug.cgi?id=1433933#c9
https://bugzilla.mozilla.org/show_bug.cgi?id=1433933#c6
it works with default windows browsers because Edge browser is Chromium based
all Chromium based browser is working without problem.

"Access-Control-Allow-Origin": ["*"] the only way to get it working
and only chromium based browser working... safari & firefox would fail