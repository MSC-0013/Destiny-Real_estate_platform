// IndexedDB utility for offline support and data persistence
const DB_NAME = 'PadmayaHomeDB';
const DB_VERSION = 1;

export interface DBStore {
  name: string;
  keyPath: string;
  indexes?: { name: string; keyPath: string; unique?: boolean }[];
}

const stores: DBStore[] = [
  { name: 'users', keyPath: 'id' },
  { name: 'properties', keyPath: 'id' },
  { name: 'orders', keyPath: 'id' },
  { name: 'construction', keyPath: 'id' },
  { name: 'sessions', keyPath: 'id' },
  { name: 'savedSearches', keyPath: 'id' },
  { name: 'favorites', keyPath: 'id' },
  { name: 'analytics', keyPath: 'id' },
  { name: 'cache', keyPath: 'key' },
];

let dbInstance: IDBDatabase | null = null;

export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (dbInstance) {
      resolve(dbInstance);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      dbInstance = request.result;
      resolve(dbInstance);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      stores.forEach((store) => {
        if (!db.objectStoreNames.contains(store.name)) {
          const objectStore = db.createObjectStore(store.name, { keyPath: store.keyPath });
          
          if (store.indexes) {
            store.indexes.forEach((index) => {
              objectStore.createIndex(index.name, index.keyPath, { unique: index.unique || false });
            });
          }
        }
      });
    };
  });
};

export const saveToIndexedDB = async <T>(storeName: string, data: T): Promise<void> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.put(data);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const getFromIndexedDB = async <T>(storeName: string, key: string): Promise<T | null> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.get(key);

    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
};

export const getAllFromIndexedDB = async <T>(storeName: string): Promise<T[]> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
};

export const deleteFromIndexedDB = async (storeName: string, key: string): Promise<void> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.delete(key);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const clearStore = async (storeName: string): Promise<void> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.clear();

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

// Session persistence
export const saveSession = async (session: any) => {
  await saveToIndexedDB('sessions', { id: 'current', ...session, timestamp: Date.now() });
  localStorage.setItem('sessionTimestamp', Date.now().toString());
};

export const getSession = async () => {
  const session = await getFromIndexedDB<any>('sessions', 'current');
  if (!session) return null;
  
  // Check if session is still valid (24 hours)
  const timestamp = session.timestamp || 0;
  const now = Date.now();
  if (now - timestamp > 24 * 60 * 60 * 1000) {
    await deleteFromIndexedDB('sessions', 'current');
    return null;
  }
  
  return session;
};

export const clearSession = async () => {
  await deleteFromIndexedDB('sessions', 'current');
  localStorage.removeItem('sessionTimestamp');
};