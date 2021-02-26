import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { getSearchResults } from '../api';
import { ReactComponent as SpinnerIcon } from '../assets/icons/spinner.svg';

export function SearchBar({ onError }) {
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const getResult = () => {
    getSearchResults(value)
      .then((response) => {
        setResults(response.data.results);
      })
      .catch((error) => onError(error.message))
      .finally(() => setLoading(false));
  };

  // Wait 2 sec before calling api
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      getResult();
    }, 2000);
    return () => clearTimeout(timer);
  }, [value]);

  let resultsComponent;
  if (value !== '' && loading) {
    resultsComponent = (
      <div className="flex rounded w-full h-40 bg-white items-center justify-center">
        <SpinnerIcon className="animate-spin m-3 h-16 w-16 text-yellow-400" />
      </div>
    );
  } else if (value !== '' && results.length) {
    resultsComponent = (
      <div className="flex-col text-base font-light rounded w-full h-auto p-5 bg-white text-gray-800 items-center justify-center">
        {results.map((result) => (
          <div key={result.name}>{result.name}</div>
        ))}
      </div>
    );
  } else if (value !== '' && !results.length) {
    resultsComponent = (
      <div className="flex text-base font-light rounded w-full h-40 bg-white items-center text-gray-800 justify-center">
        No results found
      </div>
    );
  }

  return (
    <div className="w-full text-base font-light">
      <input
        className="w-full rounded focus:outline-none h-10 mt-10 p-2 text-gray-800"
        id="searchBar"
        type="text"
        placeholder="Type to search..."
        onChange={(e) => setValue(e.target.value)}
        value={value}
      />
      {resultsComponent}
    </div>
  );
}
SearchBar.propTypes = {
  onError: PropTypes.func
};
