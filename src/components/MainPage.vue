<template>
  <div class="main-page">
    <!-- 左メニュー -->
    <div class="left-menu">
      <!-- 保存ボタン -->
      <button class="transparent" @click="onClickButtonSave">
        <font-awesome-icon icon="save" /> 保存
      </button>

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
        <!-- パス -->
        <div class="path">
          <small>{{ selectedPath }}</small>
        </div>
        <!-- コンテンツ -->
        <div class="note-content">
          <h3 class="note-title">{{ selectedNote.name }}</h3>
          <draggable
            v-model="selectedNote.widgetList"
            item-key="id"
            :animation="300"
            :delay="0"
            group="widgets"
          >
            <template #item="{ element }">
              <WidgetItem
                :key="element.id"
                :widget="element"
                :layer="1"
                @input="onInputWidget"
                @delete="onDeleteWidget"
                @add-child="onAddChildWidget"
                @add-brother="onAddBrotherWidget"
                @change-type="onChangeWidgetType"
              />
            </template>
          </draggable>
          <!-- ウィジェット追加ボタン -->
          <button class="transparent" @click="onClickButtonAddWidget">
            <font-awesome-icon icon="plus-square" />
            ウィジェット追加
          </button>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import NoteItem from "@/components/parts/NoteItem.vue";
import WidgetItem from "@/components/parts/WidgetItem.vue";
import draggable from "vuedraggable";
export default {
  components: { NoteItem, WidgetItem, draggable },
  data() {
    return {
      noteList: [],
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
          // IF:目的のnoteが見つかればカレントパスを返す
          if (note.id === this.selectedNote.id) return currentPath;
          // ELSE:見つからなければchildrenで再帰的に検索
          const selectedPath = searchSelectedPath(note.children, currentPath);
          // IF:見つかれば結果を返す
          if (selectedPath) return selectedPath;
        }
        // 再起的に検索しても見つからない場合、falseを返す
        return false;
      };
      // 実行
      return searchSelectedPath(this.noteList);
    },
  },
  methods: {
    // 【NOTE】
    onSelectNote(note) {
      this.selectedNote = note;
    },
    // ノート追加の共通メソッド
    addNote(targetList, layer, index) {
      layer = layer || 1;
      const note = {
        id: new Date().getTime().toString(16),
        name: `新規ノート-${layer}-${targetList.length + 1}`,
        children: [],
        layer: layer,
        widgetList: [],
      };
      // ウィジェットリストを追加
      this.addWidget(note.widgetList);
      // 挿入位置の条件分岐
      if (index == null) {
        targetList.push(note);
      } else {
        targetList.splice(index + 1, 0, note);
      }

      // 追加したノートを選択
      this.onSelectNote(note);
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
      const parentExists = !(parentNote == null);

      const targetList = parentExists ? parentNote.children : this.noteList;
      const layer = parentExists ? parentNote.layer : 1;
      const index = targetList.indexOf(childNote);
      this.addNote(targetList, layer, index);
    },
    onDeleteNote(parentNote, note) {
      // 親noteがある場合、childrenの配列を指定
      const parentExists = !(parentNote == null);

      const targetNoteList = parentExists ? parentNote.children : this.noteList;
      const index = targetNoteList.indexOf(note);
      targetNoteList.splice(index, 1);

      // 削除したノートが選択中なら、選択を解除
      if (this.selectedNote === note) this.selectedNote = null;
    },
    onEditName(...args) {
      const [parentNote, note, editedNote] = args;
      const parentExists = !(parentNote == null);

      const targetNoteList = parentExists ? parentNote.children : this.noteList;
      const index = targetNoteList.indexOf(note);

      const targetNote = targetNoteList[index];
      targetNote.name = editedNote.name;

      // 選択中のノートならselectedNoteを更新
      if (this.selectedNote === note) {
        this.onSelectNote(targetNote);
      }
    },
    // 【WIDGET】
    onInputWidget(text, widget) {
      widget.text = text;
    },
    onChangeWidgetType(type, widget) {
      widget.type = type;
    },
    addWidget(targetList, layer, index) {
      layer = layer || 1;
      const widget = {
        id: new Date().getTime().toString(16),
        type: layer === 1 ? "heading" : "list",
        text: "",
        children: [],
        layer: layer,
      };
      // 挿入位置の条件分岐
      if (index == null) {
        targetList.push(widget);
      } else {
        targetList.splice(index + 1, 0, widget);
      }
    },
    onClickButtonAddWidget() {
      this.addWidget(this.selectedNote.widgetList);
    },
    onAddChildWidget(widget) {
      this.addWidget(widget.children, widget.layer + 1);
    },
    onAddBrotherWidget(parentWidget, widget) {
      const parentExists = !(parentWidget == null);

      const targetList = parentExists ? parentWidget.children : this.selectedNote.widgetList;
      const layer = parentExists ? parentWidget.layer + 1 : null;
      const index = targetList.indexOf(widget);
      this.addWidget(targetList, layer, index);
    },
    onDeleteWidget(parentWidget, widget) {
      const parentExists = !(parentWidget == null);

      const targetList = parentExists ? parentWidget.children : this.selectedNote.widgetList;
      const index = targetList.indexOf(widget);
      targetList.splice(index, 1);

      // 削除した場合、1つ前のウィジェットを選択状態にする
      const focusWidget = index === 0 ? parentWidget : targetList[index - 1];
      if (focusWidget != null) {
        // IDを作り直すことで、mounted関数でfocusWidget関数を呼び出す
        focusWidget.id = (parseInt(focusWidget.id, 16) + 1).toString(16);
      }
    },
    // ローカルストレージ
    loadDataFromLocalStorage() {
      const localData = localStorage.getItem("noteItem");
      if (localData != null) {
        this.noteList = JSON.parse(localData);
      }
    },
    onClickButtonSave() {
      this.saveDataToLocalStorage();
    },
    saveDataToLocalStorage() {
      localStorage.setItem("noteItem", JSON.stringify(this.noteList));
      this.$toast.show("保存しました", {
        type: "success",
        position: "top-left",
        duration: 1000,
      });
    },
  },
  created() {
    this.loadDataFromLocalStorage();
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
