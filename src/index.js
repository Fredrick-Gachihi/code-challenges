// Your code here
const localHostUrl = 'http://localhost:3000';
const movieDetailsEl = document.querySelector('.movie-details');
const filmListEl = document.querySelector('#films');

function getMovieDetails(movieId) {
  fetch(`${localHostUrl}/films/${movieId}`)
    .then(response => response.json())
    .then(data => {
      const { poster, title, runtime, showtime, ticketsSold, capacity } = data;
      const availableTickets = capacity - ticketsSold;

      movieDetailsEl.innerHTML = `
        <img src="${poster}" alt="${title} poster" />
        <h2>${title}</h2>
        <p>Runtime: ${runtime} minutes</p>
        <p>Showtime: ${showtime}</p>
        <p>Available Tickets: ${availableTickets}</p>
        <button data-movie-id="${movieId}" ${availableTickets === 0 ? 'disabled' : ''}>${availableTickets === 0 ? 'Sold Out' : 'Buy Ticket'}</button>
      `;
    })
    .catch(error => console.error(error));
}

function getAllFilms() {
  fetch(`${localHostUrl}/films`)
    .then(response => response.json())
    .then(data => {
      data.forEach(film => {
        const filmEl = document.createElement('li');
        filmEl.classList.add('film', 'item');
        filmEl.textContent = film.title;
        filmEl.dataset.movieId = film.id;
        filmListEl.appendChild(filmEl);
      });
    })
    .catch(error => console.error(error));
}

function buyTicket(movieId) {
  fetch(`${localHostUrl}/films/${movieId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ tickets_sold: tickets_sold + 1 }),
  })
    .then(response => {
      if (response.ok) {
        getMovieDetails(movieId); 
      } else {
        console.error('Failed to buy ticket');
      }
    })
    .catch(error => console.error(error));

}

function deleteFilm(movieId) {
  fetch(`${localHostUrl}/films/${movieId}`, {
    method: 'DELETE',
  })
    .then(response => {
      if (response.ok) {
        const filmEl = document.querySelector(`[data-movie-id="${movieId}"]`);
        filmListEl.removeChild(filmEl);
      } else {
        console.error('Failed to delete film');
      }
    })
    .catch(error => console.error(error));
}
filmListEl.addEventListener('click', (event) => {
  if (event.target.tagName === 'LI') {
    const movieId = event.target.dataset.movieId;
    getMovieDetails(movieId);
  }
});

movieDetailsEl.addEventListener('click', (event) => {
  if (event.target.tagName === 'BUTTON') {
    const movieId = event.target.dataset.movieId;
    buyTicket(movieId);
  }
});

getMovieDetails(1);
getAllFilms();