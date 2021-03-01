<template>
    <div class="editor-page">
        <div class="container page">
            <div class="row">
                <div class="col-md-10 offset-md-1 col-xs-12">
                    <form>
                        <fieldset>
                            <fieldset class="form-group">
                                <input v-model="article.title" type="text" class="form-control form-control-lg" placeholder="Article Title" />
                            </fieldset>
                            <fieldset class="form-group">
                                <input v-model="article.description" type="text" class="form-control" placeholder="What's this article about?" />
                            </fieldset>
                            <fieldset class="form-group">
                                <textarea v-model="article.body" class="form-control" rows="8" placeholder="Write your article (in markdown)"></textarea>
                            </fieldset>
                            <fieldset class="form-group">
                                <input v-model="new_tag" @keyup.enter.prevent="addTag" type="text" class="form-control" placeholder="Enter tags" />
                                <div class="tag-list">
                                    <span 
                                        v-for="tag in article.tagList" 
                                        :key="tag" 
                                        class="tag-default tag-pill ng-binding ng-scope"
                                    >
                                        <i class="ion-close-round" @click="deleteTag(tag)"></i>
                                        {{ tag }}
                                    </span>
                                </div>
                            </fieldset>
                            <button class="btn btn-lg pull-xs-right btn-primary" type="button" @click="onSubmit">Publish Article</button>
                        </fieldset>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { createArticle, updateArticle, getArticle } from '@/api/articles.js'
export default {
    name: 'settings',
    middleware: 'authorized',
    data() {
        return {
            new_tag: '',
            article: {
                title: '',
                description: '',
                body: '',
                tagList: []
            }
        }
    },
    async mounted() {
        const slug = this.$route.params.slug
        if(slug) {
            const { article } = await getArticle(slug)
            this.article = article
        }
    },
    methods: {
        addTag() {
            const index = this.article.tagList.findIndex(i => i === this.new_tag)
            if(index === -1) {
               this.article.tagList.push(this.new_tag)
               this.new_tag = ''
            }
        },
        deleteTag(tag) {
            const index = this.article.tagList.findIndex(i => i === tag)
            this.article.tagList.splice(index, 1)
        },
        async onSubmit() {
            const slug = this.$route.params.slug
            const { article } = slug ? await updateArticle(slug, { article: this.article })
                : await createArticle({ article: this.article })
            this.$router.push(`/article/${article.slug}`)
        }
    }
}
</script>

<style>
</style>