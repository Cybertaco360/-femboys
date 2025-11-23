import { contextBridge } from 'electron';

contextBridge.exposeInMainWorld('PAD', {
  version: '0.2.0'
});
