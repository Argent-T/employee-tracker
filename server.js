var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require('console.table');
const chalk = require('chalk');

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


init();

function init() {

  console.log(chalk.red("-------------------------------------------------------------"))
  console.log(chalk.red("|           ***********          *     **                   |"))
  console.log(chalk.yellow("|           *                   * *   *  *                  |"))
  console.log(chalk.yellow("|           *                  *   * *    *                 |"))
  console.log(chalk.green("|           ***********        *    *     *                 |"))
  console.log(chalk.green("|           *                  *          *                 |"))
  console.log(chalk.blue("|           *                  *          *                 |"))
  console.log(chalk.blue("|           ***********        *          *                 |"))
  console.log(chalk.magenta("|            Employee            Management                 |"))
  console.log(chalk.magenta("-------------------------------------------------------------"))
  start();
}




function start() {

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

// view all employees
function viewEmployees() {
  var query = "select employee.id, employee.first_name, employee.last_name, r.title, d.name as department, ";
  query += "r.salary, concat(emp.first_name,' ', emp.last_name) as manager from employee ";
  query += "inner join role r on r.id = employee.role_id inner join department d on d.id = r.department_id left join employee emp on employee.manager_id = emp.id"


  connection.query(query, function (err, res) {
    if (err) throw err;
    console.table(res);
    start();
  });

}

// view by department
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
          start();
        })
      })
  })
};

// view by manager
function viewByManager() {
  var options = []
  var queryOptions = "select distinct concat(emp.first_name,' ', emp.last_name) as manager from employee inner join role r on r.id = employee.role_id inner join department d on d.id = r.department_id left join employee emp on employee.manager_id = emp.id";
  connection.query(queryOptions, function (err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      if (res[i].manager != null) {
        options.push(res[i].manager)
      }
    }
    inquirer
      .prompt({
        name: "managerchoice",
        type: "list",
        message: "Which manager would you like to view?",
        choices: options

        // get manager id from name
      }).then(function (answer) {
        let names = answer.managerchoice.split(" ")
        var query = "select employee.id from employee where first_name = ? and last_name = ?";

        connection.query(query, [names[0], names[1]], function (err, res1) {
          if (err) throw err;
          manager(res1)
          // connection.end();
        })
      })
  });
}
// since i cant figure out async 
function manager(res1) {
  // console.log(res1)
  var query = "select employee.id, employee.first_name, employee.last_name, r.title, d.name as department, ";
  query += "r.salary, concat(emp.first_name,' ', emp.last_name) as manager from employee ";
  query += "inner join role r on r.id = employee.role_id inner join department d on d.id = r.department_id left join employee emp on employee.manager_id = emp.id where employee.manager_id = ?"
  connection.query(query, res1[0].id, function (err, res) {
    if (err) throw err;
    console.table(res);
    start();
  });
}


// add employee
function addEmployee() {
  var options = []
  var queryOptions = "select title from role";
  connection.query(queryOptions, function (err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      options.push(res[i].title)
    }

    inquirer.prompt([
      {
        name: "newfirstname",
        type: "input",
        message: "enter first name"
      },
      {
        name: "newlastname",
        type: "input",
        message: "enter last name"
      },
      {
        name: "rolechoice",
        type: "list",
        message: "Which role are they in?",
        choices: options
      },
      {
        name: "hasmanager",
        type: "list",
        message: "do they have a manager?",
        choices: ["Yes", "No"]
      }
    ]).then(function (answer) {
      let result = answer;
      console.log(result)

      // If no manager
      if (answer.hasmanager === "No") {
        var queryrole = "select id from role where title = ?";
        var queryadd = "insert into employee (first_name, last_name, role_id) values (?,?,?)";
        connection.query(queryrole, answer.rolechoice, function (err, res) {
          if (err) throw err;
          // console.log(res[0].id)
          connection.query(queryadd, [answer.newfirstname, answer.newlastname, res[0].id], function (err, res) {
            if (err) throw err;
            console.log(`Added ${answer.newfirstname} ${answer.newlastname} as a ${answer.rolechoice}.`);
            start();
          })
        })
      }
      // If has a manager list names 
      else {
        var querynames = "select id, concat(first_name,' ', last_name) as name from employee";
        let names = [];
        connection.query(querynames, function (err, res) {
          if (err) throw err;
          for (var i = 0; i < res.length; i++) {
            names.push(res[i].name)
          }

          inquirer.prompt({
            name: "manager",
            type: "list",
            message: "Select a Manager",
            choices: names

            // Turn role and manager into IDs and then run insert
          }).then(function (answer) {
            let names = answer.manager.split(" ")
            var queryroleId = "select id from role where title = ?";
            var queryManId = "select employee.id from employee where first_name = ? and last_name = ?";
            var queryadd = "insert into employee (first_name, last_name, role_id, manager_id) values (?,?,?,?)"

            connection.query(queryManId, [names[0], names[1]], function (err, managerId) {
              if (err) throw err;
              managerId = managerId[0].id;
              connection.query(queryroleId, result.rolechoice, function (err, res) {
                if (err) throw err;
                roleId = res[0].id;
                // console.log("role ID")
                // console.log(roleId)
                connection.query(queryadd, [result.newfirstname, result.newlastname, roleId, managerId], function (err, res) {
                  if (err) throw err;
                  console.log(`Added ${result.newfirstname} ${result.newlastname} as a ${result.rolechoice} with ${answer.manager} as their manager.`);
                  start();
                })
              })
            })
          })
        })
      }
    })
  })
}


// Remove employee
function removeEmployee() {
  var querynames = "select id, concat(first_name,' ', last_name) as name from employee";
  let names = [];
  connection.query(querynames, function (err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      names.push(res[i].name)
    }

    inquirer.prompt([{
      name: "remove",
      type: "list",
      message: "Who would you like to remove?",
      choices: names
    },
    {
      name: "confirm",
      type: "list",
      message: "Are you sure?",
      choices: ["Yes", "No"]
    }

    ]).then(function (answer) {
      if (answer.confirm === "Yes") {
        let names = answer.remove.split(" ")
        var queryNameId = "select employee.id from employee where first_name = ? and last_name = ?";
        var queryRemove = "delete from employee where id = ?"

        connection.query(queryNameId, [names[0], names[1]], function (err, empId) {
          if (err) throw err;
          connection.query(queryRemove, empId[0].id, function (err, res) {
            if (err) throw err;
            console.log(`Removed ${answer.remove} from the database`);
            start();

          })
        })
      }
      else {
        start();

      }

    })
  })
}



function updateRole() {
  var querynames = "select id, concat(first_name,' ', last_name) as name from employee";
  var queryRoles = "select id, title from role";
  let names = [];
  let roles = [];
  connection.query(querynames, function (err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      names.push(res[i])
    }
    console.log(names)
    connection.query(queryRoles, function (err, res) {
      if (err) throw err;
      for (var i = 0; i < res.length; i++) {
        roles.push(res[i])
      }
      console.log(roles)
    })

    inquirer.prompt([
      {
        name: "namechoice",
        type: "list",
        message: "Whos role would you like to update?",
        choices: names
      },
      {
        name: "confirm",
        type: "list",
        message: "Are you sure?",
        choices: roles
      }

    ])





  })
}