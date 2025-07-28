// scripts

// audioplayer
let audioPlayer = {
	playing: false,
	currentlyPlaying: null,
	progressIndicator: null,
	play: function (element) {
		//get and save name
		var name = $(element).attr('id')
		//pause audio if active
		this.pause(name);
		// if its the same one as previously active, stop it.
		if (this.currentlyPlaying) {
			console.log(this.currentlyPlaying.attr('id'));
			if (this.currentlyPlaying.attr('id')===name+'-audio') {
				$(element).removeClass('active')
				this.playing = false;
				this.currentlyPlaying = null;
				return;
			}
		};
		//play audio file
		this.currentlyPlaying = $(element).children('audio');
		$(element).children('audio').trigger('play');
		//control progress bar
		var progress = $(element).children('.progress');
		progress.css('display','block');
		this.currentlyPlaying.on('timeupdate', function() {
			var percent = (this.currentTime/this.duration)*100;
			progress.css("width", percent + "%");
		});
		this.progressIndicator = progress;
		// set state
		this.playing = true;
	},
        pause: function (name) {
                if (this.playing){
                        // stop audio
                        $('.cell.active').removeClass('active');
                        this.currentlyPlaying.trigger('pause');
                        this.playing = false;
                }
        }
}

// button handler
$('.cell').click(function () {
	$('.progress').css('display', 'none');
	audioPlayer.play(this);
});

window.audioPlayer = audioPlayer;