drop database if exists ContentManagementSystem_db;
create database ContentManagementSystem_db;
use ContentManagementSystem_db;

create table department (
id int primary key auto_increment not null,
name varchar(30) not null
);

create table role(
id int primary key auto_increment not null,
title varchar(30) not null,
salary decimal not null,
department_id int not null
);

create table employee(
id int primary key auto_increment not null,
first_name varchar(30) not null,
last_name varchar(30) not null,
role_id int not null,
manager_id int
);

insert into department (name) values
("Sales"),
("Engineering"),
("Finance"),
("Legal")
;
select * from department;

insert into role (title, salary, department_id) values
("Sales Lead", 100000, 1),
("Salesperson", 80000, 1),
("Lead Engineer", 150000,2),
("Software Engineer", 120000,2),
("Accountant", 125000,3),
("Legal Team Lead", 250000, 4),
("Lawyer", 190000,4)
;
select * from role;

insert into employee (first_name, last_name, role_id) values
("Ashley", "Rodriguez", 3),
("Malia", "Brown",5),
("Sarah", "Lourd",6);

insert into employee (first_name, last_name, role_id, manager_id) values
("John", "Doe", 1, 1),
("Mike", "Chan",2,4),
("Kevin","Tupik",4,1),
("Tom","Allen",7,3);


select * from employee