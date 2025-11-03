(function() {
  'use strict';

  function initPanelResize() {
    var scrollbarCover = document.querySelector('.scrollbar-cover');
    var documentPanel = document.querySelector('.article .document');
    var resourcesPanel = document.querySelector('.article .resources');

    if (!scrollbarCover || !documentPanel || !resourcesPanel) {
      setTimeout(initPanelResize, 500);
      return;
    }

    var isDragging = false;
    var article = documentPanel.parentElement;

    // Add cursor style to indicate draggability
    scrollbarCover.style.cursor = 'ew-resize';
    scrollbarCover.style.pointerEvents = 'auto';
    scrollbarCover.style.zIndex = '10000';

    scrollbarCover.addEventListener('mousedown', function(e) {
      isDragging = true;
      scrollbarCover.style.cursor = 'col-resize';
      e.preventDefault();
      e.stopPropagation();
    });

    document.addEventListener('mousemove', function(e) {
      if (!isDragging) return;

      // Calculate the new width percentage based on mouse position
      var articleRect = article.getBoundingClientRect();
      var mouseX = e.clientX - articleRect.left;
      var newDocumentWidth = (mouseX / articleRect.width) * 100;

      // Constrain between 10% and 90%
      newDocumentWidth = Math.max(10, Math.min(90, newDocumentWidth));
      var newResourcesWidth = 100 - newDocumentWidth;

      // Update panel widths
      documentPanel.style.width = newDocumentWidth + '%';
      resourcesPanel.style.width = newResourcesWidth + '%';
    });

    document.addEventListener('mouseup', function() {
      if (isDragging) {
        isDragging = false;
        scrollbarCover.style.cursor = 'ew-resize';
      }
    });

    // Prevent text selection while dragging
    scrollbarCover.addEventListener('selectstart', function(e) {
      e.preventDefault();
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPanelResize);
  } else {
    initPanelResize();
  }

  // Also try after a delay to ensure Lens has rendered
  setTimeout(initPanelResize, 2000);
})();
