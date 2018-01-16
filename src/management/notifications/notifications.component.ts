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
import {UserNotification} from "../../entities/userNotification";
import UserNotificationService from "../../services/userNotification.service";
import {PagedResult} from "../../entities/pagedResult";

const UserNotificationsComponent: ng.IComponentOptions = {
  bindings: {
    user: '<'
  },
  template: require('./notifications.html'),
  controller: function(
      UserNotificationService: UserNotificationService,
      $interval) {
    'ngInject';
    const vm = this;
    vm.notificationsScheduler = null;

    vm.$onInit = () => {
      // schedule an automatic refresh of the user notifications
      if (!vm.notificationsScheduler) {
        vm.refreshUserNotifications();
        vm.notificationsScheduler = $interval(() => {
          vm.refreshUserNotifications();
        }, UserNotificationService.getNotificationSchedulerInSeconds() * 1000);
      }
    };

    vm.delete = (notification: UserNotification) => {
      UserNotificationService.delete(notification).then((response) => {
        vm.refreshUserNotifications();
      });
    };

    vm.getUserNotificationsCount = function() {
      if (vm.user.notifications) {
        return vm.user.notifications.page.total_elements;
      }
      return 0;
    };

    vm.refreshUserNotifications = () => {
      UserNotificationService.getNotifications().then((response) => {
        const result = new PagedResult();
        result.populate(response.data);
        UserNotificationService.fillUserNotifications(vm.user, result);
      });
    };
  }
};

export default UserNotificationsComponent;