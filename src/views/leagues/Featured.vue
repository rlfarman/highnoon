<template lang="pug">
  .featured-leagues
    h1 Featured Leagues
    section
      span These leagues are advertised publicly.  Often times they are leagues that give away prizes, have established communities, or contribute to the OWL community in a positive way.  If you think your league is worthy of being featured, please hit us up on discord!
    b-tabs(v-model="activeContentTab")
      b-tab-item(label="Unlimited Leagues")
        h2 Unlimited Leagues
        .columns.is-multiline
          .column.is-one-quarter-desktop(v-for="league in featuredUnlimitedLeagues")
            .image.is-256x256
              img(:src="league.featuredURL")
            h3
              router-link(:to="`/LeagueUnlimited/${league.id}`") {{ league.leagueName }}
            span {{ league.featuredMessage }}
            hr.is-hidden-desktop
      b-tab-item(label="Pick'em Leagues")
        h2 Pick'em Leagues
        .columns.is-multiline
          .column.is-one-quarter-desktop(v-for="league in featuredPickemLeagues")
            .image.is-256x256
              img(:src="league.featuredURL")
            h3
              router-link(:to="`/LeaguePickem/${league.id}`") {{ league.leagueName }}
            span {{ league.featuredMessage }}
            hr.is-hidden-desktop
</template>

<script>
export default {
  name: 'FeaturedLeagues',
  data () {
    return {
      activeContentTab: null
    }
  },
  computed: {
    featuredPickemLeagues () {
      return this.$store.getters.getFeaturedPickem
    },
    featuredUnlimitedLeagues () {
      return this.$store.getters.getFeaturedUnlimited
    }
  },
  mounted () {
    // snag the featured leagues
    this.$store.dispatch('fetchFeaturedPickem')
    this.$store.dispatch('fetchFeaturedUnlimited')
  }
}
</script>
