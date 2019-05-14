(function($) {
  const debug = false;
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

  const currentVersion = {};
  currentVersion.title = title;
  currentVersion.body = body;
  currentVersion.time = now;

  // Look for current version in localstorage, if not there init and return.
  const storedData = JSON.parse(localStorage.getItem(storageKey));
  if (!storedData) {
    const initData = {};
    initData.currentVersion = currentVersion;
    initData.previousVersions = [];
    localStorage.setItem(storageKey, JSON.stringify(initData));
    (debug && console.log('No Onodrim data stored, initalized', initData));
    return;
  }

  (debug && console.log('Stored data', storedData));

  // Check if our body is the same as stored body. If it is not, store new version.
  if (storedData.currentVersion.body !== body || storedData.currentVersion.title !== title) {
    // Push old version to storage
    storedData.previousVersions.push(storedData.currentVersion);
    // Store current version.
    storedData.currentVersion = currentVersion;

    const toStore = JSON.stringify(storedData);
    localStorage.setItem(storageKey, toStore);

    (debug && console.log("Stored new version", storedData));
  }
  
  if (storedData.previousVersions.length === 0) {
    (debug && console.log("No previous versions stored"));
    return;
  }

  // Append 
  for (var i = 0; i < storedData.previousVersions.length; i++) {
    const d = storedData.previousVersions[i];
    const date = new Date(d.time);
    const toAppend = `
      <div class="onodrimPreviousPost" style="display: none;">
        <hr />
        <h3>Tidligere versjon, lagret ${date.toLocaleString()}</h3>
        <h2>${d.title}</h2>
        <div>
          ${d.body}
        </div>
      </div>
    `;
    bodyDiv.append(toAppend);
  }

  const versjoner = storedData.previousVersions.length > 1 ? "versjoner" : "versjon";

  // Display UX
  const footer = $("ul.metadata.post_metadata");
  const deleteScript = `
    var r = confirm("Vil du tømme lageret for gamle versjoner av dette innlegget? Nettleservinduet vil lastes på nytt umiddelbart.");
    if (r === true) {
      localStorage.removeItem("${storageKey}");
    }
    window.reload();
  `;
  const toAppendToFooter = `
    <li>
      <label />
      Det finnes ${storedData.previousVersions.length} tidligere ${versjoner} av innlegget på denne maskinen.
      <a href='#' onClick='jQuery(".onodrimPreviousPost").fadeIn()')>Vis</a>
      &nbsp;
      <a href='#' onClick='${deleteScript}')>Slett</a>
      </li>
  `;
  footer.append(toAppendToFooter);
  

})(jQuery);