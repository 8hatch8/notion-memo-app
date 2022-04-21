<template>
  <div class="main-page">
    <div class="left-menu" @click.self="onEditNoteEnd">
      <!-- ノートリスト -->
      <NoteItem
        v-for="note in noteList"
        :note="note"
        :key="note.id"
        @delete="onDeleteNote"
        @edit-end="onEditNoteEnd"
        @add-child="onAddChildNote"
      />
      <!-- ノート追加ボタン -->
      <button class="transparent" @click="addNote">
        <font-awesome-icon icon="plus-square" />ノートを追加
      </button>
    </div>
    <div class="right-view">右ビュー</div>
  </div>
</template>

<script>
import NoteItem from "@/components/parts/NoteItem.vue";
export default {
  components: { NoteItem },
  data() {
    return {
      noteList: [],
      children: [],
    };
  },
  methods: {
    addNote() {
      this.noteList.push({
        id: new Date().getTime().toString(16),
        name: "新規ノート",
        children: [],
      });
    },
    onDeleteNote(parentNote, note) {
      // 親noteがある場合、childrenの配列を指定
      const targetNoteList = parentNote == null ? this.noteList : parentNote.children;
      const index = targetNoteList.indexOf(note);
      targetNoteList.splice(index, 1);
    },
    onEditNoteEnd(...args) {
      const [parentNote, note, editedNote] = args;
      const targetNoteList = parentNote == null ? this.noteList : parentNote.children;
      const index = targetNoteList.indexOf(note);
      // リアクティブに配列を更新
      targetNoteList[index] = Object.assign({}, editedNote);
    },
    onAddChildNote(parentNote) {
      parentNote.children.push({
        id: new Date().getTime().toString(16),
        name: "_新規ノート",
        children: [],
      });
    },
  },
};
</script>

<style scoped lang="scss">
.main-page {
  display: flex;
  height: calc(100vh - 60px);
  .left-menu {
    width: 350px;
    background-color: #f7f6f3;
  }
  .right-view {
    flex-grow: 1;
    padding: 10px;
    background-color: pink;
  }
}
</style>
