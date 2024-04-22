function printReport(pages) {
    console.log('============')
    console.log('Report')
    console.log('============')
    const sortedPages = sortPages(pages)
    for (const [url, count] of sortedPages){
        console.log(`Found ${count} internal links to ${url}`)
    }
}

function sortPages(pages) {
    return Object.entries(pages).sort((a, b) => b[1] - a[1])

}

module.exports = {
    printReport,
    sortPages
}