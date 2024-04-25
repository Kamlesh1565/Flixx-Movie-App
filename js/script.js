const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0YmQzZGExYTZiMzBlYWY2MzhhZjExODlmMTc1MGYxYyIsInN1YiI6IjY2MjUwYWFjMmUyYjJjMDE4NzY3NzkxNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.zsLdDoRI9rExfwZx1APKZfPOPO9CrZh-8JOM1MYzb3U'
    }
  };

const global = {
    search: {
        term: '',
        type: '',
        page:1,
        totalPages:1
    }
}

//highlight active link
function highlightActiveLink() {
    const links = document.querySelectorAll('.nav-link')
    links.forEach(link => {
        if (link.getAttribute('href') == window.location.pathname) {
            link.classList.add('active')
        }
    })
}

// function to create fetch request to API 
async function getFetchRequest(endpoint) {
    showSpinner()
    const res = await fetch(`https://api.themoviedb.org/3/${endpoint}`, options)
    const data = await res.json() 
    hideSpinner()
    return data;
}

//function to display popular movies
async function displayPopularMovies() {
    const { results } = await getFetchRequest('movie/popular')
    results.forEach(movie => {
        const div = document.createElement('div');
        div.className = 'card'

        div.innerHTML = `
            <a href="movie-details.html?id=${movie.id}">
                ${
                    movie.poster_path 
                    ? 
                    `<img
                src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
                alt="${movie.title}"
                class="card-img-top"
                />`
                    :
                    `
                    <img
                src="images/no-image.jpg"
                alt="${movie.title}"
                class="card-img-top"
                />
                    `
                }
            </a>
            <div class="card-body">
                <h5 class="card-title">${movie.title}</h5>
                <p class="card-text">
                <small class="text-muted">Release: ${movie.release_date}</small>
                </p>
            </div>
                        `
        document.querySelector('#popular-movies').appendChild(div)
    })

}
//function to display poular tv shows
async function displayPopularShows() {
    const { results } = await getFetchRequest('tv/popular')
    results.forEach(tv => {
        const div = document.createElement('div');
        div.className = 'card'

        div.innerHTML = `
            <a href="tv-details.html?id=${tv.id}">
                ${
                    tv.poster_path 
                    ? 
                    `<img
                src="https://image.tmdb.org/t/p/w500${tv.poster_path}"
                alt="${tv.name}"
                class="card-img-top"
                />`
                    :
                    `
                    <img
                src="images/no-image.jpg"
                alt="${tv.name}"
                class="card-img-top"
                />
                    `
                }
            </a>
            <div class="card-body">
                <h5 class="card-title">${tv.name}</h5>
                <p class="card-text">
                <small class="text-muted">Aired: ${tv.first_air_date}</small>
                </p>
            </div>
                        `
        document.querySelector('#popular-shows').appendChild(div)
    })
}

// display movie details 
async function displayMovieDetails() {
    const movieID = window.location.search.split('=')[1]
    const movie =  await getFetchRequest(`movie/${movieID}`)
    setBackdrop('movie', movie.backdrop_path)
    const div = document.createElement('div')
    div.innerHTML = 
        `
            <div class="details-top">
            <div>
            ${
                movie.poster_path 
                ? 
                `<img
            src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
            alt="${movie.title}"
            class="card-img-top"
            />`
                :
                `
                <img
            src="images/no-image.jpg"
            alt="${movie.title}"
            class="card-img-top"
            />
                `
            }
            </div>
            <div>
                <h2>${movie.title}</h2>
                <p>
                <i class="fas fa-star text-primary"></i>
                ${movie.vote_average} / 10
                </p>
                <p class="text-muted">Release Date: ${movie.release_date}</p>
                <p>
                ${movie.overview}
                </p>
                <h5>Genres</h5>
                <ul class="list-group">
                ${movie.genres.map(genre => `<li>${genre.name}</li>`).join('')}                                   
                </ul>
                <a href="${movie.homepage}" target="_blank" class="btn">Visit Movie Homepage</a>
            </div>
            </div>
            <div class="details-bottom">
            <h2>Movie Info</h2>
            <ul>
                <li><span class="text-secondary">Budget:</span> $${numberWithCommas(movie.budget)}</li>
                <li><span class="text-secondary">Revenue:</span> $${numberWithCommas(movie.revenue)}</li>
                <li><span class="text-secondary">Runtime:</span> ${movie.runtime} minutes</li>
                <li><span class="text-secondary">Status:</span> ${movie.status}</li>
            </ul>
            <h4>Production Companies</h4>
            <div class="list-group">
                ${
                    movie.production_companies.map(company => `<li>${company.name}</li>`).join('')
                }
            </div>       
        `
    document.querySelector('#movie-details').appendChild(div)
}

// display tv show details
async function displayTVShowDetails() {
    const tvID = window.location.search.split('=')[1]
    const tv = await getFetchRequest(`tv/${tvID}`)
    
    setBackdrop('show', tv.backdrop_path)
    const div = document.createElement('div')
    div.innerHTML = 
        `
            <div class="details-top">
            <div>
            ${
                tv.poster_path 
                ? 
                `<img
            src="https://image.tmdb.org/t/p/w500${tv.poster_path}"
            alt="${tv.name}"
            class="card-img-top"
            />`
                :
                `
                <img
            src="images/no-image.jpg"
            alt="${tv.name}"
            class="card-img-top"
            />
                `
            }
            </div>
            <div>
            <h2>${tv.name}</h2>
            <p>
                <i class="fas fa-star text-primary"></i>
                ${tv.vote_average} / 10
            </p>
            <p class="text-muted">First Air Date: ${tv.first_air_date}</p>
            <p>
                ${tv.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
                ${
                    tv.genres.map(genre => `<li>${genre.name}</li>`).join('')
                }
            </ul>
            <a href="${tv.homepage}" target="_blank" class="btn">Visit Show Homepage</a>
            </div>
        </div>
        <div div class="details-bottom">
            <h2>Show Info</h2>
            <ul>
            <li><span class="text-secondary">Number Of Episodes:</span> ${tv.number_of_episodes}</li>
            <li>
                <span class="text-secondary">Last Episode To Air:</span> ${tv.last_episode_to_air.name} (S${tv.last_episode_to_air.season_number} E${tv.last_episode_to_air.episode_number})
            </li>
            <li><span class="text-secondary">Status:</span> ${tv.status}</li>
            </ul>
            <h4>Production Companies</h4>
            <div class="list-group">
                ${
                    tv.production_companies.map(company => `<li>${company.name}</li>`).join('')
                }
            </div>
        </div>
        `
    document.querySelector('#show-details').appendChild(div)
}

// function to set deatils page backdrop 
async function setBackdrop(type, path) {
    const overlayDiv = document.createElement('div')
    overlayDiv.style.background = `url(https://image.tmdb.org/t/p/original/${path})`

    overlayDiv.style.backgroundSize = 'cover';
    overlayDiv.style.backgroundPosition = 'center';
    overlayDiv.style.backgroundRepeat = 'no-repeat';
    overlayDiv.style.height = '100vh';
    overlayDiv.style.width = '100vw';
    overlayDiv.style.position = 'absolute';
    overlayDiv.style.top = '0';
    overlayDiv.style.left = '0';
    overlayDiv.style.zIndex = '-1';
    overlayDiv.style.opacity = '0.25';

    if (type == 'movie') {
        document.querySelector('#movie-details').appendChild(overlayDiv)
    } else {
        document.querySelector('#show-details').appendChild(overlayDiv)
    }
}

//search function 
async function search() {
    const searchQuery = window.location.search
    const urlName = new URLSearchParams(searchQuery)

    global.search.term = urlName.get('search-term')
    global.search.type = urlName.get('type')

    console.log(global.search.type);

    if (global.search.term != '' && global.search.term != null) {
        const res = await fetch(`https://api.themoviedb.org/3/search/${global.search.type}?query=${global.search.term}`, options)
        const { results } = await res.json() 
        console.log(results);
        if (global.search.type == 'movie') {
            results.forEach(movie => {
                const div = document.createElement('div')
                div.classList.add('card')
                div.innerHTML = 
                    `
                        <a href="/movie-details.html?id=${movie.id}">
                        ${
                            movie.poster_path 
                            ? 
                            `<img
                        src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
                        alt="${movie.title}"
                        class="card-img-top"
                        />`
                            :
                            `
                            <img
                        src="images/no-image.jpg"
                        alt="${movie.title}"
                        class="card-img-top"
                        />
                            `
                        }
                        </a>
                        <div class="card-body">
                        <h5 class="card-title">${movie.title}</h5>
                        <p class="card-text">
                            <small class="text-muted">Release: ${movie.release_date}</small>
                        </p>
                        </div>
                    `
                document.querySelector('#search-results').appendChild(div)
            })
        } else {
            results.forEach(tv => {
                const div = document.createElement('div')
                div.classList.add('card')
                div.innerHTML = 
                    `
                        <a href="/tv-details.html?id=${tv.id}">
                        ${
                            tv.poster_path 
                            ? 
                            `<img
                        src="https://image.tmdb.org/t/p/w500${tv.poster_path}"
                        alt="${tv.name}"
                        class="card-img-top"
                        />`
                            :
                            `
                            <img
                        src="images/no-image.jpg"
                        alt="${tv.name}"
                        class="card-img-top"
                        />
                            `
                        }
                        </a>
                        <div class="card-body">
                        <h5 class="card-title">${tv.name}</h5>
                        <p class="card-text">
                            <small class="text-muted">Release: ${tv.release_date}</small>
                        </p>
                        </div>
                    `
                document.querySelector('#search-results').appendChild(div)
            })
        }
    } else{
        showAlert('Please enter a search term')
    }
}

// show alert function
function showAlert(message, className) {
    const alertEl = document.createElement('div')
    alertEl.classList.add('alert', className)
    alertEl.appendChild(document.createTextNode(message))
    document.querySelector('#alert').appendChild(alertEl)

    setTimeout(() => {alertEl.remove()},3000)
}

// adding swiper 
async function addSwiper() {
    const { results }  = await getFetchRequest('movie/now_playing')

    results.forEach(movie => {
        const div = document.createElement('div')
        div.classList.add('swiper-slide')
        div.innerHTML = 
            `
                <a href="movie-details.html?id=${movie.id}">
                <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="Movie Title" />
                </a>
                <h4 class="swiper-rating">
                <i class="fas fa-star text-secondary"></i> ${movie.vote_average.toFixed(1)} / 10
                </h4>
            `
        document.querySelector('.swiper-wrapper').appendChild(div)
        initSwiper()
    })
}
// initialising swiper
function initSwiper() {
    const swiper = new Swiper('.swiper', {
        slidesPerView: 1,
        
        freeMode: true,
        loop: true,
        spaceBetween: 30,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false 
        },
        breakpoints: {
            500:{
                slidesPerView:2
            },
            700: {
                slidesPerView:3
            },
            1200: {
                slidesPerView:4
            }
        }
    })
}

function init() {
    switch (window.location.pathname) {
        case '/': 
        case 'index.html':
            console.log('homepage');
            displayPopularMovies()
            addSwiper()
            break;
        case '/movie-details.html':
            console.log('movie-details');
            displayMovieDetails()
            break;
        case '/shows.html':
            console.log('Shows page');
            displayPopularShows();
            break;
        case '/search.html':
            console.log('search page');
            search()
            break;
        case '/tv-details.html':
            console.log('tv-details page');
            displayTVShowDetails();
            break;
    }
    
    highlightActiveLink()
}

const spinner = document.querySelector('.spinner')
function showSpinner() {
    spinner.classList.add('show')
}
function hideSpinner() {
    spinner.classList.remove('show')
}

function numberWithCommas(x) {
    x = x.toString();
    var pattern = /(-?\d+)(\d{3})/;
    while (pattern.test(x))
        x = x.replace(pattern, "$1,$2");
    return x;
}


document.addEventListener('DOMContentLoaded', init)

