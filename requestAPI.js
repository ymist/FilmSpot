const API_KEY = "6e5367d8"; //? API DO OMDB

const searchInput = document.getElementById("search-input");
const autocompleteResults = document.getElementById("auto-complete-results");

let timeoutId;

// Função que realiza a busca na API do OMDB
async function searchMovies(searchTerm) {
	const response = await fetch(`http://www.omdbapi.com/?apikey=${API_KEY}&s=${searchTerm.toLowerCase()}`);
	const data = await response.json();
	return data.Search;
}

// Função que exibe os resultados da busca na barra de autocomplete.
function displayResults(results) {
	autocompleteResults.innerHTML = "";
	const list = document.createElement("ul");
	results.forEach((result) => {
		const item = document.createElement("li");
		item.innerHTML = `${result.Title}<p>${result.Year}</p>`;
		const img = document.createElement("img");
		if (result.Poster == "N/A") {
			img.src = "/teste/image_not_found.png";
		} else {
			img.src = result.Poster;
		}
		item.insertBefore(img, item.firstChild);
		item.addEventListener("click", () => {
			searchInput.value = result.Title;
			getMovie();
			list.style.display = "none";
		});
		list.appendChild(item);
	});
	autocompleteResults.appendChild(list);
}

// evento de digitação na barra de busca
searchInput.addEventListener("input", async () => {
	clearTimeout(timeoutId);
	const searchTerm = searchInput.value.trim();
	if (searchTerm.length < 3) {
		autocompleteResults.innerHTML = "";
		return;
	}
	timeoutId = setTimeout(async () => {
		const results = await searchMovies(searchTerm);
		displayResults(results);
	}, 100);
});

// evento de clique fora da lista para escondê-la
document.addEventListener("click", (event) => {
	if (!autocompleteResults.contains(event.target)) {
		autocompleteResults.innerHTML = "";
	}
});

var movienamehtml = document.getElementById("search-input");
const res = document.getElementById("result");
const searchbtn = document.getElementById("search-btn");

//! Função para buscar dados da API.

var getMovie = () => {
	var movieName = movienamehtml.value;
	var url = `http://www.omdbapi.com/?t=${movieName}&plot=full&apikey=${API_KEY}`;

	//! Caso a barra de pesquisa não seja preenchida.

	if (movieName <= 0) {
		res.innerHTML = `<h3 class="msg">Por Favor insira um Filme ou Série! </h3>`;
	}

	//! Caso a barra de pesquisa seja preenchida.
	else {
		fetch(url)
			.then((resp) => resp.json())
			.then((data) => {
				if (data.Response == "True") {
					let writer = "";
					if (data.Writer == "N/A") {
						writer = "";
					} else {
						writer = `<h3>Writer</h3> <p>${data.Writer}</p>`;
					}
					let Director = "";
					if (data.Director == "N/A") {
						Director = "";
					} else {
						Director = `<h3>Director</h3> <p>${data.Director}</p>`;
					}
					let tipo = "";
					if (data.Type === "movie") {
						tipo = `<span>${data.Runtime}</span>`;
					} else if (data.Type === "series") {
						tipo = `<span>${data.totalSeasons} Temporadas</span>`;
					}
					let poster = "";
					if (data.Poster == "N/A") {
						poster = `<img src="/imagens/image_not_found.png" class="poster">`;
					} else {
						poster = `<img src =${data.Poster} class="poster">`;
					}
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
					let awards = "";
					if (data.Awards == "N/A") {
						awards = "";
					} else {
						awards = `<h3>Awards</h3>
						<p>${data.Awards}</p>`;
					}
					let imdb = "";
					if (data.imdbRating == "N/A") {
						imdb = "";
					} else {
						imdb = `
								<img src="/imagens/star-icon.svg">
								<h4 title="Rating IMDB.">${data.imdbRating}</h4>
							`;
					}
					let BoxOffice = "";
					if (data.BoxOffice == "N/A") {
						BoxOffice = "";
					} else {
						BoxOffice = `<h3>Box Office</h3> <p>${data.BoxOffice}</p>`;
					}
					res.innerHTML = `
                    <div class="info">
						${poster}
						<div>
							<h2>${data.Title}</h2>
							<div class="rating">
								${imdb}
								${rating}
							</div>
							<div class="details">
								<span>${data.Rated}</span>
								<span>${data.Year}</span>
									${tipo}
							</div>
							<div class= "genre">
								<div> ${data.Genre.split(",").join("</div><div>")}</div>
							</div>
							</div>
							</div>
							<h3>Plot</h3>
							<p>${data.Plot}</p>
							<h3>Cast</h3>
							<p>${data.Actors}</p>
							 ${Director}
							 ${writer}
							${awards}
							${BoxOffice}							
							`;
				}
				//! Caso o filme não exista no banco de dados.
				else {
					res.innerHTML = `<h3 class="msg">${data.Error}</h3>`;
				}
			})
			//! Caso um erro Ocorra
			.catch(() => {
				res.innerHTML = `<h3 class="msg">Ocorreu um erro!</h3>`;
			});
	}
};

searchbtn.addEventListener("click", getMovie);
window.addEventListener("load", () => {
	searchInput.value = "";
});
searchInput.addEventListener("keypress", function (event) {
	if (event.key === "Enter") {
		event.preventDefault();
		getMovie();
		autocompleteResults.innerHTML = "";
	}
});
