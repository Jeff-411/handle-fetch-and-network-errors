
const getApi = (url) => {
  fetch(url)

    // HANDLE FETCH() PROMISE: reject() | resolve()
    .then(res => {
      // if there's an error (either a network err || a fetch() err)
      // => return the _entire_ response, 
      // so the type of err can be sorted out & handled by .catch()
      if (!res.ok) return Promise.reject(res)

      // otherwise (if the Promise resolves)
      return res.json()
    })

    // if fetch()=> resolve(res.json())
    .then(data => handle_apiData(url, data))

    // if fetch()=> reject(res)
    // [NOTE: we're now getting the _entire_ response here]
    .catch(err => {
      // handle DNS and 'offline' network errors
      if (err.message === 'Failed to fetch') {
        // is the network err an 'offline' err?
        !navigator.onLine?
        // yes 
        handle_offlineErr(err): 
        // no
        handle_dnsErr(err)
      }

      // otherwise - if no network errors => handle the fetch() error
      // [by passing on the _entire_ response .catch(err) received
      //  when (!res.ok) returned 'Promise.reject(res)]
      else handle_fetchErrs(err)
    });
}

const handle_apiData = (url, data) => {
  // log data to console
  console.log(data)

  // display data in UI
  let output = '', apiSyntax = '', numUsersToDisplay = 6

  // set syntax for either the *active* API
  url.indexOf('api.github') != -1 ? apiSyntax = 'login' : apiSyntax = 'name'

  // create the output html
  output = `<div>`
  for (i=0; i <= numUsersToDisplay; i++) { 
    output += `<li>${data[i][apiSyntax]}</li>`
  }
  output += 
  `<li>&rarr; see console for full list...</li></div>`

  // display the output in the UI
  document.getElementById('output').innerHTML = output
}

const handle_offlineErr = (msg) => {
  console.log(`NO INTERNET -> ${msg}`)

  // create custom err msg & display in UI
  clearOutput()
  document.getElementById('output').innerHTML =
  `<div>`+
    `<p class="mt-3 p-3 text-danger border border-danger">OOPS! No internet connection detected</p>`+
  `</div>`
}
const handle_dnsErr = (msg) => {
  console.log('DNS ERROR -> ', msg)

  // create custom err msg & display in UI
  clearOutput()
  document.getElementById('output').innerHTML =
  `<div>`+
    `<p class="p-2 text-center text-light bg-dark">DNS ERROR</p>`+
    `<p>${msg}</p>`+
    `<p>See console for details.<p>`+
  `</div>`
}
const handle_fetchErrs = (err) => {

    // declare an empty var to hold a url link
    let apiDocsUrl = ''

    // set this link to the *active* API's doc page 
    err.url.indexOf('api.github') != -1 ?
    apiDocsUrl = 'https://docs.github.com/rest' :
    apiDocsUrl = 'https://jsonplaceholder.typicode.com/' 


    // create & display a custom err msg in the UI
    let errMsgToDisplayInUI = 
    `<div>`+
      // create a header
      `<p class="p-2 text-center text-light bg-success">`+
        `Fetch error: HANDLED`+
      `</p>`+
      // add the status code & message
      `<p>Error ${err.status}: ${err.statusText}</p>`+
      // add the url being fetched
      `<p>${err.url}</p>`+
      // add a link to the API's documentation
      `<p><a href="${apiDocsUrl}" target="_blank">API Docs</a></p>`+
    `</div>`

    clearOutput()
    document.getElementById('output').innerHTML = errMsgToDisplayInUI
    
    // CREATE & LOG A CUSTOM ERR MSG
    let errMsgToLog = 
    `Error: ${err.status} ${err.statusText}\n`+
    `=> ${err.url}\n`+ 
    `=> See API Docs at: ${apiDocsUrl}\n`
    
    console.log(errMsgToLog);
}

const clearOutput = () => {
  document.getElementById('output').innerHTML = ''
  document.getElementById('output').innerHTML = 
  `<div id="placeholder" class="mt-4 text-big font-italic">Output</div>`
}

// add event listeners 

  // GitHub
  document.getElementById('get_github').addEventListener('click', () => {
    getApi('https://api.github.com/users')
  });
  document.getElementById('fail_github').addEventListener('click', () => {
    getApi('https://api.github.com/users_1')
  });
  // JSON-Placeholder
  document.getElementById('get_json').addEventListener('click', () => {
    getApi('https://jsonplaceholder.typicode.com/users')
  });
  document.getElementById('fail_json').addEventListener('click', () => {
    getApi('https://jsonplaceholder.typicode.com/users_1')
  });
  // dns error
  document.getElementById('fail_DNS').addEventListener('click', () => {
    getApi('https://pickle')
  });
  // clear output
  document.getElementById('clear').addEventListener('click', () => {
    clearOutput()
});
