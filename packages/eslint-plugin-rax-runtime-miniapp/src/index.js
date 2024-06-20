/**
 * @fileoverview rax 运行时 eslint 插件
 * @author chenrongyan
 */
"use strict";

const requireIndex = require("requireindex");

// import all rules in src/rules
module.exports.rules = requireIndex(__dirname + "/rules");
