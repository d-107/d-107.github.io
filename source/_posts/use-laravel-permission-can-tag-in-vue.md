---
title: 在vue中使用laravel-permission的@can标签
date: 2019-08-02 10:24:00
tags: [vue, laravel]
categories: laravel
---

#### 1. 在需要权限校验的 model 中新增方法
```php
public function getAllPermissionsAttribute() {
	$permissions = $this->getAllPermissions();
  $permission_names = [];

  collect($permissions)->map(function ($permission) use (&$permission_names) {
      $permission_names[] = $permission->name;
  });

  return $permission_names;
}
```

#### 2. 在 app.blade 中存储当前用户的所有权限
```html
<script>
    @auth
        window.Permissions = @json(Auth::user()->allPermissions);
    @else
        window.Permissions = [];
    @endauth
</script>
```
#### 3. 新建 vue component
```vue
<script>
    export default {
        methods: {
            $can(permissionName) {
                return Permissions.indexOf(permissionName) !== -1;
            }
        }
    };
</script>
```

#### 4.  在 app.js 注册 vue 组件
```
import auth from './components/AuthComponent';\
Vue.mixin(auth);
```

#### 5. 在vue中使用
```
 <a v-if="$can('admin.admins.delete')" class="text-danger" @click="dataDelete(admin)">
 ```
