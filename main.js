import { WindowManager } from './window-manager.js';

export class Windows9 {
  constructor() {    
    // Add startup sound
    const startupSound = new Audio('windows 8.1.mp3');
    startupSound.play().catch(e => console.log('Audio playback failed:', e));
    
    // Get references to screens
    this.startupScreen = document.getElementById('startup-screen');
    this.setupWizard = document.getElementById('setup-wizard');
    this.desktop = document.getElementById('desktop');
    this.loginScreen = document.getElementById('login-screen');
    
    // Clear localStorage for testing
    // Uncomment this line to force setup:
    localStorage.clear();
    
    // Check if this is first run
    const isFirstRun = !localStorage.getItem('windows9_setup_complete');
    
    // Handle initial display states
    // Hide desktop and login screen initially
    if (this.desktop) {
      this.desktop.style.display = 'none';
    }

    if (this.loginScreen) {
      this.loginScreen.style.display = 'none';
    }

    // Show startup screen first
    if (this.startupScreen) {
      this.startupScreen.style.display = 'flex';
      this.startupScreen.style.opacity = '1';
    }

    // Show setup wizard after startup if first run
    setTimeout(() => {
      if (this.startupScreen) {
        this.startupScreen.style.opacity = '0';
        setTimeout(() => {
          this.startupScreen.style.display = 'none';
          
          if (isFirstRun) {
            // Show setup wizard
            if (this.setupWizard) {
              this.setupWizard.style.display = 'flex';
              this.initializeSetupWizard();
            }
          } else {
            // Show login screen
            if (this.loginScreen) {
              this.loginScreen.style.display = 'flex';
              this.loginScreen.style.opacity = '1';
              this.initializeLoginScreen();
            }
          }
        }, 1000);
      }
    }, 3000);
  }

  async initializeSetupWizard() {
    let currentStep = 1;
    const totalSteps = 5;  

    const setupOptions = document.querySelectorAll('.setup-option');
    setupOptions.forEach(option => {
      option.addEventListener('click', () => {
        setupOptions.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
        
        if (option.dataset.type === 'recover') {
          // Hide other steps
          document.querySelectorAll('.setup-step').forEach(s => s.classList.remove('active'));
          // Show recovery options step
          document.querySelector('.setup-step[data-step="recovery"]').classList.add('active');
          document.getElementById('setup-next').style.display = 'none';
          document.getElementById('setup-back').style.display = 'block';
        } else {
          // Continue with normal setup
          currentStep = 2;
          showStep(currentStep);
        }
      });
    });

    // Edition option click handler
    const editionOptions = document.querySelectorAll('.edition-option');
    editionOptions.forEach(option => {
      option.addEventListener('click', () => {
        editionOptions.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
      });
    });

    document.querySelectorAll('.profile-picture-option').forEach(option => {
      option.addEventListener('click', () => {
        document.querySelectorAll('.profile-picture-option').forEach(opt => 
          opt.classList.remove('selected'));
        option.classList.add('selected');
      });
    });

    // Update recovery buttons handlers
    document.querySelectorAll('.recovery-option button').forEach(button => {
      button.addEventListener('click', async () => {
        const action = button.textContent;
        if (confirm(`Are you sure you want to ${action}?`)) {
          // Hide other steps
          document.querySelectorAll('.setup-step').forEach(s => s.classList.remove('active'));
          
          // Create and show recovery progress screen
          const recoveryStep = document.createElement('div');
          recoveryStep.className = 'setup-step active';
          recoveryStep.innerHTML = `
            <div class="installation-progress">
              <div class="metro-spinner"></div>
              <div class="installation-text">Starting recovery process...</div>
            </div>
          `;
          
          document.querySelector('.setup-steps').appendChild(recoveryStep);
          
          // Hide navigation buttons
          document.getElementById('setup-next').style.display = 'none';
          document.getElementById('setup-back').style.display = 'none';
          
          // Simulate recovery process
          const progressText = recoveryStep.querySelector('.installation-text');
          const recoverySteps = [
            { message: "Scanning system...", duration: 2000 },
            { message: "Analyzing problems...", duration: 2000 },
            { message: "Backing up user data...", duration: 2000 },
            { message: "Repairing Windows files...", duration: 2000 },
            { message: "Restoring system settings...", duration: 2000 },
            { message: "Applying fixes...", duration: 2000 },
            { message: "Finalizing recovery...", duration: 2000 }
          ];

          // Process each recovery step
          for (const step of recoverySteps) {
            progressText.textContent = step.message;
            await new Promise(resolve => setTimeout(resolve, step.duration));
          }

          // Set setup as complete and go straight to login screen
          localStorage.setItem('windows9_setup_complete', 'true');
          
          const setupWizard = document.getElementById('setup-wizard');
          const loginScreen = document.getElementById('login-screen');
          
          if (setupWizard && loginScreen) {
            setupWizard.style.opacity = '0';
            await new Promise(resolve => setTimeout(resolve, 1000));
            setupWizard.style.display = 'none';
            loginScreen.style.display = 'flex';
            loginScreen.style.opacity = '1';
            this.initializeLoginScreen();
          }
        }
      });
    });

    const nextBtn = document.getElementById('setup-next');
    const backBtn = document.getElementById('setup-back');
    
    const updateButtons = () => {
      if (backBtn) {
        backBtn.style.display = currentStep === 1 ? 'none' : 'block';
        if (currentStep === totalSteps) { 
          backBtn.style.display = 'none';
        }
      }
      if (nextBtn) {
        nextBtn.textContent = currentStep === totalSteps ? 'Finish' : 'Next';
      }
    };

    const showStep = (step) => {
      document.querySelectorAll('.setup-step').forEach(s => s.classList.remove('active'));
      const nextStep = document.querySelector(`.setup-step[data-step="${step}"]`);
      if (nextStep) {
        nextStep.classList.add('active');
        updateButtons();
      }
    };

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (currentStep === 2) {
          // Save edition selection
          const editionOption = document.querySelector('.edition-option.selected');
          if (!editionOption) {
            alert('Please select an edition.');
            return;
          }
          localStorage.setItem('windows9_edition', editionOption.dataset.edition);
        }
        if (currentStep === 3) {
          // Validate username and save profile picture
          const username = document.getElementById('setup-username');
          if (username && !username.value.trim()) {
            alert('Please enter a username');
            return;
          }
          if (username && username.value.length > 20) {
            alert('Username must be 20 characters or less');
            return;
          }
          if (username) {
            localStorage.setItem('windows9_username', username.value);
          }
          const selectedPicture = document.querySelector('.profile-picture-option.selected');
          if (selectedPicture) {
            const imgSrc = selectedPicture.dataset.img;
            localStorage.setItem('windows9_profile_picture', imgSrc);
          }
        }

        if (currentStep === totalSteps) {
          if (nextBtn) nextBtn.disabled = true;
          if (backBtn) backBtn.disabled = true;
          
          const installationText = document.querySelector('.installation-text');
          const messages = [
            'Finalizing your settings...',
            'Just a moment...',
            'Almost there...'
          ];
          
          let messageIndex = 0;
          const messageInterval = setInterval(() => {
            if (messageIndex < messages.length && installationText) {
              installationText.textContent = messages[messageIndex];
              messageIndex++;
            } else {
              clearInterval(messageInterval);
              setTimeout(() => {
                localStorage.setItem('windows9_setup_complete', 'true');
                const setupWizard = document.getElementById('setup-wizard');
                const loginScreen = document.getElementById('login-screen');
                
                if (setupWizard) {
                  setupWizard.style.opacity = '0';
                  setTimeout(() => {
                    setupWizard.style.display = 'none';
                    if (loginScreen) {
                      loginScreen.style.display = 'flex';
                      loginScreen.style.opacity = '1';
                      this.initializeLoginScreen();
                    }
                  }, 1000);
                }
              }, 2000);
            }
          }, 2000);
          return;
        }

        currentStep++;
        showStep(currentStep);
      });
    }

    if (backBtn) {
      backBtn.addEventListener('click', () => {
        if (currentStep > 1) {
          currentStep--;
          showStep(currentStep);
        }
      });
    }

    // Show first step
    showStep(1);
  }

  initializeLoginScreen() {
    const username = localStorage.getItem('windows9_username') || 'User';
    const profilePicture = localStorage.getItem('windows9_profile_picture') || 'user-200-2131244741.png';
    
    document.querySelector('.login-username').textContent = username;
    
    const avatars = document.querySelectorAll('.login-avatar');
    avatars.forEach(avatar => {
      avatar.innerHTML = `<img src="${profilePicture}" alt="User Avatar" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;
    });
    
    const loginForm = document.getElementById('login-form');
    const passwordInput = document.getElementById('password-input');
    
    loginForm.onsubmit = (e) => {
      e.preventDefault();
      
      if (passwordInput.value.length > 0) {
        document.querySelector('.login-loader').style.display = 'block';
        passwordInput.disabled = true;

        // Create and show loading screen
        const loadingScreen = document.createElement('div');
        loadingScreen.className = 'loading-screen';
        loadingScreen.innerHTML = `
          <div class="loading-content">
            <img src="Windows-Logo-PNG-Image-File-3323715814.png" class="loading-logo" alt="Windows Logo">
            <div class="loading-spinner"></div>
            <div class="loading-text">Getting things ready for you</div>
          </div>
        `;
        document.body.appendChild(loadingScreen);

        // Sequence of loading messages
        const loadingMessages = [
          "Getting things ready for you",
          "Setting up your personalized features",
          "Almost there...",
          "Just a moment...",
          "Preparing your desktop"
        ];

        let messageIndex = 0;
        const messageInterval = setInterval(() => {
          const loadingText = loadingScreen.querySelector('.loading-text');
          if (loadingText) {
            loadingText.style.opacity = '0';
            setTimeout(() => {
              loadingText.textContent = loadingMessages[messageIndex % loadingMessages.length];
              loadingText.style.opacity = '1';
            }, 200);
            messageIndex++;
          }
        }, 2000);

        // Fade out login screen
        this.loginScreen.style.opacity = '0';
        
        setTimeout(() => {
          this.loginScreen.style.display = 'none';
          
          // Initialize desktop after loading sequence
          setTimeout(() => {
            // Prepare desktop
            this.desktop.style.display = 'block';
            this.desktop.style.opacity = '0';
            document.body.style.background = `url('Microsoft_Windows_9_HD_Widescreen_Wallpaper_03_1920x1200-2205267051.jpg') center/cover`;
            
            // Fade in desktop
            setTimeout(() => {
              this.desktop.style.opacity = '1';
              
              // Fade out loading screen
              setTimeout(() => {
                clearInterval(messageInterval);
                loadingScreen.style.opacity = '0';
                
                // Remove loading screen and play startup sound
                setTimeout(() => {
                  loadingScreen.remove();
                  const startupSound = new Audio('windows 8.1.mp3');
                  startupSound.play().catch(e => console.log('Audio playback failed:', e));
                  this.initializeOS();
                }, 500);
              }, 1000);
            }, 500);
          }, 3000);
        }, 1000);
      }
    };

    passwordInput.focus();
  }

  initializeOS() {
    document.getElementById('desktop').style.display = 'block';
    
    // Initialize window manager first
    this.windowManager = new WindowManager();

    this.startBtn = document.getElementById('start-btn');
    this.startMenu = document.getElementById('start-menu');
    this.clock = document.getElementById('clock');
    this.powerBtn = document.getElementById('power-btn');
    
    // Make sure start menu is hidden initially
    this.startMenu.classList.add('hidden');
    
    this.initializeEventListeners();
    this.initializeDesktopIcons();
    this.updateClock();
    
    // Update clock every second
    setInterval(() => this.updateClock(), 1000);

    // Update username from setup
    const username = localStorage.getItem('windows9_username');
    if (username) {
      document.querySelector('.user-name').textContent = username;
    }

    // Update profile picture in start menu
    const profilePicture = localStorage.getItem('windows9_profile_picture');
    if (profilePicture) {
      // Update all user avatars in the OS
      const avatars = document.querySelectorAll('.user-avatar');
      avatars.forEach(avatar => {
        avatar.innerHTML = `<img src="${profilePicture}" alt="User Avatar" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;
      });
    }
    
    // Load saved background
    const savedBg = localStorage.getItem('windows9_background');
    if (savedBg) {
      document.body.style.backgroundImage = `url('${savedBg}')`;
    }

    // Initialize start menu search
    const startMenuSearch = document.getElementById('start-menu-search');
    if (startMenuSearch) {
      startMenuSearch.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const programItems = document.querySelectorAll('.program-list .program-item');
        
        programItems.forEach(item => {
          const text = item.textContent.toLowerCase();
          if (text.includes(searchTerm)) {
            item.classList.remove('hidden');
          } else {
            item.classList.add('hidden');
          }
        });
      });
    }
  }

  initializeEventListeners() {
    // Toggle start menu
    this.startBtn.onclick = (e) => {
      e.stopPropagation();
      this.startMenu.classList.toggle('hidden');
    };
    
    // Close start menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.startMenu.contains(e.target) && !this.startBtn.contains(e.target)) {
        this.startMenu.classList.add('hidden');
      }
    });

    // Power button functionality
    this.powerBtn.addEventListener('click', () => {
      const confirmShutdown = confirm('Are you sure you want to shut down Windows 9?');
      if (confirmShutdown) {
        document.body.innerHTML = `
          <div style="height: 100vh; display: flex; align-items: center; justify-content: center; background: #000; color: #fff;">
            Shutting down...
          </div>
        `;
      }
    });
    
    // Program list click handlers
    document.querySelectorAll('.program-item').forEach(item => {
      item.addEventListener('click', () => {
        const program = item.dataset.program;
        if (program) {
          this.openProgram(program);
          this.startMenu.classList.add('hidden');
        }
      });
    });

    // Tile click handlers
    document.querySelectorAll('.tile').forEach(tile => {
      tile.addEventListener('click', () => {
        const program = tile.dataset.program;
        this.openProgram(program);
      });
    });
  }

  initializeDesktopIcons() {
    const icons = document.querySelectorAll('.desktop-icon');
    
    // Initialize grid positions
    icons.forEach((icon, index) => {
      // Add click handler to highlight selection
      icon.addEventListener('click', (e) => {
        icons.forEach(i => i.classList.remove('selected'));
        icon.classList.add('selected');
        e.stopPropagation();
      });

      // Clear selection when clicking desktop
      document.getElementById('desktop').addEventListener('click', () => {
        icons.forEach(i => i.classList.remove('selected'));
      });

      // Double click handler
      icon.addEventListener('dblclick', () => {
        const program = icon.dataset.program;
        if (program) {
          this.openProgram(program);
        }
      });
    });
  }

  updateClock() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    this.clock.textContent = `${hours}:${minutes}`;
  }
  
  openProgram(program) {
    switch(program) {
      case 'notepad':
        const notepadWindow = this.windowManager.createWindow(
          'notepad',
          'Notepad',
          `<div style="display: flex; flex-direction: column; height: 100%;">
            <div class="notepad-toolbar" style="padding: 8px; border-bottom: 1px solid #ddd;">
              <select id="font-size" style="margin-right: 8px;">
                <option value="12">12</option>
                <option value="14" selected>14</option>
                <option value="16">16</option>
                <option value="18">18</option>
                <option value="20">20</option>
              </select>
              <button id="bold-btn" style="margin-right: 4px;">B</button>
              <button id="italic-btn" style="margin-right: 4px;">I</button>
              <button id="underline-btn">U</button>
            </div>
            <textarea style="flex-grow: 1; resize: none; padding: 10px; border: none; outline: none; font-family: 'Segoe UI'; font-size: 14px;"></textarea>
          </div>`,
          'imageres_54.ico'
        );

        // Add event listeners for the toolbar
        if (notepadWindow) {
          const textarea = notepadWindow.querySelector('textarea');
          const fontSize = notepadWindow.querySelector('#font-size');
          const boldBtn = notepadWindow.querySelector('#bold-btn');
          const italicBtn = notepadWindow.querySelector('#italic-btn');
          const underlineBtn = notepadWindow.querySelector('#underline-btn');

          fontSize.addEventListener('change', (e) => {
            textarea.style.fontSize = `${e.target.value}px`;
          });

          boldBtn.addEventListener('click', () => {
            textarea.style.fontWeight = textarea.style.fontWeight === 'bold' ? 'normal' : 'bold';
            boldBtn.style.backgroundColor = textarea.style.fontWeight === 'bold' ? '#ddd' : '';
          });

          italicBtn.addEventListener('click', () => {
            textarea.style.fontStyle = textarea.style.fontStyle === 'italic' ? 'normal' : 'italic';
            italicBtn.style.backgroundColor = textarea.style.fontStyle === 'italic' ? '#ddd' : '';
          });

          underlineBtn.addEventListener('click', () => {
            textarea.style.textDecoration = textarea.style.textDecoration === 'underline' ? 'none' : 'underline';
            underlineBtn.style.backgroundColor = textarea.style.textDecoration === 'underline' ? '#ddd' : '';
          });
        }
        break;

      case 'run':
        const runWindow = this.windowManager.createWindow(
          'run',
          'Run',
          `<div style="padding: 20px;">
            <p>Type the name of a program, folder, document, or internet resource, and Windows will open it for you.</p>
            <input type="text" id="run-input" style="width: 100%; padding: 8px; margin-top: 10px;" placeholder="Open:">
            <div style="margin-top: 20px; text-align: right;">
              <button id="run-cancel-btn" style="margin-right: 10px;">Cancel</button>
              <button id="run-ok-btn">OK</button>
            </div>
          </div>`,
          'imageres_80.ico'
        );

        if (runWindow) {
          const okBtn = runWindow.querySelector('#run-ok-btn');
          const cancelBtn = runWindow.querySelector('#run-cancel-btn');
          const input = runWindow.querySelector('#run-input');

          okBtn.addEventListener('click', () => {
            const command = input.value.trim().toLowerCase();
            if (command) {
              this.openProgram(command);
              runWindow.remove();
            } else {
              alert('Please enter a command.');
            }
          });

          cancelBtn.addEventListener('click', () => {
            runWindow.remove();
          });

          input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              okBtn.click();
            }
          });
        }
        break;

      case 'winver':
        this.windowManager.createWindow(
          'winver',
          'About Windows',
          `<div style="padding: 20px; text-align: center;">
            <img src="Windows-Logo-PNG-Image-File-3323715814.png" width="100" height="100" alt="Windows Logo">
            <h2>Windows 9</h2>
            <p>Version 9.0 (Build 12345)</p>
            <p>&copy; 2023 Microsoft Corporation. All rights reserved.</p>
          </div>`,
          'windows-9-3827875304.png'
        );
        break;

      case 'computer':
        const computerWindow = this.windowManager.createWindow(
          'computer',
          'This PC',
          `<div style="padding: 20px; height: 100%; display: flex; flex-direction: column;">
            <div style="display: flex; align-items: flex-start; gap: 10px; margin-bottom: 20px;">
              <button class="nav-btn" data-path="/">This PC</button>
              <span class="path-separator">></span>
              <div class="current-path"></div>
            </div>
            <div class="file-explorer">
              <div class="folder" data-path="/C:">
                <img src="my-computer-icon-download_74052-2765179078.png" style="width: 32px; height: 32px;">
                <span>Windows 9 (C:)</span>
              </div>
              <div class="folder" data-path="/D:">
                <img src="my-computer-icon-download_74052-2765179078.png" style="width: 32px; height: 32px;">
                <span>Data (D:)</span>
              </div>
              <div class="folder" data-path="/Downloads">
                <img src="windows-7-orb-icon-by-skyangels-on-deviantart-26-3047874742.png" style="width: 32px; height: 32px;">
                <span>Downloads</span>
              </div>
              <div class="folder" data-path="/Documents">
                <img src="windows-7-orb-icon-by-skyangels-on-deviantart-26-3047874742.png" style="width: 32px; height: 32px;">
                <span>Documents</span>
              </div>
            </div>
          </div>`,
          'my-computer-icon-download_74052-2765179078.png'
        );

        // Initialize file explorer functionality
        if (computerWindow) {
          this.initializeFileExplorer(computerWindow);
        }
        break;

      case 'security':
        this.windowManager.createWindow(
          'security',
          'Microsoft Security',
          `<div style="padding: 20px;">
            <h3>System Security Status</h3>
            <div style="margin: 20px 0;">
              <div style="color: green;">Windows Defender is up to date</div>
              <div style="color: green;">Firewall is enabled</div>
              <div style="color: green;">System is protected</div>
            </div>
            <div style="background: #f0f0f0; padding: 15px; border-radius: 4px;">
              <h4>Last scan: Today at ${new Date().getHours()}:${String(new Date().getMinutes()).padStart(2, '0')}</h4>
              <p>No threats found</p>
            </div>
            <button style="margin-top: 20px;">Run New Scan</button>
          </div>`,
          'shell32_16772.ico'
        );
        break;

      case 'control':
        this.windowManager.createWindow(
          'control',
          'Control Panel',
          `<div class="control-panel">
            <div class="control-section">
              <h3>System and Security</h3>
              <div class="control-icons">
                <div class="control-icon" onclick="window.os.openProgram('security')">
                  <img src="shell32_16772.ico" style="width: 32px; height: 32px;">
                  <span>Security and Maintenance</span>
                </div>
                <div class="control-icon">
                  <img src="imageres_54.ico" style="width: 32px; height: 32px;">
                  <span>Windows Defender Firewall</span>
                </div>
                <div class="control-icon">
                  <img src="imageres_54.ico" style="width: 32px; height: 32px;">
                  <span>System</span>
                </div>
              </div>
            </div>
            
            <div class="control-section">
              <h3>Network and Internet</h3>
              <div class="control-icons">
                <div class="control-icon">
                  <img src="explorer_259.ico" style="width: 32px; height: 32px;">
                  <span>Network and Sharing Center</span>
                </div>
                <div class="control-icon">
                  <img src="ie-icon-10-1227051480.png" style="width: 32px; height: 32px;">
                  <span>Internet Options</span>
                </div>
              </div>
            </div>

            <div class="control-section">
              <h3>Hardware and Sound</h3>
              <div class="control-icons">
                <div class="control-icon">
                  <img src="imageres_54.ico" style="width: 32px; height: 32px;">
                  <span>Devices and Printers</span>
                </div>
                <div class="control-icon">
                  <img src="imageres_54.ico" style="width: 32px; height: 32px;">
                  <span>Sound</span>
                </div>
                <div class="control-icon">
                  <img src="imageres_54.ico" style="width: 32px; height: 32px;">
                  <span>Power Options</span>
                </div>
              </div>
            </div>

            <div class="control-section">
              <h3>Appearance and Personalization</h3>
              <div class="control-icons">
                <div class="control-icon" onclick="window.os.openProgram('settings')">
                  <img src="shell32_16772.ico" style="width: 32px; height: 32px;">
                  <span>Personalization</span>
                </div>
                <div class="control-icon">
                  <img src="imageres_54.ico" style="width: 32px; height: 32px;">
                  <span>Display</span>
                </div>
                <div class="control-icon">
                  <img src="imageres_54.ico" style="width: 32px; height: 32px;">
                  <span>File Explorer Options</span>
                </div>
              </div>
            </div>
          </div>`,
          'powercpl_514.ico'
        );
        break;

      case 'ie':
        this.windowManager.createWindow(
          'ie',
          'Internet Explorer',
          `<div style="height: 100%; display: flex; flex-direction: column;">
            <div style="padding: 5px; background: #f0f0f0; border-bottom: 1px solid #ddd;">
              <input type="text" id="url-input" placeholder="Enter URL or search" style="width: calc(100% - 10px); padding: 5px;">
            </div>
            <iframe src="https://websim.ai/@DaDeveelofer/SimBrowse-Browser/" style="flex-grow: 1; width: 100%; height: 100%; border: none;"></iframe>
          </div>`,
          'ie-icon-10-1227051480.png'
        );
        break;

      case 'edge':
        this.windowManager.createWindow(
          'edge',
          'Microsoft Edge',
          `<div style="height: 100%; display: flex; flex-direction: column;">
            <div style="padding: 5px; background: #f0f0f0; border-bottom: 1px solid #ddd;">
              <input type="text" id="url-input" placeholder="Enter URL or search" style="width: calc(100% - 10px); padding: 5px;">
            </div>
            <iframe src="https://websim.ai/@DaDeveelofer/SimBrowse-Browser/" style="flex-grow: 1; width: 100%; height: 100%; border: none;"></iframe>
          </div>`,
          'ie-icon-10-1227051480.png'
        );
        break;

      case 'recycle':
        this.windowManager.createWindow(
          'recycle',
          'Recycle Bin',
          `<div class="recycle-bin-content" style="padding: 20px; height: 100%;">
            <div class="file-explorer" id="recycle-bin-files"></div>
          </div>`,
          'imageres_55.ico'
        );

        const recycleBin = this.windowManager.windows.get('recycle');
        const recycleBinFiles = recycleBin.querySelector('#recycle-bin-files');
        
        // Load deleted files from localStorage
        const deletedFiles = JSON.parse(localStorage.getItem('windows9_deleted_files') || '[]');
        if (deletedFiles.length === 0) {
          recycleBinFiles.innerHTML = '<div class="empty-folder">Recycle Bin is empty</div>';
        } else {
          deletedFiles.forEach(fileHTML => {
            const fileDiv = document.createElement('div');
            fileDiv.className = 'file deleted-file';
            fileDiv.innerHTML = fileHTML;
            recycleBinFiles.appendChild(fileDiv);
          });
        }

        // Add drop event listeners to Recycle Bin
        recycleBinFiles.addEventListener('dragover', (e) => {
          e.preventDefault();
          recycleBinFiles.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
        });

        recycleBinFiles.addEventListener('dragleave', () => {
          recycleBinFiles.style.backgroundColor = '';
        });

        recycleBinFiles.addEventListener('drop', (e) => {
          e.preventDefault();
          recycleBinFiles.style.backgroundColor = '';

          const fileHTML = e.dataTransfer.getData('text/plain');
          const fileName = e.dataTransfer.getData('application/file-name');

          // Add file to Recycle Bin
          if (recycleBinFiles.querySelector('.empty-folder')) {
            recycleBinFiles.innerHTML = '';
          }

          const fileDiv = document.createElement('div');
          fileDiv.className = 'file deleted-file';
          fileDiv.innerHTML = fileHTML;
          recycleBinFiles.appendChild(fileDiv);

          // Store deleted files in localStorage
          const deletedFiles = JSON.parse(localStorage.getItem('windows9_deleted_files') || '[]');
          deletedFiles.push(fileHTML);
          localStorage.setItem('windows9_deleted_files', JSON.stringify(deletedFiles));

          // Remove the original file
          const originalFile = document.querySelector(`.file span:contains("${fileName}")`).parentElement;
          originalFile.remove();

          // Show notification
          alert(`"${fileName}" was moved to the Recycle Bin`);
        });
        break;

      case 'settings':
        this.windowManager.createWindow(
          'settings',
          'Settings',
          `<div class="settings-container">
            <div class="settings-nav">
              <button data-section="personalization" class="active">Personalization</button>
              <button data-section="system">System</button>
              <button data-section="accounts">Accounts</button>
              <button data-section="time">Time & Language</button>
              <button data-section="privacy">Privacy</button>
            </div>
            <div class="settings-content">
              <div class="settings-section active" id="personalization">
                <h3>Window Style</h3>
                <div class="color-picker-group">
                  <label>Titlebar Background:</label>
                  <input type="color" id="titlebar-color" value="#ffffff">
                  <span class="setting-description">Changes the color of window titlebars</span>
                </div>
                <div class="color-picker-group">
                  <label>Title Color:</label>
                  <input type="color" id="title-color" value="#333333">
                  <span class="setting-description">Changes the color of window titles</span>
                </div>
                <div class="color-picker-group">
                  <label>Controls Color:</label>
                  <input type="color" id="controls-color" value="#666666">
                  <span class="setting-description">Changes the color of window controls</span>
                </div>
                <div class="color-picker-group">
                  <label>Window Transparency:</label>
                  <input type="range" id="window-transparency" min="0" max="100" value="95">
                  <span class="setting-description">Adjusts the transparency of windows</span>
                </div>
                
                <h3>Background</h3>
                <div class="background-options">
                  <div class="background-preview selected" style="background-image: url('Microsoft_Windows_9_HD_Widescreen_Wallpaper_03_1920x1200-2205267051.jpg')" data-bg="Microsoft_Windows_9_HD_Widescreen_Wallpaper_03_1920x1200-2205267051.jpg"></div>
                  <div class="background-preview" style="background-image: url('Windows-9-3827875304.png')" data-bg="Windows-9-3827875304.png"></div>
                  <div class="background-preview" style="background-image: url('Microsoft-Windows-9-logo-four-colors_m-2653531498.jpg')" data-bg="Microsoft-Windows-9-logo-four-colors_m-2653531498.jpg"></div>
                </div>
              </div>
              
              <div class="settings-section" id="system">
                <h3>Display</h3>
                <div class="setting-group">
                  <label>Scale and Layout:</label>
                  <select id="display-scale">
                    <option value="100">100% (Recommended)</option>
                    <option value="125">125%</option>
                    <option value="150">150%</option>
                  </select>
                  <span class="setting-description">Change the size of text, apps, and other items</span>
                </div>
                
                <h3>Sound</h3>
                <div class="setting-group">
                  <label>Master Volume:</label>
                  <input type="range" id="master-volume" min="0" max="100" value="50">
                  <span class="setting-description">Adjust system volume</span>
                </div>
              </div>

              <div class="settings-section" id="accounts">
                <h3>Your Account</h3>
                <div class="account-info">
                  <div class="account-avatar"></div>
                  <div class="account-details">
                    <input type="text" id="account-name" value="${localStorage.getItem('windows9_username') || 'User'}">
                    <span class="setting-description">Your display name</span>
                  </div>
                </div>
                
                <h3>Sign-in Options</h3>
                <div class="setting-group">
                  <label>
                    <input type="checkbox" id="require-password">
                    Require password on wake
                  </label>
                </div>
              </div>

              <div class="settings-section" id="time">
                <h3>Date & Time</h3>
                <div class="setting-group">
                  <label>
                    <input type="checkbox" id="auto-time" checked>
                    Set time automatically
                  </label>
                </div>
                <div class="setting-group">
                  <label>Time Zone:</label>
                  <select id="timezone">
                    <option value="UTC">UTC</option>
                    <option value="EST">Eastern Time</option>
                    <option value="CST">Central Time</option>
                    <option value="PST">Pacific Time</option>
                  </select>
                </div>
              </div>

              <div class="settings-section" id="privacy">
                <h3>General Privacy</h3>
                <div class="setting-group">
                  <label>
                    <input type="checkbox" id="send-data">
                    Send diagnostic data to Microsoft
                  </label>
                </div>
                <div class="setting-group">
                  <label>
                    <input type="checkbox" id="personalized-ads">
                    Let apps use advertising ID
                  </label>
                </div>
              </div>
            </div>
          </div>`,
          'shell32_16772.ico'
        );
        
        // Initialize settings functionality
        const window = this.windowManager.windows.get('settings');
        if (window) {
          this.initializeSettings(window);
        }
        break;

      case 'marketplace':
        this.windowManager.createWindow(
          'marketplace',
          'Microsoft Store',
          `<div class="marketplace">
            <div class="marketplace-header">
              <input type="text" class="marketplace-search" placeholder="Search apps...">
            </div>
            <div class="app-grid">
              <div class="app-card">
                <div class="app-image">
                  <svg viewBox="0 0 24 24" width="48" height="48">
                    <path fill="#666" d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M19,19H5V5H19V19M17,17H7V7H17V17M15,15H9V13H15V15M15,11H9V9H15V11Z"/>
                  </svg>
                </div>
                <div class="app-info">
                  <div class="app-title">PhotoEditor Pro</div>
                  <div class="app-developer">Microsoft Corporation</div>
                  <div class="app-rating">★★★★☆ 4.5</div>
                  <div class="app-price">Free</div>
                  <button class="install-btn">Install</button>
                </div>
              </div>
              
              <div class="app-card">
                <div class="app-image">
                  <svg viewBox="0 0 24 24" width="48" height="48">
                    <path fill="#666" d="M20,4H4A2,2 0 0,0 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6A2,2 0 0,0 20,4M20,18H4V6H20V18M17,17H7V7H17V17M15,15H9V13H15V15M15,11H9V9H15V11Z"/>
                  </svg>
                </div>
                <div class="app-info">
                  <div class="app-title">Video Editor Plus</div>
                  <div class="app-developer">Creative Tools Inc</div>
                  <div class="app-rating">★★★★★ 4.8</div>
                  <div class="app-price">$4.99</div>
                  <button class="install-btn">Purchase</button>
                </div>
              </div>
              
              <div class="app-card">
                <div class="app-image">
                  <svg viewBox="0 0 24 24" width="48" height="48">
                    <path fill="#666" d="M15,6H9A2,2 0 0,0 7,8V16A2,2 0 0,0 9,18H15A2,2 0 0,0 17,16V8A2,2 0 0,0 15,6M15,16H9V8H15V16Z"/>
                  </svg>
                </div>
                <div class="app-info">
                  <div class="app-title">Music Maker Studio</div>
                  <div class="app-developer">Audio Labs</div>
                  <div class="app-rating">★★★★☆ 4.3</div>
                  <div class="app-price">Free Trial</div>
                  <button class="install-btn">Try Now</button>
                </div>
              </div>

              <div class="app-card">
                <div class="app-image" style="padding: 10px;">
                  <div style="font-size: 48px; text-align: center;">🐱</div>
                </div>
                <div class="app-info">
                  <div class="app-title">Cat Music Pack</div>
                  <div class="app-developer">Microsoft Studios</div>
                  <div class="app-rating">★★★★★ 5.0</div>
                  <div class="app-price">Free</div>
                  <button class="install-btn" data-pack="cat-music">Install</button>
                </div>
              </div>
            </div>
          </div>`,
          'explorer_259.ico'
        );

        // Initialize marketplace functionality
        const marketplaceWindow = this.windowManager.windows.get('marketplace');
        if (marketplaceWindow) {
          const installButtons = marketplaceWindow.querySelectorAll('.install-btn');
          installButtons.forEach(button => {
            button.addEventListener('click', () => {
              const appCard = button.closest('.app-card');
              const program = appCard.querySelector('.app-title').textContent;
              
              if (button.dataset.pack === 'cat-music') {
                // Special handling for cat music pack
                button.textContent = 'Installing...';
                button.disabled = true;
                
                // Simulate installation
                setTimeout(() => {
                  button.textContent = 'Installed';
                  button.classList.add('installed');
                  
                  // Add cat songs to the music player playlist
                  this.catSongs = [
                    { title: 'Cat Song', file: 'cat.mp3' },
                    { title: 'Cat Song 1.0', file: 'Cat Song 1.0.wav' },
                    { title: 'Windows 8.1 Cat Mix', file: 'windows 8.1.mp3' },
                    { title: 'Grasswalk (Cat Version)', file: '04. Grasswalk.mp3' }
                  ];
                  
                  // Store cat songs in localStorage
                  localStorage.setItem('windows9_cat_music_installed', 'true');
                  localStorage.setItem('windows9_cat_songs', JSON.stringify(this.catSongs));
                  
                  alert(`"${program}" has been installed successfully! The cat-themed songs are now available in your Music Player.`);
                  
                  // Open music player automatically
                  this.openProgram('music');
                }, 2000);
              } else {
                if (button.textContent === 'Install' || button.textContent === 'Try Now') {
                  button.textContent = 'Installing...';
                  button.disabled = true;
                  
                  setTimeout(() => {
                    button.textContent = 'Installed';
                    button.classList.add('installed');
                    alert(`"${program}" has been installed successfully!`);
                  }, 2000);
                } else if (button.textContent === 'Purchase') {
                  alert('Purchase functionality coming soon!');
                }
              }
            });
          });
        }
        break;

      case 'clippy':
        const clippyWindow = this.windowManager.createWindow(
          'clippy',
          'Clippy - Office Assistant',
          `<div style="display: flex; flex-direction: column; height: 100%; padding: 15px;">
            <div style="display: flex; align-items: flex-start; gap: 20px; margin-bottom: 20px;">
              <img src="Clippy.png" style="width: 64px; height: 64px; object-fit: contain;" alt="Clippy">
              <div>
                <h2 style="margin-bottom: 10px;">Hi there! I'm Clippy!</h2>
                <p>I see you're using Windows 9. Need help with anything?</p>
              </div>
            </div>
            <div class="clippy-chat" style="flex-grow: 1; overflow-y: auto; padding: 10px; background: #f5f5f5; border-radius: 4px; margin-bottom: 10px;"></div>
            <div class="clippy-input-area" style="display: flex; gap: 10px;">
              <textarea id="clippy-input" placeholder="Type your question here..." style="flex-grow: 1; padding: 8px; border: 1px solid #ddd; border-radius: 4px; resize: none;" rows="2"></textarea>
              <button onclick="window.os.askClippy()" style="padding: 0 20px; background: #0078D7; color: white; border: none; border-radius: 4px; cursor: pointer;">Ask</button>
            </div>
          </div>`,
          'Clippy.png'
        );

        // Add event listener for Enter key in input
        const clippyInput = clippyWindow.querySelector('#clippy-input');
        clippyInput?.addEventListener('keypress', (e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            this.askClippy();
          }
        });
        break;

      case 'music':
        const catSongsInstalled = localStorage.getItem('windows9_cat_music_installed') === 'true';
        const savedCatSongs = catSongsInstalled ? JSON.parse(localStorage.getItem('windows9_cat_songs')) : [];
        
        const songs = [
          { title: 'Background Music', file: 'Background Music.m4a' },
          { title: 'Spongebob Ending', file: 'Spongebob Squarepants - Ending.mp3' },
          { title: 'Cat Song', file: 'cat.mp3' },
          { title: 'Cat Song 1.0', file: 'Cat Song 1.0.wav' },
          { title: 'Windows 8.1 Cat Mix', file: 'windows 8.1.mp3' },
          { title: 'Grasswalk (Cat Version)', file: '04. Grasswalk.mp3' },
          { title: 'M.U.L.E. (Bitblaster Mix)', file: '8 Bit Weapon - M.U.L.E. (Bitblaster Mix) - Roblox Remastered Soundtrack.mp3' },
          { title: 'DOOM E1M1', file: 'doom midi e1m1.wav' },
          { title: 'Loonboon', file: '05. Loonboon.mp3' },
          { title: 'Roblox Music', file: 'Roblox Music.mp3' },
          { title: 'PvZ - Day Stage', file: 'Plants vs Zombies Soundtrack Day Stage.mp3' },
          { title: 'SM64 - Dire Dire Docks', file: 'Super Mario 64 Soundtrack - Dire, Dire Docks.mp3' },
          { title: 'The Thing', file: 'thepenis.flac' },
          { title: 'Stereo Madness', file: '1-02. Stereo Madness.mp3' },
          { title: 'Hotel', file: 'Undertale OST_ 054 - Hotel [ ezmp3.cc ].mp3' },
          { title: 'Not A Slacker Anymore', file: 'Undertale Last Breath Not A Slacker Anymore V2 OST Phase 1.mp3' },
          { title: 'Finale', file: 'Undertale OST 080 - Finale.mp3' },
          { title: 'The Slaughter Continues', file: 'Undertale Last Breath_ The Slaughter Continues V2 [Phase 2] (320K).mp3' },
          { title: 'ASGORE', file: 'toby fox - UNDERTALE Soundtrack - 77 ASGORE.mp3' },
          { title: 'GD Practice Mode', file: 'geometry-dash-practice-mode-stay-inside-me-soundtrack-made-with-Voicemod.mp3' },
          { title: 'SpongeBob - Twelfth Street Rag', file: 'SpongeBob SquarePants - Twelfth Street Rag.mp3' }
        ];

        const musicWindow = this.windowManager.createWindow(
          'music',
          'Music Player',
          `<div class="music-player">
            <div class="now-playing">
              <div class="song-info">
                <div class="song-title">No song selected</div>
                <div class="song-artist">Select a song to play</div>
              </div>
              <div class="playback-controls">
                <button class="shuffle-btn" title="Shuffle">🔀</button>
                <button class="prev-btn" title="Previous">⏮</button>
                <button class="play-btn" title="Play/Pause">▶</button>
                <button class="next-btn" title="Next">⏭</button>
                <button class="loop-btn" title="Loop">🔁</button>
              </div>
              <div class="progress-container">
                <div class="progress-bar"></div>
              </div>
              <div class="time-current">0:00</div>
              <div class="time-total">0:00</div>
              <div class="volume-control">
                <span>🔊</span>
                <input type="range" min="0" max="100" value="100" class="volume-slider">
              </div>
            </div>
            <div class="playlist">
              ${songs.map((song, index) => `
                <div class="playlist-item" data-index="${index}" data-file="${song.file}">
                  <span class="song-number">${(index + 1).toString().padStart(2, '0')}</span>
                  <span class="song-title">${song.title}</span>
                </div>
              `).join('')}
            </div>
          </div>`,
          'powercfg_202.ico'
        );

        // Initialize music player functionality
        if (musicWindow) {
          let currentAudio = null;
          let currentIndex = -1;
          let isPlaying = false;
          let isShuffled = false;
          let loopMode = 'none'; // none, single, all
          let shuffledIndexes = [];

          const playBtn = musicWindow.querySelector('.play-btn');
          const prevBtn = musicWindow.querySelector('.prev-btn');
          const nextBtn = musicWindow.querySelector('.next-btn');
          const shuffleBtn = musicWindow.querySelector('.shuffle-btn');
          const loopBtn = musicWindow.querySelector('.loop-btn');
          const volumeSlider = musicWindow.querySelector('.volume-slider');
          const progressBar = musicWindow.querySelector('.progress-bar');
          const progressContainer = musicWindow.querySelector('.progress-container');
          const timeCurrentSpan = musicWindow.querySelector('.time-current');
          const timeTotalSpan = musicWindow.querySelector('.time-total');
          const songTitleDiv = musicWindow.querySelector('.song-info .song-title');
          const songArtistDiv = musicWindow.querySelector('.song-info .song-artist');
          const playlist = musicWindow.querySelector('.playlist');

          const shuffleArray = array => {
            const newArr = [...array];
            for (let i = newArr.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
            }
            return newArr;
          };

          const toggleShuffle = () => {
            isShuffled = !isShuffled;
            shuffleBtn.classList.toggle('active');
            if (isShuffled) {
              shuffledIndexes = shuffleArray([...Array(songs.length).keys()]);
            }
          };

          const toggleLoop = () => {
            switch(loopMode) {
              case 'none':
                loopMode = 'single';
                loopBtn.textContent = '🔂';
                loopBtn.classList.add('active');
                break;
              case 'single':
                loopMode = 'all';
                loopBtn.textContent = '🔁';
                loopBtn.classList.add('active');
                break;
              case 'all':
                loopMode = 'none';
                loopBtn.textContent = '🔁';
                loopBtn.classList.remove('active');
                break;
            }
          };

          // Add click handlers for new buttons
          shuffleBtn.addEventListener('click', toggleShuffle);
          loopBtn.addEventListener('click', toggleLoop);

          // Update loadSong function to handle ended event with new loop modes
          const loadSong = (index) => {
            if (currentAudio) {
              currentAudio.pause();
              currentAudio = null;
            }

            currentIndex = index;
            const song = songs[index];
            currentAudio = new Audio(song.file);
            songTitleDiv.textContent = song.title;
            songArtistDiv.textContent = 'Now Playing';
            songTitleDiv.parentElement.classList.add('playing');
            
            currentAudio.addEventListener('loadedmetadata', () => {
              timeTotalSpan.textContent = formatTime(currentAudio.duration);
            });

            currentAudio.addEventListener('timeupdate', () => {
              const progress = (currentAudio.currentTime / currentAudio.duration) * 100;
              progressBar.style.width = `${progress}%`;
              timeCurrentSpan.textContent = formatTime(currentAudio.currentTime);
            });

            currentAudio.addEventListener('ended', () => {
              songTitleDiv.parentElement.classList.remove('playing');
              
              if (loopMode === 'single') {
                currentAudio.currentTime = 0;
                playSong();
              } else if (loopMode === 'all') {
                const nextIndex = (currentIndex + 1) % songs.length;
                loadSong(isShuffled ? shuffledIndexes[nextIndex] : nextIndex);
                playSong();
              } else if (currentIndex < songs.length - 1) {
                const nextIndex = currentIndex + 1;
                loadSong(isShuffled ? shuffledIndexes[nextIndex] : nextIndex);
                playSong();
              } else {
                isPlaying = false;
                playBtn.textContent = '▶';
              }
            });

            currentAudio.volume = volumeSlider.value / 100;
            
            // Update playlist highlight
            playlist.querySelectorAll('.playlist-item').forEach(item => {
              item.classList.remove('active');
              if (parseInt(item.dataset.index) === currentIndex) {
                item.classList.add('active');
                item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
              }
            });
          };

          // Add click handler for progress bar
          progressContainer.addEventListener('click', (e) => {
            if (!currentAudio) return;
            
            const rect = progressContainer.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            currentAudio.currentTime = percent * currentAudio.duration;
          });

          const formatTime = (seconds) => {
            const mins = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${mins}:${secs.toString().padStart(2, '0')}`;
          };

          const playSong = () => {
            if (currentAudio) {
              currentAudio.play();
              isPlaying = true;
              playBtn.textContent = '⏸';
            }
          };

          const pauseSong = () => {
            if (currentAudio) {
              currentAudio.pause();
              isPlaying = false;
              playBtn.textContent = '▶';
            }
          };

          playBtn.addEventListener('click', () => {
            if (currentIndex === -1 && songs.length > 0) {
              loadSong(0);
            }
            if (isPlaying) {
              pauseSong();
            } else {
              playSong();
            }
          });

          prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
              loadSong(isShuffled ? shuffledIndexes[currentIndex - 1] : currentIndex - 1);
              playSong();
            }
          });

          nextBtn.addEventListener('click', () => {
            if (currentIndex < songs.length - 1) {
              loadSong(isShuffled ? shuffledIndexes[currentIndex + 1] : currentIndex + 1);
              playSong();
            }
          });

          volumeSlider.addEventListener('input', () => {
            if (currentAudio) {
              currentAudio.volume = volumeSlider.value / 100;
            }
          });

          playlist.addEventListener('click', (e) => {
            const item = e.target.closest('.playlist-item');
            if (item) {
              const index = parseInt(item.dataset.index);
              loadSong(index);
              playSong();
              
              // Remove active class from all items
              playlist.querySelectorAll('.playlist-item').forEach(i => i.classList.remove('active'));
              // Add active class to clicked item
              item.classList.add('active');
            }
          });
        }
        break;

      case 'cmd':
        break;

      case 'music':
        break;

      case 'spinningcat':
        this.windowManager.createWindow(
          'spinningcat',
          'Spinning Cat',
          `<div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; background: #000; padding: 20px;">
            <div class="cat-controls" style="margin-bottom: 20px;">
              <button onclick="window.os.changeCatGif('spinning-cat')" style="margin: 0 5px;">Spinning Cat</button>
              <button onclick="window.os.changeCatGif('maxwell-cat')" style="margin: 0 5px;">Maxwell</button>
              <button onclick="window.os.changeCatGif('happy-cat')" style="margin: 0 5px;">Happy Cat</button>
            </div>
            <img id="cat-gif" src="spinning-cat.gif" alt="Cat GIF" style="max-width: 100%; max-height: calc(100% - 60px); object-fit: contain;">
            <p style="color: white; margin-top: 20px; font-size: 18px;" id="cat-caption">🐱 Mesmerizing, isn't it? 🐱</p>
          </div>`,
          'spinning-cat.gif'
        );
        break;

      case 'documents':
        this.windowManager.createWindow(
          'documents',
          'My Documents',
          `<div style="padding: 20px; height: 100%;">
            <div class="file-explorer">
              <div class="file" draggable="true">
                <img src="imageres_54.ico" style="width: 32px; height: 32px;">
                <span>Project Ideas.txt</span>
              </div>
              <div class="file" draggable="true">
                <img src="imageres_54.ico" style="width: 32px; height: 32px;">
                <span>Shopping List.txt</span>
              </div>
              <div class="file" draggable="true">
                <img src="imageres_54.ico" style="width: 32px; height: 32px;">
                <span>Important Notes.txt</span>
              </div>
              <div class="file" draggable="true">
                <img src="imageres_54.ico" style="width: 32px; height: 32px;">
                <span>To Do List.txt</span>
              </div>
              <div class="folder" data-path="/Documents/Work">
                <img src="windows-7-orb-icon-by-skyangels-on-deviantart-26-3047874742.png" style="width: 32px; height: 32px;">
                <span>Work Documents</span>
              </div>
              <div class="folder" data-path="/Documents/Personal">
                <img src="windows-7-orb-icon-by-skyangels-on-deviantart-26-3047874742.png" style="width: 32px; height: 32px;">
                <span>Personal Files</span>
              </div>
            </div>
          </div>`,
          'imageres_87.ico'
        );

        // Make files draggable
        const docWindow = this.windowManager.windows.get('documents');
        if (docWindow) {
          const files = docWindow.querySelectorAll('.file');
          files.forEach(file => {
            file.addEventListener('dragstart', (e) => {
              e.dataTransfer.setData('text/plain', file.innerHTML);
              e.dataTransfer.setData('application/file-name', file.querySelector('span').textContent);
            });
          });
        }
        break;

      case 'minesweeper':
        const minesweeperWindow = this.windowManager.createWindow(
          'minesweeper',
          'Minesweeper',
          `<div class="minesweeper-container">
            <div style="background: #c0c0c0; padding: 10px; border: 2px solid #808080;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <div id="mine-counter" style="background: black; color: red; padding: 3px 10px; font-family: 'Digital', monospace; font-size: 20px;">010</div>
                <button id="smiley-btn" style="width: 30px; height: 30px; font-size: 20px; background: #c0c0c0; border: 2px outset #fff; cursor: pointer;">😊</button>
                <div id="timer" style="background: black; color: red; padding: 3px 10px; font-family: 'Digital', monospace; font-size: 20px;">000</div>
              </div>
              <div id="minesweeper-grid" style="display: inline-grid; gap: 1px;"></div>
            </div>
            <div style="margin-top: 10px; display: flex; justify-content: space-between;">
              <select id="difficulty" style="padding: 5px;">
                <option value="beginner">Beginner (9x9)</option>
                <option value="intermediate">Intermediate (16x16)</option>
                <option value="expert">Expert (30x16)</option>
              </select>
              <span id="best-time" style="padding: 5px;">Best Time: --</span>
            </div>
          </div>`,
          'Minesweeper_icon.png'
        );

        if (minesweeperWindow) {
          const grid = minesweeperWindow.querySelector('#minesweeper-grid');
          const smileyBtn = minesweeperWindow.querySelector('#smiley-btn');
          const difficultySelect = minesweeperWindow.querySelector('#difficulty');
          const mineCounter = minesweeperWindow.querySelector('#mine-counter');
          const timer = minesweeperWindow.querySelector('#timer');
          const bestTimeDisplay = minesweeperWindow.querySelector('#best-time');
          
          const gameConfig = {
            beginner: { width: 9, height: 9, mines: 10 },
            intermediate: { width: 16, height: 16, mines: 40 },
            expert: { width: 30, height: 16, mines: 99 }
          };
          
          let currentConfig = gameConfig.beginner;
          let cells = [];
          let mines = [];
          let gameOver = false;
          let timerInterval;
          let timeElapsed = 0;
          let flagsPlaced = 0;
          let firstClick = true;
          
          const loadBestTime = () => {
            const bestTime = localStorage.getItem(`minesweeper_best_time_${difficultySelect.value}`) || '--';
            bestTimeDisplay.textContent = `Best Time: ${bestTime}`;
          };

          const updateBestTime = () => {
            const bestTimeKey = `minesweeper_best_time_${difficultySelect.value}`;
            const bestTime = localStorage.getItem(bestTimeKey);
            if (!bestTime || timeElapsed < parseInt(bestTime)) {
              localStorage.setItem(bestTimeKey, timeElapsed);
              bestTimeDisplay.textContent = `Best Time: ${timeElapsed}`;
              alert('New best time!');
            }
          };

          const formatCounter = (num) => {
            return String(Math.min(Math.max(num, 0), 999)).padStart(3, '0');
          };

          const createGrid = () => {
            grid.innerHTML = '';
            cells = [];
            mines = [];
            gameOver = false;
            flagsPlaced = 0;
            timeElapsed = 0;
            firstClick = true;
            smileyBtn.textContent = '😊';
            if (timerInterval) clearInterval(timerInterval);
            timer.textContent = formatCounter(0);
            mineCounter.textContent = formatCounter(currentConfig.mines);
            loadBestTime();
            
            grid.style.gridTemplate = `repeat(${currentConfig.height}, 25px) / repeat(${currentConfig.width}, 25px)`;
            
            // Create cells
            for (let i = 0; i < currentConfig.height; i++) {
              for (let j = 0; j < currentConfig.width; j++) {
                const cell = document.createElement('div');
                cell.style.width = '25px';
                cell.style.height = '25px';
                cell.style.background = '#c0c0c0';
                cell.style.border = '2px outset #fff';
                cell.style.display = 'flex';
                cell.style.alignItems = 'center';
                cell.style.justifyContent = 'center';
                cell.style.fontWeight = 'bold';
                cell.style.cursor = 'pointer';
                cell.style.userSelect = 'none';
                cell.dataset.row = i;
                cell.dataset.col = j;
                
                cell.addEventListener('click', () => handleClick(i, j));
                cell.addEventListener('contextmenu', (e) => {
                  e.preventDefault();
                  handleRightClick(i, j);
                });
                
                grid.appendChild(cell);
                cells.push(cell);
              }
            }
          };

          const placeMines = (excludeRow, excludeCol) => {
            mines = [];
            const excludeIndex = excludeRow * currentConfig.width + excludeCol;
            let minesPlaced = 0;
            
            while (minesPlaced < currentConfig.mines) {
              const index = Math.floor(Math.random() * (currentConfig.width * currentConfig.height));
              if (!mines.includes(index) && index !== excludeIndex) {
                mines.push(index);
                minesPlaced++;
              }
            }
          };
          
          const getNeighbors = (row, col) => {
            const neighbors = [];
            for (let i = -1; i <= 1; i++) {
              for (let j = -1; j <= 1; j++) {
                if (i === 0 && j === 0) continue;
                const newRow = row + i;
                const newCol = col + j;
                if (newRow >= 0 && newRow < currentConfig.height && 
                    newCol >= 0 && newCol < currentConfig.width) {
                  neighbors.push({ row: newRow, col: newCol });
                }
              }
            }
            return neighbors;
          };
          
          const countNeighborMines = (row, col) => {
            return getNeighbors(row, col).filter(n => 
              mines.includes(n.row * currentConfig.width + n.col)
            ).length;
          };
          
          const handleClick = (row, col) => {
            if (gameOver) return;
            const index = row * currentConfig.width + col;
            const cell = cells[index];
            
            if (cell.dataset.flagged === 'true') return;

            if (firstClick) {
              firstClick = false;
              placeMines(row, col);
              timerInterval = setInterval(() => {
                timeElapsed++;
                timer.textContent = formatCounter(timeElapsed);
              }, 1000);
            }
            
            if (mines.includes(index)) {
              // Game Over
              gameOver = true;
              smileyBtn.textContent = '😵';
              clearInterval(timerInterval);
              mines.forEach(mineIndex => {
                const mineCell = cells[mineIndex];
                if (mineCell.dataset.flagged !== 'true') {
                  mineCell.textContent = '💣';
                  mineCell.style.background = '#f00';
                }
              });
              cell.style.background = '#f00';
              return;
            }
            
            revealCell(row, col);
            checkWin();
          };
          
          const revealCell = (row, col) => {
            const index = row * currentConfig.width + col;
            const cell = cells[index];
            
            if (cell.dataset.revealed === 'true' || cell.dataset.flagged === 'true') return;
            
            cell.dataset.revealed = 'true';
            cell.style.border = '1px solid #808080';
            cell.style.background = '#e0e0e0';
            
            const neighborMines = countNeighborMines(row, col);
            if (neighborMines === 0) {
              getNeighbors(row, col).forEach(n => revealCell(n.row, n.col));
            } else {
              cell.textContent = neighborMines;
              const colors = ['#0000ff', '#008000', '#ff0000', '#000080', '#800000', '#008080', '#000000', '#808080'];
              cell.style.color = colors[neighborMines - 1];
            }
          };
          
          const handleRightClick = (row, col) => {
            if (gameOver || firstClick) return;
            const index = row * currentConfig.width + col;
            const cell = cells[index];
            
            if (cell.dataset.revealed === 'true') return;
            
            if (cell.dataset.flagged === 'true') {
              cell.dataset.flagged = 'false';
              cell.textContent = '';
              cell.style.border = '2px outset #fff';
              flagsPlaced--;
            } else {
              cell.dataset.flagged = 'true';
              cell.textContent = '🚩';
              cell.style.border = '2px inset #808080';
              flagsPlaced++;
            }
            
            mineCounter.textContent = formatCounter(currentConfig.mines - flagsPlaced);
          };
          
          const checkWin = () => {
            const revealed = cells.filter(cell => cell.dataset.revealed === 'true').length;
            if (revealed === cells.length - mines.length) {
              gameOver = true;
              smileyBtn.textContent = '😎';
              clearInterval(timerInterval);
              updateBestTime();
              mines.forEach(index => {
                if (cells[index].dataset.flagged !== 'true') {
                  cells[index].textContent = '🚩';
                  cells[index].style.border = '2px inset #808080';
                }
              });
            }
          };
          
          // Event listeners
          smileyBtn.addEventListener('click', createGrid);
          difficultySelect.addEventListener('change', (e) => {
            currentConfig = gameConfig[e.target.value];
            createGrid();
          });
          
          // Start first game
          createGrid();
        }
        break;

      default:
        alert('Program not found');
    }
  }

  initializeFileExplorer(window) {
    const explorer = window.querySelector('.file-explorer');
    const navBtn = window.querySelector('.nav-btn');
    const pathSeparator = window.querySelector('.path-separator');
    const currentPathDisplay = window.querySelector('.current-path');
    let currentPath = '/';

    const updatePath = (path) => {
      currentPath = path;
      currentPathDisplay.textContent = path === '/' ? '' : path;
      if (path === '/') {
        pathSeparator.style.display = 'none';
      } else {
        pathSeparator.style.display = 'inline';
      }
    };

    const navigateToFolder = (path) => {
      updatePath(path);
      explorer.innerHTML = '';

      if (path === '/') {
        // Root directory (This PC)
        explorer.innerHTML = `
          <div class="folder" data-path="/C:">
            <img src="my-computer-icon-download_74052-2765179078.png" style="width: 32px; height: 32px;">
            <span>Windows 9 (C:)</span>
          </div>
          <div class="folder" data-path="/D:">
            <img src="my-computer-icon-download_74052-2765179078.png" style="width: 32px; height: 32px;">
            <span>Data (D:)</span>
          </div>
          <div class="folder" data-path="/Downloads">
            <img src="windows-7-orb-icon-by-skyangels-on-deviantart-26-3047874742.png" style="width: 32px; height: 32px;">
            <span>Downloads</span>
          </div>
          <div class="folder" data-path="/Documents">
            <img src="windows-7-orb-icon-by-skyangels-on-deviantart-26-3047874742.png" style="width: 32px; height: 32px;">
            <span>Documents</span>
          </div>
        `;
      } else if (path === '/C:') {
        explorer.innerHTML = `
          <div class="folder" data-path="/C:/Windows">
            <img src="windows-7-orb-icon-by-skyangels-on-deviantart-26-3047874742.png" style="width: 32px; height: 32px;">
            <span>Windows</span>
          </div>
          <div class="folder" data-path="/C:/Program Files">
            <img src="windows-7-orb-icon-by-skyangels-on-deviantart-26-3047874742.png" style="width: 32px; height: 32px;">
            <span>Program Files</span>
          </div>
          <div class="folder" data-path="/C:/Users">
            <img src="windows-7-orb-icon-by-skyangels-on-deviantart-26-3047874742.png" style="width: 32px; height: 32px;">
            <span>Users</span>
          </div>
          <div class="file" draggable="true">
            <img src="imageres_54.ico" style="width: 32px; height: 32px;">
            <span>pagefile.sys</span>
          </div>
        `;
      } else if (path === '/C:/Windows') {
        explorer.innerHTML = `
          <div class="folder" data-path="/C:/Windows/System32">
            <img src="windows-7-orb-icon-by-skyangels-on-deviantart-26-3047874742.png" style="width: 32px; height: 32px;">
            <span>System32</span>
          </div>
          <div class="file">
            <img src="imageres_54.ico" style="width: 32px; height: 32px;">
            <span>explorer.exe</span>
          </div>
        `;
      } else if (path === '/Downloads') {
        explorer.innerHTML = `
          <div class="file executable" data-file="c00lz_os_update.exe">
            <img src="my-computer-icon-download_74052-2765179078.png" style="width: 32px; height: 32px;">
            <span>c00lz_os_update.exe</span>
          </div>
          <div class="file executable" data-file="totally_not_a_virus.exe">
            <img src="my-computer-icon-download_74052-2765179078.png" style="width: 32px; height: 32px;">
            <span>totally_not_a_virus.exe</span>
          </div>
          <div class="file" draggable="true">
            <img src="imageres_54.ico" style="width: 32px; height: 32px;">
            <span>notes.txt</span>
          </div>
        `;
      } else if (path === '/Documents') {
        explorer.innerHTML = `
          <div class="file" draggable="true">
            <img src="imageres_54.ico" style="width: 32px; height: 32px;">
            <span>Important Work.doc</span>
          </div>
          <div class="file" draggable="true">
            <img src="imageres_54.ico" style="width: 32px; height: 32px;">
            <span>Budget.xlsx</span>
          </div>
        `;
      } else {
        explorer.innerHTML = `
          <div class="empty-folder">
            <p>This folder is empty</p>
          </div>
        `;
      }

      // Reinitialize click handlers for executables
      const executables = explorer.querySelectorAll('.executable');
      executables.forEach(executable => {
        executable.addEventListener('dblclick', () => {
          const fileName = executable.dataset.file;
          const confirmRun = confirm(`Are you sure you want to run ${fileName}?`);
          if (confirmRun) {
            this.executeMalware(fileName);
          }
        });
      });
    };

    // Event listeners
    explorer.addEventListener('dblclick', (e) => {
      const folder = e.target.closest('.folder');
      if (folder) {
        navigateToFolder(folder.dataset.path);
      }
    });

    navBtn.addEventListener('click', () => {
      navigateToFolder('/');
    });

    // Initialize breadcrumb navigation
    const handlePathClick = (e) => {
      const path = e.target.dataset.path;
      if (path) {
        navigateToFolder(path);
      }
    };

    // Initial navigation
    navigateToFolder(currentPath);
  }

  executeMalware(virusName) {
    switch(virusName) {
      case 'c00lz_os_update.exe':
          // Create malware window
          const malwareWindow = this.windowManager.createWindow(
            'malware',
            'System Update',
            `<div class="malware-content">
              <h3>Installing Critical System Update</h3>
              <div class="progress-container">
                <div class="progress-bar"></div>
              </div>
              <div class="status-text">Downloading update files...</div>
            </div>`
          );

          const progressBar = malwareWindow.querySelector('.progress-bar');
          const statusText = malwareWindow.querySelector('.status-text');

          // Start glitch effects
          let glitchLevel = 0;
          const glitchInterval = setInterval(() => {
            glitchLevel += 0.1;
            
            // Add random CSS transforms to windows
            document.querySelectorAll('.window').forEach(window => {
              if (Math.random() < glitchLevel * 0.1) {
                window.style.transform = `
                  rotate(${(Math.random() - 0.5) * glitchLevel * 5}deg)
                  skew(${(Math.random() - 0.5) * glitchLevel * 3}deg)
                `;
              }
            });

            // Randomly change colors
            if (Math.random() < glitchLevel * 0.05) {
              document.body.style.filter = `
                hue-rotate(${Math.random() * 360}deg)
                contrast(${1 + Math.random() * glitchLevel})
              `;
            }
          }, 1000);

          setTimeout(() => {
            clearInterval(glitchInterval);
            this.initializeHandDrawnOS();
          }, 10000);
          break;

      case 'totally_not_a_virus.exe':
          // Create infinite popup chain
          const createPopup = () => {
            const x = Math.random() * (window.innerWidth - 200);
            const y = Math.random() * (window.innerHeight - 100);
            const popupWindow = this.windowManager.createWindow(
              'popup',
              'WARNING',
              `<div style="padding: 20px; text-align: center;">
                <h3 style="color: red;">⚠️ VIRUS DETECTED!</h3>
                <p>Click OK to fix your computer</p>
                <button class="metro-button" onclick="window.os.createMorePopups()">OK</button>
              </div>`
            );
            popupWindow.style.left = `${x}px`;
            popupWindow.style.top = `${y}px`;
          };

          window.os.createMorePopups = () => {
            for (let i = 0; i < 3; i++) {
              setTimeout(createPopup, i * 100);
            }
          };

          createPopup();
          break;

      case 'free_vbucks_generator.exe':
          // Create fake loading screen that never ends
          this.windowManager.createWindow(
            'vbucks',
            'V-Bucks Generator',
            `<div style="padding: 20px; text-align: center;">
              <h2>FREE V-BUCKS GENERATOR</h2>
              <div class="progress-container">
                <div class="progress-bar" style="width: 0%"></div>
              </div>
              <p class="status">Connecting to Fortnite servers...</p>
              <p style="color: red;">DO NOT CLOSE THIS WINDOW OR YOUR ACCOUNT WILL BE BANNED</p>
            </div>`
          );

          let progress = 0;
          const updateProgress = () => {
            progress = (progress + 0.1) % 100;
            const bar = document.querySelector('.vbucks .progress-bar');
            const status = document.querySelector('.vbucks .status');
            if (bar && status) {
              bar.style.width = `${progress}%`;
              const messages = [
                "Connecting to Fortnite servers...",
                "Generating V-Bucks...",
                "Bypassing security...",
                "Almost there...",
                "Just a bit longer...",
                "Processing request...",
                "Validating account...",
              ];
              status.textContent = messages[Math.floor(progress/15) % messages.length];
            }
          };
          setInterval(updateProgress, 100);
          break;

      case 'minecraft_premium_free.exe':
          // Create fake Minecraft launcher that plays annoying sounds
          const sounds = [
            'Roblox Music.mp3',
            'doom midi e1m1.wav',
            '05. Loonboon.mp3'
          ];
          
          this.windowManager.createWindow(
            'minecraft',
            'Minecraft Premium Launcher',
            `<div style="padding: 20px;">
              <h3>Minecraft Premium Launcher</h3>
              <div class="progress-container">
                <div class="progress-bar"></div>
              </div>
              <p>Downloading Minecraft Premium...</p>
              <p style="color: #0f0;">Crack successful! Launching game...</p>
            </div>`
          );

          // Play random sounds at random intervals
          const playRandomSound = () => {
            const audio = new Audio(sounds[Math.floor(Math.random() * sounds.length)]);
            audio.play();
            setTimeout(playRandomSound, Math.random() * 2000 + 500);
          };
          
          playRandomSound();
          break;

      case 'important_work_files.exe':
          // Scramble all windows content
          document.querySelectorAll('.window-content').forEach(content => {
            const text = content.innerText;
            content.innerText = text
              .split('')
              .map(char => Math.random() > 0.5 ? char : String.fromCharCode(Math.random() * 26 + 97))
              .join('');
          });
          break;

      case 'definitely_not_ransomware.exe':
          // Create ransomware screen
          document.body.innerHTML = `
            <div style="height: 100vh; background: #ff0000; color: white; padding: 50px; text-align: center; font-family: monospace;">
              🚨 YOUR FILES HAVE BEEN ENCRYPTED 🚨
              <p>Send 0.1 Bitcoin to unlock your files</p>
              <p>Time remaining: <span id="countdown">24:00:00</span></p>
              <button onclick="alert('Payment failed. Please try again.')">Pay Now</button>
            </div>
          `;

          // Add countdown timer
          let time = 24 * 60 * 60;
          setInterval(() => {
            time--;
            const hours = Math.floor(time / 3600);
            const minutes = Math.floor((time % 3600) / 60);
            const seconds = time % 60;
            document.getElementById('countdown').textContent = 
              `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
          }, 1000);
          break;

      case 'system_optimizer_pro.exe':
          // Create fake system optimization
          this.windowManager.createWindow(
            'optimizer',
            'System Optimizer Pro',
            `<div style="padding: 20px;">
              <h3>Optimizing System Performance...</h3>
              <div id="optimization-status"></div>
            </div>`
          );

          const actions = [
            "Deleting System32...",
            "Removing antivirus...",
            "Installing backdoors...",
            "Mining cryptocurrency...",
            "Sending personal data...",
            "Corrupting hard drive...",
          ];

          let actionIndex = 0;
          const updateStatus = () => {
            const status = document.getElementById('optimization-status');
            if (status) {
              status.innerHTML += `<p>${actions[actionIndex]}</p>`;
              actionIndex = (actionIndex + 1) % actions.length;
              status.scrollTop = status.scrollHeight;
            }
          };

          setInterval(updateStatus, 1000);
          break;
    }
  }

  async askClippy() {
    const clippyWindow = document.querySelector('.window[data-program="clippy"]');
    if (!clippyWindow) return;

    const input = clippyWindow.querySelector('#clippy-input');
    const chat = clippyWindow.querySelector('.clippy-chat');
    
    if (!input || !chat || !input.value.trim()) return;

    // Add user message
    const userMessage = document.createElement('div');
    userMessage.className = 'clippy-message user';
    userMessage.textContent = input.value;
    chat.appendChild(userMessage);
    
    // Add typing indicator
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'clippy-message assistant typing';
    typingIndicator.textContent = 'Clippy is thinking...';
    chat.appendChild(typingIndicator);
    
    // Clear input
    const userQuestion = input.value;
    input.value = '';
    
    // Scroll to bottom
    chat.scrollTop = chat.scrollHeight;

    try {
      // Get AI response
      const response = await fetch('/api/ai_completion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          prompt: `You are Clippy, the Microsoft Office Assistant. You are enthusiastic, helpful, and sometimes a bit overeager. 
          Respond to the user's question in a way that matches Clippy's personality. Keep responses relatively short and casual.
          
          User's question: "${userQuestion}"
          
          <typescript-interface>
          interface Response {
            reply: string;
          }
          </typescript-interface>
          
          <example>
          {
            "reply": "Hi there! I see you're trying to write a letter! Would you like help with that? I have lots of templates we could use! 📝"
          }
          </example>`,
          data: userQuestion
        })
      });

      const data = await response.json();
      
      // Remove typing indicator and add Clippy's response
      typingIndicator.remove();
      const clippyMessage = document.createElement('div');
      clippyMessage.className = 'clippy-message assistant';
      clippyMessage.textContent = data.reply;
      chat.appendChild(clippyMessage);
      
    } catch (error) {
      // Remove typing indicator and show error
      typingIndicator.remove();
      const errorMessage = document.createElement('div');
      errorMessage.className = 'clippy-message assistant';
      errorMessage.textContent = "Oops! Looks like I'm having trouble thinking right now. Maybe try asking again?";
      chat.appendChild(errorMessage);
    }
    
    // Scroll to bottom again
    chat.scrollTop = chat.scrollHeight;
  }

  initializeHandDrawnOS() {
    document.body.innerHTML = `
      <div style="
        height: 100vh;
        background: #fff;
        font-family: 'Comic Sans MS', cursive;
        position: relative;
        overflow: hidden;
      ">
        <div id="hand-drawn-desktop" class="hand-drawn-desktop">
          <div class="hand-drawn-icon" data-program="trash">
            <div class="hand-drawn-icon-img">🗑️</div>
            <span>Trash Can</span>
          </div>
          <div class="hand-drawn-icon" data-program="computer">
            <div class="hand-drawn-icon-img">💻</div>
            <span>My Computr</span>
          </div>
          <div class="hand-drawn-icon" data-program="internet">
            <div class="hand-drawn-icon-img">🌐</div>
            <span>Intrnet</span>
          </div>
        </div>
        <div class="hand-drawn-taskbar">
          <button class="hand-drawn-start">
            Strat
          </button>
          <div class="hand-drawn-time"></div>
        </div>
        <div id="hand-drawn-menu" class="hand-drawn-start-menu" style="display: none;">
          <div class="hand-drawn-menu-item" data-program="notepad">📝 NotePad</div>
          <div class="hand-drawn-menu-item" data-program="paint">🎨 Piant</div>
          <div class="hand-drawn-menu-item" data-program="calculator">🔢 Calcutator</div>
          <div class="hand-drawn-menu-item" data-program="shutdown">⭕ Shutdwon</div>
        </div>
      </div>
    `;

    // Add styles immediately after creating elements
    const style = document.createElement('style');
    style.textContent = `
      .hand-drawn-taskbar {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        height: 40px;
        background: #ddd;
        border-top: 3px solid #000;
        display: flex;
        align-items: center;
        padding: 0 10px;
        font-size: 20px;
      }
      .hand-drawn-start {
        background: #fff;
        border: 2px solid #000;
        padding: 5px 15px;
        font-family: 'Comic Sans MS', cursive;
        transform: rotate(-2deg);
        cursor: pointer;
      }
      .hand-drawn-start:hover {
        background: #f0f0f0;
        transform: rotate(2deg);
      }
      .hand-drawn-time {
        margin-left: auto;
        transform: rotate(2deg);
      }
      .hand-drawn-desktop {
        padding: 20px;
      }
      .hand-drawn-icon {
        background: rgba(255, 255, 255, 0.8);
        border: 2px solid #000;
        padding: 10px;
        margin: 10px;
        display: inline-block;
        transform: rotate(${Math.random() * 6 - 3}deg);
        cursor: pointer;
        text-align: center;
        transition: transform 0.2s;
      }
      .hand-drawn-icon:hover {
        transform: scale(1.1) rotate(${Math.random() * 10 - 5}deg);
      }
      .hand-drawn-icon-img {
        font-size: 32px;
        margin-bottom: 5px;
      }
      .hand-drawn-start-menu {
        position: fixed;
        bottom: 45px;
        left: 5px;
        background: white;
        border: 2px solid black;
        padding: 10px;
        transform: rotate(-1deg);
        min-width: 200px;
      }
      .hand-drawn-menu-item {
        padding: 8px;
        cursor: pointer;
        border: 1px solid transparent;
      }
      .hand-drawn-menu-item:hover {
        border: 1px solid black;
        background: #f0f0f0;
        transform: rotate(${Math.random() * 4 - 2}deg);
      }
      .hand-drawn-window {
        position: absolute;
        background: white;
        border: 3px solid black;
        padding: 10px;
        min-width: 300px;
        min-height: 200px;
        transform: rotate(${Math.random() * 2 - 1}deg);
      }
      .hand-drawn-titlebar {
        border-bottom: 2px solid black;
        padding: 5px;
        margin-bottom: 10px;
        display: flex;
        justify-content: space-between;
      }
      .hand-drawn-close {
        cursor: pointer;
        font-weight: bold;
      }
    `;
    document.head.appendChild(style);

    this.initializeHandDrawnEventListeners();
  }

  initializeHandDrawnEventListeners() {
    // Start menu toggle
    const startBtn = document.querySelector('.hand-drawn-start');
    const startMenu = document.querySelector('#hand-drawn-menu');
    
    if (startBtn && startMenu) {
      startBtn.addEventListener('click', () => {
        const isVisible = startMenu.style.display === 'block';
        startMenu.style.display = isVisible ? 'none' : 'block';
      });
    }

    // Desktop icons
    document.querySelectorAll('.hand-drawn-icon').forEach(icon => {
      icon.addEventListener('click', () => {
        const program = icon.dataset.program;
        if (program) {
          this.openHandDrawnProgram(program);
        }
      });
    });

    // Start menu items
    document.querySelectorAll('.hand-drawn-menu-item').forEach(item => {
      item.addEventListener('click', () => {
        const startMenu = document.querySelector('#hand-drawn-menu');
        if (startMenu) {
          startMenu.style.display = 'none';
        }
        const program = item.dataset.program;
        if (program) {
          this.openHandDrawnProgram(program);
        }
      });
    });

    // Update clock
    const updateClock = () => {
      const clockElement = document.querySelector('.hand-drawn-time');
      if (clockElement) {
        const now = new Date();
        clockElement.textContent = 
          `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
      }
    };
    updateClock();
    setInterval(updateClock, 1000);
  }

  createWindow(title, content) {
    const window = document.createElement('div');
    window.className = 'hand-drawn-window';
    window.style.left = `${50 + Math.random() * 100}px`;
    window.style.top = `${50 + Math.random() * 100}px`;
    
    window.innerHTML = `
      <div class="hand-drawn-titlebar">
        <span>${title}</span>
        <span class="hand-drawn-close">×</span>
      </div>
      <div class="hand-drawn-content">
        ${content}
      </div>
    `;

    // Make window draggable
    const titlebar = window.querySelector('.hand-drawn-titlebar');
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;

    titlebar.addEventListener('mousedown', (e) => {
      isDragging = true;
      initialX = e.clientX - xOffset;
      initialY = e.clientY - yOffset;
    });

    document.addEventListener('mousemove', (e) => {
      if (isDragging) {
        e.preventDefault();
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;
        xOffset = currentX;
        yOffset = currentY;
        window.style.transform = `translate(${currentX}px, ${currentY}px) rotate(${Math.random() * 2 - 1}deg)`;
      }
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
    });

    // Close button
    window.querySelector('.hand-drawn-close').addEventListener('click', () => {
      window.remove();
    });

    document.body.appendChild(window);
    return window;
  }

  openHandDrawnProgram(program) {
    switch(program) {
      case 'notepad':
        this.createWindow('NotePad', `
          <textarea style="width: 100%; height: 200px; font-family: 'Comic Sans MS'; border: 1px solid black; padding: 5px;">Dear Diary...</textarea>
        `);
        break;
      case 'paint':
        this.createWindow('Piant', `
          <canvas width="400" height="300" style="border: 1px solid black"></canvas>
          <div>Sorry, too lazy to draw! 🎨</div>
        `);
        break;
      case 'calculator':
        this.createWindow('Calcutator', `
          <div style="text-align: center;">
            <input type="text" style="width: 200px; margin-bottom: 10px; font-family: 'Comic Sans MS';">
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 5px;">
              ${[7,8,9,'+',4,5,6,'-',1,2,3,'×','C',0,'=','÷']
                .map(btn => `<button style="padding: 5px; font-family: 'Comic Sans MS'">${btn}</button>`)
                .join('')}
            </div>
          </div>
        `);
        break;
      case 'trash':
        this.createWindow('Trash Can', `
          <div style="text-align: center; padding: 20px;">
            🗑️ Wow, such empty!
          </div>
        `);
        break;
      case 'computer':
        this.createWindow('My Computr', `
          <div style="padding: 10px;">
            <div style="margin: 10px; border: 1px solid black; padding: 5px;">
              💾 Local Disk (C:) - 1337 MB free of 1338 MB
            </div>
            <div style="margin: 10px; border: 1px solid black; padding: 5px;">
              📁 My Documints
            </div>
            <div style="margin: 10px; border: 1px solid black; padding: 5px;">
              🖼️ My Picturs
            </div>
          </div>
        `);
        break;
      case 'internet':
        this.createWindow('Intrnet Exploror', `
          <div style="padding: 10px; text-align: center;">
            <div style="margin-bottom: 10px;">
              🌐 Welcome to the Intrnet!
            </div>
            <input type="text" value="https://" style="width: 80%; font-family: 'Comic Sans MS';">
            <div style="margin-top: 20px;">
              Error 404: Intrnet not found 😢
            </div>
          </div>
        `);
        break;
      case 'shutdown':
        if(confirm('Do you really want to shutdown your computr?')) {
          document.body.innerHTML = `
            <div style="height: 100vh; background: black; color: white; font-family: 'Comic Sans MS'; display: flex; align-items: center; justify-content: center; font-size: 24px;">
              It's now safe to turn off your computr
            </div>
          `;
        }
        break;
    }
  }

  changeCatGif(type) {
    const catGif = document.querySelector('#cat-gif');
    const caption = document.querySelector('#cat-caption');
    
    if (!catGif || !caption) return;

    switch(type) {
      case 'spinning-cat':
        catGif.src = 'spinning-cat.gif';
        caption.textContent = '🐱 Mesmerizing, isn\'t it? 🐱';
        break;
      case 'maxwell-cat':
        catGif.src = 'maxwell-cat.gif';
        caption.textContent = '🐱 Maxwell do be vibing tho 🐱';
        break;
      case 'happy-cat':
        catGif.src = 'happy-cat-cat.gif';
        caption.textContent = '🐱 Such a happy kitty! 🐱';
        break;
    }
  }

  initializeSettings(window) {
    const navButtons = window.querySelectorAll('.settings-nav button');
    const sections = window.querySelectorAll('.settings-section');
    
    // Navigation between sections
    navButtons.forEach(button => {
      button.addEventListener('click', () => {
        const section = button.dataset.section;
        navButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        sections.forEach(s => s.classList.remove('active'));
        window.querySelector(`#${section}`).classList.add('active');
      });
    });

    // Background selection
    const backgroundPreviews = window.querySelectorAll('.background-preview');
    backgroundPreviews.forEach(preview => {
      preview.addEventListener('click', () => {
        backgroundPreviews.forEach(p => p.classList.remove('selected'));
        preview.classList.add('selected');
        const bg = preview.dataset.bg;
        document.body.style.backgroundImage = `url('${bg}')`;
        localStorage.setItem('windows9_background', bg);
      });
    });

    // Window customization
    const titlebarColor = window.querySelector('#titlebar-color');
    const titleColor = window.querySelector('#title-color');
    const controlsColor = window.querySelector('#controls-color');
    const transparency = window.querySelector('#window-transparency');

    if (titlebarColor) {
      titlebarColor.addEventListener('input', (e) => {
        document.querySelectorAll('.window-titlebar').forEach(titlebar => {
          titlebar.style.background = e.target.value;
        });
        localStorage.setItem('windows9_titlebar_color', e.target.value);
      });
    }

    if (titleColor) {
      titleColor.addEventListener('input', (e) => {
        document.querySelectorAll('.window-title').forEach(title => {
          title.style.color = e.target.value;
        });
        localStorage.setItem('windows9_title_color', e.target.value);
      });
    }

    if (controlsColor) {
      controlsColor.addEventListener('input', (e) => {
        document.querySelectorAll('.window-control').forEach(control => {
          control.style.color = e.target.value;
        });
        localStorage.setItem('windows9_controls_color', e.target.value);
      });
    }

    if (transparency) {
      transparency.addEventListener('input', (e) => {
        document.querySelectorAll('.window').forEach(window => {
          window.style.background = `rgba(255, 255, 255, ${e.target.value / 100})`;
        });
        localStorage.setItem('windows9_window_transparency', e.target.value);
      });
    }

    // Load saved settings
    const savedTitlebarColor = localStorage.getItem('windows9_titlebar_color');
    const savedTitleColor = localStorage.getItem('windows9_title_color');
    const savedControlsColor = localStorage.getItem('windows9_controls_color');
    const savedTransparency = localStorage.getItem('windows9_window_transparency');

    if (savedTitlebarColor && titlebarColor) {
      titlebarColor.value = savedTitlebarColor;
      document.querySelectorAll('.window-titlebar').forEach(titlebar => {
        titlebar.style.background = savedTitlebarColor;
      });
    }

    if (savedTitleColor && titleColor) {
      titleColor.value = savedTitleColor;
      document.querySelectorAll('.window-title').forEach(title => {
        title.style.color = savedTitleColor;
      });
    }

    if (savedControlsColor && controlsColor) {
      controlsColor.value = savedControlsColor;
      document.querySelectorAll('.window-control').forEach(control => {
        control.style.color = savedControlsColor;
      });
    }

    if (savedTransparency && transparency) {
      transparency.value = savedTransparency;
      document.querySelectorAll('.window').forEach(window => {
        window.style.background = `rgba(255, 255, 255, ${savedTransparency / 100})`;
      });
    }
  }
}

// Initialize Windows 9
document.addEventListener('DOMContentLoaded', () => {
  console.log('Initializing Windows 9');
  window.os = new Windows9();
});
