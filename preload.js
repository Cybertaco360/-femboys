// Minimal preload for future IPC expansion
// Expose a safe API surface if needed later.
const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('PAD', {
  version: '0.1.0'
});
