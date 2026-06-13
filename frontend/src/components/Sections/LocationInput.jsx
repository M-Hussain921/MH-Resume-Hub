import { useState, useEffect, useRef } from 'react';
import { useDebounce } from '../../hooks/useDebounce';
import { searchLocations } from '../../services/Location.service';
import '../../styles/LocationInput.css';
import { FaLocationPin } from 'react-icons/fa6';

export default function LocationInput({ value, onChange, placeholder }) {

  const [query, setQuery]             = useState(value || '');
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen]           = useState(false);
  const [loading, setLoading]         = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const containerRef = useRef(null);
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    if (debouncedQuery.trim().length < 3) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    const fetchSuggestions = async () => {
      setLoading(true);
      try {
        const results = await searchLocations(debouncedQuery);
        setSuggestions(results);
        setIsOpen(results.length > 0); 
        setActiveIndex(-1);            
      } catch (error) {
        console.error('Location search failed:', error);
        setSuggestions([]);
        setIsOpen(false);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [debouncedQuery]); 

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false); 
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []); 

  const handleSelect = (location) => {
    setQuery(location.display);       
    onChange(location.display);       
    setIsOpen(false);                
    setSuggestions([]);               
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);  
    onChange(val);  
  };

  const handleKeyDown = (e) => {
    if (!isOpen || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault(); 
        setActiveIndex(prev =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;

      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex(prev => prev > 0 ? prev - 1 : 0);
        break;

      case 'Enter':
        e.preventDefault();
        if (activeIndex >= 0) {
          handleSelect(suggestions[activeIndex]);
        }
        break;

      case 'Escape':
        setIsOpen(false);
        setActiveIndex(-1);
        break;
    }
  };

  return (
    <div className="location-wrapper" ref={containerRef}>

      <div className="location-input-box">
        <input
          type="text"
          className="form-input"
          placeholder={placeholder || 'City, State, Country'}
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0) setIsOpen(true);
          }}
          autoComplete="off"
          spellCheck={false}
        />

        {loading && (
          <span className="location-loading"></span>
        )}
      </div>

      {isOpen && suggestions.length > 0 && (
        <ul className="location-dropdown" role="listbox">
          {suggestions.map((loc, index) => {

            const [firstPart, ...rest] = loc.display.split(', ');

            return (
              <li
                key={`${loc.display}-${index}`}
                className={`location-option ${index === activeIndex ? 'location-option--active' : ''}`}
                onMouseDown={() => handleSelect(loc)}
                onMouseEnter={() => setActiveIndex(index)}
                role="option"
              >
                <span className="location-pin"><FaLocationPin/></span>
                <div className="location-text">
                  
                  <span className="location-city">{firstPart}</span>
               
                  {rest.length > 0 && (
                    <span className="location-region">{rest.join(', ')}</span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}