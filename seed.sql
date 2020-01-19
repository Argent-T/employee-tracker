use ContentManagementSystem_db;
insert into department (name) values
("Sales"),
("Engineering"),
("Finance"),
("Legal")
;


insert into role (title, salary, department_id) values
("Sales Lead", 100000, 1),
("Salesperson", 80000, 1),
("Lead Engineer", 150000,2),
("Software Engineer", 120000,2),
("Accountant", 125000,3),
("Legal Team Lead", 250000, 4),
("Lawyer", 190000,4)
;


insert into employee (first_name, last_name, role_id) values
("Ashley", "Rodriguez", 3),
("Malia", "Brown",5),
("Sarah", "Lourd",6);

insert into employee (first_name, last_name, role_id, manager_id) values
("John", "Doe", 1, 1),
("Mike", "Chan",2,4),
("Kevin","Tupik",4,1),
("Tom","Allen",7,3);
