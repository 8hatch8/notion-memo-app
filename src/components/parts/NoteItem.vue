<template>
  <div>
    <div class="note-family">
      <!-- 親ノート -->
      <div
        class="note"
        :class="{ mouseover: mouseOver && !isEditing }"
        @mouseover="onMouseOver"
        @mouseleave="onMouseLeave"
      >
        <!-- name編集フォーム -->
        <template v-if="isEditing">
          <input
            v-model="name"
            ref="editBox"
            class="transparent"
            @keypress.enter="onEditEnd(parentNote, note)"
            @blur="onEditEnd(parentNote, note)"
          />
        </template>

        <template v-else>
          <!-- eslint-disable-next-line -->
          <div class="note-icon"><font-awesome-icon icon="file-alt" /></div>
          <div class="note-name">{{ name }}</div>
          <!-- 操作メニュー -->
          <div class="buttons">
            <div class="button-icon" @click="onClickAddChild(note)">
              <font-awesome-icon icon="sitemap" />
            </div>
            <div class="button-icon">
              <font-awesome-icon icon="plus-circle" />
            </div>
            <div class="button-icon" @click="onClickEdit">
              <font-awesome-icon icon="edit" />
            </div>
            <div class="button-icon" @click="onClickDelete(parentNote, note)">
              <font-awesome-icon icon="trash" />
            </div>
          </div>
        </template>
      </div>

      <!-- 子ノート -->
      <div class="child-note">
        <note-item
          v-for="childNote in note.children"
          :note="childNote"
          :parentNote="note"
          :key="childNote.id"
          @delete="onClickDelete"
          @edit-end="onEditEnd"
          @add-child="onClickAddChild"
        />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "NoteItem",
  props: ["note", "key", "parentNote"],
  emits: ["delete", "edit-end", "add-child"],
  data() {
    return {
      name: this.note.name, // ToDo:初期値を直接わたしてOKか？確認
      mouseOver: false,
      isEditing: false,
    };
  },
  methods: {
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
    onEditEnd(parentNote, note) {
      this.isEditing = false;

      const editedNote = {
        id: note.id,
        name: this.name,
        children: note.children,
      };

      this.$emit("edit-end", parentNote, note, editedNote);
    },
    onClickAddChild(note) {
      this.$emit("add-child", note);
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
  padding-left: 10px;
}
</style>
