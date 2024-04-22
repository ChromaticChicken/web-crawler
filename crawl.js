const { JSDOM } = require('jsdom')

function normalizeURL(url){
    const urlObj = new URL(url)
    let fullPath = `${urlObj.host}${urlObj.pathname}`
    if (fullPath.length > 0 && fullPath.slice(-1) === '/'){
        fullPath = fullPath.slice(0, -1)
    }
    return fullPath
}

function getURLsFromHTML(htmlBody, baseURL) {
    // get all links from the page, turn all relative links into absolute links using baseURL
    const dom = new JSDOM(htmlBody)
    const links = dom.window.document.querySelectorAll('a')
    const urls = []
    for (const link of links) {
        if (link.href.slice(0,1) === '/'){
            try {
                urls.push(new URL(link.href, baseURL).href)
            } catch (err){
                console.log(`Error parsing URL: ${link.href}, ${err}`)
            }
        } else {
            try {
                urls.push(new URL(link.href).href)
            } catch (err){
                console.log(`Error parsing URL: ${link.href}, ${err}`)
            }
        }
    }
    return urls
}

async function crawlPage(baseURL, currentURL = baseURL, pages = {}){
    
    
    if (new URL(currentURL).hostname !== new URL(baseURL).hostname){
        return pages
    }
    const normalizedURL = normalizeURL(currentURL)

    if (pages[normalizedURL] > 0){
        pages[normalizedURL]++
        return pages
    }
    pages[normalizedURL] = 1
    console.log(`Crawling ${currentURL}`)

    let htmlBody = ''
    try {
        const request = await fetch(currentURL)
        if (request.status >= 400) {
            console.log(`Error fetching ${currentURL}: ${request.status}`)
            return pages
        }
        if (!request.headers.get('content-type').includes('text/html')){
            console.log(`Skipping ${currentURL}: not an HTML page`)
            return pages
        }
        htmlBody = await request.text()
    } catch (err){
        console.log(`Error crawling ${currentURL}: ${err.message}`)
    }

    const urls = getURLsFromHTML(htmlBody, baseURL)
    for (const url of urls){
        pages = await crawlPage(baseURL, url, pages)
    }

    return pages

}
  
module.exports = {
    normalizeURL,
    getURLsFromHTML,
    crawlPage
}
  