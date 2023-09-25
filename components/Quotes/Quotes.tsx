import React from 'react'
import styles from './Quotes.module.css'

export const Quotes = async () => {
  // Fetch Quotes
  const res = await fetch('https://api.quotable.io/random?limit=1?tags=photography', {
    method: "GET"
  })
  const data = await res.json()
  console.log(data)
  return (
    <div className={styles.quotes}>
        
    </div>
  )
}
