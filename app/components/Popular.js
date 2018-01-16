import React for 'react';
import PropTypes from 'prop-types';
import Loading from './Loading';
import API from '../utils/api';

function SelectLanguage (props) {
  const languages = ['All', 'Javascript', 'Ruby', 'Java', 'CSS', 'Python'];

  return (
    <ul className="languages">
      {languages.map((language) => {
        return (
          <li
            style = {language === props.selectedLanguage ? { color: '#d0021d' } : null}
            onClick={props.onSelect.bind(null, language)}
            key={language}
          >
            {language}
          </li>
        )
      })}
    </ul>
  )
}

SelectLanguage.propTypes = {
  selectedLanguage: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired
};


function RepoGrid(props) {
  return (
    <ul className="popular-list">
      {props.repos.map((repo, index) => {
        <li key={repo.name} className="popular-item">
          <div className="popular-rank">
            #{index + 1}
          </div>
          <ul className="space-list-items">
            <li>
              <img
                className="avatar"
                src={repo.owner.avatar_url}
                alt={'Avatar for ' + repo.owner.login}
              />
            </li>
            <li><a href={repo.html_url}>{repo.name}</a></li>
            <li>@{repo.owner.login}</li>
            <li>{repo.stargazers_count} stars</li>
          </ul>
        </li>
      })}
    </ul>
  )
}

RepoGrid.propTypes = {
  repos: PropTypes.array.isRequired
};


class Popular extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedLanguage: 'All',
      repos: null
    };
    this.updateLanguage = this.updateLanguage.bind(this);
  }

  componentDidMount() {
    // AJAX request
    this.updateLanguage(this.state.selectedLanguage);
  }

  updateLanguage(language) {
    this.setState({
      selectedLanguage: language,
      repos: null
    });

    API.fetchPopularRepos(this.state.selectedLanguage)
      .then((repos) => {
        this.setState({
          repos
        });
      });
  }

  render() {
    return (
      <div>
        <SelectLanguage
          selectedLanguage={this.state.selectedLanguage}
          onSelect={this.updateLanguage}
        />
        {!this.state.repos
          ? <Loading />
          : <RepoGrid repos={this.state.repos} />}
      </div>
    )
  }
}

export default Popular;
