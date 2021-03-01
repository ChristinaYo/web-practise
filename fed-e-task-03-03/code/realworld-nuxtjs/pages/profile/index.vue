<template>
    <div class="profile-page">
        <div class="user-info">
            <div class="container">
                <div class="row">
                    <div class="col-xs-12 col-md-10 offset-md-1">
                        <img :src="profile.image" class="user-img" />
                        <h4>{{ profile.username }}</h4>
                        <p>{{ profile.bio }}</p>
                        <nuxt-link 
                            v-if="user && user.username === profile.username" 
                            class="btn btn-sm btn-outline-secondary action-btn" 
                            to="/settings"
                        >
                            <i class="ion-gear-a"></i> Edit Profile Settings
                        </nuxt-link>
                        <button
                            v-else 
                            class="btn btn-sm btn-outline-secondary action-btn" 
                            :disabled="disabled_follow"
                            @click="handleFollow"
                        >
                            <i class="ion-plus-round"></i>
                            &nbsp; {{ profile.following ? 'Unfollow' : 'Follow' }} {{ profile.username }}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div class="container">
            <div class="row">
                <div class="col-xs-12 col-md-10 offset-md-1">
                    <div class="articles-toggle">
                        <ul class="nav nav-pills outline-active">
                            <li class="nav-item">
                                <nuxt-link 
                                  exact
                                  class="nav-link"
                                  :class="{ active: tab === 'author' }"
                                  :to="{ name: 'profile', query: { tab: 'author' } }"
                                >My Articles</nuxt-link>
                            </li>
                            <li class="nav-item">
                                <nuxt-link
                                  class="nav-link"
                                  :class="{ active: tab === 'favorited'}"
                                  exact
                                  :to="{ name: 'profile', query: { tab: 'favorited' }}"
                                >Favorited Articles</nuxt-link>
                            </li>
                        </ul>
                    </div>

                    <article-list :articles="articles" :loading="loading"></article-list>

                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getProfile, addFollow, deleteFollow } from '@/api/profiles.js'
import { getArticles } from '@/api/articles.js'
import ArticleList from '@/components/article-list'
import { mapState } from 'vuex'
export default {
  name: 'profile',
    components: { ArticleList },
  data() {
      return {
          profile: {},
          disabled_follow: false,
          tab: 'author',
          articles: [],
          loading: false,
      }
  },
  computed: {
      ...mapState(['user']),
      username() {
          return this.$route.params.username
      }
  },
  watch: {
      '$route': {
          handler() {
              this.getProfile()
              this.getArticles()
          },
          deep: true
      }
  },
  mounted() {
      this.getProfile()
    this.getArticles()
  },
  methods: {
      async getProfile() {
          const { profile } = await getProfile(this.username)
          this.profile = profile
      },
      async handleFollow() {
            this.disabled_follow = true
            if (this.profile.following) {
                await deleteFollow(this.profile.username)
                this.profile.following = false
            } else {
                await addFollow(this.profile.username)
                this.profile.following = true
            }
            this.disabled_follow = false
        },
        async getArticles() {
            this.tab = this.$route.query.tab || 'author'
            this.loading = true
            const params = {}
            params[this.tab] = this.username
            const { articles } = await getArticles(params)
            this.loading = false
            this.articles = articles
        }
  }
}
</script>

<style>
</style>