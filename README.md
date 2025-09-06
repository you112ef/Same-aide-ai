<p align="center">
  <a href="https://x.com/OpenAnalystInc"><img src="https://img.shields.io/badge/twitter-follow/OpenAnalystInc?style=flat&logo=x&color=555" alt="X (Twitter)"></a>
  <a href="https://discord.gg/Nr9UTZub"><img src="https://img.shields.io/badge/Discord-OpenAnalyst-5865F2?style=flat&logo=discord&logoColor=white" alt="Discord"></a>
  <a href="https://www.reddit.com/r/OpenAnalyst/"><img src="https://img.shields.io/badge/Reddit-OpenAnalyst-FF4500?style=flat&logo=reddit&logoColor=white" alt="Reddit OpenAnalyst"></a>
  <a href="https://www.linkedin.com/in/openanalyst-inc/"><img src="https://img.shields.io/badge/LinkedIn-openanalyst--inc-0077B5?style=flat&logo=linkedin&logoColor=white" alt="LinkedIn"></a>
  <a href="https://www.facebook.com/people/OpenAnalyst/61579648771575/"><img src="https://img.shields.io/badge/Facebook-OpenAnalyst-1877F2?style=flat&logo=facebook&logoColor=white" alt="Facebook"></a>
  <a href="https://huggingface.co/OpenAnalyst"><img src="https://img.shields.io/badge/🤗%20Hugging%20Face-OpenAnalyst-yellow" alt="Hugging Face"></a>
  <a href="https://www.instagram.com/openanalyst/"><img src="https://img.shields.io/badge/Instagram-openanalyst-E4405F?style=flat&logo=instagram&logoColor=white" alt="Instagram"></a>
  <a href="https://www.kaggle.com/openanalystinc"><img src="https://img.shields.io/badge/Kaggle-openanalystinc-20BEFF?style=flat&logo=kaggle&logoColor=white" alt="Kaggle"></a>
  <a href="https://medium.com/@openanalystinc"><img src="https://img.shields.io/badge/Medium-OpenAnalyst-00AB6C?style=flat&logo=medium&logoColor=white" alt="Medium"></a>
  <a href="https://substack.com/@openanalyst"><img src="https://img.shields.io/badge/Substack-OpenAnalyst-FF6719?style=flat&logo=substack&logoColor=white" alt="Substack"></a>
</p>

# Welcome to OpenAnalyst-Editor

OpenAnalyst-Editor is the open-source AI-powered code editor alternative.

Use AI agents on your codebase, checkpoint and visualize changes, and bring any model or host locally. OpenAnalyst-Editor sends messages directly to providers without retaining your data.

This repo contains the full sourcecode for OpenAnalyst-Editor. If you're new, welcome!

🧭 [Website](https://openanalyst.com)


## OpenAnalyst-Editor

OpenAnalyst-Editor is a fork of the VSCode with AI-powered features and data analytics specialization. It combines the robust foundation of VSCode with advanced AI capabilities for modern development workflows.

OpenAnalyst-Editor provides comprehensive code editing, AI-assisted development, and specialized data analytics tools. It includes natural language code generation, automated refactoring, multi-mode AI operation, and seamless integration with the latest AI models.

OpenAnalyst-Editor is continuously updated with new AI features and improvements. It's available for Windows, macOS, and Linux, providing both web and desktop versions for maximum flexibility.

**OpenAnalyst is integrated directly into the editor**, making it a powerful AI-driven development tool that combines the robustness of VSCode with cutting-edge artificial intelligence capabilities.

## Contributing

There are many ways to contribute:

* Submit bugs and feature requests through our Socials
* Review source code changes and pull requests
* Help improve documentation and tutorials
* Contribute to AI model integrations and data analytics features
* Test new AI capabilities and provide feedback

For detailed contribution guidelines, see:

* How to build and run from source
* Development workflow and testing procedures
* AI integration best practices
* Code quality standards
* Pull request guidelines

## Reference

OpenAnalyst-Editor is a fork of the VSCode repository with integrated AI capabilities. For a guide to the codebase, see OPENANALYST_CODEBASE_GUIDE.

## Support

You can always reach us in our [Discord server](https://discord.gg/Nr9UTZub) or contact us via:
* [Twitter/X](https://x.com/OpenAnalystInc)
* [Reddit Community](https://www.reddit.com/r/OpenAnalyst/)

## Note

Work continues actively on OpenAnalyst-Editor as we integrate cutting-edge AI coding capabilities. Stay updated with new releases in our Discord channel and follow our social media for the latest developments.

## Key Features

- **AI Code Generation**: Generate code using natural language descriptions
- **Data Analytics Mode**: Specialized AI assistance for data science and analytics
- **Multi-Mode Operation**: Switch between Architect, Coder, Ask, and Debug modes
- **MCP Server Marketplace**: Extend capabilities with Model Context Protocol servers
- **Automated Refactoring**: AI-powered code improvement and optimization
- **Smart Git Integration**: Automated commit message generation
- **15+ AI Providers**: Support for Claude, GPT-4, Gemini, and more
- **Browser Automation**: Automate web testing and interaction tasks
- **Terminal Integration**: Execute commands safely with AI assistance

## Bundled Extensions

OpenAnalyst-Editor includes all standard VSCode extensions plus AI-enhanced features located in the [Open-Analyst](Open-Analyst) folder, providing advanced AI assistance for coding, data analytics, and automation tasks.

## Prerequisites

In order to download necessary tools, clone the repository, and install dependencies via npm, you need network access.

**Note:** You should clone into a path WITHOUT spaces to avoid issues when compiling native modules.

You'll need the following tools:

- **Git**
- **Node.JS**, x64 or ARM64, version >=20.x (also see .nvmrc)
  - If using nvm, consider updating your default node installation with `nvm alias default <VERSION>`
  - Windows: do not pick the option to install Windows Build Tools
  - Windows: If using nvm-windows on ARM64, you must postfix each command with arm64. Eg: `nvm install 22 arm64`
- **Python** (required for node-gyp; check the node-gyp readme for supported versions)
  - Make sure python can run from command line without error
  - Install setuptools package: `pip install setuptools`
- **C/C++ compiler tool chain** for your platform:

### Windows 10/11 (x64 or ARM64)
- Install Visual C++ Build Tools or Visual Studio Community Edition
- Minimum workload: "Desktop Development with C++"
- Additional components needed:
  - MSVC v143 - VS 2022 C++ x64/x86 Spectre-mitigated libs (Latest)
  - C++ ATL for latest build tools with Spectre Mitigations
  - C++ MFC for latest build tools with Spectre Mitigations
  - Windows on ARM only: Windows 10 SDK (10.0.20348.0)
- Run `npm config edit` and set `msvs_version=2022`

### macOS
- Xcode and Command Line Tools
- Run `xcode-select --install`

### Linux
- **Debian-based**: `sudo apt-get install build-essential g++ libx11-dev libxkbfile-dev libsecret-1-dev libkrb5-dev python-is-python3`
- **Red Hat-based**: `sudo yum groupinstall "Development Tools" && sudo yum install libX11-devel.x86_64 libxkbfile-devel.x86_64 libsecret-devel krb5-devel`

## Build and Run

### Getting the sources
```bash
git clone https://github.com/OpenAnalystInc/OpenAnalyst-Editor.git
cd OpenAnalyst-Editor
```

### Build
Install and build all dependencies:
```bash
npm install
```

Then choose one of:
- **From OpenAnalyst-Editor**: Open the OpenAnalyst-Editor folder and press `Ctrl+Shift+B` (macOS: `CMD+Shift+B`)
- **From Terminal**: Run `npm run watch`

The incremental builder will do an initial full build and display "Finished compilation" when ready.

### Run Commands

#### Desktop Version
**macOS and Linux:**
```bash
./scripts/code.sh
./scripts/code-cli.sh  # for CLI commands
```

**Windows:**
```bat
.\scripts\code.bat
.\scripts\code-cli.bat
```

#### Web Version
**macOS and Linux:**
```bash
./scripts/code-web.sh
```

**Windows:**
```bat
.\scripts\code-web.bat
```

**Note:** Also run `npm run watch-web` to build web bits for built-in extensions.

#### Code Server Web
**macOS and Linux:**
```bash
./scripts/code-server.sh --launch
```

**Windows:**
```bat
.\scripts\code-server.bat --launch
```

### Troubleshooting
- Clone into a path without spaces
- If issues persist, delete `~/.node-gyp` contents and run `git clean -xfd`
- Windows: Use x64 Native Tools Command Prompt for VS 2017/2022
- Linux: May hit ENOSPC error - check Common Questions for solutions

## Development Container

This repository includes development container support for quick setup and consistent development environments across platforms.

- **Docker/Codespace Requirements**: At least 4 Cores and 6 GB RAM (8 GB recommended)
- Use Remote-Containers: "Open Repository in Container..." command

## License

Licensed under the [Apache 2.0 License](LICENSE.txt) license.