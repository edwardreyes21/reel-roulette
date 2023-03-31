import React from 'react';
import axios from 'axios';

function App() {
    const findMovie = () => {
        const api_key = process.env.REACT_APP_TMDB_API_KEY;
        
        axios
            .get(`https://api.themoviedb.org/3/discover/movie?api_key=${api_key}&language=en-US`)
            .then((response) => {
                console.log(response);
                const total_pages = response.data.total_pages;
                console.log("Total pages: " + total_pages);

                // Get total pages from JSON object
                // Using total pages, get a random page between [1, total_pages]
                const random_page = Math.floor(Math.random() * total_pages + 1);
                console.log("Random page: " + random_page);

                // Send another request to Discover endpoint, this time with page as filter
                // Grab a random movie from the returned objects
                const movie_details = axios
                                        .get(`https://api.themoviedb.org/3/discover/movie?api_key=${api_key}&language=en-US&page=${random_page}`)
                                        .then((response) => {
                                            console.log(response);
                                        })
                                        .catch((error) => {
                                            console.log(error);
                                        });
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
