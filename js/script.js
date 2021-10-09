let main = document.querySelector('.mainHolder');

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

	if (moreButton[a].innerHTML == 'More') {
		castCrew[a].style.display = 'grid';
		overviewContent[a].style.display = 'block';
		commentContent[a].style.display = 'block';
		videoContent[a].style.display = 'block';
		moreButton[a].style.backgroundColor = '#0085ffbf';
		moreButton[a].innerHTML = 'Less';
	} else {
		castCrew[a].style.display = 'none';
		overviewContent[a].style.display = 'none';
		commentContent[a].style.display = 'none';
		videoContent[a].style.display = 'none';
		moreButton[a].style.backgroundColor = 'brown';
		moreButton[a].innerHTML = 'More';
	}
}

//Get search input
let userInput = document.querySelector('.userInput');
userInput.addEventListener('keypress', getUserInput);
var queryString = 'El+Camino+A+Breaking+Bad+Movie';
const searchUrl =
	'https://api.themoviedb.org/3/search/movie?api_key=88dcd9cb9f6760e409b5331dd47b4d9c&query=';

function getUserInput(event) {
	if (event.keyCode == 13 && userInput.value != '') {
		queryString = '';
		for (var i of userInput.value) {
			if (i != ' ') {
				queryString += i;
			} else {
				queryString += '+';
			}
		}
		getMovie();
	} else if (event.keyCode == 13 && userInput.value == '') {
		alert('Please enter a movie name');
	}
}

let getMovie = async () => {
	try {
		const res = await fetch(`${searchUrl}${queryString}`);
		const data = await res.json();
		let searchResults = data.results;
		let printStr = '';
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

				// Printing of Main Content after data is fetched
				printStr = `
				<div class="container content">
				<!-- Image of Movie -->
				<div class="imageContainer">
					<img
						src="https://www.themoviedb.org/t/p/w1280/${result.poster_path}"
						alt="Broken Image"
						id="contentImage"
					/>
				</div>
			
				<!-- Other Main Content -->
				<div class="otherContainer">
					<h3 id="contentHeading">${result.original_title}</h3>
					<p id="date">Released on : ${result.release_date}</p>
					<p id="rating">Rating: ${result.vote_average} / 10</p>
					<p id="genre">Genre: ${movieGenre.join(' ')}</p>
				</div>
			
				<!-- Overview -->
				<div class="overviewContent">
					<h4>Overview</h4>
					<p id="overview">
					${result.overview}
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
				<button type="button" class="btn more" id="more" onclick="setVisible(${a})">More</button>
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
	try {
		let res = await fetch(reviewUrl);
		let reviewData = await res.json();

		let review = '';

		let commentContent = document.querySelectorAll('#commentContent');

		var results = reviewData.results;

		if (results.length != 0) {
			results.forEach((r) => {
				review += `<h5>${r.author}</h5>
				<p id="userComment">${r.content}
				</p></br>`;
			});

			commentContent[a].innerHTML = review;
		} else {
			review += `<h5>No User Review Found</h5>`;

			commentContent[a].innerHTML = review;
		}
	} catch (error) {
		review += `<h5>${error.message}</h5>`;

		commentContent[a].innerHTML = review;
	}
};

// To load trailer and teaser
let loadVideoUrl = async (videoUrl, a) => {
	try {
		let res = await fetch(videoUrl);
		let videoData = await res.json();

		let printVideo = '';

		var results = videoData.results;

		let videoContent = document.querySelectorAll('.videoContent');

		results.forEach((v) => {
			if (v.type == 'Trailer' || v.type == 'Teaser') {
				printVideo += `<h4>${v.type}</h4>
				<iframe src="https://www.youtube.com/embed/${v.key}"> </iframe>
				`;

				videoContent[a].innerHTML = printVideo;
			}
		});
	} catch (error) {
		printVideo += `<h4>${error.message}</h4>`;

		videoContent[a].innerHTML = printVideo;
	}
};

window.onload = getMovie;
