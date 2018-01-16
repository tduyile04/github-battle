import axios from 'axios';

// NOTE: Incase of rate limit by the github API
// const ID = "YOUR_CLIENT_ID";
// const SECRET = "YOUR_SECRET_ID";
// const params = "?client_id=" + ID + "&client_secret=" + SECRET;

export default class API {
  /**
   * [getProfile description]
   * @param  {[string]} username [the username of the github acc owner]
   * @return {[type]}          [description]
   */
  static getProfile(username) {
    return axios.get('https://api.github.com/users/' + username + params)
      .then((user) => {
        return user.data;
      });
  }
  /**
   * [getRepos description]
   * @param  {[string]} username [the username of the github acc owner]
   * @return {[type]}          [description]
   */
  static getRepos(username) {
    return axios.get('https://api.github.com/users/' + username + '/repos'
    + params + '&per_page=100')
  }

  /**
   * [getStarCount description]
   * @param  {[type]} repos [description]
   * @return {[type]}       [description]
   */
  static getStarCount(repos) {
    return repos.data.reduce((count, repo) => {
      return count + repo.stargazers_count;
    }, 0);
  }

  /**
   * [calculateScore description]
   * @param  {[type]} profile [description]
   * @param  {[type]} repos   [description]
   * @return {[type]}         [description]
   */
  static calculateScore(profile, repos) {
    const followers = profile.followers;
    const totalStars = API.getStarCount(repos);

    return (followers * 3) + totalStars;
  }

  /**
   * [handleError description]
   * @param  {[type]} error [description]
   * @return {[type]}       [description]
   */
  static handleError(error) {
    console.warn(error);
    return null;
  }
  /**
   * [getUserData description]
   * @param  {[type]} player [description]
   * @return {[type]}        [description]
   */
  static getUserData(player) {
    return axios.all([
      API.getProfile(player),
      API.getRepos(player)
    ]).then((data) => {
      const profile = data[0];
      const repos = data[1];

      return {
        profile,
        score: API.calculateScore(profile, repos)
      }
    })
  }

  /**
   * [sortPlayers description]
   * @param  {[type]} players [description]
   * @return {[type]}         [description]
   */
  static sortPlayers(players) {
    return players.sort((a, b) => {
      return b.score - a.score
    });
  }

  /**
   * [battle description]
   * @param  {[type]} players [description]
   * @return {[type]}         [description]
   */
  static battle(players) {
    return axios.all(players.map(API.getUserData))
      .then(API.sortPlayers)
      .catch(API.handleError)
  }

  /**
   * [fetchPopularRepos description]
   * @param  {[type]} language [description]
   * @return {[type]}          [description]
   */
  static fetchPopularRepos(language) {
    const encodedURI = window.encodeURI(`https://api.github.com/search/repositories?q=stars:>1+language:
      ${language}&sort=stars&order=desc&type=Repositories`);

      return axios.get(encodedURI)
        .then((response) => {
          return response.data.items;
        });
  }
}
