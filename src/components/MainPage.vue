<template>
  <div class="main-page">
    <!-- 左メニュー -->
    <div class="left-menu">
      <!-- ノートリスト -->
      <draggable v-model="noteList" item-key="id" group="notes" :animation="300" :delay="5">
        <template #item="{ element }">
          <NoteItem
            :note="element"
            :key="element.id"
            :layer="1"
            :selectedNote="selectedNote"
            @select="onSelectNote"
            @delete="onDeleteNote"
            @edit-name="onEditName"
            @add-child="onAddChildNote"
            @add-brother="onAddBrotherNote"
          />
        </template>
      </draggable>
      <!-- ノート追加ボタン -->
      <button class="transparent" @click="onClickAddNote">
        <font-awesome-icon icon="plus-square" />ノートを追加
      </button>
    </div>
    <!-- 右ビュー -->
    <div class="right-view">
      <template v-if="selectedNote == null">
        <div class="no-selected-note">ノートを選択してください</div>
      </template>
      <template v-else>
        <div class="path">
          <small>{{ selectedPath }}</small>
        </div>
        <div class="note-content">
          <h3 class="note-title">{{ selectedNote.name }}</h3>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import NoteItem from "@/components/parts/NoteItem.vue";
import draggable from "vuedraggable";
export default {
  components: { NoteItem, draggable },
  data() {
    return {
      noteList: [
        {
          id: 0,
          name: "はじめに",
          layer: 1,
          children: [],
        },
      ],
      selectedNote: null,
    };
  },
  computed: {
    selectedPath() {
      // 検索メソッドの定義
      const searchSelectedPath = (noteList, path) => {
        for (let note of noteList) {
          // 引数pathがあればカレントパスに追加
          const currentPath = path == null ? note.name : `${path} / ${note.name}`;
          // 目的のnoteが見つかればカレントパスを返す
          if (note.id === this.selectedNote.id) return currentPath;

          // 見つからなければchildrenで再帰的に検索
          const selectedPath = searchSelectedPath(note.children, currentPath);
          // 見つかれば結果を返す
          if (selectedPath) return selectedPath;
        }
        // 再起的に検索しても見つからない場合
        return false;
      };
      // 実行
      return searchSelectedPath(this.noteList);
    },
  },
  methods: {
    onSelectNote(note) {
      this.selectedNote = note;
    },
    addNote(targetList, layer, index) {
      layer = layer || 1;
      const note = {
        id: new Date().getTime().toString(16),
        name: `新規ノート-${layer}-${targetList.length + 1}`,
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
    onEditName(...args) {
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
    .no-selected-note {
      text-align: center;
      font-size: 25px;
      margin: 20px;
    }
    .path {
      text-align: left;
      margin-bottom: 50px;
    }
    .note-content {
      max-width: 900px;
      margin: 0 auto;
      text-align: left;
      .note-title {
        margin-bottom: 25px;
      }
    }
  }
}
</style>
