KERNEL + SYSTEM STANDARDS:
--------------------------


REQUIREMENTS SYSTEM:
1. local domain for page
  * apps are hosted by AUTHOR on SOME DOMAIN (e.g. https://datdot.org)
2. local script to initialize service worker
3. remote domain for kernel page and script
4. local domain is not visual until served by service worker
  * first load imports WEBKERNEL, which installs SERVICE WORKER (to load app and make it available on/off line)
5. maybe extend only to give static html for social media link previews

CONSEQUENCES:
1. payload can be super minimal, because not even charset of doctype is required until service worker serves
2. remote script can also add sandboxed iframe, so no need to do it manually

RESULT:
[ALL PAGES - GENERIC STANDARD PAYLOAD] e.g. [https://datdot.org]
<script src="local-script.js"></script>



REQUIREMENTS IFRAME:
1. load static generic kernel page
  * ... generate bootstrap document + service worker  from SUB DOMAIN e.g. https://cid.lunet.link/ or rather "https://webkernel.com/#system_address"
  * includes corresponding "hyper address" + service worker script
2. MAKE "webkernel.com" a COMMODITY
  * => so ppl do not have to trust it. they can fork and deploy it anywhere (e.g. as github page repo)


CONSEQUENCES:
1. [https://webkernel.com/#system_address] serves generic document:
 * e.g. https://webkernel.com/#system_hyper_address
 * e.g. https://webkernel.com/#system_url
2. registers iframe SERVICE WORKER to route requests to "iframe client document"

 SW: onfetch = event => { event.request === https://lunet.link/peerdium.gozala.io/doc }
  => 1. lookup hyper address of peerdium.gozala.io
  => 2. navigate to: https://webkernel.com/$hyper_address/doc
  ==> loads:
	<html>
      <body>
        <iframe sandbox src="://${$hyper_address}.webkernel.com/doc">
      </body>
    </html>

3. which routes them back to PARENT DOC, e.g. "https://lunet.link/peerdium.gozala.io/doc"
4. which takes care of fetching "cid1" from IPFS to serve it



APP_A => KERNEL_B .... if kernel was never installed and server is only generic web server, it cant redirect to root to install service worker
==> so it needs to always load kernel directly and a param for kernel to load a subpage after reload or directly if already installed



 1. e.g. https://webkernel.com/datdot.org/doc
  => it redirects to: https://webkernel.com/?redirect=datdot.org/doc
  => to install SW and redirect back to
  => https://lunet.link/peerdium.gozala.io/doc causing a SW to serve it.
  NOTE: Redirect only happens if https://webkernel.com/* never loaded in the past, otherwise SW just serves



PETNAMES
1. CID is just enough, better yet on first load we could allow user to choose to "install" it in local namespace meaning map it to say https://lunet.link/peerdium/
2. or at least once a wallet is in play to select it to open/launch
  * where to display the selected app name anyway?
  * maybe a popup to choose a petname?
3. App could provide name suggestions, lunet could pick on that isn't taken and allow user to use that or override in place.


LATER for "home.localhost"
LATER for "wallet.localhost"
LATER for "vault.localhost"
LATER for "system.localhost"

4. Unlike current setup which requires app / site to cooperate (by serving bootstrap code which embeds lunet client from that domain)
   => it always docs from own subdomain which will then serve corresponding app / site. In other words no cooperation is required.

   @THOUGHT:  ...once service worker is installed for datdot.org, can any subdomain or path be intercepted to serve something custom???

5. In a way we are removing dependency on DNS, well not really because we made it far more loosely coupled because
6. => User can just use HYPER-ADDRESS (on e.g. "datdot.localhost"
7. => User can map to whatever name desired. (PETNAME)
8. => We put browser in your browser! However maybe in a future we could remove top browser layer.



[GENERIC SERVICE WORKER PAYLOAD]

<!doctype html>
<html>
  <meta charset="utf-8"></meta>
  <body>
    <script src=
    <iframe sandbox src="://webkernel.com/#system_address">
      // system_address: e.g. hyper://23jf2904jg9wjg4w23jf2904jg9wjg4w23jf2904jg9wjg4w
      // document.referrer === 'https://datdot.org'
  </body>
</html>
