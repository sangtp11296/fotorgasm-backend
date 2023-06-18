'use client'

import Link from 'next/link'
import styles from './Auth.module.css'
import React, { useState } from 'react'
import Image from 'next/image'

export default function AuthLayout(props: {
    children: React.ReactNode
    login: React.ReactNode
    signup: React.ReactNode
  }) {
    const [login, setLogin] = useState<boolean>(true);
    return (
      <div className={styles.welcomeAdmin}>
        <div className={styles.welcomeAdminContainer}>
          {props.children}
          <div className={styles.detailInput}>
            <h1>Welcome Back</h1>
            <h2>Hope you have a good day!</h2>
            <div className={styles.signInUp}>
              <button type='button' className={login ? styles.active : ''} onClick={()=>setLogin(true)}>Sign In</button>
              <button className={!login ? styles.active : ''} onClick={()=>setLogin(false)} type='button'>Sign Up</button>
            </div>
            <form autoComplete='off' className={`${styles.signForm} ${!login&& styles.signUp}`}>
              {
                login ? props.login : props.signup
              }
            </form>
            
          </div>
        </div>
      </div>
    )
  }