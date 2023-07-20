const input_movie = document.getElementById("input_movie");
const btn_search = document.getElementById("btn_search");
const span_alert = document.getElementById("span_alert");
const span_success = document.getElementById("span_success");
const div_content = document.getElementById("div_content");
const div_movies_found = document.getElementById("div_movies_found");

const div_description = document.getElementById("div_description");
const span_cross_close = document.getElementById("span_cross_close");
const text_actors = document.getElementById("text_actors");
const text_country = document.getElementById("text_country");
const text_date = document.getElementById("text_date");
const text_duration = document.getElementById("text_duration");
const text_rate = document.getElementById("text_rate");

let movies = [];
let observer = [];

let descriptions = new Array();

const getMovie = async (prompt)=>{
  prompt = prompt.split(' ').join('+');

  div_movies_found.innerHTML = '';
  descriptions = [];

  const res = await fetch(`https://www.omdbapi.com/?s=${prompt}&plot=full&apikey=d88f08ea`);
  const data = await res.json();
  if (data.Response == 'False'){
    span_alert.style.display = "block";
    span_success.style.display = "none";
  } else {
    span_alert.style.display = "none";
    span_success.style.display = "block";
    span_success.innerHTML = data.Search.length + " film(s) trouvé(s)."

    for (let i = 0 ; i < data.Search.length ; i++)
    {
      const id = data.Search[i].imdbID;
      const resID = await fetch(`https://www.omdbapi.com/?i=${id}&plot=full&apikey=d88f08ea`)
      const dataID = await resID.json();

      appendMovieDiv(data.Search[i], dataID);
    }

    movies = document.querySelectorAll(".movie");

    observer  = new IntersectionObserver(entries => {
      entries.forEach(entry=>{
        entry.target.classList.toggle("show", entry.isIntersecting);
      })
    },
    {
      threshold: 0.5
    });

    movies.forEach(movie=>{
      observer.observe(movie);
    });

    for (let i = 0 ; i < movies.length ; i ++){
      movies[i].addEventListener("mousedown", ()=>{
        showDescription(descriptions[i]);
      });
    }
  }
}

const showDescription = (description) =>{
  document.body.style.backgroundColor = "rgb(230, 235, 225)";
  div_description.style.display = "block";
  text_actors.innerHTML = "<b>Acteurs : </b>" + description.actors;
  text_country.innerHTML = "<b>Pays : </b>" + description.country;
  text_date.innerHTML = "<b>Date de sortie : </b>" + description.date;
  text_duration.innerHTML = "<b>Durée : </b>" + description.duration;
  text_rate.innerHTML = "<b>Note : </b>" + description.rate;
}

const appendMovieDiv = (movieData, dataImdb) =>{
  descriptions.push({actors : dataImdb.Actors, country: dataImdb.Country, date: dataImdb.Released, duration: dataImdb.Runtime, rate: dataImdb.imdbRating});

  const divMovie = document.createElement("div");
  divMovie.setAttribute("class","movie");

  const titleMovie = document.createElement("p");
  const yearMovie = document.createElement("p");
  const posterMovie = document.createElement("img");

  titleMovie.innerHTML+= "<b>Titre : </b>" + movieData.Title;
  yearMovie.innerHTML+= "<b>Année : </b>" + movieData.Year;

  if (movieData.Poster != 'N/A')
  {
    posterMovie.src = movieData.Poster;
  } else {
    posterMovie.src = "https://image.noelshack.com/fichiers/2023/29/3/1689790180-notfound.jpg";
  }

  divMovie.appendChild(titleMovie);
  divMovie.appendChild(yearMovie);
  divMovie.appendChild(posterMovie);
  
  div_movies_found.appendChild(divMovie);
}

document.addEventListener('wheel', isDescriptionOpened, { passive: false });
function isDescriptionOpened(event) {
  div_description.style.display == "block" ? event.preventDefault() : null;
}

span_cross_close.addEventListener("click", ()=>{
  document.body.style.backgroundColor = "rgb(252, 249, 238)";
  div_description.style.display = "none";
})

btn_search.addEventListener("click", ()=>{
  getMovie(input_movie.value);
});