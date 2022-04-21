<template>
  <div class="main-page">
    <div class="left-menu" @click.self="onEditNoteEnd">
      <!-- ノートリスト -->
      <NoteItem
        v-for="note in noteList"
        :note="note"
        :key="note.id"
        @delete="deleteNote"
        @edit-end="onEditNoteEnd"
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
    };
  },
  methods: {
    addNote() {
      this.noteList.push({
        id: new Date().getTime().toString(16),
        name: "新規ノート",
      });
    },
    deleteNote(note) {
      const index = this.noteList.indexOf(note);
      this.noteList.splice(index, 1);
    },
    onEditNoteEnd(...args) {
      const [note, editedNote] = args;
      const index = this.noteList.indexOf(note);
      // リアクティブに配列を更新
      this.noteList[index] = Object.assign({}, editedNote);
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
