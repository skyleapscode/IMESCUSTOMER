
/// <reference path="controllers/AcademicSetupController.js" />
/***
Metronic AngularJS App Main Script
***/

/* Metronic App */
var MetronicApp = angular.module('MetronicApp', ['ui.router', 'ui.bootstrap', 'oc.lazyLoad']);

/* Configure ocLazyLoader(refer: https://github.com/ocombe/ocLazyLoad) */
MetronicApp.config(['$ocLazyLoadProvider', function ($ocLazyLoadProvider) {
    $ocLazyLoadProvider.config({
        // global configs go here
    });
}]);

//AngularJS v1.3.x workaround for old style controller declarition in HTML
MetronicApp.config(['$controllerProvider', function ($controllerProvider) {
    // this option might be handy for migrating old apps, but please don't use it
    // in new ones!
    $controllerProvider.allowGlobals();
}]);

/********************************************
 END: BREAKING CHANGE in AngularJS v1.3.x:
*********************************************/

MetronicApp.factory('Excel', function ($window) {
    var uri = 'data:application/vnd.ms-excel;base64,',
        template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
        base64 = function (s) { return $window.btoa(unescape(encodeURIComponent(s))); },
        format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) };
    return {
        tableToExcel: function (tableId, worksheetName) {
            var table = $(tableId),
                ctx = { worksheet: worksheetName, table: table.html() },
                href = uri + base64(format(template, ctx));
            return href;
        }
    };
})



/* Setup global settings */
MetronicApp.factory('settings', ['$rootScope', '$http', '$location', '$filter', '$window', function ($rootScope, $http, $location, $filter, $window) {

    // supported languages
    get_IP = function () {
        var json = '';
        $http.get('http://ipv4.myexternalip.com/json').then(function (result) {
            $rootScope.settings.ipAddress = result.data.ip;
        }, function (e) {
        });
    }

    get_IP();

    var settings = {
        layout: {
            pageSidebarClosed: false, // sidebar menu state
            pageContentWhite: true, // set page content layout
            pageBodySolid: false, // solid body color state
            pageAutoScrollOnLoad: 1000 // auto scroll to top on page load
        },
        url: '',
    };
    $rootScope.settings = settings;

    $rootScope.settings.getdatefunction = function (date) {
        //if (output == 1) {
        if ($filter('date')(new Date(date), 'dd-MM-yyyy') != 'Invalid Date') {
            date = $filter('date')(new Date(date), 'MM-dd-yyyy');
        }
        var dd = date.replace(/\./g, "-");
        dd = dd.replace(/\//g, "-");
        //var dd = d.grn_date_time.replace(".", "-");
        var from = dd.split("-");
        dd = new Date(from[2], from[1] - 1, from[0]);
        //var d = new Date(comp.work_order_start_date);
        dd.setMinutes(dd.getMinutes() - dd.getTimezoneOffset());
        return dd;
    }

    $rootScope.settings.getdateExcel = function (date) {
        if (date.indexOf('.') >= 1) {
            var replace_date = date.replace(/\./g, '-')
            if (replace_date.indexOf('/') != -1) {
                var replace_date = replace_date.replace(/\//g, '-')
                var str = replace_date;
                //var temp = new Array();
                var temp = str.split("-");
                //var a_date = temp[0];
                //var a_month = temp[1];
                //var a_year = temp[2];
                //var d_date = (a_month + '/' + a_date + '/' + a_year);
                var d = new Date(temp[2], temp[1] - 1, temp[0]);
                return d;
            }
            else {
                var str = replace_date;
                var temp = new Array();
                var temp = str.split("-");
                //var a_date = temp[0];
                //var a_month = temp[1];
                //var a_year = temp[2];
                //var d_date = (a_month + '/' + a_date + '/' + a_year);
                var d = new Date(temp[2], temp[1] - 1, temp[0]);
                return d;
            }
        }
        else if (date.indexOf('.') == -1) {
            //if ($filter('date')(new Date(date), 'dd-MM-yyyy') != 'Invalid Date') {
            //    date = $filter('date')(new Date(date), 'MM-dd-yyyy');
            //}
            //var replace_date = date.replace(/\//g, '-')
            //var str = replace_date;
            ////var temp = new Array();
            //var temp = str.split("-");
            ////var a_date = temp[0];
            ////var a_month = temp[1];
            ////var a_year = temp[2];
            //var d = new Date(temp[2], temp[1] - 1, temp[0]);
            //return d;
            //// var d = new Date(d_date);
            var replace_date = date.replace(/\//g, '-')
            var str = replace_date;
            var temp = new Array();
            temp = str.split("-");
            var a_date = temp[0];
            var a_month = temp[1];
            var a_year = temp[2];
            var d = (a_date + '/' + a_month + '/' + a_year);
            return d
        }
    }


    $rootScope.showNotification = function (text) {
        $.bootstrapGrowl(text, {
            ele: 'body',
            type: 'danger',
            offset: { from: 'top', amount: 10 },
            align: 'center',
            width: 500,
            delay: 5000,
            allow_dismiss: 1,
            stackup_spacing: 10
        });
    }


    $rootScope.goHome = function () {
        $location.path('/' + $rootScope.settings.homePage);
    }

    $rootScope.successNotification = function () {
        var shortCutFunction = 'success';
        var msg = 'This is imman ye!';
        var title = 'Sample Imman';
        toastr.options.showDuration = '1000';
        toastr.options.hideDuration = '1000';
        toastr.options.timeOut = '10000';
        toastr.options.extendedTimeOut = '1000';
        toastr.options.showEasing = 'swing';
        toastr.options.hideEasing = 'linear';
        toastr.options.showMethod = 'fadeIn';
        toastr.options.hideMethod = 'fadeOut';
        var $toast = toastr['success']('Save/Update Successful!', 'Record Inserted!');
        $toastlast = $toast;
    };
    $rootScope.successSMSNotification = function () {
        var shortCutFunction = 'success';
        toastr.options.showDuration = '1000';
        toastr.options.positionClass = 'toast-top-center';
        toastr.options.hideDuration = '1000';
        toastr.options.timeOut = '10000';
        toastr.options.extendedTimeOut = '1000';
        toastr.options.showEasing = 'swing';
        toastr.options.hideEasing = 'linear';
        toastr.options.showMethod = 'fadeIn';
        toastr.options.hideMethod = 'fadeOut';
        var $toast = toastr['success']('SMS Sent Successfully..', 'Success');
        $toastlast = $toast;
    };
    $rootScope.successPaymentNotification = function () {
        var shortCutFunction = 'success';
        toastr.options.showDuration = '1000';
        toastr.options.positionClass = 'toast-top-center';
        toastr.options.hideDuration = '1000';
        toastr.options.timeOut = '10000';
        toastr.options.extendedTimeOut = '1000';
        toastr.options.showEasing = 'swing';
        toastr.options.hideEasing = 'linear';
        toastr.options.showMethod = 'fadeIn';
        toastr.options.hideMethod = 'fadeOut';
        var $toast = toastr['success']('Payment Success');
        $toastlast = $toast;
    };
    $rootScope.infoNotification = function (title, msg) {
        toastr.options.showDuration = '1000';
        toastr.options.hideDuration = '1000';
        toastr.options.timeOut = '10000';
        toastr.options.extendedTimeOut = '1000';
        toastr.options.showEasing = 'swing';
        toastr.options.hideEasing = 'linear';
        toastr.options.showMethod = 'fadeIn';
        toastr.options.hideMethod = 'fadeOut';
        var $toast = toastr['info'](msg, title);
        $toastlast = $toast;
    };

    $rootScope.warningNotification = function (msg, title) {
        toastr.options.showDuration = '1000';
        toastr.options.hideDuration = '1000';
        toastr.options.timeOut = '10000';
        toastr.options.extendedTimeOut = '1000';
        toastr.options.showEasing = 'swing';
        toastr.options.hideEasing = 'linear';
        toastr.options.showMethod = 'fadeIn';
        toastr.options.hideMethod = 'fadeOut';
        var $toast = toastr['warning'](title, msg);
        $toastlast = $toast;
    };

    $rootScope.errorNotification = function () {
        var shortCutFunction = 'error';
        var msg = 'This is imman ye!';
        var title = 'Sample Imman';
        toastr.options.showDuration = '1000';
        toastr.options.hideDuration = '1000';
        toastr.options.timeOut = '10000';
        toastr.options.extendedTimeOut = '1000';
        toastr.options.showEasing = 'swing';
        toastr.options.hideEasing = 'linear';
        toastr.options.showMethod = 'fadeIn';
        toastr.options.hideMethod = 'fadeOut';
        var $toast = toastr['error']('Something went Wrong!!', 'Error!!!');
        $toastlast = $toast;
    };

    return settings;

}]);


/* Init global settings and run the app */
MetronicApp.run(["$rootScope", "settings", "$state", "$window", "$location", "$http", function ($rootScope, settings, $state, $window, $location, $http) {
    //if ($rootScope.settings.paymentStatus1 == 1) {
    //    $location.path('/Fee');
    //    //alert("Page redirected from payment gateway");
    //}
    $rootScope.$state = $state; // state to be accessed from view
    $rootScope.$settings = settings; // settings to be accessed from view






}]);

/* Init global settings and run the app */
MetronicApp.run(["$rootScope", "settings", "$state", "$window", function ($rootScope, settings, $state, $window) {
    $rootScope.$state = $state; // state to be accessed from view
    $rootScope.$settings = settings; // settings to be accessed from view

}]);


/* Setup App Main Controller */
MetronicApp.controller('AppController', ['$scope', '$rootScope', '$window', '$location', function ($scope, $rootScope, $window, $location) {
    $scope.$on('$viewContentLoaded', function () {
        //App.initComponents(); // init core components
        //Layout.init(); //  Init entire layout(header, footer, sidebar, etc) on page load if the partials included in server side instead of loading with ng-include directive 

    });
    localStorage.setItem('url', '');

    $scope.redirectVendorSearch = function (searchtext) {
        //$window.location.href = '#/category.html';
        // $location.path('/category');
        localStorage.setItem('searchText', searchtext);
        localStorage.setItem('searchRedirect', 'index.html');
        $window.location = "/VendorSearch.html";
    }

    $scope.redirect = function () {
        //$window.location.href = '#/category.html';
        // $location.path('/category');
        localStorage.setItem('CatId', 0);
        localStorage.setItem('subCatid', 0);
        localStorage.setItem('Catid', 0);
        localStorage.setItem('SubsubcatName', '');
        $window.location = "/category.html";
    }

}]);

MetronicApp.controller('CategoryController', ['$scope', '$rootScope', '$window', '$location', '$http', function ($scope, $rootScope, $window, $location, $http) {
    $scope.$on('$viewContentLoaded', function () {
        //App.initComponents(); // init core components
        //Layout.init(); //  Init entire layout(header, footer, sidebar, etc) on page load if the partials included in server side instead of loading with ng-include directive 

    });
    $scope.url = '';
    $scope.category = [];
    $scope.geturl = function () {
        if (localStorage.getItem('url') == '') {
            $http.post('http://imesapi.evalai.com/api/StaticData/GetStaticMasterData', {

                'mstLookUpID': 10020

            }).success(function (data) {
                $scope.url = data.data[0].lookupValue;
                localStorage.setItem('url', $scope.url);
                $scope.getCategory();
            });
        } else {
            $scope.getCategory();
        }

    }


    $scope.getCategory = function () {
        $http.post('http://imesapi.evalai.com/api/StaticData/GetIndustryNames', {

            'mstIndCatID': 10003

        }).success(function (data) {
            $scope.category = data.data;
            for (var i = 0; i < $scope.category.length; i++) {
                $scope.category[i].url = localStorage.getItem('url') + $scope.category[i].cldIDImageUrlPath;
            }
        });
    };

    $scope.redirectSubcat = function (catid) {
        localStorage.setItem('CatId', catid);
        //$window.location.href = '#/category.html';
        // $location.path('/category');
        $window.location = "/SubCategory.html";
    }

    $scope.redirect = function () {
        //$window.location.href = '#/category.html';
        // $location.path('/category');
        localStorage.setItem('CatId', 0);
        localStorage.setItem('subCatid', 0);
        localStorage.setItem('Catid', 0);
        localStorage.setItem('SubsubcatName', '');
        $window.location = "/category.html";
    }

    $scope.redirectVendorSearch = function (searchtext) {
        //$window.location.href = '#/category.html';
        // $location.path('/category');
        localStorage.setItem('searchText', searchtext);
        localStorage.setItem('searchRedirect', 'category.html');
        $window.location = "/VendorSearch.html";
    }

}]);

MetronicApp.controller('SubCategoryController', ['$scope', '$rootScope', '$window', '$location', '$http', function ($scope, $rootScope, $window, $location, $http) {
    $scope.$on('$viewContentLoaded', function () {
        //App.initComponents(); // init core components
        //Layout.init(); //  Init entire layout(header, footer, sidebar, etc) on page load if the partials included in server side instead of loading with ng-include directive 

    });

    $scope.url = '';
    $scope.subCat = [];
    $scope.geturl1 = function () {
        if (localStorage.getItem('url') == '') {
            $http.post('http://imesapi.evalai.com/api/StaticData/GetStaticMasterData', {

                'mstLookUpID': 10020

            }).success(function (data) {
                $scope.url = data.data[0].lookupValue;
                localStorage.setItem('url', $scope.url);
                $scope.getSubCategory();
            });
        } else {
            $scope.getSubCategory();
        }

    }

    $scope.getSubCategory = function () {

        $http.post('http://imesapi.evalai.com/api/StaticData/GetIndustryNames', {

            'mstIndCatID': localStorage.getItem('CatId')

        }).success(function (data) {
            $scope.subCat = data.data;

            for (var i = 0; i < $scope.subCat.length; i++) {
                $scope.subCat[i].url = localStorage.getItem('url') + $scope.subCat[i].cldIDImageUrlPath;
            }

        });
    };

    $scope.redirectSubSubcat = function (subCatid,cldId) {
        localStorage.setItem('subCatid', subCatid);
        localStorage.setItem('cldId', cldId);
        //$window.location.href = '#/category.html';
        // $location.path('/category');
        $window.location = "/SubSubCategory.html";
    }

    $scope.redirect = function () {
        //$window.location.href = '#/category.html';
        // $location.path('/category');
        localStorage.setItem('CatId', 0);
        localStorage.setItem('subCatid', 0);
        localStorage.setItem('Catid', 0);
        localStorage.setItem('SubsubcatName', '');
        $window.location = "/category.html";
    }

    $scope.redirectVendorSearch = function (searchtext) {
        //$window.location.href = '#/category.html';
        // $location.path('/category');
        localStorage.setItem('searchText', searchtext);
        localStorage.setItem('searchRedirect', 'SubCategory.html');
        $window.location = "/VendorSearch.html";
    }

}]);


MetronicApp.controller('SubSubCategoryController', ['$scope', '$rootScope', '$window', '$location', '$http', function ($scope, $rootScope, $window, $location, $http) {
    $scope.$on('$viewContentLoaded', function () {
        //App.initComponents(); // init core components
        //Layout.init(); //  Init entire layout(header, footer, sidebar, etc) on page load if the partials included in server side instead of loading with ng-include directive 

    });


    $scope.url = '';
    $scope.SubsubCat = [];
    $scope.geturl2 = function () {
        if (localStorage.getItem('url') == '') {
            $http.post('http://imesapi.evalai.com/api/StaticData/GetStaticMasterData', {

                'mstLookUpID': 10020

            }).success(function (data) {
                $scope.url = data.data[0].lookupValue;
                localStorage.setItem('url', $scope.url);
                $scope.getSubSubCategory();
            });
        }
        else {
            $scope.getSubSubCategory();
        }

    }

    $scope.getSubSubCategory = function () {

        $http.post('http://imesapi.evalai.com/api/StaticData/GetIndustryNames', {

            'mstIndCatID': localStorage.getItem('subCatid')

        }).success(function (data) {
            $scope.SubsubCat = data.data;

            for (var i = 0; i < $scope.SubsubCat.length; i++) {
                $scope.SubsubCat[i].url = localStorage.getItem('url') + $scope.SubsubCat[i].cldIDImageUrlPath;
            }

        });
    };


    $scope.redirectVendorBrand = function (Catid, name) {
        localStorage.setItem('Catid', Catid);
        localStorage.setItem('SubsubcatName', name);
        //$window.location.href = '#/category.html';
        // $location.path('/category');
        $window.location = "/VendorBrand.html";
    }

    $scope.redirect = function () {
        //$window.location.href = '#/category.html';
        // $location.path('/category');
        localStorage.setItem('CatId', 0);
        localStorage.setItem('subCatid', 0);
        localStorage.setItem('Catid', 0);
        localStorage.setItem('SubsubcatName', '');
        $window.location = "/category.html";
    }

    $scope.redirectVendorSearch = function (searchtext) {
        //$window.location.href = '#/category.html';
        // $location.path('/category');
        localStorage.setItem('searchText', searchtext);
        localStorage.setItem('searchRedirect', 'SubSubCategory.html');
        $window.location = "/VendorSearch.html";
    }

}]);


MetronicApp.controller('VendorBrandController', ['$scope', '$rootScope', '$window', '$location', '$http', function ($scope, $rootScope, $window, $location, $http) {
    $scope.$on('$viewContentLoaded', function () {
        //App.initComponents(); // init core components
        //Layout.init(); //  Init entire layout(header, footer, sidebar, etc) on page load if the partials included in server side instead of loading with ng-include directive 

    });


    $scope.url = '';
    $scope.VendorBrand = [];
    $scope.topBrands = [];
    $scope.Brand = [];
    $scope.catName = '';
    $scope.geturl3 = function () {
        if (localStorage.getItem('url') == '') {
            $http.post('http://imesapi.evalai.com/api/StaticData/GetStaticMasterData', {

                'mstLookUpID': 10020

            }).success(function (data) {
                $scope.url = data.data[0].lookupValue;
                localStorage.setItem('url', $scope.url);
                $scope.VendorBrandList();
            });
        } else {
            $scope.VendorBrandList();
        }

    }

    $scope.VendorBrandList = function () {

        $http.post('http://imesapi.evalai.com/api/StaticData/GetMobVendorDetails', {

            'categoryID': localStorage.getItem('Catid'),
            'mode': 'GET_VENDOR_DETAIl'

        }).success(function (data) {
            $scope.VendorBrand = data.data;
            $scope.catName = localStorage.getItem('SubsubcatName');
            for (var i = 0; i < $scope.VendorBrand.length; i++) {
                $scope.VendorBrand[i].url = localStorage.getItem('url') + $scope.VendorBrand[i].shopImageUrlPath;
            }
            for (var i = 0; i < $scope.VendorBrand.length; i++) {
                if (i < 3) {
                    $scope.topBrands[$scope.topBrands.length] = $scope.VendorBrand[i];
                }

            }
            $scope.getBrandList();
            //for (var i = 0; i < $scope.topBrands.length; i++) {
            //    $scope.Brand[$scope.Brand.length] = $scope.topBrands[i];

            //}
        });
    };


    $scope.getBrandList = function () {

        $http.post('http://imesapi.evalai.com/api/StaticData/GetMobBrandDetails', {
        'categoryID': localStorage.getItem('cldId'),
            'mode': 'GET_BRAND_DETAIL',
            'vendorRegID': 0

        }).success(function (data) {
            $scope.Brand1 = data.data;

            for (var i = 0; i < $scope.Brand1.length; i++) {
                if (i < 3) {
                    $scope.Brand[i] = $scope.Brand1[i];
                    $scope.Brand[i].url = localStorage.getItem('url') + $scope.Brand1[i].brandImageURL;
                }
            }

            //for (var i = 0; i < $scope.Brand1.length; i++) {
            //    if (i < 3) {
                    
            //    }
            //}

        });
    };



    $scope.redirect = function () {
        //$window.location.href = '#/category.html';
        // $location.path('/category');
        localStorage.setItem('CatId', 0);
        localStorage.setItem('subCatid', 0);
        localStorage.setItem('Catid', 0);
        localStorage.setItem('SubsubcatName', '');
        $window.location = "/category.html";
    }

    $scope.redirectVendorDetails = function (vendorId) {

        //$window.location.href = '#/category.html';
        // $location.path('/category');
        localStorage.setItem('vendorId', vendorId);
        $window.location = "/VendorDetails.html";
    }

    $scope.redirectSubSubcat = function () {
        //$window.location.href = '#/category.html';
        // $location.path('/category');
        $window.location = "/SubSubCategory.html";
    }



    $scope.redirectMap = function () {
        $window.location = "/vendorMap.html";
    }

    $scope.redirectVendorSearch = function (searchtext) {
        //$window.location.href = '#/category.html';
        // $location.path('/category');
        localStorage.setItem('searchText', searchtext);
        localStorage.setItem('searchRedirect', 'VendorBrand.html');
        $window.location = "/VendorSearch.html";
    }

}]);


MetronicApp.controller('VendorDetailsController', ['$scope', '$rootScope', '$window', '$location', '$http', function ($scope, $rootScope, $window, $location, $http) {
    $scope.$on('$viewContentLoaded', function () {
        //App.initComponents(); // init core components
        //Layout.init(); //  Init entire layout(header, footer, sidebar, etc) on page load if the partials included in server side instead of loading with ng-include directive 

    });

    $scope.url = '';
    $scope.VendorBrand = [];
    $scope.topBrands = [];
    $scope.Brand = [];
    $scope.catName = '';
    $scope.geturl4 = function () {
        if (localStorage.getItem('url') == '') {
            $http.post('http://imesapi.evalai.com/api/StaticData/GetStaticMasterData', {

                'mstLookUpID': 10020

            }).success(function (data) {
                $scope.url = data.data[0].lookupValue;
                localStorage.setItem('url', $scope.url);
                $scope.Vendordetails();
            });
        }
        else {
            $scope.Vendordetails();
        }

    }

    $scope.Vendordetails = function () {

        $http.post('http://imesapi.evalai.com/api/StaticData/GetVendorDetailListEach', {

            'vendorRegID': localStorage.getItem('vendorId'),
            'mode': 'GET_VENDOR_DETAIL_EACH'

        }).success(function (data) {
            $scope.VendorDet = data.data[0];
            $scope.VendorDet.url = localStorage.getItem('url') + data.data[0].shopImageUrlPath;
            $scope.mapdetails($scope.VendorDet.vendorLatitude, $scope.VendorDet.vendorLongitude)
            //$scope.catName = localStorage.getItem('SubsubcatName');
            //for (var i = 0; i < $scope.VendorBrand.length; i++) {
            //    $scope.VendorBrand[i].url = $scope.url + $scope.VendorBrand[i].shopImageUrlPath;
            //}
            //for (var i = 0; i < $scope.VendorBrand.length; i++) {
            //    if (i < 3) {
            //        $scope.topBrands[$scope.topBrands.length] = $scope.VendorBrand[i];
            //    }
            //}
            //$scope.getBrandList();
            //for (var i = 0; i < $scope.topBrands.length; i++) {
            //    $scope.Brand[$scope.Brand.length] = $scope.topBrands[i];
            //}
        });
    };


    //$scope.getBrandList = function () {
    //    $http.post('http://imesapi.evalai.com/api/StaticData/GetMobBrandDetails', {
    //        'categoryID': localStorage.getItem('Catid'),
    //        'mode': 'GET_BRAND_DETAIL',
    //        'vendorRegID': 0
    //    }).success(function (data) {
    //        $scope.Brand = data.data;
    //        for (var i = 0; i < $scope.Brand.length; i++) {
    //            if (i < 3) {
    //                $scope.Brand[i].url = $scope.url + $scope.Brand[i].shopImageUrlPath;
    //            }
    //        }
    //    });
    //};
    var map = '';
    $scope.mapdetails = function (lat, long) {

        var lat1 = '', long1 = '';
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                var pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                lat1 = position.coords.latitude;
                long1 = position.coords.longitude;
                map = new google.maps.Map(document.getElementById('map'), {
                    zoom: 10,
                    center: new google.maps.LatLng(lat1, long1),
                    mapTypeId: 'roadmap'
                });
                var marker = '';
                marker = new google.maps.Marker({
                    position: new google.maps.LatLng(lat, long),
                    icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
                    map: map
                });
                $scope.calcRoute(lat, long);
            }, function () {
                handleLocationError(true, infoWindow, map.getCenter());
            });
        } else {
            // Browser doesn't support Geolocation
            handleLocationError(false, infoWindow, map.getCenter());
        }
        
    }

    $scope.calcRoute = function (lat, long) {
        var start = '', end = '';
        var startlat = '', startlong = '';
        var directionsService = new google.maps.DirectionsService();
        var directionsDisplay = new google.maps.DirectionsRenderer();
        navigator.geolocation.getCurrentPosition(function (position) {
            startlat = position.coords.latitude;
            startlong = position.coords.longitude;
            start = new google.maps.LatLng(startlat, startlong);
            end = new google.maps.LatLng(lat, long);
            var bounds = new google.maps.LatLngBounds();
            $scope.showdistance = false;
            $scope.distance = 2;
            //$scope.distance = google.maps.geometry.spherical.computeDistanceBetween(start, end);
            //alert($scope.distance);
            bounds.extend(start);
            bounds.extend(end);
            map.fitBounds(bounds);
            var request = {
                origin: start,
                destination: end,
                travelMode: 'DRIVING',
                unitSystem: google.maps.UnitSystem.IMPERIAL
            };
            directionsService.route(request, function (response, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    directionsDisplay.setDirections(response);
                    directionsDisplay.setMap(map);
                    //var s = document.getElementById('displayDistance');
                    //s.value = response.routes[0].legs[0].distance.text;
                    //var s1 = document.getElementById('displayTime');
                    //s1.value = response.routes[0].legs[0].duration.text;
                    //document.getElementById("displayDistance").val = response.routes[0].legs[0].distance.text;
                    // $scope.distance = response.routes[0].legs[0].distance.text;
                    // alert($scope.distance);
                } else {
                    alert("Directions Request from " + start.toUrlValue(6) + " to " + end.toUrlValue(6) + " failed: " + status);
                }
            });
        })
        if (directionsDisplay == null) {
            directionsDisplay = new google.maps.DirectionsRenderer();
        }

        directionsDisplay.setOptions({ suppressMarkers: true })



        //start = end;
        //end = new google.maps.LatLng(lat, long);
        //$scope.showdistance = false;
        //$scope.distance = 1;
        ////$scope.distance = google.maps.geometry.spherical.computeDistanceBetween(start, end);
        ////alert($scope.distance);
        //if (directionsDisplay != null) {
        //    directionsDisplay.setMap(null);
        //    directionsDisplay = null;
        //}
        //directionsDisplay = new google.maps.DirectionsRenderer();
        //directionsDisplay.setOptions({ suppressMarkers: true })
        //var bounds = new google.maps.LatLngBounds();
        //bounds.extend(start);
        //bounds.extend(end);
        //map.fitBounds(bounds);
        //var request = {
        //    origin: start,
        //    destination: end,
        //    travelMode: google.maps.TravelMode.DRIVING,
        //    unitSystem: google.maps.UnitSystem.IMPERIAL
        //};
        //directionsService.route(request, function (response, status) {
        //    if (status == google.maps.DirectionsStatus.OK) {
        //        //directionsDisplay.set('directions', null);
        //        directionsDisplay.setDirections(response);
        //        directionsDisplay.setMap(map);
        //        var s = document.getElementById('displayDistance');
        //        s.value = response.routes[0].legs[0].distance.text;
        //        var s1 = document.getElementById('displayTime');
        //        s1.value = response.routes[0].legs[0].duration.text;

        //    } else {
        //        alert("Directions Request from " + start.toUrlValue(6) + " to " + end.toUrlValue(6) + " failed: " + status);
        //    }
        //});


    }

    $scope.redirect = function () {
        //$window.location.href = '#/category.html';
        // $location.path('/category');
        localStorage.setItem('CatId', 0);
        localStorage.setItem('subCatid', 0);
        localStorage.setItem('Catid', 0);
        localStorage.setItem('SubsubcatName', '');
        $window.location = "/category.html";
    }


    $scope.redirectVendorSearch = function (searchtext) {
        //$window.location.href = '#/category.html';
        // $location.path('/category');
        localStorage.setItem('searchText', searchtext);
        localStorage.setItem('searchRedirect', 'VendorDetails.html');
        $window.location = "/VendorSearch.html";
    }

}]);



MetronicApp.controller('VendorMapController', ['$scope', '$rootScope', '$window', '$location', '$http', function ($scope, $rootScope, $window, $location, $http) {
    $scope.$on('$viewContentLoaded', function () {
        //App.initComponents(); // init core components
        //Layout.init(); //  Init entire layout(header, footer, sidebar, etc) on page load if the partials included in server side instead of loading with ng-include directive 

    });

    $scope.url = '';
    $scope.VendorBrand = [];
    $scope.topBrands = [];
    $scope.Brand = [];
    $scope.catName = '';
    $scope.geturl4 = function () {
        if (localStorage.getItem('url') == '') {
            $http.post('http://imesapi.evalai.com/api/StaticData/GetStaticMasterData', {

                'mstLookUpID': 10020

            }).success(function (data) {
                $scope.url = data.data[0].lookupValue;
                localStorage.setItem('url', $scope.url);
                $scope.Vendordetails();
            });
        }
        else {
            $scope.VendorBrandList();
        }

    }

    $scope.VendorBrandList = function () {

        $http.post('http://imesapi.evalai.com/api/StaticData/GetMobVendorDetails', {

            'categoryID': localStorage.getItem('Catid'),
            'mode': 'GET_VENDOR_DETAIl'

        }).success(function (data) {
            $scope.VendorBrand = data.data;

            //$scope.catName = localStorage.getItem('SubsubcatName');
            //for (var i = 0; i < $scope.VendorBrand.length; i++) {
            //    $scope.VendorBrand[i].url = localStorage.getItem('url') + $scope.VendorBrand[i].shopImageUrlPath;
            //}

            //for (var i = 0; i < $scope.topBrands.length; i++) {
            //    $scope.Brand[$scope.Brand.length] = $scope.topBrands[i];

            //}
            $scope.mapdetails();
        });
    };

    var map = '';
    $scope.mapdetails = function () {
        var lat = '', long = '';
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                var pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                lat = position.coords.latitude;
                long = position.coords.longitude;
                map = new google.maps.Map(document.getElementById('map1'), {
                    zoom: 10,
                    center: new google.maps.LatLng(lat, long),
                    mapTypeId: 'roadmap'
                });
                var marker = '', markers = [];;
                for (var i = 0; i < $scope.VendorBrand.length; i++) {
                    marker[i] = new google.maps.Marker({
                        position: new google.maps.LatLng($scope.VendorBrand[i].vendorLatitude, $scope.VendorBrand[i].vendorLongitude),
                        icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
                        map: map
                    });
                    markers.push(marker[i]);
                }
            }, function () {
                handleLocationError(true, infoWindow, map.getCenter());
            });
        } else {
            // Browser doesn't support Geolocation
            handleLocationError(false, infoWindow, map.getCenter());
        }


        //$scope.calcRoute(lat, long);
        //$scope.calcRoute(13.067439, 80.237617);
    }

    $scope.calcRoute = function (lat, long) {
        var start = '', end = '';
        var startlat = '', startlong = '';
        var directionsService = new google.maps.DirectionsService();
        var directionsDisplay = new google.maps.DirectionsRenderer();
        navigator.geolocation.getCurrentPosition(function (position) {
            startlat = position.coords.latitude;
            startlong = position.coords.longitude;
            start = new google.maps.LatLng(startlat, startlong);
            end = new google.maps.LatLng(lat, long);
            var bounds = new google.maps.LatLngBounds();
            $scope.showdistance = false;
            $scope.distance = 2;
            //$scope.distance = google.maps.geometry.spherical.computeDistanceBetween(start, end);
            //alert($scope.distance);
            bounds.extend(start);
            bounds.extend(end);
            map.fitBounds(bounds);
            var request = {
                origin: start,
                destination: end,
                travelMode: 'DRIVING',
                unitSystem: google.maps.UnitSystem.IMPERIAL
            };
            directionsService.route(request, function (response, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    directionsDisplay.setDirections(response);
                    directionsDisplay.setMap(map);
                    //var s = document.getElementById('displayDistance');
                    //s.value = response.routes[0].legs[0].distance.text;
                    //var s1 = document.getElementById('displayTime');
                    //s1.value = response.routes[0].legs[0].duration.text;
                    //document.getElementById("displayDistance").val = response.routes[0].legs[0].distance.text;
                    // $scope.distance = response.routes[0].legs[0].distance.text;
                    // alert($scope.distance);
                } else {
                    alert("Directions Request from " + start.toUrlValue(6) + " to " + end.toUrlValue(6) + " failed: " + status);
                }
            });
        })
        if (directionsDisplay == null) {
            directionsDisplay = new google.maps.DirectionsRenderer();
        }

        directionsDisplay.setOptions({ suppressMarkers: true })

    }

    $scope.redirect = function () {
        //$window.location.href = '#/category.html';
        // $location.path('/category');
        localStorage.setItem('CatId', 0);
        localStorage.setItem('subCatid', 0);
        localStorage.setItem('Catid', 0);
        localStorage.setItem('SubsubcatName', '');
        $window.location = "/category.html";
    }


    $scope.redirectVendorSearch = function (searchtext) {
        //$window.location.href = '#/category.html';
        // $location.path('/category');
        localStorage.setItem('searchText', searchtext);
        localStorage.setItem('searchRedirect', 'VendorMap.html');
        $window.location = "/VendorSearch.html";
    }

}]);

MetronicApp.controller('VendorSearchController', ['$scope', '$rootScope', '$window', '$location', '$http', function ($scope, $rootScope, $window, $location, $http) {
    $scope.$on('$viewContentLoaded', function () {
        //App.initComponents(); // init core components
        //Layout.init(); //  Init entire layout(header, footer, sidebar, etc) on page load if the partials included in server side instead of loading with ng-include directive 

    });


    $scope.url = '';
    $scope.VendorBrand = [];
    $scope.topBrands = [];
    $scope.Brand = [];
    $scope.catName = '';
    $scope.geturl3 = function () {
        if (localStorage.getItem('url') == '') {
            $http.post('http://imesapi.evalai.com/api/StaticData/GetStaticMasterData', {

                'mstLookUpID': 10020

            }).success(function (data) {
                $scope.url = data.data[0].lookupValue;
                localStorage.setItem('url', $scope.url);
                $scope.VendorBrandList();
            });
        } else {
            $scope.VendorBrandList();
        }

    }

    $scope.VendorBrandList = function () {

        $http.post('http://imesapi.evalai.com/api/StaticData/GetMobVendorDetails', {

            'searchText': localStorage.getItem('searchText'),
            'mode': 'GET_VENDOR_SEARCH'

        }).success(function (data) {
            $scope.VendorBrand = data.data;
            $scope.name = localStorage.getItem('searchText');
            $scope.catName = localStorage.getItem('SubsubcatName');
            for (var i = 0; i < $scope.VendorBrand.length; i++) {
                $scope.VendorBrand[i].url = localStorage.getItem('url') + $scope.VendorBrand[i].shopImageUrlPath;
            }
            //for (var i = 0; i < $scope.topBrands.length; i++) {
            //    $scope.Brand[$scope.Brand.length] = $scope.topBrands[i];

            //}
        });
    };


  



    $scope.redirect = function () {
        //$window.location.href = '#/category.html';
        // $location.path('/category');
        localStorage.setItem('CatId', 0);
        localStorage.setItem('subCatid', 0);
        localStorage.setItem('Catid', 0);
        localStorage.setItem('SubsubcatName', '');
        $window.location = "/category.html";
    }

    $scope.redirectVendorDetails1 = function (vendorId) {

        //$window.location.href = '#/category.html';
        // $location.path('/category');
        localStorage.setItem('vendorId', vendorId);
        $window.location = "/VendorSearchDetails.html";
    }

    $scope.redirectback = function () {
        //$window.location.href = '#/category.html';
        // $location.path('/category');
        $window.location = localStorage.getItem('searchRedirect');
    }

    $scope.redirectVendorSearch = function (searchtext) {
        //$window.location.href = '#/category.html';
        // $location.path('/category');
        localStorage.setItem('searchText', searchtext);
        localStorage.setItem('searchRedirect', 'VendorSearch.html');
        $window.location = "/VendorSearch.html";
    }

    //$scope.redirectMap = function () {
    //    $window.location = "/VendorSearchDetails.html";
    //}
}]);

MetronicApp.controller('VendorSearchDetailsController', ['$scope', '$rootScope', '$window', '$location', '$http', function ($scope, $rootScope, $window, $location, $http) {
    $scope.$on('$viewContentLoaded', function () {
        //App.initComponents(); // init core components
        //Layout.init(); //  Init entire layout(header, footer, sidebar, etc) on page load if the partials included in server side instead of loading with ng-include directive 

    });

    $scope.url = '';
    $scope.VendorBrand = [];
    $scope.topBrands = [];
    $scope.Brand = [];
    $scope.catName = '';
    $scope.geturl4 = function () {
        if (localStorage.getItem('url') == '') {
            $http.post('http://imesapi.evalai.com/api/StaticData/GetStaticMasterData', {

                'mstLookUpID': 10020

            }).success(function (data) {
                $scope.url = data.data[0].lookupValue;
                localStorage.setItem('url', $scope.url);
                $scope.Vendordetails();
            });
        }
        else {
            $scope.Vendordetails();
        }

    }

    $scope.Vendordetails = function () {

        $http.post('http://imesapi.evalai.com/api/StaticData/GetVendorDetailListEach', {

            'vendorRegID': localStorage.getItem('vendorId'),
            'mode': 'GET_VENDOR_DETAIL_EACH'

        }).success(function (data) {
            $scope.VendorDet = data.data[0];
            $scope.VendorDet.url = localStorage.getItem('url') + data.data[0].shopImageUrlPath;
            $scope.mapdetails($scope.VendorDet.vendorLatitude, $scope.VendorDet.vendorLongitude)
            //$scope.catName = localStorage.getItem('SubsubcatName');
            //for (var i = 0; i < $scope.VendorBrand.length; i++) {
            //    $scope.VendorBrand[i].url = $scope.url + $scope.VendorBrand[i].shopImageUrlPath;
            //}
            //for (var i = 0; i < $scope.VendorBrand.length; i++) {
            //    if (i < 3) {
            //        $scope.topBrands[$scope.topBrands.length] = $scope.VendorBrand[i];
            //    }
            //}
            //$scope.getBrandList();
            //for (var i = 0; i < $scope.topBrands.length; i++) {
            //    $scope.Brand[$scope.Brand.length] = $scope.topBrands[i];
            //}
        });
    };


    //$scope.getBrandList = function () {
    //    $http.post('http://imesapi.evalai.com/api/StaticData/GetMobBrandDetails', {
    //        'categoryID': localStorage.getItem('Catid'),
    //        'mode': 'GET_BRAND_DETAIL',
    //        'vendorRegID': 0
    //    }).success(function (data) {
    //        $scope.Brand = data.data;
    //        for (var i = 0; i < $scope.Brand.length; i++) {
    //            if (i < 3) {
    //                $scope.Brand[i].url = $scope.url + $scope.Brand[i].shopImageUrlPath;
    //            }
    //        }
    //    });
    //};
    var map = '';
    $scope.mapdetails = function (lat, long) {

        var lat1 = '', long1 = '';
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                var pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                lat1 = position.coords.latitude;
                long1 = position.coords.longitude;
                map = new google.maps.Map(document.getElementById('map2'), {
                    zoom: 10,
                    center: new google.maps.LatLng(lat1, long1),
                    mapTypeId: 'roadmap'
                });
                var marker = '';
                marker = new google.maps.Marker({
                    position: new google.maps.LatLng(lat, long),
                    icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
                    map: map
                });
                $scope.calcRoute(lat, long);
            }, function () {
                handleLocationError(true, infoWindow, map.getCenter());
            });
        } else {
            // Browser doesn't support Geolocation
            handleLocationError(false, infoWindow, map.getCenter());
        }

    }

    $scope.calcRoute = function (lat, long) {
        var start = '', end = '';
        var startlat = '', startlong = '';
        var directionsService = new google.maps.DirectionsService();
        var directionsDisplay = new google.maps.DirectionsRenderer();
        navigator.geolocation.getCurrentPosition(function (position) {
            startlat = position.coords.latitude;
            startlong = position.coords.longitude;
            start = new google.maps.LatLng(startlat, startlong);
            end = new google.maps.LatLng(lat, long);
            var bounds = new google.maps.LatLngBounds();
            $scope.showdistance = false;
            $scope.distance = 2;
            //$scope.distance = google.maps.geometry.spherical.computeDistanceBetween(start, end);
            //alert($scope.distance);
            bounds.extend(start);
            bounds.extend(end);
            map.fitBounds(bounds);
            var request = {
                origin: start,
                destination: end,
                travelMode: 'DRIVING',
                unitSystem: google.maps.UnitSystem.IMPERIAL
            };
            directionsService.route(request, function (response, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    directionsDisplay.setDirections(response);
                    directionsDisplay.setMap(map);
                    //var s = document.getElementById('displayDistance');
                    //s.value = response.routes[0].legs[0].distance.text;
                    //var s1 = document.getElementById('displayTime');
                    //s1.value = response.routes[0].legs[0].duration.text;
                    //document.getElementById("displayDistance").val = response.routes[0].legs[0].distance.text;
                    // $scope.distance = response.routes[0].legs[0].distance.text;
                    // alert($scope.distance);
                } else {
                    alert("Directions Request from " + start.toUrlValue(6) + " to " + end.toUrlValue(6) + " failed: " + status);
                }
            });
        })
        if (directionsDisplay == null) {
            directionsDisplay = new google.maps.DirectionsRenderer();
        }

        directionsDisplay.setOptions({ suppressMarkers: true })



        //start = end;
        //end = new google.maps.LatLng(lat, long);
        //$scope.showdistance = false;
        //$scope.distance = 1;
        ////$scope.distance = google.maps.geometry.spherical.computeDistanceBetween(start, end);
        ////alert($scope.distance);
        //if (directionsDisplay != null) {
        //    directionsDisplay.setMap(null);
        //    directionsDisplay = null;
        //}
        //directionsDisplay = new google.maps.DirectionsRenderer();
        //directionsDisplay.setOptions({ suppressMarkers: true })
        //var bounds = new google.maps.LatLngBounds();
        //bounds.extend(start);
        //bounds.extend(end);
        //map.fitBounds(bounds);
        //var request = {
        //    origin: start,
        //    destination: end,
        //    travelMode: google.maps.TravelMode.DRIVING,
        //    unitSystem: google.maps.UnitSystem.IMPERIAL
        //};
        //directionsService.route(request, function (response, status) {
        //    if (status == google.maps.DirectionsStatus.OK) {
        //        //directionsDisplay.set('directions', null);
        //        directionsDisplay.setDirections(response);
        //        directionsDisplay.setMap(map);
        //        var s = document.getElementById('displayDistance');
        //        s.value = response.routes[0].legs[0].distance.text;
        //        var s1 = document.getElementById('displayTime');
        //        s1.value = response.routes[0].legs[0].duration.text;

        //    } else {
        //        alert("Directions Request from " + start.toUrlValue(6) + " to " + end.toUrlValue(6) + " failed: " + status);
        //    }
        //});


    }

    $scope.redirect = function () {
        //$window.location.href = '#/category.html';
        // $location.path('/category');
        $window.location = "/VendorSearch.html";
    }

    $scope.redirectVendorSearch = function (searchtext) {
        //$window.location.href = '#/category.html';
        // $location.path('/category');
        localStorage.setItem('searchText', searchtext);
        localStorage.setItem('searchRedirect', 'VendorSearchDetails.html');
        $window.location = "/VendorSearch.html";
    }


}]);

/***
Layout Partials.
By default the partials are loaded through AngularJS ng-include directive. In case they loaded in server side(e.g: PHP include function) then below partial 
initialization can be disabled and Layout.init() should be called on page load complete as explained above.
***/

/* Setup Layout Part - Header */
MetronicApp.controller('HeaderController', ['$window', '$scope', '$http', '$rootScope', '$location', '$filter', '$uibModal', function ($window, $scope, $http, $rootScope, $location, $filter, $uibModal) {
    $scope.$on('$includeContentLoaded', function () {
        Layout.initHeader(); // init header
    });


    //Get Academic Year
    $rootScope.getCurrentacademicyear = function () {
        $http.get('api/AcademicYearMaster/getAcademicYearMaster', {
            params: {
                'org_Id': $rootScope.settings.orgId,
                'academic_Id': 0,
                'mode': 'GETCURRENT'
            }
        }).success(function (data) {
            $rootScope.attedstart_Date = data[0].from_Date1;
            $rootScope.attedend_Date = data[0].to_Date1;
        });
    };


    //$scope.orgProfile = function () {
    //    if ($rootScope.settings.userTypeId == 1) { $location.path('/OrgProfile'); }
    //}







}]);

//* Setup Layout Part - Sidebar */
MetronicApp.controller('SidebarController', ['$rootScope', '$scope', '$http', function ($rootScope, $scope, $http) {
    $scope.$on('$includeContentLoaded', function () {
        ;
        Layout.initSidebar();
        $scope.getAllMenu();
    });
    $scope.getAllMenu = function () {
        var orgId = localStorage.getItem('orgId');
        var roleId = localStorage.getItem('roleId');
        $http.get('api/Sidebar/getSidebarMenu?orgId=' + orgId + '&roleId=' + roleId).success(function (menu) {
            // $http.get('api/Sidebar/getSidebarSubMenu?orgId=' + orgId + '&roleId=' + roleId).success(function (submenu) {
            $scope.SidebarMenu = menu;
            //$scope.SidebarSubMenu = submenu;
            $scope.iteemd = $scope.SidebarMenu[0].main_Menu_Id;
            // $window.alert($scope.iteemd);
            $scope.states = {};
            $scope.states.activeItem = $scope.iteemd;
            $rootScope.mainmenuId = $scope.SidebarMenu[0].main_Menu_Id;
            //});
        });

    };
    $scope.detectmob = function () {
        if (navigator.userAgent.match(/Android/i)
|| navigator.userAgent.match(/webOS/i)
|| navigator.userAgent.match(/iPhone/i)
|| navigator.userAgent.match(/iPad/i)
|| navigator.userAgent.match(/iPod/i)
|| navigator.userAgent.match(/BlackBerry/i)
|| navigator.userAgent.match(/Windows Phone/i)
) {

            $scope.show = true;
        }
        else {
            $scope.show = false;
        }


    }


    $scope.getmainMenuID = function (main) {
        $rootScope.mainmenuId = main;
    }


    $scope.getsubmenuId = function (sub) {
        $rootScope.submenuId = sub;
    }

}]);
/* Setup Layout Part - Quick Sidebar */
MetronicApp.controller('QuickSidebarController', ['$scope', function ($scope) {
    $scope.$on('$includeContentLoaded', function () {
        setTimeout(function () {
            QuickSidebar.init(); // init quick sidebar        
        }, 2000)
    });
}]);

/* Setup Layout Part - Theme Panel */
MetronicApp.controller('ThemePanelController', ['$scope', function ($scope) {
    $scope.$on('$includeContentLoaded', function () {
        //Demo.init(); // init theme panel
    });
}]);

/* Setup Layout Part - Footer */
MetronicApp.controller('FooterController', ['$scope', '$rootScope', '$http', function ($scope, $rootScope, $http) {
    $scope.$on('$includeContentLoaded', function () {
        Layout.initFooter(); // init footer
    });
    var year = new Date().getFullYear();
    $rootScope.copyrightyear = year;

}]);

MetronicApp.directive('dynController', ['$compile', '$parse', function ($compile, $parse) {
    return {
        restrict: 'A',
        terminal: true,
        priority: 100000,
        link: function (scope, elem, attrs) {
            // Parse the scope variable
            var name = $parse(elem.attr('dyn-controller'))(scope);
            elem.removeAttr('dyn-controller');
            elem.attr('ng-controller', name);

            // Compile the element with the ng-controller attribute
            $compile(elem)(scope);
        }
    };
}]);

/* Setup Rounting For All Pages */
MetronicApp.config(['$locationProvider', '$stateProvider', '$urlRouterProvider', function ($locationProvider, $stateProvider, $urlRouterProvider) {
    $stateProvider
        //logout
        .state('Login', {
            url: "/Login.html",
            templateUrl: "/Login.html",
            data: { pageTitle: 'Login' },
            controller: "LoginController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'LoginApp',
                        insertBefore: '#ng_load_plugins_before',
                        files: ['Scripts/LoginApp.js']
                    });
                }]
            }
        })

 // Dashboard
        .state('dashboard', {
            url: "/dashboard",
            templateUrl: "views/dashboard.html",
            data: { pageTitle: 'Dashboard' },
            controller: "DashboardController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: ['../assets/global/plugins/morris/morris.css',
                            '../assets/global/plugins/morris/morris.min.js',
                            '../assets/global/plugins/morris/raphael-min.js',
                            '../assets/global/plugins/jquery.sparkline.min.js',
                            '../assets/pages/scripts/dashboard.min.js',
                            '../assets/global/plugins/amcharts/amcharts/amcharts.js',
                            '../assets/global/plugins/amcharts/amcharts/serial.js',
                            '../assets/global/plugins/amcharts/amcharts/themes/light.js',
                            'Scripts/controllers/DashboardController.js',
                        '../assets/global/plugins/highcharts/js/highcharts.js']
                    });
                }]
            }
        })



    // category
        .state('category', {
            url: "/category",
            templateUrl: "category.html",
            data: { pageTitle: 'category' },
            controller: "CategoryController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'Scripts/main.js',
                        ]
                    });
                }]
            }
        })

        // vendorMap
        .state('vendorMap', {
            url: "/vendorMap",
            templateUrl: "VendorMap.html",
            data: { pageTitle: 'Vendor Map' },
            controller: "VendorMapController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'Scripts/main.js',
                        ]
                    });
                }]
            }
        })


          // Provider Registration detail
        .state('ProviderRegistration', {
            url: "/ProviderRegistration",
            templateUrl: "views/ProviderRegistration.html",
            data: { pageTitle: 'Admin Dashboard Template' },
            controller: "ProviderRegistrationController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before',
                        files: [
                            'Scripts/controllers/ProviderRegistrationController.js',
                        ]
                    });
                }]
            }
        })


          // Provider Registration detail
        .state('SetPassword', {
            url: "/SetPassword",
            templateUrl: "views/SetPassword.html",
            data: { pageTitle: 'Admin Dashboard Template' },
            controller: "ProviderRegistrationController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before',
                        files: [
                            'Scripts/controllers/ProviderRegistrationController.js',
                        ]
                    });
                }]
            }
        })

    // Provider Status
        .state('ProviderStatus', {
            url: "/ProviderStatus",
            templateUrl: "views/ProviderStatus.html",
            data: { pageTitle: 'Admin Provider Status' },
            controller: "ProviderStatusController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before',
                        files: [
                            'Scripts/controllers/ProviderStatusController.js',
                            'Scripts/dirPagination.js'
                        ]
                    });
                }]
            }
        })


         // Child Acceptance
        .state('ChildAcceptance', {
            url: "/ChildAcceptance",
            templateUrl: "views/ChildAcceptance/ChildAcceptance.html",
            data: { pageTitle: 'Child Acceptance' },
            controller: "ChildAcceptanceController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'Scripts/controllers/ChildAcceptanceController.js',
                            'Scripts/dirPagination.js'
                        ]
                    });
                }]
            }
        })


          // Child Details
        .state('ChildDetails', {
            url: "/ChildDetails",
            templateUrl: "views/ChildDetails/ChildDetails.html",
            data: { pageTitle: 'Admin Dashboard Template' },
            controller: "ChildDetailsController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'Scripts/controllers/ChildDetailsController.js'
                        ]
                    });
                }]
            }
        })


    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });


}]);

