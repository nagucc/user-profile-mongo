# user-profile-mongo
使用MongoDB保存用户数据

## 安装

`npm install user-profile-mongo`

## Profile 结构
```

{
	crendential: {...}, 	// 记录用户的唯一标识信息，例如userid等
	data:{...}				// 保存用户数据
}

```

## 示例

```
var Profile = require('../models/profile')('your db conn', 'collection_name'); // colllection_name默认为'profiles'

// 插入新用户：
Profile.updateUser(null, profile, callback);

// 更新已有用户数据：
Profile.updateUser(id, profile, callback);

// 获取用户数据：
Profile.getUser(userCrendential, callback);

```