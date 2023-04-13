const connection = require('../database/connection')

connection.query("CREATE TABLE User (id INT AUTO_INCREMENT, fullname varchar(255) NOT NULL, gender boolean, age INT NOT NULL, PRIMARY KEY(id))", (err, result) => {
    console.log(err);
    console.log(result);
})

connection.query("INSERT INTO User(fullname, gender, age) VALUES (?, ?, ?, ?)", ['Nguyen Huy Tuong', true, 18], (err, result) => {
    console.log("INSERT DONE");
    console.log(err);
    console.log(result);
})

connection.query("INSERT INTO User(fullname, gender, age) VALUES (?, ?, ?)", ['Nguyen Thi Tuong', false, 15], (err, result) => {
    console.log("INSERT DONE");
    console.log(err);
    console.log(result);
})

connection.query("SELECT * FROM User", (err, result) => {
    console.log(err);
    console.log(result);
})

connection.query("SELECT * FROM User WHERE id = ?" , [1], (err, result) => {
    console.log(err);
    console.log(result);
})

connection.query("UPDATE User SET fullname = ? WHERE id = ?", ['Do Thi Hoa', 3], (err, result) => {
    console.log("UPDATE Done");
    console.log(err);
    console.log(result);
})

connection.query("DELETE FROM User WHERE id = ?", [3], (err, result) => {
    console.log("DELETE Done");
    console.log(err);
})
