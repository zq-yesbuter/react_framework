export const previewType = {
  mobile: 1 << 0,
  web: 1 << 1,
  audio: 1 << 2,
};

export const editorType = {
  rich: 1 << 0,
  normal: 1 << 1,
};

export const getTabLists = (tabs = {}) => {
  const lists = [
    {
      key: 'common',
      tab: '通用',
      preview: previewType.web | previewType.mobile,
      editor: editorType.rich,
    },
    { key: 'athena_web', tab: '机器人Web', preview: previewType.web, editor: editorType.rich },
    { key: 'athena_h5', tab: '机器人H5', preview: previewType.mobile, editor: editorType.rich },
    { key: 'jtalk_web', tab: 'Jtalk Web', preview: previewType.web, editor: editorType.rich },
    { key: 'jtalk_h5', tab: 'Jtalk H5', preview: previewType.mobile, editor: editorType.rich },
    { key: 'speech', tab: 'IVR 语音', preview: previewType.audio, editor: editorType.normal },
    { key: 'mobile_message', tab: '短信', preview: false, editor: editorType.normal },
  ];
  const tabKeys = Object.keys(tabs);

  if (tabKeys.length === 0) {
    return lists;
  } else {
    return lists.reduce((acc, cur) => {
      if (tabs[cur.key]) {
        acc.push({
          ...cur,
          tab: tabs[cur.key],
        });
      }
      return acc;
    }, []);
  }
};
