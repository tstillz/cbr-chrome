# Chrome Extension for Carbon Black Response
 A simple, extensible plugin to quickly query CBR for a hostname/IPv4 (supports partial hostname/ip values) and binary store lookups including md5, filename and binary internal name.

#### Details
Additional information or usage on this chrome plugin can be found here: https://blog.stillztech.com/2018/09/carbon-black-response-cbr-chrome.html

#### Wish list
Things for the future: 

> Acquire File(s)
> Quickly Run CBLR Commands on endpoints
> Reporting/Metrics
> Scheduling a hunt

#### Installation

- Either clone this repository or download as a ZIP file.
- Extract the contents into your preferred working directory.
- Open your Google Chrome browser.
- Enter `chrome://extensions` into the address bar.
- Ensure "Developer Mode" is ticked/enabled in the top right.
- Update the `config.json` with your CBR URL and API token. 
- Click on "Load unpacked extension...".
- Navigate to your extracted directory, and click "OK".
- CBR icon should now be alongside your address bar (top right corner).
