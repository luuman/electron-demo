// 首先我们编写一个我们需要的.bat文件,代码如下,保存为startApp.bat
echo create softphone windows service

@rem 进入当前文件夹
cd /d %cd%

# 以下命令可根据你想要启动的应用程序所在位置的不同而调整
cd ../

# 获取当前所在根目录的路径
set rootPath=%cd%

# 设置启动程序的路径
set spPath=\xxxx\xxxx.exe
set rdPath = \xxxx\xxxx.exe

# 拼接完整路径地址
set test1Path=%rootPath%%spPath%
set test2Path=%rootPath%%rdPath%

# 查找该进程是否启动,若启动则结束该进程
tasklist | find /i "sublime.exe" && taskkill /F /im sublime.exe
tasklist | find /i "test.exe" && taskkill /F /im test.exe

# 启动进程 '-a': 启动进程的参数
start %test1Path% -a
start %test2Path% -a

echo start service

exit