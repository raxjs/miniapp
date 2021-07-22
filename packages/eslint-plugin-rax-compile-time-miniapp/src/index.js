'use strict';

module.exports = {
  rules: {
    'no-sperad-operator': require('./rules/no_spread_operator'),
    'no-return-array-jsx-elements': require('./rules/no_return_arrays'),
    'no-hoc': require('./rules/no_hoc'),
    'no-id-in-jsx': require('./rules/no_id_in_jsx'),
    'no-multiple-component': require('./rules/no_multiple_component'),
    'no-multilevel-object': require('./rules/no_multilevel_object'),
    'event-should-be-last': require('./rules/event_should_be_last'),
    'no-import-next-export': require('./rules/no_import_next_export'),
    'no-multiple-return': require('./rules/no_multiple_return'),
    'export-default-component': require('./rules/export_default_component'),
    'no-temp-variable-in-loop-render': require('./rules/no_temp_variable_in_loop_render'),
    'return-jsx-in-map': require('./rules/return_jsx_in_map'),
    'no-multilevel-condition': require('./rules/no_multilevel_condition'),
    'no-children-handler': require('./rules/no_children_handler'),
    'no-import-as': require('./rules/no_import_as'),

    /**
      Below is supported:
    'handler-start-with-on': require('./rules/handler_start_with_on'),
    'no-double-quotation': require('./rules/no_double_quotation'),
     */
  },
  configs: {
    recommended: {
      rules: {
        'rax-compile-time-miniapp/no-sperad-operator': 2,
        'rax-compile-time-miniapp/no-return-array-jsx-elements': 2,
        'rax-compile-time-miniapp/no-hoc': 2,
        'rax-compile-time-miniapp/event-should-be-last': 2,
        'rax-compile-time-miniapp/no-multiple-component': 2,
        'rax-compile-time-miniapp/no-import-next-export': 2,
        'rax-compile-time-miniapp/no-multilevel-object': 2,
        'rax-compile-time-miniapp/no-multiple-return': 2,
        'rax-compile-time-miniapp/export-default-component': 2,
        'rax-compile-time-miniapp/no-id-in-jsx': 1,
        'rax-compile-time-miniapp/return-jsx-in-map': 2,
        'rax-compile-time-miniapp/no-multilevel-condition': 2,
        'rax-compile-time-miniapp/no-temp-variable-in-loop-render': 2,
        'rax-compile-time-miniapp/no-children-handler': 2,
        'rax-compile-time-miniapp/no-import-as': 2,
        // 'rax-compile-time-miniapp/no-double-quotation': 1,
        // 'rax-compile-time-miniapp/handler-start-with-on': 2,
      },
    },
  },
};
