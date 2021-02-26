import axios from 'axios/index';

// Get all episodes
export const getMoviesList = () => axios.get('https://swapi.dev/api/films/');

// Get all characters
export const getCharactersList = (page) => axios.get(`http://swapi.dev/api/people/?page=${page}`);

// search by value
export const getSearchResults = (value) => axios.get(`https://swapi.dev/api/people/?search=${value}`);
