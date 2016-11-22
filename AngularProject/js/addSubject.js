appTitle = angular.module("app.addSub",[]);
appTitle.controller("addSubCtrl",["$scope","$filter","allSubjectService", function($scope, $filter, allSubjectService){
	allSubjectService.getSubjectType(function(types){
		$scope.types = types;
		console.log(types)
	});
	allSubjectService.getSubjectLevel(function(levels){
		$scope.levels = levels;
	});
	allSubjectService.getSubjectDepartment(function(departments){
		$scope.departments = departments;
	});
	allSubjectService.getSubjectTopics(function(topics){
		$scope.topics = topics;                                                                                                                              
	});
	                                                                     
	
}]);

//使用服务获取	类型、难度、方向、知识点的数据	展示到select
appTitle.factory("allSubjectService",function($http){
	var obj = {
		getSubjectType: function(foo){
			$http({url:"data/subjectType.json"}).success(function(data){
				foo(data);
			});
		},
		getSubjectLevel: function(foo){
			$http.get("data/subjectLevel.json").then(function(res){
				foo(res.data);
			},function(){
				alert("请求失败");
			});
		},
		getSubjectDepartment: function(foo){
			$http.get("data/subjectDepartment.json").success(function(data){
				foo(data);
			});
		},
		getSubjectTopics: function(foo){
			$http.get("data/subjectTopics.json").success(function(data){
				foo(data);
			});
		}
	};
	return obj;
});
