 var gulp = require('gulp');
 var browserSync = require('browser-sync');
  var sass = require('gulp-sass');
var del = require('del');
var imagemin = require('gulp-imagemin');
 var uglify  = require('gulp-uglify');
 var usemin = require('gulp-usemin');
 var rev = require('gulp-rev');
 var cleanCss=require('gulp-clean-css');
 var flatmap=require('gulp-flatmap');
 var htmlmin = require('gulp-htmlmin');

gulp.task('sass',function(){
  gulp.src('./css/*scss')
  .pipe(sass().on('error', sass.logError))
  .pipe(gulp.dest('./css'));
})
gulp.task('sass:watch',function(){
   gulp.watch('./css/*scss',['sass'])
});

gulp.task('browser-sync',function(){
  var files = ['./*.html','./css/*.css','./images/*.{png,jpg,gif}','./js/*.js'];
browserSync.init(files,{
  server : {
    baseDir :'./'
  }
});
});

gulp.task('default',['browser-sync'],function(){
  gulp.start('sass:watch');
});

gulp.task('clean',function(){
  return del(['dist']);
});

gulp.task('copyfonts',function(){
  gulp.src('./node_modules/open-iconic/font/fonts/*.{ttf,woff,eof,svg,eot,otf}*')
  .pipe(gulp.dest('./dist/fonts'));
});

gulp.task('imagemin',function(){
  return gulp.src('./images/*.{{png,jpg,jpeg,gif}}')
  .pipe(imagemin({optimizationLevel : 3 ,progressive :  true,interlaced: true}))
  .pipe(gulp.dest('dist/images'));
});

gulp.task('usemin',function(){
  return gulp.src('./*.html')
  .pipe(flatmap(function(stream,file){
    return stream
    .pipe(usemin({
      css: [rev ()],
      html : [function(){return htmlmin({collapseWhitespace: true})}],
      js: [uglify(),rev()],
      inlinejs: [uglify()],
      inlinecss:[cleanCss(),'concat']
    }));
  }))
  .pipe(gulp.dest('dist/'))
})

gulp.task('build',['clean'],function(){
  gulp.start('copyfonts','imagemin','usemin','quux')
});
