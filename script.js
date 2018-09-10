let fileUploadApp = angular.module('fileUploadApp', []);

fileUploadApp.controller('uploadCtrl', function uploadCtrl($scope, $http) {
    $scope.status = null;
    $scope.fileId = null;
    $scope.add = function() {
        let f = document.getElementById('file').files[0],
            r = new FileReader();

        r.onloadend = function() {
            let nameRegChrome = new RegExp('path(.*)');
            let data = r.result;
            let fileName = file.value.match(nameRegChrome)[1].substr(1);
            $http.post('/upload', {data: data, name: fileName}).then(response => {
                console.log(response);
                $scope.fileId = response.data.id;
                $scope.status = {
                    inProgress: true,
                    line: 0
                }
            })
        };

        r.readAsBinaryString(f);
    };

    $scope.statusCheck = function() {
        $http.get(`/status/${$scope.fileId}`).then(response => {
            $scope.status = response.data.message;
        })
    }
});