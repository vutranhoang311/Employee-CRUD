/*
Class  Employee
Author: Vu Tran Hoang
Date: 03/05/2022
Version: 1.0v
*/

function Employee(
  id,
  account,
  name,
  email,
  password,
  startDay,
  salary,
  position,
  hours
) {
  this.id = id;
  this.account = account;
  this.name = name;
  this.email = email;
  this.password = password;
  this.startDay = startDay;
  this.salary = salary;
  this.position = position;
  this.hours = hours;
  this.totalSalary = function () {
    var total = 0;
    switch (this.position) {
      case "director":
        total = this.salary * 3;
        break;
      case "manager":
        total = this.salary * 2;
        break;
      case "staff":
        total = this.salary;
        break;
      default:
    }
    return total;
  };

  this.rankEmployee = function () {
    var rank = "";
    if (this.hours >= 192) {
      rank = "Xuất sắc";
    } else if (this.hours >= 176) {
      rank = "Giỏi";
    } else if (this.hours >= 160) {
      rank = "Khá";
    } else if (this.hours < 160) {
      rank = "Trung bình";
    }
    return rank;
  };
}
