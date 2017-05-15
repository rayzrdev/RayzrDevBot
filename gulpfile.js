const gulp = require('gulp');
const eslint = require('gulp-eslint');
const spawn = require('child_process').spawn;
const project = require('./package.json');

let bot;

function killBot() {
    if (bot) bot.kill();
}

const paths = {
    srcFiles: 'src/**/!(_)*.js',
    configs: 'src/**/!(_)*.json',
    lessons: 'lessons/**/!(_)lesson-*.json'
};

gulp.task('lint', () => {
    gulp.src(paths.srcFiles)
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('main', ['lint'], () => {
    killBot();

    bot = spawn('node', ['--harmony', project.main], { 'stdio': 'inherit' });
    bot.on('close', code => {
        if (code === 42) {
            console.log('Restart code detected, rebooting...');
            gulp.task('main');
        }
    });
});

gulp.task('watch', () => {
    gulp.watch([
        paths.srcFiles,
        paths.configs,
        paths.lessons
    ], ['main']);
});

gulp.task('default', ['main', 'watch']);

process.on('exit', killBot);