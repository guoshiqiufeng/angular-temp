/**
 * Created by 皓强 on 2016/7/12 0012.
 */
app.controller('UserCtrl', ['$scope', '$http', function($scope, $http) {
    $http.get('js/app/user/user.json').then(function (resp) {
        $scope.users = resp.rows;

    });

}]);
(function () {
    'use strict';
    app.controller('dynamicDemoController', ['NgTableParams','$http',
        function (NgTableParams,$http) {
            var self = this;
            var originalData = [];
            $http.get('js/app/user/1.json').then(function (resp) {
                console.log(resp);
                originalData = resp.data;
                self.cols = [
                    {
                        field: 'name',
                        title: 'Name',
                        filter: { name: 'text' },
                        sortable: 'name',
                        dataType: 'text'
                    },
                    {
                        field: 'age',
                        title: 'Age',
                        filter: { age: 'number' },
                        sortable: 'age',
                        dataType: 'number'
                    },
                    {
                        field: 'money',
                        title: 'Money',
                        filter: { money: 'number' },
                        sortable: 'money',
                        dataType: 'number'
                    },
                    {
                        field: 'action',
                        title: '',
                        dataType: 'command'
                    }
                ];
                self.tableParams = new NgTableParams({}, { dataset: originalData });
                self.deleteCount = 0;
                self.add = add;
                self.cancelChanges = cancelChanges;
                self.del = del;
                self.hasChanges = hasChanges;
                self.saveChanges = saveChanges;
                function add() {
                    self.isEditing = true;
                    self.isAdding = true;
                    self.tableParams.settings().dataset.unshift({
                        name: '',
                        age: null,
                        money: null
                    });
                    self.tableParams.sorting({});
                    self.tableParams.page(1);
                    self.tableParams.reload();
                }
                function cancelChanges() {
                    resetTableStatus();
                    var currentPage = self.tableParams.page();
                    self.tableParams.settings({ dataset: originalData});
                    if (!self.isAdding) {
                        self.tableParams.page(currentPage);
                    }
                }
                function del(row) {
                    _.remove(self.tableParams.settings().dataset, function (item) {
                        return row === item;
                    });
                    self.deleteCount++;
                    //self.tableTracker.untrack(row);
                    self.tableParams.reload().then(function (data) {
                        if (data.length === 0 && self.tableParams.total() > 0) {
                            self.tableParams.page(self.tableParams.page() - 1);
                            self.tableParams.reload();
                        }
                    });
                }
                function hasChanges() {
                    return self.tableForm.$dirty || self.deleteCount > 0;
                }
                function resetTableStatus() {
                    self.isEditing = false;
                    self.isAdding = false;
                    self.deleteCount = 0;
                    //self.tableTracker.reset();
                    self.tableForm.$setPristine();
                }
                function saveChanges() {
                    resetTableStatus();
                    var currentPage = self.tableParams.page();
                    originalData = angular.copy(self.tableParams.settings().dataset);
                }
            });

        }]);

}());
