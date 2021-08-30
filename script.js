const load = () => {
	let width = window.innerWidth;
	let height = window.innerHeight;
	let doc = document.querySelector('.container');
	Object.assign(doc.style, {
		width: width - 12 + 'px',
		height: height + 'px',
		marginLeft: '6px',
		'justify-content': 'center',
	});
};
window.addEventListener('resize', load);
// Add Timer  next update

window.onload = () => {
	//
	load();
	let audio = document.querySelector('audio');
	let inputFile = document.getElementById('audio');

	let next = document.querySelector('.next');
	let previous = document.querySelector('.previous');
	let play = document.querySelector('.play');
	let backward = document.querySelector('.backward');
	let forward = document.querySelector('.forward');
	let shuffle = document.querySelector('.shuffle');
	let repeat = document.querySelector('.repeat');

	let songName = document.querySelector('#song-name');
	let playListBtn = document.querySelector('#play-list');

	// progress
	let progress = document.querySelector('.progress');
	let duration_label = document.querySelector('.duration');
	let currentTime_label = document.querySelector('.currentTime');

	//
	let firstPage = document.querySelector('.inner-container');
	let songListPage = document.querySelector('.song-list-page');
	let songList = document.querySelector('.songs-list');

	//
	let round = document.querySelector('.round-circle');

	let audioFiles = [],
		currentSongNo = 0,
		totalSongs,
		songsName = [];

	function addAudioSrc(curSongNo) {
		audio.src = audioFiles[curSongNo];
		songName.textContent = songsName[curSongNo];
	}

	let isFileSelected = false;
	inputFile.oninput = function (event) {
		isFileSelected = true;

		let files = event.target.files;
		totalSongs = files.length;

		// show total song on song list dialog
		document.querySelector(
			'.total_songs'
		).textContent = `(${totalSongs} songs)`;

		for (i = 0; i < totalSongs; i++) {
			audioFiles[i] = URL.createObjectURL(files[i]);
			songsName[i] = files[i].name;
		}
		addAudioSrc(0);
	};

	let isPlay = true;
	play.onclick = function (event) {
		isPlay
			? set_fun('images/play.png', 'pause', 'rgb(245, 200, 235)')
			: set_fun('images/pause.png', 'play', '#fff');
		isPlay = !isPlay;

		function set_fun(src, method, bgColor) {
			play.src = src;
			play.style.backgroundColor = bgColor;
			audio[method](); // call method
		}
	};

	previous.onclick = function (event) {
		if (isRepeat) {
			repeat_fun();
		} else if (isShuffle) {
			shuffle_fun();
		} else {
			if (currentSongNo == 0) {
				currentSongNo = totalSongs - 1;
			} else {
				currentSongNo--;
			}
			addAudioSrc(currentSongNo);
		}
	};

	next.onclick = function (event) {
		if (isRepeat) {
			repeat_fun();
		} else if (isShuffle) {
			shuffle_fun();
		} else {
			if (currentSongNo == totalSongs - 1) {
				currentSongNo = 0;
			} else {
				currentSongNo++;
			}
			addAudioSrc(currentSongNo);

			/* console.log(--currentSongNo % totalSongs);
            if (currentSongNo == 0)
            currentSongNo = totalSongs;
            console.log(currentSongNo++ % totalSongs);
            if (currentSongNo == totalSongs)
            currentSongNo = 0; 
            */
		}
	};

	let isBackwardBtnPressed = false;
	backward.addEventListener('click', (event) => {
		isBackwardBtnPressed = true;
		audio.pause();
	});
	let isForwardBtnPressed = false;
	forward.addEventListener('click', (event) => {
		isForwardBtnPressed = true;
		audio.pause();
	});

	let isShuffle = false;
	shuffle.addEventListener('click', (event) => {
		shuffle.style.backgroundColor = !isShuffle
			? 'rgb(245, 200, 235)'
			: '#fff';
		isShuffle = !isShuffle;
		shuffle_fun();
	});

	function shuffle_fun() {
		rand = Math.round(Math.random() * (totalSongs - 1));
		currentSongNo = rand;

		addAudioSrc(currentSongNo);
	}

	let isRepeat = false;
	repeat.addEventListener('click', (event) => {
		// 'rgb(245, 200, 235)'  'rgb(1, 200, 235)'
		repeat.style.backgroundColor = !isRepeat
			? 'rgb(245, 200, 235)'
			: '#fff';
		isRepeat = !isRepeat;
		repeat_fun();
	});

	function repeat_fun() {
		addAudioSrc(currentSongNo);
	}

	function songsList() {
		songList.innerHTML = ''; //
		songsName.forEach((songName, index) => {
			song = document.createElement('div');
			song.className = 'song btn';
			song.id = index;
			song.innerHTML =
				index +
				1 +
				'. ' +
				songName; /* `${index + 1}.   ${songName}`; */

			song.addEventListener('click', (event) => {
				currentSongNo = event.target.id;
				addAudioSrc(currentSongNo);
				event.stopPropagation();
			});
			songList.appendChild(song);

			// songList.children[currentSongNo - 1].className = 'currentPlaying';
			// console.log('object ', songList.children[currentSongNo]);
		});
	}
	// When double clicked on songListPage then show first page
	// unused code
	/* let count = 0;
	songListPage.addEventListener(
		'click',
		(event) => {
			count += 1;
			setTimeout(() => {
				count = 0;
			}, 2000);
			if (count == 2) {
				firstPage.style.display = 'flex';
				songListPage.style.display = 'none';
			}
		},
		false
	);
 */
	// add song  in the song-list div
	let isAdded = false;
	playListBtn.onclick = (event) => {
		// when file is selected, then songs add in songs list div
		if (isFileSelected) {
			// songsList function is call only once time
			!isAdded ? songsList() : null;
			isAdded = true;
		}

		songListPage.style.height = '65%';
		event.stopPropagation();
	};

	audio.onpause = function (event) {
		play.src = 'images/play.png';
		// animation stop
		round.style.animationPlayState = 'paused';

		console.log('pause audio');
		if (isBackwardBtnPressed) {
			event.target.currentTime -= 5;
			isBackwardBtnPressed = false;
			audio.play();
		}
		if (isForwardBtnPressed) {
			isForwardBtnPressed = false;
			event.target.currentTime += 5;
			audio.play();
		}
	};

	//when music end then next music is auto play
	audio.addEventListener('ended', (event) => {
		if (isRepeat) {
			repeat_fun();
		} else if (isShuffle) {
			shuffle_fun();
		} else {
			if (currentSongNo == totalSongs - 1) {
				currentSongNo = 0;
			} else {
				currentSongNo++;
			}
			addAudioSrc(currentSongNo);
		}
	});

	audio.onplay = (event) => {
		play.src = 'images/pause.png';
		// Animation start
		round.style.animationPlayState = 'running';

		console.log('onplay');
	};
	/* audio.onplaying = (event) => {
		console.log('onplaying');
	}; */

	let duration, currentTime;
	let prev = null,
		pre = -1;
	audio.ontimeupdate = function (event) {
		console.log('ontimeupdate method', event);
		// run if block when the pre is not  equal to currentSongNo and songList.children.length != 0
		if (currentSongNo !== pre && songList.children.length != 0) {
			if (prev != null) {
				prev.style.color = 'gray';
			}
			pre = currentSongNo;
			prev = songList.children[parseInt(currentSongNo)];
			songList.children[parseInt(currentSongNo)].style.color =
				'rgb(255, 0, 200)';
		}

		duration = event.target.duration;
		currentTime = event.target.currentTime;

		duration_label.textContent = convertElapsedTime(duration);
		currentTime_label.textContent = convertElapsedTime(currentTime);

		// progress bar increment 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
		increment = 10 / duration;
		percent = Math.min(increment * currentTime * 10, 100);
		console.log(increment, percent);
		progress.style.width = percent + '%';
	};

	function convertElapsedTime(inputSeconds) {
		let seconds = Math.floor(inputSeconds % 60);
		if (seconds < 10) seconds = '0' + seconds;

		let minutes = Math.floor(inputSeconds / 60);
		return minutes + ':' + seconds;
	}

	// left menu
	leftMenuBtn = document.querySelector('.stopwatch');
	leftPanel = document.querySelector('.left-panel');

	// show sleep mode dialog
	leftMenuBtn.addEventListener('click', (event) => {
		leftPanel.style.display = 'flex';
	});

	document.querySelector('.close').onclick = (event) => {
		leftPanel.style.display = 'none';
	};

	/* // unused code 
    let isOpen = false;
	leftMenuBtn.addEventListener('click1', (event) => {
		isOpen = !isOpen;
		isOpen
			? set_fun(80, 10, 'images/back.png')
			: set_fun(6, 6, 'images/open.png');

		function set_fun(width, left, src) {
			leftPanel.style.width = width + '%';
			leftMenuBtn.style.left = left + '%';
			icon.src = src;
		}
	}); */

	// Timer countdown version 2.0  date : 27-08-2021
	let timer_label = document.querySelector('#timer-label');
	let onOffBtn = document.querySelector('#onOffBtn');
	let isOn = false;
	let minutes = 5,
		timer,
		seconds = 0;

	document
		.querySelector('.timer-range')
		.addEventListener('change', (event) => {
			timer_label.firstElementChild.textContent =
				event.target.value < 10
					? '0' + event.target.value
					: event.target.value;
			timer_label.lastElementChild.textContent = '00';
			minutes = event.target.value;
		});

	onOffBtn.addEventListener('click', (event) => {
		onOffBtn.value = isOn ? 'On' : 'Off';

		isOn = !isOn;
		if (isOn) {
			countDown(minutes);
		} else {
			clearInterval(timer);
		}
	});

	//
	function countDown() {
		timer = setInterval(() => {
			if (seconds == 0 && minutes == 0) {
				clearInterval(timer);
				audio.pause();
			} else {
				if (seconds == 0) {
					minutes--;
					seconds = 60;
				}
				seconds--;
				timer_label.firstElementChild.textContent =
					minutes < 10 ? '0' + minutes : minutes;
				timer_label.lastElementChild.textContent = seconds;
			}
		}, 1000);
	}

	songListPage.querySelector('.close').addEventListener('click', (event) => {
		songListPage.style.height = 0;
	});
	//When left panel is open then we click on main page then left panel is closed
	firstPage.addEventListener('click', (event) => {
		songListPage.style.height = 0;
		/* icon.src = 'images/open.png';
        leftPanel.style.width = '0'
        leftMenuBtn.style.left = '0' */
	});
}; // window.onload() method
