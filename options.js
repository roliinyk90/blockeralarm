// Saves options to chrome.storage
function save_options() {
  let minutes = document.getElementById('minutes').value;
console.log(minutes);
  chrome.storage.sync.set({
    'delayTime': minutes,
  }, function() {
    // Update status to let user know options were saved.
    let status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
 
  chrome.storage.sync.get({
    'delayTime': 5,

  }, function(items) {
    document.getElementById('minutes').value = items.delayTime;
  
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);
