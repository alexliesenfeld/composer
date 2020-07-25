<p align="center"><img height="128" src="https://github.com/alexliesenfeld/composer/raw/master/art/logo-256.png"></p>
<p align="center"><b>A productivity tool for iPlug 2 projects</b></p>
<p align="center">
    <a href="https://github.com/alexliesenfeld/composer/actions"><img src="https://github.com/alexliesenfeld/composer/workflows/Build/badge.svg?branch=master"></a>
    <a href="https://codecov.io/gh/alexliesenfeld/composer"><img src="https://codecov.io/gh/alexliesenfeld/composer/branch/master/graph/badge.svg"></a>
    <a href="https://deepscan.io/dashboard#view=project&tid=9446&pid=11977&bid=179978"><img src="https://deepscan.io/api/teams/9446/projects/11977/branches/179978/badge/grade.svg"></a>
</p>

# Composer
Composer is a productivity tool and project manager for iPlug 2. It helps you to decouple your custom code and resource 
files from IDE projects and its dependencies. It also manages some fundamental dependencies for you, so you 
do not need to download them or configure IDE projects yourself. Composer aims to reduce most of the configuration 
overhead that usually comes with dependency upgrades, such as iPlug itself or some audio SDKs. 

## Demo
<p align="center">
    <a href="https://raw.githubusercontent.com/alexliesenfeld/composer/master/art/screenshots/demogif.gif"><img width="100%" src="https://raw.githubusercontent.com/alexliesenfeld/composer/master/art/screenshots/demogif.gif"></a>
    <a href="https://raw.githubusercontent.com/alexliesenfeld/composer/master/art/screenshots/demogif.gif">Download Video</a>
</p>

## Installation
There are no prebuilt binaries yet, but you can build Composer yourself very easily.
The only prerequisite is having Node.js (version 10 or higher) installed on your machine. 
You can then build the binaries from the CLI as follows:

```sh
git clone https://github.com/alexliesenfeld/composer
cd composer
npm install
npm run prod
npm run build:win
```

When the build finishes, you can find an installer file named `Composer-<version>.exe` inside the `out` directory. 
Execute this file to install Composer. You can ignore the warnings raised during the build for now. 

*Note that only Windows and Visual Studio 2019 are supported at this moment*. However, macOS and Xcode support will 
follow soon (see feature roadmap).

## Getting Started

### Creating a Composer project
When you open Composer, a welcome page will be presented to you that will allow you to create a new project. Once a 
project has been created and automatically initialized, you will find the following file structure inside the project 
directory: 

```
-- Builds           # A directory that contains the generated IDE project files. 
-- Dependencies     # A directory that contains all dependencies, such as iPlug, VST SDK, etc.
-- Sources          # A directory that contains your custom source files.
-- Resources        # A directory that contains your custom resources, such as fonts and images.
  |-- Fonts         
  |-- Images
composer.json       # Composer project file
```

Please note that you should not modify the above files and directories manually. The entire project directory is 
managed by Composer. It is safe to add more files and directories to the project directory, however.

You probably want to add the `Build` and `Dependencies` directory to your `.gitignore` file. They are generated 
automatically by Composer when missing, so there is usually no need to store them in version control. It is also safe 
to remove them if you need to rebuild everything from scratch.

After project initialization, the `Source` and `Resources` directories will already contain some initial files 
based on the selected prototype (please see next section). It is safe to replace them with your own files if you wish. 
However, you should not copy the files to the project folder directly but use Composer to add the files to the project.

### Prototypes

To create IDE projects, Composer uses the two examples `IPlugEffect` and `IPlugInstrument` that are shipped with iPlug 
as prototypes. This means that Composer uses one of these example projects to generate the basement for all IDE 
project files. In fact, it uses the `duplicate.py` script shipped with iPlug as a part of the file generation 
process, but modifies the generated result to meet the users configuration. This allows Composer to keep up with 
the developments made in the iPlug repository and reduces maintenance overhead associated with version upgrades. 
Which prototype will be selected is based on the plugin type you choose. 

### Generated Configuration
Composer will allow you to change different aspects of your iPlug project in the configuration section. This section 
more or less maps the `config.h` file in regular iPlug projects. Please note that `config.h` is automatically generated
each time you start your IDE from within Composer. It is therefore not part of the `Sources` directory. As all other 
generated files, you will find `config.h` inside the `generated` filter (Visual Studio) inside your IDE.  

## Feature Roadmap
At the moment, this repository contains a very early version of the project. The majority of features is still 
missing. It is planned to implement the following features in the future (in presented order):

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
- [ ] CLI application
- [ ] Building Installers
- [ ] AAX support 
- [ ] iOS support

## Limitations
iPlug 2 is a complex framework that is still under heavy development. To limit complexity, Composer is a very 
opinionated tool with a reduced set of supported iPlug functionality. As such, it may not meet the requirements 
for every project. It's planned to provide most important functionality based on what is commonly perceived as 
"best practice" and build on that. If you think an important feature is missing, please consider creating an issue.  

# License
`Composer` is free software: you can redistribute it and/or modify it under the terms of the MIT Public License.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied 
warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the MIT Public License for more details.

