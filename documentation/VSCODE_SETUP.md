# 💻 Visual Studio Code Setup Guide

**Professional VSCode Configuration for External Review Repository**  
**Last Updated:** 2025-09-29

---

## 🚀 **QUICK START**

### **One-Click Setup Options**

Choose the method that works best for you:

#### **Option 1: Desktop VSCode (Recommended)**
Click this link to clone and open the repository in VSCode Desktop:

```
vscode://vscode.git/clone?url=https://github.com/Installsure/External-Review-Repository
```

**Direct Link:** [Open in VSCode Desktop](vscode://vscode.git/clone?url=https://github.com/Installsure/External-Review-Repository)

#### **Option 2: GitHub Codespaces (Cloud Development)**
Launch a fully configured cloud development environment:

**Direct Link:** [Open in GitHub Codespaces](https://github.com/Installsure/External-Review-Repository/codespaces)

**Benefits:**
- No local setup required
- Pre-configured with all dependencies
- Accessible from any device
- 60 hours free per month for personal accounts

#### **Option 3: vscode.dev (Browser-based)**
Open the repository in a browser-based VSCode editor:

**Direct Link:** [Open in vscode.dev](https://vscode.dev/github/Installsure/External-Review-Repository)

**Note:** Limited functionality compared to desktop VSCode

---

## 📦 **MANUAL SETUP**

### **Step 1: Install VSCode**
Download and install Visual Studio Code:
- **Website:** https://code.visualstudio.com/
- **Windows:** Download .exe installer
- **macOS:** Download .dmg or `brew install --cask visual-studio-code`
- **Linux:** Download .deb/.rpm or use snap: `snap install code --classic`

### **Step 2: Clone Repository**
```bash
# Clone the repository
git clone https://github.com/Installsure/External-Review-Repository.git
cd External-Review-Repository
```

### **Step 3: Open Workspace**
```bash
# Open the multi-root workspace in VSCode
code external-review-repository.code-workspace
```

### **Step 4: Install Recommended Extensions**
When you open the workspace, VSCode will show a notification asking if you want to install recommended extensions. Click **"Install All"**.

**Alternatively, install manually:**
1. Press `Ctrl+Shift+X` (or `Cmd+Shift+X` on Mac)
2. Search for the extensions listed below
3. Click "Install" for each

---

## 🔌 **RECOMMENDED EXTENSIONS**

### **Essential Extensions**

#### **Language Support**
- **[ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)** (`dbaeumer.vscode-eslint`)
  - JavaScript/TypeScript linting
  - Auto-fix on save

- **[Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)** (`esbenp.prettier-vscode`)
  - Code formatter
  - Consistent code style

- **[Python](https://marketplace.visualstudio.com/items?itemName=ms-python.python)** (`ms-python.python`)
  - Python language support
  - IntelliSense and debugging

- **[Pylance](https://marketplace.visualstudio.com/items?itemName=ms-python.vscode-pylance)** (`ms-python.vscode-pylance`)
  - Fast Python language server
  - Type checking

#### **Framework Support**
- **[Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)** (`bradlc.vscode-tailwindcss`)
  - Tailwind class autocomplete
  - Hover preview

- **[TypeScript](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-typescript-next)** (`ms-vscode.vscode-typescript-next`)
  - Latest TypeScript features

#### **Testing**
- **[Vitest](https://marketplace.visualstudio.com/items?itemName=vitest.explorer)** (`vitest.explorer`)
  - Run and debug Vitest tests
  - Test explorer integration

- **[Playwright](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright)** (`ms-playwright.playwright`)
  - E2E test support
  - Record and run tests

#### **Git Integration**
- **[GitLens](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens)** (`eamodio.gitlens`)
  - Enhanced Git capabilities
  - Blame annotations

- **[GitHub Pull Requests](https://marketplace.visualstudio.com/items?itemName=github.vscode-pull-request-github)** (`github.vscode-pull-request-github`)
  - Review PRs in VSCode
  - Manage issues

### **Productivity Extensions**
- **[Live Server](https://marketplace.visualstudio.com/items?itemName=ms-vscode.live-server)** (`ms-vscode.live-server`)
- **[EditorConfig](https://marketplace.visualstudio.com/items?itemName=editorconfig.editorconfig)** (`editorconfig.editorconfig`)
- **[Code Spell Checker](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker)** (`streetsidesoftware.code-spell-checker`)
- **[Error Lens](https://marketplace.visualstudio.com/items?itemName=usernamehw.errorlens)** (`usernamehw.errorlens`)
- **[Path Intellisense](https://marketplace.visualstudio.com/items?itemName=christian-kohler.path-intellisense)** (`christian-kohler.path-intellisense`)
- **[Auto Rename Tag](https://marketplace.visualstudio.com/items?itemName=formulahendry.auto-rename-tag)** (`formulahendry.auto-rename-tag`)
- **[Pretty TypeScript Errors](https://marketplace.visualstudio.com/items?itemName=yoavbls.pretty-ts-errors)** (`yoavbls.pretty-ts-errors`)

### **Documentation**
- **[Markdown All in One](https://marketplace.visualstudio.com/items?itemName=yzhang.markdown-all-in-one)** (`yzhang.markdown-all-in-one`)
- **[Markdown Preview GitHub](https://marketplace.visualstudio.com/items?itemName=bierner.markdown-preview-github-styles)** (`bierner.markdown-preview-github-styles`)

---

## ⚙️ **WORKSPACE CONFIGURATION**

### **Multi-Root Workspace Structure**

The repository uses a multi-root workspace for better organization:

```
external-review-repository.code-workspace
├── 🏠 Root                     # Repository root
├── 📦 InstallSure Frontend     # React + TypeScript + Vite
├── 🐍 InstallSure Backend      # Python + FastAPI
├── 📊 Demo Dashboard           # React + Vite
├── 🎬 FF4U                     # React + Vite
├── 👁️ RedEye                   # React + Vite
├── ⚡ ZeroStack                 # React + Vite
├── 👋 Hello                    # React + Vite
├── 🤖 Avatar                   # React + Vite
└── 📚 Documentation            # Markdown docs
```

**Benefits:**
- Each folder has its own terminal
- Separate search scope per folder
- Organized file explorer
- Context-aware IntelliSense

### **Settings Overview**

The workspace includes pre-configured settings in `.vscode/settings.json`:

- **Auto-format on save** with Prettier
- **Auto-fix ESLint** errors on save
- **TypeScript** workspace version
- **Python** virtual environment detection
- **Tailwind CSS** IntelliSense
- **Git** auto-fetch
- **File exclusions** for cleaner explorer

---

## 🐛 **DEBUGGING**

### **Available Debug Configurations**

Press `F5` or go to **Run and Debug** (`Ctrl+Shift+D`) to access:

#### **Frontend Debugging**
- **InstallSure Frontend (Chrome)** - Debug React app in Chrome
- **Demo Dashboard (Chrome)**
- **FF4U (Chrome)**
- **RedEye (Chrome)**
- **ZeroStack (Chrome)**
- **Hello (Chrome)**
- **Avatar (Chrome)**

#### **Backend Debugging**
- **InstallSure Backend (Python)** - Debug FastAPI with breakpoints
- **Python: Current File** - Debug any Python file

#### **Full Stack Debugging**
- **InstallSure Full Stack** - Debug both frontend and backend simultaneously

### **How to Debug**

1. **Set Breakpoints:**
   - Click in the left margin of a line to add a red dot
   - Or press `F9` on the line you want to pause at

2. **Start Debugging:**
   - Press `F5` or click the green play button
   - Select the configuration (e.g., "InstallSure Frontend (Chrome)")

3. **Debug Controls:**
   - `F5` - Continue
   - `F10` - Step over
   - `F11` - Step into
   - `Shift+F11` - Step out
   - `Ctrl+Shift+F5` - Restart
   - `Shift+F5` - Stop

4. **Inspect Variables:**
   - Hover over variables to see values
   - Use the Variables pane in the sidebar
   - Add expressions to Watch pane

---

## 🚀 **TASKS**

### **Running Tasks**

Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac) and type **"Tasks: Run Task"**

**Available Tasks:**

#### **Setup & Installation**
- **Install All Dependencies** - Run `npm install` in root

#### **Development**
- **Start All Applications** - Launch all apps with one command
- **InstallSure Frontend - Dev** - Start frontend dev server
- **InstallSure Backend - Dev** - Start Python backend
- **Demo Dashboard - Dev**
- **FF4U - Dev**
- **RedEye - Dev**
- **ZeroStack - Dev**
- **Hello - Dev**
- **Avatar - Dev**

#### **Testing**
- **Run All Tests** - Execute complete test suite

#### **Code Quality**
- **TypeScript: Check All** - Type checking across all projects
- **ESLint: Fix All** - Lint and auto-fix issues
- **Prettier: Format All** - Format all code files

### **Task Shortcuts**

- `Ctrl+Shift+B` - Run default build task
- `Ctrl+Shift+T` - Run test task

---

## 🎯 **QUICK COMMANDS**

### **Essential Keyboard Shortcuts**

#### **Navigation**
- `Ctrl+P` - Quick file open
- `Ctrl+Shift+P` - Command palette
- `Ctrl+Shift+F` - Search across files
- `Ctrl+G` - Go to line
- `Ctrl+T` - Go to symbol in workspace
- `F12` - Go to definition
- `Alt+F12` - Peek definition

#### **Editing**
- `Ctrl+/` - Toggle comment
- `Alt+Shift+F` - Format document
- `Ctrl+D` - Select next occurrence
- `Alt+Click` - Multi-cursor
- `Ctrl+Shift+L` - Select all occurrences
- `Alt+Up/Down` - Move line up/down

#### **Development**
- `F5` - Start debugging
- `Ctrl+Shift+B` - Run build task
- `Ctrl+`` ` - Toggle terminal
- `Ctrl+Shift+`` ` - New terminal

#### **Git**
- `Ctrl+Shift+G` - Open source control
- `Ctrl+Enter` - Commit (in source control)

---

## 🔄 **WORKFLOW TIPS**

### **Recommended Workflow**

1. **Open Workspace:**
   ```bash
   code external-review-repository.code-workspace
   ```

2. **Install Extensions:**
   - Click "Install All" when prompted

3. **Run Preflight Check:**
   - Open terminal: ``Ctrl+` ``
   - Run: `.\tools\preflight-check.ps1`

4. **Install Dependencies:**
   - Press `Ctrl+Shift+P`
   - Run task: "Install All Dependencies"

5. **Start Development:**
   - Press `Ctrl+Shift+P`
   - Run task: "Start All Applications"
   - Or start individual apps with their respective tasks

6. **Enable Auto-Save:**
   - Go to File → Auto Save (or `Ctrl+Shift+P` → "File: Toggle Auto Save")

### **Multi-Root Workspace Tips**

- **Switch between folders:** Click folder names in the Explorer
- **Search in specific folder:** Right-click folder → "Find in Folder..."
- **Open terminal in folder:** Right-click folder → "Open in Integrated Terminal"
- **Folder-specific settings:** Each folder can have its own `.vscode/settings.json`

### **Git Integration**

- **View changes:** Click Source Control icon or `Ctrl+Shift+G`
- **Stage files:** Click `+` next to file
- **Commit:** Type message and press `Ctrl+Enter`
- **View history:** Click GitLens icon or use GitLens commands
- **Create PR:** Use GitHub Pull Requests extension

---

## 🎨 **CUSTOMIZATION**

### **User Settings**

Press `Ctrl+,` to open settings, then click the **{}** icon for JSON:

```json
{
  // Your personal preferences
  "editor.fontSize": 14,
  "editor.fontFamily": "Fira Code, Cascadia Code, Consolas",
  "editor.fontLigatures": true,
  "workbench.colorTheme": "GitHub Dark Default",
  "workbench.iconTheme": "material-icon-theme"
}
```

### **Themes**

Popular themes for this repository:
- **GitHub Dark Default** (built-in)
- **One Dark Pro**
- **Dracula Official**
- **Night Owl**
- **Material Theme**

Install: `Ctrl+Shift+X` → Search for theme → Install

---

## 🆘 **TROUBLESHOOTING**

### **Extensions Not Working**

1. **Reload Window:**
   - `Ctrl+Shift+P` → "Developer: Reload Window"

2. **Check Extension Status:**
   - `Ctrl+Shift+X` → Click on extension → Check if enabled

3. **Clear Extension Cache:**
   ```bash
   # Windows
   rm -rf $env:USERPROFILE\.vscode\extensions
   
   # macOS/Linux
   rm -rf ~/.vscode/extensions
   ```

### **TypeScript Issues**

1. **Use Workspace TypeScript:**
   - `Ctrl+Shift+P` → "TypeScript: Select TypeScript Version"
   - Choose "Use Workspace Version"

2. **Restart TS Server:**
   - `Ctrl+Shift+P` → "TypeScript: Restart TS Server"

### **ESLint Not Working**

1. **Check ESLint Output:**
   - View → Output
   - Select "ESLint" from dropdown

2. **Disable/Enable ESLint:**
   - `Ctrl+Shift+P` → "ESLint: Disable/Enable ESLint"

### **Python Environment Issues**

1. **Select Correct Interpreter:**
   - `Ctrl+Shift+P` → "Python: Select Interpreter"
   - Choose the venv in `applications/installsure/backend/venv`

2. **Recreate Virtual Environment:**
   ```bash
   cd applications/installsure/backend
   rm -rf venv
   python -m venv venv
   source venv/bin/activate  # or venv\Scripts\activate on Windows
   pip install -r requirements.txt
   ```

### **Slow Performance**

1. **Exclude Folders:**
   - Add to `.vscode/settings.json`:
     ```json
     {
       "files.watcherExclude": {
         "**/node_modules/**": true,
         "**/dist/**": true,
         "**/.venv/**": true
       }
     }
     ```

2. **Disable Unused Extensions:**
   - `Ctrl+Shift+X` → Right-click extension → Disable

---

## 📚 **RESOURCES**

### **VSCode Documentation**
- **Official Docs:** https://code.visualstudio.com/docs
- **Tips & Tricks:** https://code.visualstudio.com/docs/getstarted/tips-and-tricks
- **Keyboard Shortcuts:** https://code.visualstudio.com/shortcuts/keyboard-shortcuts-windows.pdf

### **Repository Documentation**
- [Setup Guide](SETUP_GUIDE.md)
- [API Documentation](API_DOCUMENTATION.md)
- [Troubleshooting Guide](TROUBLESHOOTING.md)
- [Contributing Guide](../CONTRIBUTING.md)

### **Community**
- **VSCode Discord:** https://aka.ms/vscode-discord
- **GitHub Discussions:** https://github.com/Installsure/External-Review-Repository/discussions
- **Stack Overflow:** Tag questions with `visual-studio-code`

---

## 🎓 **LEARNING RESOURCES**

### **Video Tutorials**
- **VSCode for JavaScript/TypeScript:** https://code.visualstudio.com/docs/nodejs/reactjs-tutorial
- **VSCode for Python:** https://code.visualstudio.com/docs/python/python-tutorial
- **Debugging in VSCode:** https://code.visualstudio.com/docs/editor/debugging

### **Interactive Courses**
- **VSCode Can Do That!** https://vscodecandothat.com/
- **Learn VSCode:** https://www.linkedin.com/learning/learning-visual-studio-code

---

**Happy Coding! 🚀**

**Need Help?**
- Check [Troubleshooting Guide](TROUBLESHOOTING.md)
- Open an issue on GitHub
- Contact repository maintainers
