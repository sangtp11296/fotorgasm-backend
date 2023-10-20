'use client'
import React, { useEffect, useState } from 'react'

const Quotes = () => {
    const [value, setValue] = useState<string>();
    const [quotes, setQuotes] = useState<{ quote: string; author: string }[]>([]);

  useEffect(() => {
    const quoteElements = document.querySelectorAll('.quoteText');
    const extractedQuotes: { quote: string; author: string }[] = [];

    quoteElements.forEach((element) => {
        const quoteElement = element as HTMLElement;
        const quoteText = quoteElement.innerText.match(/“([^”]*)”/) || []; // Use regular expression to extract text inside double quotes
        const quote = quoteText[1]?.trim() || '';
        const authorElement = element.querySelector('.authorOrTitle') as HTMLElement;
        const author = authorElement?.innerText.trim() || '';
        
        if (quote.split(' ').length <= 50 && author) {
        console.log(quote)
        extractedQuotes.push({ quote, author });
      }
    });

    setQuotes(extractedQuotes);
  }, [value]);
  console.log(quotes)
  const handleSubmit = async () => {
    const res = await fetch('https://4esg1vvhi3.execute-api.ap-southeast-1.amazonaws.com/dev/quotes',{
        method: "POST",
        body: JSON.stringify(quotes)
    })
    res.status === 200 && window.location.reload();
  }
  return (
    <div>
        <input onChange={(e:React.ChangeEvent<HTMLInputElement>)=>setValue(e.target.value)} type='text'/>
        <button onClick={handleSubmit}>Submit</button>
        {
            quotes.map((quote,ind) => {
                return(
                    <div key={ind} style={{color:'white'}}>
                        {quote.quote}
                        <span>{quote.author}</span>
                    </div>
                )
            })
        }
        {
            value && <div className='postText standard' style={{color:'white'}} dangerouslySetInnerHTML={{__html:value}}>
            </div>
        }
        
    </div>
  )
}
export default Quotes