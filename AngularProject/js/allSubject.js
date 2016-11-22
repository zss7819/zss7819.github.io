//全部题目管理  allSubject.html页面内的控制器和服务等
var appAll = angular.module("app.allSub",[]);
appAll.controller("allSubCtrl",["$scope","$location","$routeParams","allSubService","subjectService",function($scope, $location, $routeParams, allSubService,subjectService){
	//双向数据绑定的值
	$scope.params = $routeParams;
	allSubService.getSubjectType(function(data){
		$scope.types = data;
	});
	allSubService.getSubjectLevel(function(data){
		$scope.levels = data;
	});
	allSubService.getSubjectDepartment(function(data){
		$scope.departments = data;
	});
	//联动	根据方向id获取该方向下的所有知识点
	allSubService.getSubjectTopics($routeParams.c, function(data){
		$scope.topics = data;
	});
	
	//获取题目信息
	subjectService.getAllSubjects($scope.params,function(subjects){
		subjects.forEach(function(item,index){
			//分别拿到每一题	然后拿到每一题对应的choices:ABCD项
			//由于这里很多数据是不正确的，没有按正确格式添加，所以要进行判断再进行操作
			if (item["choices"] != null) {
				item["choices"].forEach(function(choice,index){
					choice.no= allSubService.convertIndexTo(index);
				});
				//处理正确答案  判断题型是单选还是多选，简答不用处理 
				var answer = [];
				if (item.subjectType.id != 3 && item.subjectType!=null) {
					item["choices"].forEach(function(choice,index){
						if (choice.correct) {
							answer.push(choice.no);
						}
					});
					item.answer = answer.join(",")
				}
			}
		});
		$scope.subjects = subjects;
	});
	
	//点击添加题目跳转页面	.icon_r
	$scope.addSubject = function(){
		$location.path("/singleSubject");
		angular.element(document).find(".baseUI>li>ul>li").eq(1).addClass("current").siblings().removeClass("current");
	}
	$scope.subs = {
		typeId:1,
		levelId:1,
		deptId:1,
		topicId:1,
		stem:"",
		answer:"",
		analysis:"",
		choiceContent:[],
	 	choiceCorrect:[]
	};
	//保存并继续	save()
	$scope.save = function(){
		subjectService.addSubjects($scope.subs);
		//保存之后需要置空某些选项、	回到初始化的状态
		var subject = {
			typeId:1,
			levelId:1,
			deptId:1,
			topicId:1,
			stem:"",
			answer:"",
			analysis:"",
			choiceContent:[],
	 		choiceCorrect:[]
		}
		angular.copy(subject,$scope.subs);
	}
	//保存并关闭	跳转回到原来的页面
	$scope.saveAndClose = function(){
		subjectService.addSubjects($scope.subs);
		$location.path("/loadhtml/allSubject/a/0/b/0/c/0/d/0");
	}
}]);

//定义服务	从后台或者json加载数据
appAll.provider('allSubService',function(){
	this.$get = function($http){
		return {
			getSubjectType: function(foo){
				$http({url:"data/subjectType.json"}).success(function(data){
//				$http.get("http://172.16.0.5:7777/test/exam/manager/getAllSubjectType.action").success(function(data){
					foo(data);
				});
			},
			getSubjectLevel: function(foo){
				$http.get("data/subjectLevel.json").then(function(res){
//				$http.get("http://172.16.0.5:7777/test/exam/manager/getAllSubjectLevel.action").then(function(res){
					foo(res.data);
				},function(){
					alert("请求失败");
				});
			},
			getSubjectDepartment: function(foo){
				$http.get("data/subjectDepartment.json").success(function(data){
//				$http.get("http://172.16.0.5:7777/test/exam/manager/getAllDepartmentes.action").success(function(data){
					foo(data);
				});
			},
			getSubjectTopics: function(depId,foo){
				var topicId={};
				topicId['topic.department.id'] = depId;
				$http.get("data/subjectTopics.json").success(function(data){
//				$http.get("http://172.16.0.5:7777/test/exam/manager/getAllTopics.action").success(function(data){
					foo(data);
				});
			},
			convertIndexTo: function(index){
				return index==0 ? "A" : ( index==1?"B":(index==2?"C":"D") );
			}
		}
	};
});
//获取题目信息
appAll.service("subjectService",function($http){
	this.getAllSubjects = function(idParams, foo){
		var param = {};
		angular.forEach(idParams,function(item,index){
			if (item != 0) {
				switch (index){
					case "a":
						param['subject.subjectType.id'] = item;
						break;
					case "b":
						param['subject.subjectLevel.id'] = item;
						break;
					case "c":
						param['subject.department.id'] = item;
						break;
					case "d":
						param['subject.topic.id'] = item;
						break;
					default:
						break;
				}
			}
		});
//		$http.get("data/subjects.json",{params:param}).success(function(data){
		$http.get("http://172.16.0.5:7777/test/exam/manager/getAllSubjects.action",{params:param}).success(function(data){
			foo(data);
		});
	}
	//添加题目
	this.addSubjects = function(subs){
		/*var obj={};
		angular.forEach(subs,function(item, index){
			if (item) {	
				//单选和多选没有answer，这时候answer的值是空的
				switch (index){
					case "typeId": obj["subject.subjectType.id"] = item;
						break;
					case "levelId":	obj["subject.subjectLevel.id"] = item;
						break;
					case "deptId": obj["subject.department.id"] = item;
						break;
					case "topicId":	obj["subject.topic.id"] = item;
						break;
					case "stem": obj["subject.stem"] = item;
						break;
					case "answer": obj["subject.answer"] = item;
						break;
					case "analysis": obj["subject.analysis"] = item;
						break;
					case "choiceContent": obj["choiceContent"] = item;
						break;
					case "choiceCorrect": obj["choiceCorrect"] = item;
						break;
					default:
						break;
				}
			}
		});	*/
		var obj = packParameters(subs);
		//$http.get("#",{params:param}).then(function(res){
		$http.get("http://172.16.0.5:7777/test/exam/manager/saveSubject.action",{params:obj}).success(function(data){	
			alert(data);
		});
		//post提交的时候	enctype一定要设置:enctype="application/x-www-form-urlencoded"	数据要序列化
		/*obj = $httpParamSerializer(obj);
		$http.post("#",obj,{
			header:{
				"con"
			}
		}).success(function(res){
			
		});*/
	}
	//保存并关闭
	this.saveAndClose = function(subs){
		var obj = packParameters(subs);
		$http.get("http://172.16.0.5:7777/test/exam/manager/saveSubject.action",{params:obj}).success(function(data){	
			alert(data);
		});
	}
	//删除题目
	this.deleteSubject = function(id){
		$http.get("http://172.16.0.5:7777/test/exam/manager/delSubject.action",{params:{"subject.id":id}}).success(function(data){
			alert(data);
		})
	}
	//审核通过和不通过
	this.subjectIsPass = function(id, pass, foo){
		$http.get("http://172.16.0.5:7777/test/exam/manager/checkSubject.action",{
			params:{"subject.id":id, "subject.checkState":pass}
		}).success(function(data){
			foo(data);
		});
	}
});

appAll.controller("deleteSubCtrl",function($scope,$routeParams,$location,subjectService){
	subjectService.deleteSubject($routeParams.id);
	$location.path("/loadhtml/allSubject/a/0/b/0/c/0/d/0");
});

//审核通过和审核不通过
appAll.controller("passCtrl",["$routeParams","subjectService","$location",function($routeParams, subjectService, $location){
	console.log($routeParams)
	subjectService.subjectIsPass($routeParams.id, $routeParams.checkState, function(data){
		alert(data);
		$location.path("/loadhtml/allSubject/a/0/b/0/c/0/d/0");
	});
}]);

appAll.config(function($routeProvider){
	$routeProvider.when("/singleSubject",{
		templateUrl:"loadhtml/addSubject.html",
		controller:"allSubCtrl"
	}).when("/deleteSubject/id/:id",{
		templateUrl:"loadhtml/allSubject.html",
		controller:"deleteSubCtrl"
	}).when("/subjectIsPass/id/:id/check/:checkState",{
		templateUrl:"loadhtml/allSubject.html",
		controller:"passCtrl"
	});
});

//定义一个过滤器	知识点根据方向进行展示	先选择到方向的select框的值
appAll.filter("findTopic",function(){
	return function(topics,deptId){
		if(topics){
			var arr = topics.filter(function(topics){
				return	topics.department.id == deptId;	//系统过滤器会返回true的选项
			});
		}
		return arr;
	};
});

//自定义一个指令	给input绑定事件	
//scope.$digest()强制更改比它权限大的值
appAll.directive("selectAnswer",function(){
	return{
		link:function(scope,element){
			//element就是input
			//单选和多选处理起来不一样	分开处理
			if (element.attr("type") == "radio") {	//单选题
				scope.subs.choiceCorrect = [false,false,false,false];//初始化
				element.on("change",function(){
					//val是每个答案选项对应的下标，存储到数组中的相应位置
					var val = $(this).attr("value");
					for (var index=0; index<4; index++) {
						if (index==val) {
							scope.subs.choiceCorrect[index] = true;
						} 
					}
					scope.$digest();
				});
			} else if( element.attr("type") == "checkbox" ){	//多选题
				scope.subs.choiceCorrect = [false,false,false,false];//初始化
				element.on("change",function(){
					console.log(scope.subs.choiceCorrect)
					var val = $(this).attr("value");
					if ( $(this).prop("checked") ) {	//被选中
						for (var index=0; index<4; index++) {
							if(index==val){
								scope.subs.choiceCorrect[index] = true;
							}
						}
					}else{
						scope.subs.choiceCorrect[val] = false;
					}
					scope.$digest();
				});
			}
		}
	};
});

//定义一个指令，来清除上次所选的内容
appAll.directive("removeSub",function(){
	return{
		link:function(scope,element){
			element.on("click",function(){
				scope.subs.choiceContent=[];
				scope.subs.choiceCorrect=[false,false,false,false];
				scope.subs.stem = "";
				scope.subs.answer = "";
				scope.subs.analysis = "";
				scope.$digest();//强制更新内容
			})
		}
	}
})

//方法，保存添加的题目时封装对象
function packParameters(subs){
	var obj={};
	angular.forEach(subs,function(item, index){
		if (item) {	
			//单选和多选没有answer，这时候answer的值是空的
			switch (index){
				case "typeId": obj["subject.subjectType.id"] = item;
					break;
				case "levelId":	obj["subject.subjectLevel.id"] = item;
					break;
				case "deptId": obj["subject.department.id"] = item;
					break;
				case "topicId":	obj["subject.topic.id"] = item;
					break;
				case "stem": obj["subject.stem"] = item;
					break;
				case "answer": obj["subject.answer"] = item;
					break;
				case "analysis": obj["subject.analysis"] = item;
					break;
				case "choiceContent": obj["choiceContent"] = item;
					break;
				case "choiceCorrect": obj["choiceCorrect"] = item;
					break;
				default:
					break;
			}
		}
	});
	return obj;
}
