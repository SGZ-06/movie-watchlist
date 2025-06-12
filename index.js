// let myWatchList = [];
const moviesEL = document.getElementById("movies-list-container");
const searchFieldForm = document.getElementById("search-field");
let myWatchList = JSON.parse(localStorage.getItem("myWatchList")) || [];
console.log(myWatchList);

if (myWatchList && window.location.pathname === "/my-list.html") {
  getHtmlMovies(myWatchList);
}

if (searchFieldForm) {
  searchFieldForm.addEventListener("submit", (e) => {
    e.preventDefault();
    handleSubmitForm();
  });
}

document.addEventListener("click", (e) => {
  if (e.target.dataset.add) {
    handleAddMovieButton(e.target.dataset.add);
  }
  if (e.target.dataset.delete) {
    handleDeleteMovieButton(e.target.dataset.delete);
  }
});

function handleSubmitForm() {
  const searchFieldInput = document.getElementById("search-field_input");
  fetch(`http://www.omdbapi.com/?apikey=66ffe27e&s=${searchFieldInput.value}`)
    .then((res) => res.json())
    .then((data) => {
      getMovies(data.Search);
      searchFieldInput.value = "";
    });
}

function handleAddMovieButton(movieID) {
  fetch(`http://www.omdbapi.com/?apikey=66ffe27e&i=${movieID}`)
    .then((response) => response.json())
    .then((data) => {
      myWatchList.push(data);
      localStorage.setItem("myWatchList", JSON.stringify(myWatchList));
      console.log(localStorage.getItem("myWatchList"));
    });
}

function handleDeleteMovieButton(movieID) {
  const movieIndex = myWatchList.findIndex((movie) => movie.imdbID === movieID);
  myWatchList.splice(movieIndex, 1);
  localStorage.setItem("myWatchList", JSON.stringify(myWatchList));
  getHtmlMovies(myWatchList);
}

function getMovies(moviesData) {
  const requests = moviesData.map((movie) =>
    fetch(`http://www.omdbapi.com/?apikey=66ffe27e&i=${movie.imdbID}`).then(
      (response) => response.json()
    )
  );

  Promise.all(requests)
    .then((moviesArray) => getHtmlMovies(moviesArray))
    .catch(console.error);
}

function getHtmlMovies(moviesData) {
  let moviesHTML = "";
  const isMyWatchPage = window.location.pathname === "/my-list.html";
  const icon = isMyWatchPage ? "minus" : "plus";
  const iconDataSet = isMyWatchPage ? "delete" : "add";
  const iconAction = isMyWatchPage ? "  Remove" : "  Watchlist";

  moviesData.forEach((movie) => {
    moviesHTML += `
    <div class="movie-card">
        <img src="${movie.Poster}" />
        <div class="movie-card_info">
          <div class="movie-card_info_top">
            <h3>${movie.Title}</h3>
            <span><i class="fa-sharp fa-solid fa-star"></i>  ${movie.imdbRating}</span>
          </div>
          <div class="movie-card_info_middle">
            <h4>${movie.Runtime}</h4>
            <h4>${movie.Genre}</h4>
            <span><i class="fa-solid fa-circle-${icon}" data-${iconDataSet}="${movie.imdbID}"></i>${iconAction}</span>
          </div>
          <div class="movie-card_info_bottom">
            <p>
              ${movie.Plot}
            </p>
          </div>
        </div>
      </div>`;
  });
  renderMovies(moviesHTML);
}

function renderMovies(moviesHTML) {
  const randomCont = document.querySelector(".without-movies");
  randomCont.classList.add("hidden");
  moviesEL.innerHTML = moviesHTML;
  if (!moviesHTML) {
    randomCont.classList.remove("hidden");
  }
}
