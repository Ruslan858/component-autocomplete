import React, { Component } from 'react';
import { fetchData } from '../services';
import './Autocomplete.scss';

class Autocomplete extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filteredSuggestion: [],
      isActive: false,
      inputSearch: '',
      isShowSuggestion: false,
    };
  }

  filteringSuggestions = async str => {
    return fetchData().getData(
      `https://api.themoviedb.org/3/search/movie?api_key=08aaaa1b47117c8f992f62718220f428&language=en-US&query=${str}&page=1&include_adult=false`
    );
  };

  handleChangeInput = async event => {
    event.persist();
    const {
      target: { value },
    } = event;
    await this.setState({ inputSearch: value });
    await this.filteringSuggestions(value.toLowerCase()).then(movies => {
      this.setState({ filteredSuggestion: movies.results });
    });
  };

  setValueSuggestion(e, name) {
    this.setState({ inputSearch: name, isShowSuggestion: false });
  }

  onShowSuggestion = (isShow = false) => {
    const { inputSearch } = this.state;
    this.filteringSuggestions(inputSearch).then(({ results }) => {
      this.setState((state, props) => {
        return {
          ...state,
          isShowSuggestion: isShow,
          filteredSuggestion: results,
          isActive: true,
        };
      });
    });
  };

  onActive = active => {
    this.setState((prevState, props) => {
      return {
        ...prevState,
        isActive: active,
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
              filteredSuggestion.map(sugg => {
                return (
                  <div
                    key={sugg.id}
                    className="autocomplete-list__item"
                    onClick={e =>
                      this.setValueSuggestion(e, sugg.original_title)
                    }
                  >
                    {sugg.original_title}
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
