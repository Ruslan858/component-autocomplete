import React from 'react';
import { fetchData } from '../services';
import './Autocomplete.scss';

class Autocomplete extends React.Component {
  state = {
    filteredSuggestion: [],
    isActive: false,
    inputSearch: '',
    isShowSuggestion: false,
    timeout_ID: null,
  };

  filteringSuggestions = async str => {
    return fetchData()
      .getData(
        `&query=${str}&page=1&include_adult=false`,
      );
  };

  debounceSuggestion = async (fn, delay, arg) => {
    if (this.state.timeout_ID) {
      clearTimeout(this.state.timeout_ID);
    }

    const timeout = setTimeout(async () => {
      const movies = await fn(arg);
      this.setState({ filteredSuggestion: movies.results });
    }, delay);

    await this.setState({ timeout_ID: timeout });
  };


  handleChangeInput = async event => {
    event.persist();
    const { debounceSuggestion, filteringSuggestions } = this;
    const { target: { value } } = event;

    this.setState({ inputSearch: value.toLowerCase() });
    await debounceSuggestion(filteringSuggestions, 300, value.toLowerCase());
  };

  setValueSuggestion(e, name) {
    this.setState({ inputSearch: name, isShowSuggestion: false });
  }

  onShowSuggestion = async (isShow = false) => {
    const { inputSearch } = this.state;

    const movies = await this.filteringSuggestions(inputSearch.toLowerCase());
    this.setState((state, props) => {
      return {
        ...state,
        isShowSuggestion: isShow,
        filteredSuggestion: movies.results,
        isActive: true,
      };
    });
  };

  onActive = isActive => {
    this.setState((prevState, props) => {
      return {
        ...prevState,
        isActive,
        isShowSuggestion: !!prevState.inputSearch.length,
      };
    });
  };

  clearInput = () => {
    this.setState({
      isActive: false,
      inputSearch: '',
      isShowSuggestion: false,
    });
  };

  render() {
    const {
      inputSearch,
      isShowSuggestion,
      filteredSuggestion,
      isActive,
    } = this.state;
    return (
      <div className="autocomplete">
        <h2 className="autocomplete-title">Search movies</h2>
        <div className="autocomplete-block-input">
          <input
            className={`autocomplete-input ${
              isActive ? 'autocomplete-active' : ''
            }`}
            onChange={this.handleChangeInput}
            onBlur={() => this.onActive(false)}
            onFocus={() => {
              this.onShowSuggestion(true);
            }}
            placeholder="enter movie"
            type="text"
            value={inputSearch}
          />
          {inputSearch.length ? (
            <span
              className="autocomplete-input_clear"
              onClick={this.clearInput}
            >
              &#10799;
            </span>
          ) : (
            ''
          )}
        </div>
        {isShowSuggestion && (
          <div className="autocomplete-list">
            {filteredSuggestion && filteredSuggestion.length ? (
              filteredSuggestion.map(suggestion => {
                return (
                  <div
                    key={suggestion.id}
                    className="autocomplete-list__item"
                    onClick={e =>
                      this.setValueSuggestion(e, suggestion.original_title)
                    }
                  >
                    {suggestion.original_title}
                  </div>
                );
              })
            ) : (
              <div className="autocomplete-list__item">no results</div>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default Autocomplete;
