let main = document.querySelector('.mainHolder');
let searchBox = document.querySelector('.autosuggest');
let inputSearch = document.getElementById('suggestion-search');
let selectType = document.getElementById('type');

let genreList = {
	28: 'Action',
	12: 'Adventure',
	16: 'Animation',
	35: 'Comedy',
	80: 'Crime',
	99: 'Documentary',
	18: 'Drama',
	10751: 'Family',
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
};

function setVisible(a) {
	let moreButton = document.querySelectorAll('#more');
	let overviewContent = document.querySelectorAll('.overviewContent');
	let castCrew = document.querySelectorAll('.castCrew');
	let commentContent = document.querySelectorAll('.commentContent');
	let videoContent = document.querySelectorAll('.videoContent');

	if (moreButton[a].innerHTML == 'Show More...') {
		castCrew[a].style.display = 'grid';
		overviewContent[a].style.display = 'block';
		commentContent[a].style.display = 'block';
		videoContent[a].style.display = 'block';
		moreButton[a].style.gridRowStart = 7;
		moreButton[a].style.backgroundColor = 'rgb(243,195,24)';
		moreButton[a].innerHTML = 'Show Less...';
	} else {
		castCrew[a].style.display = 'none';
		overviewContent[a].style.display = 'none';
		commentContent[a].style.display = 'none';
		videoContent[a].style.display = 'none';
		moreButton[a].style.gridRowStart = 3;
		moreButton[a].style.backgroundColor = 'rgb(243,195,24)';
		moreButton[a].innerHTML = 'Show More...';
	}
}

//Get search input
let userInput = document.querySelector('.userInput');
userInput.addEventListener('keypress', getUserInput);
var queryString = 'Mission+Impossible';
const searchUrl =
	'https://api.themoviedb.org/3/search/movie?api_key=88dcd9cb9f6760e409b5331dd47b4d9c&query=';

function getUserInput(event) {
	if (event.keyCode == 13 && userInput.value != '') {
		queryString = '';
		searchBox.style.display = 'none';
		for (var i of userInput.value) {
			if (i != ' ') {
				queryString += i;
			} else {
				queryString += '+';
			}
		}

		localStorage.setItem('queryString', queryString);

		if (selectType.value == 'tv') {
			location.replace('/displayTv.html');
		} else {
			location.replace('/displayResult.html');
		}
	} else if (event.keyCode == 13 && userInput.value == '') {
		alert('Please enter a movie name');
	}
}

let getMovie = async () => {
	let printStr = '';
	try {
		const res = await fetch(`${searchUrl}${queryString}`);
		const data = await res.json();
		let searchResults = data.results;

		main.innerHTML = '';
		if (searchResults != 0) {
			let a = 0;
			searchResults.forEach((result) => {
				// To load the Genre of the movie
				var genre = result.genre_ids;
				var movieGenre = [];
				genre.forEach((gen) => {
					movieGenre.push(genreList[gen]);
				});

				// URL for cast crew, User review and videos(trailer teaser)
				let ccUrl = `https://api.themoviedb.org/3/movie/${result.id}/credits?api_key=88dcd9cb9f6760e409b5331dd47b4d9c&language=en-US`;
				let reviewUrl = `https://api.themoviedb.org/3/movie/${result.id}/reviews?api_key=88dcd9cb9f6760e409b5331dd47b4d9c&language=en-US`;
				let videoUrl = `https://api.themoviedb.org/3/movie/${result.id}/videos?api_key=88dcd9cb9f6760e409b5331dd47b4d9c&language=en-US`;

				loadCastCrew(ccUrl, a);
				loadReviewUrl(reviewUrl, a);
				loadVideoUrl(videoUrl, a);

				let overview;
				if (result.overview.length <= 1) {
					overview = 'Overview not found';
				} else {
					overview = result.overview;
				}
				// Printing of Main Content after data is fetched
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
					<h3 id="contentHeading">${result.title}</h3>
					<p id="date">Released on : ${result.release_date}</p>
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
			
				<!-- Comment -->
				<div class="commentContent">
				<h5>User Review</h5>
				<p id="commentContent">User Review</p>					
				</div> 
			
				<!-- More button -->
				<button type="button" class="btn more" id="more" onclick="setVisible(${a})">Show More..</button>
			</div>`;
				main.innerHTML += printStr;

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

// To fetch the user review
let loadReviewUrl = async (reviewUrl, a) => {
	let review = '';
	try {
		let res = await fetch(reviewUrl);
		let reviewData = await res.json();

		let commentContent = document.querySelectorAll('#commentContent');

		var results = reviewData.results;

		if (results.length != 0) {
			let n = 2;
			if (results.length <= 1) {
				n = 1;
			}
			for (let i = 0; i < n; i++) {
				review += `<h5>${results[i].author}</h5>
				<p id="userComment">${results[i].content}
				</p></br>`;
			}

			commentContent[a].innerHTML = review;
		} else {
			review += `<h5>No Reviews yet</h5>`;

			commentContent[a].innerHTML = review;
		}
	} catch (error) {
		review += `<h5>${error.message}</h5>`;
		console.log(error.message);
		commentContent[a].innerHTML = review;
	}
};

// To load trailer and teaser
let loadVideoUrl = async (videoUrl, a) => {
	let printVideo = '';

	try {
		let res = await fetch(videoUrl);
		let videoData = await res.json();

		var results = videoData.results;

		let videoContent = document.querySelectorAll('.videoContent');

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
		printVideo += `<h5>${error.message}</h5>`;

		videoContent[a].innerHTML = printVideo;
	}
};

window.onload = getMovie;
