import Head from 'next/head'

import { CallToAction } from '@/components/CallToAction'
import { Faqs } from '@/components/Faqs'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import { Pricing } from '@/components/Pricing'
import { PrimaryFeatures } from '@/components/PrimaryFeatures'
import { SecondaryFeatures } from '@/components/SecondaryFeatures'
import { Testimonials } from '@/components/Testimonials'
import { useEffect, useState } from 'react'
import firebase from '@/firebase/firebaseConfig'

export default function Home() {
  const [userId, setUserId] = useState('')
  const [userName, setUserName] = useState('')
  const [planType, setPlanType] = useState('')
  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid)
        setUserName(user.displayName)
        const userRef = firebase.database().ref('users/' + user.uid)
        userRef.on('value', (snapshot) => {
          const user = snapshot.val()
          if (user) {
            setPlanType(user.subscription.planType || '')
          }
        })
      } else {
        setUserId('')
        setUserName('')
      }
    })
  }, [userId])
  return (
    <>
      <Head>
        <title>TaxPal - Accounting made simple for small businesses</title>
        <meta
          name="description"
          content="Most bookkeeping software is accurate, but hard to use. We make the opposite trade-off, and hope you don’t get audited."
        />
      </Head>
      <Header userId={userId} userName={userName} />
      <main>
        <Hero />
        <PrimaryFeatures />
        <SecondaryFeatures />
        <CallToAction />
        <Testimonials />
        <Pricing userId={userId} userName={userName} planType={planType} />
        <Faqs />
      </main>
      <Footer />
    </>
  )
}
