/**
 * 返回用户可查看的 doc url
 */
module.exports = function docUrl(docName) {
  const repoUrl = 'https://github.com/raxjs/miniapp/tree/master/packages/eslint-plugin-rax-runtime-miniapp';
  return `${repoUrl}/docs/rules/${docName}.md`;
}