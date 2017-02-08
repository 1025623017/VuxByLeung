<template>
	<div>



		<x-header :left-options="{showBack: false}">入驻友福诚商</x-header>
    <br>
    <div style="text-align: center;">
      友福诚商入驻申请已提交成功
      <div>
        <b style="color: red;">请等待审核</b>
      </div>
    </div>
    <br>
		<group title="您还可以">
    </group>
    <box gap="10px 10px">
      <x-button plain type="primary" v-link="{ path: '/steps' }">返回修改信息</x-button>
      <x-button type="primary" v-link="{ path: '/dashboard' }">进入商家管理平台</x-button>
    </box>



	</div>
</template>

<script>
import { XInput, GroupTitle, Group, XButton, Cell, Divider, XHeader, Box } from 'vux/src/components'
export default {
  components: {
    XHeader,
    Divider,
    XInput,
    Group,
    XButton,
    Cell,
    GroupTitle,
    Box
  }
}
</script>
