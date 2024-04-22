const { crawlPage } = require('./crawl.js')
const { printReport } = require('./report.js')
const { argv } = require('node:process')

async function main() {
    // argv.forEach((val, index) => {
    //     console.log(`${index}: ${val}`);
    // });

    if (argv.length < 3){
        console.log('no URL provided')
        process.exit(1)
    }
    if (argv.length > 3){
        console.log('too many arguments provided')
        process.exit(1)
    }

    const url = argv[2]
    const pages = await crawlPage(url)
    printReport(pages)
}

main()