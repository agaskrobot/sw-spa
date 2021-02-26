import { useState, useEffect } from 'react';

import { getMoviesList, getCharactersList } from '../../api';
import { Alert, Spinner } from '../../components';

export function Home() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [movies, setMovies] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState('');
  const [selectedEpisodes, setSelectedEpisodes] = useState([]);

  const getMovies = () => {
    getMoviesList()
      .then((response) => {
        let movies = response.data.results;
        movies.sort((a, b) => a['episode_id'] - b['episode_id']);
        setMovies(movies);
      })
      .catch((error) => setError(error.message));
  };

  let characterList = [];
  const getCharacters = (page) => {
    getCharactersList(page)
      .then((response) => {
        if (response.data.next) {
          let page = response.data.next.charAt(response.data.next.length - 1);
          getCharacters(page);
        }
        characterList = [...characterList, ...response.data.results];
      })
      .catch((error) => setError(error.message))
      .finally(() => {
        setCharacters(characterList);
        const timer = setTimeout(() => {
          setLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
      });
  };

  // Set selected character and episodes in which it appear
  const handleCharacterClick = (e, url) => {
    e.preventDefault();
    setSelectedCharacter(url);
    let selectedEpisodes = movies.filter((movie) => movie.characters.find((character) => character === url));
    let selectedEpisodesId = [];
    selectedEpisodes.forEach((episode) => selectedEpisodesId.push(episode['episode_id']));
    setSelectedEpisodes(selectedEpisodesId);
  };

  // When OnBlur  clean selected items
  const handleOnBlur = (e) => {
    e.preventDefault();
    setSelectedCharacter('');
    setSelectedEpisodes([]);
  };

  // useEffect loads all movies and characters.
  useEffect(() => {
    setLoading(true);
    getMovies();
    getCharacters(1);
  }, []);

  let selectedClass = 'text-yellow-300 text-xxl';

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <div className="flex flex-wrap md:px-20 flex-row text-xl justify-center text-sm font-light min-w-min w-screen">
          <Alert error={error} onClose={() => setError(null)} />
          <div>
            {movies.map((movie) => (
              <div key={movie['episode_id']} className="flex justify-start mt-6">
                <div
                  className={`${
                    selectedEpisodes.includes(movie['episode_id']) ? selectedClass : ''
                  } text-xxl px-4 mr-5 font-semibold`}
                >
                  Episode {movie['episode_id']}
                </div>
                <div className="flex-col">
                  {movie.characters.map((character, index) => {
                    let person = characters.find((char) => char.url === character);
                    person = person ? person : '';
                    return (
                      <button
                        className={`flex ${selectedCharacter === person.url ? selectedClass : ''} focus:outline-none`}
                        onClick={(e) => handleCharacterClick(e, person.url)}
                        key={index}
                        onBlur={handleOnBlur}
                      >
                        {person ? person.name : ''}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
