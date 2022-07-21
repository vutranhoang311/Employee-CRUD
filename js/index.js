/*
Manage employees
Author: Vu Tran Hoang
Date: 03/05/2022
Version: 1.0v
*/
var employeeList = [];

var createEmployee = function () {
  if (validateAll()) {
    var account = document.getElementById("tknv").value;
    var name = document.getElementById("name").value;
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    var startDay = document.getElementById("datepicker").value;
    var salary = +document.getElementById("luongCB").value;
    var position = document.getElementById("chucvu").value;
    var hours = +document.getElementById("gioLam").value;
    var newEmployee = new Employee(
      account,
      name,
      email,
      password,
      startDay,
      salary,
      position,
      hours
    );

    axios({
      url: "https://6271e15e25fed8fcb5ec0b3d.mockapi.io/employee/employeeCRUD",
      method: "POST",
      data: newEmployee,
    })
      .then(function (objPromise) {
        getData();
        document.getElementById("btnDong").click();
      })
      .catch(function (error) {
        console.log(error);
      });
    // employeeList.push(newEmployee);
    // saveData();
  }
};

var deleteEmployee = async function (id) {
  //   var indexEmployee = findEmpByAccount(account);
  //   if (indexEmployee === -1) {
  //     alert("Nhân viên không tồn tại");
  //     return false;
  //   }
  if (confirm("Bạn chắc chắn muốn xoá nhân viên?")) {
    axios({
      url:
        "https://6271e15e25fed8fcb5ec0b3d.mockapi.io/employee/employeeCRUD/" +
        id,
      method: "DELETE",
    })
      .then(function (objPromise) {
        getData();
      })
      .catch(function (error) {
        console.log(error);
      });
  }
};

var getUpdateEmployee = async function (id) {
  //   var indexEmployee = findEmpByAccount(account);
  //   if (indexEmployee === -1) {
  //     alert("Nhân viên không tồn tại");
  //     return false;
  //   }
  //   var foundEmployee = employeeList[indexEmployee];
  var foundEmployee;
  try {
    var result = await axios({
      url:
        "https://6271e15e25fed8fcb5ec0b3d.mockapi.io/employee/employeeCRUD/" +
        id,
      method: "GET",
    });
    foundEmployee = result.data;
    document.getElementById("tknv").disabled = true;
    document.getElementById("tknv").value = foundEmployee.account;
    document.getElementById("name").value = foundEmployee.name;
    document.getElementById("email").value = foundEmployee.email;
    document.getElementById("password").value = foundEmployee.password;
    document.getElementById("datepicker").value = foundEmployee.startDay;
    document.getElementById("luongCB").value = foundEmployee.salary;
    document.getElementById("chucvu").value = foundEmployee.position;
    document.getElementById("gioLam").value = foundEmployee.hours;
    document.getElementById("btnCapNhat").className = "btn btn-success";
    document.getElementById("modal-footer").innerHTML = `
     <button id="btnThemNV" type="button" class="btn btn-success" onclick="createEmployee()">Thêm người
    dùng</button>
      <button id="btnCapNhat" type="button" class="btn btn-success" onclick="updateEmployee(${foundEmployee.account})">Cập nhật</button>
    <button id="btnDong" type="button" class="btn btn-danger " data-dismiss="modal"
        onclick="clearModal()">Đóng</button>`;
    document.getElementById("btnThemNV").style.display = "none";
  } catch (error) {
    alert("Nhân viên không tồn tại");
    console.log(error);
    setTimeout(function () {
      document.getElementById("btnDong").click();
    }, 0);
  }
};

var updateEmployee = async function () {
  //   var indexEmployee = findEmpByAccount(accountId);
  //   if (indexEmployee === -1) {
  //     alert("Nhân viên không tồn tại");
  //     return false;
  //   }

  if (!validateAll()) {
    return false;
  }
  var updatedEmployee = new Employee(
    document.getElementById("spanEmpId").innerHTML,
    document.getElementById("tknv").value,
    document.getElementById("name").value,
    document.getElementById("email").value,
    document.getElementById("password").value,
    document.getElementById("datepicker").value,
    +document.getElementById("luongCB").value,
    document.getElementById("chucvu").value,
    +document.getElementById("gioLam").value
  );

  try {
    var res = axios({
      url:
        "https://6271e15e25fed8fcb5ec0b3d.mockapi.io/employee/employeeCRUD/" +
        document.getElementById("spanEmpId").innerHTML,
      method: "PUT",
      data: updatedEmployee,
    });
    alert("Cập nhật thành công");
    document.getElementById("btnDong").click();
    getData();

  } catch (error) {
    alert("Cập nhật đã bị lỗi! Vui lòng liên hệ quản trị viên");
    console.log(error);
  }

  //   employeeList.splice(indexEmployee, 1, updatedEmployee);
  //   saveData();
  //   getData();
};

var searchEmployeeByRank = function () {
  var foundList = [];
  var keyword = document
    .getElementById("searchName")
    .value.toLowerCase()
    .trim();
  console.log(keyword);
  for (var i = 0; i < employeeList.length; i++) {
    var rankEmployee = employeeList[i].rankEmployee().toLowerCase();
    if (rankEmployee.includes(keyword)) foundList.push(employeeList[i]);
  }
  renderEmployee(foundList);
};

var findEmpByAccount = function (account) {
  for (var i = 0; i < employeeList.length; i++) {
    if (employeeList[i].account.includes(account)) return i;
  }
  return -1;
};

var findEmpById = function (id) {};

var renderEmployee = function (renderList) {
  var dataHTML = "";

  for (var i = 0; i < renderList.length; i++) {
    dataHTML += `<tr>
      <td>${renderList[i].account}</td>
      <td>${renderList[i].name}</td>
      <td>${renderList[i].email}</td>
      <td>${renderList[i].startDay}</td>
      <td>${formatPosition(renderList[i].position)}</td>
      <td>${formatSalary("" + renderList[i].totalSalary())}</td>
      <td>${renderList[i].rankEmployee()}</td>
      <td>
      <span id="spanEmpId" class="d-none">${renderList[i].id}</span>
      <button id="btnUpdate" class="btn btn-success"data-toggle="modal" 
      data-target="#myModal" onclick="getUpdateEmployee(${
        renderList[i].id
      })">CẬP NHẬT</button>
      <button id="btnDelete" type="button" class="btn btn-danger" onclick="deleteEmployee(${
        renderList[i].id
      })">XOÁ</button></td></td>

  </tr>`;
  }
  document.getElementById("tableDanhSach").innerHTML = dataHTML;
};

var saveData = function () {
  var employeeListJSON = JSON.stringify(employeeList);
  localStorage.setItem("employeeList", employeeListJSON);
};

var getData = function () {
  //   var employeeListJSON = JSON.parse(localStorage.getItem("employeeList"));
  //   if (employeeListJSON) {
  //     employeeList = mapData(employeeListJSON);
  //   }
  var promise = axios({
    url: "https://6271e15e25fed8fcb5ec0b3d.mockapi.io/employee/employeeCRUD",
    method: "GET",
  });
  promise
    .then(function (promiseObject) {
        employeeList = mapData(promiseObject.data);
      renderEmployee(employeeList);
    })
    .catch(function (error) {
      console.log(error);
    });
};

var mapData = function (employeeListData) {
  var listData = [];
  for (var i = 0; i < employeeListData.length; i++) {
    var mappedEmployee = new Employee(
      employeeListData[i].id,
      employeeListData[i].account,
      employeeListData[i].name,
      employeeListData[i].email,
      employeeListData[i].password,
      employeeListData[i].startDay,
      employeeListData[i].salary,
      employeeListData[i].position,
      employeeListData[i].hours
    );
    listData.push(mappedEmployee);
  }
  return listData;
};

var clearModal = function () {
  document.getElementById("tknv").value = "";
  document.getElementById("name").value = "";
  document.getElementById("email").value = "";
  document.getElementById("password").value = "";
  document.getElementById("datepicker").value = "";
  document.getElementById("luongCB").value = "";
  document.getElementById("chucvu").value = "";
  document.getElementById("gioLam").value = "";

  document.getElementById("tbTKNV").innerHTML = "";
  document.getElementById("tbTen").innerHTML = "";
  document.getElementById("tbEmail").innerHTML = "";
  document.getElementById("tbMatKhau").innerHTML = "";
  document.getElementById("tbNgay").innerHTML = "";
  document.getElementById("tbLuongCB").innerHTML = "";
  document.getElementById("tbChucVu").innerHTML = "";
  document.getElementById("tbGiolam").innerHTML = "";

  document.getElementById("tbTKNV").style.display = "none";
  document.getElementById("tbTen").style.display = "none";
  document.getElementById("tbEmail").style.display = "none";
  document.getElementById("tbMatKhau").style.display = "none";
  document.getElementById("tbNgay").style.display = "none";
  document.getElementById("tbLuongCB").style.display = "none";
  document.getElementById("tbChucVu").style.display = "none";
  document.getElementById("tbGiolam").style.display = "none";
};

var formatPosition = function (position) {
  switch (position) {
    case "director":
      return "Giám Đốc";
    case "manager":
      return "Trưởng Phòng";
    case "staff":
      return "Nhân Viên";
    default:
      break;
  }
};

function formatSalary(str) {
  str = str.split("").reverse();
  var result = "";
  for (var i = 0; i < str.length; i++) {
    if (i % 3 || i === 0) {
      result += str[i];
    } else result += "," + str[i];
  }
  return result.split("").reverse().join("");
}

/**
 * ===================
 * VALIDATION
 * required
 * length
 * pattern
 * ===================
 */
var validateAll = function () {
  var account = document.getElementById("tknv").value;
  var name = document.getElementById("name").value;
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;
  var startDay = document.getElementById("datepicker").value;
  var salary = +document.getElementById("luongCB").value;
  var position = document.getElementById("chucvu").value;
  var hours = +document.getElementById("gioLam").value;

  var accountPattern = /^[0-9]+$/g;
  var namePattern = /^[A-z\s]+$/g;
  var emailPattern = /^[A-z0-9]+@[A-z0-9-]+.[a-zA-Z0-9]{3}$/g;
  var passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]+$/g;
  var startDayPattern =
    /^(?:(?:(?:0?[13578]|1[02]|(?:Jan|Mar|May|Jul|Aug|Oct|Dec))(\/|-|\.)31)\1|(?:(?:0?[1,3-9]|1[0-2]|(?:Jan|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec))(\/|-|\.)(?:29|30)\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:(?:0?2|(?:Feb))(\/|-|\.)(?:29)\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:(?:0?[1-9]|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep))|(?:1[0-2]|(?:Oct|Nov|Dec)))(\/|-|\.)(?:0?[1-9]|1\d|2[0-8])\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/g;

  var isValid = true;

  isValid &=
    required(account, "tbTKNV") &&
    lengthValidate(4, 6, account, "tbTKNV") &&
    pattern(account, "tbTKNV", accountPattern, "* Chỉ được nhập số");

  isValid &=
    required(name, "tbTen") &&
    pattern(name, "tbTen", namePattern, "* Chỉ được nhập chữ");

  isValid &=
    required(email, "tbEmail") &&
    pattern(email, "tbEmail", emailPattern, "* Nhập không đúng định dạng mail");

  isValid &=
    required(password, "tbMatKhau") &&
    lengthValidate(6, 10, password, "tbMatKhau") &&
    pattern(
      password,
      "tbMatKhau",
      passwordPattern,
      "* Chứa ít nhất 1 ký tự số, 1 ký tự in hoa, 1 ký tự đặc biệt"
    );

  isValid &=
    required(startDay, "tbNgay") &&
    pattern(startDay, "tbNgay", startDayPattern, "* Định dạng mm/dd/yyyy");

  var minSalary = 1000000;
  var maxSalary = 20000000;
  isValid &=
    required(salary, "tbLuongCB") &&
    numberRangeValidate(
      salary,
      minSalary,
      maxSalary,
      `Lương cơ bản ${formatSalary(minSalary + "")} - ${formatSalary(
        maxSalary + ""
      )}`,
      "tbLuongCB"
    );

  isValid &= required(position, "tbChucVu", "* Chọn 1 chức vụ");

  var minHour = 80;
  var maxHour = 200;
  isValid &=
    required(hours, "tbGiolam") &&
    numberRangeValidate(
      hours,
      minHour,
      maxHour,
      `* Số giờ làm trong tháng ${minHour} - ${maxHour} giờ.`,
      "tbGiolam"
    );

  return isValid;
};

var required = function (value, elementId, errorMessage) {
  if (!errorMessage) errorMessage = "* Trường này không được để trống!";
  if (!value) {
    document.getElementById(elementId).innerHTML = errorMessage;
    document.getElementById(elementId).style.display = "inline-block";
    return false;
  }
  document.getElementById(elementId).innerHTML = "";
  document.getElementById(elementId).style.display = "none";
  return true;
};

var lengthValidate = function (min, max, value, elementId) {
  if (value.length < min || value.length > max) {
    document.getElementById(
      elementId
    ).innerHTML = `*Độ dài phải từ ${min} đến ${max} ký tự`;
    document.getElementById(elementId).style.display = "inline-block";

    return false;
  }
  document.getElementById(elementId).value = "";
  document.getElementById(elementId).style.display = "none";
  return true;
};

var pattern = function (value, elementId, regex, errorMessage) {
  var valid = regex.test(value);
  if (!valid) {
    document.getElementById(elementId).innerHTML = errorMessage;
    document.getElementById(elementId).style.display = "inline-block";

    return false;
  }
  document.getElementById(elementId).value = "";
  document.getElementById(elementId).style.display = "none";

  return true;
};

var numberRangeValidate = function (value, min, max, errorMessage, elementId) {
  if (value < min || value > max) {
    document.getElementById(elementId).innerHTML = errorMessage;
    document.getElementById(elementId).style.display = "inline-block";
    return false;
  }

  document.getElementById(elementId).innerHTML = "";
  document.getElementById(elementId).style.display = "none";
  return true;
};

var buttonThem = function () {
  document.getElementById("btnThemNV").style.display = "block";
  document.getElementById("btnCapNhat").className = "btn btn-success d-none";
  document.getElementById("tknv").disabled = false;
};

getData();
