'use strict';

var obiecte = [];
var o;
var statusResponse;
var chromeM = chrome.extension.getBackgroundPage();
var CWversion = chrome.app.getDetails().version;
var chromeVersion = /Chrome\/([0-9.]+)/.exec(navigator.userAgent)[1];

/**
 * Return HTTP status style
 *
 * @param {string} status The Status line.
 * @return {string} style  The classname.
 */
function getStatusStyle(status) {
    var style = '';
    if (status.match(/(200|201|202|203|204|205|206|207)/g) !== null) {
        style = 'status2xx';
    }
    if (status.match(/(300|301|302|303|304|305|306|307)/g) !== null) {
        style = 'status3xx';
    }
    if (status.match(/(400|401|402|403|404|405|406|407|408|409|410|411|412|413|414|415|416|417)/g) !== null) {
        style = 'status4xx';
    }
    if (status.match(/(500|501|502|503|504|505)/g) !== null) {
        style = 'status5xx';
    }
    return style;
}

/**
 * Sort function to sort objectArray by name and value.
 *
 * @param {object} a  Object a.
 * @param {object} b  Object b.
 * @return {*}  Not defined.
 */
function sortObjectArrayByName(a, b) {
  if (a.name < b.name) {
      return -1;
  }
  if (a.name > b.name) {
      return 1;
  }
  if (a.value < b.value) {
      return -1;
  }
  if (a.value > b.value) {
      return 1;
  }
  return 0;
}

/**
 * Select the text inside an element
 *
 * @param {object} event The click event.
 * @return {*}  Not defined.
 */
function selectElementText(event) {
	var selection=window.getSelection()
	var selectionRange = document.createRange();
	selectionRange.selectNodeContents(event.srcElement);
	selection.removeAllRanges();
	selection.addRange(selectionRange)
}


function htmlEntities (string, quote_style, charset, double_encode) {
    //  discuss at: http://phpjs.org/functions/htmlentities/
    // original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    //  revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    //  revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // improved by: nobbler
    // improved by: Jack
    // improved by: Rafał Kukawski (http://blog.kukawski.pl)
    // improved by: Dj (http://phpjs.org/functions/htmlentities:425#comment_134018)
    // bugfixed by: Onno Marsman
    // bugfixed by: Brett Zamir (http://brett-zamir.me)
    //    input by: Ratheous
    //  depends on: get_html_translation_table
    //        note: function is compatible with PHP 5.2 and older
    //   example 1: htmlentities('Kevin & van Zonneveld');
    //   returns 1: 'Kevin &amp; van Zonneveld'
    //   example 2: htmlentities("foo'bar","ENT_QUOTES");
    //   returns 2: 'foo&#039;bar'

    var hash_map = get_html_translation_table('HTML_ENTITIES', quote_style),
        symbol = '';

    string = string == null ? '' : string + '';

    if (!hash_map) {
        return false;
    }

    if (quote_style && quote_style === 'ENT_QUOTES') {
        hash_map["'"] = '&#039;';
    }

    double_encode = double_encode == null || !!double_encode;

    var regex = new RegExp("&(?:#\\d+|#x[\\da-f]+|[a-zA-Z][\\da-z]*);|[" +
        Object.keys(hash_map)
            .join("")
            // replace regexp special chars
            .replace(/([()[\]{}\-.*+?^$|\/\\])/g, "\\$1") + "]",
        "g");

    return string.replace(regex, function (ent) {
        if (ent.length > 1) {
            return double_encode ? hash_map["&"] + ent.substr(1) : ent;
        }

        return hash_map[ent];
    });
}

/**
 * Get HTML translation table
 * @param {string} table
 * @return {string} quote_style
 */
function get_html_translation_table (table, quote_style) {
    //  discuss at: http://phpjs.org/functions/get_html_translation_table/
    // original by: Philip Peterson
    //  revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // bugfixed by: noname
    // bugfixed by: Alex
    // bugfixed by: Marco
    // bugfixed by: madipta
    // bugfixed by: Brett Zamir (http://brett-zamir.me)
    // bugfixed by: T.Wild
    // improved by: KELAN
    // improved by: Brett Zamir (http://brett-zamir.me)
    //    input by: Frank Forte
    //    input by: Ratheous
    //        note: It has been decided that we're not going to add global
    //        note: dependencies to php.js, meaning the constants are not
    //        note: real constants, but strings instead. Integers are also supported if someone
    //        note: chooses to create the constants themselves.
    //   example 1: get_html_translation_table('HTML_SPECIALCHARS');
    //   returns 1: {'"': '&quot;', '&': '&amp;', '<': '&lt;', '>': '&gt;'}

    var entities = {},
        hash_map = {},
        decimal;
    var constMappingTable = {},
        constMappingQuoteStyle = {};
    var useTable = {},
        useQuoteStyle = {};

    // Translate arguments
    constMappingTable[0] = 'HTML_SPECIALCHARS';
    constMappingTable[1] = 'HTML_ENTITIES';
    constMappingQuoteStyle[0] = 'ENT_NOQUOTES';
    constMappingQuoteStyle[2] = 'ENT_COMPAT';
    constMappingQuoteStyle[3] = 'ENT_QUOTES';

    useTable = !isNaN(table) ? constMappingTable[table] : table ? table.toUpperCase() : 'HTML_SPECIALCHARS';
    useQuoteStyle = !isNaN(quote_style) ? constMappingQuoteStyle[quote_style] : quote_style ? quote_style.toUpperCase() :
        'ENT_COMPAT';

    if (useTable !== 'HTML_SPECIALCHARS' && useTable !== 'HTML_ENTITIES') {
        throw new Error('Table: ' + useTable + ' not supported');
        // return false;
    }

    entities['38'] = '&amp;';
    if (useTable === 'HTML_ENTITIES') {
        entities['39'] = '&apos;';
        entities['160'] = '&nbsp;';
        entities['161'] = '&iexcl;';
        entities['162'] = '&cent;';
        entities['163'] = '&pound;';
        entities['164'] = '&curren;';
        entities['165'] = '&yen;';
        entities['166'] = '&brvbar;';
        entities['167'] = '&sect;';
        entities['168'] = '&uml;';
        entities['169'] = '&copy;';
        entities['170'] = '&ordf;';
        entities['171'] = '&laquo;';
        entities['172'] = '&not;';
        entities['173'] = '&shy;';
        entities['174'] = '&reg;';
        entities['175'] = '&macr;';
        entities['176'] = '&deg;';
        entities['177'] = '&plusmn;';
        entities['178'] = '&sup2;';
        entities['179'] = '&sup3;';
        entities['180'] = '&acute;';
        entities['181'] = '&micro;';
        entities['182'] = '&para;';
        entities['183'] = '&middot;';
        entities['184'] = '&cedil;';
        entities['185'] = '&sup1;';
        entities['186'] = '&ordm;';
        entities['187'] = '&raquo;';
        entities['188'] = '&frac14;';
        entities['189'] = '&frac12;';
        entities['190'] = '&frac34;';
        entities['191'] = '&iquest;';
        entities['192'] = '&Agrave;';
        entities['193'] = '&Aacute;';
        entities['194'] = '&Acirc;';
        entities['195'] = '&Atilde;';
        entities['196'] = '&Auml;';
        entities['197'] = '&Aring;';
        entities['198'] = '&AElig;';
        entities['199'] = '&Ccedil;';
        entities['200'] = '&Egrave;';
        entities['201'] = '&Eacute;';
        entities['202'] = '&Ecirc;';
        entities['203'] = '&Euml;';
        entities['204'] = '&Igrave;';
        entities['205'] = '&Iacute;';
        entities['206'] = '&Icirc;';
        entities['207'] = '&Iuml;';
        entities['208'] = '&ETH;';
        entities['209'] = '&Ntilde;';
        entities['210'] = '&Ograve;';
        entities['211'] = '&Oacute;';
        entities['212'] = '&Ocirc;';
        entities['213'] = '&Otilde;';
        entities['214'] = '&Ouml;';
        entities['215'] = '&times;';
        entities['216'] = '&Oslash;';
        entities['217'] = '&Ugrave;';
        entities['218'] = '&Uacute;';
        entities['219'] = '&Ucirc;';
        entities['220'] = '&Uuml;';
        entities['221'] = '&Yacute;';
        entities['222'] = '&THORN;';
        entities['223'] = '&szlig;';
        entities['224'] = '&agrave;';
        entities['225'] = '&aacute;';
        entities['226'] = '&acirc;';
        entities['227'] = '&atilde;';
        entities['228'] = '&auml;';
        entities['229'] = '&aring;';
        entities['230'] = '&aelig;';
        entities['231'] = '&ccedil;';
        entities['232'] = '&egrave;';
        entities['233'] = '&eacute;';
        entities['234'] = '&ecirc;';
        entities['235'] = '&euml;';
        entities['236'] = '&igrave;';
        entities['237'] = '&iacute;';
        entities['238'] = '&icirc;';
        entities['239'] = '&iuml;';
        entities['240'] = '&eth;';
        entities['241'] = '&ntilde;';
        entities['242'] = '&ograve;';
        entities['243'] = '&oacute;';
        entities['244'] = '&ocirc;';
        entities['245'] = '&otilde;';
        entities['246'] = '&ouml;';
        entities['247'] = '&divide;';
        entities['248'] = '&oslash;';
        entities['249'] = '&ugrave;';
        entities['250'] = '&uacute;';
        entities['251'] = '&ucirc;';
        entities['252'] = '&uuml;';
        entities['253'] = '&yacute;';
        entities['254'] = '&thorn;';
        entities['255'] = '&yuml;';
    }

    if (useQuoteStyle !== 'ENT_NOQUOTES') {
        entities['34'] = '&quot;';
        entities['39'] = '&apos;';
    }
    if (useQuoteStyle === 'ENT_QUOTES') {
        entities['39'] = '&apos;';
        entities['34'] = '&quot;';
    }
    entities['60'] = '&lt;';
    entities['62'] = '&gt;';

    // ascii decimals to real symbols
    for (decimal in entities) {
        if (entities.hasOwnProperty(decimal)) {
            hash_map[String.fromCharCode(decimal)] = entities[decimal];
        }
    }

    return hash_map;
}
String.prototype.replaceAll = function(str1, str2, ignore) 
{
    return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2);
} 


function findElement(arr, propName, propValue) {

  for (var i=0; i < arr.length; i++)
    if (arr[i][propName].toLowerCase() == propValue.toLowerCase()){

	  return arr[i];
	}

  // will return undefined if not found; you could return a default instead
}

function createCliCommand(arr,clitype){

var linie2;
var res;
var host;
var NN;
var VV;					
var fisier;
var temp1;
var temp2;
var path1;
var fstart;
var fend;	

var bkg = chrome.extension.getBackgroundPage();

o = findElement(arr,"name","URL");

fisier=o.value;
res=fisier.split("/");

host = htmlEntities(res[2]);

linie2="curl --header 'Host: "+htmlEntities(host)+"'";
o = findElement(arr,"name","User-Agent");

linie2+=" --header '"+o.name+": "+htmlEntities(o.value)+"'";
o = findElement(arr,"name","Accept");

if (o !== undefined){
		linie2+=" --header '"+o.name+": "+htmlEntities(o.value)+"'";
						}

o = findElement(arr,"name","Accept-Language");

if (o != undefined){
linie2+=" --header '"+o.name+": "+htmlEntities(o.value)+"'";
						}

o = findElement(arr,"name","Referer");

if (o != undefined){
linie2+=" --header '"+o.name+": "+htmlEntities(o.value)+"'";
						}

						
o = findElement(arr,"name","Cookie");
if (o != undefined){
linie2+=" --header '"+o.name+": "+htmlEntities(o.value)+"' --header 'Connection: keep-alive' ";
					}
					
				
o = findElement(arr,"name","content-disposition");					
if (o !== undefined){

		var re = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/i;
		var m;
		var path3=o.value.replace(/&(lt|gt|quot|apos);/g, function(m, t) {
			  switch (t) {
			  case 'lt':
				return '<';
			  case 'gt':
				return '>';
			  case 'quot':
				return '"';
			  case 'apos':
				return '\'\'';
			  }
			});
				if ((m = re.exec(path3)) !== null) {
					if (m.index === re.lastIndex) {
						re.lastIndex++;
					}}
			var path2=m[1];
			//bkg.console.log(path2);
					}
					
o = findElement(arr,"name","URL");

if (o !== undefined){
//path1=filenameD(o.value,clitype);  //TODO: check for content-disposition also
if (path2 == null){
var str=o.value;
var re=/[A-z,0-9,_,-,\.]*\.\w*[^\W\=]/;
var path0=o.value.substring(o.value.lastIndexOf('/')+1);
path1=path0.match(re);


if (path1 == null){
	path1=filenameD(o.value,clitype);
}
				   } else { path1=path2;}
				} 
path1 = findElement(arr,"name","filename").value;

path1="'"+path1.replaceAll("'","'\\''")+"'";
				
linie2+=" '"+htmlEntities(o.value)+"' -L -o ";

	if (clitype === "WGET") {
		temp1=linie2.replaceAll("--header ", "--header=");
		temp2=temp1.replaceAll(" -o "," -O ");
		temp1=temp2.replaceAll("curl --","wget --");
		clitype=temp1.replaceAll(" -L "," -c ");
		if (chrome.extension.getBackgroundPage().doublequotes1 == false){
			return clitype+path1;
		} else {
		clitype=clitype.replace(/'/g, '"');
		return clitype+path1;
		}
	} else { //CURL
		clitype=linie2;
		if (chrome.extension.getBackgroundPage().doublequotes1 == false){
			return clitype+path1;
		} else {
		clitype=clitype.replace(/'/g, '"');
		return clitype+path1;
		}
	}
	
}


function randomIntFromInterval(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}
/*
* "content-disposition"
*"attachment;filename=&quot;Cig_Blue_Installation.pdf&quot;;filename*=UTF-8''Cig_Blue_Installation.pdf"
*/
function filenameD(str,tip) {
 
 var bkg = chrome.extension.getBackgroundPage();

 
	var deffilename=tip+'_download'+randomIntFromInterval(1,999999);
   var fstart=str.search(/&file.*=/i);
   if (fstart < 5){ return deffilename }
    var fstarte = str.indexOf('=',fstart+1);
   var fend=str.indexOf('&',fstarte+1) > 0 ? str.indexOf('&',fstarte+1): str.length ;
    var res = str.substring(fstarte+1,fend);
 
	if (res.length > 0){
	return res;
	} else { 
	return deffilename;
	}
	
}

/**
 * Update the current tab and refresh popup after 1s
 *
 * @param {object} e  The click event.
 * @return {*}  Not defined.
 */
var updateTab = function(e) {
    chrome.tabs.update(
        {url: e.srcElement.href}
    );
    window.setTimeout(function() {
        window.location.href = '/Resources/HTML/Popup.html';
    }, 1000);
};

document.addEventListener('DOMContentLoaded', function() {
var bkg = chrome.extension.getBackgroundPage(); //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX	
    document.getElementById('extensionName').innerText =
        chrome.i18n.getMessage('extensionName')+" ("+CWversion+")    Chrome:"+chromeVersion;

    document.getElementById('result').innerText =
        chrome.i18n.getMessage('DefaultMessage');

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        // For example: only the background devtools or a popup are opened
        if (tabs.length === 0) {
            return;
        }
	//bkg.console.log(tabs);
        if (isValidUrl(tabs[0].url)) {

           var store, store2;
		   var filename;
		   if (chrome.extension.getBackgroundPage().headerStoreFiltered[tabs[0].id] !== undefined) {
			  //bkg.console.log("direct tab");
             store = chrome.extension.getBackgroundPage().headerStoreFiltered[tabs[0].id];
			 store2 = chrome.extension.getBackgroundPage().headerStoreFiltered2[tabs[0].id];
			 filename = chrome.extension.getBackgroundPage().ffname[tabs[0].id];
		   } else {
			    var ij = 0;
			    //bkg.console.log("else tab");
			    while ( ij <= chrome.extension.getBackgroundPage().headerStoreFiltered.length) {
					if (chrome.extension.getBackgroundPage().headerStoreFiltered[ij] !== undefined){
				      
					  store = chrome.extension.getBackgroundPage().headerStoreFiltered[ij]; 
					  store2 = chrome.extension.getBackgroundPage().headerStoreFiltered2[ij]; 
					  filename = chrome.extension.getBackgroundPage().ffname[ij];
					  }
				ij++;
			} 
			   
		   }

                var content = '',
                    hideRequestHeaders = [],
                    hideResponseHeaders = [],
                    name = '',
                    value = '';
				//bkg.console.log(store2.responseHeaders);
	//var prop = 'requestHeaders';
	//if(prop in store)
	if (store !== undefined && store !== null)
                if (store.requestHeaders.length) {  
								
							for (var j = 0, length = store.requestHeaders.length;
                             j < length;
                             ++j) {
                            name = store.requestHeaders[j].name;
                            value = store.requestHeaders[j].value;
						
									o = new Object();
									o.name=name;
									o.value=value;
									
									obiecte.push(o);
									//}
									
                            //}
                        } //status response---------------------------------
						//URL section
						            name = "URL";
									value = store.url;
									o = new Object();
									o.name=name;
									o.value=value;
									
									obiecte.push(o);
									
						//NAME section - content-disposition
						if (store2.responseHeaders.length) {  
								
							for (var j = 0, length = store2.responseHeaders.length;
                             j < length;
                             ++j) {
                            name = store2.responseHeaders[j].name;
                            value = store2.responseHeaders[j].value;
						
									o = new Object();
									o.name=name;
									o.value=value;
									//bkg.console.log(o);
									obiecte.push(o);

                        }}
						
						//if no content-disposition....then
						if (chromeM){
						            name = "filename";
									value = filename.toString();
									o = new Object();
									o.name=name;
									o.value=value;
									
									obiecte.push(o);
						}
						
						
							content +='<table id="soastatus" name="soastatus">';
             							
						if (chrome.extension.getBackgroundPage().tool1 == 'curl'){	
						var curl="CURL";	
						//bkg.console.log(obiecte);
						   
						curl=createCliCommand(obiecte,curl);
							
						
						content += '<tr><td>' +
                                    'CURL' +
                                    '</td><td style="word-wrap:break-word;" title="'+chrome.i18n.getMessage('contextHelpMessage')+'"><div id="wrapping" style="overflow:auto">' + curl + '</div></td></tr>'; 
						} else {
						var wget="WGET";
						//bkg.console.log(obiecte);
						wget=createCliCommand(obiecte,wget);
						
						content += '<tr><td class="key">' +
                                    'WGET' +
                                    '</td><td style="word-wrap:break-word;" title="'+chrome.i18n.getMessage('contextHelpMessage')+'"><div id="wrapping" style="overflow:auto">' + wget + '</div></td></tr>';			
								}	

        
						content += '</table></div>';

                        	content += '<div class="separator"></div>';
   
					document.getElementById('result').innerHTML = content;



                        // Select cell text on click
                    var tableCells = document.getElementsByTagName('td');
                    for (var tableCellIndex = 0, tableCellLength = tableCells.length;
                         tableCellIndex < tableCellLength;
                         ++tableCellIndex) {
                        tableCells[tableCellIndex].addEventListener('click', selectElementText, false);
                    }
                }
        }
    });

        
});
