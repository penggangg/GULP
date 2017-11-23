
<!-- 根据配置 安装相应的依赖 -->
1.npm install
<!-- 如想给引入的文件添加版本号 则需要修改文件 -->
① 在node_modules 目录下 找到gulp-rev 目录
在该目录下 找到index.js
134行的  manifest[originalFile] = revisionedFile;
替换成 manifest[originalFile] = originalFile+'?v='+ file.revHash;
② 在 gulp-rev 目录下的 在node_modules目录下 找到 rev-path目录 
在该目录下的index.js文件中
10行的 全部替换成 
return modifyFilename(pth, function (filename, ext) {
    // return filename + '-' + hash + ext;
    return filename + ext;
});
③在在node_modules目录下 找到  gulp-rev-collector 目录
在该目录下 找到index.js
将40-47行 
// let cleanReplacement =  path.basename(json[key]).replace(new RegExp( opts.revSuffix ), '' );
// if (!~[
//         path.basename(key),
//         _mapExtnames(path.basename(key), opts)
//     ].indexOf(cleanReplacement)
// ) {
//     isRev = 0;
// }
注释掉 替换成
 if ( path.basename(json[key]).split('?')[0] !== path.basename(key) ) {
    isRev=0;
}
 然后在141行 regexp: new RegExp(  dirRule.dirRX + pattern, 'g' ) 替换成
  regexp: new RegExp(  dirRule.dirRX + pattern+'(\\?v=\\w{10})?', 'g' ),
