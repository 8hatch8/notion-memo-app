<template>
  <div>
    <div
      class="note"
      :class="{ mouseover: mouseOver }"
      @mouseover="onMouseOver"
      @mouseleave="onMouseLeave"
    >
      <!-- eslint-disable-next-line -->
      <div class="note-icon"><font-awesome-icon class="file-alt"></font-awesome-icon></div>
      <div class="note-name">{{ note.name }}</div>
    </div>
  </div>
</template>
<script>
export default {
  name: "NoteItem",
  props: ["note"],
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
}
</style>
