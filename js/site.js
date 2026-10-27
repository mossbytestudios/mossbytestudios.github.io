// Screenshot viewer: a click on a screenshot opens it big in a dialog instead of leaving the page for the bare image.
// Close with the X, Esc or a click outside the picture; arrows (buttons or keys) step through the page's shots.
// Without JavaScript the links still open the image itself.
(function () {
  var links = Array.prototype.slice.call(document.querySelectorAll('a.screen[href$=".webp"], a.screen[href$=".png"], a.screen[href$=".jpg"]'));
  if (!links.length || typeof HTMLDialogElement !== 'function') return;

  var dlg = document.createElement('dialog');
  dlg.className = 'viewer';
  dlg.setAttribute('aria-label', 'Screenshot');
  dlg.innerHTML =
    '<button class="viewer-close" type="button" aria-label="Close">&times;</button>' +
    '<figure><img alt=""><figcaption></figcaption></figure>' +
    (links.length > 1 ?
      '<button class="viewer-nav prev" type="button" aria-label="Previous screenshot">&#8249;</button>' +
      '<button class="viewer-nav next" type="button" aria-label="Next screenshot">&#8250;</button>' : '');
  document.body.appendChild(dlg);

  var img = dlg.querySelector('img'), cap = dlg.querySelector('figcaption'), at = 0;

  function show(i) {
    at = (i + links.length) % links.length;
    var a = links[at], thumb = a.querySelector('img'), fig = a.closest('figure');
    var fc = fig && fig.querySelector('figcaption');
    img.src = a.getAttribute('href');
    img.alt = thumb ? thumb.alt : '';
    cap.textContent = fc ? fc.textContent : '';
  }

  links.forEach(function (a, i) {
    a.addEventListener('click', function (e) {
      if (e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return;   // new-tab clicks still open the image
      e.preventDefault();
      show(i);
      dlg.showModal();
    });
  });

  dlg.querySelector('.viewer-close').addEventListener('click', function () { dlg.close(); });
  dlg.addEventListener('click', function (e) {          // a click on the dark backdrop (not the picture) closes it
    if (e.target === dlg || e.target.tagName === 'FIGURE') dlg.close();
  });
  if (links.length > 1) {
    dlg.querySelector('.prev').addEventListener('click', function () { show(at - 1); });
    dlg.querySelector('.next').addEventListener('click', function () { show(at + 1); });
    dlg.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') show(at - 1);
      else if (e.key === 'ArrowRight') show(at + 1);
    });
  }
  dlg.addEventListener('close', function () { img.removeAttribute('src'); });
})();
