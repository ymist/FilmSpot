let = apiTMDB = "a65a2379df321bc528f0d3b5c209b2cf";
let language = "en";
let currentPage = 1;
var bodyFilm = document.getElementById("bodyFilm");
let nextPag = document.getElementById("next-page-btn");
let prevPag = document.getElementById("prev-page-btn");

prevPag.disabled = true;
prevPag.style.cursor = "default";
nextPag.disabled = true;
nextPag.style.cursor = "default";

document.addEventListener("DOMContentLoaded", function () {
	var genreSelect = document.getElementById("genre-select");
	function fetchGenres() {
		// Faz uma requisição para obter os gêneros disponíveis
		fetch(
			`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiTMDB}&language=${language}&page=${currentPage}&per_page=20`
		)
			.then(function (response) {
				return response.json();
			})
			.then(function (data) {
				var genres = data.genres;

				// Preenche o select com os gêneros
				genres.forEach(function (genre) {
					var option = document.createElement("option");
					option.value = genre.id;
					option.textContent = genre.name;
					genreSelect.appendChild(option);
				});
			})
			.catch(function (error) {
				console.log("Ocorreu um erro:", error);
			});
	}

	function fetchMoviesByGenre(selectedGenre) {
		if (selectedGenre === "Filtrar") {
			document.getElementsByClassName("bodyFilm").innerHTML = "";
			return;
		}

		// Faz uma chamada para a API do TMDB para obter os filmes do gênero selecionado
		var apiUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiTMDB}&with_genres=${selectedGenre}&language=${language}&page=${currentPage}&per_page=10`;
		fetch(apiUrl)
			.then(function (response) {
				return response.json();
			})
			.then(function (data) {
				var movies = data.results;
				bodyFilm.innerHTML = "";

				if (movies.length > 0) {
					movies.forEach(function listfilms(movie) {
						let posterTMDB = "https://image.tmdb.org/t/p/w300" + movie.poster_path;

						var movieArea = document.createElement("div");
						movieArea.className = "areaFilm";
						movieArea.style.background = `linear-gradient(to top, rgb(0, 0, 0), rgba(0, 0, 0, 0)), url("${posterTMDB}")`;
						movieArea.style.backgroundSize = `100%`;
						movieArea.addEventListener("click", function () {
							var FilmName = movieTitle.textContent;
							searchInput.value = FilmName;
							getMovie();
							var scrollToOptions = { top: 0, behavior: "smooth" };
							window.scrollTo(scrollToOptions);
						});
						var movieInfo = document.createElement("div");
						movieInfo.className = "infoFilmHome";

						var movieTitle = document.createElement("h2");
						movieTitle.className = "FilmNameHome";
						movieTitle.textContent = movie.title;

						var movieRating = document.createElement("div");
						movieRating.className = "notahome";
						var omdbUrl = `http://www.omdbapi.com/?t=${movie.title}&plot=full&apikey=${API_KEY}`;
						fetch(omdbUrl)
							.then((resp) => resp.json())
							.then((data) => {
								if (data.Response === "True") {
									// Rating IMDb
									let imdb = "";
									if (data.imdbRating == "N/A") {
										imdb = "";
									} else {
										imdb = `
								<img src="/imagens/star-icon.svg">
								<h4 title="Rating IMDB.">${data.imdbRating}</h4>
								`;
									}

									// Rating Rotten Tomatoes
									let rating = "";
									if (data.Ratings.length > 0) {
										if (data.Ratings[1].Value >= "60") {
											const cleanRating = data.Ratings[1].Value.replace("/100", "%");
											rating = `
							<img src="/imagens/tomato-svgrepo-com.svg">
							<h4 title="Rotten Tomatoes.">${cleanRating}</h4>
									  `;
										} else {
											const cleanRating = data.Ratings[1].Value.replace("/100", "%");
											rating = `
						<img src="/imagens/paint-mark-1-svgrepo-com.svg">
						<h4 title="Rotten Tomatoes.">${cleanRating}</h4>
						`;
										}
									}
									movieRating.innerHTML = `${imdb} ${rating}`;
								}
							});
						movieInfo.appendChild(movieTitle);
						movieInfo.appendChild(movieRating);

						movieArea.appendChild(movieInfo);

						bodyFilm.appendChild(movieArea);
					});
				} else {
					var listItem = document.createElement("div");
					listItem.textContent = "Nenhum filme encontrado";
					bodyFilm.appendChild(listItem);
				}
			});
	}

	fetchGenres();

	genreSelect.addEventListener("change", function () {
		let selectedGenre = genreSelect.value;
		if (selectedGenre === "Filtrar") {
			bodyFilm.innerHTML = "";
			prevPag.disabled = true;
			prevPag.style.cursor = "default";
			nextPag.disabled = true;
			nextPag.style.cursor = "default";
		} else {
			currentPage = 1;
			fetchMoviesByGenre(selectedGenre);
			prevPag.disabled = true;
			prevPag.style.cursor = "default";
			nextPag.disabled = false;
			nextPag.style.cursor = "pointer";
		}
	});

	prevPag.addEventListener("click", function () {
		if (currentPage > 1) {
			currentPage--;
			var scrollToOptions = { top: 420, behavior: "smooth" }; // Defina a posição desejada abaixo do topo (ex: 100 pixels)
			window.scrollTo(scrollToOptions);
			fetchMoviesByGenre(genreSelect.value);
			if (currentPage === 1) {
				prevPag.disabled = true;
				prevPag.style.cursor = "default";
			}
			nextPag.disabled = false;
		}
	});

	nextPag.addEventListener("click", function () {
		if (genreSelect.value !== "Filtrar") {
			currentPage++;
			var scrollToOptions = { top: 420, behavior: "smooth" }; // Defina a posição desejada abaixo do topo (ex: 100 pixels)
			window.scrollTo(scrollToOptions);
			fetchMoviesByGenre(genreSelect.value);
			prevPag.disabled = false;
			prevPag.style.cursor = "pointer";
			if (currentPage === maxPages) {
				nextPag.disabled = true;
			}
		}
	});
	document.addEventListener("DOMContentLoaded", function () {
		if (genreSelect.value === "Filtrar") {
			prevPag.disabled = true;
			nextPag.disabled = true;
			prevPag.style.color = "gray";
			nextPag.style.color = "gray";
		} else {
			prevPag.disabled = false;
			nextPag.disabled = false;
			prevPag.style.color = "";
			nextPag.style.color = "";
			prevPag.style.cursor = "pointer";
			nextPag.style.cursor = "pointer";
		}
	});
});
