let main = document.querySelector('.mainHolder');
let searchBox = document.querySelector('.autosuggest');
let inputSearch = document.getElementById('suggestion-search');
let selectType = document.getElementById('type');

// Genre List
let genreList = {
	28: 'Action',
	12: 'Adventure',
	16: 'Animation',
	35: 'Comedy',
	80: 'Crime',
	99: 'Documentary',
	18: 'Drama',
	10751: 'Family',
	10762: 'Kids',
	10763: 'News',
	14: 'Fantasy',
	36: 'History',
	27: 'Horror',
	10402: 'Music',
	9648: 'Mystery',
	10749: 'Romance',
	878: 'Science Fiction',
	10770: 'TV Movie',
	53: 'Thriller',
	10752: 'War',
	37: 'Western',
	10759: 'Action & Adventure',
	10764: 'Reality',
	10765: 'Sci-Fi & Fantasy',
	10766: 'Soap',
	10767: 'Talk',
	10768: 'War & Politics',
};

// To Display additional info based on show more or show less button
function setVisible(a) {
	let moreButton = document.querySelectorAll('#more');
	let overviewContent = document.querySelectorAll('.overviewContent');
	let castCrew = document.querySelectorAll('.castCrew');
	let videoContent = document.querySelectorAll('.videoContent');

	if (moreButton[a].innerHTML == 'Show More...') {
		castCrew[a].style.display = 'grid';
		overviewContent[a].style.display = 'block';
		videoContent[a].style.display = 'block';
		moreButton[a].style.gridRowStart = 6;
		moreButton[a].style.backgroundColor = 'rgb(243,195,24)';
		moreButton[a].innerHTML = 'Show Less...';
	} else {
		castCrew[a].style.display = 'none';
		overviewContent[a].style.display = 'none';
		videoContent[a].style.display = 'none';
		moreButton[a].style.gridRowStart = 3;
		moreButton[a].style.backgroundColor = 'rgb(243,195,24)';
		moreButton[a].innerHTML = 'Show More...';
	}
}

//To get search input on keypress(enter)
let userInput = document.querySelector('.userInput');

userInput.addEventListener('keypress', getUserInput);

var queryString = '';

const searchUrl =
	'https://api.themoviedb.org/3/trending/all/day?api_key=88dcd9cb9f6760e409b5331dd47b4d9c';

function getUserInput(event) {
	if (event.keyCode == 13 && userInput.value != '') {
		setQueryString();
	} else if (event.keyCode == 13 && userInput.value == '') {
		alert('Please enter a movie name');
	}
}

// To get user input incase of button click
function getUserInputButton() {
	if (userInput.value != '') {
		setQueryString();
	}
}

// To set the query string and to pass this in local storage to retreive in other page
function setQueryString() {
	queryString = '';

	for (var i of userInput.value) {
		if (i != ' ') {
			queryString += i;
		} else {
			queryString += '+';
		}
	}

	localStorage.setItem('queryString', queryString);

	// To navigate to respective page based on type selection
	if (selectType.value == 'tv') {
		location.replace('/displayTv.html');
	} else {
		location.replace('/displayResult.html');
	}
}

// To get the display all the trending shows
let getMovie = async () => {
	let printStr = '';

	try {
		const res = await fetch(`${searchUrl}`);
		const data = await res.json();
		let searchResults = data.results;

		main.innerHTML = '';
		if (searchResults != 0) {
			let a = 0;

			// Foreach to print data
			searchResults.forEach((result) => {
				// To load the Genre of the movie
				var genre = result.genre_ids;
				var movieGenre = [];
				genre.forEach((gen) => {
					movieGenre.push(genreList[gen]);
				});

				// URL for cast crew
				let ccUrl = `https://api.themoviedb.org/3/movie/${result.id}/credits?api_key=88dcd9cb9f6760e409b5331dd47b4d9c&language=en-US`;
				let ccUrlTv = `https://api.themoviedb.org/3/tv/${result.id}/credits?api_key=88dcd9cb9f6760e409b5331dd47b4d9c&language=en-US`;

				// To check if it is a tv show or movie
				if (typeof result.title == 'undefined') {
					loadCastCrew(ccUrlTv, a);
				} else {
					loadCastCrew(ccUrl, a);
				}

				let titleName;
				let release;
				let releaseTitle;
				if (typeof result.title == 'undefined') {
					titleName = result.name;
					releaseTitle = 'First Air Date';
					release = result.first_air_date;
				} else {
					titleName = result.title;
					releaseTitle = 'Released On';
					release = result.release_date;
				}

				let overview;
				if (result.overview.length <= 1) {
					overview = 'Overview not found';
				} else {
					overview = result.overview;
				}

				printStr = `
				<div class="container content">
				<!-- Image of Movie -->
				<div class="imageContainer">
					<img
						src="https://www.themoviedb.org/t/p/w1280/${result.poster_path}"
						alt="No Image"
						id="contentImage"
					/>
				</div>
			
				<!-- Other Main Content -->
				<div class="otherContainer">
					<h3 id="contentHeading">${titleName}</h3>
					<p id="date">${releaseTitle} : ${release}</p>
					<p id="rating">Rating : ${result.vote_average} / 10</p>
					<p id="genre">Genre : ${movieGenre.join(', ')}</p>
				</div>
			
				<!-- Overview -->
				<div class="overviewContent">
					<h5>Overview</h5>
					<p id="overview">
					${overview}
					</p>
				</div>
			
				<!-- Videos -->
				<div class="videoContent">
				
				</div>
			
				<!-- CasrCrew -->
				<div class="castCrew">
					<h5>Director</h5>
					<p id="director">Director</p>
					<h5>Cast</h5>
					<p id="cast">Cast</p>
				</div>
			
				<!-- More button -->
				<button type="button" class="btn more" id="more" onclick="setVisible(${a})">Show More...</button>
			</div>`;
				main.innerHTML += printStr;

				a++;
			});
			a = 0;
			searchResults.forEach((result) => {
				if (typeof result.title == 'undefined') {
					videoUrl = `https://api.themoviedb.org/3/tv/${result.id}/videos?api_key=88dcd9cb9f6760e409b5331dd47b4d9c&language=en-US`;
				} else {
					videoUrl = `https://api.themoviedb.org/3/movie/${result.id}/videos?api_key=88dcd9cb9f6760e409b5331dd47b4d9c&language=en-US`;
				}

				loadVideoUrl(videoUrl, a);
				a++;
			});
		} else {
			printStr = `<div class="container"><h3 class="container"><span id="error">No movie found</span></h3></div>`;
			main.innerHTML += printStr;
		}
	} catch (error) {
		printStr = `<div class="container"><h3 class="container"><span id="error">${error.message}</span></h3></div>`;
		main.innerHTML += printStr;
	}
};

// To get the Cast and Director details
let loadCastCrew = async (ccUrl, a) => {
	// To fetch data from the url
	let res = await fetch(ccUrl);
	let ccData = await res.json();

	let castCrew = '';
	let crewDirector = '';
	let cast = document.querySelectorAll('#cast');
	let director = document.querySelectorAll('#director');

	//Cast Details
	try {
		var castArr = ccData.cast;
		var repeat = 5;
		if (castArr.length < 5) {
			repeat = castArr.length;
		}

		for (let i = 0; i < repeat; i++) {
			castCrew += `<span id="castName">${castArr[i].name}</span> as <span id="character">${castArr[i].character}</span></br>`;
		}
		cast[a].innerHTML = castCrew;
	} catch (error) {
		castCrew += `<span id="error">${error.message}</span>`;
	}

	//Crew
	try {
		var crewArr = ccData.crew;

		crewArr.forEach((crew) => {
			if (crew.job == 'Director') {
				crewDirector += `<span id="crewName">${crew.name}</span>`;
			}
		});
		if (crewDirector == '') {
			crewDirector = 'No data';
		}
		director[a].innerHTML = crewDirector;
	} catch (error) {
		crewDirector += `<span id="error">${error.message}</span>`;
	}
};

// To load trailer and teaser
let loadVideoUrl = async (videoUrl, a) => {
	let printVideo = '';
	let videoContent = document.querySelectorAll('.videoContent');

	try {
		let res = await fetch(videoUrl);
		let videoData = await res.json();

		var results = videoData.results;

		for (let i = 0; i < results.length; i++) {
			if (results[i].type == 'Trailer') {
				printVideo += `<h5>${results[i].type}</h5>
				<iframe src="https://www.youtube.com/embed/${results[i].key}" id="iframe"> </iframe>
				`;

				videoContent[a].innerHTML = printVideo;
				return;
			}
		}
	} catch (error) {
		printVideo += `<h5>${(error.message, a)}</h5>`;
		console.log(error.message);
		videoContent[a].innerHTML = printVideo;
	}
};

window.onload = getMovie;
