import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Watchlist.css'

function Watchlist() {
    const [watchlist, setWatchlist] = useState(null);

    const handleRemoveMovie = (movieToRemove) => {
        setWatchlist(watchlist.filter((movie) => movie !== movieToRemove));

        axios
            .post('/watchlist/delete-movie', { movieId: movieToRemove._id })
            .catch((error) => {
                console.log(error);
            })
    }

    useEffect(() => {
        axios
            .get('/api/watchlist')
            .then((response) => {
                console.log(response.data.watchlist);
                setWatchlist(response.data.watchlist);
            })
            .catch((error) => {
                console.error(error);
            })
    }, []);

    return ( 
        <div className="watchlist-component">
            <h1>Watchlist</h1>
            <Link to="..">Return to Home Page</Link>
            {watchlist && (
                <div className="watchlist">
                    {
                      watchlist.map((movie) => (
                        <div key={movie._id} className="watchlist-movie">
                            <h1 id="watchlist-movie-title">{movie.title}</h1> <button onClick={() => handleRemoveMovie(movie)}>Remove Movie</button>
                            <p id="watchlist-movie-summary">Overview: {movie.overview}</p>
                            <p>Release date: {movie.release_date}</p>
                            <img id="watchlist-movie-poster" src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} />
                        </div>
                      ))
                    }
                </div>
            )}
        </div>
    );
}

export default Watchlist;