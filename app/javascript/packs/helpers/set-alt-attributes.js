// This workaround is necessary because `wired-image` does not pass the `alt` attribute down to the rendered `img` element.
document.addEventListener('turbolinks:load', () => {
  const getImgElement = wiredImage =>
    wiredImage.shadowRoot.querySelector('img');

  const setAltTag = (imgElement, artistName) => {
    imgElement.alt = `cover image of ${artistName}`;
  };

  [...document.querySelectorAll('wired-image')].forEach(wiredImage => {
    const artistName = wiredImage.dataset.artistName;
    const imgElement = getImgElement(wiredImage);

    if (imgElement === null) {
      // Wait for `wired-image` to render `img` element.
      requestAnimationFrame(() => {
        const nextImgElement = getImgElement(wiredImage);
        setAltTag(nextImgElement, artistName);
      });
    } else {
      setAltTag(imgElement, artistName);
    }
  });
});
