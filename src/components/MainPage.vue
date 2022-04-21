<template>
  <div class="main-page">
    <div class="left-menu">
      <!-- ノートリスト -->
      <NoteItem
        v-for="note in noteList"
        :note="note"
        :key="note.id"
        :layer="1"
        @delete="onDeleteNote"
        @edit-end="onEditNoteEnd"
        @add-child="onAddChildNote"
        @add-brother="onAddBrotherNote"
      />
      <!-- ノート追加ボタン -->
      <button class="transparent" @click="onClickAddNote">
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
    // TODO左ビューを選ぶとエラーがでる
    addNote(targetList, layer, index) {
      layer = layer || 1;
      const note = {
        id: new Date().getTime().toString(16),
        name: "新規ノート",
        children: [],
        layer: layer,
      };
      if (index == null) {
        targetList.push(note);
      } else {
        targetList.splice(index + 1, 0, note);
      }
    },
    // 新規追加
    onClickAddNote() {
      this.addNote(this.noteList);
    },
    // 子を新規追加
    onAddChildNote(parentNote) {
      this.addNote(parentNote.children, parentNote.layer + 1);
    },
    // 後ろに新規追加
    onAddBrotherNote(parentNote, childNote) {
      const targetList = parentNote == null ? this.noteList : parentNote.children;
      const layer = parentNote == null ? 1 : parentNote.layer;
      const index = targetList.indexOf(childNote);
      this.addNote(targetList, layer, index);
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
