export default {
  router: {
    linkActiveClass: 'active',
    extendRoutes(routes, resolve) {
        // routes = []
      routes.splice(0);
      console.log("extendRoutes -> routes", routes)
      routes.push(
        ...[
          {
            path: "/",
            component: "pages/layout/index.vue",
            children: [
              {
                path: "",
                name: "home",
                component: "pages/home/index.vue",
              },
              {
                path: "/article/:slug",
                name: "article",
                component: "pages/article/index.vue",
              },
              {
                path: "/editor/:slug?",
                name: "editor",
                component: "pages/editor/index.vue",
              },
              {
                path: "/login",
                name: "login",
                component: "pages/login/index.vue",
              },
              {
                path: "/register",
                name: "register",
                component: "pages/login/index.vue",
              },
              {
                path: "/profile/:username",
                name: "profile",
                component: "pages/profile/index.vue",
              },
              {
                path: "/settings",
                name: "settings",
                component: "pages/settings/index.vue",
              },
            ],
          },
        ]
      );
    },
  },
  server: {
    host: '0.0.0.0',
    port: '3000'
  },
  plugins: [
    '~/plugins/request.js',
    '~/plugins/dayjs.js'
  ]
};
