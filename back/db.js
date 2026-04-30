import mysql from 'mysql2'
 
export const db = mysql.createConnection({
  host: "localhost",
  port: 3307,
  user: "root",
  database: "nogotochki_db",
  password: "1234"
});

 db.connect(function(err){
    if (err) {
      return console.error("Ошибка: " + err.message);
    }
    else{
      console.log("Подключение к серверу MySQL успешно установлено");
    }
 });