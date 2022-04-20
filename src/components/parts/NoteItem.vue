<template>
  <div>
    <div
      class="note"
      :class="{ mouseover: mouseOver }"
      @mouseover="onMouseOver"
      @mouseleave="onMouseLeave"
    >
      <!-- eslint-disable-next-line -->
      <div class="note-icon"><font-awesome-icon icon="file-alt" /></div>
      <div class="note-name">{{ note.name }}</div>
      <!-- 操作メニュー -->
      <div class="buttons">
        <div class="button-icon">
          <font-awesome-icon icon="sitemap" />
        </div>
        <div class="button-icon">
          <font-awesome-icon icon="plus-circle" />
        </div>
        <div class="button-icon">
          <font-awesome-icon icon="edit" />
        </div>
        <div class="button-icon" @click="onClickDelete(note)">
          <font-awesome-icon icon="trash" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "NoteItem",
  props: ["note"],
  emits: ["delete"],
  data() {
    return {
      mouseOver: false,
    };
  },
  methods: {
    onMouseOver() {
      this.mouseOver = true;
    },
    onMouseLeave() {
      this.mouseOver = false;
    },
    onClickDelete(note) {
      this.$emit("delete", note);
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
</style>
