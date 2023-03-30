import React from 'react';
import axios from 'axios';

function App() {
    const findMovie = () => {
        const api_key = process.env.REACT_APP_TMDB_API_KEY;
        
        const movie_details = axios
            .get(`https://api.themoviedb.org/3/discover/movie?api_key=${api_key}&language=en-US`)
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    return (
        <div className="App">
            <button onClick={findMovie}>Find Me a Movie!</button>
        </div>
    )
}

export default App;
