const DB_NAME = "fileUploadDB";
const DB_VERSION = 1;
const STORE_NAME = "chunks";

const openDB = () => {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };

    request.onsuccess = (event: Event) => {
      resolve((event.target as IDBOpenDBRequest).result);
    };

    request.onerror = (event: Event) => {
      reject((event.target as IDBOpenDBRequest).error);
    };
  });
};

export const saveChunkInfo = async (hash: string, index: number) => {
  const db = await openDB();
  const transaction = db.transaction(STORE_NAME, "readwrite");
  const store = transaction.objectStore(STORE_NAME);
  store.put({ id: `${hash}-${index}`, hash, index });
};

export const getUploadedChunks = async (hash: string) => {
  const db = await openDB();
  const transaction = db.transaction(STORE_NAME, "readonly");
  const store = transaction.objectStore(STORE_NAME);
  const request = store.getAll();

  return new Promise<{ id: string; hash: string; index: number }[]>(
    (resolve, reject) => {
      request.onsuccess = (event: Event) => {
        const result = (event.target as IDBRequest).result as {
          id: string;
          hash: string;
          index: number;
        }[];
        resolve(result.filter((chunk) => chunk.hash === hash));
      };
      request.onerror = (event: Event) => {
        reject((event.target as IDBRequest).error);
      };
    }
  );
};

export const clearChunks = async (hash: string) => {
  const db = await openDB();
  const transaction = db.transaction(STORE_NAME, "readwrite");
  const store = transaction.objectStore(STORE_NAME);
  const request = store.getAll();

  request.onsuccess = (event: Event) => {
    const chunks = (event.target as IDBRequest).result as {
      id: string;
      hash: string;
      index: number;
    }[];
    chunks
      .filter((chunk) => chunk.hash === hash)
      .forEach((chunk) => {
        store.delete(chunk.id);
      });
  };
};
