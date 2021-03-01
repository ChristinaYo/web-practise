<template>
    <div class="home-page">
        <div class="banner">
            <div class="container">
                <h1 class="logo-font">conduit</h1>
                <p>A place to share your knowledge.</p>
            </div>
        </div>

        <div class="container page">
            <div class="row">
                <div class="col-md-9">
                    <div class="feed-toggle">
                        <ul class="nav nav-pills outline-active">
                            <li v-if="user" class="nav-item">
                              <nuxt-link 
                                exact
                                class="nav-link" 
                                :to="{ name: 'home', query: { tab: 'your_feed' } }"
                              >Your Feed</nuxt-link>
                            </li>
                            <li class="nav-item">
                                <nuxt-link 
                                  exact
                                  class="nav-link"
                                  :class="{active:tab==='global_feed'}"
                                  :to="{ name: 'home', query: { tab: 'global_feed' } }"
                                >Global Feed</nuxt-link>
                            </li>
                            <li v-if="tag" class="nav-item">
                                <nuxt-link
                                  class="nav-link active" 
                                  exact
                                  :to="{ name: 'home', query: { tab: 'tag', tag: tag }}"
                                >{{ tag }}</nuxt-link>
                            </li>
                        </ul>
                    </div>

                    <article-list :articles="articles"></article-list>

                    <nav>
                        <ul class="pagination">
                            <li 
                              v-for="item in totalPage" 
                              :key="item" 
                              class="page-item"
                              :class="{active: item == page}"
                            >
                                <nuxt-link 
                                    class="page-link" 
                                    :to="{ 
                                      name: 'home', 
                                      query: { page: item, tag: $route.query.tag, tab } 
                                    }"
                                >{{ item }}</nuxt-link>
                            </li>
                        </ul>
                    </nav>
                </div>

                <div class="col-md-3">
                    <div class="sidebar">
                        <p>Popular Tags</p>

                        <div  class="tag-list">
                            <nuxt-link 
                              v-for="tag in tags" 
                              :key="tag"
                              :to="{ name: 'home', query: { tag: tag, tab: 'tag' } }"
                              class="tag-pill tag-default"
                            >
                              {{tag}}
                            </nuxt-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { 
  getArticles, 
  getYourFeedArticles, 
  getTags,
  addFavorite,
  deleteFavorite
} from '@/api/articles.js'
import { mapState } from 'vuex'
import ArticleList from '@/components/article-list'
export default {
    async asyncData ({ query }) {
        const limit = 20;
        const { page = 1, tag, tab='global_feed' } = query
        const loadArticles = tab === 'your_feed' ?  getYourFeedArticles : getArticles
        let articles = []
        let articlesCount = 0
        let tags = [];
        try{
          let [tagsRes, articleRes] = await Promise.all([
            getTags(),
            loadArticles({
              limit,
              offset: (page - 1) * limit,
              tag: query.tag
            })
          ])
          tags = tagsRes.tags
          articlesCount = articleRes.articlesCount
          articles = articleRes.articles
          articles && articles.forEach(item => {
            item.disabled_favorite = false
          })
        }catch(err) {
          console.log(err)
        }
        return {
            articles,
            articlesCount,
            tags,
            page,
            limit,
            tag,
            tab
        }
    },
    
    components: { ArticleList },
    watchQuery: ['page', 'tag', 'tab'],
    computed: {
        ...mapState(['user']),
        totalPage () {
            return Math.ceil(this.articlesCount / this.limit)
        }
    },
    methods: {
      async onFavorite(article) {
        try{
          article.disabled_favorite = true
          if(article.favorited) {
            await deleteFavorite(article.slug)
            article.favoritesCount += -1
            article.favorited = false
          }else{
            await addFavorite(article.slug)
            article.favoritesCount += 1
            article.favorited = true
          }
          article.disabled_favorite = false
        }catch(err) {}
      }
    }
}
</script>

<style>
</style>