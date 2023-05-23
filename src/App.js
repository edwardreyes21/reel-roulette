import React, {useState, useHook, useEffect} from 'react';
import { Link } from 'react-router-dom';
import './App.css'
import axios from 'axios';
import LoginButton from './LoginButton';

function App() {
    const [genre, setGenre] = useState([]);
    const [actors, setActors] = useState([]);
    const [maxYear, setMaxYear] = useState(new Date().getFullYear());
    const [minYear, setMinYear] = useState(1940);
    const [selectedMovie, setSelectedMovie] = useState(null);

    const genreMap = {
        "28": "Action",
        "12": "Adventure",
        "16": "Animation",
        "35": "Comedy",
        "80": "Crime",
        "99": "Documentary",
        "18": "Drama",
        "10751": "Family",
        "14": "Fantasy",
        "36": "History",
        "27": "Horror",
        "10402": "Music",
        "9648": "Mystery",
        "10749": "Romance",
        "878": "Science Fiction",
        "10770": "TV Movie",
        "53": "Thriller",
        "10752": "War",
        "37": "Western"
    }

    const handleMinYearChange = (event) => {
        setMinYear(event.target.value);
    }

    const handleMaxYearChange = (event) => {
        setMaxYear(event.target.value);
    }

    const handleActorChange = (actor, event) => {
        const api_key = process.env.REACT_APP_TMDB_API_KEY;
        event.preventDefault();
        console.log("Retrieved " + actor);

        axios
            .get(`https://api.themoviedb.org/3/search/person?api_key=${api_key}&query=${encodeURIComponent(actor)}`)
            .then((response) => {
                console.log(response);
                const actor = response.data.results[0];

                if (!actors.some((a) => a.id === actor.id)) {
                    setActors(actors => [...actors, actor]);
                }
            })
            .catch((error) => {
                console.log(error);
            })
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

    const handleRemoveActor = (actorToRemove) => {
        setActors(actors.filter((actor) => actor !== actorToRemove));
    }

    const handleRemoveGenre = (genreToRemove) => {
        setGenre(genre.filter((genre) => genre !== genreToRemove));
    }

    const handleAddToWatchList = () => {
        const movie = { 
            title: selectedMovie.title,
            poster_path: selectedMovie.poster_path,
            overview: selectedMovie.overview,
            release_date: selectedMovie.release_date
        };
        
        console.log(`Adding ${movie.title} to watch list`);
        axios.post('/watchlist/new-movie', { movie })
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                console.error(error);
            })
    }

    useEffect(() => {
        console.log(selectedMovie);
    }, [selectedMovie]);

    useEffect(() => {
        console.log("Genres: " + genre);
        console.log("minYear: " + minYear);
        console.log("maxYear: " + maxYear);
        console.log(actors);
    }, [actors, genre, minYear, maxYear]);

    const findMovie = () => {
        const api_key = process.env.REACT_APP_TMDB_API_KEY;
        const default_total_pages = 500; // By design, TMDB API can only retrieve up to the 500th page

        const random_page = Math.floor(Math.random() * default_total_pages + 1);
        console.log("Random page: " + random_page);

        const genreClone = [...genre];
        const actorNames = actors.map((actor) => actor.id);

        axios
            .get(`https://api.themoviedb.org/3/discover/movie?api_key=${api_key}&language=en-US&page=${random_page}&primary_release_date.gte=${minYear}-01-01&primary_release_date.lte=${maxYear}-12-31&with_genres=${genreClone.join(',')}&with_cast=${actorNames.join(',')}`)
            .then((response) => {
                console.log("First GET", response);

                const actual_total_pages = response.data.total_pages;

                console.log("Actual total pages: " + actual_total_pages);

                if (actual_total_pages < default_total_pages) {
                    const new_total_pages = Math.floor(Math.random() * actual_total_pages + 1);

                    axios
                        .get(`https://api.themoviedb.org/3/discover/movie?api_key=${api_key}&language=en-US&page=${new_total_pages}
                            &primary_release_date.gte=${minYear}-01-01&primary_release_date.lte=${maxYear}-12-31&with_genres=${genreClone.join(',')}&with_cast=${actorNames.join(',')}`)
                        .then((response) => {
                            console.log("New GET", response);
                            const randomIndex = Math.floor(Math.random() * response.data.results.length);
                            setSelectedMovie(response.data.results[randomIndex]);
                        })
                        .catch((error) => {
                            console.log(error);
                        })
                }
                else {
                    const randomIndex = Math.floor(Math.random() * response.data.results.length);
                    setSelectedMovie(response.data.results[randomIndex]);
                }

            })
            .catch((error) => {
                console.log(error);
            });
    }

    return (
        <div className="App">
            <LoginButton />
            <div className="movie-form">
                <form>
                    <div className="genre-select-div">
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
                                <li key={genre} className="genre-item">
                                    <span>{genreMap[genre]}</span>
                                    <button onClick={() => handleRemoveGenre(genre)}>Remove</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="actor-div">
                        <div className="actor-select-bar">
                            <input type="text" id="actorName" placeholder="Enter the name of an actor"/>
                            <button onClick={(event) => handleActorChange(document.getElementById('actorName').value, event)}>Add actor</button>
                        </div>
                        <ul>
                            {actors.map((actor) => (
                                <li key={actor}> {actor.name} <button onClick={() => handleRemoveActor(actor)}>Remove</button></li>
                            ))}
                        </ul>
                    </div>
                    <div className="year-selection-box">
                        <label htmlFor="minYear">Minimum Year:</label>
                        <input type="text" id="minYear" value={minYear} className="year-input-field" onChange={handleMinYearChange}/>
                        <label htmlFor="maxYear">Maximum Year:</label>
                        <input type="text" id="maxYear" value={maxYear} className="year-input-field" onChange={handleMaxYearChange}/>
                    </div>
                </form>
            </div>

            <button id="find-button" onClick={findMovie}>Find Me a Movie!</button>

            {selectedMovie && (
                <div className="selected-movie">
                    <button onClick={() => handleAddToWatchList()}>Add to Watch List</button>
                    <h1>Title: {selectedMovie.title}</h1>
                    <img id="poster" src={`https://image.tmdb.org/t/p/w500/${selectedMovie.poster_path}`}></img>
                    <p>Summary: {selectedMovie.overview}</p>
                    <p>Release date: {selectedMovie.release_date}</p>
                    <p>Genres: {selectedMovie.genre_ids.map(id => (genreMap[id])).join(', ')}</p>
                </div>
            )}
        </div>
    )
}

export default App;
