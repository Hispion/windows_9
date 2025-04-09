export class WindowManager {
  constructor() {
    this.windows = new Map();
    this.zIndex = 1000;
    this.container = document.getElementById('windows-container');
  }

  createWindow(program, title, content, icon = null) {
    // Create a unique identifier for each window
    const windowId = `${program}-${Date.now()}`;
    
    const windowElement = document.createElement('div');
    windowElement.className = 'window';
    windowElement.style.zIndex = ++this.zIndex;
    windowElement.style.display = 'flex';
    
    windowElement.innerHTML = `
      <div class="window-titlebar">
        ${icon ? `<img src="${icon}" class="window-icon">` : ''}
        <div class="window-title">${title}</div>
        <div class="window-controls">
          <button class="window-control minimize"></button>
          <button class="window-control maximize"></button>
          <button class="window-control close"></button>
        </div>
      </div>
      <div class="window-content">${content}</div>
    `;

    // Set initial window size
    windowElement.style.width = '600px';
    windowElement.style.height = '400px';

    // Set initial window position with offset to prevent overlap
    const windowCount = this.windows.size;
    windowElement.style.left = `${50 + windowCount * 30}px`;
    windowElement.style.top = `${50 + windowCount * 30}px`;

    // Store program type for reference
    windowElement.dataset.program = program;

    // Track maximized state
    windowElement.dataset.maximized = 'false';

    this.setupWindowControls(windowElement, windowId, title);
    this.setupDragging(windowElement);
    this.setupResizing(windowElement);
    
    // Create taskbar button
    const taskbarButton = document.createElement('button');
    taskbarButton.className = 'taskbar-button';
    taskbarButton.dataset.windowId = windowId;
    taskbarButton.innerHTML = `
      <span class="taskbar-title">${title}</span>
    `;
    taskbarButton.addEventListener('click', () => {
      if (windowElement.style.display === 'none') {
        windowElement.style.display = 'flex';
        windowElement.style.zIndex = ++this.zIndex;
      } else {
        windowElement.style.display = 'none';
      }
    });
    document.getElementById('taskbar-programs').appendChild(taskbarButton);
    
    this.container.appendChild(windowElement);
    this.windows.set(windowId, windowElement);
    
    return windowElement;
  }

  setupWindowControls(windowElement, windowId, title) {
    const close = windowElement.querySelector('.close');
    const maximize = windowElement.querySelector('.maximize');
    const minimize = windowElement.querySelector('.minimize');

    close.addEventListener('click', () => {
      // Remove from DOM and delete from windows Map
      windowElement.remove();
      this.windows.delete(windowId);
      // Find and remove the taskbar button
      const taskbarButton = document.querySelector(`.taskbar-button[data-window-id="${windowId}"]`);
      if (taskbarButton) {
        taskbarButton.remove();
      }
    });

    maximize.addEventListener('click', () => {
      const isMaximized = windowElement.dataset.maximized === 'true';
      if (isMaximized) {
        // Restore window
        windowElement.style.width = '600px';
        windowElement.style.height = '400px';
        windowElement.style.left = '50px';
        windowElement.style.top = '50px';
        windowElement.style.transform = '';
        windowElement.dataset.maximized = 'false';
        
        // Re-enable dragging and resizing
        windowElement.style.transition = 'none';
        this.setupDragging(windowElement);
        this.setupResizing(windowElement);
      } else {
        // Maximize window
        windowElement.style.width = '100vw';
        windowElement.style.height = 'calc(100vh - 40px)'; // Account for taskbar
        windowElement.style.left = '0';
        windowElement.style.top = '0';
        windowElement.style.transform = 'none';
        windowElement.dataset.maximized = 'true';
        
        // Disable dragging and resizing
        windowElement.style.transition = 'all 0.2s ease';
        this.disableDragging(windowElement);
        this.disableResizing(windowElement);
      }
    });

    minimize.addEventListener('click', () => {
      windowElement.style.display = 'none';
    });
  }

  disableDragging(windowElement) {
    const titlebar = windowElement.querySelector('.window-titlebar');
    if (titlebar) {
      titlebar.style.cursor = 'default';
      titlebar.onmousedown = null;
    }
  }

  disableResizing(windowElement) {
    const handles = windowElement.querySelectorAll('.resize-handle');
    handles.forEach(handle => {
      handle.style.display = 'none';
    });
  }

  setupDragging(windowElement) {
    const titlebar = windowElement.querySelector('.window-titlebar');
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;

    const startDragging = (e) => {
      // Don't allow dragging if window is maximized
      if (windowElement.dataset.maximized === 'true') return;

      isDragging = true;
      initialX = e.clientX - xOffset;
      initialY = e.clientY - yOffset;
      
      windowElement.style.zIndex = ++this.zIndex;
    };

    const drag = (e) => {
      if (isDragging) {
        e.preventDefault();
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;
        xOffset = currentX;
        yOffset = currentY;

        windowElement.style.transform = `translate(${currentX}px, ${currentY}px)`;
      }
    };

    const stopDragging = () => {
      isDragging = false;
    };

    titlebar.addEventListener('mousedown', startDragging);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDragging);
  }

  setupResizing(windowElement) {
    const resizeHandles = ['n', 'e', 's', 'w', 'ne', 'se', 'sw', 'nw'];
    
    resizeHandles.forEach(direction => {
      const handle = document.createElement('div');
      handle.className = `resize-handle ${direction}`;
      windowElement.appendChild(handle);
      
      let startX, startY, startWidth, startHeight, startLeft, startTop;
      
      const handleMouseDown = (e) => {
        e.stopPropagation();
        startX = e.clientX;
        startY = e.clientY;
        startWidth = parseInt(getComputedStyle(windowElement).width, 10);
        startHeight = parseInt(getComputedStyle(windowElement).height, 10);
        startLeft = parseInt(getComputedStyle(windowElement).left, 10);
        startTop = parseInt(getComputedStyle(windowElement).top, 10);
        
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
      };
      
      const handleMouseMove = (e) => {
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        
        if (direction.includes('e')) {
          windowElement.style.width = `${startWidth + deltaX}px`;
        }
        if (direction.includes('s')) {
          windowElement.style.height = `${startHeight + deltaY}px`;
        }
        if (direction.includes('w')) {
          windowElement.style.width = `${startWidth - deltaX}px`;
          windowElement.style.left = `${startLeft + deltaX}px`;
        }
        if (direction.includes('n')) {
          windowElement.style.height = `${startHeight - deltaY}px`;
          windowElement.style.top = `${startTop + deltaY}px`;
        }
      };
      
      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
      
      handle.addEventListener('mousedown', handleMouseDown);
    });
  }
}
