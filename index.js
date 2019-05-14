(function($) {
  const debug = true;
  const storageVersion = 3;
  
  // Not in conversation, no JSON capabilities, or no localstorage. Just return.
  if (window.location.pathname.indexOf("/samtale") === -1 || typeof(Storage) === "undefined" || typeof(JSON) === "undefined") {
    return;
  }
  
  // Get the datas 
  const now = new Date().toISOString();
  const bodyDiv = $(".full_post_view .body div.textile.text");
  const title = window.document.title.substring(0, window.document.title.length - 12);
  const id = $(".full_post_view div.post").attr("data-object-id");
  const body = bodyDiv.html();
  const storageKey = `onoDrim_post_${storageVersion}_${id}`;
  (debug && console.log("Onodrim parsed", id, now, title, body));

  // Look for current version in localstorage, if not there init and return.
  const storedData = JSON.parse(localStorage.getItem(storageKey));
  if (!storedData) {
    const initData = {};
    initData.currentVersion = {};
    initData.currentVersion.time = now;
    initData.currentVersion.body = body;
    initData.currentVersion.title = title;
    initData.previousVersions = [];
    localStorage.setItem(storageKey, JSON.stringify(initData));
    (debug && console.log('No Onodrim data stored, initalized', initData));
    return;
  }

  (debug && console.log('Stored data', storedData));

  // Check if our body is the same as stored body. If it is not, store new version.
  if (storedData.currentVersion.body !== body) {
    // Push old version to storage
    storedData.previousVersions.push(storedData.currentVersion);

    // Create new object
    storedData.currentVersion.time = now;
    storedData.currentVersion.body = body;
    storedData.currentVersion.title = title;

    const toStore = JSON.stringify(storedData);
    localStorage.setItem(storageKey, toStore);

    (debug && console.log("Stored new version", storedData));
  }
  
  if (storedData.previousVersions.length === 0) {
    (debug && console.log("No previous versions stored"));
    return;
  }
  

})(jQuery);