import 'components/Plugin/wangEditor/js/wangEditor';
// import 'components/Plugin/wangEditor/css/wangEditor.css';

const E = window.wangEditor;

class Editor {
  constructor(options = {}) {
    this.options = options;
    this.editor = null;
  }

  create(elem) {
    this.editor = new E(elem);
  }

  destory() {
    if (this.editor) {
      this.editor.destroy();
    }
  }

  $txt() {
    return this.editor ? this.editor.$txt : null;
  }
}

export default E;
