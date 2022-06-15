// #!/usr/bin/env zx

// 复制目录下排除某个文件或文件夹外的所有文件
// await $`cp ls | grep main.js|node_modules|js /js`

const fs = require("fs");
const path = require("path");

//两个绝对路径

// const prePath = process.argv[2];
// const nextPath = process.argv[3];

function readPre(prePath, nextPath) {
  fs.readdir(prePath, { encoding: "utf-8" }, (err, files) => {
    for (let file of files) {
      //给出每一个文件的绝对路径
      let dirPath = path.resolve(prePath, file);
      console.log(dirPath);
      //检测文件是文件夹还是文件
      let flag = fs.statSync(dirPath);
      //如果为文件
      if (flag.isFile()) {
        fs.copyFileSync(dirPath, path.resolve(nextPath, file));
        //如果为文件夹
      } else if (flag.isDirectory()) {
        fs.mkdirSync(path.resolve(nextPath, file));
        readPre(path.resolve(prePath, file), path.resolve(nextPath, file));
      }
      console.log(flag);
    }
  });
}

readPre("./main.js", "./js");
