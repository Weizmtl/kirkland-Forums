<template>
  <div class="editor-html">
    <Toolbar
        style="border-bottom: 1px solid #ccc"
        :editor="editorRef"
        :defaultConfig="toolbarConfig"
        :mode="mode"
    />
    <Editor
        :style="{ height: height + 'px', 'overflow-y': 'hidden' }"
        :model-value="modelValue"
        :defaultConfig="editorConfig"
        :mode="mode"
        @onCreated="handleCreated"
        @onChange="onChange"
    />
  </div>
</template>
<script setup>
import "@wangeditor/editor/dist/css/style.css"; // import css
import { onBeforeUnmount, ref, shallowRef } from "vue";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import { getCurrentInstance } from "vue";
import { useStore } from "vuex";
const store = useStore();
const { proxy } = getCurrentInstance();

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  height: {
    type: Number,
    default: 500,
  },
});

const mode = ref("default");
const editorRef = shallowRef();

const toolbarConfig = {
  excludeKeys: [
    "uploadVideo",
  ],
};
</script>



<style scoped lang="scss">

</style>