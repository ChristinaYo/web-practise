<template>
    <div>
        <div v-for="article in articles" :key="article.slug" class="article-preview">
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
                <button class="btn btn-outline-primary btn-sm pull-xs-right" :class="{ active: article.favorited }" :disabled="article.disabled_favorite" @click="onFavorite(article)">
                    <i class="ion-heart"></i>
                    {{ article.favoritesCount }}
                </button>
            </div>
            <nuxt-link :to="{ name: 'article', params: { slug: article.slug } }" class="preview-link">
                <h1>{{ article.title }}</h1>
                <p>{{ article.body }}</p>
                <span>Read more...</span>
            </nuxt-link>
        </div>
        <div class="article-preview" v-if="loading">loading articles... </div>
        <div class="article-preview" v-if="!loading&&!articles.length">No articles are here... yet.</div>
    </div>
</template>

<script>
import { addFavorite, deleteFavorite } from '@/api/articles.js'
export default {
    props: {
        articles: {
            type: Array,
            required: true,
        },
        loading: {
          type: Boolean,
          default: false
        }
    },
    methods: {
        async onFavorite(article) {
            try {
                article.disabled_favorite = true
                if (article.favorited) {
                    await deleteFavorite(article.slug)
                    article.favoritesCount += -1
                    article.favorited = false
                } else {
                    await addFavorite(article.slug)
                    article.favoritesCount += 1
                    article.favorited = true
                }
                article.disabled_favorite = false
            } catch (err) {}
        },
    },
}
</script>

<style>
</style>