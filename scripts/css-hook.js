import path from 'path';
import hook from 'css-modules-require-hook';

hook({
    generateScopedName: '[hash:base64:5]',
    rootDir: path.resolve('src'),
});
