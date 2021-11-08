import gulp from 'gulp';
import inlinesource from 'gulp-inline-source';
import replace from 'gulp-replace';

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
        '<div id="app"></div>',
        '<div id="app"></div> <script src="./index.js" inline></script>'
      )
    )
    .pipe(replace('.css">', '.css" inline>'))
    .pipe(
      inlinesource({
        compress: false,
        ignore: ['png']
      })
    )
    .pipe(gulp.dest('../../desktop/launcher/dist/main/app/svp'))
);
