#!/usr/bin/env node
// 生成脚手架
const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const ejs = require('ejs');

inquirer.prompt([
    {
        type: 'input',
        message: '你要新建的应用名称是？',
        name: 'name',
        default: "express-front"
    },
    {
        type: 'input',
        message: '作者名称是？',
        name: 'userName',
        default: "q9_team"
    },
    {
        type: 'input',
        message: '项目版本是？',
        name: 'version',
        default: "1.1.0"
    }
]).then(answers => {
    console.log('-------****answers*****---------'+JSON.stringify(answers, null, '  '));
    // Use user feedback for... whatever!!
    const tempDir = path.join(__dirname, 'temp');
    const distDir = process.cwd();
    rewriteFile(tempDir, distDir, answers);
})

function rewriteFile(tempDir, distDir, answers){
    //读取模板目录下所有文件
    fs.readdir(tempDir, 'utf8', (err, files) => {
        console.log('----------files------------'+files);
        files.forEach(function (file, index) {
            var stats = fs.statSync(tempDir + '/' + file);
            // console.log('-------****index*****---------'+index+'stats.isFile()结果'+stats.isFile())
            if(stats.isFile()){
                ejs.renderFile(path.join(tempDir, file), answers, function(err, result) {
                    // if (err) {throw err}
                    console.log('-----------目标文件------------'+path.join(distDir, file));
                    fs.writeFileSync(path.join(distDir,file), result);
                });
            }else if(stats.isDirectory()){
                fs.mkdir(path.join(distDir,file),function(err) {
                    if (err) {
                        console.log('----------新建目录失败------------'+err);
                    }
                    //目录新建完成后再次递归遍历该目录下的文件和目录
                    rewriteFile(path.join(tempDir,file),path.join(distDir,file),answers);
                    console.log('----------初始化完成------------');
                 });
            }
            
        })
        
    })
}