// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

contextBridge.exposeInMainWorld('electron', {
    ipcRenderer: {
        on: (channel: string, func: (...args: any[]) => void) => {
            ipcRenderer.on(channel, (event: IpcRendererEvent, ...args: any[]) => func(...args));
        }
    }
});
