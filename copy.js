var fs = require('fs');
var path = require('path');

const shell = require('electron').shell

utools.onPluginReady(() => {
  function fileDisplay(filePath, outPath) {
    //根据文件路径读取文件，返回文件列表
    // ENOENT: no such file or directory, scandir ''
    const arr = [];
    fs.readdir(filePath, function (err, files) {
      if (err) {
        console.warn(err)
      } else {
        for (let index = 0; index < files.length; index++) {
          const filename = files[index];
          //遍历读取到的文件列表
          //获取当前文件的绝对路径
          const filedir = path.join(filePath, filename);
          //根据文件路径获取文件信息，返回一个fs.Stats对象
          fs.stat(filedir, function (eror, stats) {
            if (eror) {
              console.warn('获取文件stats失败');
            } else {
              const isFile = stats.isFile();
              const isDir = stats.isDirectory();
              if (isFile) {
                const res = read(filedir, outPath);
                if (res) arr.push(res);
                throw res
              }
              if (isDir) {
                arr.push(fileDisplay(filedir, outPath));
              }
            }
          })
        }
      }
    });
    return arr;
  }

  function read(fPath, outPath) {
    var data = fs.readFileSync(fPath, "utf-8");
    return write(data, outPath)
  }

  function write(data, outPath) {
    fs.appendFile(`${outPath}/copyTxt.txt`, data, 'utf-8', function (err, ret) {
      if (err) {
        alert('复制失败')
        throw err
      }
      return true;
    })
  }

  window.fileCopy = (filePath, outPath) => {
    const identifier = fileDisplay(filePath, outPath);
    if (identifier) {
      shell.showItemInFolder(outPath);
      utools.showNotification('复制成功')
      console.log('success')
    }
  };
})