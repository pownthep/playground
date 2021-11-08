const gulp = require('gulp');
const inlinesource = require('gulp-inline-source');
const replace = require('gulp-replace');

gulp.task('default', () =>
  gulp
    .src('./dist/index.html')
    .pipe(
      replace(
        '<script type="module" crossorigin src="./index.js"></script>',
        ''
      )
    )
    .pipe(
      replace(
        '<div id="root"></div>',
        '<div id="root"></div> <script src="./index.js" inline></script>'
      )
    )
    .pipe(replace('.css">', '.css" inline>'))
    .pipe(
      inlinesource({
        compress: false,
        ignore: ['png']
      })
    )
    .pipe(gulp.dest('../../desktop/launcher/dist/main/app/launcher-ui'))
);
