<template lang="pug">
  .roster-listing(v-if="playersLoaded && playerRoster")
    h3.orange {{ left.teamName }}
    roster-position(:score="playerScores[playerRoster.captain]" :name="getName(players[playerRoster.captain])" :isRight="isRight" role="captain")
    roster-position(:score="playerScores[playerRoster.offense1]" :name="getName(players[playerRoster.offense1])" :isRight="isRight" role="offense")
    roster-position(:score="playerScores[playerRoster.offense2]" :name="getName(players[playerRoster.offense2])" :isRight="isRight" role="offense")
    roster-position(:score="playerScores[playerRoster.support1]" :name="getName(players[playerRoster.support1])" :isRight="isRight" role="support")
    roster-position(:score="playerScores[playerRoster.support2]" :name="getName(players[playerRoster.support2])" :isRight="isRight" role="support")
    roster-position(:score="playerScores[playerRoster.tank1]" :name="getName(players[playerRoster.tank1])" :isRight="isRight" role="tank")
    roster-position(:score="playerScores[playerRoster.tank2]" :name="getName(players[playerRoster.tank2])" :isRight="isRight" role="tank")
    h3.orange(:class="{'is-pulled-right': !isRight}")  {{ playerTotal | playerScore }}
</template>

<script>
import { isEmpty } from 'lodash'
import LeagueService from '@/services/league'

import RosterPosition from '@/views/leagues/RosterPosition'

export default {
  name: 'RosterListing',
  components: {
    RosterPosition
  },
  props: {
    isRight: {
      type: Boolean,
      default: false
    },
    left: {
      type: Object,
      required: true
    },
    raw: {
      type: Boolean,
      default: false
    },
    referenceScores: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      emptyRoster: {
        captain: null,
        offense1: null,
        offense2: null,
        support1: null,
        support2: null,
        tank1: null,
        tank2: null
      },
      league: {}
    }
  },
  computed: {
    fullRoster () {
      return this.$store.getters.getLeagueRoster
    },
    leagueId () {
      return this.$route.params.leagueId
    },
    leftLoaded () {
      return !isEmpty(this.left)
    },
    playerRoster () {
      if (this.left.captain) return this.left
      return this.fullRoster[this.left.userId] ? this.fullRoster[this.left.userId].roster : this.emptyRoster
    },
    players () {
      return this.$store.getters.getPlayers
    },
    playersLoaded () {
      return !isEmpty(this.players)
    },
    playerScores () {
      return !isEmpty(this.referenceScores) ? this.referenceScores : this.playerStoreScores
    },
    playerTotal () {
      return LeagueService.calculateRosterPoints(this.playerScores, this.playerRoster)
    },
    playerStoreScores () {
      return this.raw ? this.$store.getters.getPlayerTotalScores : this.$store.getters.getPlayerScores || {}
    }
  },
  methods: {
    getName (nameObj) {
      return nameObj ? nameObj.name : 'Vacant'
    }
  }
}
</script>

<style lang="scss">
  .roster-listing {
    h3 {
      max-height: 33px;
      overflow: hidden;
    }
    .roster-position {
      background-color: #222;
      padding: .25rem;
      margin-bottom: .25rem;
      .player-score {
        font-size: 1.2rem;
      }
    }
  }
</style>
