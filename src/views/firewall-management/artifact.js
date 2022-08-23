import Ruleset from './ruleset'
export default function(opts){
  return {
    components: {
      Ruleset
    },
    template: opts.application?`<ruleset file-ext='${opts.fileExt}'
      application='${opts.application}'/>`:`<ruleset file-ext='${opts.fileExt}'
    />`
  }
}
