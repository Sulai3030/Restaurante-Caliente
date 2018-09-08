const mysql = require("mysql");

function Table(name) {
    this.name = name;
    this.config = {
        host: "p1us8ottbqwio8hv.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
        port: 3306,
        user: "acvyanlcqhz0z2cd",
        password: "rhy7fzvx7tir1yyc",
        database: "hnhj8s5lr3y13cva"
    };
    this.connect = function () {
        this.connection = mysql.createConnection(this.config)
    };
    this.print = function (input) {
        return new Promise((resolve, reject) => {
            var query = "SELECT ?? FROM ?? LIMIT ?";
            var filter = input || "*"
            this.connection.query(query, [filter, this.name, 100], function (err, res) {
                if (err) {
                    console.log(err)
                    reject(err)
                }
                console.table(res)
                resolve()
            });
        })
    };
    this.getItem = function (column, target, amount, comparison) {
        return new Promise((resolve, reject) => {
            var compare = comparison || "="
            var escaper = [this.name, column, target]
            if (compare === "=") {
                var query = "SELECT * FROM ?? WHERE ?? = ? ORDER BY user_id DESC";
            } else if (compare === "<") {
                var query = "SELECT * FROM ?? WHERE ?? < ? ORDER BY user_id DESC";
            }
            if (amount) {
                query += " LIMIT ?"
                escaper.push(amount)
            }
            this.connection.query(query, escaper, function (err, res) {
                if (err) {
                    console.log(err)
                    reject(err)
                }
                resolve(res)
            });
        })
    };
    this.changeTable = function (propToChange, newValueforProp, columnToTarget, targetCriteria) {
        return new Promise((resolve, reject) => {
            var query = "UPDATE ?? SET ?? = ? WHERE ?? = ?;"
            this.connection.query(query, [this.name, propToChange, newValueforProp, columnToTarget, targetCriteria], function (err, res) {
                if (err) {
                    console.log(err)
                    reject(err)
                }
                resolve("You have successfully updated the table " + this.name + " for " + propToChange + " to have a value of " + newValueforProp + " where " + columnToTarget + " is equal to " + targetCriteria + ".")
            });
        })
    };
    this.newItem = function (newUser) {
        return new Promise((resolve, reject) => {
            var query = "INSERT INTO ? (first_name,last_name,phone_number,email,user_name,isWaitlist) values (?,?,?,?,?,?);";
            var escaper = [this.name, newUser.firstName, newUser.lastName, newUser.phoneNumber, newUser.email, newUser.userName,newUser.isWaitlist]
            this.connection.query(query, escaper, function (err, res) {
                if (err) {
                    console.log(err)
                    reject(err)
                }
                resolve("user successfully added")
            })
        })
    };
    this.deleteItem = function (column, target, condition) {
        return new Promise((resolve, reject) => {
            if (!condition || condition === "=") {
                var query = "DELETE FROM ?? WHERE ?? = ?";
            } else if (condition === ">") {
                var query = "DELETE FROM ?? WHERE ?? > ?";
            }
            this.connection.query(query, [this.name, column, target], function (err, res) {
                if (err) {
                    console.log(err)
                    reject(err)
                }
                resolve("You have successfully deleted item(s) with a " + column + " of " + target + ".")
            })
        })
    }
    this.getMostRecent = function (amount, source) {
        return new Promise((resolve, reject) => {
            var query = "SELECT * FROM ?? WHERE source = ? ORDER BY user_id DESC LIMIT ?;"
            this.connection.query(query, [this.name, source, amount], function (err, res) {
                if (err) {
                    console.log(err)
                    reject(err)
                }
                resolve(res)
            })
        })
    }
}


module.exports = Table

