const connection = require('./connection')

connection.query("CREATE TABLE Student (id INT AUTO_INCREMENT, name varchar(255) NOT NULL, PRIMARY KEY(id))", (err, result) => {
    console.log(err);
    console.log(result);
})

connection.query("CREATE TABLE Course (id INT AUTO_INCREMENT, name varchar(255) NOT NULL, PRIMARY KEY(id))", (err, result) => {
    console.log(err);
    console.log(result);
})

connection.query("CREATE TABLE StudentCourse (id INT AUTO_INCREMENT, id_student INT NOT NULL, id_course INT NOT NULL, register_date DATE, PRIMARY KEY(id), FOREIGN KEY(id_student) REFERENCES Student(id), FOREIGN KEY(id_course) REFERENCES Course(id))", (err, result) => {
    console.log(err);
    console.log(result);
})

connection.query("INSERT INTO Student(name) VALUES (?)", ['Tuong'], (err, result) => {
    console.log("INSERT DONE");
    console.log(err);
    console.log(result);
})

connection.query("INSERT INTO Student(name) VALUES (?)", ['Huy'], (err, result) => {
    console.log("INSERT DONE");
    console.log(err);
    console.log(result);
})

connection.query("INSERT INTO Course(name) VALUES (?)", ['C++'], (err, result) => {
    console.log("INSERT DONE");
    console.log(err);
    console.log(result);
})

connection.query("INSERT INTO Course(name) VALUES (?)", ['Java'], (err, result) => {
    console.log("INSERT DONE");
    console.log(err);
    console.log(result);
})

connection.query("SELECT * FROM Student", (err, result) => {
    console.log(result);
})

connection.query("SELECT * FROM Course", (err, result) => {
    console.log(result);
})

connection.query("SELECT * FROM StudentCourse", (err, result) => {
    console.log(result);
})


connection.query("INSERT INTO StudentCourse(id_student, id_course, register_date) VALUES (?, ?, ?)", [1, 1, '2023-04-13'], (err, result) => {
    console.log("INSERT DONE");
    console.log(err);
    console.log(result);
})

connection.query("INSERT INTO StudentCourse(id_student, id_course, register_date) VALUES (?, ?, ?)", [1, 2, '2023-04-13'], (err, result) => {
    console.log("INSERT DONE");
    console.log(err);
    console.log(result);
})


// Lấy cả sv đã đk và tên khóa học đó
connection.query("SELECT Student.name, Course.name FROM Student INNER JOIN StudentCourse ON Student.id = StudentCourse.id_student INNER JOIN Course ON Course.id = StudentCourse.id_course", (err, result) => {
    console.log(result);
})


connection.query('select * from Student INNER JOIN (SELECT * FROM StudentCourse WHERE StudentCourse.id_course = 1) as NewTable ON Student.id = NewTable.id_student', (err, result) => {
    console.log(result);
})

//Lấy tất cả khóa học tưởng đã đk id = 1
connection.query('select * from Course INNER JOIN (SELECT * FROM StudentCourse WHERE StudentCourse.id_student = 1) as NewTable ON Course.id = NewTable.id_Course', (err, result) => {
    console.log(result);
})

//Lấy 3SV đăng ký khóa C++
connection.query('select * from Student INNER JOIN (SELECT * FROM StudentCourse WHERE StudentCourse.id_course = 1 ORDER BY register_date limit 3) as NewTable ON Student.id = NewTable.id_student', (err, result) => {
    console.log(result);
})

//Đếm số SV mỗi khóa học
connection.query('select Course.name, COUNT(StudentCourse.id_student) as student_count from StudentCourse INNER JOIN Course ON StudentCourse.id_course = Course.id GROUP BY Course.id',  (err, result) => {
    console.log(result);
})