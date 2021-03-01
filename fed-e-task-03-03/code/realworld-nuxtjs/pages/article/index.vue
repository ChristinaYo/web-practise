<template>
    <div class="article-page">
        <div class="banner">
            <div class="container">
                <h1>{{ article.title }}</h1>

                <article-meta :article="article"></article-meta>
            </div>
        </div>

        <div class="container page">
            <div class="row article-content">
                <div class="col-md-12" v-html="article.body"></div>
            </div>

            <hr />

            <div class="article-actions">
                <article-meta :article="article"></article-meta>
            </div>

            <div class="row">
                <div class="col-xs-12 col-md-8 offset-md-2">
                    <form v-if="user" class="card comment-form" @submit.prevent="onSubmit">
                        <div class="card-block">
                            <textarea v-model="comment.body" class="form-control" placeholder="Write a comment..." rows="3"></textarea>
                        </div>
                        <div class="card-footer">
                            <img v-if="user.image" :src="user.image" class="comment-author-img" />
                            <button class="btn btn-sm btn-primary">Post Comment</button>
                        </div>
                    </form>

                    <p v-else style="display: inherit;">
                      <nuxt-link to="/login">Sign in</nuxt-link> 
                      or 
                       <nuxt-link to="/register">Sign up</nuxt-link> 
                      to add comments on this article.
                    </p>

                    <div class="card" v-for="comment in comments" :key="comment.id">
                        <div class="card-block">
                            <p class="card-text">{{ comment.body }}</p>
                        </div>
                        <div class="card-footer">
                            <nuxt-link
                                class="comment-author"
                                :to="{
                                    name: 'profile',
                                    params: {
                                        username: comment.author.username,
                                    },
                                }"
                            >
                                <img :src="comment.author.image" class="comment-author-img" />
                            </nuxt-link>
                            &nbsp;
                            <nuxt-link
                                class="comment-author"
                                :to="{
                                    name: 'profile',
                                    params: {
                                        username: comment.author.username,
                                    },
                                }"
                            >
                                {{ comment.author.username }}
                            </nuxt-link>
                            <span class="date-posted">{{ comment.createdAt | date('MMM DD, YYYY') }}</span>
                            <span 
                              class="mod-options" 
                              v-if="comment.author.username===user.username"
                              @click="deleteComment(comment.id)"
                            >
                              <i class="ion-trash-a"></i>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getArticle, getComments, addComment, deleteComment } from '@/api/articles.js'
import ArticleMeta from './components/article-meta'
import MarkdownIt from 'markdown-it'
import { mapState } from 'vuex'
export default {
    async asyncData({ params }) {
        const { article } = await getArticle(params.slug)
        article.body = new MarkdownIt().render(article.body)
        return {
            article,
        }
    },
    components: { ArticleMeta },
    data() {
        return {
            comments: [],
            comment: {
                body: '',
            },
        }
    },
    computed: {
      ...mapState(['user'])
    },
    mounted() {
        this.getComments()
    },
    methods: {
        async onSubmit() {
            try {
                const res = await addComment(this.article.slug, { comment: this.comment })
                this.getComments()
            } catch (err) {}
        },
        async getComments() {
            const { comments } = await getComments(this.article.slug)
            this.comments = comments
        },
        async deleteComment(id) {
          await deleteComment(this.article.slug, id)
          this.getComments()
        }
    },
}
</script>

<style>
</style>