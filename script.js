let fileUploadApp = angular.module('fileUploadApp', []);

fileUploadApp.controller('uploadCtrl', function uploadCtrl($scope, $http) {
    $scope.fileId = null;
    $scope.add = function() {
        let f = document.getElementById('file').files[0],
            r = new FileReader();

        r.onloadend = function() {
            let nameRegChrome = new RegExp('path(.*)');
            let data = r.result;
            let fileName = file.value.match(nameRegChrome)[1].substr(1);
            $http.post('/upload', {data: data, name: fileName}).then((response) => {
                console.log(response);
                $scope.fileId = response.data.id;
            })
        };

        r.readAsBinaryString(f);
    };

    $scope.statusCheck = function() {

    }
});