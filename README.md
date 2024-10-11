# CyberWeb GUI

## Overview

**CyberWeb GUI** is a graphical user interface (GUI) built for the **CyberWeb (HttpsProxy)** project, which can be found [here](https://github.com/abdelfetah18/cyber-web). This project provides an intuitive, user-friendly interface to interact with CyberWeb, allowing users to easily manage and configure the HttpsProxy functionality. It is implemented using **ElectronJS** and **TypeScript**, and leverages **Network Sockets** to communicate with the underlying CyberWeb backend via a simple **Inter-Process Communication (IPC)**.

### Dependencies

- **ElectronJS**: To create the desktop application.
- **TypeScript**: For building the codebase with static typing.
- **Node.js**: Required to run the ElectronJS application.
- **CyberWeb (HttpsProxy)**: The backend service, which must be running for the GUI to communicate with it.

## Installation

1. Clone the **CyberWeb GUI** repository:
    ```bash
    git clone https://github.com/abdelfetah18/cyber-web-gui
    cd cyber-web-gui
    ```

2. Install the required dependencies:
    ```bash
    npm install
    ```

3. Ensure that the **CyberWeb (HttpsProxy)** backend is set up and running. You can find instructions for that in the [CyberWeb repository](https://github.com/abdelfetah18/cyber-web).

4. Start the Electron application:
    ```bash
    npm start
    ```

## Images from the app

![home](https://raw.githubusercontent.com/abdelfetah18/cyber-web-gui/main/ui_images/home.png)
