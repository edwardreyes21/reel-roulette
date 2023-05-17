import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Watchlist() {
    const [watchlist, setWatchlist] = useState(null);

    useEffect(() => {
        axios
            .get('/api/watchlist')
            .then((response) => {
                console.log(response);
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
                        <div key={movie._id}>{movie.title}</div>
                      ))
                    }
                </div>
            )}
        </div>
    );
}

export default Watchlist;