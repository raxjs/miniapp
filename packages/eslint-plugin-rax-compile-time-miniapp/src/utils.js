module.exports = {
  findAncestor,
  baseComponents: [
    'rax-scrollview',
    'rax-recyclerview',
    'rax-textinput',
    'rax-picture',
    'rax-slider',
    'rax-icon',
    'rax-link',
    'rax-video',
    'rax-image',
    'rax-modal',
    'rax-countdown',
    'rax-view',
    'rax-text'
  ],
  docUrl,
};

/**
 * 从当前节点的父节点开始往上追溯是否存在符合 finder 规则的父节点
 * @param node {object} - ast 节点
 * @param finder {function} - 匹配函数
 */
function findAncestor(node, finder) {
  const { parent } = node;
  if (!parent) {
    return null;
  }
  const isFind = finder(parent);

  return isFind ? parent : findAncestor(parent, finder);
}

/**
 * 返回用户可查看的 doc url
 */
function docUrl(docName) {
  const repoUrl = 'https://github.com/raxjs/miniapp/tree/master/packages/eslint-plugin-rax-compile-time-miniapp';
  return `${repoUrl}/docs/rules/${docName}.md`;
}