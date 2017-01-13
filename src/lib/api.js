import fetch from 'isomorphic-fetch'

export function callAPI ({ url, body, method = 'POST' }) {
  return fetch(url, {
    method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
  .then((res) => res.json())
}

export default callAPI
