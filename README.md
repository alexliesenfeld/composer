![Build](https://github.com/alexliesenfeld/composer/workflows/Build/badge.svg?branch=master)

# Composer
Composer is a productivity tool for iPlug 2 projects. It helps you organize and decouple iPlug projects more efficiently, so that your files and other resources are cleanly separated from iPlug and its dependencies. Composer also manages dependencies for you, so you do not need to download or  configure IDE projects yourself. Files and project configuration are automatically kept in-sync across all IDEs and operating systems. 

## Build executable
There are no prebuilt binaries yet, but you can build the project very easily yourself.
To build it, you need to have NodeJS (version 10 or higher) installed on your machine. You can build the binaries as follows:

```sh
git clone https://github.com/alexliesenfeld/composer
cd composer
npm install
npm run prod 
npm run build:win 
```
You can ignore the warnings that are raised during the build. When the build finishes, you can find an Installer file named `Composer-<version>.exe` inside the `out` directory. Execute this file to install Composer.

## Getting Started

### Project directory structure 
If you create a new composer project, you will see the following file structure inside the project directory: 

```
-- Builds           # Directory that contains the generated IDE project files 
-- Dependencies     # Directory that contains all dependencies, such as iPlug, VST SDK, etc.
-- Sources          # Directory that contains your source files
-- Resources        # Directory that contains your resources, such as fonts and images.
  |-- Fonts         
  |-- Images
composer.json       # Composer project file
```
Composer stores all project related files inside this directory. Please note that, ideally, you should not modify the project directory manually. The entire directory is managed by Composer for you. 

You probably want to add the `Builds` and the `Dependencies` directory to your `.gitignore` file. They are generated automatically by Composer when missing, so there is usually no need to store them in version control.

## Feature Roadmap
This project is actively in development. The majority of features is still missing. Currently, the following features are scoped for development and will be developed in the following order:

- [x] Windows support
- [x] Visual Studio 2019 support
- [x] VST3 support
- [x] Standalone App support
- [ ] macOS support
- [ ] XCode support
- [ ] AU support
- [ ] Custom build arguments configuration
- [ ] Graphics backend configuration
- [ ] Custom dependency sources
- [ ] VST2 support
- [ ] Composer console application
- [ ] Building Installers
- [ ] AAX support 
- [ ] iOS support

## Limitations
iPlug 2 is a complex framework that is still under heavy development. It comes packed with a lot of features and often provides multiple alternative solutions for a problem. To limit complexity, Composer is a very opinionated tool with a reduced set of supported iPlug functionality. As such, it may not meet the requirements for every project. It will try to provide functionality based on what is commonly perceived as "best practice", however. 

