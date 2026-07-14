/* ── LUFALIGHT BLOG SCHEMA — auto-generates Article + BreadcrumbList JSON-LD from page meta tags ── */
(function(){
  var getMeta = function(sel){ var el = document.querySelector(sel); return el ? (el.getAttribute('content') || el.getAttribute('href') || '') : ''; };
  var title = getMeta('meta[property="og:title"]').replace(' | Lufalight','') || document.title.replace(' | Lufalight','');
  var description = getMeta('meta[name="description"]');
  var image = getMeta('meta[property="og:image"]');
  var url = getMeta('link[rel="canonical"]') || window.location.href;

  // Parse date from ".article-meta" text like "Updated June 2026"
  var metaEl = document.querySelector('.article-meta');
  var dateStr = '2026-01-01';
  if(metaEl){
    var m = metaEl.textContent.match(/Updated\s+(\w+\s+\d{4})/);
    if(m){ try{ dateStr = new Date(m[1]).toISOString().split('T')[0]; }catch(e){} }
  }

  function inject(data){
    var s = document.createElement('script');
    s.type = 'application/ld+json';
    s.textContent = JSON.stringify(data);
    document.head.appendChild(s);
  }

  inject({
    "@context":"https://schema.org",
    "@type":"BlogPosting",
    "headline": title,
    "description": description,
    "image": image,
    "url": url,
    "dateModified": dateStr,
    "datePublished": dateStr,
    "author":{"@type":"Organization","name":"Lufalight","url":"https://www.lufalight.com"},
    "publisher":{
      "@type":"Organization",
      "name":"Lufalight",
      "url":"https://www.lufalight.com",
      "logo":{"@type":"ImageObject","url":"https://www.lufalight.com/images/logo.png","width":200,"height":60}
    },
    "mainEntityOfPage":{"@type":"WebPage","@id":url},
    "inLanguage":"en"
  });

  inject({
    "@context":"https://schema.org",
    "@type":"BreadcrumbList",
    "itemListElement":[
      {"@type":"ListItem","position":1,"name":"Home","item":"https://www.lufalight.com/"},
      {"@type":"ListItem","position":2,"name":"Health Blog","item":"https://www.lufalight.com/blog.html"},
      {"@type":"ListItem","position":3,"name":title,"item":url}
    ]
  });
})();
