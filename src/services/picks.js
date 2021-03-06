import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/firestore'
import { fireInit } from '@/fireLogin'

fireInit()

var db = firebase.firestore()
var rdb = firebase.database()

export default {
  canSave (pick) {
    return rdb.ref(`processedMatches/${pick.matchId}`).once('value').then(snapshot => {
      if (snapshot.val()) return false
      return true
    })
  },
  getGlobalPickRates () {
    return db.collection('picksLean').get()
      .then((pickDocs) => {
        const pickStats = {}
        pickDocs.forEach((pickDoc) => {
          const pick = pickDoc.data()
          pickStats[pickDoc.id] = pick
        })
        return pickStats
      })
  },
  savePick (pick) {
    return db.collection('picks').doc(String(pick.userId))
      .set({ [pick.matchId]: pick }, { merge: true })
      .then(pickRef => pickRef.id)
      .catch((error) => {
        console.error(error)
        return false
      })
  }
}
