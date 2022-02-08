# GOALS

## Recover from dead Subdomain Gateways
https://github.com/ipfs/ipfs-companion/issues/800

## Browser KIOSK Mode
https://textslashplain.com/2022/01/06/lock-down-web-browsing-using-kiosk-mode/


## NATIVE OS INTEGRATION
https://github.com/ipfs/ipfs-desktop/issues/679



## WEB_UI.html
Actually we can't. Many IPFS Desktop settings depend on the Web UI settings page.
So, if the Web UI is only available when the daemon is on,
then we can't access the settings.
Unless we move Desktop specific options to the menubar itself as we're planning initially.
It's basically a bunch of checkboxes.
* we will switch to loading webui from http://127.0.0.:5001/webui/ (API port)
* opt-in for loading latest webui from webui.ipfs.io.ipns.localhost:8080 is tracked
  * https://github.com/ipfs/ipfs-companion/issues/860


opening it in regular browser, or at least opening version from the API port. As mentioned above, desktop-specific preferences could be reimplemented as "Settings" submenu, decoupling Desktop from specific versions of WebUI

// https://github.com/ipfs/ipfs-companion/blob/v2.11.0/add-on/src/lib/precache.js

opening webui from http://127.0.0.1:8080/webui instead of webui://- pseudoprotocol
ensure offline use case works: if we stop bundling webui with ipfs-desktop and open webui in a web browser, then we need to ensure the proper CID is already in the repo
we have prior art of doing just that in Brave: ipfs-companion is bundling TAR archive for webui CID and during the startup in Brave checks if it is present in the repo, in not, it imports data from the TAR. Code in precache.js . This ensures webui is always present, and fast, even if initial load happened in "airplane mode".
opening in real web browser instead of Electron

---
Every IPFS Node provides :5001/webui endpoint on the API port. It redirects to the latest 'blessed' CID
that can be loaded from :5001/ipfs/{cid}. For security reasons only hardcoded CIDs can be loaded from API port.

Right now IPFS Companion ships with hardcoded version of Web UI, and that version can be bigger than the one at :5001/webui.



**question**
Is there any reason for the Electron standalone app to exist other than the fact that it comes as part of a convenient package that also installs the daemon and CLI tools?

**answer**
1. provide mechanism for updating desktop users to the latest go-ipfs
2. provide GUI for starting/stopping IPFS node and opening specific webui screens
3. we also hope to provide OS-specific integrations in the future

=> Right. All of which could stand on their own and send the user to webUI as needed


I made some sketches to IPFS Desktop. As you can see - I cut main menu to two options:
Files and Node informations (settings and power are on the bottom).
I also change positions and now files are the first thing that user can see after opening IPFS Desktop.
I try to expose the most important informations and actions to make user experience as smooth as possible :)
and also add some nice graphics to all



Feel free to comment on Zeplin and let me know what do You think about it :D

is this level opf decoupling enough, or do we want ditch Electron's BrowserWindow
and start opening webui in real web browser instead of Electron window?

I thought the main challenge with opening webui in regular browser is Origin isolation




If we use WebUI version bundled with go-ipfs (:5001/webui)
green_heart This removes the need for testing webui in Desktop, as this version is already tested before go-ipfs release
green_heart does not require localhost subdomain for security isolation
it will work on every platform without the need for installing IPFS Companion or manually setting HTTP proxy
broken_heart the URL in address bar will be fugly
broken_heart we are unable to ship new webui without waiting for new go-ipfs
If we use different version..
green_heart This gives us the same control over webui version as we have right now
broken_heart requires localhost subdomain for security isolation
stop_sign subdomains on localhost are not supported on some platforms and require IPFS Companion or manually setting HTTP proxy (localhost subdomains do not work on Firefox and Safari go-ipfs#7527). we expect this to get better (there are ongoing issues/discussions for better localhost support in Firefox and Safari), but ETA is unknown.
wrench Desktop needs to safelist specific origin by setting proper CORS headers in go-ipfs' config
wrench Desktop needs a way of passing API port address to WebUI via #hash (API port could be different than :5001)
..specified by CID (<cid>.ipfs.localhost:8080)
broken_heart the URL in address bar will be fugly
green_heart works in offline environment, no dependency on DNS
..specified by DNSLink (webui.ipfs.io.ipns.localhost:8080)
green_heart the URL in address bar looks okay-ish (starts with webui.ipfs..)
stop_sign breaks in offline environment or when ipfs.io is censored at DNS level


  Opening in regular browser will break for some users if we do it by default, unless we stick with version behind /webui on API port, which in turn forbids us from shipping new webui independently of go-ipfs, slowing down our release cycle.

What we could do is to introduce opt-in experiment that "opens the latest webui (DNSLink) in default browser".



// https://github.com/ipfs/ipfs-desktop/issues/1389#issuecomment-702989303

> My general sentiment is electron window wrapper just hides ugly url, and I would much rather try to address that core problem instead of hiding it with dedicated window.
>
> Here is where I wish and hope we can end up one day:
>
> * webui.ipfs.io (or some other address) is a canonical place to access your IPFS node.
> * webui.ipfs.io uses service worker so that it continues to work after first load even if
>
>   * Domain got blocked.
>   * Even if user is offline.
> * webui.ipfs.io detects if ipfs-desktop isn't running (by pinging localhost) and offers you to install it to enhance experience.
>
>   * It communicates really clearly what the benefits are for user personally and network overall
> * webui.ipfs.io isn't special, you can deploy same page on other domain and it will function just the same.
>
>   * In fact it is deployed across all IPFS nodes that have domain name
>   * Local IPFS node can discover more deployments from peers it connects to.
> * webui.ipfs.io (and other deployments) can overcome CORS restrictions imposed by HTTP API by requesting a permission via HTTP request. IPFS desktop grants or denies permission by consulting user via system prompt.
> * Other deployments of webui.ipfs.io could ask ipfs-desktop to be a default UI so that:
>
>   * I could make `webui.gozala.io` be my default instead.
>   * I could switch to beta or nightly channels of webui's or even stick to some pinned CID version.
> * IPFS Desktop can pass communication address to `webui.*` (via #hash link or such) so that non-standard port or hosts would work as well.
>
>   * IPFS Desktop can detect when opening a webui has failed (because no callback has occured) and provides troubleshooting system UI.
>
>     * If for whatever reason `webui.alt.io` is no longer accessible troubleshooting UI can offer to try different alternatives (form the list e.g. https://webui.ipfs.io, https://webui.pinata.cloud/, [https://webui.ipfs.io.ipns.localhost:8080`](https://webui.ipfs.io.ipns.localhost:8080%60) etc) and helps user report the problem in some ways. (in fact troubleshooting could probably be automated by loading diff options in hidden browser window etc...)
>
> That way we can have deliver experience that is:
>
> 1. Most familiar from the conventional web. Almost like dropbox.
> 2. In browsers that don't support IPFS natively experience is enhanced via IPFS Desktop (e.g. in brave we may not even offer installing IPFS desktop, and on mobile we may look for some alternative way e.g. delagate to desktop ??)
> 3. It is resilient to censorship because there can be many deployments that troubleshooting process can help you discover.
> 4. It works offline because service workers rock!
> 5. If all fails we do still have a localhost based fallback assuming IPFS desktop is there.
> 6. We and the wider community are enabled to experiment with alternative UIs and empower user with choice.



