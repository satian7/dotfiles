// Saves options to chrome.storage
function save_options() {
  var tool = document.getElementById('tool').value;
  var doublequotes = document.getElementById('quotechk').checked;
  console.log(doublequotes);
  chrome.storage.sync.set({
    tool: tool,
    quotes: doublequotes}, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
	chrome.extension.getBackgroundPage().doublequotes1=document.getElementById('quotechk').checked;
	chrome.extension.getBackgroundPage().tool1=document.getElementById('tool').value;
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value tool = 'curl' and doublequotes = true.
  chrome.storage.sync.get({
    tool: 'curl',
    quotes: false
  }, function(items) {
    document.getElementById('tool').value = items.tool;
    document.getElementById('quotechk').checked = items.quotes;
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',save_options);