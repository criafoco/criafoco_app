appServices.factory('HttpClient', ['$http', '$q', 'localStorageService', function($http, $q, localStorageService) {
    function request(method, destination, parameters) {
        var defer = $q.defer();

        var strAuth = Constants.webservice.auth;
        
        const person = localStorageService.get('person');

        if (person && destination.indexOf('salva-usuario') == -1) {
            if (person.password != undefined) {
                strAuth = btoa(person.email + ':' + person.password);
            } else {
                strAuth = btoa(person.email + ':' + person.token);
            }
        }
        
        $http({
            method: method,
            url: Constants.webservice.url + destination,
            data: parameters == null ? null : angular.toJson(parameters),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + strAuth
            }
        }).then(function successCallback(response) {
            if (response.status >= 200 && response.status < 300) {
                var result = response.data;
                
                if (result.success) {
                    defer.resolve(result.data);
                } else {
                    defer.reject(result.message);
                }
            } else {
                defer.reject(response.statusText);
            }
        }, function errorCallback(response) {
            defer.reject(response.statusText);
        });

        return defer.promise;
    }

    return {
        get: function(destination) {
            return request('GET', destination);
        },
        post: function(destination, parameters) {
            return request('POST', destination, parameters);
        },
        put: function(destination, parameters) {
            return request('PUT', destination, parameters);
        },
        delete: function(destination) {
            return request('DELETE', destination);
        }
    };
}]);