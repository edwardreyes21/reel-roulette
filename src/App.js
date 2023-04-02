import React, {useState, useHook} from 'react';
import axios from 'axios';

function App() {
    const [genre, setGenre] = useState([]);
    const [actors, setActors] = useState([]);
    const [maxYear, setMaxYear] = useState(new Date().getFullYear());
    const [minYear, setMinYear] = useState(2023);

    const findMovie = () => {
        const api_key = process.env.REACT_APP_TMDB_API_KEY;
        const default_total_pages = 500; // By design, TMDB API can only retrieve up to the 500th page

        const random_page = Math.floor(Math.random() * default_total_pages + 1);
        console.log("Random page: " + random_page);

        let selected_movie = null;

        axios
            .get(`https://api.themoviedb.org/3/discover/movie?api_key=${api_key}&language=en-US&page=${random_page}
                    &primary_release_date.gte=${minYear}-01-01&primary_release_date.lte=${maxYear}-12-31`)
            .then((response) => {
                console.log(response);

                const actual_total_pages = response.data.total_pages;

                if (actual_total_pages < default_total_pages) {
                    const new_total_pages = Math.floor(Math.random() * actual_total_pages + 1);

                    axios
                        .get(`https://api.themoviedb.org/3/discover/movie?api_key=${api_key}&language=en-US&page=${new_total_pages}
                        &primary_release_date.gte=${minYear}-01-01&primary_release_date.lte=${maxYear}-12-31`)
                        .then((response) => {
                            selected_movie = response.data.results[0];
                            console.log(selected_movie);
                        })
                        .catch((error) => {
                            console.log(error);
                        })
                }
                else {
                    selected_movie = response.data.results[0];
                    console.log(selected_movie);
                }

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
