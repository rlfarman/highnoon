<template lang="pug">
  .player-line(v-if="!existsInRoster")
    .columns.is-gapless.is-mobile
      .column.is-narrow
        img(:src="`images/roles/${player.attributes.role || 'flex'}-white.svg`" width="22" height="22")
      .column.is-narrow
        img(:src="getLogo(player)" width="22" height="22")
      .column
        span.has-pointer(@click="showDetails = !showDetails") {{ player.name }}
      .column.is-narrow
        span.is-proper {{ player.stats.fantasyScore || 'N/A' }}
      .column.is-narrow
        button.button.is-primary.is-small(@click="$emit('add-player', player)" v-if="canSelect && !existsInRoster") Select
        button.button.is-primary.is-small(disabled v-else) Select
    .columns.player-line-details(v-if="showDetails")
      .column
        label.label Nationality
        span {{ player.nationality }}
      .column
        label.label Heroes
        ul(v-if="player.attributes.heroes")
          li(v-for="hero in player.attributes.heroes") {{ hero }}
        span(v-else) ??
      .column
        label.label Player #
        span {{ player.attributes.player_number || '??'}}
</template>

<script>
export default {
  props: {
    player: {
      required: true,
      type: Object
    },
    canSelect: {
      type: Boolean,
      default: false
    },
    roster: {
      type: Array,
      default: () => ([])
    }
  },
  data () {
    return {
      showDetails: false
    }
  },
  computed: {
    existsInRoster () {
      return this.roster ? this.roster.find(player => player.id === this.player.id) : false
    }
  },
  methods: {
    getLogo (player) {
      if (player) return `images/teams/${player.team}.svg`
      return ''
    }
  }
}
</script>

<style lang="scss">
  .player-line {
    background-color: rgba(0,0,0,0.4);
    padding: .25rem;
    margin-bottom: .25rem;
    .columns{
      .column {
        padding: 0 .25rem!important;
      }
    }
    img {
      height: 22px;
      width: 22px;
    }
    .player-line-details {
      margin: 1rem;
      li {
        text-transform: capitalize;
      }
    }
  }
</style>
