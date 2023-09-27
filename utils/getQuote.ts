
export const getQuote = async () => {

    // Fetch Quotes
    const res = await fetch('https://vjbjtwm3k8.execute-api.ap-southeast-1.amazonaws.com/dev/quotes', {
        method: "GET"
    })
    const data = await res.json();
    const quote = data.quote.quote;
    const author = data.quote.author;
    return {quote, author}

};