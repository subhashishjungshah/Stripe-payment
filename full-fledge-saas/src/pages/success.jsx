import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import firebase from '@/firebase/firebaseConfig'

export default function Success() {
  const [userId, setUserId] = useState('')
  const [sessionId, setSessionId] = useState('')
  const router = useRouter()

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid)
        const userRef = firebase.database().ref('users/' + user.uid)
        userRef.on('value', (snapshot) => {
          const user = snapshot.val()
          if (user) {
            setSessionId(user.subscription.sessionId || '')
          }
        })
      }
    })
  }, [userId, sessionId])

  //   Validate logic for stripe payment
  const handlePaymentSuccess = () => {
    fetch('http://localhost:8080/api/v1/payment-success', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sessionId: sessionId, firebaseId: userId }),
    })
      .then((res) => {
        if (res.ok) return res.json()
        return res.json().then((json) => Promise.reject(json))
      })
      .then((data) => {
        router.push('/')
      })
      .catch((e) => {
        console.log(e.error)
      })
  }

  return (
    <div className="m-0 p-0">
      <div className="flex min-h-[80vh] w-full flex-col items-center justify-center">
        <div className="mx-auto my-10 flex flex-col items-center justify-center text-2xl text-green-600">
          <img
            src="https://cdn-icons-png.flaticon.com/512/7518/7518748.png"
            alt=""
            width={220}
            height={220}
          />
          <h3 className="pt-20 text-center text-4xl font-bold text-slate-700 lg:pt-0">
            Payment Successful
          </h3>
          <button
            onClick={() => handlePaymentSuccess()}
            className="my-16 w-40 rounded bg-[#009C96] px-2 py-2 text-xl uppercase text-white"
          >
            Proceed
          </button>
        </div>
      </div>
    </div>
  )
}
