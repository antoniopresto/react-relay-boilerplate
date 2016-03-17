import beagle from 'beagle';
import parseOg from './og-parse';
import Datastore from 'nedb';
import path from 'path';
import config from '../config';
import {flattenDeep} from 'lodash';

const PATH = path.resolve('./scrape_cache.json');
const db = new Datastore({filename: PATH, autoload: true, timestampData: true});
const MAX_AGE = (config.scrapeCacheMaxHours || 1) * 60 * 60 * 1000; // 1h

function parseHTML(html, res) {
  const og = parseOg(html);
  const resImage = (res.images || [])[0];
  return {
    title: og.title || res.title,
    image: og.image, // || (resImage && {url: resImage}),
    description: og.description || res.preview
  };
}

function findCache(cacheID) {
  const query = {
    cacheID,
    updatedAt: {$gte: new Date(Date.now() - MAX_AGE)}
  };

  return new Promise((resolve, reject) => {
    db.findOne(query, function(err, doc) {
      if (err) console.log({err, doc, query});
      if (err) return reject(err);
      resolve(doc);
    });
  });
}

function scrapeAndSaveCache(url, cacheID) {
  return new Promise((resolve, reject) => {
    beagle.scrape(url, (err, res) => {
      if (err) return reject(err);
      const data = parseHTML(res.body, res);
      db.update({cacheID}, {cacheID, data}, {
        multi: true,
        upsert: true,
        returnUpdatedDocs: true
      }, (err, numAffected, affectedDocuments) => {
        if (err) reject(err);
        resolve(affectedDocuments);
      });
    });
  });
}

export function clearCache(ids) {
  const queryByIds = {
    cacheID: {$in: flattenDeep([ids])}
  };
  const query = (!ids) ? {} : queryByIds;

  return new Promise((resolve, reject) => {
    db.remove(query, {multi: 1}, (err, numAffected) => {
      if (err) return reject(err);
      resolve(numAffected);
    });
  });
}

export function getCache(ids) {
  const queryByIds = {
    cacheID: {$in: flattenDeep([ids])}
  };

  return new Promise((resolve, reject) => {
    db.find(queryByIds, (err, docs) => {
      if (err) return reject(err);
      resolve(docs);
    });
  });
}

export default function(url, cacheID) {
  return new Promise(resolve => {
    findCache(cacheID)
      .then(data => {
        if (!data) {
          // console.log('RETORNANDO OBJETO ATUALIZADO', cacheID);
          return resolve(scrapeAndSaveCache(url, cacheID));
        }
        // console.log('RETORNANDO DATA SALVA', cacheID);
        resolve(data);
      });
  });
}
