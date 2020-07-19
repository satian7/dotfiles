'use strict';

var headerStore = {};
var headerStoreFiltered = [];
var headerStoreFiltered2 = [];
var activeTabId;
var tool1;
var doublequotes1;
var ffname = [];
var CHROME = 0;

chrome.downloads.onDeterminingFilename.addListener(function(item, suggest) {
  suggest({filename: item.filename,
           conflict_action: 'prompt',
           conflictAction: 'prompt'});
		   ffname[activeTabId] = item.filename;
	
    CHROME = 1;	
	var request;
	var index, len;
		for (index = headerStore[activeTabId].request.length -1; index >= 0 ; --index) {
			
			//if (headerStore[activeTabId].request[index].url.indexOf(item.url) > -1) {
			if (headerStore[activeTabId].request[index].url.indexOf(ffname[activeTabId]) >= -1) {	

			headerStoreFiltered[activeTabId] = headerStore[activeTabId].request[index];
			break;				
			}
		}
			for (index = headerStore[activeTabId].response.length -1; index >= 0 ; --index) {
			
			//if (headerStore[activeTabId].request[index].url.indexOf(item.url) > -1) {
			if (headerStore[activeTabId].response[index].url.indexOf(ffname[activeTabId]) >= -1) {	

			headerStoreFiltered2[activeTabId] = headerStore[activeTabId].response[index];
			break;				
			}
		}
		
		
		

    headerStore[activeTabId].request.length = 0;
	headerStore[activeTabId].response.length = 0;
		   
		   
  // conflict_action was renamed to conflictAction in
  // http://src.chromium.org/viewvc/chrome?view=rev&revision=214133
  // which was first picked up in branch 1580.
});


//chrome.downloads.onDeterminingFilename.addListener(function(item, suggest) {
chrome.downloads.onCreated.addListener(function(item) {
  //suggest({filename: item.filename,
   //        conflict_action: 'prompt',
    //       conflictAction: 'prompt'});
		   ffname[activeTabId] = "CurlWget"+item.id;
	
	if (CHROME == 0){
		

	var request;
	var index, len;
		for (index = headerStore[activeTabId].request.length -1; index >= 0 ; --index) {
			
			//if (headerStore[activeTabId].request[index].url.indexOf(item.url) > -1) {
			if (headerStore[activeTabId].request[index].url.indexOf(ffname[activeTabId]) >= -1) {	

			headerStoreFiltered[activeTabId] = headerStore[activeTabId].request[index];
			break;				
			}
		}
			for (index = headerStore[activeTabId].response.length -1; index >= 0 ; --index) {
			
			//if (headerStore[activeTabId].request[index].url.indexOf(item.url) > -1) {
			if (headerStore[activeTabId].response[index].url.indexOf(ffname[activeTabId]) >= -1) {	

			headerStoreFiltered2[activeTabId] = headerStore[activeTabId].response[index];
			break;				
			}
		}
		
		
		

    headerStore[activeTabId].request.length = 0;
	headerStore[activeTabId].response.length = 0;
	   
			}		   
		   
  // conflict_action was renamed to conflictAction in
  // http://src.chromium.org/viewvc/chrome?view=rev&revision=214133
  // which was first picked up in branch 1580.
});



/**
 * Store the response headers when a main_frame (Document) response comes in.
 */
chrome.webRequest.onHeadersReceived.addListener(
    function(info) {
        if (parseInt(info.tabId, 10) > 0) {
			activeTabId = info.tabId;
			if (CHROME){
			headerStore[info.tabId].response[0] = info;
				} else {
			headerStore[info.tabId].response.push(info);
					}
            //if (typeof(headerStore[info.tabId].response[0]) !== 'undefined') {
                    // Reset store for a different request in the same tab
					//console.log("response received");
            //}

			
			chrome.storage.sync.get('tool', function(items) {
			if (items.tool) {
				tool1 = items.tool; 
			}
			});
			chrome.storage.sync.get('quotes', function(items) {
			if (items.quotes) {
				doublequotes1 = items.quotes; 
				
			}
			});
			
        }
    },
    {
        urls: ['http://*/*', 'https://*/*'],
        types: ['main_frame','other','sub_frame']
		//types: ['main_frame','sub_frame','stylesheet','script','image','object','xmlhttprequest','other']
    },
    ['blocking','responseHeaders']
);

/*
*types: ['main_frame','sub_frame','stylesheet','script','image','object','xmlhttprequest','other']
*/


/**
 * Store the request headers when a main_frame (Document) request will be sent.
 */
chrome.webRequest.onSendHeaders.addListener(
    function(info) {
        if (parseInt(info.tabId, 10) > 0) {
                // Initialize store
			
				activeTabId = info.tabId;
            if (typeof(headerStore[info.tabId]) === 'undefined') {
			
                headerStore[info.tabId] = {};
                headerStore[info.tabId].request = [];
                headerStore[info.tabId].response = [];
            } 
            headerStore[info.tabId].request.push(info);

        }
    },
    {
        urls: ['http://*/*', 'https://*/*'],
        types: ['main_frame','other','sub_frame']
		//types: ['main_frame','sub_frame','stylesheet','script','image','object','xmlhttprequest','other']
    },
    ['requestHeaders','extraHeaders']
);


/*
*types: ['main_frame','sub_frame','stylesheet','script','image','object','xmlhttprequest','other']
*/
/**
 * Capture messages from the Content script. When the content is ready,
 * inject the CSS and pass the headers and the options to the content.
 */
chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    sendResponse({});
});

/**
 * Cleanup headerStore when tab closes
 */
chrome.tabs.onRemoved.addListener(function(tabId) {
    delete headerStore[tabId];
});

/**
 * Disable on tabs with unsupported schemas
 *
 * @param {object} tab A tab object.
 * @return {*} Not defined.
 */
var disablePopup = function(tab) {
    if (isValidUrl(tab.url) === false &&
        // Show normal icon on the installation-success page so
        // users see how it will normally look.
        !/^chrome-extension:.*pages\/install\//.test(tab.url)) {
        chrome.browserAction.disable(tab.id);
    }
};

chrome.tabs.onUpdated.addListener(function(tabid, changeInfo, tab) {
    disablePopup(tab);
});

chrome.tabs.onActivated.addListener(function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        // For example: only the background devtools or a popup are opened
        if (tabs.length === 0) {
            return;
        }
        disablePopup(tabs[0]);
		    
    });
});

chrome.downloads.onCreated.addListener(function(item) {

	
});


function doInCurrentTab(tabCallback) {
    chrome.tabs.query(
        { currentWindow: true, active: true },
        function (tabArray) { tabCallback(tabArray[0]); }
    );
}
/**
 * Setup defaults
 * @return {*} Not defined.
 */
 
