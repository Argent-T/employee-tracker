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
)