import Dexie from 'dexie';

const db = new Dexie( 'DataStorageDB' );

db.version( 1 ).stores( {
    data: 'key, data, filename, selected'
} );

export default db;