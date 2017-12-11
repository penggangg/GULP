var gulp=require('gulp');
var babel = require('gulp-babel');
var uglify=require('gulp-uglify');
var minifyCSS=require('gulp-minify-css');
var browserSync = require('browser-sync').create();
var debug = require('gulp-debug');
//版本号的插件
var rev = require('gulp-rev');
var imagemin = require('gulp-imagemin');
var assetRev = require('gulp-asset-rev');
var revCollector = require('gulp-rev-collector');
var runSequence = require('run-sequence');
gulp.task('jsAll',function(){
    gulp.src('view/static/jsAll/*.js')
    .pipe(babel({
        presets: ['es2015']
    }))
    .pipe(uglify())
    .pipe(gulp.dest('view/static/js'))
});
gulp.task('css', function () {
	gulp.src('view/static/cssAll/*.css')
	.pipe(minifyCSS())
	.pipe(gulp.dest('view/static/css'))
})
gulp.task('browser-sync', function () {
    gulp.watch(['view/static/cssAll/*.css']).on('change',function(files){
        // 1. 找到文件
        gulp.src(files.path)
        // 2. 压缩文件
        .pipe(minifyCSS())
        // 3. 另存为压缩文件
        .pipe(debug({title: '编译css:'}))
        .pipe(gulp.dest('view/static/css'))
    });
    gulp.watch(['view/static/jsAll/*.js']).on('change',function(files){
        // 1. 找到文件
        gulp.src(files.path)
        // 2. 压缩文件
        .pipe(uglify())
        // 3. 另存为压缩文件
        .pipe(debug({title: '编译js:'}))
        .pipe(gulp.dest('view/static/js'))
    });
    browserSync.init({
       files:['**'],
        // server:{
        //     baseDir:'./',  // 设置服务器的根目录
        //     index:'index.html' // 指定默认打开的文件
        // },
       proxy:'www.lzhnew.cn', // 设置本地服务器的地址
       port:8015  // 指定访问服务器的端口号
    });
});


//添加版本号
//定义css、js源文件路径
var cssSrc = 'view/static/cssAll/*.css';
var jsUrl= 'view/static/cssAll/*.js';
//为css中引入的图片/字体等添加hash编码
// gulp.task('assetRev', function(){
//   return gulp.src(cssSrc)  //该任务针对的文件
//    .pipe(assetRev()) //该任务调用的模块
//    .pipe(gulp.dest('src/css')); //编译后的路径
// });
//为css中引入的图片/字体等添加hash编码
// gulp.task('assetRev', function(){
//     return gulp.src(cssSrc)   //该任务针对的文件
//       .pipe(assetRev())  //该任务调用的模块
//       .pipe(gulp.dest('src/css')); //编译后的路径
// });
//CSS生成文件hash编码并生成 rev-manifest.json文件名对照映射
gulp.task('revCss', function(){
  return gulp.src(cssSrc)
    .pipe(rev())
    .pipe(rev.manifest())
    .pipe(gulp.dest('rev/css'));
});
//js生成文件hash编码并生成 rev-manifest.json文件名对照映射
gulp.task('revJs', function(){    
    return gulp.src(jsUrl)        
    .pipe(rev())        
    .pipe(rev.manifest())        
    .pipe(gulp.dest('rev/js'));
    });

//压缩image
gulp.task('imageMin', function () {
    gulp.src('view/static/imgAll/*.{png,jpg,gif,ico}')
        .pipe(imagemin({
            optimizationLevel: 7, //类型：Number  默认：3  取值范围：0-7（优化等级）
            progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
            interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
            multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
        }))
        .pipe(gulp.dest('view/static/img'));
});
gulp.task('revImage', function(){
    return gulp.src('view/static/img/*.{png,jpg,gif,ico}')
        .pipe(rev())
        .pipe(rev.manifest())    //必须有这个方法
        .pipe(gulp.dest('rev/img'));
});
//Html替换css、js文件版本
gulp.task('revHtml', function () {
  return gulp.src(['rev/**/*.json', 'view/page/*.html'])
    .pipe(revCollector())
    .pipe(gulp.dest('view/default'));
});
//开发构建 每次发版之前执行一次即可
gulp.task('default', function (done) {
  condition = false;
  runSequence(    //需要说明的是，用gulp.run也可以实现以上所有任务的执行，只是gulp.run是最大限度的并行执行这些任务，而在添加版本号时需要串行执行（顺序执行）这些任务，故使用了runSequence.
    // ['assetRev'],
    ['revCss'],
    ['revJs'],
    ['imageMin'],
    //['revImage'],
    ['revHtml'],
    done);
});
