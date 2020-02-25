import createLocalStorageHook from './core';
import storage from 'local-storage-fallback'

export default createLocalStorageHook(storage as any)
