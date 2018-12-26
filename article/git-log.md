# Git LOG

+ https://git-scm.com/docs/git-log#_pretty_formats
+ https://git-scm.com/docs/pretty-formats

```bash
git log --pretty=format:"%h - %an, %ar : %s"
```
``` text
ca82a6d - Scott Chacon, 6 years ago : changed the version number
085bb3b - Scott Chacon, 6 years ago : removed unnecessary test
a11bef0 - Scott Chacon, 6 years ago : first commit
```

### `git log --pretty=format` 常用的选项
%   | 说明 
--- | ---
%H  | 提交对象（commit）的完整哈希字串
%h  | 提交对象的简短哈希字串
%T  | 树对象（tree）的完整哈希字串
%t  | 树对象的简短哈希字串
%P  | 父对象（parent）的完整哈希字串
%p  | 父对象的简短哈希字串
%s  | 提交说明
%an | 作者（author）的名字
%ae | 作者的电子邮件地址
%ad | 作者修订日期（可以用 --date= 选项定制格式）
%ar | 作者修订日期，按多久以前的方式显示
%ai | 作者修订日期，ISO 8601 格式
%cn | 提交者（committer）的名字
%ce | 提交者的电子邮件地址
%cd | 提交日期
%cr | 提交日期，按多久以前的方式显示
%ci | 提交日期，ISO 8601 格式


### 控制输出宽度

+ `%<(N, trunc)`  左对齐，下一个单元的输出宽度限制为 N 列
+ `%<|(N, trunc)` 左对齐，下一个单元输出至全局第 N 列

%   | 对齐
--- | ---
%<  | 左对齐
%>  | 右对齐
`%<|`  | 左对齐
`%>|`  | 右对齐
%>> | 右对齐(如果左边有多余空格则复用)
%>< | 居中对齐


```bash
# 其中 %0x08即\b, 为了把截断产生的"."删除
git log --pretty=format:'%C(blue)%h%Creset -%C(yellow)%d%Creset %s %C(green)(%cr)%Creset' --abbrev-commit --date=relative
git log --pretty=format:'%C(blue)%h%Creset %<(40,trunc)%s [%C(green)%<(21,trunc)%ai%x08%x08%Creset %C(red)%an%Creset%C(yellow)%d%Creset]'
git log --pretty=format:'%C(blue)%h%Creset %<(60,trunc)%s [%C(green)%<(21,trunc)%ci%x08%x08%Creset %C(red)%>(10,trunc)%an%Creset%C(yellow)%d%Creset]'
```
