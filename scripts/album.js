var createSongRow = function (songNumber, songName, songLength) {
    var template=
        '<tr class="album-view-song-item">'
        +   '<td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
        +   '   <td class="song-item-title">' + songName + '</td>'
        +   '   <td class="song-item-duration">'  + filterTimeCode(songLength) + '</td>'
        +   '</tr>'
        ;
    
    var $row = $(template);
   

    var clickHandler = function () {
        var songNumber = parseInt($(this).attr('data-song-number'));
        var songItem = $(this);
        var $volSeek = $('.volume .seek-bar');
        
        if (currentlyPlayingSongNumber !== null) {
            var currentlyPlayingCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');  currentlyPlayingCell.html(playButtonTemplate);
            
        }
        if (currentlyPlayingSongNumber === null) {
            songItem.html(pauseButtonTemplate);
            setSong(songNumber);
            updatePlayerBarSong();
            updateSeekBarWhileSongPlays();
            updateSeekPercentage($volSeek, (currentVolume / 100));
            currentSoundFile.play();
        } else if (currentlyPlayingSongNumber === songNumber) {
            if(currentSoundFile.isPaused()){
                currentSoundFile.play();
                updateSeekBarWhileSongPlays();
                songItem.html(pauseButtonTemplate);
            $('.main-controls .play-pause').html(playerBarPauseButton);
            }else{
                currentSoundFile.pause();
                songItem.html(playButtonTemplate);
            $('.main-controls .play-pause').html(playerBarPlayButton);
            }
        } else if (currentlyPlayingSongNumber !== songNumber) {
            songItem.html(pauseButtonTemplate);
            setSong(songNumber);
            currentSoundFile.play();
            updateSeekBarWhileSongPlays();
            updatePlayerBarSong();
            
        }
    };
    
        var onHover = function (event) {
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = parseInt(songNumberCell.attr('data-song-number'));

        if (songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(playButtonTemplate);
        }
        };
        
        var offHover = function (event) {
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = parseInt(songNumberCell.attr('data-song-number'));

        if (songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(songNumber);
        }
        };
        
        $row.find('.song-item-number').click(clickHandler);
        $row.hover(onHover, offHover);
        return $row;
};

var setCurrentAlbum = function (album) {
    currentAlbum = album;
    var $albumTitle = $('.album-view-title');
    var $albumArtist = $('.album-view-artist');
    var $albumReleaseInfo = $('.album-view-release-info');
    var $albumImage = $('.album-cover-art');
    var $albumSongList = $('.album-view-song-list');
    
    $albumTitle.text(album.title);
    $albumArtist.text(album.artist);
    $albumReleaseInfo.text(album.year + ' ' + album.label);
    $albumImage.attr('src', album.albumArtUrl);
    
    $albumSongList.empty();
    
    for (var i=0; i < album.songs.length; i++) {
       var $newRow = createSongRow( i + 1, album.songs[i].title, album.songs[i].duration);
        $albumSongList.append($newRow);
    }
};

var updateSeekBarWhileSongPlays = function() {
      if (currentSoundFile) {
         currentSoundFile.bind('timeupdate', function(event) {
             var seekBarFillRatio = this.getTime() / this.getDuration();
             var $seekBar = $('.seek-control .seek-bar');
             
             var currentTime = currentSoundFile.getTime();
            
             updateSeekPercentage($seekBar, seekBarFillRatio);
             setCurrentTimeInPlayerBar(currentTime);
         });
 };
}

var updateSeekPercentage = function($seekBar, seekBarFillRatio){
    var offsetXPercent = seekBarFillRatio * 100;
    offsetXPercent = Math.max(0, offsetXPercent);
    offsetXPercent = Math.min(100, offsetXPercent);
    var percentageString = offsetXPercent + '%';
    $seekBar.find('.fill').width(percentageString);
    $seekBar.find('.thumb').css({left: percentageString});
}

var setupSeekBars = function(){
    var $seekBars = $('.player-bar .seek-bar');
    
    $seekBars.click(function(event){
        var offsetX = event.pageX - $(this).offset().left;
        var barWidth = $(this).width();
        
        var seekBarFillRatio = offsetX / barWidth;
        
        updateSeekPercentage($(this), seekBarFillRatio);
    });
    
    $seekBars.find('.thumb').mousedown(function(event){
        var $seekBar = $(this).parent();
        $(document).bind('mousemove.thumb', function(event){
        var offsetX = event.pageX - $seekBar.offset().left;
        var barWidth = $seekBar.width();
        var seekBarFillRatio = offsetX / barWidth;
            
        if($seekBar.parent().attr('class') == 'seek-control'){
            seek(seekBarFillRatio * 100);
        }else{
            setVolume(seekBarFillRatio * 100);
        };
            
        
        updateSeekPercentage($seekBar, seekBarFillRatio);
        
    });
    
        $(document).bind('mouseup.thumb', function(){
            $(document).unbind('mousemove.thumb');
            $(document).unbind('mouseup.thumb');
        });
    });
};

var trackIndex = function(album, song){
    return album.songs.indexOf(song);
}

var nextSong = function(){
    //Know the previous song
    var trackBack = function(){
        if(currentlyPlayingSongNumber === 0 ){
            return currentAlbum.songs.length -1;
        }else{
            return currentlyPlayingSongNumber;
        }
    }
   var songBefore = trackBack();

    //get index of song and increase by one
    var currentTrackIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    currentTrackIndex ++;
    if (currentTrackIndex >= currentAlbum.songs.length) {
        currentTrackIndex = 0;
    }
    //set current song 
    setSong(currentTrackIndex + 1);
    currentSoundFile.play();
    updateSeekBarWhileSongPlays();

    //update player bar;
    updatePlayerBarSong();

    
    //update html of previous song
    
    //update html of current song to pause button
    var $currentTrack = getSongNumberCell(currentlyPlayingSongNumber);
    $currentTrack.html(pauseButtonTemplate);
    var $lastTrack = getSongNumberCell(songBefore);
    $lastTrack.html(playButtonTemplate);
    
    

}

var previousSong = function(){
    
    var trackBack = function(){
        if(currentlyPlayingSongNumber === 0 ){
            return currentAlbum.songs.length -1;
        }else{
            return currentlyPlayingSongNumber;
        }
    }
   var songBefore = trackBack();
    
    var currentTrackIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    currentTrackIndex --;
    
    if (currentTrackIndex < 0) {
        currentTrackIndex = currentAlbum.songs.length -1;
    }
    
     //set current song 
    setSong(currentTrackIndex + 1);
    currentSoundFile.play();
    updateSeekBarWhileSongPlays();
    updatePlayerBarSong();
    
    var $currentTrack =  getSongNumberCell(currentlyPlayingSongNumber);
    $currentTrack.html(pauseButtonTemplate);
    var $lastTrack =  getSongNumberCell(songBefore);
    $lastTrack.html(playButtonTemplate);
}

var updatePlayerBarSong = function() {
    $('.song-name').text(currentSongFromAlbum.title);
    $('.artist-song-mobile').text(currentSongFromAlbum.title + " " + currentAlbum.artist);
    $('.artist-name').text(currentAlbum.artist);
    
     $('.main-controls .play-pause').html(playerBarPauseButton);
    
    
    
    var runTime = getSongNumberCell(currentlyPlayingSongNumber).parent().find(".song-item-duration").text();
    setTotalTimeInPlayerBar(runTime);
}

var setSong = function(songNumber){
    if(currentSoundFile){
        currentSoundFile.stop();
    }
    currentlyPlayingSongNumber = parseInt(songNumber);
    currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
    currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl,{
        formats: [ 'mp3'],
        preload: true
    });
    
    setVolume(currentVolume);
};

var seek = function(time){
    if(currentSoundFile){
        currentSoundFile.setTime(time);
    }
}

var setVolume = function(volume){
    if (currentSoundFile){
        currentSoundFile.setVolume(volume);
    }
}

var getSongNumberCell = function(number){
    return $('.song-item-number[data-song-number="' + number + '"]');
}


var setCurrentTimeInPlayerBar = function(currentTime){
    var $currentTime = $('.current-time');
    $currentTime.text(filterTimeCode(currentTime));
}

var setTotalTimeInPlayerBar = function(totalTime) {
    var $runTime = $('.total-time');
    $runTime.text(totalTime);
}

filterTimeCode = function(timeInSeconds) {
    parseFloat(timeInSeconds);
    var minutes = Math.floor(timeInSeconds/60);
    var seconds = Math.floor(timeInSeconds%60);
    if(seconds<10){
        return minutes + ":0" + seconds;
    }
    return minutes + ":" + seconds;
    
    
};

var togglePlayFromPlayerBar = function(){
    var currentlyPlayingCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]'); 
    if(currentSoundFile.isPaused()){
        //change song nubmer to pause button
        currentlyPlayingCell.html(pauseButtonTemplate);
        //change html from play to pause
        $('.main-controls .play-pause').html(playerBarPauseButton)
        //play the song
        currentSoundFile.play();
    }else{
        //change song # to play button
        currentlyPlayingCell.html(playButtonTemplate);
        //change html to play button
        $('.main-controls .play-pause').html(playerBarPlayButton);
        //pause the song
        currentSoundFile.pause();
    }
}


//Album button templates

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';


var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentSoundFile = null;
var currentVolume = 80;
var $nextButton = $('.main-controls .next');
var $previousButton = $('.main-controls .previous');
var $playerBarPlay = $('.main-controls .play-pause');

$(document).ready(function() {
    setCurrentAlbum(albumPicasso); 
    setupSeekBars();
    $nextButton.click(nextSong);
    $previousButton.click(previousSong);
    $playerBarPlay.click(togglePlayFromPlayerBar);
});