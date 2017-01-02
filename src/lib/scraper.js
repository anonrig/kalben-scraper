const debug = require('debug')('kalben:scraper');
const request = require('request-promise');
const cheerio = require('cheerio');
const Promise = require('bluebird');


class Scraper {
  constructor() {
    this.url = 'http://www.kalbenben.net';
  }


  /**
   * Get biography of Kalben.
   * @return {Array} Returns an array of sentences from Kalben's biography.
   */
  getBiography() {
    const url = `${this.url}/biyografi`;
    let biography = [];

    return request(url)
      .then((response) => {
        let $ = cheerio.load(response);
        let text = $('#about-slider .content > p');

        text.each(function(index, element) {
          biography.push($(this).text())
        });

        return Promise.resolve(biography.filter((item) => item.length > 0));
      });
  }


  /**
   * Get upcoming Kalben concerts.
   * @return {Array} Returns an array of kalben concerts.
   */
  getConcerts() {
    const url = this.url;
    let concerts = [];

    return request(url)
      .then((response) => {
        let $ = cheerio.load(response);
        let events = $('.features').find('.feature-wrap');

        events.each(function(index, element) {
          concerts.push({
            title: $(this).find('h2').text(),
            location: $(this).find('h3').text()
          })
        });

        return Promise.resolve(concerts);
      });
  }


  /**
   * Get latest Kalben's news.
   * @return {Array} Returns an array of object full of news about Kalben.
   */
  getNews() {
    const url = this.url;
    let news = [];

    return request(`${url}/haberler`)
      .then((response) => {
        let $ = cheerio.load(response);
        let liElements = $('.basindahaberleri').find('li');

        liElements.map(function(index, element) {
          news.push({
            title: $(this).children('h2').text(),
            image: url + $(this).children('img').attr('src'),
            summary: $(this).children('p').text(),
            link: $(this).children('a').attr('href')
          });
        });

        return Promise.resolve(news);
      });
  }


  /**
   * Get image links.
   * @return {Array} Returns an array full of Kalben images.
   */
  getImages() {
    const url = this.url;
    let images = [];

    return request(`${url}/galeri`)
      .then((response) => {
        let $ = cheerio.load(response);
        let image = $('.col-md-offset-2.col-md-8').find('a');

        image.each(function(index, element) {
          images.push(url + $(this).attr('href'))
        });

        return Promise.resolve(images);
      })
  }


  /**
   * Get video links.
   * @return {Array} Returns an array full of YouTube links.
   */
  getVideos() {
    const url = `${this.url}/videolar`;
    let videos = [];

    return request(url)
      .then((response) => {
        let $ = cheerio.load(response);
        let video = $('iframe');

        video.each(function(index, element) {
          videos.push($(this).attr('src'));
        });

        return Promise.resolve(videos);
      });
  }
}


module.exports = Scraper;