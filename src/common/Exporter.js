import elTableExport from "el-table-export";

export default {
  methods: {
    exportCSV (elTable, fileName) {
      elTableExport(elTable, {
        fileName,
        type: 'csv'
      }).then(result => {
        console.log(result);
      }).catch(e => {
        console.error(e);
      });
    },

    exportXLS(elTable, fileName) {
      elTableExport(elTable, {
        fileName,
        type: 'xls'
      }).then(result => {
        console.log(result);
      }).catch(e => {
        console.error(e);
      });
    },
  },
}
