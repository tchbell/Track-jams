var createSongRow = function (songNumber, songName, songLength) {
    var template=
        '<tr class="album-view-song-item">'
        +   '<td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
        +   '   <td class="song-item-title">' + songName + '</td>'
        +   '   <td class="song-item-duration">'  + songLength + '</td>'
        +   '</tr>'
        ;
    
    var $row = $(template);
   

    var clickHandler = function () {
        var songNumber = parseInt($(this).attr('data-song-number'));
        var songItem = $(this);
        
        if (currentlyPlayingSongNumber === null) {
            songItem.html(pauseButtonTemplate);
            setSong(songNumber);
            updatePlayerBarSong();
        } else if (currentlyPlayingSongNumber === songNumber) {
            songItem.html(playButtonTemplate);
            $('.main-controls .play-pause').html(playerBarPlayButton);
            currentlyPlayingSongNumber = null;
            currentSongFromAlbum = null;
        } else if (currentlyPlayingSongNumber !== songNumber) {
            songItem.html(pauseButtonTemplate);
            setSong(songNumber);
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
    currentSongFromAlbum = currentAlbum.songs[currentTrackIndex];
    currentlyPlayingSongNumber = currentTrackIndex + 1;

    //update player bar;
    updatePlayerBarSong();

    
    //update html of previous song
    
    //update html of current song to pause button
    var $currentTrack =  getSongNumberCell(currentlyPlayingSongNumber);
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
    currentSongFromAlbum = currentAlbum.songs[currentTrackIndex];
    setSong(currentTrackIndex + 1);
    
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
}

var setSong = function(songNumber){
    currentlyPlayingSongNumber = songNumber;
    currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
}

var getSongNumberCell = function(number){
    return $('.song-item-number[data-song-number="' + number + '"]');
}

//Album button templates

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';


var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var $nextButton = $('.main-controls .next');
var $previousButton = $('.main-controls .previous');

$(document).ready(function() {
    setCurrentAlbum(albumPicasso); 
    $nextButton.click(nextSong);
    $previousButton.click(previousSong);
});