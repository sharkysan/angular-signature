/*
 * https://github.com/legalthings/signature-pad-angular
 * Copyright (c) 2015 ; Licensed MIT
 */

angular.module('signature', []);

angular.module('signature').directive('signaturePad', ['$window',
    function ($window) {
        'use strict';

        var signaturePad, canvas, element, EMPTY_IMAGE = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';
        return {
            restrict: 'EA',
            replace: true,
            template: '<div class="signature" ng-click="ctrl.onSignatureDraw()" ng-style="{height: height + \'px\', width: width + \'px\'}"><canvas height="{{ height }}" width="{{ width }}"></canvas></div>',
            scope: {
                accept: '=',
                clear: '=',
                ondraw: '&ondraw',
                dataurl: '=',
                height: '@',
                width: '@'
            },
            controller: [
                '$scope',
                function ($scope) {
                    $scope.accept = function () {
                        var signature = {};

                        if (!$scope.signaturePad.isEmpty()) {
                            signature.dataUrl = $scope.signaturePad.toDataURL();
                            signature.isEmpty = false;
                        } else {
                            signature.dataUrl = EMPTY_IMAGE;
                            signature.isEmpty = true;
                        }

                        return signature;
                    };

                    $scope.clear = function () {
                        $scope.signaturePad.clear();
                    };

                    $scope.$watch("dataurl", function (dataUrl) {
                        if (dataUrl) {
                            console.log('SIGNATURE: DATA URL: ' + dataUrl);
                            $scope.signaturePad.fromDataURL(dataUrl);
                        }
                    });
                }
            ],
            link: function (scope, element) {
                canvas = element.find('canvas')[0];
                scope.signaturePad = new SignaturePad(canvas, {onBegin: scope.ondraw});

                if (!scope.height) scope.height = 220;
                if (!scope.width) scope.width = 568;

                if (scope.signature && !scope.signature.$isEmpty && scope.signature.dataUrl) {
                    scope.signaturePad.fromDataURL(scope.signature.dataUrl);
                }

                var ratio = Math.max($window.devicePixelRatio || 1, 1);
                canvas.width = canvas.offsetWidth * ratio;
                canvas.height = canvas.offsetHeight * ratio;
                canvas.getContext("2d").scale(ratio, ratio);
            }
        };
    }
]);

// Backward compatibility
angular.module('ngSignaturePad', ['signature']);
