import React, {useState, useHook, useEffect} from 'react';
import axios from 'axios';

function App() {
    const [genre, setGenre] = useState([]);
    const [actors, setActors] = useState([]);
    const [maxYear, setMaxYear] = useState(new Date().getFullYear());
    const [minYear, setMinYear] = useState(2023);
    const [selectedMovie, setSelectedMovie] = useState(null);

    const handleMinYearChange = (event) => {
        setMinYear(event.target.value);
    }

    const handleMaxYearChange = (event) => {
        setMaxYear(event.target.value);
    }

    useEffect(() => {
        console.log(selectedMovie);
    }, [selectedMovie]);

    useEffect(() => {
        console.log("minYear: " + minYear);
        console.log("maxYear: " + maxYear);
    }, [minYear, maxYear]);


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
                            setSelectedMovie(response.data.results[0]);
                        })
                        .catch((error) => {
                            console.log(error);
                        })
                }
                else {
                    setSelectedMovie(response.data.results[0]);
                }

            })
            .catch((error) => {
                console.log(error);
            });
    }

    return (
        <div className="App">
            <form>
                <label htmlFor="minYear">Minimum Year:</label>
                <input type="text" id="minYear" value={minYear} onChange={handleMinYearChange}></input>
                <label htmlFor="maxYear">Maximum Year:</label>
                <input type="text" id="maxYear" value={maxYear} onChange={handleMaxYearChange}></input>
            </form>

            <button onClick={findMovie}>Find Me a Movie!</button>

            {selectedMovie && (
                <div>
                    <h1>Title: {selectedMovie.title}</h1>
                    <p>Summary: {selectedMovie.overview}</p>
                </div>
            )}
        </div>
    )
}

export default App;
