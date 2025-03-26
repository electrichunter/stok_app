 
import mysql from "mysql2/promise";

const db = mysql.createConnection({
    host: 'localhost',     // Veritabanı sunucusunun adresi
    user: 'root',          // Veritabanı kullanıcı adı
    password: '1User1234', // Veritabanı şifresi
    database: 'stok',       // Veritabanı adı
    waitForConnections: true,
    connectionLimit: 10, // Bağlantı havuzunun limitini ayarlayın
    queueLimit: 0
  });

// Bağlantıyı oluşturup döndüren fonksiyon
export async function getDBConnection() {
    return db;
}