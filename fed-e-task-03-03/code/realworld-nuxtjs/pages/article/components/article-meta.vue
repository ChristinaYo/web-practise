<template>
    <div class="article-meta">
        <nuxt-link :to="{ name: 'profile', params: { username: article.author.username } }">
            <img :src="article.author.image" />
        </nuxt-link>
        <div class="info">
            <nuxt-link class="author" :to="{ name: 'profile', params: { username: article.author.username } }">
                {{ article.author.username }}
            </nuxt-link>
            <span class="date">{{ article.createdAt | date('MMM DD, YYYY') }}</span>
        </div>

        <template v-if="user && user.username === article.author.username">
            <nuxt-link 
                class="btn btn-outline-secondary btn-sm"
                :to="`/editor/${article.slug}`"
            >
                <i class="ion-edit"></i> Edit Article
            </nuxt-link> 

            <button class="btn btn-outline-danger btn-sm" @click="deleteArticle">
                <i class="ion-trash-a"></i> Delete Article
            </button>
        </template>

        <template v-else>
            <button 
                class="btn btn-sm btn-outline-secondary"
                :disabled="disabled_follow"
                @click="handleFollow"
            >
                <i class="ion-plus-round"></i>
                &nbsp;
                {{ article.author.following ? 'Unfollow' : 'Follow' }} {{ article.author.username }}
            </button>
            &nbsp;&nbsp;
            <button 
                class="btn btn-sm btn-outline-primary"
                :disabled="disabled_favorite"
                @click="handleFavorite"
            > 
                <i class="ion-heart"></i>
                &nbsp;
                {{ article.favorited ? 'Unfavorite' : 'Favorite' }} Post <span class="counter">({{ article.favoritesCount }})</span>
            </button>
        </template>

    </div>
</template>

<script>
import { addFollow, deleteFollow } from '@/api/profiles.js'
import { addFavorite, deleteFavorite, deleteArticle } from '@/api/articles.js'
import { mapState } from 'vuex'
export default {
    props: {
        article: {
            type: Object,
            required: true,
        },
    },
    computed: {
        ...mapState(['user'])
    },
    data( ) {
        return {
            disabled_follow: false,
            disabled_favorite: false
        }
    },
    methods: {
        async handleFollow() {
            this.disabled_follow = true
            if (this.article.author.following) {
                await deleteFollow(this.article.author.username)
                this.article.author.following = false
            } else {
                await addFollow(this.article.author.username)
                this.article.author.following = true
            }
            this.disabled_follow = false
        },
        async handleFavorite(article) {
            try {
                this.disabled_favorite = true
                if (this.article.favorited) {
                    await deleteFavorite(this.article.slug)
                    this.article.favoritesCount += -1
                    this.article.favorited = false
                } else {
                    await addFavorite(this.article.slug)
                    this.article.favoritesCount += 1
                    this.article.favorited = true
                }
                this.disabled_favorite = false
            } catch (err) {
                this.disabled_favorite = false
            }
        },
        async deleteArticle() {
            await deleteArticle(this.article.slug)
            this.$router.replace('/')
        }
    },
}
</script>

<style>
</style>