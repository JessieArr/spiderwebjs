

spiderwebCtrl = function($scope){
	$scope.test = "testing!";
	$scope.session = $spiderweb.session;
	
	$scope.$watch('session');
	
	setInterval(function(){ $scope.$apply(); }, 100);
};