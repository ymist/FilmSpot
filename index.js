const keyOmdbApi = "6e5367d8"; //? API DO OMDB

const searchInput = document.getElementById("search-input"); // Entrada dos Nomes dos Filmes ou Séries
const autocompleteResults = document.getElementById("auto-complete-results"); // Auto Complete do input, mostrando a lista de itens.

//Função que realiza a busca na API do OMDB para fazer a lista de itens para o autocomplete.
async function buscarItens(termoDeBusca) {
	const response = await fetch(`http://www.omdbapi.com/?apikey=${keyOmdbApi}&s=${termoDeBusca.toLowerCase()}`);
	const data = await response.json();
	return data.Search;
}

// Função que exibe os resultados da busca na barra de autocomplete.
function resultadoAutoComplete(results) {
	autocompleteResults.innerHTML = "";
	const list = document.createElement("ul");

	// Cria um HTMLelement "li" e "img" para toda vez que houver resultado na busca da API, ser preenchido com Título, Poster e Ano.
	results.forEach((result) => {
		const item = document.createElement("li");
		item.innerHTML = `${result.Title}<p>${result.Year}</p>`;
		// Condição para se houver ou não uma Imagem para os itens.
		const img = document.createElement("img");
		if (result.Poster == "N/A") {
			img.src = "/imagens/image_not_found.png";
		} else {
			img.src = result.Poster;
		}
		item.insertBefore(img, item.firstChild);
		// Cria um evento de "click" em cada item da lista do autocomplete.
		item.addEventListener("click", () => {
			searchInput.value = result.Title;
			getMovie();
			list.style.display = "none";
		});
		list.appendChild(item);
	});
	autocompleteResults.appendChild(list);
}

let timeoutId;
// Evento que cria o evento de autocomplete enquanto o input está sendo preenchido.
searchInput.addEventListener("input", async () => {
	clearTimeout(timeoutId);
	const termoDeBusca = searchInput.value.trim();
	if (termoDeBusca.length < 3) {
		autocompleteResults.innerHTML = "";
		return;
	}
	timeoutId = setTimeout(async () => {
		const results = await buscarItens(termoDeBusca);
		resultadoAutoComplete(results);
	}, 100);
});

// Evento que esconde a barra de autocomplete quando á um "click" fora dela.
document.addEventListener("click", (event) => {
	if (!autocompleteResults.contains(event.target)) {
		autocompleteResults.innerHTML = "";
	}
});

var movienamehtml = document.getElementById("search-input");
const resultadoDasFuncoes = document.getElementById("result");
const botaoBarraDePesquisa = document.getElementById("search-btn");

/* Função que faz a busca na API do OMDB com o Input inserido na barra 
e retorna com os dados do item, poster, faixa etária, genêros, plot, cast, director e etc...*/
var getMovie = () => {
	var movieName = movienamehtml.value;
	const url = `http://www.omdbapi.com/?t=${movieName}&plot=full&apikey=${keyOmdbApi}`;

	// Caso a barra de pesquisa não seja preenchida.

	if (movieName.length <= 0) {
		resultadoDasFuncoes.innerHTML = `<h3 class="msg">Por Favor insira um Filme ou Série! </h3>`;
	}

	//Caso a barra de pesquisa seja preenchida corretamente, irá buscar na API, o nome do Item e retornar os seus dados..
	else {
		fetch(url)
			.then((resp) => resp.json())
			.then((data) => {
				if (data.Response == "True") {
					let escritorOmdb = data.Writer === "N/A" ? "" : `<h3>Writer</h3> <p>${data.Writer}</p>`;
					let diretorOmdb = data.Director === "N/A" ? "" : `<h3>Director</h3> <p>${data.Director}</p>`;
					let tipoItemOmdb =
						data.Type === "movie"
							? `<span>${data.Runtime}</span>`
							: `<span>${data.totalSeasons} Temporadas</span>`;
					let posterOmdb =
						data.Poster === "N/A"
							? `<img src="/imagens/image_not_found.png" class="poster">`
							: `<img src =${data.Poster} class="poster">`;

					let notaRottenTomatoes = "";
					if (data.Ratings.length > 0) {
						if (data.Ratings[1].Value >= "60") {
							const limparNotaRotten = data.Ratings[1].Value.replace("/100", "%");
							notaRottenTomatoes = `
							<img src="/imagens/tomato-svgrepo-com.svg">
							<h4 title="Rotten Tomatoes.">${limparNotaRotten}</h4>
									  `;
						} else {
							const limparNotaRotten = data.Ratings[1].Value.replace("/100", "%");
							notaRottenTomatoes = `
						<img src="/imagens/paint-mark-1-svgrepo-com.svg">
						<h4 title="Rotten Tomatoes.">${limparNotaRotten}</h4>
						`;
						}
					}
					let premiosOmdb = data.Awards === "N/A" ? "" : `<h3>Awards</h3> <p>${data.Awards}</p>`;
					let notaImdb =
						data.imdbRating === "N/A"
							? ""
							: ` <img src="/imagens/star-icon.svg"> <h4 title="Rating IMDB.">${data.imdbRating}</h4>`;
					resultadoDasFuncoes.innerHTML = `
                    <div class="info">
						${posterOmdb}
						<div>
							<h2>${data.Title}</h2>
							<div class="rating">
								${notaImdb}
								${notaRottenTomatoes}
							</div>
							<div class="details">
								<span>${data.Rated}</span>
								<span>${data.Year}</span>
									${tipoItemOmdb}
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
							 ${diretorOmdb}
							 ${escritorOmdb}
							${premiosOmdb}							
							`;
				}
				// Caso o filme não exista no banco de dados.
				else {
					resultadoDasFuncoes.innerHTML = `<h3 class="msg">${data.Error}</h3>`;
				}
			})
			// Caso um erro incomum ocorra.
			.catch(() => {
				resultadoDasFuncoes.innerHTML = `<h3 class="msg">Ocorreu um erro!</h3>`;
			});
	}
};
// Cria um evento "click" no botão da barra de pesquisa.
botaoBarraDePesquisa.addEventListener("click", getMovie);
window.addEventListener("load", () => {
	searchInput.value = "";
});
// Cria um evento "click" na tecla enter no input da barra de pesquisa.
searchInput.addEventListener("keypress", function (event) {
	if (event.key === "Enter") {
		event.preventDefault();
		getMovie();
		autocompleteResults.innerHTML = "";
	}
});

//Aqui o código começa a usar também uma API chamada TMDB.api pois ela trás algumas funções diferentes.
const keyApiTMDB = "a65a2379df321bc528f0d3b5c209b2cf";
// Define a linguagem da API em inglês.
const language = "en";
// Local onde aparecerá os itens filtrados por genêro.
var listaPorGenero = document.getElementById("listaPorGenero");
// Define a página atual da API TMDB.
let paginaAtual = 1;

// Evento para que carregue a função antes do CSS.
document.addEventListener("DOMContentLoaded", function () {
	var selecionarGenero = document.getElementById("genre-select");

	// Função que realiza a busca na API do TMDB para obter os gêneros disponíveis.
	function procurarGeneros() {
		fetch(
			`https://api.themoviedb.org/3/genre/movie/list?api_key=${keyApiTMDB}&language=${language}&page=${paginaAtual}&per_page=20`
		)
			.then(function (response) {
				return response.json();
			})
			.then(function (data) {
				var generosDisponiveis = data.genres;

				// Preenche o select com os gêneros disponíveis e cria um HTMLelement "option" a cada genêro.
				generosDisponiveis.forEach(function (genre) {
					var selectGeneros = document.createElement("option");
					selectGeneros.value = genre.id;
					selectGeneros.textContent = genre.name;
					selecionarGenero.appendChild(selectGeneros);
				});
			})
			//Caso ocorra um erro.
			.catch(function (error) {
				console.log("Ocorreu um erro:", error);
			});
	}
	// Função que busca os itens na API dependendo do genêro selecionado.
	function buscarItensPorGeneros(generoSelecionado) {
		// Caso não seja escolhido nenhum filtro, não retorna nada.
		if (generoSelecionado === "Filtrar") {
			listaPorGenero.innerHTML = "";
			return;
		}

		// Faz uma chamada para a API do TMDB para obter os filmes do gênero selecionado
		let urlAPITmdb = `https://api.themoviedb.org/3/discover/movie?api_key=${keyApiTMDB}&with_genres=${generoSelecionado}&language=${language}&page=${paginaAtual}&per_page=10`;
		fetch(urlAPITmdb)
			.then(function (response) {
				return response.json();
			})
			.then(function (data) {
				var itensTmdb = data.results;
				listaPorGenero.innerHTML = "";
				// Caso o número de itens for maior que zero, retornará 20 itens por página, com nome, poster e notas do imdb e rotten tomatoes.
				if (itensTmdb.length > 0) {
					itensTmdb.forEach(function listaDeItensTmdb(movie) {
						let posterTMDB = "https://image.tmdb.org/t/p/w300" + movie.poster_path;

						var cardItens = document.createElement("div");
						cardItens.className = "areaFilm";
						cardItens.style.background = `linear-gradient(to top, rgb(0, 0, 0), rgba(0, 0, 0, 0)), url("${posterTMDB}")`;
						cardItens.style.backgroundSize = `100%`;
						// Evento de "click" no card do item, carregue a função getMovie() e com um scroll smooth até o topo.
						cardItens.addEventListener("click", function () {
							var nomeItem = tituloItem.textContent;
							searchInput.value = nomeItem;
							getMovie();
							let scrollMove = { top: 0, behavior: "smooth" };
							window.scrollTo(scrollMove);
						});
						var informacoesItem = document.createElement("div");
						informacoesItem.className = "infoFilmHome";

						var tituloItem = document.createElement("h2");
						tituloItem.className = "FilmNameHome";
						tituloItem.textContent = movie.title;
						// Realiza uma busca na API do OMDB apenas para ter a nota do rotten tomatoes e imdb.
						var notasItem = document.createElement("div");
						notasItem.className = "notahome";
						var omdbUrl = `http://www.omdbapi.com/?t=${movie.title}&plot=full&apikey=${keyOmdbApi}`;
						fetch(omdbUrl)
							.then((resp) => resp.json())
							.then((data) => {
								if (data.Response === "True") {
									let notaRottenTomatoes = "";
									if (data.Ratings.length > 0) {
										if (data.Ratings[1].Value >= "60") {
											const limparNotaRotten = data.Ratings[1].Value.replace("/100", "%");
											notaRottenTomatoes = `
												<img src="/imagens/tomato-svgrepo-com.svg">
												<h4 title="Rotten Tomatoes.">${limparNotaRotten}</h4>
									  `;
										} else {
											const limparNotaRotten = data.Ratings[1].Value.replace("/100", "%");
											notaRottenTomatoes = `
													<img src="/imagens/paint-mark-1-svgrepo-com.svg">
													<h4 title="Rotten Tomatoes.">${limparNotaRotten}</h4>
						`;
										}
									}
									let notaImdb =
										data.imdbRating === "N/A"
											? ""
											: ` <img src="/imagens/star-icon.svg"> <h4 title="Rating IMDB.">${data.imdbRating}</h4>`;
									notasItem.innerHTML = `${notaImdb} ${notaRottenTomatoes}`;
								}
							});
						informacoesItem.appendChild(tituloItem);
						informacoesItem.appendChild(notasItem);

						cardItens.appendChild(informacoesItem);

						listaPorGenero.appendChild(cardItens);
					});
				} else {
					var listaDeItensVazia = document.createElement("div");
					listaDeItensVazia.textContent = "Nenhum filme encontrado";
					listaPorGenero.appendChild(listaDeItensVazia);
				}
			});
	}

	procurarGeneros();
	// Configurações iniciais dos botões de Proxima Pagina e Anterior.
	let paginaSeguinte = document.getElementById("next-page-btn");
	let paginaAnterior = document.getElementById("prev-page-btn");
	paginaAnterior.disabled = true;
	paginaAnterior.style.cursor = "default";
	paginaSeguinte.disabled = true;
	paginaSeguinte.style.cursor = "default";
	//Evento de "change" para quando o filtro seja mudado, atualizará os resultados e a pagina volte a 1.
	selecionarGenero.addEventListener("change", function () {
		let generoSelecionado = selecionarGenero.value;
		if (generoSelecionado === "Filtrar") {
			listaPorGenero.innerHTML = "";
			paginaAnterior.disabled = true;
			paginaAnterior.style.cursor = "default";
			paginaSeguinte.disabled = true;
			paginaSeguinte.style.cursor = "default";
		} else {
			paginaAtual = 1;
			var scrollMove = { top: 420, behavior: "smooth" };
			window.scrollTo(scrollMove);
			buscarItensPorGeneros(generoSelecionado);
			paginaAnterior.disabled = true;
			paginaAnterior.style.cursor = "default";
			paginaSeguinte.disabled = false;
			paginaSeguinte.style.cursor = "pointer";
		}
	});
	//Evento de "click" para voltar uma página.
	paginaAnterior.addEventListener("click", function () {
		if (paginaAtual > 1) {
			paginaAtual--;
			var scrollMove = { top: 420, behavior: "smooth" };
			window.scrollTo(scrollMove);
			buscarItensPorGeneros(selecionarGenero.value);
			if (paginaAtual === 1) {
				paginaAnterior.disabled = true;
				paginaAnterior.style.cursor = "default";
			}
			paginaSeguinte.disabled = false;
		}
	});
	//Evento de "click" para avançar uma página.
	paginaSeguinte.addEventListener("click", function () {
		if (selecionarGenero.value !== "Filtrar") {
			paginaAtual++;
			var scrollMove = { top: 420, behavior: "smooth" };
			window.scrollTo(scrollMove);
			buscarItensPorGeneros(selecionarGenero.value);
			paginaAnterior.disabled = false;
			paginaAnterior.style.cursor = "pointer";
			if (paginaAtual === maxPages) {
				paginaSeguinte.disabled = true;
			}
		}
	});
	//Configurações dos botões ao iniciar a página.
	document.addEventListener("DOMContentLoaded", function () {
		if (selecionarGenero.value === "Filtrar") {
			paginaAnterior.disabled = true;
			paginaSeguinte.disabled = true;
			paginaAnterior.style.color = "gray";
			paginaSeguinte.style.color = "gray";
		} else {
			paginaAnterior.disabled = false;
			paginaSeguinte.disabled = false;
			paginaAnteriorior.style.color = "";
			paginaSeguinte.style.color = "";
			paginaAnterior.style.cursor = "pointer";
			paginaSeguinte.style.cursor = "pointer";
		}
	});
});
