// 实现这个项目的构建任务
const { src, dest, parallel, series, watch } = require('gulp');
const del = require('del');
const loadPlugins = require('gulp-load-plugins');
const plugins = loadPlugins();
const browserSync = require('browser-sync');
const bs = browserSync.create();

const data = {
    menus: [
        {
            name: 'Home',
            icon: 'aperture',
            link: 'index.html'
        },
        {
            name: 'Features',
            link: 'features.html'
        },
        {
            name: 'About',
            link: 'about.html'
        },
        {
            name: 'Contact',
            link: '#',
            children: [
                {
                    name: 'Twitter',
                    link: 'https://twitter.com/w_zce'
                },
                {
                    name: 'About',
                    link: 'https://weibo.com/zceme'
                },
                {
                    name: 'divider'
                },
                {
                    name: 'About',
                    link: 'https://github.com/zce'
                }
            ]
        }
    ],
    pkg: require('./package.json'),
    date: new Date()
}
//在构建之前先清理旧有编译文件
const clean = () => {
    return del(['temp', 'dist'])
}

//编译样式文件
//step1: 通过sass将scss文件转换为css文件
//step2: 将转换后的文件拷贝至目标资源文件目录下
//备注：为了能够保持目标资源文件还是和原始文件的结构一致，可以通过base配置基础目录
const styles = () => {
    return src('src/assets/styles/*.scss', { base: 'src' })
        .pipe(plugins.sass({ outputStyle: 'expanded' }))
        .pipe(dest('temp'))
        .pipe(bs.reload({ stream: true }))
}

//编译js文件
//step1: 通过babel将es6转义
//step2: 将转换后的文件拷贝至目标资源文件目录下
const scripts = () => {
    return src('src/scripts/*.js', { base: 'src' })
        .pipe(plugins.babel({ presets: ['@babel/preset-env'] }))
        .pipe(dest('temp'))
        .pipe(bs.reload({ stream: true }))
}
//处理模板文件
//step1: 通过swig将模板文件根据传参内容重写，并且做出防止静态资源缓存处理
//step2: 将转换后的文件拷贝至目标资源文件目录下
const page = () => {
    return src('src/**/*.html', { base: 'src' })
        .pipe(plugins.swig({ data, defaults: { cache: false } })) // 防止静态资源缓存处理
        .pipe(dest('temp'))
        .pipe(bs.reload({ stream: true }))
}
//字体文件
const font = () => {
    return src('src/assets/fonts/**', { base: 'src' })
        .pipe(plugins.imagemin()) 
        .pipe(dest('dist'))
}
//图片处理
const image = () => {
    return src('src/assets/images/**', { base: 'src' })
        .pipe(plugins.imagemin())
        .pipe(dest('dist'))
}

//其他文件
//将剩余文件拷贝至目标资源文件目录下
const extra = () => {
    return src('public/**', { base: 'public' })
        .pipe(dest('dist'))
}
//通过gulp-useref将HTML引用的多个CSS和JS合并起来，以注释的方式处理
const useref = () => {
    return src('temp/*.html',{ base: 'temp' })
    .pipe(plugins.useref({ searchPath: ['temp', '.'] })) //查找文件的路径，优先找temp下，后续再从根目录找
    //这里开始要把合并后的文件做压缩处理，判断不同文件类型使用不同的压缩插件
    .pipe(plugins.if(/\.js$/,plugins.uglify()))
    .pipe(plugins.if(/\.css$/, plugins.cleanCss()))
    .pipe(plugins.if(/\.html$/, plugins.htmlmin({
        collapseWhitespace: true, //清除空格
        minifyCSS: true, //压缩css
        minifyJS: true //压缩js
    })))
    .pipe(dest('dist'))
}

//服务搭建
const serve = () => {
    //这里需要加个静态资源文件的监听，在目标文件下资源发生变化时，启动对应的资源的编译任务
    watch('src/assets/styles/*.scss', styles);
    watch('src/assets/scripts/*.js', scripts);
    watch('src/*.html', page);
    //对于不经常有变动的文件，开发阶段可以不用如此频繁的去压缩处理浪费时间，只要重新加载即可,
    //后续在bs.init方法里配置baseDir可以设定查找路径，新增src,public,文件变化后可以去src目录下获取，这样可以优化编译速度
    watch([
        'src/assets/images/**',
        'src/assets/fonts/**',
        'public/**'], bs.reload);
    bs.init({
        port: 3000,
        server: {
            baseDir: ['dist','src','public']
        },
        routes: {
            '/node_modules': 'node_modules'
        }
    });
}

const compile = parallel(styles, scripts, page);
//并行任务
const build = series(
    clean, 
    parallel(
        series(compile,useref),
        font, 
        image, 
        extra)
);
const dev = series(compile,serve)

module.exports = {
    clean,
    build,
    dev
}
