import { useState, useEffect } from 'react';

import { getMoviesList, getCharactersList } from '../../api';
import { Alert, Spinner, EpisodeButton, CharacterButton, SearchBar } from '../../components';

export function Home() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [movies, setMovies] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState('');
  const [characterEpisodes, setCharacterEpisodes] = useState([]);
  const [visibleEpisodes, setVisibleEpisodes] = useState([]);
  const [activeEpisode, setActiveEpisode] = useState('');
  const [translate, setTranslate] = useState(10);
  const [opacity, setOpacity] = useState(0);

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
          // Data is divided by pages so call all pages to get all characters
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
  const handleCharacterClick = (url) => {
    setSelectedCharacter(url);
    let characterEpisodes = movies.filter((movie) => movie.characters.find((character) => character === url));
    let selectedEpisodesId = [];
    characterEpisodes.forEach((episode) => selectedEpisodesId.push(episode['episode_id']));
    setCharacterEpisodes(selectedEpisodesId);
  };

  // Run animation for selected episode
  const handleEpisodeClick = (episode) => {
    setActiveEpisode(!visibleEpisodes.includes(episode) ? episode : '');
    let newSelectedEpisodes = [...visibleEpisodes, episode];
    setVisibleEpisodes(newSelectedEpisodes);
  };

  // When OnBlur  clean selected items
  const handleOnBlur = () => {
    setSelectedCharacter('');
    setCharacterEpisodes([]);
  };

  // useEffect loads all movies and characters.
  useEffect(() => {
    setLoading(true);
    getMovies();
    getCharacters(1);
  }, []);

  // Execute animation
  useEffect(() => {
    if (activeEpisode) {
      let indexTranslate = 10;
      let indexOpacity = 0;
      const timer = setInterval(() => {
        indexTranslate = indexTranslate - 1;
        indexOpacity = indexOpacity + 25;
        setTranslate(indexTranslate);
        setOpacity(indexOpacity);
      }, 30);
      setTimeout(() => {
        clearInterval(timer);
      }, 300);
    }
  }, [activeEpisode]);

  let sectionActiveClass = `transform translate-y-${translate} transition-opacity opacity-${opacity}`;
  let sectionVisibleClass = 'transform translate-y-0 transition-opacity opacity-100';

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <div className="flex flex-wrap md:px-10 flex-row text-xl justify-center text-sm font-light min-w-min w-screen">
          <Alert error={error} onClose={() => setError(null)} />
          <div>
            <SearchBar onError={setError} />
            {movies.map((movie) => (
              <div key={movie['episode_id']} className="flex justify-start mt-6">
                <EpisodeButton
                  id={movie['episode_id']}
                  onClick={() => handleEpisodeClick(movie['episode_id'])}
                  active={characterEpisodes.includes(movie['episode_id'])}
                />
                {visibleEpisodes.includes(movie['episode_id']) ? (
                  <div
                    className={`flex-col ${
                      activeEpisode === movie['episode_id'] ? sectionActiveClass : sectionVisibleClass
                    }`}
                  >
                    {movie.characters.map((character, index) => {
                      let person = characters.find((char) => char.url === character);
                      person = person ? person : '';
                      return (
                        <CharacterButton
                          active={selectedCharacter === person.url}
                          name={person ? person.name : ''}
                          onClick={() => handleCharacterClick(person.url)}
                          key={index}
                          onBlur={handleOnBlur}
                        />
                      );
                    })}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
