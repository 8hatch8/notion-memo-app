<template>
  <div class="widget-family">
    <!-- 親ウィジェット -->
    <div
      class="widget"
      @mouseover="onMouseOver"
      @mouseleave="onMouseLeave"
      :class="{ mouseover: mouseOver }"
    >
      <!-- 見出し -->
      <template v-if="widget.type === 'heading'">
        <input
          :value="widget.text"
          @input="onInputWidget($event.target.value, widget)"
          class="heading transparent"
          placeholder="見出し"
          :ref="'widget-heading-' + widget.id"
          @keypress.enter="onClickAddBrother(parentWidget, widget)"
          @keydown.tab="onKeyDownTab"
          @keydown.delete="onKeyDownDelete"
        />
      </template>
      <!-- リスト -->
      <template v-if="widget.type === 'list'">
        ・<input
          :value="widget.text"
          @input="onInputWidget($event.target.value, widget)"
          class="list transparent"
          placeholder="リスト"
          :ref="'widget-list-' + widget.id"
          @keypress.enter="onClickAddBrother(parentWidget, widget)"
          @keydown.tab="onKeyDownTab"
          @keydown.delete="onKeyDownDelete"
        />
      </template>
      <!-- コード -->
      <template v-if="widget.type === 'code'">
        <textarea
          :value="widget.text"
          @input="onInputWidget($event.target.value, widget)"
          rows="1"
          class="code transparent"
          placeholder="code"
          :ref="'widget-code-' + widget.id"
          @keydown.delete="onKeyDownDelete"
        ></textarea>
      </template>

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
        <div class="button-icon">
          <font-awesome-icon icon="cog" data-toggle="dropdown" />
          <div class="dropdown-menu">
            <a class="dropdown-item" @click.stop="onClickWidgetType('heading', widget)">見出し</a>
            <a class="dropdown-item" @click.stop="onClickWidgetType('list', widget)">リスト</a>
            <a class="dropdown-item" @click.stop="onClickWidgetType('code', widget)"
              >ソースコード</a
            >
          </div>
        </div>
      </div>
    </div>

    <!-- 子ウィジェット -->
    <div class="child-widget">
      <draggable
        v-bind:list="widget.children"
        item-key="id"
        :animation="300"
        :delay="0"
        group="widgets"
      >
        <template #item="{ element }">
          <WidgetItem
            :key="element.id"
            :widget="element"
            :parentWidget="widget"
            :layer="layer + 1"
            @input="onInputWidget"
            @delete="onClickDelete"
            @add-child="onClickAddChild"
            @add-brother="onClickAddBrother"
            @change-type="onClickWidgetType"
          />
        </template>
      </draggable>
    </div>
  </div>
</template>

<script>
import draggable from "vuedraggable";
export default {
  name: "WidgetItem",
  components: { draggable },
  props: ["widget", "parentWidget", "layer"],
  emits: ["input", "add-child", "add-brother", "delete", "change-type"],
  data() {
    return {
      mouseOver: false,
    };
  },
  methods: {
    // テキスト入力
    onInputWidget(text, widget) {
      this.$emit("input", text, widget);
    },
    onKeyDownTab(event) {
      if (this.widget.layer < 3) {
        this.$emit("add-child", this.widget);
        event.preventDefault();
      }
    },
    onKeyDownDelete(event) {
      if (this.widget.text.length === 0) {
        this.$emit("delete", this.parentWidget, this.widget);
        event.preventDefault();
      }
    },
    // ウィジェットタイプ変更
    onClickWidgetType(type, widget) {
      this.$emit("change-type", type, widget);
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
      this.$emit("add-child", widget);
    },
    onClickAddBrother(parentWidget, widget) {
      this.$emit("add-brother", parentWidget, widget);
    },
    onClickDelete(parentWidget, widget) {
      this.$emit("delete", parentWidget, widget);
    },
    // コードタイプのリサイズ
    resizeCodeTextarea() {
      if (this.widget.type !== "code") return;
      const textarea = this.$refs[`widget-code-${this.widget.id}`];
      const promise = new Promise((resolve) => {
        resolve((textarea.style.height = "auto"));
      });
      promise.then(() => {
        textarea.style.height = textarea.scrollHeight + "px";
      });
    },
    // 生成時にフォーカスをあてる
    focusWidget() {
      this.$nextTick(() => {
        const input = this.$refs[`widget-${this.widget.type}-${this.widget.id}`];
        input.focus();
      });
    },
  },
  mounted() {
    this.resizeCodeTextarea();
    this.focusWidget();
  },
  watch: {
    "widget.text"() {
      this.resizeCodeTextarea();
    },
    "widget.type"() {
      this.focusWidget();
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
  input.heading {
    font-size: 20px;
    font-weight: bold;
    border-bottom: 1.5px solid #e0e0e0;
  }
  input.list {
    font-size: 16px;
  }
  .code {
    width: calc(100% - 120px);
    height: 35px;
    padding: 5px 10px;
    border: none;
    border-radius: 8px;
    color: #f8f8f2;
    background: #282a36;
    font-size: 14px;
    font-family: Consolas, Menlo, "Liberation Mono", Courier, monospace;
    resize: none;
  }
  .code:focus {
    outline: none;
    -webkit-box-shadow: none;
    box-shadow: none;
  }
}
.child-widget {
  padding-left: 30px;
}
</style>
