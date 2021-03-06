<template lang="pug">
  .match-listing(v-if="pickStats")
    .columns.is-gapless.is-mobile
      .column.is-narrow
        img(:src="`images/teams/${match.competitors[0].abbreviatedName}.svg`" width="28")
      .column.is-narrow
        .ow-font.team-name(v-tooltip="`${leftPercent}% choose ${match.competitors[0].abbreviatedName}`") {{ match.competitors[0].abbreviatedName }}
      .column.is-narrow(v-if="!isDisabled")
        b-radio.is-pulled-right.winner-radio(v-model="matchWinner" size="is-medium" :native-value="match.competitors[0].id")
      .column.is-narrow(v-else)
        b-radio.is-pulled-right.winner-radio.correct-radio(selected size="is-medium" v-if="finishedMatchWinner && matchWinner == match.competitors[0].id")
        b-radio.is-pulled-right.winner-radio.incorrect-radio(selected size="is-medium" v-else-if="matchWinner == match.competitors[0].id")
        b-radio.is-pulled-right.winner-radio.neutral-radio(selected size="is-medium" v-else)
      .column.has-text-centered
        .match-date {{ match.startDateTS | formatJSDate }}
        .match-time {{ match.startDateTS | formatJSTime }}
      .column.is-narrow(v-if="!isDisabled")
        b-radio.is-pulled-right.winner-radio(v-model="matchWinner" size="is-medium" :native-value="match.competitors[1].id")
      .column.is-narrow(v-else)
        b-radio.is-pulled-right.winner-radio.correct-radio(selected size="is-medium" v-if="finishedMatchWinner && matchWinner == match.competitors[1].id")
        b-radio.is-pulled-right.winner-radio.incorrect-radio(selected size="is-medium" v-else-if="matchWinner == match.competitors[1].id")
        b-radio.is-pulled-right.winner-radio.neutral-radio(selected size="is-medium" v-else)
      .column.is-narrow
        .ow-font.team-name.is-pulled-right(v-tooltip="`${rightPercent}% choose ${match.competitors[1].abbreviatedName}`") {{ match.competitors[1].abbreviatedName }}
      .column.is-narrow
        img(:src="`images/teams/${match.competitors[1].abbreviatedName}.svg`" width="22" height="22")
    .pick-rates(:style="{'background-color': `#${match.competitors[1].primaryColor}`}" v-if="showPickRates")
      .pick-percentage-bar(:style="pickStyles")
</template>

<script>
import { get } from 'lodash'
import PicksService from '@/services/picks'

export default {
  name: 'MatchListing',
  props: {
    leagueId: {
      type: [String, Number],
      required: true
    },
    match: {
      type: Object,
      required: true
    },
    pickStats: {
      type: Object,
      required: true
    },
    showPickRates: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      matchWinner: ''
    }
  },
  computed: {
    isDisabled () {
      const now = Date.now()
      return (this.match.startDateTS < (now - 600000))
    },
    leftPercent () {
      const leftTotal = get(this.pickStats, `${this.match.id}.${this.match.competitors[0].id}`, 0)
      return leftTotal ? Math.round(leftTotal / this.totalPicks * 100) : 0
    },
    rightPercent () {
      const rightTotal = get(this.pickStats, `${this.match.id}.${this.match.competitors[1].id}`)
      return rightTotal ? Math.round(rightTotal / this.totalPicks * 100) : 0
    },
    pickStyles () {
      return { 'width': `${this.leftPercent}%`, 'background-color': `#${this.match.competitors[0].primaryColor}` }
    },
    totalPicks () {
      const left = get(this.pickStats, `${this.match.id}.${this.match.competitors[0].id}`, 0)
      const right = get(this.pickStats, `${this.match.id}.${this.match.competitors[1].id}`, 0)
      const totalPicks = (left + right)
      return totalPicks
    },
    userId () {
      return this.$store.getters.getUserId
    },
    userPicks () {
      return this.$store.getters.getUserPicks
    },
    finishedMatchWinner () {
      if (this.userPicks[this.match.id] && this.userPicks[this.match.id].points > 0) return true
      return false
    }
  },
  watch: {
    matchWinner (val) {
      if (val) this.savePick()
    },
    userPicks: {
      immediate: true,
      handler (val) {
        if (val) {
          if (val[this.match.id]) this.matchWinner = val[this.match.id].winner
        }
      }
    }
  },
  mounted () {
    // firefox doesn't get triggered by the one in the watcher for some reason
    this.$store.dispatch('fetchPicks')
  },
  methods: {
    savePick () {
      // make sure we don't fire a save for something that already exists
      if (!this.userPicks[this.match.id] || this.userPicks[this.match.id].winner !== this.matchWinner) {
        this.$store.dispatch('setLoading', true)
        const pick = {
          matchId: this.match.id,
          userId: this.userId,
          winner: this.matchWinner
        }
        PicksService.canSave(pick)
          .then((theyCan) => {
            console.table(theyCan)
            if (theyCan) {
              PicksService.savePick(pick)
                .then(() => {
                  this.$store.dispatch('fetchPicks')
                  this.$toast.open({
                    message: 'Successfully saved pick!',
                    type: 'is-success',
                    position: 'is-bottom'
                  })
                })
                .catch((e) => {
                  this.$toast.open({
                    message: 'Pick can not be saved!',
                    type: 'is-danger',
                    position: 'is-bottom'
                  })
                })
            } else {
              this.$toast.open({
                message: 'Match is locked, so this pick will not be saved!',
                type: 'is-danger',
                position: 'is-bottom'
              })
            }
          })
          .finally(() => {
            this.$store.dispatch('setLoading', false)
          })
      }
    }
  }
}
</script>

<style lang="scss">
.match-listing {
  background-color: rgba(255,255,255,0.1);
  margin-bottom: .25rem;
  padding: .25rem;
  .pick-rates {
    height: 8px;
    margin-top: -1rem;
  }
  .pick-percentage-bar {
    height: 8px;
  }
  .team-name {
    width: 32px;
  }
  .b-checkbox.checkbox {
    margin-top: .35rem;
  }
  .match-date {
    font-size: .75rem;
    display: block;
  }
  .match-time {
    display: block;
    font-size: .6rem;
  }
  img {
    margin: 0 .5rem -.75rem .5rem;
  }
  .winner-radio {
    .check {
      margin-bottom: -1.8rem;
    }
  }
  .b-radio.radio.incorrect-radio input[type=radio]:checked + .check {
    border-color: #a42621;
  }
  .b-radio.radio.incorrect-radio input[type=radio] + .check:before {
    background-color: #a42621;
  }
  .b-radio.radio.correct-radio input[type=radio]:checked + .check {
    border-color: #21a431;
  }
  .b-radio.radio.correct-radio input[type=radio] + .check:before {
    background-color: #21a431;
  }
  .b-radio.radio.neutral-radio input[type=radio]:checked + .check {
    border-color: rgba(0,0,0,0.1);
  }
  .b-radio.radio.neutral-radio input[type=radio] + .check:before {
    background-color: #222;
  }
}
</style>
