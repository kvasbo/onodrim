(function($) {
  const debug = true;
  
  // Not in conversation, no JSON capabilities, or no localstorage. Just return.
  if (window.location.pathname.indexOf("/samtale") === -1 || typeof(Storage) === "undefined" || typeof(JSON) === "undefined") {
    return;
  }
  
  // Get the datas 
  const now = Date();
  const bodyDiv = $(".full_post_view .body div.textile.text");
  const title = window.document.title.substring(0, window.document.title.length - 12);
  const id = $(".full_post_view div.post").attr("data-object-id");
  const body = bodyDiv.html();
  (debug && console.log(id, now, title, body));



})(jQuery);