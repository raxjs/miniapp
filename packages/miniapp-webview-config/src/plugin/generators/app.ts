import addFileToCompilation from '../utils/addFileToCompilation';

export function generateAppJS(
  compilation,
  {
    target,
    command
  }
) {
  const content = 'App({})';
  addFileToCompilation(compilation, {
    filename: 'app.js',
    content,
    target,
    command
  });
}