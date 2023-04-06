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

    const handleGenreChange = (event) => {
        const options = event.target.options;
        const selectedValues = [];

        for (let i = 0; i < options.length; i++) {
            if (options[i].selected) {
                selectedValues.push(options[i].value);
            }
        }

        setGenre(prevGenre => [...prevGenre, ...selectedValues]);
    }

    const handleRemoveGenre = (genreToRemove) => {
        setGenre(genre.filter((genre) => genre !== genreToRemove));
    }

    useEffect(() => {
        console.log(selectedMovie);
    }, [selectedMovie]);

    useEffect(() => {
        console.log("Genres: " + genre);
        console.log("minYear: " + minYear);
        console.log("maxYear: " + maxYear);
    }, [genre, minYear, maxYear]);


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
                <label htmlFor="genre-select">Select genres:</label>
                <select id="genre-select" multiple={true} size={5} onChange={handleGenreChange}>
                    <option value="28">Action</option>
                    <option value="12">Adventure</option>
                    <option value="16">Animation</option>
                    <option value="35">Comedy</option>
                    <option value="80">Crime</option>
                    <option value="99">Documentary</option>
                    <option value="18">Drama</option>
                    <option value="10751">Family</option>
                    <option value="14">Fantasy</option>
                    <option value="36">History</option>
                    <option value="27">Horror</option>
                    <option value="10402">Music</option>
                    <option value="9648">Mystery</option>
                    <option value="10749">Romance</option>
                    <option value="878">Science Fiction</option>
                    <option value="10770">TV Movie</option>
                    <option value="53">Thriller</option>
                    <option value="10752">War</option>
                    <option value="37">Western</option>
                </select>
                <ul>
                    {genre.map((genre) => (
                        <li key={genre}> {genre} <button onClick={() => handleRemoveGenre(genre)}>Remove</button></li>
                    ))}
                </ul>
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
