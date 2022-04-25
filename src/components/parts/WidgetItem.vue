<template>
  <div class="widget-family">
    <!-- 親ウィジェット -->
    <div
      class="widget"
      @mouseover="onMouseOver"
      @mouseleave="onMouseLeave"
      :class="{ mouseover: mouseOver }"
    >
      ・<input
        :value="widget.text"
        @input="onInputWidget($event.target.value, widget)"
        class="transparent"
        placeholder="本文"
      />
      <!-- 操作メニュー -->
      <div v-show="mouseOver" class="buttons">
        <!-- 子ウィジェット追加 -->
        <div class="button-icon" v-if="layer < 3" @click.stop="onClickAddChild(widget)">
          <font-awesome-icon icon="sitemap" />
        </div>
        <!-- 兄弟ウィジェット追加 -->
        <div class="button-icon" @click.stop="onClickAddBrother(parentWidget, widget)">
          <font-awesome-icon icon="plus-circle" />
        </div>
        <!-- ウィジェット削除 -->
        <div class="button-icon" @click.stop="onClickDelete(parentWidget, widget)">
          <font-awesome-icon icon="trash" />
        </div>
        <!-- コンフィグ -->
        <div class="button-icon" @click.stop="">
          <font-awesome-icon icon="cog" />
        </div>
      </div>
    </div>

    <!-- 子ウィジェット -->
    <div class="child-widget">
      <WidgetItem
        v-for="childWidget in widget.children"
        :key="childWidget.id"
        :widget="childWidget"
        :parentWidget="widget"
        :layer="layer + 1"
        @input="onInputWidget"
        @delete="onClickDelete"
        @add-child="onClickAddChild"
        @add-brother="onClickAddBrother"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "WidgetItem",
  props: ["widget", "parentWidget", "layer"],
  emits: ["input", "addChild", "addBrother", "delete"],
  data() {
    return {
      mouseOver: false,
    };
  },
  methods: {
    onInputWidget(text, widget) {
      this.$emit("input", text, widget);
    },
    // マウスオーバー
    onMouseOver() {
      this.mouseOver = true;
    },
    onMouseLeave() {
      this.mouseOver = false;
    },
    // 操作メニュー
    onClickAddChild(widget) {
      this.$emit("addChild", widget);
    },
    onClickAddBrother(parentWidget, widget) {
      this.$emit("addBrother", parentWidget, widget);
    },
    onClickDelete(parentWidget, widget) {
      this.$emit("delete", parentWidget, widget);
    },
  },
};
</script>

<style scoped lang="scss">
.widget {
  width: 100%;
  min-height: 40px;
  display: flex;
  align-items: center;
  padding: 5px 10px;
  color: rgba(25, 23, 17, 0.6);
  .buttons {
    display: flex;
    flex-direction: row;
    cursor: pointer;
    .button-icon {
      padding: 3px;
      margin-left: 3px;
      border-radius: 5px;
    }
  }
}
.child-widget {
  padding-left: 30px;
}
</style>
