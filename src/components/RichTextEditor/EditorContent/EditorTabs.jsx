import React, { PureComponent, Fragment } from 'react';
import { Tabs } from 'antd';
import { getTabLists } from './setting';
import EditorContent from './index';

const TabPane = Tabs.TabPane;

export default class EditorTabs extends PureComponent {
  state = {
    activeKey: null,
    editorContent: {},
    tabLists: [],
  };

  componentDidMount() {
    this.handleSetActiveKey();
  }

  handleSetActiveKey = () => {
    const { tabs = {}, content = {} } = this.props;
    const tabLists = getTabLists(tabs);

    this.setState({
      activeKey: tabLists[0].key,
      editorContent: content,
      tabLists,
    });
  };

  render() {
    const {
      tabs = {},
      show = true,
      showPreview = true,
      content = {},
      onChange,
      onTabsChange,
      getTabsEditor,
      renderSlot = null,
    } = this.props;
    const { tabLists } = this.state;

    return show ? (
      <Fragment>
        {tabLists.length > 0 && (
          <Tabs
            animated={false}
            onChange={activeKey => {
              this.setState({ activeKey });
              if (onTabsChange && typeof onTabsChange === 'function') {
                onTabsChange(activeKey);
              }
            }}
          >
            {tabLists.map(({ key, tab, preview, editor }) => (
              <TabPane tab={tab} key={key}>
                <EditorContent
                  value={content[key] || ''}
                  preview={preview}
                  showPreview={showPreview}
                  showEditorType={editor}
                  type={key}
                  onChange={data => {
                    this.setState(
                      ({ editorContent }) => ({
                        editorContent: {
                          ...editorContent,
                          [key]: data,
                        },
                      }),
                      () => {
                        onChange({
                          ...this.state.editorContent,
                        });
                      }
                    );
                  }}
                  getEditor={editor => {
                    if (getTabsEditor && typeof getTabsEditor === 'function') {
                      getTabsEditor({ key, editor });
                    }
                  }}
                  slot={content => (renderSlot ? renderSlot({ key, content, preview }) : null)}
                />
              </TabPane>
            ))}
          </Tabs>
        )}
      </Fragment>
    ) : null;
  }
}
