import React, {useState, useHook} from 'react';
import axios from 'axios';

function App() {
    const [genre, setGenre] = useState([]);
    const [maxYear, setMaxYear] = useState(new Date().getFullYear());
    const [minYear, setMinYear] = useState(2023);

    const findMovie = async () => {
        const api_key = process.env.REACT_APP_TMDB_API_KEY;
        const default_total_pages = 500; // By design, TMDB API can only retrieve up to the 500th page

        const findRandomMovie = async (minYear, maxYear, page) => {
            return axios
            .get(`https://api.themoviedb.org/3/discover/movie?api_key=${api_key}&language=en-US&page=${page}
                    &primary_release_date.gte=${minYear}-01-01&primary_release_date.lte=${maxYear}-12-31`)
            .then(async (response) => {
                console.log(response);

                const actual_total_pages = response.data.total_pages;

                if (actual_total_pages < default_total_pages) {
                    const new_page = Math.floor(Math.random() * actual_total_pages + 1);
                    console.log("Actual pages is lower than total pages");
                    return await findRandomMovie(minYear, maxYear, new_page);
                }
                else {
                    const selected_movie = response.data.results[0];
                    console.log("Default pages is correct, returning movie");
                    return selected_movie;
                }
            })
            .catch((error) => {
                console.log(error);
            });
        }

        const random_page = Math.floor(Math.random() * default_total_pages + 1);
        console.log("Random page: " + random_page);

        const selected_movie = await findRandomMovie(minYear, maxYear, random_page);

        if (selected_movie) {
            console.log("Selected movie: " + JSON.stringify(selected_movie, null, 2));
        } else {
            console.log("No movie with that filter is fetched");
        } 
    }

    return (
        <div className="App">
            <button onClick={findMovie}>Find Me a Movie!</button>
        </div>
    )
}

export default App;
