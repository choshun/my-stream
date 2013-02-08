SC.initialize({
  	client_id: '51dee6a4f08cf517a3b43b4641067b0a',
  	redirect_uri: 'file:///Users/csnyder/my-media/index.html'
});

// initiate auth popup
SC.connect(function() {
  	SC.get('/me', function(me) { 
    	alert('Hello, ' + me.username); 
  	});
});

angular.module('Soundcloud', ['ngResource']);

function SoundcloudCtrl($scope, $resource) {
	$scope.trackCount = 0;

	$scope.soundcloud = $resource('https://api.soundcloud.com/:action', 
		{action:'tracks.json', client_id:'51dee6a4f08cf517a3b43b4641067b0a', q: 'starkey', callback: 'JSON_CALLBACK'},
		{get:{
			method:'JSONP',
			isArray: true
		}});

	$scope.doSearch = function(){
		$scope.soundCloudResult = $scope.soundcloud.get({
			q:$scope.searchTerm
		});
	}

	$scope.soundCloudResult = $scope.soundcloud.get();

	$scope.getArea = function() {
        return ($(window).width() * $(window).height());
    };

    $scope.playTrack = function(index) {
    	$('.track-link').removeClass('active');
    	$('.track-link').eq(index).addClass('active');
    	var trackUrl = $('.track-link').eq(index).data('track-url');
    	SC.oEmbed(trackUrl, { auto_play: true }, function(oEmbed) {
		  	$('#player').html(oEmbed.html);
		});
		$(window).trigger('resize'); 
    }
    
    $scope.$watch($scope.getArea, function(newValue, oldValue) {
        $scope.window_area = newValue;
    });

    $scope.getClass = function ($index, item) {
    	var rows = Math.round($(window).width() / $('#tracks .track:first').width());
    	var headerHeight = $('#header').height();

        if(Math.ceil(($index + 1) / rows) * $('#tracks .track').height() < ($(window).height() - headerHeight - 40)) {
        	return 'visible-track';
        } else {
        	return item.class
        }
    }

    window.onresize = function(){
        var lazyLayout = _.debounce(function(){ 
        	$scope.$apply(); 
        }, 500);
        lazyLayout();
    }
}