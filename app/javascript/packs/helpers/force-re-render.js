// Ensure elements are correctly rendered on macOS/iOS browsers.
document.addEventListener('turbolinks:load', () => {
  const forceReRender = () => {
    [
      ...document.querySelectorAll('wired-button'),
      ...document.querySelectorAll('wired-card')
    ].forEach(element => {
      element.requestUpdate();
    });
  };

  forceReRender();

  // Should the elements not have rendered yet.
  // Just _really_ making sure...
  requestAnimationFrame(() => {
    forceReRender();
  });
  [0, 100, 500, 1000].forEach(delay => {
    setTimeout(() => {
      forceReRender();
    }, delay);
  });
});
