import React from 'react';
import axios from 'axios';

function App() {
    const findMovie = () => {
        const api_key = process.env.REACT_APP_TMDB_API_KEY;
        const total_pages = 500;

        const random_page = Math.floor(Math.random() * total_pages + 1);
        console.log("Random page: " + random_page);
        
        axios
            .get(`https://api.themoviedb.org/3/discover/movie?api_key=${api_key}&language=en-US&page=${random_page}`)
            .then((response) => {
                console.log(response);

                const selected_movie = response.data.results[0];
                console.log("Selected movie: " + JSON.stringify(selected_movie, null, 2));
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
