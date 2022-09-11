# datdot-shim
cross-platform electron menubar app or similar to enable all features needed by datdot


@TODO:
* [ ] describe shim spec



# SHIMMING
1. have generic bare minimum white labeled cross-platform installer
2. customize it with app logo/title and hyperdrive address
3. after installation run environment detection (see DETECT.md)
4. download and install all missing SHIMS from hyperdrive(s)
5. launch app


## GOAL: enable NATIVE OS INTEGRATION
https://github.com/ipfs/ipfs-desktop/issues/679

# `playproject-io/datdot-electron`

### 2. ELECTRON - `playproject-io/datdot-electron`
**electron-app** (=> easy download & install) (best practices: BEAKER)
  * talks to localhost http server
  * loads `ui.html` to act responsively as a "tray icon app"
* **configuration-defaults**
  * `auto-hosting`
    * takes `x%` of available free disk space
    * allows `opt-out`
    * allows `reduce disk space` offered
* **API** COMMUNICATION (=IPC)
  * **FUNCTIONS**
    * ...
  * **EVENTS**
    * ...



# datdot-mobile

https://github.com/JaneaSystems/nodejs-mobile-react-native
https://code.janeasystems.com/nodejs-mobile
https://github.com/RangerMauve/datmobile



--------------------------------------------------
--------------------------------------------------

Desktop Setting depend on Web UI

Desktop App needs Settings
Daemon is optional
Web UI needs daemon to work
=> desktop app needs to ALWAYS run the daemon!

but what about headless?

move Desktop specific settings into context menu checkboxes

possible SHIMS variants:
* electron desktop app
  * installs daemon
  * installs cli tools
  * update mechanism to latest software version
  * UI for start/stop node + open speciic webui screens
  * provide OS specific integrations in the future
  * => maybe all extensions user could "ADD" to their system via webui if needed
* nodejs node
* browser extension

Unless we move Desktop specific options (bunch of checkboxes) to the launcher icon submenu itself
1. we will switch to loading/opening webui from http://127.0.0.:5001/webui/ (API port)
  * instead of webui://- pseudoprotocol
  * fixed version, e.g. https://github.com/ipfs/ipfs-companion/blob/v2.11.0/add-on/src/lib/precache.js#L15
    * to ensure the proper latest "blessed" CID is already in the repo
  * webUI installs SW and redirects to content of CID
2. opt-in for loading latest webui from webui.ipfs.io.ipns.localhost:8080 is tracked
  * https://github.com/ipfs/ipfs-companion/issues/860
3. data can be loaded from e.g. http://127.0.0.:5001/ipfs/{cid}
  * For security reasons only hardcoded CIDs can be loaded from API port

SHIM has core code
+ specified downloadable dependencies
+ optional hot cache that can be shipped with the SHIM
  * e.g. a TAR archive (where content matches the specified dependencies)
=> so localhost can already SERVE code (even if it is not the latest)



----------------------------



if UI (:5001/webui) is bundled with "go-ipfs":
* no localhost subdomain for security isolation
* works on all platforms without browser extension or manual HTTP proxy settings
* url in browser is ugly
* localhost subdomain for security isolation
  * localhost subdomains arent supported on all platforms + require browser extension sometimes
  * requiers setting HTTP proxy (see: Firefox and Safari go-ipfs#7527)
* desktop needs safelist specific origin to set proper CORS headers
* desktop needs to pass API port address to webui (e.g. via #hash) if different from e.g. 5001 standard
* `<cid>.ipfs.localhost:8080`
* address bar url is ugly
* is offline first
* no DNS dependency
  * e.g. webui.ipfs.io.ipns.localhost:8080
* breaks when ipfs.io is censored at DNS level

@THOUGHT
* => ship web ui version on API port in cache with SHIM

