var mysql = require("mysql");
var inquirer = require("inquirer");
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

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
  });
  
  function start() {
    inquirer
      .prompt({
        name: "firstchoice",
        type: "list",
        message: "Would you like to [ADD departments, roles, employees], [VIEW departments, roles, employees], or [EXIT]",
        choices: ["ADD", "VIEW", "EXIT"]
      })
      .then(function(answer) {
        // based on their answer, either call the bid or the post functions
        if (answer.postOrBid === "ADD") {
          addItem();
        }
        else if(answer.postOrBid === "VIEW") {
          viewItem();
        } else{
          connection.end();
        }
      });
  }