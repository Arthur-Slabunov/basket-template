require('../../../gulp/gulp-init.js')({HTML: '.'});

const comb = require('../../../gulp/tasks/comb.js'),
  scss = require('../../../gulp/tasks/scss.js').scss,
  mincss = require('../../../gulp/tasks/mincss.js'),
  uglifyes = require('../../../gulp/tasks/uglify.js').uglifyes,
  { sync, syncInit } = require('../../../gulp/tasks/sync.js');

function watchFiles() {
  syncInit();
  watch($.PATH.scss.files, series(scss, mincss));
  watch([$.PATH.js.files, `!${$.PATH.js.filesMin}`], sync);
  watch($.PATH.html.files, sync);
}

task('combScss', comb);
task('sass', series(scss));
task('watch', watchFiles);
