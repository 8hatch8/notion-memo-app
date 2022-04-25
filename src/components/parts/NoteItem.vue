<template>
  <div>
    <div class="note-family">
      <!-- 親ノート -->
      <div
        class="note"
        :class="{
          mouseover: mouseOver && !isEditing,
          selected: isSelectedNote,
        }"
        @click="onClickNote(note)"
        @mouseover="onMouseOver"
        @mouseleave="onMouseLeave"
      >
        <!-- name編集フォーム -->
        <template v-if="isEditing">
          <input
            v-model="name"
            ref="editBox"
            class="transparent pl-1 ml-2"
            onfocus="this.select()"
            @keypress.enter="onKeypressEnter"
            @blur="onEditEnd(parentNote, note)"
          />
        </template>

        <template v-else>
          <div class="note-icon">
            <font-awesome-icon :icon="mouseOverSwitchIcon" />
          </div>
          <div class="note-name">{{ name }}</div>
          <!-- 操作メニュー -->
          <div class="buttons" v-if="mouseOver">
            <!-- 子ノート追加 -->
            <div class="button-icon" v-if="shouldShowAddChild" @click.stop="onClickAddChild(note)">
              <font-awesome-icon icon="sitemap" />
            </div>
            <!-- 兄弟ノート追加 -->
            <div class="button-icon" @click.stop="onClickAddBrother(parentNote, note)">
              <font-awesome-icon icon="plus-circle" />
            </div>
            <!-- name編集 -->
            <div class="button-icon" @click.stop="onClickEdit">
              <font-awesome-icon icon="edit" />
            </div>
            <!-- ノート削除 -->
            <div class="button-icon" @click.stop="onClickDelete(parentNote, note)">
              <font-awesome-icon icon="trash" />
            </div>
          </div>
        </template>
      </div>

      <!-- 子ノート -->
      <div class="child-note">
        <draggable :list="note.children" item-key="id" group="notes" :animation="300" :delay="5">
          <template #item="{ element }">
            <note-item
              :note="element"
              :parentNote="note"
              :key="element.id"
              :layer="layer + 1"
              :selectedNote="selectedNote"
              @select="onClickNote"
              @delete="onClickDelete"
              @edit-name="onEditName"
              @add-child="onClickAddChild"
              @add-brother="onClickAddBrother"
            />
          </template>
        </draggable>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from "vuedraggable";
export default {
  name: "NoteItem",
  components: { draggable },
  props: ["note", "key", "parentNote", "layer", "selectedNote"],
  emits: ["select", "delete", "edit-name", "add-child", "add-brother"],
  data() {
    return {
      name: this.note.name,
      mouseOver: false,
      isEditing: false,
    };
  },
  computed: {
    // layerが3未満ならchildNote追加ボタンを表示
    shouldShowAddChild() {
      return this.layer < 3 ? true : false;
    },
    // ドラッグアイコンを表示
    mouseOverSwitchIcon() {
      return this.mouseOver ? "bars" : "file-alt";
    },
    isSelectedNote() {
      return this.note === this.selectedNote;
    },
  },
  methods: {
    onClickNote(note) {
      this.$emit("select", note);
    },
    // マウスオーバー
    onMouseOver() {
      this.mouseOver = true;
    },
    onMouseLeave() {
      this.mouseOver = false;
    },
    // 操作メニュー
    onClickDelete(parentNote, note) {
      this.$emit("delete", parentNote, note);
    },
    onClickEdit() {
      this.isEditing = true;
      this.$nextTick(() => {
        this.$refs.editBox.focus();
      });
    },
    onKeypressEnter() {
      this.$refs.editBox.blur();
    },
    onEditEnd(parentNote, note) {
      // 入力フォームを非表示に
      this.isEditing = false;
      // nameが空白なら元に戻す
      if (this.name.length === 0) this.name = this.note.name;
      // 編集後のnote
      const editedNote = {
        id: note.id,
        name: this.name,
        children: note.children,
      };
      this.$emit("edit-name", parentNote, note, editedNote);
    },
    onEditName(...args) {
      this.$emit("edit-name", ...args);
    },
    onClickAddChild(note) {
      this.$emit("add-child", note);
    },
    onClickAddBrother(parentNote, note) {
      this.$emit("add-brother", parentNote, note);
    },
  },
};
</script>
<style lang="scss">
.note {
  margin: 10px 0;
  display: flex;
  align-items: center;
  padding: 5px;
  color: rgba(25, 23, 17, 0.6);
  &.mouseover {
    background-color: rgb(232, 231, 228);
    cursor: pointer;
  }
  &.selected {
    color: black;
    background-color: rgb(232, 231, 228);
    font-weight: 600;
  }
  .note-icon {
    margin-left: 10px;
  }
  .note-name {
    width: 100%;
    padding: 3px 10px;
  }
  .buttons {
    display: flex;
    flex-direction: row;
    .button-icon {
      padding: 3px;
      margin-left: 3px;
      border-radius: 5px;
    }
  }
}
.child-note {
  padding-left: 30px;
}
</style>
