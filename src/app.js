import { baseUrl, apiToken, imageUrl } from "./config.js";

const nowPlayingEndpoint = `${baseUrl}/movie/now_playing`;
const searchMovieEndpoint = (query) => `${baseUrl}/search/movie?query=${query}`;
const movieDetailEndpoint = (movieId) => `${baseUrl}/movie/${movieId}`;
const fetchOptions = {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiToken}`,
  },
};
const contentElm = document.querySelector("#content");
const app = () => {
  const displayLoading = (state) => {
    if (state) {
      contentElm.innerHTML = `
      <div class="text-center">
        <div class="spinner-border text-center" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
      </div>
        `;
    }
  };
  const displayMovies = (movies) => {
    let moviesTemplate = `
        <div class="row row-cols-1 row-cols-md-3 g-2 g-4">
        `;
    if (movies.length < 1) {
      displayAlert("Data tidak ditemukan");
      return false;
    }
    movies.forEach((movie) => {
      const { id, original_title, overview, poster_path } = movie;
      moviesTemplate += `
            <div class="col-lg-4 col-md-6 col-sm-12">
            <div class="card h-100">
              <img src="${imageUrl}${poster_path}" class="card-img-top" alt="..." />
              <div class="card-body">
                <h5 class="card-title">${original_title}</h5>
                <p class="card-text truncate">
                  ${overview}
                </p>
                <a href="#" data-id="${id}" class="card-link link-detail">Detail</a>
              </div>
            </div>
          </div>
            `;
    });
    moviesTemplate += `</div>`;
    contentElm.innerHTML = moviesTemplate;

    document.querySelectorAll('.link-detail').forEach((element) => {
      element.addEventListener('click', function(e){
        getDetail(e.target.dataset.id)
      });
    });
  };
  const getNowPlayingList = () => {
    displayLoading(true);
    fetch(nowPlayingEndpoint, fetchOptions)
      .then((response) => response.json())
      .then((responseJson) => displayMovies(responseJson.results))
      .catch((error) => console.error(error));
  };

  
  const displayDetail = (detail) => {
    const {overview, release_date, popularity, vote_average, genres, original_title, poster_path} = detail;
    const template = `
    <div class="card">
      <div class="card-header">
      ${original_title}
      </div>
      <div class="card-body">
        <div class="row g-3">
          <div class="col-12 col-md-4">
            <img src="${imageUrl}${poster_path}" class="card-img-top img-fluid" alt="..." />
          </div>
          <div class="col-12 col-md-8">
            <p class="card-text">
              <strong>Overview : </strong><br>
              ${overview}
            </p>
            <p>
              <strong>Popularity : </strong><br>
              ${popularity}
            </p>
            <p>
              <strong>Vote Average : </strong><br>
              ${vote_average}
            </p>
            <p>
              <strong>Release Date : </strong><br>
              ${release_date}
            </p>
          </div>
        </div>
      </div> 
      <div class="card-footer d-flex justify-content-end">
        <button type="button" data-id="" id='btnBack' class="btn btn-success">Kembali</button>
      </div>
    </div>
    `;

    contentElm.innerHTML = template;
    document.getElementById('btnBack').addEventListener('click', getNowPlayingList);
  }

  const getDetail = (id) => {
    displayLoading(true);
    fetch(movieDetailEndpoint(id), fetchOptions).then(response => response.json()).then((response) => {
      console.log(response);
      displayDetail(response);
    }).catch(error => console.log(error)).finally(() => displayLoading(false))
  }

  const displayAlert = (message) => {
    contentElm.innerHTML = `<div class="alert alert-warning" role="alert">
    ${message}
  </div>`;
  };
  const searchBtn = document.querySelector("#btnSearch");
  const searchText = document.querySelector("#searchInput");
  searchText.addEventListener("input", function (event) {
    if (this.value.length < 1) getNowPlayingList();
  });

  searchText.addEventListener("keydown", function (event) {
    if (
      this.value.length > 0 &&
      (event.key === "Enter" || event.keyCode === 13)
    ) {
      event.preventDefault();
      searchMovies();
    }
  });

  searchBtn.addEventListener("click", function (event) {
    event.preventDefault();
    if (searchText.value.length > 1) searchMovies();
  });
  const searchMovies = async () => {
    displayLoading(true);
    try {
      const movieList = await fetch(
        searchMovieEndpoint(searchText.value),
        fetchOptions
      );
      const responseJson = await movieList.json();
      displayMovies(responseJson.results);
      console.log(responseJson.results);
    } catch (error) {
      console.log(error);
      displayAlert("Terjadi error saat mengambil data");
    }
  };
  contentElm.addEventListener("click", function (event) {
    if (event.target.classList.contains("card-link")) {
      //   console.log(this.target);
      const movieId = event.target.dataset.id;
      //   panggil function untuk menampilkan detail film
    }
  });
  window.addEventListener("DOMContentLoaded", getNowPlayingList);
};
export default app;
