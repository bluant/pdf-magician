# PDF magician

This is a desktop application built with Electron for Windows, designed to streamline the process of batch editing PDF files. It allows users to select a folder containing PDF files and automatically adds the folder's name to the top left corner of each PDF. The modified PDFs are then saved in a "processed" subfolder within the original folder. This application leverages the powerful `pdf-lib` library to manipulate PDF documents efficiently.

## Features

- Batch process multiple PDF files
- Automatically add folder names to PDFs
- Save edited PDFs in a separate "processed" folder
- Easy to use graphical user interface

## Installation

To install and run this application, follow these steps:

### Prerequisites

- Ensure you have [Node.js](https://nodejs.org/) and [Yarn](https://yarnpkg.com/) installed on your Windows machine.

### Steps

1. Clone the repository to your local machine:
   ```shell
   git clone https://github.com/bluant/pdf-magician.git
   cd pdf-magician
2. Install the dependencies:
    ```shell
   yarn install
3. Create windows installer:
   ```shell
   yarn package
After building, you can find the application executable in the dist folder.

4. Alternatively, to start the application without building, you can run:
   ```shell
   yarn start

### Usage
1. Launch the Application: Open the application using the executable in the release folder or start it with yarn start.

2. Select PDF Folder: Click on the "Select Folder" button and choose the folder containing your PDF files.

3. Process PDFs: The application will automatically process each PDF file, adding the folder's name to the top left corner of every page. Processed PDFs will be saved in a new "processed" folder within the original directory.

4. View Processed PDFs: Navigate to the "processed" folder to view your edited PDFs.

### Built With
[Electron](https://www.electronjs.org/) - For creating cross-platform desktop applications with JavaScript, HTML, and CSS.

[pdf-lib](https://www.npmjs.com/package/pdf-lib) - For editing PDF documents.

### Contributing
Feel free to fork this repository and submit pull requests to contribute to the development of this application.

### License
This project is licensed under the MIT License - see the LICENSE.md file for details.