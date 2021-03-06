'use strict';

// Declare app level module which depends on views, and core components
var app = angular.module('myApp', [
  'ngRoute',
  'myApp.version'
])
.controller('employeeController', function ($scope, employeesDBService) {
  
  if (angular.isUndefined($scope.filter)) {
    $scope.filter = 'name';
  }

  if (angular.isUndefined($scope.isEditActive)) {
    $scope.isEditActive = false;
  }

  if (angular.isUndefined($scope.changeFilter)) {
    $scope.changeFilter = function (field) {
      if ( field == $scope.filter) {
        $scope.filter = '-' + field;
      } else  {
        $scope.filter = field;
      }
      const test = new Date;
      console.log('filter: \"' + $scope.filter + '\"');
    }
  }
  $scope.search = '';
  $scope.employeesForm = {};

  $scope.getEmployeesList = () => {
    const promise = employeesDBService.getEmployeesList()
    promise.then(function (res) {
      $scope.employes = res.data;
      console.log(res.data);
    })
    .catch(function(err) {
      console.log(err);
    });
    return promise;
  }

  $scope.deleteEmployee = (id) => {
    employeesDBService.deleteEmployee(id)
      .then(() => {
        $scope.getEmployeesList();
      })
      .catch( err => console.log(err))
  }

  $scope.sendEmployeeForUpdate = function (employee) {
    $scope.employeesForm = angular.copy(employee);
    $scope.isEditActive = true;
    $scope.form.$setDirty();
  }

  $scope.formButton = function () {
    if ($scope.isEditActive) {
      const body = {
        name: $scope.employeesForm.name,
	      surname: $scope.employeesForm.surname,
	      sex: $scope.employeesForm.sex,
	      phone: $scope.employeesForm.phone,
	      dateOfBirth: $scope.employeesForm.dateOfBirth,
	      experience: $scope.employeesForm.experience,
        technologies: $scope.employeesForm.technologies,
        email: $scope.employeesForm.email
      }
      employeesDBService.updateEmployee($scope.employeesForm.id, body).then(() => {
        $scope.getEmployeesList().then(() => {
          $scope.isEditActive = false;
          $scope.employeesForm = {};
        })
      })
    } else {
      console.log($scope.employeesForm)
      employeesDBService.addEmployee($scope.employeesForm).then(() => {
        $scope.getEmployeesList().then(() => {
          $scope.isEditActive = false;
          $scope.employeesForm = {};
        });
      })
    }
    $scope.form.$setPristine();
    $scope.form.$setUntouched();
  }
  $scope.getEmployeesList();
})

app.service('employeesDBService', function ($http) {
  this.getEmployeesList = function () {
    return $http({
      method: 'GET',
      url: 'http://localhost:1337/employes',
      withCredentials: false,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      }
    })   
  }

  this.addEmployee = function (body) {
    return $http({
      method: 'POST',
      url: 'http://localhost:1337/employes',
      withCredentials: false,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      data: body
    })
  }

  this.updateEmployee = function (id, body) {
    return $http({
      method: 'PATCH',
      url: 'http://localhost:1337/employes/' + id,
      withCredentials: false,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      data: body
    })
  }

  this.deleteEmployee = function (id) {
    return $http({
      method: 'DELETE',
      url: 'http://localhost:1337/employes/' + id,
      withCredentials: false,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      }
    })
  }
});


