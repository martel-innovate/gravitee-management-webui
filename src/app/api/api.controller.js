/*
 * Copyright (C) 2015 The Gravitee team (http://gravitee.io)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/* global document:false */
class ApiController {
  constructor (ApiService, $stateParams, $mdDialog, NotificationService, $scope) {
    'ngInject';
    this.ApiService = ApiService;
    this.$mdDialog = $mdDialog;
    this.NotificationService = NotificationService;
    this.$scope = $scope;

    this.apis = [];
    if ($stateParams.apiName) {
      this.get($stateParams.apiName);
      this.listPolicies($stateParams.apiName);
    } else {
      this.list();
    }

    this.selectedPolicy = null;

    // Chart Part (static values)
    $scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
    $scope.series = ['Series A', 'Series B'];
    $scope.data = [
      [65, 59, 80, 81, 56, 55, 40],
      [28, 48, 40, 19, 86, 27, 90]
    ];
    $scope.labelsPie = ["200", "404", "500"];
    $scope.dataPie = [500, 50, 100];
  }

  get(apiName) {
    this.ApiService.get(apiName).then(response => {
      this.api = response.data;
    });
  }

  list() {
    this.ApiService.list().then(response => {
      this.apis = response.data;
    });
  }

  start(name) {
    this.ApiService.start(name).then(() => {
      this.list();
    });
  }

  stop(name) {
    this.ApiService.stop(name).then(() => {
      this.list();
    });
  }

  delete(name) {
    this.ApiService.delete(name).then(() => {
      this.list();
    });
  }

  listPolicies(apiName) {
    this.ApiService.listPolicies(apiName).then(response => {
      // TODO filter request, response and request/response policies
      this.policies = {
        'OnRequest': response.data,
        'OnResponse': [],
        'OnRequest/OnResponse': []
      };
    });
  }

  showApiModal(api) {
    var that = this;
    this.$mdDialog.show({
      controller: DialogApiController,
      templateUrl: 'app/api/api.dialog.html',
      parent: angular.element(document.body),
      api: api
    }).then(function (api) {
      if (api) {
        that.list();
      }
    });
  }

  update(api) {
    this.ApiService.update(api).then(() => {
      this.$scope.formApi.$setPristine();
      this.NotificationService.show('Api updated with success');
    });
  }

  bgColorByIndex(index) {
    switch (index % 6) {
      case 0 :
        return '#f39c12';
      case 1 :
        return '#29b6f6';
      case 2 :
        return '#26c6da';
      case 3 :
        return '#26a69a';
      case 4 :
        return '#259b24';
      case 5 :
        return '#26a69a';
      default :
        return 'black';
    }
  }

  // documentation
}

function DialogApiController($scope, $mdDialog, ApiService, api) {
  'ngInject';

  $scope.api = api;
  $scope.editMode = api;

  $scope.hide = function () {
    $mdDialog.hide();
  };

  $scope.save = function () {
    if ($scope.editMode) {
      ApiService.update($scope.api).then(function () {
        $mdDialog.hide(api);
      }).catch(function (error) {
        $scope.error = error;
      });
    } else {
      ApiService.create($scope.api).then(function () {
        $mdDialog.hide(api);
      }).catch(function (error) {
        $scope.error = error;
      });
    }
  };
}

export default ApiController;
