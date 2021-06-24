[TOC]

## 分支
**Git 的分支，其实本质上仅仅是指向提交对象(commit object)的可变指针**

```
A<---B<---C<----D
     ^          ^
     |          |
  branch      master
```

### 基本概念

Git 历史记录中有三种对象：
- `blob `对象 - 保存着文件快照
- `tree` 对象 - 记录着目录结构和 blob 对象索引
- `commit`对象 - 会包含一个指向暂存内容快照的指针（前述树对象的指针和所有提交信息），还包含了作者的姓名和邮箱、提交时输入的信息以及指向它的父对象的指针。首次提交产生的提交对象没有父对象，普通提交操作产生的提交对象有一个父对象， 而由多个分支合并产生的提交对象有多个父对象

#### HEAD
它是一个指针，指向当前所在的本地分支

### 基本命令

#### 创建分支
```
git branch <branchname>
```

#### 合并分支
```
git merge <branch>
```

#### 删除分支
```
git branch -d <branch>
```

### 查看分支记录

#### 查看分支列表
```
git branch
```

#### 查看分支提交记录
```
git branch -v
```

#### 查看已经合并到当前分支的分支
```
git branch --merged
```

#### 查看已经尚未合并到当前分支的分支
```
git branch --no-merged
```

#### 查看分支分叉情况
```
git log --oneline --decorate --graph --all
```

### 远程分支

#### 查看远程引用的分支列表
```
git ls-remote <remote>

git remote show <remote> 
```

#### 创建远程分支
```
git clone -o <remote> <remoteUrl>

git remote add <remote> <remoteUrl>
git fetch <remote>
```

#### 移除远程分支
```
git remote remove origin
```

#### 远程分支同步数据
```
git fetch <remote>
```

`git fetch` 和 `git pull` 区别：
- 当 `git fetch` 命令从服务器上抓取本地没有的数据时，它并不会修改工作目录中的内容。 它只会获取数据然后让你自己合并。
- `git pull` 在大多数情况下它的含义是一个 `git fetch` 紧接着一个 `git merge` 命令。
- 如果是一个远程分支，`git pull`都会查找当前分支所跟踪的服务器与分支， 从服务器上抓取数据然后尝试合并入那个远程分支。

#### 远程分支推送数据
```
git push <remote> <localBranch:originBranch>
```

#### 创建远程分支对应的本地分支
```
git checkout -b localBranch origin/originBranch
```

#### 合并到当前分支
```
git merge origin/originBranch
```

#### 创建跟踪分支
从一个远程跟踪分支检出一个本地分支会自动创建所谓的“跟踪分支”（它跟踪的分支叫做“上游分支”）。 跟踪分支是与远程分支有直接关系的本地分支。 如果在一个跟踪分支上输入 git pull，Git 能自动地识别去哪个服务器上抓取、合并到哪个分支。

```
git checkout -b <branch> <remote>/<branch>
git checkout --track <remote>/<branch>
git checkout <branch> (branch 只存在于远程分支上)
```

#### 当前本地分支 跟踪远程分支
```
git branch -u <origin>/<branch>
git branch --set-upstream-to <origin>/<branch>
```

#### 查看跟踪分支
```
git branch -vv
```

#### 同步所有远程仓库
```
git fetch --all; git branch -vv
```

#### 删除服务器上的分支
```
git push origin --delete serverfix
```

### 变基（rebase）
rebase 命令将提交到某一分支上的所有修改都移至另一分支上，就好像“重新播放”一样。

假设有以下历史记录，当前分支是 `topic`:
```
      A---B---C topic
     /
D---E---F---G master
```

运行以下命令：
```
git rebase master
或者
git rebase master topic
```

将会：
```
              A'--B'--C' topic
             /
D---E---F---G master
```

_ _ _


`--onto` 选项使用部分分支进行rebase，示例：
```
                        H---I---J topicB
                       /
              E---F---G---K  topicA
             /
A---B---C---D  master
```
运行以下命令：
```
git rebase --onto master topicA topicB
```
将会：
```
             H'--I'--J'  topicB
            /
            | E---F---G---K  topicA
            |/
A---B---C---D  master
```

## 服务器 git

### 在服务器上搭建 SSH Git

SSH Git 服务搭建的全部 —— 只要在服务器上加入可以用 SSH 登录的帐号，然后把裸仓库放在大家都有读写权限的地方。

1. 现有仓库导出为裸仓库
      ```
      git clone --bare my_project my_project.git

      // 或者创建裸仓库

      git init --bare
      ```
2. 把裸仓库放到服务器上

      假设一个域名为 git.example.com 的服务器已经架设好，并可以通过 SSH 连接， 你想把所有的 Git 仓库放在 /srv/git 目录下。

      ```
      // 将本地仓库复制到服务器
      scp -r my_project.git user@git.example.com:/srv/git
      ```
      此时，其他可通过 SSH 读取此服务器上 /srv/git 目录的用户，可运行以下命令来克隆你的仓库。
      ```
      git clone user@git.example.com:/srv/git/my_project.git
      ```
      如果一个用户，通过使用 SSH 连接到一个服务器，并且其对 /srv/git/my_project.git 目录拥有可写权限，那么他将自动拥有推送权限。

3. SSH连接下的用户权限管理

      架设 Git 服务最复杂的地方在于用户管理。 如果需要仓库对特定的用户可读，而给另一部分用户读写权限，那么访问和许可安排就会比较困难。

      如果你有一台所有开发者都可以用 SSH 连接的服务器，架设你的第一个仓库就十分简单了。 如果你想在你的仓库上设置更复杂的访问控制权限，只要使用服务器操作系统的普通的文件系统权限就行了。

      为每个用户提供访问权限的几种方法：
      - 就是给团队里的每个人创建账号，这种方法很直接但也很麻烦。 或许你不会想要为每个人运行一次 adduser（或者 useradd）并且设置临时密码。
      - 设置 SSH 通过密钥登录。在主机上建立一个 git 账户，让每个需要写权限的人发送一个 SSH 公钥， 然后将其加入 git 账户的 ~/.ssh/authorized_keys 文件。 这样一来，所有人都将通过 git 账户访问主机。 这一点也不会影响提交的数据——访问主机用的身份不会影响提交对象的提交者信息。
      - 让 SSH 服务器通过某个 LDAP 服务，或者其他已经设定好的集中授权机制，来进行授权。 只要每个用户可以获得主机的 shell 访问权限，任何 SSH 授权机制你都可视为是有效的。


