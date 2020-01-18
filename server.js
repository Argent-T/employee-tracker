var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require('console.table');
var async = require("async");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "balloonsql90",
  database: "contentmanagementsystem_db"
});

connection.connect(function (err) {
  if (err) throw err;
  // console.log("connected as id " + connection.threadId + "\n");
});


start()
function start() {

  console.log("-------------------------------------------------------------")
  console.log("|           ***********          *     **                   |")
  console.log("|           *                   * *   *  *                  |")
  console.log("|           *                  *   * *    *                 |")
  console.log("|           ***********        *    *     *                 |")
  console.log("|           *                  *          *                 |")
  console.log("|           *                  *          *                 |")
  console.log("|           ***********        *          *                 |")
  console.log("|            Employee            Management                 |")
  console.log("-------------------------------------------------------------")




  inquirer
    .prompt({
      name: "firstchoice",
      type: "list",
      message: "Would you like to do?",
      choices: ["View all employees", "View all employees by department", "View all employees by manager", "Add Employee", "Remove Employee", "Update Employee Role", "Update Employee Manager", "Exit"]
    })
    .then(function (answer) {

      if (answer.firstchoice === "View all employees") {
        viewEmployees();
      }
      else if (answer.firstchoice === "View all employees by department") {
        viewByDepartment();
      }
      else if (answer.firstchoice === "View all employees by manager") {
        viewByManager();
      }
      else if (answer.firstchoice === "Add Employee") {
        addEmployee();
      }
      else if (answer.firstchoice === "Remove Employee") {
        removeEmployee();
      }
      else if (answer.firstchoice === "Update Employee Role") {
        updateRole();
      }
      else if (answer.firstchoice === "Update Employee Manager") {
        updateManager();
      }


      else {
        connection.end();
      }
    });
}

function viewEmployees() {
  var query = "select employee.id, employee.first_name, employee.last_name, r.title, d.name as department, ";
  query += "r.salary, concat(emp.first_name,' ', emp.last_name) as manager from employee ";
  query += "inner join role r on r.id = employee.role_id inner join department d on d.id = r.department_id left join employee emp on employee.manager_id = emp.id"


  connection.query(query, function (err, res) {
    if (err) throw err;
    console.table(res);
    connection.end();
  });

}


function viewByDepartment() {
  var queryOptions = "select name from department";
  var options = [];
  connection.query(queryOptions, function (err, res) {
    if (err) throw err;

    for (var i = 0; i < res.length; i++) {
      options.push(res[i].name)
    }
    inquirer
      .prompt({
        name: "departmentchoice",
        type: "list",
        message: "Which department would you like to view?",
        choices: options
      }).then(function (answer) {
        var query = "select employee.id, employee.first_name, employee.last_name, r.title, d.name as department, ";
        query += "r.salary, concat(emp.first_name,' ', emp.last_name) as manager from employee ";
        query += "inner join role r on r.id = employee.role_id inner join department d on d.id = r.department_id left join employee emp on employee.manager_id = emp.id where d.name = ?"
        connection.query(query, [answer.departmentchoice], function (err, res) {
          if (err) throw err;
          console.table(res);
          connection.end();
        })
      })
  })
};

function viewByManager() {
  var options = []
  var queryOptions = "select distinct concat(emp.first_name,' ', emp.last_name) as manager from employee inner join role r on r.id = employee.role_id inner join department d on d.id = r.department_id left join employee emp on employee.manager_id = emp.id";
  connection.query(queryOptions, function (err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      if (res[i].manager != null){
      options.push(res[i].manager)
      }
    }
    inquirer
      .prompt({
        name: "manager choice",
        type: "list",
        message: "Which manager would you like to view?",
        choices: options
      }).then(function (answer) {
        var query = "select employee.id, employee.first_name, employee.last_name, r.title, d.name as department, ";
        query += "r.salary, concat(emp.first_name,' ', emp.last_name) as manager from employee ";
        query += "inner join role r on r.id = employee.role_id inner join department d on d.id = r.department_id left join employee emp on employee.manager_id = emp.id where  ?"
        connection.query(query, [answer.departmentchoice], function (err, res) {
          if (err) throw err;
          console.table(res);
          connection.end();
        })
      })
  });
}



